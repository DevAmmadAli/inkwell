"use client";

import { useState } from "react";
import { PenTool, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthorSwitcher } from "./author-switcher";
import { NoteDrawer } from "./note-drawer";
import { UploadDialog } from "@/modules/ingest/upload-dialog";

export function TopNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav className="flex items-center gap-2 px-4 h-12 border-b bg-card shrink-0">
      <div className="flex items-center gap-2">
        <PenTool className="h-4 w-4 text-primary" />
        <span className="text-base font-semibold">InkWell</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDrawerOpen(true)}
        className="h-8 gap-1.5 text-xs"
      >
        <PanelLeft className="h-3.5 w-3.5" />
        Notes
      </Button>

      <div className="flex-1" />

      <UploadDialog />

      <AuthorSwitcher />

      <NoteDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </nav>
  );
}
