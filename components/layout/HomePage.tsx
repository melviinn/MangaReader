"use client";

// Essential imports
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
// Components
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "../ErrorMessage";
import { MangasSkeleton } from "../MangasSkeleton";
import { MangasView } from "../MangasView";
import { MangaPagination } from "../Pagination";
import { SearchInput } from "../SearchInput";
// Types
import type { MangaResponseType } from "@/lib/types/mangaType";

async function fetchMangas(
  search: string,
  page: number,
): Promise<MangaResponseType> {
  const limit = 24;
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (search.trim() !== "") {
    params.append("title", search);
  }

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
  const mangasSectionRef = useRef<HTMLDivElement>(null);

  const [searchInput, setSearchInput] = useState(search);

  const { data, isLoading, isError, isFetching } = useQuery<
    MangaResponseType,
    Error
  >({
    queryKey: ["mangas", search, page],
    queryFn: () => fetchMangas(search, page),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateURL = (newSearch: string, newPage: number) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) {
      params.set("search", newSearch);
    }

    // Reset page to 1 if search changes, otherwise keep the current page
    if (newPage > 1) {
      params.set("page", String(newPage));
    }

    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submittedSearch = searchInput.trim();

    updateURL(submittedSearch, 1);
    // mangasSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() === "") {
      updateURL("", 1);
    }
  };

  const handlePageChange = (newPage: number | ((p: number) => number)) => {
    // If newPage is a function, call it with the current page to get the new page number
    const resolvedPage =
      typeof newPage === "function" ? newPage(page) : newPage;
    updateURL(search, resolvedPage);
    mangasSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="flex flex-col">
      <section className="relative bg-background overflow-hidden">
        {/* Subtle dot pattern background */}
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
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 text-pretty">
              Browse thousands of mangas from action to romance. Find your next
              adventure and start reading today.
            </p>

            {/* Search Form */}
            <form
              className="flex w-full max-w-xl items-center gap-3"
              onSubmit={handleSubmit}
            >
              <SearchInput
                placeholder="Search mangas..."
                type="text"
                value={searchInput}
                onChange={onChangeValue}
              />
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>

            {/* Stats */}
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

      <section ref={mangasSectionRef} className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* {isLoading && <MangasSkeleton />} */}

          {isFetching && <MangasSkeleton />}

          {isError && (
            <ErrorMessage message="Erreur lors du chargement des mangas." />
          )}

          {!isLoading && !isError && (
            <>
              <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold text-card-foreground">
                  {search ? `Results for "${search}"` : "Popular Manga"}
                </h2>
              </div>
              <MangasView mangas={data?.mangas} />
            </>
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
