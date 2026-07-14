"use client";

import type { Editor } from "@tiptap/react";

interface WordCountProps {
  editor: Editor | null;
}

export function WordCount({ editor }: WordCountProps) {
  if (!editor) return null;

  const text = editor.getText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="absolute bottom-3 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded">
      {words} {words === 1 ? "word" : "words"}
    </div>
  );
}
