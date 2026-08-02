import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { getFeaturedProjects } from "@/data/projects";
import { StatusBadge, Pill } from "@/components/ui/Badge";
import CodeBlock from "@/components/ui/CodeBlock";
import Gallery from "@/components/work/Gallery";
import Reveal from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";

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
    <section className="py-16 sm:py-20">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.08} className="mt-6">
        {children}
      </Reveal>
    </section>
  );
}

export default function CaseStudy({ project }: { project: Project }) {
  const others = getFeaturedProjects()
    .filter((p) => p.slug !== project.slug)
    .slice(0, 2);

  return (
    <article>
      <div className="container-site pt-32 sm:pt-40">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="font-mono text-xs text-text-muted">{project.year}</span>
            <span className="font-mono text-xs text-text-muted">{project.role}</span>
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-gradient sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {project.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Pill key={tech}>{tech}</Pill>
            ))}
          </div>

          {project.links?.some((l) => l.href) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links
                ?.filter((l) => l.href)
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
            </div>
          )}
        </Reveal>
      </div>

      <div className="container-site pb-8">
        {project.problem && (
          <Section eyebrow="[ 01 ] — Context" title="Problem">
            <ul className="space-y-3">
              {project.problem.map((p) => (
                <li key={p} className="flex gap-3 text-text-secondary">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {project.solution && (
          <Section eyebrow="[ 02 ] — Response" title="Solution">
            <div className="space-y-3">
              {project.solution.map((p) => (
                <p key={p} className="leading-relaxed text-text-secondary">
                  {p}
                </p>
              ))}
            </div>
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
                    <p className="mt-1 leading-relaxed text-text-secondary">{d.body}</p>
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
                <CodeBlock key={h.title} code={h.code} title={h.title} caption={h.caption} />
              ))}
            </div>
          </Section>
        )}

        {project.metrics && (
          <Section eyebrow="[ 06 ] — Outcomes" title="Results">
            <div className="card-surface grid grid-cols-2 gap-8 p-8 sm:grid-cols-3 sm:p-10">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-display text-2xl font-medium tracking-tight text-accent sm:text-3xl">
                    {m.value}
                  </div>
                  <div className="mt-1 font-mono text-xs text-text-muted">{m.label}</div>
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
            <ul className="space-y-3">
              {project.nextSteps.map((s) => (
                <li key={s} className="flex gap-3 text-text-secondary">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div className="border-t border-line">
        <div className="container-site py-20">
          <Reveal>
            <p className="eyebrow">[ 09 ] — Keep exploring</p>
            <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
              More work
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {others.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          <Link
            href="/work"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            Back to all work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
