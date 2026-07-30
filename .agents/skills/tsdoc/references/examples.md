# Examples

Use these to calibrate style. Do not copy them blindly.

## Public API, English

```ts
/**
 * Fetches profiles visible to the current session.
 *
 * @remarks
 * Reads from cache first. Do not use this for flows that require real-time
 * account state, such as moderation or access revocation.
 *
 * @param limit - Maximum number of profiles to return. Must be between `1` and `100`.
 * @returns Profiles in the current page. An empty array means there are no more results.
 *
 * @throws {@link RateLimitError}
 * The caller has exceeded the profile API quota.
 */
export async function fetchProfiles(limit: number): Promise<Profile[]>;
```

## Internal App Code, Vietnamese

```ts
/**
 * Build query params cho endpoint search users.
 *
 * @remarks
 * Function này chỉ serialize filter hợp lệ. Các field có giá trị `undefined`
 * sẽ bị bỏ qua để tránh gửi query rỗng lên API.
 *
 * @param filters - Search filters lấy từ form state.
 * @returns Query string không bao gồm dấu `?`.
 */
export function buildUserSearchQuery(filters: UserSearchFilters): string;
```

## Boundary Contract and Implementation

```ts
/**
 * Repository contract for workspace membership.
 *
 * @remarks
 * Implementations must enforce workspace boundaries for every read and write.
 */
export interface WorkspaceMemberRepository {
  /**
   * Finds the active member for a user in the current workspace.
   *
   * @param ctx - Transaction context for the current request.
   * @param userId - User to resolve into workspace membership.
   * @returns Active member when present; `undefined` when the user is not in the workspace.
   */
  findActiveByUserId(ctx: TransactionContext, userId: UserId): Promise<WorkspaceMember | undefined>;
}

/**
 * Drizzle implementation of {@link WorkspaceMemberRepository}.
 */
export class WorkspaceMemberDrizzleRepository implements WorkspaceMemberRepository {
  /**
   * {@link WorkspaceMemberRepository.findActiveByUserId}
   *
   * @remarks
   * Uses the transaction bound to `ctx` and maps missing rows to `undefined`.
   */
  async findActiveByUserId(
    ctx: TransactionContext,
    userId: UserId,
  ): Promise<WorkspaceMember | undefined> {
    // implementation
  }
}
```

## Bad: Type Restatement

```ts
/**
 * Gets user.
 *
 * @param userId - The user ID string.
 * @returns A Promise of User.
 */
```

Better:

```ts
/**
 * Loads the user visible to the current session.
 *
 * @param userId - Stable user identifier from the auth domain.
 * @returns User profile for the current session; `undefined` when the user is outside the workspace.
 */
```

## Bad: Speculative Error

```ts
/**
 * Parses the payload.
 *
 * @throws {@link Error}
 * Throws when parsing fails.
 */
```

Better after verifying code:

```ts
/**
 * Parses a signed webhook payload.
 *
 * @throws {@link InvalidWebhookSignatureError}
 * The signature does not match the raw request body.
 */
```
