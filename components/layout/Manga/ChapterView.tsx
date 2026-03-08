"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { ChapterImagesType } from "@/lib/types/mangaType";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

async function fetchChapterPages(
  chapterId: string,
): Promise<ChapterImagesType> {
  const res = await fetch(`/api/manga/chapter/${chapterId}`);
  if (!res.ok) throw new Error("Failed to load chapter pages");
  return res.json();
}

async function fetchChaptersList(mangaId: string, language: string) {
  const res = await fetch(
    `/api/manga/${mangaId}/chapters?language=${language}`,
  );
  if (!res.ok) throw new Error("Failed to load chapters");
  return res.json();
}

export const ChapterView = () => {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapter as string;
  const mangaId = params.id as string;
  const [language, setLanguage] = useState("en");

  // Charger la langue depuis localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem(`manga_${mangaId}_language`);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [mangaId]);

  const { data, isLoading, isError } = useQuery<ChapterImagesType>({
    queryKey: ["chapterPages", chapterId],
    queryFn: () => fetchChapterPages(chapterId),
    enabled: !!chapterId,
  });

  const { data: chaptersData, isLoading: chaptersLoading } = useQuery({
    queryKey: ["chaptersNav", mangaId, language],
    queryFn: () => fetchChaptersList(mangaId, language),
    enabled: !!mangaId && !!language,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const chapters = chaptersData?.chapters || [];

  const currentChapterIndex = chapters.findIndex(
    (ch: any) => ch.id === chapterId,
  );

  const currentChapter = chapters.find((ch: any) => ch.id === chapterId);
  const currentChapterName =
    currentChapter?.title || `Chapter ${currentChapter?.chapter || "unknown"}`;

  const currentChapterNumber =
    currentChapterIndex !== -1 ? chapters[currentChapterIndex].chapter : null;

  const canShowButtons = chapters.length > 0 && currentChapterIndex !== -1;
  const prevChapter =
    canShowButtons && currentChapterIndex > 0
      ? chapters[currentChapterIndex - 1]
      : null;
  const nextChapter =
    canShowButtons && currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  const lastChapterNumber =
    chapters.length > 0 ? chapters[chapters.length - 1].chapter : null;

  const navigateToChapter = (chapterId: string) => {
    router.push(`/manga/${mangaId}/${chapterId}`);
  };

  if (isLoading)
    return <p className="text-center py-8">Loading chapter...</p>;

  if (isError)
    return (
      <p className="text-center py-8 text-red-500">
        Failed to load chapter. Please try again later.
      </p>
    );
  if (!data) return null;

  const images = data.data;

  return (
    <main className="w-full px-6 mx:px-0 py-8">
      <Button
        variant="ghost"
        className="mb-8 md:mb-0"
        onClick={() => router.push(`/manga/${mangaId}`)}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        Return to the chapters list
      </Button>
      <div className="max-w-3xl mx-0 md:mx-auto space-y-4">
        <div className="flex space-x-4 items-center mb-4">
          {/* <h1 className="text-xl font-semibold">Lecture du chapitre: </h1> */}
          <h1 className="text-2xl font-semibold tracking-tighter">
            {currentChapterName}
          </h1>
        </div>
        <div className="flex justify-between items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 py-4 border-b">
          <Button
            variant="outline"
            onClick={() => prevChapter && navigateToChapter(prevChapter.id)}
            disabled={!prevChapter}
            className="flex items-center gap-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            Previous
          </Button>
          <span className="text-xs md:text-sm">
            {canShowButtons
              ? `${currentChapterNumber} / ${lastChapterNumber}`
              : chaptersLoading
                ? "Loading..."
                : ""}
          </span>
          <Button
            variant="outline"
            onClick={() => nextChapter && navigateToChapter(nextChapter.id)}
            disabled={!nextChapter}
            className="flex items-center gap-2"
          >
            Next
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Button>
        </div>
        {images.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No pages found for this chapter.
          </p>
        ) : (
          <div className="space-y-4">
            {images.map((filename, index) => (
              <Image
                key={index}
                src={`/api/manga/chapter/${chapterId}/image/${filename}`}
                alt={`Page ${index + 1}`}
                width={800}
                height={1200}
                className="w-full rounded shadow"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
