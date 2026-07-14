"use client";

import { useState, useMemo } from "react";
import { useCurrentAuthor } from "@/shared/hooks/use-current-author";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { emit, NOTES_CHANGED } from "@/shared/lib/events";
import type { CollaboratorInfo, AccessLevel } from "@/shared/types";

interface CollabDialogProps {
  noteId: string;
  authorId: string;
  collaborators: CollaboratorInfo[];
  onCollaboratorsChange: () => void;
}

export function CollabDialog({
  noteId,
  authorId,
  collaborators,
  onCollaboratorsChange,
}: CollabDialogProps) {
  const { authors, currentAuthor } = useCurrentAuthor();
  const [open, setOpen] = useState(false);
  const [addingAuthorId, setAddingAuthorId] = useState<string | null>(null);
  const [removingAuthorId, setRemovingAuthorId] = useState<string | null>(null);

  const availableAuthors = useMemo(() => {
    const collabAuthorIds = new Set(collaborators.map((c) => c.authorId));
    return authors.filter((a) => a.id !== authorId && !collabAuthorIds.has(a.id));
  }, [authors, authorId, collaborators]);

  const isOwner = currentAuthor?.id === authorId;

  const addCollaborator = async (targetAuthorId: string, accessLevel: AccessLevel = "writer") => {
    setAddingAuthorId(targetAuthorId);
    try {
      const res = await fetch(`/api/notes/${noteId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: targetAuthorId, accessLevel }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add collaborator");
      }
      toast.success("Collaborator added");
      emit(NOTES_CHANGED);
      onCollaboratorsChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add collaborator");
    } finally {
      setAddingAuthorId(null);
    }
  };

  const updateAccessLevel = async (targetAuthorId: string, accessLevel: AccessLevel) => {
    try {
      const res = await fetch(`/api/notes/${noteId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: targetAuthorId, accessLevel }),
      });
      if (!res.ok) throw new Error();
      toast.success("Access level updated");
      onCollaboratorsChange();
    } catch {
      toast.error("Failed to update access level");
    }
  };

  const removeCollaborator = async (targetAuthorId: string) => {
    setRemovingAuthorId(targetAuthorId);
    try {
      const res = await fetch(`/api/notes/${noteId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: targetAuthorId }),
      });
      if (!res.ok) throw new Error();
      toast.success("Access removed");
      emit(NOTES_CHANGED);
      onCollaboratorsChange();
    } catch {
      toast.error("Failed to remove access");
    } finally {
      setRemovingAuthorId(null);
    }
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Users className="h-4 w-4 mr-1" />
        Collaborate
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Collaborators</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              People with access
            </p>

            {/* Owner */}
            <div className="flex items-center gap-3 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {initials(
                    authors.find((a) => a.id === authorId)?.name ?? "?"
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {authors.find((a) => a.id === authorId)?.name ?? "Unknown"}
                </p>
              </div>
              <Badge variant="secondary">Author</Badge>
            </div>

            {/* Collaborators */}
            {collaborators.map((collab) => (
              <div key={collab.id} className="flex items-center gap-3 py-1.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {initials(collab.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {collab.author.name}
                  </p>
                </div>
                {isOwner ? (
                  <select
                    value={collab.accessLevel}
                    onChange={(e) =>
                      updateAccessLevel(
                        collab.authorId,
                        e.target.value as AccessLevel
                      )
                    }
                    className="text-xs border rounded px-2 py-1 bg-background"
                  >
                    <option value="writer">Can write</option>
                    <option value="reader">Can read</option>
                  </select>
                ) : (
                  <Badge variant="outline">
                    {collab.accessLevel === "writer" ? "Can write" : "Can read"}
                  </Badge>
                )}
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeCollaborator(collab.authorId)}
                    disabled={removingAuthorId === collab.authorId}
                  >
                    {removingAuthorId === collab.authorId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add people */}
          {isOwner && availableAuthors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Add collaborators
              </p>
              {availableAuthors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center gap-3 py-1.5"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {initials(author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{author.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {author.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCollaborator(author.id)}
                    disabled={addingAuthorId === author.id}
                  >
                    {addingAuthorId === author.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {isOwner && availableAuthors.length === 0 && collaborators.length > 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Shared with all authors
            </p>
          )}

          {!isOwner && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Only the note author can manage collaborators
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
