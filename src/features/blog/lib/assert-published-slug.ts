import { getBlogPostBySlug } from "@/features/blog/data/posts";

/**
 * Xác nhận `slug` thuộc bài đã publish trước khi ghi metrics.
 * Trả về `true` nếu hợp lệ; dùng để chặn RPC với slug tùy ý.
 */
export async function assertPublishedSlug(slug: string): Promise<boolean> {
  const post = await getBlogPostBySlug(slug);
  return post !== undefined;
}
