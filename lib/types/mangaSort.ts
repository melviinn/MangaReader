const SORT_VALUES = [
  "popular",
  "latest",
  "top_rated",
  "trending",
  "best_match",
] as const;

type SortValue = (typeof SORT_VALUES)[number];

const DEFAULT_SORT: SortValue = "popular";

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: "Popular", value: "popular" },
  { label: "Latest", value: "latest" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Trending", value: "trending" },
  { label: "Best match", value: "best_match" },
];

const SORT_ORDER_MAP: Record<
  SortValue,
  { field: string; direction: "asc" | "desc" }
> = {
  popular: { field: "followedCount", direction: "desc" },
  latest: { field: "latestUploadedChapter", direction: "desc" },
  top_rated: { field: "rating", direction: "desc" },
  trending: { field: "updatedAt", direction: "desc" },
  best_match: { field: "relevance", direction: "desc" },
};

function normalizeSortValue(value: string | null | undefined): SortValue {
  if (!value) return DEFAULT_SORT;

  return (SORT_VALUES as readonly string[]).includes(value)
    ? (value as SortValue)
    : DEFAULT_SORT;
}

export {
  DEFAULT_SORT,
  normalizeSortValue,
  SORT_OPTIONS,
  SORT_ORDER_MAP,
  SORT_VALUES,
};

export type { SortValue };
