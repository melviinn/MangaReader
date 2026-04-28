"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import type { MangaChapterType, MangaDetailsType } from "@/lib/types/mangaType";
import { FlagEN, FlagFR } from "@/public/flags";
import { ArrowUpNarrowWideIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MangaChaptersScrollArea } from "./MangaChaptersScrollArea";
import { MangaHeader } from "./MangaHeader";

function ChaptersSkeleton({ count }: { count: number }) {
  return (
    <div className="w-full rounded-md border bg-background">
      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: count }).map((_, index) => (
            <Button
              key={index}
              type="button"
              variant="secondary"
              disabled
              className="group flex h-auto w-full min-w-0 flex-col items-start justify-start gap-1 rounded-md border bg-card px-3 py-2 text-left transition-all"
            >
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="hidden h-3 w-full sm:block" />
              <div className="mt-auto flex w-full items-center justify-between gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="hidden h-3 w-12 sm:inline" />
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  order: "asc" | "desc",
): Promise<MangaChapterType[]> {
  const res = await fetch(
    `/api/manga/${mangaId}/chapters?language=${language}&order=${order}`,
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
];

function MangaChaptersListContent() {
  const params = useParams();
  const mangaId = params.id as string;
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("en");
  // Charger l'ordre depuis localStorage au montage
  const [chaptersOrder, setChaptersOrder] = useState<
    "ascending" | "descending"
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`manga_${mangaId}_chaptersOrder`);
      if (saved === "ascending" || saved === "descending") return saved;
    }
    return "descending";
  });
  const [isSortPending, setIsSortPending] = useState(false);
  const apiOrder = chaptersOrder === "ascending" ? "asc" : "desc";

  // Charger la langue et l'ordre depuis localStorage au montage
  useEffect(() => {
    const savedLanguage = localStorage.getItem(`manga_${mangaId}_language`);
    if (savedLanguage) setLanguage(savedLanguage);

    const savedOrder = localStorage.getItem(`manga_${mangaId}_chaptersOrder`);
    if (savedOrder === "ascending" || savedOrder === "descending")
      setChaptersOrder(savedOrder);
  }, [mangaId]);

  // Sauvegarder la langue dans localStorage quand elle change

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem(`manga_${mangaId}_language`, newLanguage);
  };

  // Sauvegarder l'ordre dans localStorage quand il change
  const handleOrderChange = () => {
    setIsSortPending(true);
    setChaptersOrder((prev) => {
      const next = prev === "ascending" ? "descending" : "ascending";
      localStorage.setItem(`manga_${mangaId}_chaptersOrder`, next);
      return next;
    });
  };

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

  const {
    data: chapters,
    isLoading,
    isFetching,
    isError,
  } = useQuery<MangaChapterType[]>({
    queryKey: ["chapters", mangaId, language, apiOrder],
    queryFn: () => fetchChapters(mangaId, language, apiOrder),
    enabled: !!mangaId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isFetching) {
      setIsSortPending(false);
    }
  }, [isFetching]);

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
  const skeletonCount = Math.max(filteredChapters.length, 1);

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

        <div className="mb-4 mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="w-full max-w-sm md:max-w-md">
            <SearchInput
              type="search"
              placeholder="Search chapters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleOrderChange}
            aria-label={`Toggle chapters order, current: ${chaptersOrder}`}
          >
            <HugeiconsIcon
              icon={ArrowUpNarrowWideIcon}
              className={
                chaptersOrder === "descending"
                  ? "size-4 -rotate-180 transition duration-300 ease-linear"
                  : "size-4 transition duration-300 ease-linear"
              }
            />
          </Button>
        </div>
        {isSortPending && isFetching ? (
          <ChaptersSkeleton count={skeletonCount} />
        ) : filteredChapters.length === 0 ? (
          <p className="text-center text-gray-500">No chapters found.</p>
        ) : (
          <MangaChaptersScrollArea
            chapters={filteredChapters}
            mangaId={mangaId}
          />
        )}
      </div>
    </main>
  );
}

export const MangaChaptersList = () => {
  return <MangaChaptersListContent />;
};
