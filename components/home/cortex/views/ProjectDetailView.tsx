"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProject } from "@/data/projects";

export default function ProjectDetailView({ slug }: { slug: string }) {
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 text-center">
        <div className="font-mono text-sm text-danger">
          project not found: <span className="text-text-primary">{slug}</span>
        </div>
        <p className="font-mono text-xs text-text-muted">
          hint: type <span className="text-accent-hover">projects</span> to list available slugs
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent-hover">$ projects {slug}</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// project detail`}</span>
      </div>

      <div className="card-surface mt-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
              {project.status.toLowerCase()} · {project.category}
            </span>
            <h4 className="mt-1 font-display text-lg font-medium text-text-primary">
              {project.name}
            </h4>
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-accent-hover transition-opacity hover:opacity-80"
          >
            open project
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <dl className="mt-4 space-y-2 font-mono text-xs">
          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-text-muted">status</dt>
            <dd className="text-text-secondary">{project.status}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-text-muted">role</dt>
            <dd className="text-text-secondary">{project.role}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-text-muted">category</dt>
            <dd className="text-text-secondary">{project.category}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 shrink-0 text-text-muted">stack</dt>
            <dd className="text-text-secondary">{project.stack.join(", ")}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{project.summary}</p>
      </div>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; run <span className="text-accent-hover">projects</span> to go back to the full graph
      </p>
    </div>
  );
}
