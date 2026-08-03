import type { Metadata } from "next";
import Link from "next/link";

import { FloatingHeader } from "@/components/layout/floating-header";
import { ScrollArea } from "@/components/layout/scroll-area";
import { getAllBlogPosts } from "@/features/blog/data/posts";
import { serializeJsonLd } from "@/lib/serialize-json-ld";

const BLOG_DESCRIPTION =
  "Thoughts on software engineering, UI architecture, and building things that work.";

/** Metadata trang index blog — title và mô tả cố định. */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: BLOG_DESCRIPTION,
  };
}

/** Trang index blog — danh sách post đã publish với JSON-LD `Blog`. */
export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle="Blog" />
        <div className="layout relative z-10 content-wrapper">
          <div className="mt-6 mb-12">
            <h1 className="mb-1 font-bold text-2xl tracking-tight">Blog</h1>
            <p className="mb-8 text-muted-foreground text-sm">{BLOG_DESCRIPTION}</p>
            <div className="flex flex-col gap-0">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-1 border-b border-dashed py-5 transition-colors hover:bg-accent/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <div className="flex-1">
                    <h2 className="font-medium text-sm leading-snug group-hover:underline">
                      {post.metadata.title}
                    </h2>
                    <p className="mt-1 line-clamp-1 text-muted-foreground text-xs">
                      {post.metadata.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-muted-foreground text-xs">
                    <span className="rounded-full border px-2 py-0.5">
                      {post.metadata.category}
                    </span>
                    <span>{post.metadata.readTime}</span>
                    <span>
                      {new Date(post.metadata.date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
