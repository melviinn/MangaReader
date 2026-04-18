import { mangaDexHeaders } from "@/lib/mangadex";
import { SORT_ORDER_MAP, normalizeSortValue } from "@/lib/types/mangaSort";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "";
  const language = searchParams.get("language") || "en";
  const limit = Number(searchParams.get("limit") || "24");
  const offset = Number(searchParams.get("offset") || "0");
  const sort = normalizeSortValue(searchParams.get("sort"));

  try {
    const url = new URL(`${process.env.BASE_API_URL}/manga`);

    if (title) {
      url.searchParams.append("title", title);
    }

    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());
    url.searchParams.append("originalLanguage[]", "ja");
    url.searchParams.append("availableTranslatedLanguage[]", language);
    url.searchParams.append("hasAvailableChapters", "true");
    url.searchParams.append("hasUnavailableChapters", "false");

    // url.searchParams.append("publicationDemographic[]", "shounen");
    url.searchParams.append("contentRating[]", "safe"); // No hentai
    // url.searchParams.append("contentRating[]", "suggestive"); // No hentai

    url.searchParams.append("includes[]", "cover_art");
    url.searchParams.append(
      `order[${SORT_ORDER_MAP[sort].field}]`,
      SORT_ORDER_MAP[sort].direction,
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: mangaDexHeaders({ "Content-Type": "application/json" }),

      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("An unexpected error occurred, please try again later.");
    }

    const data = await response.json();

    const mangas = data.data.map((manga: any) => {
      const coverArt = manga.relationships.find(
        (rel: any) => rel.type === "cover_art",
      );
      const coverFileName = coverArt?.attributes?.fileName
        ? `${coverArt.attributes.fileName}.256.jpg`
        : null;

      return {
        id: manga.id,
        title:
          manga.attributes.title["en"] ||
          Object.values(manga.attributes.title)[0],
        description:
          manga.attributes.description["en"] ||
          Object.values(manga.attributes.description || {})[0] ||
          "No description available",
        status: manga.attributes.status,
        year: manga.attributes.year,
        contentRating: manga.attributes.contentRating,
        publicationDemographic: manga.attributes.publicationDemographic,
        coverUrl: coverFileName
          ? `/api/manga/cover/${manga.id}/${encodeURIComponent(coverFileName)}`
          : null,
      };
    });

    return NextResponse.json({
      total: data.total,
      limit: data.limit,
      offset: data.offset,
      mangas,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch manga data" },
      { status: 500 },
    );
  }
}
