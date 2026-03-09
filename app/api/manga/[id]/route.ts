import { NextResponse } from "next/server";

type LocalizedString = Record<string, string>;

function pickLocalized(
  value: LocalizedString | undefined,
  language: string,
  fallback = "",
): string {
  if (!value) return fallback;
  return value[language] ?? value.en ?? Object.values(value)[0] ?? fallback;
}

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await props.params;
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") || "en";

    if (!id) throw new Error("Manga ID is missing");
    if (!process.env.BASE_API_URL) throw new Error("BASE_API_URL not set");

    const url = new URL(`${process.env.BASE_API_URL}/manga/${id}`);
    url.searchParams.append("includes[]", "author");
    url.searchParams.append("includes[]", "artist");
    url.searchParams.append("includes[]", "cover_art");
    url.searchParams.append("includes[]", "tag");

    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const payload = await res.json();

    if (!res.ok || payload?.result !== "ok" || !payload?.data) {
      const errorMessage =
        payload?.errors?.[0]?.detail ||
        payload?.errors?.[0]?.title ||
        "Failed to fetch manga";
      return NextResponse.json(
        { error: errorMessage },
        { status: res.status || 500 },
      );
    }

    const manga = payload.data;
    const attributes = manga.attributes ?? {};
    const relationships = manga.relationships ?? [];

    const title =
      pickLocalized(attributes.title, language) ||
      pickLocalized(attributes.altTitles?.[0], language, "No title");

    const description = pickLocalized(attributes.description, language, "");

    const authors = relationships
      .filter((rel: any) => rel.type === "author" || rel.type === "artist")
      .map((rel: any) => ({
        id: rel.id,
        name: rel.attributes?.name ?? "Unknown",
        role: rel.type,
      }));

    const tags = (attributes.tags ?? []).map((tag: any) => ({
      id: tag.id,
      name: pickLocalized(tag.attributes?.name, language, ""),
    }));

    const coverArt =
      relationships.find((rel: any) => rel.type === "cover_art") ?? null;

    return NextResponse.json({
      id: manga.id,
      title,
      description,
      status: attributes.status ?? null,
      year: attributes.year ?? null,
      contentRating: attributes.contentRating ?? null,
      coverArt,
      tags,
      authors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch manga" },
      { status: 500 },
    );
  }
}
