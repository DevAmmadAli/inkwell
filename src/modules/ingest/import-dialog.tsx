"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ACCEPTED = ".txt,.md,.docx";

interface ImportDialogProps {
  noteId: string;
  authorId: string;
  onImported: () => void;
}

export function ImportDialog({
  noteId,
  authorId,
  onImported,
}: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["txt", "md", "docx"].includes(ext ?? "")) {
      toast.error("Unsupported file type. Allowed: .txt, .md, .docx");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size: 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    try {
      // Upload file to create a temp note to get parsed content
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("authorId", authorId);

      const uploadRes = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || "Import failed");
      }

      const tempNote = await uploadRes.json();

      // Copy content to the current note
      const patchRes = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: tempNote.body }),
      });

      if (!patchRes.ok) throw new Error("Failed to update note");

      // Delete the temp note
      await fetch(`/api/notes/${tempNote.id}`, { method: "DELETE" });

      toast.success(`Content imported from "${selectedFile.name}"`);
      setOpen(false);
      setSelectedFile(null);
      onImported();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        <FileDown className="h-4 w-4 mr-1" />
        Import
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import content from file</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Replace the current note content with the contents of an
            uploaded file. Supported: <strong>.txt</strong>,{" "}
            <strong>.md</strong>, <strong>.docx</strong>
          </p>

          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileUp className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <FileDown className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to select a file
                </p>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importing}
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                "Import Content"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
