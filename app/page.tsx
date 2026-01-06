"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Manga = {
  id: string;
  title: string;
  coverUrl: string | null;
};

export default function HomePage() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const LIMIT = 24;

  useEffect(() => {
    const controller = new AbortController();

    const offset = (page - 1) * LIMIT;

    fetch(`/api/manga?title=${search}&limit=${LIMIT}&offset=${offset}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setMangas(data.mangas);
        setTotal(data.total);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [search, page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <main className="p-6">
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Rechercher un manga..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          ← Précédent
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Suivant →
        </button>
      </div>

      <div className="flex flex-wrap gap-6 mt-8 justify-center">
        {mangas.map((manga) => (
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
