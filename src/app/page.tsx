import type { Metadata } from "next";

import { FloatingHeader } from "@/components/layout/floating-header";
import { ScrollArea } from "@/components/layout/scroll-area";
import { Section } from "@/components/layout/section";
import Separator from "@/components/layout/separator";
import { RevealOnLoad } from "@/components/ui/reveal-on-load";
import { SITE_URL, siteConfig } from "@/config/site";
import { Experiences } from "@/features/home/components/experiences";
import { GitHubContribution } from "@/features/home/components/github-contribution";
import Info from "@/features/home/components/info";
import { PronounceMyName } from "@/features/home/components/pronounce-my-name";
import { Projects } from "@/features/home/components/projects";
import { SkillsVenn } from "@/features/home/components/skills-venn";
import { Testimonials } from "@/features/home/components/testimonials";
import { WordmarkFooter } from "@/features/home/components/wordmark-footer";
import { serializeJsonLd } from "@/lib/serialize-json-ld";

/** Metadata trang chủ — title tuyệt đối (brand + tagline), canonical gốc. */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
    description: siteConfig.description,
    alternates: { canonical: "/" },
  };
}

/** Trang chủ — composition đầy đủ các section Home theo thứ tự template. */
export default async function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: SITE_URL,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Info show={["time", "screen"]} />
      <ScrollArea useScrollAreaId className="">
        <FloatingHeader scrollTitle={siteConfig.name} />

        <Separator />

        {/* Hero Section */}
        <Section>
          {/* Khối tên là LCP — render tĩnh, không giấu sau animation. */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-2xl">{siteConfig.name}</h1>
              <PronounceMyName name={siteConfig.name} />
            </div>
            <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              {siteConfig.jobTitle}
            </p>
          </div>

          <RevealOnLoad delay={0.15} duration={0.5}>
            <div className="mt-6 space-y-3 text-foreground/70">
              {siteConfig.bio.map((paragraph, i) => (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </RevealOnLoad>

          <RevealOnLoad delay={0.3} duration={0.6}>
            <SkillsVenn
              profileImage="/assets/profile.jpg"
              skills={siteConfig.skillsVenn}
              className="mt-8"
            />
          </RevealOnLoad>
        </Section>

        <Separator />

        {/* Testimonials Section */}
        <Section>
          <Testimonials />
        </Section>

        <Separator />

        {/* GitHub Contribution Section */}
        <Section>
          <GitHubContribution />
        </Section>

        <Separator />

        {/* Projects Section */}
        <Section>
          <Projects />
        </Section>

        <Separator />

        {/* Experiences Section */}
        <Section>
          <Experiences />
        </Section>

        <Separator />

        {/* Wordmark Footer */}
        <Section className="px-0 py-0 sm:px-0 md:py-0">
          <WordmarkFooter brandName={siteConfig.name} />
        </Section>

        <Separator />
        {/* Bottom spacing — matches dock height */}
        <div className="h-[clamp(80px,10vh,200px)] shrink-0" />
      </ScrollArea>
    </>
  );
}
