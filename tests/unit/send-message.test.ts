import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const limitMock = vi.fn();
const getCloudflareContextMock = vi.fn();

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: (...args: unknown[]) => getCloudflareContextMock(...args),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
}));

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello, I'd like to talk about a project.",
  company: "",
  turnstileToken: "token",
};

function stubFetch(...responses: Array<{ ok: boolean; body: unknown }>) {
  const impl = responses.map(
    (r) => () => Promise.resolve(Response.json(r.body, { status: r.ok ? 200 : 500 })),
  );
  let i = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(() => impl[Math.min(i++, impl.length - 1)]!()),
  );
}

describe("sendMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
    limitMock.mockResolvedValue({ success: true });
    getCloudflareContextMock.mockResolvedValue({
      env: { CONTACT_RATE_LIMITER: { limit: limitMock } },
    });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns fieldErrors for invalid payloads", async () => {
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    const result = await sendMessage({ ...valid, email: "nope" });
    expect(result).toMatchObject({ ok: false, code: "validation" });
    if (!result.ok) expect(result.fieldErrors?.email).toBeTruthy();
  });

  it("silently succeeds on honeypot hits without calling out", async () => {
    stubFetch();
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    const result = await sendMessage({ ...valid, company: "spam" });
    expect(result).toEqual({ ok: true });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails with code 'turnstile' when siteverify rejects", async () => {
    stubFetch({ ok: true, body: { success: false } });
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    expect(await sendMessage(valid)).toEqual({ ok: false, code: "turnstile" });
  });

  it("fails with code 'rate-limited' when the limiter rejects", async () => {
    stubFetch({ ok: true, body: { success: true } });
    limitMock.mockResolvedValue({ success: false });
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    expect(await sendMessage(valid)).toEqual({ ok: false, code: "rate-limited" });
  });

  it("sends email with replyTo and returns ok on the happy path", async () => {
    stubFetch({ ok: true, body: { success: true } }, { ok: true, body: { id: "email-id" } });
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    expect(await sendMessage(valid)).toEqual({ ok: true });
    const resendCall = vi.mocked(fetch).mock.calls.at(-1)!;
    expect(resendCall[0]).toBe("https://api.resend.com/emails");
    const payload = JSON.parse(resendCall[1]?.body as string);
    expect(payload.to).toBe("owner@example.com");
    expect(payload.reply_to).toBe("jane@example.com");
  });

  it("maps Resend errors to code 'delivery'", async () => {
    stubFetch({ ok: true, body: { success: true } }, { ok: false, body: { message: "bad key" } });
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    expect(await sendMessage(valid)).toEqual({ ok: false, code: "delivery" });
  });

  it("fails rate-limited in production when the rate limiter binding is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    stubFetch({ ok: true, body: { success: true } });
    getCloudflareContextMock.mockResolvedValue({ env: {} });
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    expect(await sendMessage(valid)).toEqual({ ok: false, code: "rate-limited" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("fails rate-limited when limiter.limit throws", async () => {
    stubFetch({ ok: true, body: { success: true } });
    limitMock.mockRejectedValue(new Error("limiter unavailable"));
    const { sendMessage } = await import("@/features/contact/actions/send-message");
    expect(await sendMessage(valid)).toEqual({ ok: false, code: "rate-limited" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
