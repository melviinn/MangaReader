"use client";

import { Button } from "@/components/ui/button";
import type { MangaChapterType } from "@/lib/types/mangaType";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ChaptersScrollAreaProps {
  chapters: MangaChapterType[];
  mangaId: string;
}

export const MangaChaptersScrollArea: React.FC<ChaptersScrollAreaProps> = ({
  chapters,
  mangaId,
}) => {
  const router = useRouter();
  const [readChapters, setReadChapters] = useState<string[]>([]);

  useEffect(() => {
    const key = `manga_${mangaId}_readChapters`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setReadChapters(JSON.parse(stored));
      } catch {
        setReadChapters([]);
      }
    }
  }, [mangaId]);

  const handleChapterClick = (chapterId: string) => {
    const key = `manga_${mangaId}_readChapters`;
    let updated: string[] = [];
    try {
      const stored = localStorage.getItem(key);
      const arr = stored ? JSON.parse(stored) : [];
      if (!arr.includes(chapterId)) {
        updated = [...arr, chapterId];
        localStorage.setItem(key, JSON.stringify(updated));
        setReadChapters(updated);
      } else {
        updated = arr;
      }
    } catch {
      updated = [chapterId];
      localStorage.setItem(key, JSON.stringify(updated));
      setReadChapters(updated);
    }
    router.push(`/manga/${mangaId}/${chapterId}`);
  };

  if (!chapters?.length) return null;

  return (
    <div className="w-full rounded-md border bg-background">
      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4">
          {chapters.map((chapter) => {
            const date = chapter.publishedAt
              ? new Date(chapter.publishedAt).toLocaleDateString("en-EN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : null;

            const chapterLabel = chapter.chapter
              ? `Chapter ${chapter.chapter}`
              : "Chapter ?";
            const titleLabel = chapter.title?.trim() || "Untitled";
            const pagesLabel =
              typeof chapter.pages === "number"
                ? `${chapter.pages} pages`
                : null;

            const isRead = readChapters.includes(chapter.id);

            return (
              <div className="relative w-full" key={chapter.id}>
                <Button
                  variant={"secondary"}
                  onClick={() => handleChapterClick(chapter.id)}
                  className={
                    `group flex h-auto w-full min-w-0 flex-col items-start justify-start gap-1 rounded-md border px-3 py-2 text-left transition-all ` +
                    (isRead
                      ? "border-yellow-500 bg-card hover:bg-yellow-700/90"
                      : "bg-card hover:border-primary hover:bg-card/80")
                  }
                >
                  {/* Icone check en haut à droite si lu */}
                  {isRead && (
                    <span className="absolute top-2 right-2 z-10 text-yellow-400">
                      <HugeiconsIcon icon={ViewIcon} className="size-4" />
                    </span>
                  )}
                  <span
                    className={
                      "w-full truncate text-sm font-semibold leading-tight transition-colors group-hover:text-primary " +
                      (isRead ? "text-primary" : "text-foreground")
                    }
                  >
                    {chapterLabel}
                  </span>

                  {titleLabel && (
                    <span className="hidden w-full truncate text-xs text-muted-foreground sm:block">
                      {titleLabel}
                    </span>
                  )}

                  {(date || pagesLabel) && (
                    <div className="mt-auto flex w-full items-center justify-between gap-2">
                      {date && (
                        <span className="text-[11px] text-muted-foreground/80">
                          {date}
                        </span>
                      )}
                      {pagesLabel && (
                        <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">
                          {pagesLabel}
                        </span>
                      )}
                    </div>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
