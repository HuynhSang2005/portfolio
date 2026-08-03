import { z } from "zod";

/** Schema Zod cho frontmatter MDX blog — validate trước khi parse post. */
export const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  author: z.string().min(1),
  published: z.boolean(),
  category: z.string().min(1),
  /** Tùy chọn — tính từ nội dung khi không có trong frontmatter (spec §7.2). */
  readTime: z
    .string()
    .regex(/^\d+ min read$/)
    .optional(),
  image: z.string().optional(),
});

/** Metadata blog sau validate; `readTime` luôn có sau bước fallback trong data layer. */
export type BlogMetadata = z.infer<typeof frontmatterSchema> & { readTime: string };

/** Post blog đã parse: metadata, slug và nội dung MDX (không frontmatter). */
export type BlogPost = {
  metadata: BlogMetadata;
  slug: string;
  content: string;
};
