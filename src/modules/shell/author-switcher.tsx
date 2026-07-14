"use client";

import { useCurrentAuthor } from "@/shared/hooks/use-current-author";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function AuthorSwitcher() {
  const { currentAuthor, authors, switchAuthor, loading } = useCurrentAuthor();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (author: typeof currentAuthor & object) => {
    switchAuthor(author);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!currentAuthor) return null;

  const initials = currentAuthor.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent text-left transition-colors h-8">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium truncate max-w-[120px]">
          {currentAuthor.name}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {authors.map((author) => (
          <DropdownMenuItem
            key={author.id}
            onClick={() => handleSwitch(author)}
            className="flex items-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <span className="text-sm">{author.name}</span>
            </div>
            {author.id === currentAuthor.id && (
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
