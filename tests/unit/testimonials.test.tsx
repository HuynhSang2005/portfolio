import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TESTIMONIALS_ROW_1, TESTIMONIALS_ROW_2 } from "@/config/testimonials";
import { Testimonials } from "@/features/home/components/testimonials";

describe("Testimonials marquee", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders each row's items twice (seamless loop) sorted by date", () => {
    const { container } = render(<Testimonials />);
    const row1Quotes = container.querySelectorAll("blockquote");
    // (2 + 2) rows × 2 duplication
    expect(row1Quotes.length).toBe((TESTIMONIALS_ROW_1.length + TESTIMONIALS_ROW_2.length) * 2);
  });

  it("derives duration from item count and reverses row 2", () => {
    const { container } = render(<Testimonials />);
    const animated = Array.from(
      container.querySelectorAll<HTMLElement>("[style*='marquee-scroll']"),
    );
    expect(animated).toHaveLength(2);
    expect(animated[0]?.style.animation).toContain(`${TESTIMONIALS_ROW_1.length * 5}s`);
    expect(animated[0]?.style.animationDirection).not.toBe("reverse");
    expect(animated[1]?.style.animationDirection).toBe("reverse");
  });

  it("renders author name, tagline and quote for each card", () => {
    const { getAllByText } = render(<Testimonials />);
    const first = TESTIMONIALS_ROW_1[0]!;
    expect(getAllByText(first.authorName).length).toBeGreaterThan(0);
    expect(getAllByText(first.quote).length).toBeGreaterThan(0);
  });
});
