import { z } from "zod";

import { siteConfig } from "@/config/site";

const activitySchema = z.object({
  date: z.string(),
  count: z.number(),
  level: z.number(),
});

const responseSchema = z.object({
  contributions: z.array(activitySchema),
});

/** Một ngày hoạt động GitHub sau khi validate — tương đương `Activity` của heatmap. */
export type ContributionActivity = z.infer<typeof activitySchema>;

/**
 * Lấy dữ liệu heatmap GitHub qua API jogruber (spec §7.1).
 *
 * Cơ chế template: API mã nguồn mở, cache 24h (`next.revalidate`). Mọi lỗi
 * (non-OK, payload sai, mạng) trả `[]` — graph tự ẩn khi không có dữ liệu.
 *
 * @param username - Tên GitHub; mặc định `siteConfig.githubUsername`.
 * @returns Mảng hoạt động theo ngày, hoặc `[]` khi thất bại.
 */
export async function getContributions(
  username: string = siteConfig.githubUsername,
): Promise<ContributionActivity[]> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 86_400 },
    });
    if (!res.ok) {
      console.warn(`getContributions: non-OK response ${res.status}`);
      return [];
    }
    const parsed = responseSchema.safeParse(await res.json());
    if (!parsed.success) {
      console.warn("getContributions: unexpected payload shape", parsed.error);
      return [];
    }
    return parsed.data.contributions;
  } catch (error) {
    console.warn("getContributions: fetch failed", error);
    return [];
  }
}
