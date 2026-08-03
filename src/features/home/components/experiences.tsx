"use client";

import { ArrowUpRightIcon, BriefcaseIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tag } from "@/components/ui/tag";
import { EXPERIENCES } from "@/config/experience";
import { useItemHoverSound } from "@/lib/hooks/use-item-hover-sound";

/**
 * Section Experience — collapsible theo công ty; employer hiện tại `defaultOpen`, skill `Tag` chips.
 */
export function Experiences() {
  const playHoverSound = useItemHoverSound();

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
        Experience
      </h2>

      <div className="space-y-6">
        {EXPERIENCES.map((experience) => (
          <Collapsible key={experience.id} defaultOpen={experience.isCurrentEmployer}>
            <div className="group/exp" onMouseEnter={playHoverSound}>
              <CollapsibleTrigger className="flex w-full cursor-pointer items-start gap-4 text-left">
                {experience.companyLogo ? (
                  <Image
                    src={experience.companyLogo}
                    alt={experience.companyName}
                    width={40}
                    height={40}
                    quality={100}
                    className="size-10 shrink-0 rounded-lg object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <BriefcaseIcon className="size-5" />
                  </div>
                )}

                <div className="flex-1 space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium text-foreground">{experience.companyName}</h3>
                      <Link
                        href={experience.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowUpRightIcon className="size-4" />
                      </Link>
                    </div>
                    <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 [[data-panel-open]_&]:rotate-180" />
                  </div>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {experience.positions[0]?.employmentPeriod.start}
                    {" — "}
                    {experience.positions[0]?.employmentPeriod.end || "∞"}
                  </p>
                </div>
              </CollapsibleTrigger>

              <CollapsiblePanel>
                <div className="ml-14 mt-3 space-y-3 border-l-2 border-muted pl-4">
                  {experience.positions.map((position) => (
                    <div key={position.id} className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {position.title}
                          {position.employmentType && (
                            <span className="text-foreground/60"> · {position.employmentType}</span>
                          )}
                        </p>
                      </div>
                      {position.description && (
                        <p className="text-sm text-foreground/60 leading-relaxed">
                          {position.description}
                        </p>
                      )}
                      {position.skills && position.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {position.skills.map((skill, index) => (
                            <Tag key={index}>{skill}</Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsiblePanel>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
