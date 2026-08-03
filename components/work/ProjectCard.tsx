import Link from "next/link";
import Image from "next/image";
import type { ComponentType } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { StatusBadge, Pill } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/ui/BrandIcons";
import TiltCard from "@/components/ui/TiltCard";

function primaryHref(project: Project): string | undefined {
  if (project.caseStudy) return `/projects/${project.slug}`;
  if (project.thesis) return project.thesis;
  return project.github;
}

function CoverImage({
  project,
  sizes,
}: {
  project: Project;
  sizes: string;
}) {
  const src = project.cover ?? project.screenshots?.[0]?.src;
  const alt = project.screenshots?.[0]?.alt ?? `${project.name} — ${project.tagline}`;
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
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

function CoverMeta({ project }: { project: Project }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-70" />
      <div className="absolute inset-0 bg-[#0B0E14]/0 transition-colors duration-300 group-hover:bg-[#0B0E14]/25" />
      <div className="absolute left-3 top-3">
        <StatusBadge status={project.status} />
      </div>
      <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-[#0B0E14]/70 px-2 py-0.5 font-mono text-[10px] tracking-wide text-text-secondary backdrop-blur-sm">
        {project.year}
      </span>
      <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-accent text-[#0B0E14] opacity-0 shadow-[0_8px_24px_rgba(79,209,197,0.45)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </>
  );
}

function Thumbnail({
  project,
  href,
  aspect,
  sizes,
}: {
  project: Project;
  href?: string;
  aspect: string;
  sizes: string;
}) {
  const art = (
    <>
      <CoverImage project={project} sizes={sizes} />
      <CoverMeta project={project} />
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
  const classes = `inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-all ${
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
        <CardButton href={`/projects/${project.slug}`} icon={BookOpen}>
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

interface CardShellProps {
  project: Project;
  aspect: string;
  sizes: string;
  compact?: boolean;
}

function CardShell({ project, aspect, sizes, compact }: CardShellProps) {
  const href = primaryHref(project);

  return (
    <TiltCard className="h-full">
      <article className="card-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_60px_-24px_rgba(79,209,197,0.22)]">
        <Thumbnail project={project} href={href} aspect={aspect} sizes={sizes} />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
              {project.category}
            </span>
            {!compact && <span className="font-mono text-xs text-text-muted">{project.year}</span>}
          </div>
          <h3 className="mt-2.5 font-display text-lg font-medium tracking-tight text-text-primary">
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
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-muted">
            {project.tagline}
          </p>
          {!compact && (
            <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-3">
              {project.summary}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, compact ? 4 : 5).map((tech) => (
              <Pill key={tech}>{tech}</Pill>
            ))}
            {project.stack.length > (compact ? 4 : 5) && (
              <span className="self-center font-mono text-xs text-text-muted">
                +{project.stack.length - (compact ? 4 : 5)}
              </span>
            )}
          </div>
          <ProjectActions project={project} />
        </div>
      </article>
    </TiltCard>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <CardShell
      project={project}
      aspect="aspect-[16/10]"
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
    />
  );
}

export function CompactProjectCard({ project }: { project: Project }) {
  return (
    <CardShell
      project={project}
      compact
      aspect="aspect-[16/9]"
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
    />
  );
}

export function ProjectSpotlightCard({ project }: { project: Project }) {
  const href = primaryHref(project);
  const topMetrics = project.metrics?.slice(0, 3) ?? [];

  return (
    <TiltCard className="h-full" max={2}>
      <article className="card-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-[0_32px_80px_-32px_rgba(79,209,197,0.28)] lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div className="relative overflow-hidden border-b border-line bg-surface-2 lg:h-full lg:border-b-0 lg:border-r">
          <Thumbnail
            project={project}
            href={href}
            aspect="aspect-video lg:aspect-auto lg:h-full"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-dim px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider text-accent">
              <Star className="h-3 w-3 fill-accent" />
              Spotlight
            </span>
            <span className="font-mono text-xs text-text-muted">{project.category} · {project.year}</span>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-text-primary sm:text-3xl">
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
          <p className="mt-3 leading-relaxed text-text-secondary">{project.summary}</p>

          {topMetrics.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              {topMetrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-line bg-surface-2 px-3 py-2.5">
                  <p className="font-mono text-base font-semibold text-accent">{m.value}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((tech) => (
              <Pill key={tech}>{tech}</Pill>
            ))}
            {project.stack.length > 6 && (
              <span className="self-center font-mono text-xs text-text-muted">
                +{project.stack.length - 6}
              </span>
            )}
          </div>

          <ProjectActions project={project} />
        </div>
      </article>
    </TiltCard>
  );
}
