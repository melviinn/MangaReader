import { mangaDexHeaders } from "@/lib/mangadex";
import { NextRequest, NextResponse } from "next/server";

type LocalizedString = Record<string, string>;

function pickLocalized(
  value: LocalizedString | undefined,
  language: string,
  fallback = "",
): string {
  if (!value) return fallback;
  return value[language] ?? value.en ?? Object.values(value)[0] ?? fallback;
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.BASE_API_URL) {
      throw new Error("BASE_API_URL not set");
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    const url = new URL(`${process.env.BASE_API_URL}/manga/tag`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: mangaDexHeaders({ "Content-Type": "application/json" }),
      next: { revalidate: 3600 },
    });

    const payload = await response.json();

    if (
      !response.ok ||
      payload?.result !== "ok" ||
      !Array.isArray(payload?.data)
    ) {
      const errorMessage =
        payload?.errors?.[0]?.detail ||
        payload?.errors?.[0]?.title ||
        "Failed to fetch manga tags";

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status || 500 },
      );
    }

    const tags = payload.data
      .map((tag: any) => ({
        id: tag.id,
        name: pickLocalized(tag.attributes?.name, language, ""),
        group: tag.attributes?.group ?? "unknown",
      }))
      .filter((tag: { id: string; name: string; group: string }) =>
        Boolean(tag.name),
      )
      .sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name, language, { sensitivity: "base" }),
      );

    return NextResponse.json({ tags });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch manga tags" },
      { status: 500 },
    );
  }
}
