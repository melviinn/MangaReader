"use client";

import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface MangaSuggestion {
  id: string;
  title: string;
  coverUrl: string | null;
}

export function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MangaSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    fetch(`/api/manga?title=${encodeURIComponent(debouncedQuery)}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.mangas || []);
        setShowDropdown((data.mangas || []).length > 0);
      });
  }, [debouncedQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debouncedQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(debouncedQuery)}`);
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  }

  function handleSuggestionClick(id: string) {
    router.push(`/manga/${id}`);
    setShowDropdown(false);
    setQuery("");
  }

  return (
    <div className="relative w-64 max-w-xs">
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manga..."
          className="w-full h-9 rounded-md border border-border bg-card text-card-foreground placeholder:text-card-foreground/60 px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 transition"
          style={{
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
          }}
        />
      </form>
      {showDropdown && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-md bg-card text-card-foreground shadow-lg border border-border overflow-hidden">
          {suggestions.map((manga) => (
            <button
              key={manga.id}
              className="flex items-center w-full px-3 py-2 hover:bg-muted/60 text-left gap-2 transition-colors"
              onClick={() => handleSuggestionClick(manga.id)}
              type="button"
            >
              {manga.coverUrl && (
                <Image
                  src={manga.coverUrl}
                  alt={manga.title}
                  width={32}
                  height={44}
                  className="rounded object-cover"
                />
              )}
              <span className="truncate">{manga.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
