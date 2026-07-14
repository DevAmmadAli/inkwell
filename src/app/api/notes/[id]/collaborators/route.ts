import { prisma } from "@/shared/lib/prisma";
import { addCollaboratorSchema } from "@/shared/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = addCollaboratorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  // Verify note exists
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  // Can't add the author as a collaborator
  if (parsed.data.authorId === note.authorId) {
    return NextResponse.json(
      { error: "Cannot add the note author as a collaborator" },
      { status: 400 }
    );
  }

  const collaborator = await prisma.collaborator.upsert({
    where: {
      noteId_authorId: {
        noteId: id,
        authorId: parsed.data.authorId,
      },
    },
    update: { accessLevel: parsed.data.accessLevel ?? "writer" },
    create: {
      noteId: id,
      authorId: parsed.data.authorId,
      accessLevel: parsed.data.accessLevel ?? "writer",
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(collaborator, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { authorId } = await request.json();

  if (!authorId) {
    return NextResponse.json(
      { error: "authorId is required" },
      { status: 400 }
    );
  }

  await prisma.collaborator.deleteMany({
    where: { noteId: id, authorId },
  });

  return NextResponse.json({ success: true });
}
