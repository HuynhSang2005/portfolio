import { z } from "zod";

/** ID DOM của vùng scroll chính (template parity). */
export const SCROLL_AREA_ID = "scroll-area-id";

/** Ngưỡng scroll (px) để bật hành vi navbar mobile. */
export const MOBILE_SCROLL_THRESHOLD = 20;

/** Màu theme-color meta cho light/dark mode. */
export const META_THEME_COLORS = { light: "#ffffff", dark: "#09090b" } as const;

const navIconKeys = ["home", "craft", "bookmark", "calendar"] as const;
const socialIconKeys = ["github", "linkedin", "x", "email"] as const;

/** Schema Zod cho cấu hình site — validate tại runtime và compile-time. */
export const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  email: z.email().optional(),
  navbar: z
    .array(
      z.object({
        href: z.string().startsWith("/"),
        label: z.string().min(1),
        icon: z.enum(navIconKeys),
        isNew: z.boolean().optional(),
      }),
    )
    .min(1),
  socials: z.array(
    z.object({
      name: z.string().min(1),
      url: z.string().min(1),
      icon: z.enum(socialIconKeys),
    }),
  ),
});

/** Kiểu cấu hình site sau khi parse schema. */
export type SiteConfig = z.infer<typeof siteConfigSchema>;

/** Key icon hợp lệ cho mục navbar. */
export type NavIconKey = (typeof navIconKeys)[number];

/** Key icon hợp lệ cho liên kết mạng xã hội. */
export type SocialIconKey = (typeof socialIconKeys)[number];

/** Cấu hình site tĩnh — identity owner, navbar, socials. */
export const siteConfig: SiteConfig = siteConfigSchema.parse({
  name: "Huỳnh Sang",
  tagline: "IT Student",
  navbar: [
    { href: "/", icon: "home", label: "Home" },
    { href: "/craft", icon: "craft", label: "Craft", isNew: true },
    { href: "/blog", icon: "bookmark", label: "Blog" },
  ],
  // Owner socials intentionally empty until real URLs exist — dock/drawer
  // render the social section only when this array is non-empty.
  socials: [],
});
