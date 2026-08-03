import { z } from "zod";

/** Schema Zod cho một testimonial trên trang Home. */
export const testimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  authorName: z.string().min(1),
  authorTagline: z.string().min(1),
  authorAvatar: z.string().optional(),
  url: z.url().optional(),
  date: z.string().min(1),
  isFeatured: z.boolean().optional(),
});

/** Kiểu testimonial sau khi parse schema. */
export type Testimonial = z.infer<typeof testimonialSchema>;

/**
 * Hàng 1 marquee: quote dài (hơn 50 ký tự).
 * PLACEHOLDER — thay bằng nội dung thật trước khi publish.
 */
export const TESTIMONIALS_ROW_1: Testimonial[] = z.array(testimonialSchema).parse([
  {
    id: "sample-t1",
    quote: "A placeholder long quote used only to exercise the testimonial marquee layout.",
    authorName: "Sample Author One",
    authorTagline: "Placeholder role",
    date: "2026-05-14",
  },
  {
    id: "sample-t2",
    quote: "Another placeholder long quote so the first marquee row loops seamlessly.",
    authorName: "Sample Author Two",
    authorTagline: "Placeholder role",
    date: "2026-02-03",
  },
]);

/**
 * Hàng 2 marquee: quote ngắn (tối đa 50 ký tự).
 * Thời lượng marquee phụ thuộc số item mỗi hàng.
 */
export const TESTIMONIALS_ROW_2: Testimonial[] = z.array(testimonialSchema).parse([
  {
    id: "sample-t3",
    quote: "Short placeholder quote.",
    authorName: "Sample Author Three",
    authorTagline: "Placeholder role",
    date: "2026-04-21",
  },
  {
    id: "sample-t4",
    quote: "Another short one.",
    authorName: "Sample Author Four",
    authorTagline: "Placeholder role",
    date: "2026-01-11",
  },
]);
