import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ slug: string }> };

/** GET — trả về số lượt xem hiện tại của bài viết (0 nếu chưa có bản ghi). */
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_views")
    .select("views")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return Response.json(0, { status: 200 });
  }
  return Response.json(data?.views ?? 0);
}

/** POST — tăng lượt xem qua RPC `increment_post_view` và trả về số mới. */
export async function POST(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("increment_post_view", { p_slug: slug });

  if (error || typeof data !== "number") {
    return Response.json({ error: "failed to increment" }, { status: 500 });
  }
  return Response.json(data);
}
