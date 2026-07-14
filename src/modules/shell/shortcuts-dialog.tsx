"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const shortcuts = [
  { keys: "Ctrl+B", description: "Bold" },
  { keys: "Ctrl+I", description: "Italic" },
  { keys: "Ctrl+U", description: "Underline" },
  { keys: "Ctrl+Shift+1", description: "Heading 1" },
  { keys: "Ctrl+Shift+2", description: "Heading 2" },
  { keys: "Ctrl+Shift+3", description: "Heading 3" },
  { keys: "Ctrl+Shift+8", description: "Bullet List" },
  { keys: "Ctrl+Shift+7", description: "Numbered List" },
  { keys: "?", description: "Show shortcuts" },
];

export function ShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger when not inside an input/editor
      const target = e.target as HTMLElement;
      const isEditable =
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      if (e.key === "?" && !isEditable) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          {shortcuts.map((s) => (
            <div
              key={s.keys}
              className="flex items-center justify-between py-1.5 text-sm"
            >
              <span className="text-muted-foreground">{s.description}</span>
              <kbd className="px-2 py-0.5 rounded bg-muted text-xs font-mono">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
