const DEFAULT_MANGADEX_USER_AGENT =
  "MangaReader/1.0 (+https://github.com/melviinn)";

export function mangaDexHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);

  if (!headers.has("User-Agent")) {
    headers.set(
      "User-Agent",
      process.env.MANGADEX_USER_AGENT || DEFAULT_MANGADEX_USER_AGENT,
    );
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  return headers;
}
