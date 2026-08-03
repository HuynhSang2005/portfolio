import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

/**
 * Edge middleware for Supabase session refresh.
 *
 * Next.js 16 prefers `proxy.ts` (Node), but `@opennextjs/cloudflare@1.20.2`
 * still hard-fails Node middleware builds. Keep the deprecated `middleware.ts`
 * Edge convention until OpenNext ships proxy.ts support on npm.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
