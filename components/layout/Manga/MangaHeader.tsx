import { Badge } from "@/components/ui/badge";
import type { MangaDetailsType } from "@/lib/types/mangaType";
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
  if (!manga || !manga.status) return null;

  const statusLabel =
    STATUS_LABELS[language]?.[manga.status.toLowerCase()] ?? manga.status;

  const coverUrl = manga.coverArt?.attributes?.fileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${manga.coverArt.attributes.fileName}`
    : null;

  return (
    <div className="bg-card w-full max-w-5xl mx-auto px-4 rounded-lg border p-4 md:p-6 shadow-md space-y-6">
      {/* Header: Infos à gauche, cover à droite */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Infos à gauche */}
        <div className="flex-1 flex flex-col gap-1 items-center">
          <div className="flex flex-wrap items-baseline text-center gap-2 border rounded-xl px-2 md:px-6 py-2 bg-primary">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary-foreground">
              {mangaTitle}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 justify-center  items-start">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={`${mangaTitle} cover`}
            width={288}
            height={432}
            className="w-72 md:w-40 lg:w-48 h-auto rounded-md object-cover self-center md:self-start"
          />
        )}

        <div className="flex flex-col space-y-4 w-full">
          {manga.description && (
            <div className="text-gray-200">{manga.description}</div>
          )}

          {/* TODO: Change to shadcn Table */}
          <table>
            <tbody>
              <tr>
                <td className="pr-4">
                  {manga.authors.length > 0 && (
                    <p className="text-gray-300 text-sm mt-1">
                      Author{manga.authors.length > 1 ? "s" : ""}:
                      <strong>
                        {" "}
                        {manga.authors.map((a) => a.name).join(", ")}
                      </strong>
                    </p>
                  )}
                </td>
                <td>
                  {manga.status && (
                    <p className="text-gray-300 text-sm mt-1">
                      Status:{" "}
                      <Badge
                        className={
                          manga.status.toLowerCase() === "completed"
                            ? "bg-green-900 text-green-300"
                            : manga.status.toLowerCase() === "cancelled"
                              ? "bg-red-950 text-red-300"
                              : ""
                        }
                      >
                        {statusLabel}
                      </Badge>
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {manga.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {manga.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs p-2 bg-[#2a2a2a] border-[#444] text-gray-300 cursor-default"
                >
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
