import { Badge } from "@/components/ui/badge";
import { MangaType } from "@/lib/types/mangaType";
import { FavouriteIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

interface MangasViewProps {
  mangas?: MangaType[];
  layout?: "grid" | "compact";
}

const MangasView = ({ mangas, layout = "grid" }: MangasViewProps) => {
  const formatLabel = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  if (!mangas?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-muted-foreground text-lg">No manga found.</div>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Try adjusting your search terms
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        layout === "compact"
          ? "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full"
      }
    >
      {mangas?.map((manga) => (
        <Link
          href={`/manga/${manga.id}`}
          key={manga.id}
          className={
            layout === "compact"
              ? "group flex items-start gap-3 rounded-lg border border-border/60 bg-card/30 p-3 transition-all duration-200 hover:border-primary/50 hover:bg-card/70"
              : "group w-full min-w-0 space-y-2 cursor-pointer rounded-md border border-border/60 bg-card/30 p-1 transition-all duration-200 hover:border-primary/50 hover:bg-card/70"
          }
        >
          <div
            className={
              layout === "compact"
                ? "relative h-36 w-24 md:h-48 md:w-32 shrink-0 overflow-hidden rounded"
                : "relative aspect-2/3 w-full overflow-hidden rounded"
            }
          >
            {manga.coverUrl && (
              <Image
                src={manga.coverUrl}
                alt={manga.title}
                fill
                sizes="300px"
                className="object-cover transition-transform duration-300"
              />
            )}
          </div>

          {layout === "compact" ? (
            <div className="min-w-0 flex-1 flex flex-col space-y-2">
              <h2 className="text-base md:text-lg font-semibold leading-tight text-left line-clamp-1 md:line-clamp-2 transition-colors group-hover:text-primary">
                {manga.title}
              </h2>
              {(typeof manga.ratingAverage === "number" ||
                typeof manga.follows === "number" ||
                manga.status) && (
                <div className="flex justify-between gap-2 flex-col md:flex-row mt-1">
                  <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
                    {typeof manga.ratingAverage === "number" && (
                      <span
                        title="Average rating"
                        className="flex items-center gap-1"
                      >
                        <HugeiconsIcon
                          icon={FavouriteIcon}
                          className="text-rose-400 fill-rose-400 size-4 md:size-5"
                        />
                        {manga.ratingAverage?.toFixed(2)}
                      </span>
                    )}
                    {typeof manga.follows === "number" && (
                      <span
                        title="Followers"
                        className="flex items-center gap-1"
                      >
                        <HugeiconsIcon
                          icon={UserGroupIcon}
                          className="text-blue-400 size-4 md:size-5"
                        />
                        {manga.follows}
                      </span>
                    )}
                  </div>
                  {manga.status && (
                    <Badge variant="outline">
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <span
                          className={
                            `inline-block w-2 h-2 rounded-full mr-1 ` +
                            (manga.status === "hiatus"
                              ? "bg-primary"
                              : manga.status === "ongoing"
                                ? "bg-green-600"
                                : manga.status === "completed"
                                  ? "bg-blue-600"
                                  : manga.status === "cancelled"
                                    ? "bg-destructive"
                                    : "bg-gray-400")
                          }
                        />
                        {formatLabel(manga.status)}
                      </span>
                    </Badge>
                  )}
                </div>
              )}
              {manga.description && (
                <p className="text-[13px] text-muted-foreground line-clamp-3 md:line-clamp-4 mt-2 md:mt-8">
                  {manga.description}
                </p>
              )}
            </div>
          ) : (
            <h2 className="text-sm font-medium leading-tight text-center transition-colors group-hover:text-primary">
              {manga.title}
            </h2>
          )}
        </Link>
      ))}
    </div>
  );
};

export { MangasView };
