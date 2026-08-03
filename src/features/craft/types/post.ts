import { z } from "zod";

/** Schema Zod cho frontmatter MDX craft — validate trước khi parse post. */
export const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  published: z.boolean(),
  type: z.string().min(1),
  theme: z.string().min(1),
  image: z.string().min(1),
  video: z.string().min(1),
  videoDark: z.string().min(1),
  aspect_ratio: z.number(),
});

/** Metadata craft sau validate. */
export type CraftMetadata = z.infer<typeof frontmatterSchema>;

/** Post craft đã parse: metadata, slug, raw body, và HTML đã precompile. */
export type CraftPost = {
  metadata: CraftMetadata;
  slug: string;
  content: string;
  html: string;
};
