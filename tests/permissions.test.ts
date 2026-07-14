import { describe, it, expect } from "vitest";

// Test the access level logic used in the note page
function getAccessLevel(
  authorId: string,
  currentAuthorId: string,
  collaborators: Array<{ authorId: string; accessLevel: string }>
): string {
  if (authorId === currentAuthorId) return "writer";
  const collab = collaborators.find((c) => c.authorId === currentAuthorId);
  return collab?.accessLevel ?? "reader";
}

describe("Note access levels", () => {
  const authorId = "author_1";

  it("author always has writer access", () => {
    expect(getAccessLevel(authorId, authorId, [])).toBe("writer");
  });

  it("collaborator with writer access can write", () => {
    const collaborators = [{ authorId: "author_2", accessLevel: "writer" }];
    expect(getAccessLevel(authorId, "author_2", collaborators)).toBe("writer");
  });

  it("collaborator with reader access can only read", () => {
    const collaborators = [{ authorId: "author_2", accessLevel: "reader" }];
    expect(getAccessLevel(authorId, "author_2", collaborators)).toBe("reader");
  });

  it("non-collaborator defaults to reader", () => {
    const collaborators = [{ authorId: "author_2", accessLevel: "writer" }];
    expect(getAccessLevel(authorId, "author_3", collaborators)).toBe("reader");
  });

  it("author with no collaborators — other defaults to reader", () => {
    expect(getAccessLevel(authorId, "author_2", [])).toBe("reader");
  });

  it("author retains writer even if listed as collaborator", () => {
    const collaborators = [{ authorId: authorId, accessLevel: "reader" }];
    expect(getAccessLevel(authorId, authorId, collaborators)).toBe("writer");
  });
});
