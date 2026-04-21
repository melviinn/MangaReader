import { mangaDexHeaders } from "@/lib/mangadex";
import { NextResponse } from "next/server";

const GROUPS_BATCH_SIZE = 100;

async function fetchMissingGroupNames(
  baseApiUrl: string,
  groupIds: string[],
): Promise<Map<string, string>> {
  const names = new Map<string, string>();

  for (let i = 0; i < groupIds.length; i += GROUPS_BATCH_SIZE) {
    const chunk = groupIds.slice(i, i + GROUPS_BATCH_SIZE);
    const groupsUrl = new URL(`${baseApiUrl}/group`);
    chunk.forEach((id) => groupsUrl.searchParams.append("ids[]", id));
    groupsUrl.searchParams.append("limit", String(chunk.length));

    const groupsRes = await fetch(groupsUrl.toString(), {
      headers: mangaDexHeaders({ "Content-Type": "application/json" }),
      next: { revalidate: 3600 },
    });

    if (!groupsRes.ok) continue;

    const groupsData = await groupsRes.json();
    for (const group of groupsData?.data ?? []) {
      if (group?.id && group?.attributes?.name) {
        names.set(group.id, group.attributes.name);
      }
    }
  }

  return names;
}

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await props.params;
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") || "en";
    const order = searchParams.get("order") === "desc" ? "desc" : "asc";

    if (!id) throw new Error("Manga ID is missing");
    if (!process.env.BASE_API_URL) throw new Error("BASE_API_URL not set");
    const baseApiUrl = process.env.BASE_API_URL;

    const url = new URL(`${baseApiUrl}/manga/${id}/feed`);
    url.searchParams.append("translatedLanguage[]", language);
    url.searchParams.append("includeUnavailable", "0");
    url.searchParams.append("includeEmptyPages", "0");
    url.searchParams.append("includeExternalUrl", "0");
    url.searchParams.append("includeFuturePublishAt", "0");
    url.searchParams.append("includes[]", "scanlation_group");
    url.searchParams.append("order[chapter]", order);
    url.searchParams.append("limit", "500");

    const res = await fetch(url.toString(), {
      headers: mangaDexHeaders({ "Content-Type": "application/json" }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch chapters");
    }

    const data = await res.json();

    const includedGroups = new Map<string, string>();
    for (const item of data.included ?? []) {
      if (item?.type === "scanlation_group") {
        includedGroups.set(item.id, item?.attributes?.name ?? "Unknown group");
      }
    }

    for (const chapter of data.data ?? []) {
      for (const rel of chapter?.relationships ?? []) {
        if (
          rel?.type === "scanlation_group" &&
          rel?.id &&
          rel?.attributes?.name
        ) {
          includedGroups.set(rel.id, rel.attributes.name);
        }
      }
    }

    const unknownGroupIds: string[] = Array.from(
      new Set(
        (data.data ?? [])
          .flatMap((chapter: any) => chapter?.relationships ?? [])
          .filter((rel: any) => rel?.type === "scanlation_group" && rel?.id)
          .map((rel: any) => rel.id)
          .filter(
            (groupId: unknown): groupId is string =>
              typeof groupId === "string" && !includedGroups.has(groupId),
          ),
      ),
    );

    if (unknownGroupIds.length > 0) {
      const fetchedGroupNames = await fetchMissingGroupNames(
        baseApiUrl,
        unknownGroupIds,
      );
      for (const [groupId, groupName] of fetchedGroupNames) {
        includedGroups.set(groupId, groupName);
      }
    }

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
        scanlationGroups: (chapter.relationships ?? [])
          .filter((rel: any) => rel?.type === "scanlation_group")
          .map((rel: any) => ({
            id: rel.id,
            name: includedGroups.get(rel.id) ?? "No group listed",
          })),
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
