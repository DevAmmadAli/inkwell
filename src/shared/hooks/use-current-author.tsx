"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthorInfo } from "@/shared/types";

interface CurrentAuthorContextType {
  currentAuthor: AuthorInfo | null;
  authors: AuthorInfo[];
  switchAuthor: (author: AuthorInfo) => void;
  loading: boolean;
}

const CurrentAuthorContext = createContext<CurrentAuthorContextType>({
  currentAuthor: null,
  authors: [],
  switchAuthor: () => {},
  loading: true,
});

export function CurrentAuthorProvider({ children }: { children: ReactNode }) {
  const [currentAuthor, setCurrentAuthor] = useState<AuthorInfo | null>(null);
  const [authors, setAuthors] = useState<AuthorInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/authors")
      .then((res) => res.json())
      .then((data: AuthorInfo[]) => {
        setAuthors(data);
        const savedId = localStorage.getItem("inkwell-author");
        const saved = data.find((u) => u.id === savedId);
        setCurrentAuthor(saved ?? data[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const switchAuthor = useCallback((author: AuthorInfo) => {
    setCurrentAuthor(author);
    localStorage.setItem("inkwell-author", author.id);
  }, []);

  return (
    <CurrentAuthorContext.Provider
      value={{ currentAuthor, authors, switchAuthor, loading }}
    >
      {children}
    </CurrentAuthorContext.Provider>
  );
}

export function useCurrentAuthor() {
  return useContext(CurrentAuthorContext);
}
