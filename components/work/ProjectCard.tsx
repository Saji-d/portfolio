import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { StatusBadge, Pill } from "@/components/ui/Badge";
import TiltCard from "@/components/ui/TiltCard";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.screenshots?.[0];

  return (
    <TiltCard className="h-full">
      <Link
        href={project.featured ? `/work/${project.slug}` : "#"}
        className="card-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-accent/40"
        aria-label={`${project.name}: ${project.tagline}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="font-mono text-5xl font-bold text-accent-dim">
                {project.name.slice(0, 1)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={project.status} />
            <ArrowUpRight className="h-4 w-4 text-text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </div>
          <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-text-primary">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">{project.tagline}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((tech) => (
              <Pill key={tech}>{tech}</Pill>
            ))}
            {project.stack.length > 5 && (
              <span className="font-mono text-xs text-text-muted">
                +{project.stack.length - 5}
              </span>
            )}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export function CompactProjectCard({ project }: { project: Project }) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-medium tracking-tight text-text-primary">
          {project.name}
        </h3>
      </div>
      <p className="mt-1 text-sm text-text-secondary">{project.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <Pill key={tech}>{tech}</Pill>
        ))}
      </div>
    </>
  );

  const classes =
    "card-surface group block h-full p-5 transition-all duration-300 hover:border-accent/40";

  return <div className={classes}>{inner}</div>;
}
