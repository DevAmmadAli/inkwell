import { prisma } from "@/shared/lib/prisma";
import { type Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

const ALLOWED_TYPES = [
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function textToTipTapJson(text: string) {
  const lines = text.split("\n");
  const content: Record<string, unknown>[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      content.push({ type: "paragraph" });
    } else {
      content.push({
        type: "paragraph",
        content: [{ type: "text", text: line }],
      });
    }
  }

  return { type: "doc", content };
}

function markdownToTipTapJson(text: string) {
  const lines = text.split("\n");
  const content: Record<string, unknown>[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      content.push({ type: "paragraph" });
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      content.push({
        type: "heading",
        attrs: { level },
        content: [{ type: "text", text: headingMatch[2] }],
      });
      continue;
    }

    // Bullet list items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      content.push({
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: trimmed.slice(2) }],
              },
            ],
          },
        ],
      });
      continue;
    }

    // Numbered list items
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      content.push({
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: numberedMatch[1] }],
              },
            ],
          },
        ],
      });
      continue;
    }

    // Regular paragraph
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: trimmed }],
    });
  }

  return { type: "doc", content };
}

function htmlToTipTapJson(html: string) {
  const content: Record<string, unknown>[] = [];

  const blocks = html.split(/<\/(?:p|h[1-6]|li|ul|ol)>/gi);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/<h([1-3])[^>]*>(.*)/i);
    if (headingMatch) {
      const text = headingMatch[2].replace(/<[^>]*>/g, "").trim();
      if (text) {
        content.push({
          type: "heading",
          attrs: { level: parseInt(headingMatch[1]) },
          content: [{ type: "text", text }],
        });
      }
      continue;
    }

    const pMatch = trimmed.match(/<p[^>]*>(.*)/i);
    if (pMatch) {
      const text = pMatch[1].replace(/<[^>]*>/g, "").trim();
      if (text) {
        content.push({
          type: "paragraph",
          content: [{ type: "text", text }],
        });
      } else {
        content.push({ type: "paragraph" });
      }
      continue;
    }

    const plainText = trimmed.replace(/<[^>]*>/g, "").trim();
    if (plainText) {
      content.push({
        type: "paragraph",
        content: [{ type: "text", text: plainText }],
      });
    }
  }

  if (content.length === 0) {
    content.push({ type: "paragraph" });
  }

  return { type: "doc", content };
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const authorId = formData.get("authorId") as string | null;

  if (!file || !authorId) {
    return NextResponse.json(
      { error: "file and authorId are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith(".md")) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: .txt, .md, .docx" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size: 5MB" },
      { status: 400 }
    );
  }

  let tiptapContent: Record<string, unknown>;
  const fileName = file.name.replace(/\.[^/.]+$/, "");

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.convertToHtml({ buffer });
    tiptapContent = htmlToTipTapJson(result.value);
  } else if (file.name.endsWith(".md") || file.type === "text/markdown") {
    const text = await file.text();
    tiptapContent = markdownToTipTapJson(text);
  } else {
    const text = await file.text();
    tiptapContent = textToTipTapJson(text);
  }

  const note = await prisma.note.create({
    data: {
      heading: fileName,
      body: tiptapContent as unknown as Prisma.InputJsonValue,
      authorId,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(note, { status: 201 });
}
