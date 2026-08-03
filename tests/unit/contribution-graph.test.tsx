import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
  type Activity,
} from "@/components/ui/contribution-graph";

const sampleData: Activity[] = [
  { date: "2026-07-27", count: 3, level: 1 },
  { date: "2026-07-28", count: 0, level: 0 },
  { date: "2026-07-29", count: 12, level: 4 },
];

function renderGraph(data: Activity[]) {
  return render(
    <ContributionGraph data={data} fontSize={11} blockSize={9} blockMargin={3}>
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphTotalCount />
        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>,
  );
}

describe("ContributionGraph", () => {
  it("renders nothing for empty data", () => {
    const { container } = renderGraph([]);
    expect(container.firstChild).toBeNull();
  });

  it("interpolates total count and computed year (no stale label)", () => {
    renderGraph(sampleData);
    expect(screen.getByText("15 contributions in 2026")).toBeTruthy();
  });

  it("renders a block per day with level data attributes", () => {
    const { container } = renderGraph(sampleData);
    const rects = container.querySelectorAll("rect[data-level]");
    expect(rects.length).toBe(3);
    expect(container.querySelector('rect[data-level="4"]')).toBeTruthy();
  });
});
