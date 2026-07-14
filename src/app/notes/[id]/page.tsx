"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { TopNav } from "@/modules/shell/top-nav";
import { NoteEditor } from "@/modules/editor/editor";
import { CollabDialog } from "@/modules/collaboration/collab-dialog";
import { ImportDialog } from "@/modules/ingest/import-dialog";
import type { NoteInfo } from "@/shared/types";
import { toast } from "sonner";
import { emit, NOTES_CHANGED } from "@/shared/lib/events";
import { Check, Loader2 } from "lucide-react";
import { useCurrentAuthor } from "@/shared/hooks/use-current-author";
import { ShortcutsDialog } from "@/modules/shell/shortcuts-dialog";
import { timeAgo } from "@/shared/lib/time-ago";

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  const { currentAuthor } = useCurrentAuthor();
  const [note, setNote] = useState<NoteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchNote = useCallback(async () => {
    try {
      const res = await fetch(`/api/notes/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNote(data);
      setHeading(data.heading);
    } catch {
      toast.error("Failed to load note");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setNote(data);
          setHeading(data.heading);
        }
      } catch {
        if (!cancelled) toast.error("Failed to load note");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Determine access level for current author
  const accessLevel = (() => {
    if (!note || !currentAuthor) return "reader";
    if (note.authorId === currentAuthor.id) return "writer";
    const collab = note.collaborators?.find((c) => c.authorId === currentAuthor.id);
    return collab?.accessLevel ?? "reader";
  })();

  const canWrite = accessLevel === "writer";

  const saveNote = useCallback(
    async (updates: { heading?: string; body?: unknown }) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error();
        if (updates.heading) emit(NOTES_CHANGED);
      } catch {
        toast.error("Failed to save");
      } finally {
        setSaving(false);
      }
    },
    [id]
  );

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canWrite) return;
    const newHeading = e.target.value;
    setHeading(newHeading);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      if (newHeading.trim()) saveNote({ heading: newHeading });
    }, 500);
  };

  const handleContentSave = useCallback(
    (body: unknown) => {
      saveNote({ body });
    },
    [saveNote]
  );

  const handleImported = useCallback(async () => {
    await fetchNote();
    setEditorKey((k) => k + 1);
  }, [fetchNote]);

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !note ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Note not found</p>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 px-6 py-3 border-b">
              <input
                value={heading}
                onChange={handleHeadingChange}
                readOnly={!canWrite}
                className={`text-lg font-medium bg-transparent outline-none flex-1 min-w-0 ${
                  !canWrite ? "cursor-default" : ""
                }`}
                placeholder="Untitled Note"
              />
              <span className="text-xs text-muted-foreground shrink-0">
                {timeAgo(note.updatedAt)}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                {!canWrite ? (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    Read only
                  </span>
                ) : saving ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Saved
                  </span>
                )}
              </div>
              {canWrite && (
                <ImportDialog
                  noteId={note.id}
                  authorId={note.authorId}
                  onImported={handleImported}
                />
              )}
              <CollabDialog
                noteId={note.id}
                authorId={note.authorId}
                collaborators={note.collaborators ?? []}
                onCollaboratorsChange={fetchNote}
              />
            </header>
            <NoteEditor
              key={editorKey}
              content={note.body}
              onSave={handleContentSave}
              editable={canWrite}
            />
          </>
        )}
      </main>
      <ShortcutsDialog />
    </div>
  );
}
