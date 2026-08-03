const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Xác minh token Turnstile phía server.
 * Fail-closed khi thiếu secret hoặc lỗi mạng.
 *
 * @param secret - Optional override (Cloudflare Worker binding); falls back to `process.env`.
 */
export async function verifyTurnstile(
  token: string,
  ip?: string,
  secretOverride?: string,
): Promise<boolean> {
  const secret = secretOverride ?? process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }).toString(),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
