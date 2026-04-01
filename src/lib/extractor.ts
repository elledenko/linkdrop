import { extract } from "@extractus/article-extractor";
import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export interface ExtractedContent {
  title: string | null;
  description: string | null;
  content: string | null;
  image: string | null;
  author: string | null;
  source: string | null;
  published: string | null;
}

export async function extractFromUrl(
  url: string
): Promise<ExtractedContent> {
  try {
    const article = await extract(url);

    if (!article) {
      return fallbackExtract(url);
    }

    const markdownContent = article.content
      ? turndown.turndown(article.content)
      : null;

    return {
      title: article.title || null,
      description: article.description || null,
      content: markdownContent,
      image: article.image || null,
      author: article.author || null,
      source: article.source || new URL(url).hostname,
      published: article.published || null,
    };
  } catch {
    return fallbackExtract(url);
  }
}

async function fallbackExtract(url: string): Promise<ExtractedContent> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = await response.text();

    // Extract basic OG metadata from HTML
    const getMetaContent = (property: string): string | null => {
      const match = html.match(
        new RegExp(
          `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
          "i"
        )
      );
      return match ? match[1] : null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    return {
      title: getMetaContent("og:title") || titleMatch?.[1] || null,
      description:
        getMetaContent("og:description") ||
        getMetaContent("description") ||
        null,
      content: null,
      image: getMetaContent("og:image") || null,
      author: getMetaContent("author") || null,
      source: getMetaContent("og:site_name") || new URL(url).hostname,
      published: null,
    };
  } catch {
    return {
      title: null,
      description: null,
      content: null,
      image: null,
      author: null,
      source: new URL(url).hostname,
      published: null,
    };
  }
}
