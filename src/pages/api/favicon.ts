import type { APIRoute } from "astro";

const ICON_RELATIONS = [
  "icon",
  "shortcut icon",
  "apple-touch-icon",
  "apple-touch-icon-precomposed",
];

const resolveIconUrl = (base: URL, href: string) => {
  try {
    return new URL(href, base).toString();
  } catch (error) {
    return undefined;
  }
};

const extractFaviconFromHtml = (
  html: string,
  baseUrl: URL
): string | undefined => {
  const linkRegex =
    /<link[^>]+rel=["']?([^"'>]+)["']?[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(html))) {
    const rel = match[1]?.toLowerCase().trim();
    const href = match[2]?.trim();

    if (!rel || !href || !ICON_RELATIONS.includes(rel)) {
      continue;
    }

    const resolved = resolveIconUrl(baseUrl, href);
    if (resolved) {
      return resolved;
    }
  }

  return undefined;
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const rawTarget = url.searchParams.get("url");

  if (!rawTarget) {
    return new Response(JSON.stringify({ error: "`url` query is required." }), {
      status: 400,
    });
  }

  let targetUrl: URL;
  try {
    targetUrl = rawTarget.includes("://")
      ? new URL(rawTarget)
      : new URL(`https://${rawTarget}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid target URL.";
    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: { "User-Agent": "Astro Favicon Fetcher" },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Target responded with ${response.status}`);
    }

    const html = await response.text();
    const linkIcon = extractFaviconFromHtml(html, targetUrl);

    if (linkIcon) {
      return new Response(
        JSON.stringify({ favicon: linkIcon, source: "link" }),
        {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    const fallback = resolveIconUrl(targetUrl, "/favicon.ico");
    if (fallback) {
      return new Response(
        JSON.stringify({ favicon: fallback, source: "default" }),
        {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    throw new Error("Unable to resolve favicon URL.");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while fetching favicon.";
    return new Response(JSON.stringify({ error: message }), { status: 502 });
  }
};
