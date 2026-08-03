"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const API_URL = (slug: string) => `/api/posts/${slug}/likes`;
const MAX_LIKES_PER_USER = 3;

/** Payload lượt thích từ API — tổng và số lượt của người dùng hiện tại (cookie, tối đa 3). */
export type LikesPayload = {
  likes: number;
  currentUserLikes: number;
};

async function getPostLikes(slug: string): Promise<LikesPayload> {
  const res = await fetch(API_URL(slug));
  if (!res.ok) throw new Error("failed to fetch likes");
  return res.json();
}

async function updatePostLikes(slug: string, count: number): Promise<LikesPayload> {
  const res = await fetch(API_URL(slug), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
  });
  if (!res.ok) throw new Error("failed to update likes");
  return res.json();
}

/**
 * Hook lượt thích bài viết — optimistic +1, debounce POST 1s, giới hạn 3 lượt/người dùng.
 *
 * @param slug - Slug bài viết blog.
 * @returns Tổng lượt thích, lượt của user, trạng thái và `increment()` để thích thêm.
 */
export function usePostLikes(slug: string) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["post-likes", slug] as const, [slug]);
  const query = useQuery({
    queryKey,
    queryFn: () => getPostLikes(slug),
    staleTime: 60_000,
  });

  const [batchedLikes, setBatchedLikes] = useState(0);

  const increment = () => {
    const data = queryClient.getQueryData<LikesPayload>(queryKey);
    if (!data || data.currentUserLikes >= MAX_LIKES_PER_USER) return;

    queryClient.setQueryData<LikesPayload>(queryKey, {
      likes: data.likes + 1,
      currentUserLikes: data.currentUserLikes + 1,
    });
    setBatchedLikes((b) => b + 1);
  };

  useEffect(() => {
    if (batchedLikes === 0) return;
    const timeout = setTimeout(() => {
      updatePostLikes(slug, batchedLikes)
        .then((payload) => queryClient.setQueryData(queryKey, payload))
        .catch((error) => console.log(error));
      setBatchedLikes(0);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [batchedLikes, slug, queryClient, queryKey]);

  return {
    currentUserLikes: query.data?.currentUserLikes,
    likes: query.data?.likes,
    isLoading: query.isLoading,
    isError: query.isError,
    increment,
  };
}
