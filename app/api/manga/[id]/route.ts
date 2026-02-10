import { NextResponse } from "next/server";

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

    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch manga");
    }

    const data = await res.json();
    const manga = data.data;

    const attributes = manga.attributes;

    const authors = manga.relationships
      .filter((rel: any) => rel.type === "author")
      .map((rel: any) => ({
        id: rel.id,
        name: rel.attributes?.name ?? "Unknown",
        role: rel.type,
      }));

    const tags = attributes.tags.map((tag: any) => ({
      id: tag.id,
      name: tag.attributes.name[language] ?? tag.attributes.name.en ?? "",
    }));

    return NextResponse.json({
      id: manga.id,
      description:
        attributes.description[language] ?? attributes.description.en ?? "",
      status: attributes.status,
      year: attributes.year,
      contentRating: attributes.contentRating,
      coverArt: manga.relationships.find(
        (rel: any) => rel.type === "cover_art",
      ),
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
