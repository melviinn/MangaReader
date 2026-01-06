"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Manga = {
  id: string;
  title: string;
  coverUrl: string | null;
};

type MangaResponse = {
  total: number;
  limit: number;
  offset: number;
  mangas: Manga[];
};

const LIMIT = 24;

async function fetchMangas(
  search: string,
  page: number
): Promise<MangaResponse> {
  const offset = (page - 1) * LIMIT;
  const res = await fetch(
	`/api/manga?title=${search}&limit=${LIMIT}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Failed to fetch manga data");
  return res.json();
}

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
	const handler = setTimeout(() => setDebouncedValue(value), delay);
	return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<MangaResponse, Error>({
	queryKey: ["mangas", debouncedSearch, page],
	queryFn: () => fetchMangas(debouncedSearch, page),
	staleTime: 1000 * 60,
  });

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  // Génère une liste de pages à afficher (ex: 1 2 3 … 10)
  const getPages = () => {
	if (!data) return [];
	const pages = [];
	const maxPages = 5; // nombre de pages visibles
	let startPage = Math.max(1, page - 2);
	let endPage = Math.min(totalPages, startPage + maxPages - 1);

	// Ajuste le start si on est proche de la fin
	if (endPage - startPage + 1 < maxPages) {
	  startPage = Math.max(1, endPage - maxPages + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
	  pages.push(i);
	}

	return pages;
  };

  return (
	<main className="flex flex-col items-center mt-8">
	  <Input
		className="border p-2 mb-4 w-full max-w-md mx-auto"
		name="Mangas input"
		id="mangas input"
		placeholder="Search mangas..."
		value={search}
		onChange={(e) => {
		  setSearch(e.target.value);
		  setPage(1);
		}}
	  />

	  <Pagination>
		<PaginationContent>
		  <PaginationItem
			className="cursor-pointer"
			onClick={() => setPage((p) => Math.max(1, p - 1))}
		  >
			<PaginationPrevious isActive={page !== 1} />
		  </PaginationItem>

		  {getPages().map((p) => (
			<PaginationItem
			  className="cursor-pointer"
			  key={p}
			  onClick={() => setPage(p)}
			>
			  <PaginationLink isActive={p === page}>{p}</PaginationLink>
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
			  <PaginationLink>{totalPages}</PaginationLink>
			</PaginationItem>
		  )}

		  <PaginationItem
			onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
			className="cursor-pointer"
		  >
			<PaginationNext isActive={page !== totalPages} />
		  </PaginationItem>
		</PaginationContent>
	  </Pagination>

	  {isLoading && <p className="text-center mt-8">Chargement...</p>}
	  {isError && (
		<p className="text-center mt-8 text-red-500">
		  Erreur lors du chargement des mangas.
		</p>
	  )}

	  <div className="flex flex-wrap gap-6 mt-8 justify-center">
		{data?.mangas.map((manga) => (
		  <div key={manga.id} className="w-50 space-y-2">
			<div className="relative aspect-2/3 w-full overflow-hidden rounded">
			  {manga.coverUrl && (
				<Image
				  src={manga.coverUrl}
				  alt={manga.title}
				  fill
				  sizes="200px"
				  className="object-cover"
				/>
			  )}
			</div>

			<h2 className="text-sm font-medium leading-tight text-center">
			  {manga.title}
			</h2>
		  </div>
		))}
	  </div>
	</main>
  );
}
