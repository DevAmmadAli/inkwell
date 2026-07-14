"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NoteList } from "./note-list";

interface NoteDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteDrawer({ open, onOpenChange }: NoteDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>Notes</SheetTitle>
        </SheetHeader>
        <div className="p-3 overflow-y-auto h-[calc(100%-3.5rem)]">
          <NoteList />
        </div>
      </SheetContent>
    </Sheet>
  );
}
