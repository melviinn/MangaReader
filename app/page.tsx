import HomePage from "@/components/layout/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MangaReader - Home",
  description: "Browse and discover thousands of manga titles for free.",
};

export default function Page() {
  return <HomePage />;
}
