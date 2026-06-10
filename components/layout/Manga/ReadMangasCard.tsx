import { MangaType } from "@/lib/types/mangaType";
import Image from "next/image";
import Link from "next/link";

interface ReadMangasCardProps {
  readMangas: MangaType[];
}

export function ReadMangasCard({ readMangas }: ReadMangasCardProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Continue reading</h1>
      <div className="w-full flex items-stretch overflow-x-auto border border-border/60 bg-card/30 rounded-2xl gap-8 p-2 md:p-4">
        {readMangas.map((manga) => (
          <Link
            href={`/manga/${manga.id}`}
            key={manga.id}
            className="shrink-0 flex flex-col items-center gap-2 w-52 pb-4 bg-card/20 border border-border/60 rounded-md transition-transform hover:scale-[1.02] hover:cursor-pointer"
          >
            {manga.coverUrl && (
              <div className="relative h-48 w-full overflow-hidden rounded">
                <Image
                  src={manga.coverUrl}
                  alt={manga.title}
                  fill
                  sizes="128px"
                  className="object-cover object-top"
                />
              </div>
            )}
            <span className="text-sm text-center font-medium line-clamp-3 w-full px-2">
              {manga.title}
            </span>
            <hr className="border border-border/60 w-48 my-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
