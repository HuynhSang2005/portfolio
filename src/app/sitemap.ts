import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/data/posts";
import { getAllCraftPosts } from "@/features/craft/data/posts";

/** sitemap.xml — route tĩnh + toàn bộ blog/craft slug đã publish. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, craftPosts] = await Promise.all([getAllBlogPosts(), getAllCraftPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/blog", "/craft", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const craftRoutes: MetadataRoute.Sitemap = craftPosts.map((post) => ({
    url: `${SITE_URL}/craft/${post.slug}`,
    lastModified: new Date(post.metadata.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...craftRoutes];
}
