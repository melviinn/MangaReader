"use client";

import { Separator } from "@/components/ui/separator";
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

  if (!chapters || chapters.length === 0) return null;

  return (
    <div className="h-min w-full rounded-md border overflow-hidden">
      <div className="max-h-[calc(100vh-300px)] min-h-37.5 w-full rounded-md border overflow-y-auto scrollbar-thin">
        <ul className="space-y-2 p-4">
          {chapters.map((chapter) => (
            <div key={chapter.id}>
              <li
                onClick={() => router.push(`/manga/${mangaId}/${chapter.id}`)}
                className="flex justify-between items-center p-3 rounded transition cursor-pointer hover:bg-accent"
              >
                <div>
                  <span className="font-medium">
                    Chapitre {chapter.chapter ?? "?"}
                  </span>
                  {chapter.title && ` – ${chapter.title}`}
                </div>
                {chapter.volume && (
                  <span className="text-sm text-gray-400">
                    Vol {chapter.volume}
                  </span>
                )}
              </li>
              {chapter.id !== chapters[chapters.length - 1].id && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};
