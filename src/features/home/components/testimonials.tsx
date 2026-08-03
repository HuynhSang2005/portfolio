import {
  TESTIMONIALS_ROW_1,
  TESTIMONIALS_ROW_2,
  type Testimonial as TestimonialType,
} from "@/config/testimonials";
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/features/home/components/testimonial";

/** Sắp xếp testimonial theo trường `date` (numeric locale compare). */
function compareFn(a: TestimonialType, b: TestimonialType) {
  return a.date.localeCompare(b.date, undefined, { numeric: true });
}

/** Card đơn lẻ: quote + avatar (nếu có) + tên/tagline tác giả. */
function TestimonialCard({ authorAvatar, authorName, authorTagline, quote }: TestimonialType) {
  return (
    <Testimonial>
      <TestimonialQuote className="min-h-14">
        <p>{quote}</p>
      </TestimonialQuote>
      <TestimonialAuthor>
        <TestimonialAvatar>
          {authorAvatar && <TestimonialAvatarImg src={authorAvatar} alt={authorName} />}
          <TestimonialAvatarRing />
        </TestimonialAvatar>
        <TestimonialAuthorName>{authorName}</TestimonialAuthorName>
        <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
      </TestimonialAuthor>
    </Testimonial>
  );
}

/**
 * Một hàng marquee CSS — nhân đôi item để loop liền mạch.
 *
 * @param data - Danh sách testimonial của hàng.
 * @param reverse - Đảo hướng scroll (hàng 2).
 */
function TestimonialMarquee({
  data,
  reverse = false,
}: {
  data: TestimonialType[];
  reverse?: boolean;
}) {
  const items = [...data].sort(compareFn);
  const allItems = [...items, ...items];

  return (
    <div className="group relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background to-transparent" />

      <div
        className="flex w-max gap-2 group-hover:[animation-play-state:paused]"
        style={{
          animationName: "marquee-scroll",
          animationDuration: `${items.length * 5}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {allItems.map((item, i) => (
          <div key={`${item.id}-${i}`} className="w-[16rem] shrink-0">
            <div className="h-full rounded-xl ring-1 ring-foreground/10 transition-colors ease-out ring-inset hover:bg-accent/50">
              <TestimonialCard {...item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hai hàng marquee testimonial (RSC, CSS thuần) — hàng 1 trái, hàng 2 phải; pause khi hover.
 */
export function Testimonials() {
  return (
    <div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="overflow-hidden">
        <div className="space-y-2">
          <TestimonialMarquee data={TESTIMONIALS_ROW_1} />
          <TestimonialMarquee data={TESTIMONIALS_ROW_2} reverse />
        </div>
      </div>
    </div>
  );
}
