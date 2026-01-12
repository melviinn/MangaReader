"use client";

// Essential imports
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { type FormEvent, useEffect, useRef, useState } from "react";
// Components
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "../ErrorMessage";
import { MangasSkeleton } from "../MangasSkeleton";
import { MangasView } from "../MangasView";
import { MangaPagination } from "../Pagination";
// Types
import type { MangaResponseType } from "@/lib/types/mangaType";
import { SearchInput } from "../SearchInput";

const LIMIT = 24;

async function fetchMangas(
  search: string,
  page: number
): Promise<MangaResponseType> {
  const offset = (page - 1) * LIMIT;
  const params = new URLSearchParams({
    limit: String(LIMIT),
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
  const isUserTyping = useRef(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  useEffect(() => {
    if (!isUserTyping.current) {
      const urlSearch = searchParams.get("search") || "";
      const urlPage = Number(searchParams.get("page")) || 1;

      setSearch(urlSearch);
      setSearchInput(urlSearch);
      setPage(urlPage);
    }
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery<MangaResponseType, Error>({
    queryKey: ["mangas", search, page],
    queryFn: () => fetchMangas(search, page),
    staleTime: 1000 * 60,
  });

  const updateURL = (newSearch: string, newPage: number) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) {
      params.set("search", newSearch);
    }
    if (newPage > 1) {
      params.set("page", String(newPage));
    }

    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    isUserTyping.current = false;
    setPage(1);
    setSearch(searchInput);
    updateURL(searchInput, 1);
    window.scrollTo(0, 0), { behavior: "smooth" };
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserTyping.current = true;
    setSearchInput(value);

    if (value.trim() === "") {
      setPage(1);
      setSearch("");
      updateURL("", 1);
      isUserTyping.current = false;
    }
  };

  const handlePageChange = (newPage: number | ((p: number) => number)) => {
    const resolvedPage =
      typeof newPage === "function" ? newPage(page) : newPage;
    setPage(resolvedPage);
    updateURL(search, resolvedPage);
    window.scrollTo(0, 0), { behavior: "smooth" };
  };

  return (
    <main className="flex flex-col items-center space-y-6">
      <div className="sticky top-0 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 py-4 pt-8">
        <form
          className="flex w-full max-w-md mx-auto items-center gap-2 px-4"
          onSubmit={handleSubmit}
        >
          <SearchInput
            placeholder="Search mangas..."
            type="text"
            value={searchInput}
            onChange={onChangeValue}
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {isLoading && <MangasSkeleton />}

      {isError && (
        <ErrorMessage message="Erreur lors du chargement des mangas." />
      )}

      {/* No layout shift */}
      {!isLoading && !isError && <MangasView mangas={data?.mangas} />}

      {/* No need to check for layout shift because it doesn't render if the mangas are not loaded */}
      <div className="mb-8">
        <MangaPagination
          currentPage={page}
          total={data?.total}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
