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

    const url = new URL(`${process.env.BASE_API_URL}/manga/${id}/feed`);
    url.searchParams.append("translatedLanguage[]", language);
    url.searchParams.append("includeUnavailable", "0");
    url.searchParams.append("includeEmptyPages", "0");
    url.searchParams.append("includeExternalUrl", "0");
    url.searchParams.append("includeFuturePublishAt", "0");
    url.searchParams.append("order[chapter]", "asc");
    url.searchParams.append("limit", "500");

    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch chapters");
    }

    const data = await res.json();

    const chapters = (data.data ?? [])
      .filter((chapter: any) => {
        const attributes = chapter?.attributes ?? {};
        return (
          !attributes.isUnavailable &&
          !attributes.externalUrl &&
          Number(attributes.pages ?? 0) > 0
        );
      })
      .map((chapter: any) => ({
        id: chapter.id,
        title: chapter.attributes.title,
        chapter: chapter.attributes.chapter,
        volume: chapter.attributes.volume,
        pages: chapter.attributes.pages,
        publishedAt:
          chapter.attributes.publishAt || chapter.attributes.createdAt || null,
      }));

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 },
    );
  }
}
