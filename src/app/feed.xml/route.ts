import { SITE_URL, siteConfig } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/data/posts";

/** Escape ký tự đặc biệt XML cho title/description trong feed. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed cho blog — `/feed.xml`. */
export async function GET() {
  const posts = await getAllBlogPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return [
        "<item>",
        `<title>${escapeXml(post.metadata.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<description>${escapeXml(post.metadata.description)}</description>`,
        `<pubDate>${new Date(post.metadata.date).toUTCString()}</pubDate>`,
        `<author>${escapeXml(siteConfig.name)}</author>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    `<title>${escapeXml(siteConfig.name)} — Blog</title>`,
    `<link>${SITE_URL}/blog</link>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    "<language>en</language>",
    items,
    "</channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
