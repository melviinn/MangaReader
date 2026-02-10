"use client";

import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MangaChapterType } from "@/lib/types/mangaType";
import { FlagDE, FlagEN, FlagES, FlagFR, FlagJA } from "@/public/flags";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ChaptersScrollArea } from "./ChaptersScrollArea";

async function fetchChapters(
  mangaId: string,
  language: string,
): Promise<MangaChapterType[]> {
  const res = await fetch(
    `/api/manga/${mangaId}/chapters?language=${language}`,
  );

  if (!res.ok) {
    throw new Error("Failed to load chapters");
  }

  const data = await res.json();
  return data.chapters;
}

const LANGUAGES = [
  { code: "en", label: "English", flag: <FlagEN /> },
  { code: "fr", label: "Français", flag: <FlagFR /> },
  { code: "es", label: "Español", flag: <FlagES /> },
  { code: "ja", label: "日本語", flag: <FlagJA /> },
  { code: "de", label: "Deutsch", flag: <FlagDE /> },
];

function ChaptersListContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mangaId = params.id as string;
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("en");
  const mangaTitle = searchParams.get("title");

  // Charger la langue depuis localStorage au montage
  useEffect(() => {
    const savedLanguage = localStorage.getItem(`manga_${mangaId}_language`);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [mangaId]);

  // Sauvegarder la langue dans localStorage quand elle change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem(`manga_${mangaId}_language`, newLanguage);
  };

  const {
    data: chapters,
    isLoading,
    isError,
  } = useQuery<MangaChapterType[]>({
    queryKey: ["chapters", mangaId, language],
    queryFn: () => fetchChapters(mangaId, language),
    enabled: !!mangaId,
    staleTime: 1000 * 60 * 5,
  });

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language);

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

  if (!chapters || !Array.isArray(chapters)) {
    return <p className="text-center py-8">Chargement des chapitres...</p>;
  }

  const filteredChapters = !search.trim()
    ? chapters
    : chapters.filter(
        (chapter) =>
          chapter.chapter?.includes(search.trim()) ||
          chapter.title?.toLowerCase().includes(search.trim().toLowerCase()),
      );

  return (
    <main className="max-w-3xl mx-auto px-6 md:px-0 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          {mangaTitle || "Chapitres disponibles"}
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {currentLanguage?.flag || "🌐"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={language === lang.code ? "bg-accent" : ""}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-center mb-4 sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 py-4">
        <SearchInput
          type="text"
          placeholder="Rechercher un chapitre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredChapters.length === 0 ? (
        <p className="text-center text-gray-500">Aucun chapitre trouvé.</p>
      ) : (
        <ChaptersScrollArea chapters={filteredChapters} mangaId={mangaId} />
      )}
    </main>
  );
}

export const ChaptersList = () => {
  return (
    <Suspense fallback={<p className="text-center py-8">Chargement...</p>}>
      <ChaptersListContent />
    </Suspense>
  );
};
