import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { EXPERIENCES } from "@/config/experience";
import { PROJECTS } from "@/config/projects";
import { Experiences } from "@/features/home/components/experiences";
import { Projects } from "@/features/home/components/projects";
import { UiStoreProvider } from "@/providers/ui-store-provider";

function renderWithProvider(ui: React.ReactElement) {
  return render(<UiStoreProvider>{ui}</UiStoreProvider>);
}

describe("Projects", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a row per project with external link and hover title", () => {
    renderWithProvider(<Projects />);
    for (const project of PROJECTS) {
      const link = screen.getByRole("link", { name: new RegExp(project.title) });
      expect(link.getAttribute("href")).toBe(project.link);
      expect(link.getAttribute("target")).toBe("_blank");
    }
  });

  it("renders the fallback icon when a project has no logo", () => {
    const { container } = renderWithProvider(<Projects />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });
});

describe("Experiences", () => {
  afterEach(() => {
    cleanup();
  });

  it("opens the current employer by default", () => {
    renderWithProvider(<Experiences />);
    const current = EXPERIENCES.find((e) => e.isCurrentEmployer)!;
    const trigger = screen.getByRole("button", { name: new RegExp(current.companyName) });
    expect(trigger.hasAttribute("data-panel-open")).toBe(true);
  });

  it("renders position titles, employment type and skill tags", () => {
    renderWithProvider(<Experiences />);
    const position = EXPERIENCES[0]!.positions[0]!;
    expect(screen.getByText(new RegExp(position.title))).toBeTruthy();
    if (position.employmentType) {
      expect(screen.getByText(new RegExp(position.employmentType))).toBeTruthy();
    }
    for (const skill of position.skills ?? []) {
      expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
    }
  });

  it("closes the current employer collapsible on second trigger click", () => {
    renderWithProvider(<Experiences />);
    const current = EXPERIENCES.find((e) => e.isCurrentEmployer)!;
    const trigger = screen.getByRole("button", { name: new RegExp(current.companyName) });
    expect(trigger.hasAttribute("data-panel-open")).toBe(true);
    fireEvent.click(trigger);
    expect(trigger.hasAttribute("data-panel-open")).toBe(false);
  });
});
