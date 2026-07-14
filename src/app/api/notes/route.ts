import { prisma } from "@/shared/lib/prisma";
import { createNoteSchema } from "@/shared/lib/validators";
import { type Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authorId = request.nextUrl.searchParams.get("authorId");

  if (!authorId) {
    return NextResponse.json(
      { error: "authorId is required" },
      { status: 400 }
    );
  }

  const [owned, shared] = await Promise.all([
    prisma.note.findMany({
      where: { authorId },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.note.findMany({
      where: {
        collaborators: { some: { authorId } },
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        collaborators: {
          where: { authorId },
          include: { author: { select: { id: true, name: true, email: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return NextResponse.json({ owned, shared });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: {
      heading: parsed.data.heading ?? "Untitled Note",
      body: (parsed.data.body ?? {}) as Prisma.InputJsonValue,
      authorId: parsed.data.authorId,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(note, { status: 201 });
}
