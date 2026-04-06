import { mangaDexHeaders } from "@/lib/mangadex";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ chapterId: string }> },
) {
  try {
    const { chapterId } = await props.params;
    const res = await fetch(
      `${process.env.BASE_API_URL}/at-home/server/${chapterId}`,
      { headers: mangaDexHeaders() },
    );

    if (!res.ok) throw new Error("Failed to fetch chapter pages");

    const data = await res.json();

    return NextResponse.json({
      baseUrl: data.baseUrl,
      hash: data.chapter.hash,
      data: data.chapter.data,
      dataSaver: data.chapter.dataSaver,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch chapter pages" },
      { status: 500 },
    );
  }
}
