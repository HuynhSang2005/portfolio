"use client";

import { ArrowUpRightIcon, BoxIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PROJECTS } from "@/config/projects";
import { useItemHoverSound } from "@/lib/hooks/use-item-hover-sound";

/**
 * Section Projects — danh sách dự án với link ngoài, logo hoặc `BoxIcon` fallback, hover sound.
 */
export function Projects() {
  const playHoverSound = useItemHoverSound();

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
        Projects
      </h2>

      <div className="space-y-6">
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4"
            onMouseEnter={playHoverSound}
          >
            {project.logo ? (
              <Image
                src={project.logo}
                alt={project.title}
                width={40}
                height={40}
                quality={100}
                className="size-10 shrink-0 rounded-lg object-contain"
                unoptimized
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <BoxIcon className="size-5" />
              </div>
            )}

            <div className="flex-1 space-y-1 pt-1">
              <h3 className="flex items-center gap-1 font-medium text-foreground group-hover:underline">
                {project.title}
                <ArrowUpRightIcon className="size-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </h3>
              {project.shortDescription && (
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {project.shortDescription}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
