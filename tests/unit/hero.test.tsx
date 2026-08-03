import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PronounceMyName } from "@/features/home/components/pronounce-my-name";
import { SkillsVenn } from "@/features/home/components/skills-venn";
import { siteConfig } from "@/config/site";

describe("SkillsVenn", () => {
  it("renders all four skill labels from config", () => {
    render(<SkillsVenn profileImage="/avatar.png" skills={siteConfig.skillsVenn} />);
    expect(screen.getByText(siteConfig.skillsVenn.top)).toBeTruthy();
    expect(screen.getByText(siteConfig.skillsVenn.left)).toBeTruthy();
    expect(screen.getByText(siteConfig.skillsVenn.right)).toBeTruthy();
    // `\n` trong config không khớp getByText — normalize whitespace trước khi so.
    expect(screen.getByText(siteConfig.skillsVenn.bottom.replace(/\n/g, " "))).toBeTruthy();
  });
});

describe("PronounceMyName", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("speaks the owner name with the configured language", () => {
    const speak = vi.fn();
    const cancel = vi.fn();
    vi.stubGlobal("speechSynthesis", { speak, cancel });
    render(<PronounceMyName name={siteConfig.name} />);
    fireEvent.click(screen.getByRole("button", { name: "Pronounce my name" }));
    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0]?.[0] as SpeechSynthesisUtterance;
    expect(utterance.text).toBe(siteConfig.name);
    expect(utterance.lang).toBe(siteConfig.pronunciationLang);
  });
});
