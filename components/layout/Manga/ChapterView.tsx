"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import type { ChapterImagesType } from "@/lib/types/mangaType";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

async function fetchChapterPages(
  chapterId: string
): Promise<ChapterImagesType> {
  const res = await fetch(`/api/manga/chapter/${chapterId}`);
  if (!res.ok) throw new Error("Failed to load chapter pages");
  return res.json();
}

async function fetchChaptersList(mangaId: string) {
  const res = await fetch(`/api/manga/${mangaId}/chapters`);
  if (!res.ok) throw new Error("Failed to load chapters");
  return res.json();
}

export const ChapterView = () => {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapter as string;
  const mangaId = params.id as string;

  const { data, isLoading, isError } = useQuery<ChapterImagesType>({
    queryKey: ["chapterPages", chapterId],
    queryFn: () => fetchChapterPages(chapterId),
    enabled: !!chapterId,
  });

  const { data: chaptersData, isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters", mangaId],
    queryFn: () => fetchChaptersList(mangaId),
    enabled: !!mangaId,
    staleTime: 1000 * 60 * 5, // 5 minutes - same as ChaptersList
    placeholderData: (previousData) => previousData, // Keep showing old data while refetching
  });

  const chapters = chaptersData?.chapters || [];
  const currentChapterIndex = chapters.findIndex(
    (ch: any) => ch.id === chapterId
  );

  // Show buttons immediately when we have chapter data, even if still loading in background
  const canShowButtons = chapters.length > 0 && currentChapterIndex !== -1;
  const prevChapter =
    canShowButtons && currentChapterIndex > 0
      ? chapters[currentChapterIndex - 1]
      : null;
  const nextChapter =
    canShowButtons && currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  const navigateToChapter = (chapterId: string) => {
    router.push(`/manga/${mangaId}/${chapterId}`);
  };

  if (isLoading)
    return <p className="text-center py-8">Chargement du chapitre...</p>;

  if (isError)
    return (
      <p className="text-center py-8 text-red-500">
        Erreur lors du chargement du chapitre.
      </p>
    );
  if (!data) return null;

  const images = data.data;

  if (images.length === 0) {
    return (
      <p className="text-center py-8 text-gray-500">
        Aucune page disponible pour ce chapitre.
      </p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-8 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Lecture du chapitre</h1>
      </div>

      <div className="flex justify-between items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 py-4 border-b">
        <Button
          variant="outline"
          onClick={() => prevChapter && navigateToChapter(prevChapter.id)}
          disabled={!prevChapter}
          className="flex items-center gap-2"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} />
          Chapitre précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          {canShowButtons
            ? `${currentChapterIndex + 1} / ${chapters.length}`
            : chaptersLoading
            ? "Chargement..."
            : ""}
        </span>
        <Button
          variant="outline"
          onClick={() => nextChapter && navigateToChapter(nextChapter.id)}
          disabled={!nextChapter}
          className="flex items-center gap-2"
        >
          Chapitre suivant
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      </div>

      <div className="space-y-4">
        {images.map((filename, index) => (
          <Image
            key={index}
            src={`/api/manga/chapter/${chapterId}/image/${filename}`}
            alt={`Page ${index + 1}`}
            width={800}
            height={1200}
            className="w-full rounded shadow"
            // loading="lazy"
          />
        ))}
      </div>
    </main>
  );
};
