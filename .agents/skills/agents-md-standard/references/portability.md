# Portability

Use this reference when the repo must work across multiple coding agents.

## Portable Baseline

Prefer:

- plain Markdown.
- normal headings and bullets.
- fenced command blocks.
- repo-relative paths.
- root and nested `AGENTS.md`.
- explicit scope statements.

Avoid relying on vendor-only imports, macros, frontmatter, override files, or hidden metadata unless the user targets that tool.

## Compatibility Files

Some tools also read names such as `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules`, or custom configured files. Treat those as compatibility surfaces.

If compatibility files are needed:

- keep `AGENTS.md` canonical when possible.
- avoid divergent copies.
- use short bridge files only when the tool reliably follows them.
- document tool-specific behavior as a caveat, not as the standard.

## Vendor Docs

Tool docs can answer:

- where instructions are discovered.
- how nested files are merged.
- whether override files exist.
- size or truncation limits.

They should not define which repo facts belong in AGENTS.md.
