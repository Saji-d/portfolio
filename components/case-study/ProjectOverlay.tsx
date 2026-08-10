"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getProject } from "@/data/projects.full";
import { Pill, ProjectBadgeChip, StatusBadge } from "@/components/ui/Badge";
import CodeBlock from "@/components/ui/CodeBlock";
import Gallery from "@/components/work/Gallery";
import OverlayShell from "@/components/ui/OverlayShell";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-8 sm:py-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2.5 font-display text-xl font-medium tracking-tight text-gradient sm:text-2xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Bullets({
  items,
  accent = "bg-accent",
}: {
  items: string[];
  accent?: string;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-text-secondary">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent}`} />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <p key={item} className="leading-relaxed text-text-secondary">
          {item}
        </p>
      ))}
    </div>
  );
}

export default function ProjectOverlay({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const project = getProject(slug);

  if (!project) return null;

  const actionLinks = [
    ...(project.github ? [{ label: "View Code", href: project.github }] : []),
    ...(project.demo ? [{ label: "Live Demo", href: project.demo }] : []),
    ...(project.thesis
      ? [{ label: "Thesis", href: project.thesis, internal: true }]
      : []),
  ];

  return (
    <OverlayShell
      ariaLabel={`${project.name} case study`}
      onClose={onClose}
    >
      <div className="mx-auto w-full max-w-4xl px-5 pb-8 pt-10 sm:px-8 sm:pt-12">
        <header>
          <div className="flex flex-wrap items-center gap-3 pr-12">
            <StatusBadge status={project.status} />
            <span className="font-mono text-xs text-text-muted">
              {project.role}
            </span>
            <ProjectBadgeChip>{project.category}</ProjectBadgeChip>
            {project.badges.map((badge) => (
              <ProjectBadgeChip key={badge}>{badge}</ProjectBadgeChip>
            ))}
          </div>
          <h1 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight text-gradient sm:text-3xl">
            {project.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {project.tagline}
          </p>

          {project.stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Pill key={tech}>{tech}</Pill>
              ))}
            </div>
          )}

          {actionLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {actionLinks.map((link) =>
                (link as { internal?: boolean }).internal ? (
                  <Link
                    key={link.label}
                    href={link.href as string}
                    className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )
              )}
            </div>
          )}
        </header>

        <div className="mt-4">
          {project.problem && (
            <Section eyebrow="[ 01 ] — Context" title="Problem">
              <Bullets items={project.problem} />
            </Section>
          )}

          {project.solution && (
            <Section eyebrow="[ 02 ] — Response" title="Solution">
              <Paragraphs items={project.solution} />
            </Section>
          )}

          {project.architecture && (
            <Section eyebrow="[ 03 ] — Structure" title="Architecture">
              <div className="card-surface overflow-x-auto">
                <pre className="min-w-max p-5 font-mono text-[13px] leading-relaxed text-text-secondary">
                  {project.architecture.join("\n")}
                </pre>
              </div>
            </Section>
          )}

          {project.decisions && (
            <Section eyebrow="[ 04 ] — Trade-offs" title="Key engineering decisions">
              <ol className="space-y-6">
                {project.decisions.map((d, i) => (
                  <li key={d.title} className="grid gap-2 sm:grid-cols-[64px_1fr]">
                    <span className="font-mono text-sm text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-medium text-text-primary">{d.title}</h3>
                      <p className="mt-1 leading-relaxed text-text-secondary">
                        {d.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {project.highlights && (
            <Section eyebrow="[ 05 ] — Under the hood" title="Engineering highlights">
              <div className="space-y-6">
                {project.highlights.map((h) => (
                  <CodeBlock
                    key={h.title}
                    code={h.code}
                    title={h.title}
                    caption={h.caption}
                  />
                ))}
              </div>
            </Section>
          )}

          {project.metrics && (
            <Section eyebrow="[ 06 ] — Outcomes" title="Results">
              <div className="card-surface grid grid-cols-2 gap-6 p-6 sm:grid-cols-3 sm:p-8">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl font-medium tracking-tight text-accent sm:text-3xl">
                      {m.value}
                    </div>
                    <div className="mt-1 font-mono text-xs text-text-muted">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {project.screenshots && project.screenshots.length > 0 && (
            <Section eyebrow="[ 07 ] — Visuals" title="Screenshots">
              <Gallery images={project.screenshots} />
            </Section>
          )}

          {project.nextSteps && (
            <Section eyebrow="[ 08 ] — Where it's going" title="Status & next steps">
              <Bullets items={project.nextSteps} accent="bg-accent-2" />
            </Section>
          )}
        </div>
      </div>
    </OverlayShell>
  );
}
