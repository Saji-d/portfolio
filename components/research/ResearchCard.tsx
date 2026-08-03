import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchPaper } from "@/data/research";

export default function ResearchCard({ paper }: { paper: ResearchPaper }) {
  const href = paper.slug === "neuronscreen" ? "/research/neuronscreen" : undefined;
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        {href && (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        )}
      </div>
      <h3 className="mt-4 font-display text-base font-medium tracking-tight text-text-primary">
        {paper.title}
      </h3>
      <p className="mt-1 font-mono text-xs text-text-muted">
        {paper.venue} · {paper.year}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {paper.summary}
      </p>
      {paper.metrics && (
        <div className="mt-4 flex gap-6">
          {paper.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-xl font-medium tracking-tight text-accent">
                {m.value}
              </div>
              <div className="font-mono text-[10px] text-text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const classes =
    "card-surface group block h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40";

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return <div className={classes}>{inner}</div>;
}
