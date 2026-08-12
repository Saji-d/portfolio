import Link from "next/link";
import Image from "next/image";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { Pill, StatusBadge } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/ui/BrandIcons";
import TiltCard from "@/components/ui/TiltCard";

function primaryHref(project: Project): string | undefined {
  if (project.caseStudy) return `/projects/${project.slug}`;
  if (project.thesis) return project.thesis;
  return project.github;
}

function isProfessional(project: Project): boolean {
  return project.category === "Professional";
}

function SmartLink({
  href,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function GlassChip({
  children,
  accent = false,
}: {
  children: string;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider backdrop-blur-md ${
        accent
          ? "border-accent/50 bg-accent text-accent-ink"
          : "border-white/10 bg-[#0B0E14]/60 text-text-secondary"
      }`}
    >
      {children}
    </span>
  );
}

function CoverImage({
  project,
  sizes,
  compact = false,
  onOpenCaseStudy,
}: {
  project: Project;
  sizes: string;
  compact?: boolean;
  onOpenCaseStudy?: (slug: string) => void;
}) {
  const href = primaryHref(project);
  const pro = isProfessional(project);
  const opensCaseStudy = Boolean(onOpenCaseStudy && project.caseStudy);

  const art = (
    <>
      <Image
        src={project.cover}
        alt={`${project.name}: ${project.tagline}`}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/85 via-[#0B0E14]/10 to-[#0B0E14]/20" />
      <div className="absolute inset-0 bg-[#0B0E14]/0 transition-colors duration-300 group-hover:bg-[#0B0E14]/20" />

      {/* Inspection scan-line: a thin light band sweeping the cover on
          hover, reinforcing "running system being inspected" rather than a
          static screenshot. The animation always runs; only its opacity is
          hover-gated, so there's no start/stop jank. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span className="animate-scan-sweep absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-accent/25 to-transparent" />
      </div>

      {/* Targeting-reticle corners: reveal on hover, framing the cover like a system under inspection. */}
      <span
        aria-hidden="true"
        className="absolute left-2.5 top-2.5 h-3.5 w-3.5 -translate-x-1 -translate-y-1 border-l border-t border-accent/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute right-2.5 top-2.5 h-3.5 w-3.5 translate-x-1 -translate-y-1 border-r border-t border-accent/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 -translate-x-1 translate-y-1 border-b border-l border-accent/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:opacity-100"
      />

      <div className="absolute left-3 top-3 flex max-w-[calc(100%-6rem)] flex-wrap gap-1.5">
        <GlassChip accent={pro}>{project.category}</GlassChip>
        {project.badges.map((badge) => (
          <GlassChip key={badge}>{badge}</GlassChip>
        ))}
      </div>

      {pro && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-accent-ink shadow-[0_4px_20px_rgba(79,209,197,0.45)]">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </span>
      )}

      <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-ink opacity-0 shadow-[0_8px_24px_rgba(79,209,197,0.45)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </>
  );

  const coverClass = compact
    ? "relative block aspect-[16/8] overflow-hidden bg-surface-2"
    : "relative block aspect-video overflow-hidden bg-surface-2";

  if (opensCaseStudy) {
    return (
      <button
        type="button"
        onClick={() => onOpenCaseStudy?.(project.slug)}
        aria-label={`${project.name}: ${project.tagline}`}
        className={`${coverClass} w-full cursor-pointer text-left`}
      >
        {art}
      </button>
    );
  }

  if (href) {
    return (
      <SmartLink
        href={href}
        ariaLabel={`${project.name}: ${project.tagline}`}
        className={coverClass}
      >
        {art}
      </SmartLink>
    );
  }

  return <div className={coverClass}>{art}</div>;
}

function CardButton({
  href,
  external,
  icon: Icon,
  children,
  primary = false,
  onClick,
}: {
  href?: string;
  external?: boolean;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
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
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {inner}
      </button>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }
  return <Link href={href!} className={classes}>{inner}</Link>;
}

function ProjectActions({
  project,
  compact = false,
  onOpenCaseStudy,
}: {
  project: Project;
  compact?: boolean;
  onOpenCaseStudy?: (slug: string) => void;
}) {
  return (
    <div
      className={`flex flex-wrap gap-2 border-t border-line ${
        compact ? "mt-3 pt-3" : "mt-4 pt-4"
      }`}
    >
      {project.github && (
        <CardButton href={project.github} external icon={GithubIcon} primary>
          GitHub
        </CardButton>
      )}
      {project.demo && (
        <CardButton href={project.demo} external icon={ExternalLink}>
          Live Demo
        </CardButton>
      )}
      {project.caseStudy &&
        (onOpenCaseStudy ? (
          <CardButton
            icon={BookOpen}
            onClick={() => onOpenCaseStudy(project.slug)}
          >
            Case Study
          </CardButton>
        ) : (
          <CardButton href={`/projects/${project.slug}`} icon={BookOpen}>
            Case Study
          </CardButton>
        ))}
    </div>
  );
}

export function ProjectCard({
  project,
  sizes,
  compact = false,
  onOpenCaseStudy,
}: {
  project: Project;
  sizes: string;
  compact?: boolean;
  onOpenCaseStudy?: (slug: string) => void;
}) {
  const href = primaryHref(project);
  const pro = isProfessional(project);
  const opensCaseStudy = Boolean(onOpenCaseStudy && project.caseStudy);

  return (
    <TiltCard className="h-full" glare>
      <article
        className={`card-surface group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${
          pro
            ? "border-accent/30 shadow-[0_0_0_1px_rgba(79,209,197,0.12),0_20px_60px_-24px_rgba(79,209,197,0.18)] hover:border-accent/60 hover:shadow-[0_0_0_1px_rgba(79,209,197,0.25),0_32px_80px_-28px_rgba(79,209,197,0.38)]"
            : "hover:border-accent/40 hover:shadow-[0_24px_60px_-24px_rgba(79,209,197,0.22)]"
        }`}
      >
        {pro && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-accent via-accent-2 to-transparent"
          />
        )}
        <CoverImage
          project={project}
          sizes={sizes}
          compact={compact}
          onOpenCaseStudy={onOpenCaseStudy}
        />
        <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="card-title">
              {opensCaseStudy ? (
                <button
                  type="button"
                  onClick={() => onOpenCaseStudy?.(project.slug)}
                  className="text-left transition-colors group-hover:text-accent"
                >
                  {project.name}
                </button>
              ) : href ? (
                <SmartLink
                  href={href}
                  className="transition-colors group-hover:text-accent"
                >
                  {project.name}
                </SmartLink>
              ) : (
                project.name
              )}
            </h3>
            <StatusBadge status={project.status} />
          </div>
          <p
            className={`flex-1 body-copy text-text-muted ${
              compact ? "mt-1" : "mt-1.5"
            }`}
          >
            {project.tagline}
          </p>
          <div
            className={`flex flex-wrap gap-1.5 ${
              compact ? "mt-3" : "mt-4"
            }`}
          >
            {project.stack.slice(0, 5).map((tech) => (
              <Pill key={tech}>{tech}</Pill>
            ))}
            {project.stack.length > 5 && (
              <span className="self-center font-mono text-xs text-text-muted">
                +{project.stack.length - 5}
              </span>
            )}
          </div>
          <ProjectActions
            project={project}
            compact={compact}
            onOpenCaseStudy={onOpenCaseStudy}
          />
        </div>
      </article>
    </TiltCard>
  );
}
