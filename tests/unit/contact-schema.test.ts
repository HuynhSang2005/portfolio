import { describe, expect, it } from "vitest";

import { contactSchema } from "@/features/contact/lib/contact-schema";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello, I'd like to talk about a project.",
  company: "",
  turnstileToken: "token",
};

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bad email and too-short message", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });

  it("rejects over-length fields", () => {
    expect(contactSchema.safeParse({ ...valid, name: "x".repeat(101) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, subject: "x".repeat(151) }).success).toBe(false);
  });

  it("allows optional subject and honeypot company values", () => {
    const { subject: _subject, ...withoutSubject } = { ...valid, subject: "hi" };
    expect(contactSchema.safeParse(withoutSubject).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, company: "spammy" }).success).toBe(true);
  });

  it("requires a turnstile token", () => {
    expect(contactSchema.safeParse({ ...valid, turnstileToken: "" }).success).toBe(false);
  });
});
