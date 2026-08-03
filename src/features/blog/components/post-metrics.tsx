"use client";

import { HeartIcon } from "lucide-react";
import { motion } from "motion/react";

import { usePostLikes } from "@/lib/hooks/use-post-likes";
import { usePostViews } from "@/lib/hooks/use-post-views";
import { cn } from "@/lib/utils";

/**
 * Client island hiển thị lượt xem và nút thích trong metadata row bài viết.
 *
 * @param props.slug - Slug bài viết để gọi API views/likes.
 */
export function PostMetrics({ slug }: { slug: string }) {
  const { views } = usePostViews(slug);
  const { likes, currentUserLikes, increment } = usePostLikes(slug);
  const hasLiked = (currentUserLikes ?? 0) > 0;

  return (
    <span className="flex items-center gap-3">
      <span>{views === undefined ? "–" : `${views} views`}</span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={increment}
        aria-label={hasLiked ? "Liked" : "Like this post"}
        className={cn(
          "flex items-center gap-1 transition-colors",
          hasLiked ? "text-red-500" : "hover:text-foreground",
        )}
      >
        <HeartIcon className={cn("size-4", hasLiked && "fill-current")} />
        <span>{likes === undefined ? "–" : likes}</span>
      </motion.button>
    </span>
  );
}
