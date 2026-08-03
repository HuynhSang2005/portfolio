import { parse as parseYaml } from "yaml";

/** Kết quả parse frontmatter: object YAML và phần body còn lại. */
export type FrontmatterResult = {
  data: Record<string, unknown>;
  content: string;
};

/**
 * Parse frontmatter dạng `---\n<yaml>\n---\n`. Trả về data rỗng khi không có fence.
 *
 * Thay thế owned cho gray-matter — semantics YAML từ package `yaml`.
 */
export function parseFrontmatter(raw: string): FrontmatterResult {
  const normalized = raw.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { data: {}, content: normalized };
  }

  const end = normalized.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: normalized };
  }

  const fenceEnd = normalized.indexOf("\n", end + 4);
  const data = (parseYaml(normalized.slice(3, end)) ?? {}) as Record<string, unknown>;
  const content = fenceEnd === -1 ? "" : normalized.slice(fenceEnd + 1);
  return { data, content };
}
