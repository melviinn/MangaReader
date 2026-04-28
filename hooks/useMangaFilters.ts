import type { TagFilterMode } from "@/components/layout/TagsDropdown";
import {
  DEFAULT_SORT,
  normalizeSortValue,
  type SortValue,
} from "@/lib/types/mangaSort";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type MangaStatusFilter =
  | "all"
  | "ongoing"
  | "completed"
  | "hiatus"
  | "cancelled";
export type ContentRatingFilter = "safe" | "suggestive" | "erotica";

export function useMangaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const language = searchParams.get("language") || "en";
  const sortMode = search
    ? normalizeSortValue(searchParams.get("sort")) === DEFAULT_SORT ||
      !searchParams.get("sort")
      ? "best_match"
      : normalizeSortValue(searchParams.get("sort"))
    : normalizeSortValue(searchParams.get("sort"));
  const selectedTagIds = (searchParams.get("tags") || "")
    .split(",")
    .map((tagId) => tagId.trim())
    .filter(Boolean);
  const tagFilterMode: TagFilterMode =
    searchParams.get("tagMode") === "exclude" ? "exclude" : "include";
  const statusFilter: MangaStatusFilter =
    searchParams.get("status") === "ongoing" ||
    searchParams.get("status") === "completed" ||
    searchParams.get("status") === "hiatus" ||
    searchParams.get("status") === "cancelled"
      ? (searchParams.get("status") as MangaStatusFilter)
      : "all";
  const contentRatingFilter: ContentRatingFilter =
    searchParams.get("contentRating") === "suggestive" ||
    searchParams.get("contentRating") === "erotica"
      ? (searchParams.get("contentRating") as ContentRatingFilter)
      : "safe";
  const layoutFromURL =
    searchParams.get("layout") === "compact" ? "compact" : "grid";

  // State pour la gestion locale
  const [searchInput, setSearchInput] = useState(search);
  const [layoutMode, setLayoutMode] = useState<"grid" | "compact">(
    layoutFromURL,
  );
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [userSortMode, setUserSortMode] = useState<SortValue>(
    normalizeSortValue(searchParams.get("sort")),
  );
  const headerSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setLayoutMode(layoutFromURL);
  }, [layoutFromURL]);

  // Utilitaire pour mettre à jour l'URL
  function updateURL(
    newSearch: string,
    newPage: number,
    newLayout: "grid" | "compact" = layoutMode,
    newSort: SortValue = sortMode,
    newTagIds: string[] = selectedTagIds,
    newTagFilterMode: TagFilterMode = tagFilterMode,
    newStatus: MangaStatusFilter = statusFilter,
    newContentRating: ContentRatingFilter = contentRatingFilter,
  ) {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set("search", newSearch);
    if (language !== "en") params.set("language", language);
    if (newPage > 1) params.set("page", String(newPage));
    if (newLayout !== "grid") params.set("layout", newLayout);
    if (newSort !== DEFAULT_SORT) params.set("sort", newSort);
    if (newTagIds.length > 0) params.set("tags", newTagIds.join(","));
    if (newTagFilterMode !== "include") params.set("tagMode", newTagFilterMode);
    if (newStatus !== "all") params.set("status", newStatus);
    if (newContentRating !== "safe")
      params.set("contentRating", newContentRating);
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  return {
    // valeurs actuelles
    search,
    page,
    language,
    sortMode,
    selectedTagIds,
    tagFilterMode,
    statusFilter,
    contentRatingFilter,
    layoutMode,
    isFiltersVisible,
    searchInput,
    userSortMode,
    headerSectionRef,
    // setters
    setSearchInput,
    setLayoutMode,
    setIsFiltersVisible,
    setUserSortMode,
    // utilitaires
    updateURL,
  };
}
