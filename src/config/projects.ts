import { z } from "zod";

/** Schema Zod cho một mục dự án trên trang Home. */
export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Dùng định dạng "MM.YYYY". Bỏ `end` nếu dự án đang tiếp diễn. */
  period: z.object({
    start: z.string().min(1),
    end: z.string().min(1).optional(),
  }),
  link: z.url(),
  github: z.url().optional(),
  skills: z.array(z.string().min(1)),
  shortDescription: z.string().min(1).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  isExpanded: z.boolean().optional(),
});

/** Kiểu dự án sau khi parse schema. */
export type Project = z.infer<typeof projectSchema>;

/**
 * Danh sách dự án hiển thị trên Home.
 * PLACEHOLDER — thay bằng nội dung thật trước khi publish.
 */
export const PROJECTS: Project[] = z.array(projectSchema).parse([
  {
    id: "sample-project-alpha",
    title: "Sample Project Alpha",
    period: { start: "03.2026" },
    link: "https://example.com/alpha",
    skills: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    shortDescription: "Placeholder project entry — replace with a real case study.",
    isExpanded: true,
  },
  {
    id: "sample-project-beta",
    title: "Sample Project Beta",
    period: { start: "09.2025" },
    link: "https://example.com/beta",
    skills: ["React", "TypeScript", "Vitest"],
    shortDescription: "Placeholder project entry — replace with a real case study.",
  },
  {
    id: "sample-project-gamma",
    title: "Sample Project Gamma",
    period: { start: "01.2025", end: "08.2025" },
    link: "https://example.com/gamma",
    skills: ["Next.js", "PostgreSQL"],
    shortDescription: "Placeholder project entry — replace with a real case study.",
  },
]);
