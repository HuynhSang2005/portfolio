import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { verifyTurnstile } from "@/features/contact/lib/turnstile";

describe("verifyTurnstile", () => {
  beforeEach(() => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns true on success", async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json({ success: true }));
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(true);
    const body = vi.mocked(fetch).mock.calls[0]?.[1]?.body as string;
    expect(body).toContain("secret=secret");
    expect(body).toContain("response=tok");
    expect(body).toContain("remoteip=1.2.3.4");
  });

  it("returns false on failure or network error", async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json({ success: false }));
    await expect(verifyTurnstile("tok")).resolves.toBe(false);
    vi.mocked(fetch).mockRejectedValue(new Error("boom"));
    await expect(verifyTurnstile("tok")).resolves.toBe(false);
  });

  it("fails closed when the secret is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstile("tok")).resolves.toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});
