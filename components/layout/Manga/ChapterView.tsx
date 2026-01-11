"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

import { ChapterImagesType } from "@/lib/types/mangaType";

async function fetchChapterPages(
  chapterId: string
): Promise<ChapterImagesType> {
  const res = await fetch(`/api/manga/chapter/${chapterId}`);
  if (!res.ok) throw new Error("Failed to load chapter pages");
  return res.json();
}

export const ChapterView = () => {
  const params = useParams();
  const chapterId = params.chapter as string;

  const { data, isLoading, isError } = useQuery<ChapterImagesType>({
    queryKey: ["chapterPages", chapterId],
    queryFn: () => fetchChapterPages(chapterId),
    enabled: !!chapterId,
    // staleTime: 1000 * 60 * 5,
  });

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
        {/* <Button
          variant="outline"
          onClick={() => setUseDataSaver(!useDataSaver)}
        >
          {useDataSaver ? "Qualité originale" : "Mode Faible données"}
        </Button> */}
      </div>

      <div className="space-y-4">
        {images.map((filename, index) => (
          <Image
            key={index}
            src={`/api/manga/chapter/${chapterId}/image/${filename}`}
            alt={`Page ${index + 1}`}
            width={800} // largeur fixe pour éviter le layout shift
            height={1200} // hauteur fixe pour éviter le layout shift
            className="w-full rounded shadow"
            loading="lazy" // lazy-loading
          />
        ))}
      </div>
    </main>
  );
};
