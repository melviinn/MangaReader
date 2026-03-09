import { ChapterView } from "@/components/layout/Manga/ChapterView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter",
  description: "Read your favorite manga online for free.",
};

export default function ChapterPage() {
  return <ChapterView />;
}
