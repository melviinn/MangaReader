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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
          {chapters.map((chapter) => {
            const date = chapter.publishedAt
              ? new Date(chapter.publishedAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : null;

            return (
              <Button
                key={chapter.id}
                variant="secondary"
                onClick={() => router.push(`/manga/${mangaId}/${chapter.id}`)}
                className="h-auto items-start justify-start flex flex-col gap-1 px-3 py-2 text-left
                rounded-md border bg-muted/40 hover:bg-accent"
              >
                <span className="font-medium text-foreground text-sm leading-tight">
                  Chapitre {chapter.chapter ?? "?"}
                </span>
                {date && (
                  <span className="text-xs text-muted-foreground/80">
                    {date}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
