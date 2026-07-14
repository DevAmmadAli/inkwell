"use client";

import { useEffect, useState, useCallback } from "react";
import { useCurrentAuthor } from "@/shared/hooks/use-current-author";
import { on, NOTES_CHANGED } from "@/shared/lib/events";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import type { NoteInfo } from "@/shared/types";
import { PenTool, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export function NoteList() {
  const { currentAuthor } = useCurrentAuthor();
  const [owned, setOwned] = useState<NoteInfo[]>([]);
  const [shared, setShared] = useState<NoteInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const activeId = params?.id as string | undefined;

  const fetchNotes = useCallback(async () => {
    if (!currentAuthor) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?authorId=${currentAuthor.id}`);
      const data = await res.json();
      setOwned(data.owned ?? []);
      setShared(data.shared ?? []);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [currentAuthor]);

  // Initial load
  useEffect(() => {
    if (!currentAuthor) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notes?authorId=${currentAuthor.id}`);
        const data = await res.json();
        if (!cancelled) {
          setOwned(data.owned ?? []);
          setShared(data.shared ?? []);
        }
      } catch {
        if (!cancelled) toast.error("Failed to load notes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentAuthor]);

  // Listen for note changes
  useEffect(() => {
    return on(NOTES_CHANGED, () => {
      fetchNotes();
    });
  }, [fetchNotes]);

  const createNote = async () => {
    if (!currentAuthor) return;
    setCreating(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: currentAuthor.id }),
      });
      const note = await res.json();
      toast.success("Note created");
      await fetchNotes();
      router.push(`/notes/${note.id}`);
    } catch {
      toast.error("Failed to create note");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setDeleteTarget(noteId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/notes/${deleteTarget}`, { method: "DELETE" });
      toast.success("Note deleted");
      if (activeId === deleteTarget) router.push("/");
      await fetchNotes();
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const deleteTargetHeading = owned.find((d) => d.id === deleteTarget)?.heading ?? "this note";

  return (
    <>
      <div className="flex flex-col gap-1">
        <Button
          onClick={createNote}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 mb-2"
          disabled={creating}
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Note
        </Button>

        {loading && owned.length === 0 && shared.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && owned.length === 0 && shared.length === 0 && (
          <div className="text-center py-8 px-2">
            <PenTool className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No notes yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create one or upload a file to get started
            </p>
          </div>
        )}

        {owned.length > 0 && (
          <>
            <p className="text-xs font-medium text-muted-foreground px-2 pt-2 uppercase tracking-wider">
              My Notes
            </p>
            {owned.map((note) => (
              <button
                key={note.id}
                onClick={() => router.push(`/notes/${note.id}`)}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent group w-full transition-colors ${
                  activeId === note.id ? "bg-accent font-medium" : ""
                }`}
              >
                <PenTool className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate flex-1">{note.heading}</span>
                <Trash2
                  className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0 transition-opacity"
                  onClick={(e) => handleDeleteClick(e, note.id)}
                />
              </button>
            ))}
          </>
        )}

        {shared.length > 0 && (
          <>
            <p className="text-xs font-medium text-muted-foreground px-2 pt-4 uppercase tracking-wider">
              Shared with me
            </p>
            {shared.map((note) => (
              <button
                key={note.id}
                onClick={() => router.push(`/notes/${note.id}`)}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent w-full transition-colors ${
                  activeId === note.id ? "bg-accent font-medium" : ""
                }`}
              >
                <PenTool className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate flex-1">{note.heading}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {note.author.name}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Note"
        description={`Are you sure you want to delete "${deleteTargetHeading}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
