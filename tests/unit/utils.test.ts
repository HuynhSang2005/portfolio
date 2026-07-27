import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";
import { publicEnvSchema } from "@/lib/env/schema";

describe("cn", () => {
  it("merges class names", () => {
    const hidden = false;
    expect(cn("px-2", "py-1", hidden && "hidden", "px-4")).toBe("py-1 px-4");
  });
});

describe("publicEnvSchema", () => {
  it("accepts valid public env", () => {
    const result = publicEnvSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing values", () => {
    const result = publicEnvSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    });
    expect(result.success).toBe(false);
  });
});
