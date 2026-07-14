"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/modules/shell/top-nav";
import { useCurrentAuthor } from "@/shared/hooks/use-current-author";
import { emit, NOTES_CHANGED } from "@/shared/lib/events";
import { Button } from "@/components/ui/button";
import { PenTool, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { currentAuthor } = useCurrentAuthor();
  const router = useRouter();
  const [creating, setCreating] = useState(false);

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
      emit(NOTES_CHANGED);
      router.push(`/notes/${note.id}`);
    } catch {
      toast.error("Failed to create note");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <main className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center text-muted-foreground max-w-sm space-y-6">
          <PenTool className="h-12 w-12 mx-auto text-primary/40" />
          <div>
            <h2 className="text-xl font-medium mb-2 text-foreground">
              Welcome to InkWell
            </h2>
            <p className="text-sm leading-relaxed">
              A collaborative note-taking workspace. Create a new note or open
              your existing notes from the top bar.
            </p>
          </div>
          <Button
            size="lg"
            onClick={createNote}
            disabled={creating || !currentAuthor}
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create New Note
          </Button>
        </div>
      </main>
    </div>
  );
}
