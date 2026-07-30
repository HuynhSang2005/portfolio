# Source Policy

Use official sources as the authority for TSDoc behavior. Local examples and third-party skills may inspire workflow shape, but they are not truth sources.

## Priority Order

1. TSDoc official site and `microsoft/tsdoc`: syntax, tag kinds, parser behavior, declaration references, standard tags.
2. TypeDoc official docs: generated documentation behavior, supported tags, custom tag configuration, rendering, link resolution.
3. TypeScript official docs: JSDoc support in JavaScript and what documentation tags apply in TypeScript files.
4. Existing repository style: naming, language, doc depth, local tooling, published API conventions.
5. Third-party articles or local downloaded skills: secondary examples only.

If sources conflict for `.ts` or `.tsx` doc comments, prefer TSDoc syntax unless the task explicitly targets TypeScript's JavaScript JSDoc mode.

## Official Links

- TSDoc: https://tsdoc.org/
- TSDoc GitHub: https://github.com/microsoft/tsdoc
- TSDoc `@param`: https://tsdoc.org/pages/tags/param/
- TSDoc `@typeParam`: https://tsdoc.org/pages/tags/typeparam/
- TypeDoc tags: https://typedoc.org/documents/Tags.html
- TypeDoc TSDoc support: https://typedoc.org/documents/Doc_Comments.TSDoc_Support.html
- TypeScript JSDoc reference: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

## Verification Rules

- Use Context7 or official docs when syntax, tags, or tool behavior could have changed.
- Use Tavily or web search only against official domains when verifying TSDoc, TypeDoc, or TypeScript behavior.
- Do not copy large official docs into this skill. Distill the rule and link the source.
- Treat TypeDoc permissiveness as compatibility, not as permission to write non-standard TSDoc.
- When generated docs matter and TypeDoc accepts a comment that strict TSDoc may reject, prefer strict TSDoc unless local tooling intentionally requires the looser form.
