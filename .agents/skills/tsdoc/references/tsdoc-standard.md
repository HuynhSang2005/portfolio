# TSDoc Standard

Use TSDoc syntax for TypeScript doc comments. Do not use JSDoc type annotations as the primary style in `.ts` or `.tsx` files.

## Comment Shape

````ts
/**
 * Summary sentence.
 *
 * @remarks
 * Longer context, edge cases, lifecycle notes, or caveats.
 *
 * @typeParam T - The role of this generic parameter in the contract.
 * @param value - Semantic meaning, constraints, units, or accepted format.
 * @returns Meaning of the returned value, including meaningful empty states.
 *
 * @throws {@link DomainError}
 * Condition that causes the error.
 *
 * @example
 * ```ts
 * const result = useApi(value);
 * ```
 */
````

Omit sections that do not add value.

## Core Tags

- `@remarks`: detail too long for the summary.
- `@param name - Description.`: function or method parameter. Use the name, a hyphen, then the description.
- `@typeParam T - Description.`: generic type parameter. Use `@typeParam`, not the JavaScript-oriented generic tag.
- `@returns Description.`: what the return value means. Prefer meaningful empty/null/false cases over type restatement.
- `@deprecated Description.`: why the API is obsolete and what to use instead.
- `{@link Symbol}` or `{@link Symbol | label}`: inline references.
- `@packageDocumentation`: package-level entrypoint docs when local tooling uses it.

## Extended Tags

Use these when local tooling or generated docs benefit:

- `@defaultValue`: default value for a property, option, accessor, or field.
- `@example`: realistic usage with fenced code.
- `@throws`: intentional error conditions callers may handle.
- `@see`: related APIs, docs, RFCs, or design notes.
- `@privateRemarks`: maintainer-only notes when tooling strips or hides them.
- `{@inheritDoc}`: inherit documentation when tooling supports it and the inherited contract is truly identical.

## Release and Modifier Tags

Use release tags only when the repo publishes API reports, declaration rollups, or generated public docs:

- `@public`: stable external API.
- `@beta`: usable API that may still change.
- `@alpha`: experimental API with unsettled contract.
- `@internal`: package-internal API hidden from public docs.
- `@experimental`: use only when local tooling already prefers it.

Do not use multiple release tags on the same API unless local tooling explicitly supports that policy.

## TSDoc vs JSDoc Pitfalls

Avoid these in TypeScript TSDoc:

```ts
/**
 * @param {string} userId - User ID.
 * @return {Promise<User>} User.
 * @template T
 */
```

Prefer:

```ts
/**
 * Loads the user profile visible to the current session.
 *
 * @typeParam T - Profile projection returned to the caller.
 * @param userId - Stable user identifier from the auth domain.
 * @returns Profile data for the current session.
 */
```

TypeScript's JSDoc type annotations are mainly for JavaScript files. In TypeScript files, the signature already carries type structure; TSDoc should explain behavior and intent.

## Formatting Rules

- Keep the first sentence useful by itself in hover.
- Separate the summary from block tags with a blank line.
- Keep consecutive `@param` tags together.
- Put a blank line before `@returns`, `@throws`, and `@example` groups when it improves readability.
- Use CommonMark intentionally: backticks for identifiers and literal values, bullets for lists, fenced `ts` or `tsx` blocks for examples.
- Do not add tags for every possible section. Add only what affects correct use.
