import { z } from "zod/v4";

export const createNoteSchema = z.object({
  heading: z.string().min(1).max(255).optional(),
  body: z.unknown().optional(),
  authorId: z.string().min(1),
});

export const updateNoteSchema = z.object({
  heading: z.string().min(1).max(255).optional(),
  body: z.unknown().optional(),
});

export const addCollaboratorSchema = z.object({
  authorId: z.string().min(1),
  accessLevel: z.enum(["reader", "writer"]).optional(),
});
