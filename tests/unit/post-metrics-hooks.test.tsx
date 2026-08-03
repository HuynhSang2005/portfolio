import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePostLikes } from "@/lib/hooks/use-post-likes";
import { usePostViews } from "@/lib/hooks/use-post-views";

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("usePostViews", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("fetches then increments exactly once per mount", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response("10")) // GET
      .mockResolvedValueOnce(new Response("11")); // POST increment
    const { result } = renderHook(() => usePostViews("post-a"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.views).toBe(11));
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(fetch).mock.calls[1]?.[1]?.method).toBe("POST");
  });
});

describe("usePostLikes", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("optimistically increments and debounces the POST", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ likes: 5, currentUserLikes: 0 })),
    );
    const { result } = renderHook(() => usePostLikes("post-a"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.likes).toBe(5));

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ likes: 7, currentUserLikes: 2 })),
    );
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.likes).toBe(7);

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    const postCall = vi.mocked(fetch).mock.calls.at(-1);
    expect(postCall?.[1]?.method).toBe("POST");
    expect(JSON.parse(postCall?.[1]?.body as string)).toEqual({ count: 2 });
  });

  it("caps at 3 likes per user", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ likes: 9, currentUserLikes: 3 })),
    );
    const { result } = renderHook(() => usePostLikes("post-a"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.currentUserLikes).toBe(3));
    act(() => result.current.increment());
    expect(result.current.likes).toBe(9);
  });
});
