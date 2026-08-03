import { FloatingHeader } from "@/components/layout/floating-header";
import { ScrollArea } from "@/components/layout/scroll-area";
import { Section } from "@/components/layout/section";
import Separator from "@/components/layout/separator";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle={siteConfig.name} />
      <div className="content-wrapper">
        <div className="content">
          <Section>
            <h1 className="font-semibold text-2xl tracking-tight">{siteConfig.name}</h1>
            <p className="text-muted-foreground">{siteConfig.tagline}</p>
          </Section>
          <Separator />
          <Section>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="py-4 text-muted-foreground text-sm">
                Placeholder content block {i + 1} — replaced by the real home page in P2.
              </p>
            ))}
          </Section>
        </div>
      </div>
    </ScrollArea>
  );
}
