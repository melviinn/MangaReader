import { Badge } from "@/components/ui/badge";
import type { MangaDetailsType } from "@/lib/types/mangaType";
import { formatMangaDescription } from "@/lib/utils";
import { FavouriteIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

interface MangaHeaderProps {
  manga: MangaDetailsType;
  mangaTitle?: string;
  language: string;
}

const STATUS_LABELS: Record<string, Record<string, string>> = {
  en: { ongoing: "Ongoing", completed: "Completed", cancelled: "Cancelled" },
  fr: { ongoing: "En cours", completed: "Terminé", cancelled: "Annulé" },
  ja: { ongoing: "連載中", completed: "完結", cancelled: "中止" },
};

export function MangaHeader({ manga, mangaTitle, language }: MangaHeaderProps) {
  if (!manga) return null;

  const safeDescription = formatMangaDescription(manga.description, 360);

  const statusLabel = manga.status
    ? (STATUS_LABELS[language]?.[manga.status.toLowerCase()] ?? manga.status)
    : null;

  const coverUrl = manga.coverArt?.attributes?.fileName
    ? `/api/manga/cover/${manga.id}/${encodeURIComponent(manga.coverArt.attributes.fileName)}`
    : null;

  const authorNames = manga.authors
    .filter((author) => author.role === "author")
    .map((author) => author.name);
  const artistNames = manga.authors
    .filter((author) => author.role === "artist")
    .map((artist) => artist.name);
  const fallbackContributors = manga.authors.map((person) => person.name);

  const displayAuthors =
    authorNames.length > 0
      ? Array.from(new Set(authorNames))
      : Array.from(new Set(fallbackContributors));
  const normalizedAuthorSet = new Set(
    displayAuthors.map((name) => name.trim().toLowerCase()),
  );
  const displayArtists =
    artistNames.length > 0
      ? Array.from(new Set(artistNames)).filter(
          (name) => !normalizedAuthorSet.has(name.trim().toLowerCase()),
        )
      : [];
  const authorLabel = displayAuthors.join(", ");

  const ratingLabel =
    typeof manga.ratingBayesian === "number"
      ? manga.ratingBayesian
      : typeof manga.ratingAverage === "number"
        ? manga.ratingAverage
        : null;
  const hasStats = ratingLabel !== null || typeof manga.follows === "number";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 shadow-sm md:p-6">
      <div className="space-y-3 text-center md:text-left">
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {mangaTitle}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          {statusLabel && (
            <Badge
              className={
                manga.status?.toLowerCase() === "completed"
                  ? "bg-green-900 text-green-300"
                  : manga.status?.toLowerCase() === "cancelled"
                    ? "bg-red-950 text-red-300"
                    : ""
              }
            >
              {statusLabel}
            </Badge>
          )}
          {manga.year && <Badge variant="outline">{manga.year}</Badge>}
          {/* {manga.contentRating && (
            <Badge variant="outline">{manga.contentRating}</Badge>
          )} */}
        </div>

        {displayAuthors.length > 0 && (
          <p className="text-sm text-muted-foreground">
            By{" "}
            <span className="font-medium text-foreground">{authorLabel}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[170px_minmax(0,1fr)] md:gap-6">
        {coverUrl && (
          <div className="flex justify-center md:justify-start">
            <Image
              src={coverUrl}
              alt={`${mangaTitle} cover`}
              width={288}
              height={432}
              className="h-auto w-36 rounded-lg object-cover shadow-sm sm:w-40"
            />
          </div>
        )}

        <div className="min-w-0 space-y-4 text-center md:text-left">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {safeDescription || "No description available."}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {displayArtists.length > 0 && (
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Artist{displayArtists.length > 1 ? "s" : ""}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {displayArtists.join(", ")}
                </p>
              </div>
            )}

            {hasStats && (
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Stats
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/50 px-2.5 py-2">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={FavouriteIcon}
                        size={15}
                        className="text-rose-400 fill-rose-400"
                      />
                      Rating
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {ratingLabel !== null ? ratingLabel.toFixed(2) : "N/A"}
                      <span className="text-foreground"> / 10</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/50 px-2.5 py-2">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={UserGroupIcon}
                        size={15}
                        className="text-blue-400"
                      />
                      Followers
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {typeof manga.follows === "number"
                        ? manga.follows.toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {manga.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {manga.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
