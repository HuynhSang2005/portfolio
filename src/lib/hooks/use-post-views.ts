"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const API_URL = (slug: string) => `/api/posts/${slug}/views`;

async function getPostViews(slug: string): Promise<number> {
  const res = await fetch(API_URL(slug));
  if (!res.ok) throw new Error("failed to fetch views");
  const body = (await res.json()) as { views: number };
  return body.views;
}

async function incrementPostViews(slug: string): Promise<number> {
  const res = await fetch(API_URL(slug), { method: "POST" });
  if (!res.ok) throw new Error("failed to increment views");
  const body = (await res.json()) as { views: number };
  return body.views;
}

/**
 * Hook lấy và tăng lượt xem bài viết — GET một lần, POST increment đúng một lần mỗi mount.
 *
 * Dùng TanStack Query với `staleTime` 60s; effect POST cập nhật cache khi thành công.
 *
 * @param slug - Slug bài viết blog.
 * @returns Số lượt xem, trạng thái loading và lỗi.
 */
export function usePostViews(slug: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["post-views", slug],
    queryFn: () => getPostViews(slug),
    staleTime: 60_000,
  });
  const incrementedRef = useRef(false);

  useEffect(() => {
    if (incrementedRef.current || !query.isFetched) return;
    incrementedRef.current = true;
    incrementPostViews(slug)
      .then((views) => queryClient.setQueryData(["post-views", slug], views))
      .catch((error) => console.log(error));
  }, [slug, queryClient, query.isFetched]);

  return {
    views: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
