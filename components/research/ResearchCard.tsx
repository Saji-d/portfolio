import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchStudy } from "@/data/research";
import AnimatedMetric from "@/components/ui/AnimatedMetric";

export default function ResearchCard({
  paper,
  onOpen,
}: {
  paper: ResearchStudy;
  onOpen?: (slug: string) => void;
}) {
  const href = `/research/${paper.slug}`;

  const inner = (
    <>
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
      <h3 className="card-title mt-3 line-clamp-2">{paper.title}</h3>
      <p className="mt-1 card-meta">{paper.field}</p>
      <p className="mt-2 line-clamp-3 body-copy text-text-secondary">{paper.summary}</p>
      {paper.metrics && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {paper.metrics.map((m, i) =>
            i === 0 ? (
              <div key={m.label}>
                <div className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <AnimatedMetric
                    value={m.value}
                    className="font-display text-lg font-medium tracking-tight text-accent"
                  />
                </div>
                <div className="card-meta">{m.label}</div>
              </div>
            ) : (
              <div key={m.label}>
                <div className="font-display text-lg font-medium tracking-tight text-accent">
                  {m.value}
                </div>
                <div className="card-meta">{m.label}</div>
              </div>
            )
          )}
        </div>
      )}
    </>
  );

  const classes =
    "card-surface group block h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40";

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpen(paper.slug)}
        className={`${classes} w-full text-left`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
