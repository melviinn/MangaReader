import { mangaDexHeaders } from "@/lib/mangadex";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ mangaId: string; filename: string }> },
) {
  try {
    const { mangaId, filename } = await props.params;

    if (!process.env.API_COVER_URL) {
      throw new Error("API_COVER_URL not set");
    }

    const coverUrl = `${process.env.API_COVER_URL}/${mangaId}/${filename}`;
    const coverRes = await fetch(coverUrl, { headers: mangaDexHeaders() });

    if (!coverRes.ok) {
      throw new Error("Failed to fetch cover image");
    }

    const arrayBuffer = await coverRes.arrayBuffer();
    const contentType = coverRes.headers.get("content-type") || "image/jpeg";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch manga cover", { status: 500 });
  }
}
