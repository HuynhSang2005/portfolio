import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env/schema";

async function getServiceRoleKey(): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const cf = env as { SUPABASE_SERVICE_ROLE_KEY?: string };
    return cf.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  } catch {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
}

/**
 * Client Supabase service-role — bypass RLS, chỉ dùng trong Route Handlers/Server Actions.
 * TUYỆT ĐỐI không import từ client components hay expose qua `NEXT_PUBLIC_*`.
 *
 * @returns SupabaseClient với quyền service role.
 * @throws Khi `SUPABASE_SERVICE_ROLE_KEY` chưa được cấu hình (secret/CF binding).
 */
export async function createAdminClient(): Promise<SupabaseClient> {
  const key = await getServiceRoleKey();
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  return createSupabaseClient(NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
