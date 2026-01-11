// app/api/manga/chapter/[chapterId]/image/[filename]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ chapterId: string; filename: string }> }
) {
  try {
    // 1️⃣ Récupérer les params depuis la Promise
    const { chapterId, filename } = await props.params;

    // 2️⃣ Récupérer les metadata du chapitre depuis MangaDex
    const chapterRes = await fetch(
      `${process.env.BASE_API_URL}/at-home/server/${chapterId}`
    );
    if (!chapterRes.ok) throw new Error("Failed to fetch chapter metadata");
    const chapterData = await chapterRes.json();

    if (!chapterData.chapter.hash) {
      return new Response(JSON.stringify({ error: "Chapter unavailable" }), {
        status: 404,
      });
    }

    // 3️⃣ Construire l'URL de l'image Mangadex
    const url = `${chapterData.baseUrl}/data/${chapterData.chapter.hash}/${filename}`;

    // 4️⃣ Fetch l'image depuis MangaDex (proxy)
    const imageRes = await fetch(url);
    if (!imageRes.ok) throw new Error("Failed to fetch image");

    // 5️⃣ Lire le contenu et renvoyer au client
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
