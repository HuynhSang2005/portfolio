"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { Resend } from "resend";

import { contactSchema } from "@/features/contact/lib/contact-schema";
import { verifyTurnstile } from "@/features/contact/lib/turnstile";

/** Kết quả trả về của Server Action gửi liên hệ. */
export type SendMessageResult =
  | { ok: true }
  | {
      ok: false;
      code: "validation" | "turnstile" | "rate-limited" | "delivery";
      fieldErrors?: Record<string, string>;
    };

/** Lấy IP client từ header Cloudflare hoặc proxy. */
async function clientIp(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local-dev"
  );
}

/**
 * Server Action: validate → honeypot → Turnstile → rate limit → Resend.
 * Honeypot: trả `{ ok: true }` im lặng, không gọi outbound.
 */
export async function sendMessage(input: unknown): Promise<SendMessageResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, code: "validation", fieldErrors };
  }

  const { name, email, subject, message, company, turnstileToken } = parsed.data;

  // Honeypot: thành công im lặng — bot không nhận tín hiệu.
  if (company) {
    return { ok: true };
  }

  const ip = await clientIp();

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return { ok: false, code: "turnstile" };
  }

  // Rate limit qua Workers binding; next dev không có binding — bỏ qua (spec §6.6).
  try {
    const { env } = await getCloudflareContext({ async: true });
    const limiter = (
      env as {
        CONTACT_RATE_LIMITER?: { limit(opts: { key: string }): Promise<{ success: boolean }> };
      }
    ).CONTACT_RATE_LIMITER;
    if (limiter) {
      const { success } = await limiter.limit({ key: `contact:${ip}` });
      if (!success) {
        return { ok: false, code: "rate-limited" };
      }
    } else if (process.env.NODE_ENV === "development") {
      console.warn(
        "[contact] CONTACT_RATE_LIMITER binding unavailable in next dev — skipping rate limit",
      );
    }
  } catch {
    // getCloudflareContext throw ngoài Workers (plain next dev) — degradation dev, spec §6.6.
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    return { ok: false, code: "delivery" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: subject?.trim() ? `[Contact] ${subject}` : `[Contact] Message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      return { ok: false, code: "delivery" };
    }
  } catch {
    return { ok: false, code: "delivery" };
  }

  return { ok: true };
}
