"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "@wrksz/themes/client";

type TurnstileWidgetProps = {
  /** Gọi khi Turnstile cấp token mới hoặc hết hạn (token rỗng). */
  onToken: (token: string) => void;
};

/**
 * Widget Cloudflare Turnstile — đồng bộ theme sáng/tối với `@wrksz/themes`.
 *
 * Re-mount khi `resolvedTheme` đổi để widget nhận `options.theme` đúng.
 */
export function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const { resolvedTheme } = useTheme();

  if (!siteKey) return null;

  return (
    <Turnstile
      key={resolvedTheme}
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={() => onToken("")}
      options={{ theme: resolvedTheme === "dark" ? "dark" : "light" }}
    />
  );
}
