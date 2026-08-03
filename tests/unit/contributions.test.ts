import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getContributions } from "@/features/home/data/contributions";

const sample = {
  contributions: [
    { date: "2026-07-30", count: 5, level: 2 },
    { date: "2026-07-31", count: 0, level: 0 },
  ],
};

describe("getContributions", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns validated contributions on success", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(sample), { status: 200 }));
    const data = await getContributions("someuser");
    expect(data).toEqual(sample.contributions);
    expect(vi.mocked(fetch).mock.calls[0]?.[0]).toBe(
      "https://github-contributions-api.jogruber.de/v4/someuser?y=last",
    );
  });

  it("returns [] on non-OK response", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("nope", { status: 503 }));
    await expect(getContributions("someuser")).resolves.toEqual([]);
  });

  it("returns [] on invalid payload shape", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ contributions: [{ bad: true }] }), { status: 200 }),
    );
    await expect(getContributions("someuser")).resolves.toEqual([]);
  });

  it("returns [] when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));
    await expect(getContributions("someuser")).resolves.toEqual([]);
  });
});
