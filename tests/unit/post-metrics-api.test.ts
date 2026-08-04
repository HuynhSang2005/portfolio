import { beforeEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();
const selectMock = vi.fn();
const eqMock = vi.fn();
const maybeSingleMock = vi.fn();
const assertPublishedSlugMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    rpc: rpcMock,
    from: () => ({ select: selectMock }),
  }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: async () => ({
    rpc: rpcMock,
    from: () => ({ select: selectMock }),
  }),
}));

vi.mock("@/features/blog/lib/assert-published-slug", () => ({
  assertPublishedSlug: (slug: string) => assertPublishedSlugMock(slug),
}));

function chainSelect(result: { data: unknown; error: unknown }) {
  selectMock.mockReturnValue({ eq: eqMock });
  eqMock.mockReturnValue({ maybeSingle: maybeSingleMock });
  maybeSingleMock.mockResolvedValue(result);
}

describe("views route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assertPublishedSlugMock.mockResolvedValue(true);
  });

  it("GET returns the current count (0 when missing)", async () => {
    chainSelect({ data: null, error: null });
    const { GET } = await import("@/app/api/posts/[slug]/views/route");
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ slug: "post-a" }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ views: 0 });
  });

  it("POST increments via RPC and returns the new count", async () => {
    rpcMock.mockResolvedValue({ data: 7, error: null });
    const { POST } = await import("@/app/api/posts/[slug]/views/route");
    const res = await POST(new Request("http://localhost", { method: "POST" }), {
      params: Promise.resolve({ slug: "post-a" }),
    });
    expect(rpcMock).toHaveBeenCalledWith("increment_post_view", { p_slug: "post-a" });
    expect(await res.json()).toEqual({ views: 7 });
    expect(res.headers.get("set-cookie")).toContain("post-views-post-a=1");
  });

  it("POST skips increment when the 24h view cookie is present", async () => {
    chainSelect({ data: { views: 7 }, error: null });
    const { POST } = await import("@/app/api/posts/[slug]/views/route");
    const res = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { cookie: "post-views-post-a=1" },
      }),
      { params: Promise.resolve({ slug: "post-a" }) },
    );
    expect(rpcMock).not.toHaveBeenCalled();
    expect(await res.json()).toEqual({ views: 7 });
  });

  it("POST returns 404 for unpublished/unknown slug", async () => {
    assertPublishedSlugMock.mockResolvedValue(false);
    const { POST } = await import("@/app/api/posts/[slug]/views/route");
    const res = await POST(new Request("http://localhost", { method: "POST" }), {
      params: Promise.resolve({ slug: "nope" }),
    });
    expect(res.status).toBe(404);
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe("likes route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assertPublishedSlugMock.mockResolvedValue(true);
  });

  it("GET returns likes and cookie-derived currentUserLikes", async () => {
    chainSelect({ data: { likes: 12 }, error: null });
    const { GET } = await import("@/app/api/posts/[slug]/likes/route");
    const req = new Request("http://localhost", {
      headers: { cookie: "post-likes-post-a=2" },
    });
    const res = await GET(req, { params: Promise.resolve({ slug: "post-a" }) });
    expect(await res.json()).toEqual({ likes: 12, currentUserLikes: 2 });
  });

  it("POST clamps to the 3-per-user cap and sets the cookie", async () => {
    rpcMock.mockResolvedValue({ data: 13, error: null });
    const { POST } = await import("@/app/api/posts/[slug]/likes/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: "post-likes-post-a=2" },
      body: JSON.stringify({ count: 5 }),
    });
    const res = await POST(req, { params: Promise.resolve({ slug: "post-a" }) });
    expect(rpcMock).toHaveBeenCalledWith("add_post_likes", { p_slug: "post-a", p_count: 1 });
    expect(res.headers.get("set-cookie")).toContain("post-likes-post-a=3");
  });

  it("POST with invalid body returns 400", async () => {
    const { POST } = await import("@/app/api/posts/[slug]/likes/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count: -1 }),
    });
    const res = await POST(req, { params: Promise.resolve({ slug: "post-a" }) });
    expect(res.status).toBe(400);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("GET returns 404 for unpublished/unknown slug", async () => {
    assertPublishedSlugMock.mockResolvedValue(false);
    const { GET } = await import("@/app/api/posts/[slug]/likes/route");
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ slug: "nope" }),
    });
    expect(res.status).toBe(404);
    expect(selectMock).not.toHaveBeenCalled();
  });
});
