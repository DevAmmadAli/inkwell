import { prisma } from "@/shared/lib/prisma";
import { updateNoteSchema } from "@/shared/lib/validators";
import { type Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true } },
      collaborators: {
        include: { author: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const data: Prisma.NoteUpdateInput = {};
  if (parsed.data.heading !== undefined) data.heading = parsed.data.heading;
  if (parsed.data.body !== undefined) data.body = parsed.data.body as Prisma.InputJsonValue;

  const note = await prisma.note.update({
    where: { id },
    data,
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(note);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.note.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
