"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projects } from "@/data/projects";
import { useOverlay } from "@/components/overlay-context";
import CircuitTraces from "@/components/ui/CircuitTraces";

export default function ProjectsSection() {
  const { openProject } = useOverlay();

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="section-chapter relative overflow-hidden pb-10 sm:pb-12"
    >
      {/* A data-flow trace in the top-right margin, well clear of the card
          grid — desktop only. */}
      <CircuitTraces
        variant="pulse"
        className="right-2 top-4 hidden h-40 w-40 lg:block"
      />
      <div className="container-site">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow index="03">Projects</Eyebrow>
              <h2 className="section-title">
                Built things. Broke things. Shipped things.
              </h2>
            </div>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              View all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <ProjectCard
                project={p}
                compact
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                onOpenCaseStudy={openProject}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
