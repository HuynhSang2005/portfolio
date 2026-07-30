# Review and Audit

Use a code-review stance. Findings come first, ordered by severity, with file and line references when available.

## Severity Model

- P1: Misleading or stale docs can cause incorrect API usage, security mistakes, data loss, broken migration, or wrong generated docs.
- P2: Missing important contract detail, constraint, default, side effect, error condition, or invalid TSDoc syntax.
- P3: Style, consistency, over-documentation, noisy implementation detail, or formatting issue.

## Review Checklist

- Summary is useful by itself in hover.
- Comment describes behavior, intent, constraints, or edge cases, not just the signature.
- `@param` and `@typeParam` use TSDoc hyphen syntax.
- `@returns` explains meaning and edge cases, not return type.
- `@throws` lists only intentional caller-relevant errors verified from code.
- `@deprecated` includes replacement or migration guidance.
- Examples are realistic and compile in spirit.
- Public contracts are documented enough for consumers.
- Internal docs do not create comment noise.
- Implementation docs link to contracts instead of duplicating them.
- Language is consistent and matches the repo/user choice.
- Tool-specific tags are supported by local tooling or documented as custom tags.

## Audit Output

For an explicit audit, group findings:

```markdown
**Findings**

- [P1] `src/api/users.ts:42` Summary says cache is bypassed, but implementation reads cache first.
- [P2] `src/client.ts:87` Missing constraint for `timeoutMs`; implementation rejects values below `100`.
- [P3] `src/internal/retry.ts:14` Comment repeats the implementation and can be removed.

**Coverage**

- Public API contracts checked.
- Internal implementation comments checked for noise.
- Tooling/generator risks checked.
```

When no issues are found, say that clearly and mention residual risk, such as generated docs not being run.

## Common Findings

- Wrong mode: internal helpers documented like public SDK APIs.
- Missing hidden contract: cache, transaction, auth, retry, idempotency, lifecycle.
- Wrong syntax: JSDoc type annotations used as primary TypeScript TSDoc style.
- Speculative docs: `@throws` or defaults not supported by code.
- Stale docs: comments conflict with implementation.
- Copy/paste docs: interface docs repeated on implementations with no added value.
- Translation noise: English or Vietnamese text sounds literal instead of developer-native.
