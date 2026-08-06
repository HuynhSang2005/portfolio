import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FloatingHeader } from "@/components/layout/floating-header";
import { ScrollArea } from "@/components/layout/scroll-area";
import { MDX } from "@/components/mdx/mdx";
import { Prose } from "@/components/ui/typography";
import { SITE_URL, siteConfig } from "@/config/site";
import { PostMetrics } from "@/features/blog/components/post-metrics";
import { getAllBlogPosts, getBlogPostBySlug } from "@/features/blog/data/posts";
import { serializeJsonLd } from "@/lib/serialize-json-ld";

export const dynamicParams = true;

/** Sinh static params cho mọi post đã publish — dùng bởi Next.js SSG. */
export const generateStaticParams = async () => {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
};

/** Metadata bài viết — title và description từ frontmatter; 404 khi slug không hợp lệ. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, description } = post.metadata;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article" },
  };
}

/** Trang bài viết blog — MDX body, JSON-LD `BlogPosting`, metadata row với PostMetrics. */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, date, description, category, readTime } = post.metadata;
  const isoDate = new Date(date).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    datePublished: isoDate,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    headline: title,
    image: post.metadata.image,
    dateModified: isoDate,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: SITE_URL,
    },
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle={title} />
        <div className="layout relative z-10 content-wrapper">
          <div className="mx-auto w-full">
            <Link
              href="/blog"
              className="mb-6 hidden items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground lg:inline-flex"
            >
              <ArrowLeftIcon size={14} />
              <span>All posts</span>
            </Link>
            <div className="mb-8">
              <h1 className="scroll-m-20 font-bold text-xl tracking-tight">{title}</h1>
              <div className="mt-2 flex items-center gap-3 text-muted-foreground text-sm">
                <span className="rounded-full border px-2 py-0.5 text-xs">{category}</span>
                <span>{readTime}</span>
                <span>
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <PostMetrics slug={slug} />
              </div>
            </div>
            <Prose className="pb-12">
              <p className="lead mt-6 mb-6">{description}</p>
              <MDX html={post.html} />
            </Prose>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
