import { Badge } from "@/components/ui/badge";
import { MangaType } from "@/lib/types/mangaType";
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
                ? "relative h-32 w-24 shrink-0 overflow-hidden rounded"
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
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-sm font-semibold leading-tight text-left line-clamp-2 transition-colors group-hover:text-primary">
                {manga.title}
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {manga.status && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${manga.status === "ongoing" ? "bg-primary text-primary-foreground" : "bg-green-900 text-green-300"}`}
                  >
                    {formatLabel(manga.status)}
                  </Badge>
                )}
                {manga.year && (
                  <Badge variant="secondary" className="text-xs">
                    {manga.year}
                  </Badge>
                )}
              </div>

              {manga.description && (
                <p className="text-xs text-muted-foreground line-clamp-4">
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
