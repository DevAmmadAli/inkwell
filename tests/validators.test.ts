import { describe, it, expect } from "vitest";
import {
  createNoteSchema,
  updateNoteSchema,
  addCollaboratorSchema,
} from "@/shared/lib/validators";

describe("createNoteSchema", () => {
  it("validates a valid note creation payload", () => {
    const result = createNoteSchema.safeParse({
      authorId: "author_123",
      heading: "My Note",
    });
    expect(result.success).toBe(true);
  });

  it("requires authorId", () => {
    const result = createNoteSchema.safeParse({
      heading: "My Note",
    });
    expect(result.success).toBe(false);
  });

  it("allows missing heading (optional)", () => {
    const result = createNoteSchema.safeParse({
      authorId: "author_123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty authorId", () => {
    const result = createNoteSchema.safeParse({
      authorId: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects heading exceeding 255 characters", () => {
    const result = createNoteSchema.safeParse({
      authorId: "author_123",
      heading: "a".repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it("accepts body as JSON", () => {
    const result = createNoteSchema.safeParse({
      authorId: "author_123",
      body: { type: "doc", content: [] },
    });
    expect(result.success).toBe(true);
  });
});

describe("updateNoteSchema", () => {
  it("validates heading update", () => {
    const result = updateNoteSchema.safeParse({
      heading: "Updated Heading",
    });
    expect(result.success).toBe(true);
  });

  it("validates body update", () => {
    const result = updateNoteSchema.safeParse({
      body: { type: "doc", content: [{ type: "paragraph" }] },
    });
    expect(result.success).toBe(true);
  });

  it("validates empty update (both optional)", () => {
    const result = updateNoteSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects empty heading string", () => {
    const result = updateNoteSchema.safeParse({
      heading: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("addCollaboratorSchema", () => {
  it("validates adding with writer access", () => {
    const result = addCollaboratorSchema.safeParse({
      authorId: "author_456",
      accessLevel: "writer",
    });
    expect(result.success).toBe(true);
  });

  it("validates adding with reader access", () => {
    const result = addCollaboratorSchema.safeParse({
      authorId: "author_456",
      accessLevel: "reader",
    });
    expect(result.success).toBe(true);
  });

  it("allows missing accessLevel (defaults to writer)", () => {
    const result = addCollaboratorSchema.safeParse({
      authorId: "author_456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid accessLevel", () => {
    const result = addCollaboratorSchema.safeParse({
      authorId: "author_456",
      accessLevel: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("requires authorId", () => {
    const result = addCollaboratorSchema.safeParse({
      accessLevel: "writer",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty authorId", () => {
    const result = addCollaboratorSchema.safeParse({
      authorId: "",
      accessLevel: "writer",
    });
    expect(result.success).toBe(false);
  });
});
