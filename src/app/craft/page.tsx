import type { Metadata } from "next";

import { CraftCard } from "@/app/craft/craft-card";
import { FloatingHeader } from "@/components/layout/floating-header";
import { ScrollArea } from "@/components/layout/scroll-area";
import { MasonryGrid } from "@/components/ui/masonry-grid";
import { SITE_URL } from "@/config/site";
import { getAllCraftPosts } from "@/features/craft/data/posts";
import { serializeJsonLd } from "@/lib/serialize-json-ld";

const CRAFT_DESCRIPTION = "Interactive UI experiments and component studies.";

/** Metadata trang index craft — title, mô tả và canonical cố định. */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Craft",
    description: CRAFT_DESCRIPTION,
    alternates: { canonical: "/craft" },
  };
}

/** Trang index craft — masonry grid các experiment với JSON-LD `Blog`. */
export default async function CraftPage() {
  const posts = await getAllCraftPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Craft",
    url: `${SITE_URL}/craft`,
    description: CRAFT_DESCRIPTION,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle="Craft" />
        <div className="layout relative z-10 content-wrapper">
          <div className="mt-6 mb-4">
            <h1 className="mb-1 font-bold text-2xl tracking-tight">Craft</h1>
            <p className="mb-8 text-muted-foreground text-sm">{CRAFT_DESCRIPTION}</p>
          </div>
          <MasonryGrid
            breakpoints={{
              sm: 1,
              lg: 2,
              xl: 3,
            }}
          >
            {posts.map((post) => (
              <CraftCard
                key={post.slug}
                slug={post.slug}
                title={post.metadata.title}
                date={new Date(post.metadata.date).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
                src={post.metadata.video ? post.metadata.video : post.metadata.image}
                srcDark={post.metadata.videoDark || undefined}
                type={post.metadata.video ? "video" : "image"}
                craftType={post.metadata.type}
                theme={post.metadata.theme}
                aspectRatio={post.metadata.aspect_ratio}
              />
            ))}
          </MasonryGrid>
        </div>
      </ScrollArea>
    </>
  );
}
