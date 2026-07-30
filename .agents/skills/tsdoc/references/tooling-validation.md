# Tooling and Validation

Use existing repo tooling before suggesting new dependencies.

## Tool Roles

- `@microsoft/tsdoc`: parser and standard syntax model.
- `eslint-plugin-tsdoc`: lint feedback for malformed TSDoc comments when configured.
- TypeDoc: generated API reference from TypeScript comments.
- API Extractor: stricter API review, declaration rollups, release tags, and TSDoc conformance for published packages.
- `tsdoc.json`: declares supported custom tags for tools that read it.

## Validation Strategy

Small comment edits:

- Inspect manually with the review checklist.
- Run the narrow test/lint command only if the repo already has one and it is cheap.

Generated docs changes:

- Run the existing TypeDoc command if present.
- Check links, headings, examples, and custom tags in output or diagnostics.
- Prefer official TypeDoc behavior over assumptions from other generators.

Published package/API report changes:

- Run the existing API Extractor command if present.
- Check release tags, `@internal` behavior, declaration references, and API report diffs.

Lint feedback:

- Use the existing lint command.
- Fix syntax issues in comments without changing runtime code unless the user asked for code behavior changes.

## No-Unsolicited-Dependency Rule

Do not install TypeDoc, API Extractor, eslint plugins, or parser packages just to write comments. Recommend tooling changes only when the user asks for tooling or when the task is explicitly about generated docs/lint configuration.

## Custom Tags

If the repo uses custom tags:

- find `tsdoc.json`, TypeDoc config, API Extractor config, or eslint config,
- verify the tag kind: block, inline, or modifier,
- preserve existing supported tags,
- warn if a tag appears unsupported and generated docs may warn or render poorly.
