import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Navigation from "@/components/layout/navigation";

describe("Navigation", () => {
  it("renders null until Tasks 7-8 add dock and scroll-top", () => {
    const { container } = render(<Navigation />);
    expect(container.firstChild).toBeNull();
  });
});
