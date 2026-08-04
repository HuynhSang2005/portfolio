import { assertPublishedSlug } from "@/features/blog/lib/assert-published-slug";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ slug: string }> };

/** Một lượt xem mỗi post mỗi 24h trên một trình duyệt (cookie dedupe). */
const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24;

const viewCookieName = (slug: string) => `post-views-${slug}`;

/** Kiểm tra cookie dedupe lượt xem của post. */
function hasViewedRecently(request: Request, slug: string): boolean {
  const header = request.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${viewCookieName(slug)}=1`).test(header);
}

/** GET — trả về số lượt xem hiện tại của bài viết (0 nếu chưa có bản ghi). */
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  if (!(await assertPublishedSlug(slug))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_views")
    .select("views")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return Response.json({ views: 0 }, { status: 200 });
  }
  return Response.json({ views: data?.views ?? 0 });
}

/**
 * POST — tăng lượt xem qua RPC `increment_post_view` (service role) và trả về số mới.
 * Đã xem trong 24h (cookie) thì chỉ trả count hiện tại, không tăng.
 */
export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  if (!(await assertPublishedSlug(slug))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  if (hasViewedRecently(request, slug)) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("post_views")
      .select("views")
      .eq("slug", slug)
      .maybeSingle();
    return Response.json({ views: data?.views ?? 0 });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase.rpc("increment_post_view", { p_slug: slug });

  if (error || typeof data !== "number") {
    return Response.json({ error: "failed to increment" }, { status: 500 });
  }

  const secure = request.url.startsWith("https:") ? "; Secure" : "";
  const response = Response.json({ views: data });
  response.headers.append(
    "set-cookie",
    `${viewCookieName(slug)}=1; Path=/; Max-Age=${VIEW_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${secure}`,
  );
  return response;
}
