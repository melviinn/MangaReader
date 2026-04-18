"use client";

import { Button } from "@/components/ui/button";
import type { MangaChapterType } from "@/lib/types/mangaType";
import { useRouter } from "next/navigation";
import React from "react";

interface ChaptersScrollAreaProps {
  chapters: MangaChapterType[];
  mangaId: string;
}

export const ChaptersScrollArea: React.FC<ChaptersScrollAreaProps> = ({
  chapters,
  mangaId,
}) => {
  const router = useRouter();

  if (!chapters?.length) return null;

  return (
    <div className="w-full rounded-md border bg-background">
      <div className="max-h-96 overflow-y-auto scrollbar-thin">
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

            return (
              <Button
                key={chapter.id}
                variant="secondary"
                onClick={() => router.push(`/manga/${mangaId}/${chapter.id}`)}
                className="group flex h-auto w-full min-w-0 flex-col items-start justify-start gap-1 rounded-md border bg-card px-3 py-2 text-left transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <span className="w-full truncate text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
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
            );
          })}
        </div>
      </div>
    </div>
  );
};
