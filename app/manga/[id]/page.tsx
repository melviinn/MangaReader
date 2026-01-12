import { ChaptersList } from "@/components/layout/Manga/ChaptersList";
import { Suspense } from "react";

export default function MangaPage() {
  return (
    <Suspense fallback={<p className="text-center py-8">Chargement...</p>}>
      <ChaptersList />
    </Suspense>
  );
}
