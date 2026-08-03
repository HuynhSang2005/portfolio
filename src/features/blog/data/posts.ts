import fs from "node:fs";
import path from "node:path";

import { parseFrontmatter } from "@/features/blog/lib/frontmatter";
import { frontmatterSchema, type BlogPost } from "@/features/blog/types/post";
import { computeReadTime } from "@/lib/reading-time";

const CONTENT_DIR = path.join(process.cwd(), "src/features/blog/content");

function parsePost(filePath: string): BlogPost {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const file = parseFrontmatter(raw);
    const parsed = frontmatterSchema.parse(file.data);
    const slug = path.basename(filePath, path.extname(filePath));
    return {
      metadata: {
        ...parsed,
        readTime: parsed.readTime ?? computeReadTime(file.content),
      },
      slug,
      content: file.content,
    };
  } catch (error) {
    throw new Error(`Failed to parse blog post at ${filePath}`, { cause: error });
  }
}

/** Lấy tất cả post đã publish, sắp xếp theo date giảm dần. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(CONTENT_DIR).filter((file) => path.extname(file) === ".mdx");
  const posts = files.map((file) => parsePost(path.join(CONTENT_DIR, file)));
  return posts
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .filter((post) => post.metadata.published);
}

/** Lấy một post theo slug; `undefined` khi slug không tồn tại hoặc chưa publish. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const post = parsePost(filePath);
  if (!post.metadata.published) {
    return undefined;
  }
  return post;
}
