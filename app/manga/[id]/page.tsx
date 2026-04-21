import { MangaChaptersList } from "@/components/layout/Manga/MangaChaptersList";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Manga",
  description: "",
};

export default function MangaPage() {
  return (
    <Suspense fallback={<p className="text-center py-8">Loading...</p>}>
      <MangaChaptersList />
    </Suspense>
  );
}
