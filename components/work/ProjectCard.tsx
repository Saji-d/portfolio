import Link from "next/link";
import Image from "next/image";
import type { ComponentType } from "react";
import { BookOpen, ExternalLink, Star, type LucideIcon } from "lucide-react";
import type { Project } from "@/data/projects";
import { StatusBadge, Pill } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/ui/BrandIcons";
import TiltCard from "@/components/ui/TiltCard";

function primaryHref(project: Project): string | undefined {
  if (project.caseStudy) return `/work/${project.slug}`;
  if (project.thesis) return project.thesis;
  return project.github;
}

function ProjectCover({ project }: { project: Project }) {
  const cover = project.screenshots?.[0];
  if (cover) {
    return (
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--surface-2),rgba(124,125,255,0.07))]">
      <div className="grid h-full w-full place-items-center bg-[radial-gradient(120px_at_68%_24%,rgba(79,209,197,0.16),transparent)]">
        <span className="font-display text-5xl font-medium text-accent/70">
          {project.name.slice(0, 1)}
        </span>
      </div>
    </div>
  );
}

function FeaturedBadge() {
  return (
    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-[#0B0E14]/80 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider text-accent backdrop-blur-sm">
      <Star className="h-3 w-3 fill-accent" />
      Featured
    </span>
  );
}

function CardButton({
  href,
  external,
  icon: Icon,
  children,
  primary = false,
}: {
  href: string;
  external?: boolean;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const classes = `inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
    primary
      ? "border-accent/40 bg-accent-dim text-accent hover:border-accent hover:bg-accent/20"
      : "border-line bg-surface-2 text-text-secondary hover:border-accent/50 hover:text-accent"
  }`;
  const inner = (
    <>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }
  return <Link href={href} className={classes}>{inner}</Link>;
}

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
      {project.github && (
        <CardButton href={project.github} external icon={GithubIcon} primary>
          View Code
        </CardButton>
      )}
      {project.demo && (
        <CardButton href={project.demo} external icon={ExternalLink}>
          Live Demo
        </CardButton>
      )}
      {project.caseStudy && (
        <CardButton href={`/work/${project.slug}`} icon={BookOpen}>
          Case Study
        </CardButton>
      )}
      {project.thesis && (
        <CardButton href={project.thesis} icon={BookOpen}>
          Thesis
        </CardButton>
      )}
    </div>
  );
}

function Thumbnail({
  project,
  href,
  aspect,
}: {
  project: Project;
  href?: string;
  aspect: string;
}) {
  const art = (
    <>
      <ProjectCover project={project} />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
      {project.featured && <FeaturedBadge />}
    </>
  );
  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        aria-label={`${project.name}: ${project.tagline}`}
        className={`relative block ${aspect} overflow-hidden border-b border-line bg-surface-2`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {art}
      </Link>
    );
  }
  return (
    <div className={`relative ${aspect} overflow-hidden border-b border-line bg-surface-2`}>
      {art}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const href = primaryHref(project);

  return (
    <TiltCard className="h-full">
      <article className="card-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40">
        <Thumbnail project={project} href={href} aspect="aspect-[16/10]" />

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={project.status} />
            <span className="font-mono text-xs text-text-muted">{project.year}</span>
          </div>
          <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-text-primary">
            {href ? (
              <Link
                href={href}
                className="transition-colors group-hover:text-accent"
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {project.name}
              </Link>
            ) : (
              project.name
            )}
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
          <ProjectActions project={project} />
        </div>
      </article>
    </TiltCard>
  );
}

export function CompactProjectCard({ project }: { project: Project }) {
  const href = primaryHref(project);

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40">
      <Thumbnail project={project} href={href} aspect="aspect-[16/9]" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
            {project.category}
          </span>
          <span className="font-mono text-xs text-text-muted">{project.year}</span>
        </div>
        <h3 className="mt-2 font-display text-base font-medium tracking-tight text-text-primary">
          {href ? (
            <Link
              href={href}
              className="transition-colors group-hover:text-accent"
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {project.name}
            </Link>
          ) : (
            project.name
          )}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
          {project.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
          {project.stack.length > 4 && (
            <span className="font-mono text-xs text-text-muted">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
        <ProjectActions project={project} />
      </div>
    </article>
  );
}
