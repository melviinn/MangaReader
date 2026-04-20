"use client";

import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MangaChapterType, MangaDetailsType } from "@/lib/types/mangaType";
import { FlagEN, FlagFR, FlagJA } from "@/public/flags";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChaptersScrollArea } from "./ChaptersScrollArea";
import { MangaHeader } from "./MangaHeader";

async function fetchMangaDetails(
  mangaId: string,
  language: string,
): Promise<MangaDetailsType> {
  const res = await fetch(`/api/manga/${mangaId}?language=${language}`);

  if (!res.ok) {
    throw new Error("Failed to load manga details");
  }

  const data = await res.json();
  return data;
}

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
  { code: "ja", label: "日本語", flag: <FlagJA /> },
];

function ChaptersListContent() {
  const params = useParams();
  const mangaId = params.id as string;
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("en");

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

  // Get manga details for title and other info
  const {
    data: mangaDetails,
    isLoading: mangaLoading,
    isError: mangaError,
  } = useQuery<MangaDetailsType>({
    queryKey: ["mangaDetails", mangaId, language],
    queryFn: () => fetchMangaDetails(mangaId, language),
    enabled: !!mangaId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Get manga chapters
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

  if (isLoading || mangaLoading) {
    return <p className="text-center py-8">Loading chapters...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-8 text-red-500">
        Failed to load chapters. Please try again later.
      </p>
    );
  }

  if (!chapters) {
    return <p className="text-center py-8">No chapters found.</p>;
  }

  if (mangaError || !mangaDetails) {
    return (
      <p className="text-center py-8 text-red-500">
        Failed to load manga details. Please try again later.
      </p>
    );
  }

  const filteredChapters = !search.trim()
    ? chapters
    : chapters.filter(
        (chapter) =>
          chapter.chapter?.includes(search.trim()) ||
          chapter.title?.toLowerCase().includes(search.trim().toLowerCase()),
      );

  const haveChapters = chapters.length > 0;

  return (
    <main className="w-full px-6 md:px-4 py-8 space-y-4">
      <MangaHeader
        manga={mangaDetails}
        mangaTitle={mangaDetails.title}
        language={language}
      />

      <div className="max-w-7xl mx-auto py-10">
        <div className="mb-4 rounded-xl border border-border/60 bg-card/30 p-3 md:p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 ">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
                {haveChapters ? (
                  <>
                    Available chapters
                    <span className="text-primary">: {chapters.length}</span>
                  </>
                ) : (
                  "No chapters available"
                )}
              </h2>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="size-8 p-0 sm:h-9 sm:w-auto sm:gap-2 sm:px-2.5"
                    aria-label={`Language: ${currentLanguage?.label || "Unknown"}`}
                  >
                    <span>{currentLanguage?.flag || "🌐"}</span>
                    <span className="hidden sm:inline">
                      {currentLanguage?.label || "Language"}
                    </span>
                  </Button>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="space-y-1">
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
        </div>

        <div className="mb-4 mt-8">
          <SearchInput
            type="text"
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filteredChapters.length === 0 ? (
          <p className="text-center text-gray-500">No chapters found.</p>
        ) : (
          <ChaptersScrollArea chapters={filteredChapters} mangaId={mangaId} />
        )}
      </div>
    </main>
  );
}

export const ChaptersList = () => {
  return <ChaptersListContent />;
};
