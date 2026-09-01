"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { ProjectCard } from "@/components/work/ProjectCard";
import FeaturedProjectCase from "@/components/home/FeaturedProjectCase";
import { primaryProjects } from "@/data/projects";
import { useOverlay } from "@/components/overlay-context";

const FEATURED_COUNT = 3;

export default function ProjectsSection() {
  const { openProject } = useOverlay();
  const featured = primaryProjects.slice(0, FEATURED_COUNT);
  const archive = primaryProjects.slice(FEATURED_COUNT);

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="section-chapter relative overflow-hidden pb-10 sm:pb-12"
    >
      <div className="container-site">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow index="03">Projects</Eyebrow>
              <h2 className="section-title lg:text-[1.625rem]">
                Built things. Broke things. Shipped things.
              </h2>
            </div>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-medium text-accent-hover transition-opacity hover:opacity-80"
            >
              View all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-12 lg:mt-14">
          {featured.map((project, i) => (
            <div
              key={project.slug}
              className={
                i === 0
                  ? ""
                  : "mt-16 sm:mt-20 lg:mt-24"
              }
            >
              <FeaturedProjectCase
                project={project}
                index={i}
                total={featured.length}
                imageFirst={i % 2 === 0}
                onOpenCaseStudy={openProject}
              />
            </div>
          ))}
        </div>

        {archive.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <Reveal>
              <div className="border-t border-line pt-10">
                <Eyebrow>Archive</Eyebrow>
                <h3 className="section-title mt-2">
                  More from the build log.
                </h3>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {archive.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                  <ProjectCard
                    project={p}
                    compact
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    onOpenCaseStudy={openProject}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
