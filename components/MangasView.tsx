import { MangaType } from "@/lib/types/mangaType";
import Image from "next/image";
import Link from "next/link";

type MangasViewProps = {
  mangas?: MangaType[];
};

const MangasView = ({ mangas }: MangasViewProps) => {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full">
      {mangas?.map((manga) => (
        <Link
          href={`/manga/${manga.id}`}
          key={manga.id}
          className="w-50 space-y-2 cursor-pointer hover:opacity-90 transition"
        >
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
        </Link>
      ))}
    </div>
  );
};

export { MangasView };
