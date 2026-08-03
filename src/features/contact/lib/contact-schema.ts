import { z } from "zod";

/** Schema Zod dùng chung client/server cho form liên hệ. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email address"),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, "Message is too short").max(5000),
  /** Honeypot — người dùng thật không điền; bot thường điền. */
  company: z.string().max(200).optional().default(""),
  turnstileToken: z.string().min(1, "Verification required"),
});

/** Kiểu input form liên hệ sau khi parse schema. */
export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Khớp binding `ratelimits` trong wrangler (Cloudflare chỉ cho `period` 10 hoặc 60 giây).
 */
export const CONTACT_RATE_LIMIT = { limit: 3, period: 60 } as const;
