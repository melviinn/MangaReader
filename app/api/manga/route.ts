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
  const status = searchParams.get("status") || "";
  const contentRating = searchParams.get("contentRating") || "safe";
  const tagMode =
    searchParams.get("tagMode") === "exclude" ? "exclude" : "include";
  const rawTagIds = searchParams.get("tagIds") || "";
  const fallbackSingleTagId = searchParams.get("tagId") || "";
  const tagIds = rawTagIds
    .split(",")
    .map((tagId) => tagId.trim())
    .filter(Boolean);

  if (tagIds.length === 0 && fallbackSingleTagId) {
    tagIds.push(fallbackSingleTagId);
  }

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
    url.searchParams.append("contentRating[]", contentRating);
    url.searchParams.append("includes[]", "cover_art");
    if (status) {
      url.searchParams.append("status[]", status);
    }
    if (tagIds.length > 0) {
      const tagParamKey =
        tagMode === "exclude" ? "excludedTags[]" : "includedTags[]";

      tagIds.forEach((tagId) => {
        url.searchParams.append(tagParamKey, tagId);
      });
    }
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
      const errorBody = await response.text();
      throw new Error(
        `MangaDex request failed (${response.status}): ${errorBody}`,
      );
    }

    const data = await response.json();

    // Récupération des statistiques une par une (pas de batch sur MangaDex)
    const mangas = await Promise.all(
      data.data.map(async (manga: any) => {
        const coverArt = manga.relationships.find(
          (rel: any) => rel.type === "cover_art",
        );
        const coverFileName = coverArt?.attributes?.fileName
          ? `${coverArt.attributes.fileName}.256.jpg`
          : null;

        let ratingAverage: number | null = null;
        let follows: number | null = null;
        try {
          const statsUrl = new URL(
            `${process.env.BASE_API_URL}/statistics/manga/${manga.id}`,
          );
          const statsRes = await fetch(statsUrl.toString(), {
            headers: mangaDexHeaders({ "Content-Type": "application/json" }),
            next: { revalidate: 3600 },
          });
          if (statsRes.ok) {
            const statsPayload = await statsRes.json();
            const statsData = statsPayload?.statistics?.[manga.id] ?? {};
            const average = statsData?.rating?.average;
            const followsCount = statsData?.follows;
            ratingAverage =
              typeof average === "number" && Number.isFinite(average)
                ? average
                : null;
            follows =
              typeof followsCount === "number" && Number.isFinite(followsCount)
                ? followsCount
                : null;
          }
        } catch {}

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
          ratingAverage,
          follows,
        };
      }),
    );

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
