# Writing Patterns

Write the smallest comment that communicates the contract. Start from the reader's decision: what does the caller, implementer, or maintainer need to know before using or changing this symbol?

## Functions and Methods

Document:

- accepted formats, ranges, units, defaults,
- meaningful empty/null/false outcomes,
- idempotency, ordering, mutability, persistence, caching,
- side effects and caller-visible lifecycle,
- intentional errors callers can handle.

Skip:

- type restatements,
- implementation steps,
- obvious parameter names,
- speculative errors not verified in code.

## Interfaces and Type Aliases

Use interface/type docs for stable contracts:

- purpose and ownership boundary,
- invariants implementations must preserve,
- property meanings when not obvious,
- generic parameter roles,
- relationship to adjacent contracts.

For config/options objects, property comments should mention defaults, units, valid values, and interactions with other properties.

## Classes and Constructors

Class comments should explain lifecycle and responsibility:

- whether instances are reusable,
- resource ownership and disposal,
- thread/concurrency assumptions,
- subclassing expectations,
- construction constraints.

Constructor comments should focus on config semantics, not object creation mechanics.

## Generics

Use `@typeParam` when the generic role is not obvious from its name or constraint:

```ts
/**
 * Maps a raw provider payload into a normalized domain event.
 *
 * @typeParam TPayload - Provider-specific payload shape accepted by the mapper.
 */
```

Avoid "The type of T." Describe the role in the contract.

## Overloads

Document overload sets at the API decision point:

- explain mode selection,
- document input combinations,
- clarify return differences,
- include examples when overload choice is easy to misuse.

Do not repeat the same long comment on every overload unless tooling requires it.

## Interface Contract and Implementation

Treat interfaces and abstract types as the source of truth. For implementation members with identical behavior:

```ts
/**
 * {@link WorkspaceMemberRepository.findActiveByUserId}
 */
```

Add implementation notes only when they matter:

- storage or transaction behavior,
- authorization context,
- framework lifecycle,
- cache invalidation,
- mapping behavior,
- additional side effects or errors.

## React Hooks and Components

For public hooks/components, document behavior that is not obvious from props:

- controlled vs uncontrolled state,
- effect timing,
- SSR/client assumptions,
- accessibility obligations,
- event ordering,
- optimistic updates and rollback behavior.

For internal UI components, prefer concise comments only when the component hides domain or framework constraints.

## Repositories, Services, and Handlers

Repository contracts should describe domain boundary and persistence semantics. Implementations should document infrastructure-specific behavior only when it affects callers.

Service functions should document transaction, auth, cache, retry, idempotency, and side effects when present.

Handlers should document request/response contract only when it is not already captured by schema, OpenAPI, route types, or framework conventions.
