"use client";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_SORT,
  normalizeSortValue,
  type SortValue,
} from "@/lib/types/mangaSort";
import type { MangaResponseType } from "@/lib/types/mangaType";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FilterIcon,
  GridViewIcon,
  LeftToRightListBulletIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ErrorMessage } from "../ErrorMessage";
import { FiltersDropdown } from "../ui/filters-dropdown";
import { MangaPagination } from "../ui/pagination";
import { SearchInput } from "../ui/search-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MangasSkeleton } from "./Manga/MangasSkeleton";
import { MangasView } from "./Manga/MangasView";
import {
  TagsDropdown,
  type TagFilterMode,
  type TagsDropdownChange,
} from "./TagsDropdown";

type MangaStatusFilter =
  | "all"
  | "ongoing"
  | "completed"
  | "hiatus"
  | "cancelled";
type ContentRatingFilter = "safe" | "suggestive" | "erotica";

const STATUS_FILTER_OPTIONS: { value: MangaStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Finished" },
  { value: "hiatus", label: "Hiatus" },
  { value: "cancelled", label: "Cancelled" },
];

const CONTENT_RATING_OPTIONS: {
  value: ContentRatingFilter;
  label: string;
}[] = [
  { value: "safe", label: "Safe" },
  { value: "suggestive", label: "Suggestive" },
  { value: "erotica", label: "Erotica" },
];

const DEFAULT_STATUS_FILTER: MangaStatusFilter = "all";
const DEFAULT_CONTENT_RATING: ContentRatingFilter = "safe";

async function fetchMangas(
  search: string,
  page: number,
  language: string,
  sort: SortValue,
  tagIds: string[],
  tagFilterMode: TagFilterMode,
  status: MangaStatusFilter,
  contentRating: ContentRatingFilter,
): Promise<MangaResponseType> {
  const limit = 24;
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    language,
    sort,
  });
  if (search.trim() !== "") params.append("title", search);

  if (tagIds.length > 0) {
    params.append("tagIds", tagIds.join(","));
    params.append("tagMode", tagFilterMode);
  }

  if (status !== DEFAULT_STATUS_FILTER) params.append("status", status);

  if (contentRating !== DEFAULT_CONTENT_RATING)
    params.append("contentRating", contentRating);

  const res = await fetch(`/api/manga?${params.toString()}`);
  if (!res.ok)
    throw new Error("Une erreur est survenue lors du chargement des mangas.");
  return res.json();
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const language = searchParams.get("language") || "en";
  const sortMode = normalizeSortValue(searchParams.get("sort"));
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
      : DEFAULT_STATUS_FILTER;
  const contentRatingFilter: ContentRatingFilter =
    searchParams.get("contentRating") === "suggestive" ||
    searchParams.get("contentRating") === "erotica"
      ? (searchParams.get("contentRating") as ContentRatingFilter)
      : DEFAULT_CONTENT_RATING;
  const activeTagsCount = selectedTagIds.length;
  const layoutFromURL =
    searchParams.get("layout") === "compact" ? "compact" : "grid";
  const headerSectionRef = useRef<HTMLDivElement>(null);

  const [searchInput, setSearchInput] = useState(search);
  const [layoutMode, setLayoutMode] = useState<"grid" | "compact">(
    layoutFromURL,
  );
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const { data, isLoading, isError, isFetching } = useQuery<
    MangaResponseType,
    Error
  >({
    queryKey: [
      "mangas",
      search,
      page,
      language,
      sortMode,
      selectedTagIds,
      tagFilterMode,
      statusFilter,
      contentRatingFilter,
    ],
    queryFn: () =>
      fetchMangas(
        search,
        page,
        language,
        sortMode,
        selectedTagIds,
        tagFilterMode,
        statusFilter,
        contentRatingFilter,
      ),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setLayoutMode(layoutFromURL);
  }, [layoutFromURL]);

  const updateURL = (
    newSearch: string,
    newPage: number,
    newLayout: "grid" | "compact" = layoutMode,
    newSort: SortValue = sortMode,
    newTagIds: string[] = selectedTagIds,
    newTagFilterMode: TagFilterMode = tagFilterMode,
    newStatus: MangaStatusFilter = statusFilter,
    newContentRating: ContentRatingFilter = contentRatingFilter,
  ) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set("search", newSearch);

    if (language !== "en") params.set("language", language);

    if (newPage > 1) params.set("page", String(newPage));

    if (newLayout !== "grid") params.set("layout", newLayout);

    if (newSort !== DEFAULT_SORT) params.set("sort", newSort);

    if (newTagIds.length > 0) params.set("tags", newTagIds.join(","));

    if (newTagFilterMode !== "include") params.set("tagMode", newTagFilterMode);

    if (newStatus !== DEFAULT_STATUS_FILTER) params.set("status", newStatus);

    if (newContentRating !== DEFAULT_CONTENT_RATING)
      params.set("contentRating", newContentRating);

    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submittedSearch = searchInput.trim();

    updateURL(submittedSearch, 1);
    headerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() === "") updateURL("", 1);
  };

  const handlePageChange = (newPage: number | ((p: number) => number)) => {
    const resolvedPage =
      typeof newPage === "function" ? newPage(page) : newPage;
    updateURL(search, resolvedPage);
    headerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLayoutChange = (newLayout: "grid" | "compact") => {
    setLayoutMode(newLayout);
    updateURL(search, page, newLayout, sortMode);
  };

  const handleSortChange = (newSort: SortValue) => {
    updateURL(search, 1, layoutMode, newSort);
  };

  const handleTagsChange = ({
    tagIds,
    tagFilterMode: nextMode,
  }: TagsDropdownChange) => {
    updateURL(
      search,
      1,
      layoutMode,
      sortMode,
      tagIds,
      nextMode,
      statusFilter,
      contentRatingFilter,
    );
  };

  const handleStatusFilterChange = (status: MangaStatusFilter) => {
    updateURL(
      search,
      1,
      layoutMode,
      sortMode,
      selectedTagIds,
      tagFilterMode,
      status,
      contentRatingFilter,
    );
  };

  const handleContentRatingFilterChange = (
    contentRating: ContentRatingFilter,
  ) => {
    updateURL(
      search,
      1,
      layoutMode,
      sortMode,
      selectedTagIds,
      tagFilterMode,
      statusFilter,
      contentRating,
    );
  };

  const hasActiveFilters =
    activeTagsCount > 0 ||
    sortMode !== DEFAULT_SORT ||
    tagFilterMode !== "include" ||
    statusFilter !== DEFAULT_STATUS_FILTER ||
    contentRatingFilter !== DEFAULT_CONTENT_RATING;

  const handleResetFilters = () => {
    updateURL(
      search,
      1,
      layoutMode,
      DEFAULT_SORT,
      [],
      "include",
      DEFAULT_STATUS_FILTER,
      DEFAULT_CONTENT_RATING,
    );
  };

  return (
    <main className="flex flex-col">
      <section
        className="relative bg-background overflow-hidden"
        ref={headerSectionRef}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight">
              <span className="text-balance">Discover Your Next</span>
              <br />
              <span className="text-primary">Favorite Manga</span>
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-2xl mb-8 text-pretty font-heading">
              Browse thousands of mangas from action to romance. Find your next
              adventure and start reading today.
            </p>

            <form
              className="flex w-full max-w-xl items-center gap-3"
              id="manga-search-form"
              onSubmit={handleSubmit}
            >
              <SearchInput
                placeholder="Search mangas..."
                type="search"
                value={searchInput}
                onChange={onChangeValue}
              />
              <Button type="submit" size="lg" className="py-4.5 px-4">
                Search
              </Button>
            </form>

            <div className="flex items-center gap-8 mt-10 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-primary">10K+</span>
                <span className="text-muted-foreground">Manga Titles</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-primary">500K+</span>
                <span className="text-muted-foreground">Chapters</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-primary">Free</span>
                <span className="text-muted-foreground">Forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 md:min-w-40 md:justify-between"
                onClick={() => setIsFiltersVisible((prev) => !prev)}
                aria-label={
                  isFiltersVisible
                    ? "Hide filters section"
                    : "Show filters section"
                }
                aria-expanded={isFiltersVisible}
              >
                <span className="md:hidden">
                  <HugeiconsIcon icon={FilterIcon} />
                </span>
                <span className="hidden md:inline">
                  {isFiltersVisible ? "Hide filters" : "Show filters"}
                </span>
                <span className="hidden md:inline-flex">
                  <HugeiconsIcon
                    icon={isFiltersVisible ? ArrowUp01Icon : ArrowDown01Icon}
                  />
                </span>
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleResetFilters}
                >
                  Reset filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon-lg"
                variant={layoutMode === "compact" ? "default" : "outline"}
                onClick={() => handleLayoutChange("compact")}
                aria-label="Switch to compact layout"
              >
                <HugeiconsIcon icon={LeftToRightListBulletIcon} />
              </Button>
              <Button
                size="icon-lg"
                variant={layoutMode === "grid" ? "default" : "outline"}
                onClick={() => handleLayoutChange("grid")}
                aria-label="Switch to grid layout"
              >
                <HugeiconsIcon icon={GridViewIcon} />
              </Button>
            </div>
          </div>

          {isFiltersVisible && (
            <div className="mb-8 rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="grid w-full grid-cols-2 gap-3 xl:grid-cols-4">
                  <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/50 bg-background/70 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Sort by
                    </p>
                    <FiltersDropdown
                      value={sortMode}
                      onValueChange={handleSortChange}
                      triggerClassName="min-w-0"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/50 bg-background/70 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Publication status
                    </p>
                    <Select
                      items={STATUS_FILTER_OPTIONS}
                      value={statusFilter}
                      onValueChange={(nextValue) =>
                        handleStatusFilterChange(nextValue as MangaStatusFilter)
                      }
                    >
                      <SelectTrigger className="w-full min-w-0 justify-between gap-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {STATUS_FILTER_OPTIONS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/50 bg-background/70 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Content rating
                    </p>
                    <Select
                      items={CONTENT_RATING_OPTIONS}
                      value={contentRatingFilter}
                      onValueChange={(nextValue) =>
                        handleContentRatingFilterChange(
                          nextValue as ContentRatingFilter,
                        )
                      }
                    >
                      <SelectTrigger className="w-full min-w-0 justify-between gap-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {CONTENT_RATING_OPTIONS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/50 bg-background/70 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Tags
                    </p>
                    <TagsDropdown
                      language={language}
                      selectedTagIds={selectedTagIds}
                      tagFilterMode={tagFilterMode}
                      triggerClassName="min-w-0"
                      onChange={handleTagsChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isFetching && <MangasSkeleton layout={layoutMode} />}

          {isError && (
            <ErrorMessage message="Erreur lors du chargement des mangas." />
          )}

          {!isLoading && !isError && (
            <MangasView mangas={data?.mangas} layout={layoutMode} />
          )}
        </div>
      </section>

      {/* No need to check for layout shift because it doesn't render if the mangas are not loaded */}
      <div className="mb-8 max-w-7xl mx-auto px-4">
        <MangaPagination
          currentPage={page}
          total={data?.total}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
