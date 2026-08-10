import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchStudy } from "@/data/research";

export default function ResearchCard({ paper }: { paper: ResearchStudy }) {
  const href = `/research/${paper.slug}`;
  return (
    <Link
      href={href}
      className="card-surface group block h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-surface-2 px-2 py-0.5 font-mono text-xs text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
      <h3 className="card-title mt-3">
        {paper.title}
      </h3>
      <p className="mt-1 card-meta">{paper.field}</p>
      <p className="mt-2.5 body-copy text-text-secondary">
        {paper.summary}
      </p>
      {paper.metrics && (
        <div className="mt-3 flex gap-5">
          {paper.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-xl font-medium tracking-tight text-accent">
                {m.value}
              </div>
              <div className="card-meta">{m.label}</div>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
