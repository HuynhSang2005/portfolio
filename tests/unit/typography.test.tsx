import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Code, Heading, Prose } from "@/components/ui/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

describe("Prose", () => {
  it("applies the template prose classes", () => {
    const { container } = render(<Prose>content</Prose>);
    const el = container.firstElementChild!;
    expect(el.className).toContain("prose");
    expect(el.className).toContain("prose-zinc");
    expect(el.className).toContain("dark:prose-invert");
  });
});

describe("Heading", () => {
  it("renders plain heading without id", () => {
    render(<Heading as="h2">Title</Heading>);
    expect(screen.getByRole("heading", { level: 2 }).querySelector("a")).toBeNull();
  });

  it("renders anchor link when id is present", () => {
    render(
      <Heading as="h2" id="my-section">
        Title
      </Heading>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("#my-section");
  });
});

describe("Code", () => {
  it("styles inline code as a pill", () => {
    const { container } = render(<Code>inline</Code>);
    expect(container.querySelector("code")!.className).toContain("rounded-md");
  });

  it("leaves block code (data-language) unstyled", () => {
    const { container } = render(<Code data-language="ts">block</Code>);
    expect(container.querySelector("code")!.className).not.toContain("rounded-md");
  });
});

describe("Table", () => {
  it("wraps the table in a not-prose bordered container", () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>H</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>C</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.querySelector('[data-slot="table-container"]')!.className).toContain(
      "not-prose",
    );
  });
});
