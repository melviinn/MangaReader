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

  const firstChapterNumber = chapters[0]?.chapter;
  const lastChapterNumber = chapters[chapters.length - 1]?.chapter;
  const haveChapters = chapters.length > 0;

  const chapterTitle = mangaDetails.title;

  return (
    <main className="w-full px-6 md:px-0 py-8 space-y-4">
      <MangaHeader
        manga={mangaDetails}
        mangaTitle={chapterTitle}
        language={language}
      />

      <div className="max-w-7xl mx-auto py-10 px-2 md:px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {haveChapters ? (
              <>
                Available chapters:{" "}
                <span className="text-primary"> {chapters.length}</span>
                {/* <span className="text-muted-foreground font-normal text-base ml-2">
                  ({firstChapterNumber} - {lastChapterNumber})
                </span> */}
              </>
            ) : (
              "No chapters available"
            )}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon">
                  {currentLanguage?.flag || "🌐"}
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
        <div className="flex justify-center mb-4 sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 py-4">
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
