"use client";

import { Input } from "@/components/ui/input";
import { MangaChapterType } from "@/lib/types/mangaType";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

async function fetchChapters(mangaId: string): Promise<MangaChapterType[]> {
  const res = await fetch(`/api/manga/${mangaId}/chapters`);

  if (!res.ok) {
    throw new Error("Failed to load chapters");
  }

  const data = await res.json();
  return data.chapters;
}

export const ChaptersList = () => {
  const params = useParams();
  const router = useRouter();
  const mangaId = params.id as string;
  const [search, setSearch] = useState("");

  const {
    data: chapters = [],
    isLoading,
    isError,
  } = useQuery<MangaChapterType[]>({
    queryKey: ["chapters", mangaId],
    queryFn: () => fetchChapters(mangaId),
    enabled: !!mangaId,
    staleTime: 1000 * 60 * 5,
  });

  // Filtrage par chapitre ou titre, useMemo pour optimiser les performances (éviter les rerenders inutiles)
  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters;
    return chapters.filter(
      (chapter) =>
        chapter.chapter?.includes(search.trim()) ||
        chapter.title?.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [chapters, search]);

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return <p className="text-center py-8">Chargement des chapitres...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-8 text-red-500">
        Erreur lors du chargement des chapitres.
      </p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-8 space-y-4">
      <h1 className="text-xl font-semibold">Chapitres disponibles</h1>

      {/* Barre de recherche */}
      <div className="flex justify-center mb-4">
        <Input
          type="text"
          placeholder="Rechercher un chapitre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Liste des chapitres */}
      {filteredChapters.length === 0 ? (
        <p className="text-center text-gray-500">Aucun chapitre trouvé.</p>
      ) : (
        <ul className="space-y-2">
          {filteredChapters.map((chapter) => (
            <li
              key={chapter.id}
              onClick={() => router.push(`/manga/${mangaId}/${chapter.id}`)}
              className="flex justify-between items-center p-3 rounded border transition cursor-pointer"
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
          ))}
        </ul>
      )}
    </main>
  );
};
