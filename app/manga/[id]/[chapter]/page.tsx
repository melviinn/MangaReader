import { MangaChapterView } from "@/components/layout/Manga/MangaChapterView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter",
  description: "Read your favorite manga online for free.",
};

export default function ChapterPage() {
  return <MangaChapterView />;
}
