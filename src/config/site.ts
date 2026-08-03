import { z } from "zod";

/** ID DOM của vùng scroll chính (template parity). */
export const SCROLL_AREA_ID = "scroll-area-id";

/** Ngưỡng scroll (px) để bật hành vi navbar mobile. */
export const MOBILE_SCROLL_THRESHOLD = 20;

/** Màu theme-color meta cho light/dark mode. */
export const META_THEME_COLORS = { light: "#ffffff", dark: "#09090b" } as const;

const navIconKeys = ["home", "craft", "bookmark", "calendar"] as const;
const socialIconKeys = ["github", "linkedin", "x", "email"] as const;

const navItemSchema = z.object({
  href: z.string().startsWith("/"),
  label: z.string().min(1),
  icon: z.enum(navIconKeys),
  isNew: z.boolean().optional(),
});

const socialSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  icon: z.enum(socialIconKeys),
});

const skillsVennSchema = z.object({
  top: z.string().min(1),
  left: z.string().min(1),
  right: z.string().min(1),
  bottom: z.string().min(1),
});

/** Schema Zod cho cấu hình site — validate tại runtime và compile-time. */
export const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  email: z.email().optional(),
  navbar: z.array(navItemSchema).min(1),
  socials: z.array(socialSchema),
  jobTitle: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  skillsVenn: skillsVennSchema,
  githubUsername: z.string().min(1),
  pronunciationLang: z.string().min(2).default("vi-VN"),
  description: z.string().min(1),
});

/** Kiểu cấu hình site sau khi parse schema. */
export type SiteConfig = z.infer<typeof siteConfigSchema>;

/** Key icon hợp lệ cho mục navbar. */
export type NavIconKey = (typeof navIconKeys)[number];

/** Key icon hợp lệ cho liên kết mạng xã hội. */
export type SocialIconKey = (typeof socialIconKeys)[number];

/** Cấu hình site tĩnh — identity owner, navbar, socials và dữ liệu Home. */
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
  jobTitle: "IT Student",
  bio: [
    "Personal portfolio of Huỳnh Sang — an IT student building full-stack projects and documenting the process.",
    "Focus areas: web engineering, design systems, and developer tooling — with care for accessibility, performance, and craft.",
  ],
  skillsVenn: {
    top: "Full-Stack Development",
    left: "UI/UX Design",
    right: "Developer Tooling",
    bottom: "Problem Solving\n& Continuous Learning",
  },
  // Owner's GitHub username — update to the real account before relying on the heatmap.
  githubUsername: "HuynhSang",
  pronunciationLang: "vi-VN",
  description:
    "Notes on building full-stack projects, frontend architecture, and what good software looks like.",
});
