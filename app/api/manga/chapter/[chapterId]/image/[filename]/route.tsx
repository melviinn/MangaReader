// app/api/manga/chapter/[chapterId]/image/[filename]/route.ts
import { mangaDexHeaders } from "@/lib/mangadex";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ chapterId: string; filename: string }> },
) {
  try {
    const { chapterId, filename } = await props.params;

    const chapterMetadata = await fetch(
      `${process.env.BASE_API_URL}/at-home/server/${chapterId}`,
      { headers: mangaDexHeaders() },
    );
    if (!chapterMetadata.ok)
      throw new Error("Failed to fetch chapter metadata");

    const chapterData = await chapterMetadata.json();
    if (!chapterData.chapter.hash) {
      return new Response(JSON.stringify({ error: "Chapter unavailable" }), {
        status: 404,
      });
    }

    const url = `${chapterData.baseUrl}/data/${chapterData.chapter.hash}/${filename}`;

    const imageRes = await fetch(url, { headers: mangaDexHeaders() });
    if (!imageRes.ok) throw new Error("Failed to fetch image");

    const arrayBuffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/png";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch chapter image", { status: 500 });
  }
}
