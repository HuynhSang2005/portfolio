# Mode Inference

Infer the documentation mode from code, config, package layout, and the user's wording. Ask only when the wrong mode would create meaningfully different documentation.

## Public API Mode

Choose `public-api` when evidence shows the symbol is consumed outside the local implementation boundary:

- exported from a package entrypoint or `exports` map,
- part of an SDK, library, reusable package, or public npm package,
- included in TypeDoc, API Extractor, declaration rollup, or API report output,
- marked with release tags such as `@public`, `@beta`, `@alpha`, or `@internal`,
- described by the user as public API, SDK, package API, generated docs, or IntelliSense for consumers.

Default depth:

- Document exported functions, classes, interfaces, type aliases, constants, and public members that affect consumers.
- Include constraints, units, defaults, side effects, lifecycle, null/empty meanings, errors, deprecation guidance, and examples when useful.
- Prefer stable wording that remains true after implementation refactors.

## Internal Codebase Mode

Choose `internal-codebase` when the symbol is primarily for app/service maintainers:

- private helpers, non-exported functions, route handlers, framework adapters, local repositories,
- app code under `app`, `server`, `routes`, `pages`, `src/internal`, or similar folders,
- no evidence of generated API docs or package consumer surface,
- user asks about internal service code, maintainability, or team docs.

Default depth:

- Document hidden contracts, invariants, domain rules, side effects, transactional behavior, cache behavior, auth assumptions, concurrency rules, or non-obvious failure modes.
- Skip comments that only paraphrase the name, signature, or obvious implementation.
- Use normal code comments for local implementation rationale that does not belong in IDE hover.

## Mixed Mode

Choose `mixed` when both public and internal concerns appear:

- monorepo with `packages` and `apps`,
- interface or abstract contract plus concrete implementation,
- exported contract backed by adapter/repository/handler code,
- public type consumes internal infrastructure context.

Default depth:

- Document the boundary contract fully.
- For implementations that exactly follow the contract, link with `{@link Interface.member}` and avoid repeating `@param` or `@returns`.
- Add implementation-specific notes only for behavior that changes caller expectations: storage, transaction, authorization, framework lifecycle, cache, side effects, additional errors.

## Ask-User Fallback

Ask one short question when evidence is inconclusive and the mode changes the output:

```text
Is this symbol part of a public package API, or is it only used inside the app?
```

If the user does not answer and the repo is ambiguous, default to `mixed`: full docs for exported contracts, minimal docs for implementation details.
