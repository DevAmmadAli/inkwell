export type AccessLevel = "reader" | "writer";

export interface AuthorInfo {
  id: string;
  name: string;
  email: string;
}

export interface NoteInfo {
  id: string;
  heading: string;
  body: unknown;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: AuthorInfo;
  collaborators?: CollaboratorInfo[];
}

export interface CollaboratorInfo {
  id: string;
  noteId: string;
  authorId: string;
  accessLevel: AccessLevel;
  author: AuthorInfo;
}
