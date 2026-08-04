import type { Metadata } from "next";

import { FloatingHeader } from "@/components/layout/floating-header";
import { ScrollArea } from "@/components/layout/scroll-area";
import { Section } from "@/components/layout/section";
import { RevealOnLoad } from "@/components/ui/reveal-on-load";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/contact/components/contact-form";
import { MailtoLink } from "@/features/contact/components/mailto-link";

const CONTACT_DESCRIPTION =
  "Questions, project ideas, or just want to say hi — drop a message below.";

/** Metadata trang liên hệ — title, mô tả và canonical cố định. */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description: CONTACT_DESCRIPTION,
    alternates: { canonical: "/contact" },
  };
}

/** Trang liên hệ — RSC shell với header, mailto fallback và form island. */
export default async function ContactPage() {
  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Contact" />
      <div className="layout relative z-10 content-wrapper">
        <RevealOnLoad>
          <div className="mt-6 mb-8">
            <h1 className="mb-1 font-bold text-2xl tracking-tight">Contact</h1>
            <p className="mb-4 text-muted-foreground text-sm">{CONTACT_DESCRIPTION}</p>
            {siteConfig.email ? (
              <p className="text-muted-foreground text-sm">
                Prefer email? <MailtoLink email={siteConfig.email} />
              </p>
            ) : null}
          </div>
        </RevealOnLoad>
        <Section>
          <RevealOnLoad delay={0.1}>
            <ContactForm />
          </RevealOnLoad>
        </Section>
        <Section>
          <RevealOnLoad delay={0.2}>
            {/* PLACEHOLDER copy — owner to keep or delete (spec §7 placeholder policy). */}
            <p className="font-mono text-muted-foreground text-sm">
              Typically replies within 24 hours.
            </p>
          </RevealOnLoad>
        </Section>
      </div>
    </ScrollArea>
  );
}
