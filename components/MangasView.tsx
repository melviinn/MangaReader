import { MangaType } from "@/lib/types/mangaType";
import Image from "next/image";
import Link from "next/link";

type MangasViewProps = {
  mangas?: MangaType[];
};

const MangasView = ({ mangas }: MangasViewProps) => {
  return (
    <div className="flex flex-wrap gap-6 mt-8 justify-center md:max-w-3/4">
      {mangas?.length === 0 ? (
        <div className="w-full text-center text-lg tracking-tight text-muted-foreground">
          Aucun manga trouvé.
        </div>
      ) : (
        mangas?.map((manga) => (
          <Link
            href={`/manga/${manga.id}?title=${encodeURIComponent(manga.title)}`}
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
        ))
      )}
    </div>
  );
};

export { MangasView };
