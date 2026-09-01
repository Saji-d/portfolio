"use client";

import { timeline } from "@/data/timeline";

const ENTRIES = timeline.filter(
  (t) => t.type === "career" || t.type === "education",
);

export default function TimelineView() {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent-hover">$ timeline</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// education & career · ${ENTRIES.length} stops`}</span>
      </div>

      <ol className="mt-4">
        {ENTRIES.map((entry, i) => (
          <li key={entry.period + entry.title} className="relative flex gap-4 pb-5 last:pb-0">
            {i < ENTRIES.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-4 h-[calc(100%-1.25rem)] w-px bg-line"
              />
            )}
            <span
              aria-hidden="true"
              className={`relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 ${
                entry.current
                  ? "border-accent bg-accent"
                  : "border-accent/50 bg-surface"
              }`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-xs text-text-muted">{entry.period}</span>
                {entry.current && (
                  <span className="rounded-full border border-accent/30 bg-accent-dim px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-hover">
                    current
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-display text-sm font-medium text-text-primary">
                {entry.title}
              </p>
              <p className="font-mono text-xs text-text-secondary">{entry.org}</p>
              {entry.points[0] && (
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  {entry.points[0]}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; current role · software developer trainee @ ledgercross
      </p>
    </div>
  );
}
