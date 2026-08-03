import { parseFrontmatter } from "@/features/blog/lib/frontmatter";
import { frontmatterSchema, type BlogPost } from "@/features/blog/types/post";
import { computeReadTime } from "@/lib/reading-time";

import { htmlBySlug, rawMdxBySlug } from "./content.generated";

function parsePost(slug: string, raw: string): BlogPost {
  try {
    const file = parseFrontmatter(raw);
    const parsed = frontmatterSchema.parse(file.data);
    return {
      metadata: {
        ...parsed,
        readTime: parsed.readTime ?? computeReadTime(file.content),
      },
      slug,
      content: file.content,
      html: htmlBySlug[slug] ?? "",
    };
  } catch (error) {
    throw new Error(`Failed to parse blog post at ${slug}.mdx`, { cause: error });
  }
}

function allPosts(): BlogPost[] {
  return Object.entries(rawMdxBySlug).map(([slug, raw]) => parsePost(slug, raw));
}

/** Lấy tất cả post đã publish, sắp xếp theo date giảm dần. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return allPosts()
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .filter((post) => post.metadata.published);
}

/** Lấy một post theo slug; `undefined` khi slug không tồn tại hoặc chưa publish. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
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
