# Language Policy

Support English and Vietnamese without treating either as translation output. Write in a developer-native voice.

## Selection Rules

- Follow the user's requested language.
- If the repo has a clear existing documentation language, match it.
- For public npm/library APIs with no other signal, prefer English.
- For app/internal code in a Vietnamese team, Vietnamese developer style is valid.
- In mixed repos, public contracts may be English while internal implementation docs follow repo/team style.
- Keep one primary language per docblock. Preserve identifiers, API names, error classes, quoted strings, and domain terms.

## English Engineering Style

Use direct, practical engineering prose:

- "Fetches profiles visible to the current session."
- "Reads from cache first. Do not use this for flows that require real-time account state."
- "An empty array means there are no more results."

Avoid:

- marketing words,
- filler such as "seamlessly" or "robustly",
- type restatement,
- translation-like phrasing,
- vague claims like "handles data efficiently."

## Vietnamese Developer Style

Vietnamese docs should sound like how Vietnamese developers explain code to each other. Do not force-translate common technical terms.

Keep terms such as:

- function,
- caller,
- cache,
- session,
- request,
- response,
- payload,
- schema,
- handler,
- repository,
- middleware,
- route,
- endpoint,
- service,
- transaction,
- retry,
- fallback,
- runtime,
- hook,
- component.

Use Vietnamese where it is natural and precise:

- giới hạn,
- mặc định,
- ràng buộc,
- trạng thái,
- dữ liệu,
- quyền truy cập,
- không hợp lệ,
- đã hết dữ liệu,
- không tìm thấy,
- cần đồng bộ.

Examples of good Vietnamese style:

```ts
/**
 * Parse webhook payload từ payment provider.
 *
 * @remarks
 * Function này chỉ validate shape và signature. Business side effects như tạo invoice
 * hoặc update subscription phải được xử lý ở handler phía trên.
 *
 * @param rawBody - Request body nguyên bản, chưa qua JSON parser.
 * @param signature - Giá trị header dùng để verify payload.
 * @returns Payload đã verify và narrow về event type tương ứng.
 */
```

```ts
/**
 * Tìm member active theo user ID trong workspace hiện tại.
 *
 * @param ctx - Transaction context của request hiện tại.
 * @param userId - User cần resolve membership.
 * @returns Active member nếu tồn tại; `undefined` nếu user chưa thuộc workspace.
 */
```

Avoid stiff translation:

- Do not translate "function" as a forced Vietnamese term when the team uses "function".
- Do not translate "cache", "payload", "handler", or "repository" when English is the natural dev term.
- Do not create half-English grammar if a clean Vietnamese sentence is clearer.
