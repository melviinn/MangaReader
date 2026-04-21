import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMangaDescription(
  rawDescription: string | null | undefined,
  maxLength = 320,
) {
  if (!rawDescription) return "No description available.";

  const cleaned = rawDescription
    .replace(/\r/g, "")
    .replace(/\[(?:\/)?[a-z]+(?:=[^\]]+)?\]/gi, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^notes?\s*:/i.test(line))
    .filter((line) => !/^--\s*\*\*/.test(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "No description available.";
  if (cleaned.length <= maxLength) return cleaned;

  const sliced = cleaned.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const safeCut =
    lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;

  return `${safeCut.trim()}...`;
}
