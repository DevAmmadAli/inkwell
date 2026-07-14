"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import { BubbleToolbar } from "./bubble-toolbar";
import { WordCount } from "./word-count";
import { useRef, useEffect } from "react";

function isEmptyContent(content: unknown): boolean {
  if (!content) return true;
  if (typeof content !== "object") return true;
  const obj = content as Record<string, unknown>;
  if (!obj.type) return true;
  return false;
}

interface NoteEditorProps {
  content: unknown;
  onSave: (content: unknown) => void;
  editable?: boolean;
}

export function NoteEditor({ content, onSave, editable = true }: NoteEditorProps) {
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      UnderlineExtension,
    ],
    content: isEmptyContent(content) ? undefined : (content as Record<string, unknown>),
    editable,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[500px] px-8 py-6",
      },
    },
    onUpdate: ({ editor: e }) => {
      if (!editable) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        onSaveRef.current(e.getJSON());
      }, 800);
    },
  });

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        <EditorContent editor={editor} />
        <WordCount editor={editor} />
      </div>
      {editable && <BubbleToolbar editor={editor} />}
    </div>
  );
}
