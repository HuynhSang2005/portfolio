---
name: tsdoc
description: Write, review, audit, and validate TypeScript TSDoc comments for public library/package APIs and application/internal code. Use for IntelliSense docs, TypeDoc or API Extractor output, TSDoc syntax, exported APIs, interfaces, classes, functions, generics, overloads, implementation comments, documentation lint feedback, and English or Vietnamese developer-native doc comments.
---

# TSDoc

Use this skill to write and review TypeScript doc comments that help a developer use or maintain an API correctly. Keep `SKILL.md` as the router: load the focused references below only when the task needs them.

## Operating Rules

1. Read the code and local repo evidence before writing or reviewing TSDoc.
2. Infer the documentation mode from evidence; ask one concise question only when the mode cannot be inferred safely.
3. Treat TSDoc official and `microsoft/tsdoc` as the syntax authority. Use TypeDoc and TypeScript docs only for their own domains.
4. Never invent defaults, thrown errors, side effects, lifecycle rules, constraints, business rules, or migration paths.
5. Let TypeScript own types. Let TSDoc explain intent, constraints, defaults, side effects, lifecycle, errors, examples, and migration guidance.
6. Match the repo or user language. Support English and Vietnamese developer-native style.

## Mode Selection

Use [mode-inference.md](references/mode-inference.md) when the task touches more than one symbol, package boundary, app boundary, or unclear visibility.

- `public-api`: exported package/library/SDK contracts, generated docs, API reports, declaration rollups, npm consumers, external users.
- `internal-codebase`: app/service/internal modules, private helpers, framework glue, route handlers, local maintainers.
- `mixed`: monorepos, boundary interfaces plus implementations, public contracts backed by internal adapters.

Depth defaults:

- Public API: document enough for a consumer to use the API without reading implementation.
- Internal code: document only non-obvious contracts, invariants, edge cases, or rationale.
- Mixed code: document boundary contracts fully; keep implementation docs concise and link to contracts when behavior matches.

## Reference Map

Load only what the task requires:

| Need                                                  | Read                                                      |
| ----------------------------------------------------- | --------------------------------------------------------- |
| Source authority, official links, conflict resolution | [source-policy.md](references/source-policy.md)           |
| Mode inference and documentation depth                | [mode-inference.md](references/mode-inference.md)         |
| TSDoc tags, syntax, JSDoc pitfalls                    | [tsdoc-standard.md](references/tsdoc-standard.md)         |
| Writing comments for symbols and patterns             | [writing-patterns.md](references/writing-patterns.md)     |
| Reviewing or auditing existing comments               | [review-audit.md](references/review-audit.md)             |
| TypeDoc, API Extractor, eslint, `tsdoc.json`          | [tooling-validation.md](references/tooling-validation.md) |
| English and Vietnamese developer style                | [language-policy.md](references/language-policy.md)       |
| Calibrated examples                                   | [examples.md](references/examples.md)                     |

## Writing Workflow

1. Identify the reader: package consumer, app maintainer, subclass author, caller, migration reader, or documentation generator.
2. Identify the mode and documentation depth.
3. Inspect implementation and related contracts for defaults, side effects, thrown errors, persistence, auth, cache, transaction, lifecycle, and edge cases.
4. Write one useful summary sentence first.
5. Add tags only when they change a developer decision.
6. Use `{@link ...}` for related API items instead of duplicating contracts.
7. Validate with the review checklist or existing tooling when the task affects generated docs.

## Review Workflow

When reviewing, lead with findings ordered by severity. Use file and line references when available.

Prioritize issues that can mislead a developer:

- stale or incorrect behavior,
- missing constraints, defaults, side effects, or error conditions,
- invalid TSDoc syntax,
- public API under-documentation,
- internal comment noise,
- language/style inconsistency,
- generated-doc rendering risk.

For full audit format, read [review-audit.md](references/review-audit.md).

## Quality Bar

A good TSDoc comment:

- stands alone in an IDE hover,
- avoids restating types from the signature,
- documents caller-visible behavior and constraints,
- omits speculative tags,
- uses examples only when they clarify real usage,
- keeps implementation details out unless they are part of the contract,
- uses a consistent English or Vietnamese developer-native voice.

Do not install or introduce documentation tooling unless the user explicitly asks for tooling changes. Prefer existing repo commands and configs.
