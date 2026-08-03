import { parseFrontmatter } from "@/features/blog/lib/frontmatter";
import { frontmatterSchema, type CraftPost } from "@/features/craft/types/post";

import { htmlBySlug, rawMdxBySlug } from "./content.generated";

function parsePost(slug: string, raw: string): CraftPost {
  try {
    const file = parseFrontmatter(raw);
    const parsed = frontmatterSchema.parse(file.data);
    return {
      metadata: parsed,
      slug,
      content: file.content,
      html: htmlBySlug[slug] ?? "",
    };
  } catch (error) {
    throw new Error(`Failed to parse craft post at ${slug}.mdx`, { cause: error });
  }
}

function allPosts(): CraftPost[] {
  return Object.entries(rawMdxBySlug).map(([slug, raw]) => parsePost(slug, raw));
}

/** Lấy tất cả craft post đã publish, sắp xếp theo date giảm dần. */
export async function getAllCraftPosts(): Promise<CraftPost[]> {
  return allPosts()
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .filter((post) => post.metadata.published);
}

/** Lấy một craft post theo slug; `undefined` khi slug không tồn tại hoặc chưa publish. */
export async function getCraftPostBySlug(slug: string): Promise<CraftPost | undefined> {
  const raw = rawMdxBySlug[slug];
  if (!raw) {
    return undefined;
  }
  const post = parsePost(slug, raw);
  if (!post.metadata.published) {
    return undefined;
  }
  return post;
}
