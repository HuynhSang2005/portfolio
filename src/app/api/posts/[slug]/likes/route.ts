import { z } from "zod";

import { assertPublishedSlug } from "@/features/blog/lib/assert-published-slug";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MAX_LIKES_PER_USER = 3;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const bodySchema = z.object({
  count: z.number().int().positive(),
});

type RouteContext = { params: Promise<{ slug: string }> };

const cookieName = (slug: string) => `post-likes-${slug}`;

/** Đọc cookie lượt thích của người dùng hiện tại (0–3). */
function readCookie(request: Request, name: string): number {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=(\\d+)`));
  const value = match ? Number.parseInt(match[1]!, 10) : 0;
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), MAX_LIKES_PER_USER) : 0;
}

/** GET — trả về tổng lượt thích và số lượt thích của người dùng (từ cookie). */
export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  if (!(await assertPublishedSlug(slug))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data } = await supabase.from("post_likes").select("likes").eq("slug", slug).maybeSingle();

  return Response.json({
    likes: data?.likes ?? 0,
    currentUserLikes: readCookie(request, cookieName(slug)),
  });
}

/** POST — cập nhật lượt thích (giới hạn 3/user qua cookie) qua RPC `add_post_likes`. */
export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  if (!(await assertPublishedSlug(slug))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  const current = readCookie(request, cookieName(slug));
  const allowed = Math.min(parsed.data.count, MAX_LIKES_PER_USER - current);

  if (allowed <= 0) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("post_likes")
      .select("likes")
      .eq("slug", slug)
      .maybeSingle();
    return Response.json({ likes: data?.likes ?? 0, currentUserLikes: current });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase.rpc("add_post_likes", {
    p_slug: slug,
    p_count: allowed,
  });

  if (error || typeof data !== "number") {
    return Response.json({ error: "failed to update likes" }, { status: 500 });
  }

  const response = Response.json({ likes: data, currentUserLikes: current + allowed });
  const secure = request.url.startsWith("https:") ? "; Secure" : "";
  response.headers.append(
    "set-cookie",
    `${cookieName(slug)}=${current + allowed}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${secure}`,
  );
  return response;
}
