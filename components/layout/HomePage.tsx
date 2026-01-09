"use client";

// Essential imports
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
// Components
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "../ErrorMessage";
import { MangasSkeleton } from "../MangasSkeleton";
import { MangasView } from "../MangasView";
import { MangaPagination } from "../pagination";
// Types
import { MangaResponseType } from "@/lib/types/mangaType";

// import {
// 	Pagination,
// 	PaginationContent,
// 	PaginationEllipsis,
// 	PaginationItem,
// 	PaginationLink,
// 	PaginationNext,
// 	PaginationPrevious,
// } from "@/components/ui/pagination";

const LIMIT = 25;

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
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<MangaResponseType, Error>({
    queryKey: ["mangas", search, page],
    queryFn: () => fetchMangas(search, page),
    staleTime: 1000 * 60,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <main className="flex flex-col items-center py-8 space-y-8">
      <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        <Input
          className="border p-2 mb-4 w-full"
          placeholder="Search mangas..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>

      {isLoading && <MangasSkeleton />}

      {isError && (
        <ErrorMessage message="Erreur lors du chargement des mangas." />
      )}

      {/* No layout shift */}
      {!isLoading && !isError && <MangasView mangas={data?.mangas} />}

      {/* No need to check for layout shift because it doesn't render if the mangas are not loaded */}
      <MangaPagination page={page} total={data?.total} onPageChange={setPage} />

      {/* <Pagination>
        <PaginationContent>
          {page !== 1 && (
            <PaginationItem
              className="cursor-pointer"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <PaginationPrevious isActive={page !== 1} />
            </PaginationItem>
          )}

          {getPages().map((p) => (
            <PaginationItem
              className="cursor-pointer"
              key={p}
              onClick={() => setPage(p)}
            >
              <PaginationLink
                isActive={p === page}
                className={
                  p === page
                    ? "bg-zinc-800 hover:bg-zinc-800/90 text-white transition-colors duration-150"
                    : "hover:bg-zinc-600 hover:text-white transition-colors duration-150"
                }
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 &&
            getPages()[getPages().length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

          {totalPages > 5 && getPages()[getPages().length - 1] < totalPages && (
            <PaginationItem
              onClick={() => setPage(totalPages)}
              className="cursor-pointer"
            >
              <PaginationLink
                className={
                  getPages()[getPages().length - 1] == totalPages
                    ? "bg-zinc-800 hover:bg-zinc-800/90 text-white transition-colors duration-150"
                    : "hover:bg-zinc-600 hover:text-white transition-colors duration-150"
                }
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="cursor-pointer"
          >
            <PaginationNext isActive={page !== totalPages} />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </main>
  );
}
