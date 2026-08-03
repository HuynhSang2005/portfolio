import { z } from "zod";

/** Key icon hợp lệ cho vị trí trong kinh nghiệm làm việc. */
export const experiencePositionIconSchema = z.enum([
  "code",
  "design",
  "education",
  "business",
  "idea",
]);

/** Kiểu icon vị trí kinh nghiệm. */
export type ExperiencePositionIcon = z.infer<typeof experiencePositionIconSchema>;

/** Schema Zod cho một vị trí trong công ty. */
export const experiencePositionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Dùng định dạng "MM.YYYY" hoặc "YYYY". Bỏ `end` nếu đang giữ vai trò. */
  employmentPeriod: z.object({
    start: z.string().min(1),
    end: z.string().min(1).optional(),
  }),
  employmentType: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: experiencePositionIconSchema.optional(),
  skills: z.array(z.string().min(1)).optional(),
  isExpanded: z.boolean().optional(),
});

/** Kiểu vị trí kinh nghiệm sau khi parse schema. */
export type ExperiencePosition = z.infer<typeof experiencePositionSchema>;

/** Schema Zod cho một mục kinh nghiệm làm việc. */
export const experienceSchema = z.object({
  id: z.string().min(1),
  companyName: z.string().min(1),
  companyUrl: z.url(),
  city: z.string().min(1),
  companyLogo: z.string().optional(),
  /** Các vai trò tại công ty; sắp mới nhất trước khi hiển thị. */
  positions: z.array(experiencePositionSchema).min(1),
  isCurrentEmployer: z.boolean().optional(),
});

/** Kiểu kinh nghiệm sau khi parse schema. */
export type Experience = z.infer<typeof experienceSchema>;

/**
 * Danh sách kinh nghiệm làm việc hiển thị trên Home.
 * PLACEHOLDER — thay bằng nội dung thật trước khi publish.
 */
export const EXPERIENCES: Experience[] = z.array(experienceSchema).parse([
  {
    id: "example-co",
    companyName: "Example Co",
    companyUrl: "https://example.com",
    city: "Ho Chi Minh City",
    isCurrentEmployer: true,
    positions: [
      {
        id: "example-co-swe",
        title: "Software Engineering Trainee",
        employmentPeriod: { start: "06.2026" },
        employmentType: "Internship",
        description: "Placeholder role entry — replace with a real position.",
        skills: ["TypeScript", "React", "Next.js"],
      },
      {
        id: "example-co-junior",
        title: "Junior Web Developer",
        employmentPeriod: { start: "01.2026", end: "05.2026" },
        description: "Placeholder role entry — replace with a real position.",
        skills: ["HTML", "CSS", "JavaScript"],
      },
    ],
  },
]);
