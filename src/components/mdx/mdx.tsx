import { cn } from "@/lib/utils";

type MdxProps = {
  /** Precompiled HTML from `scripts/bundle-mdx-content.ts` (Workers-safe). */
  html: string;
  className?: string;
};

/**
 * Renders build-time compiled Markdown/MDX HTML.
 * Runtime `next-mdx-remote` is avoided — Cloudflare Workers disallow `new Function`.
 */
export function MDX({ html, className }: MdxProps): React.ReactElement {
  return (
    <article className={cn("mdx-content", className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
