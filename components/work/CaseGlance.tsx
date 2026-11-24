import { OWNERSHIP } from "@/data/projects";
import type { Project } from "@/data/projects.full";

/** Compact "who did what" block shown right under a case study's title: ownership, my part and one result. */
export default function CaseGlance({ project, compact = false }: { project: Project; compact?: boolean }) {
  const ownership = OWNERSHIP[project.slug];
  const contribution = project.contribution?.[0];
  // Team projects: no headline numbers, since they can include teammates' work.
  const results = ownership?.startsWith("Team") ? [] : (project.metrics ?? []).slice(0, 2);
  if (!ownership && !contribution && results.length === 0) return null;
  return (
    <div className={`mt-5 max-w-2xl rounded-lg border border-line bg-surface-2/60 ${compact ? "p-4" : "p-5"}`}>
      {ownership && (
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-accent-hover">
          {ownership}
        </p>
      )}
      {contribution && (
        <p className={`${ownership ? "mt-2" : ""} text-sm leading-relaxed text-text-secondary`}>
          <span className="font-medium text-text-primary">My part: </span>
          {contribution}
        </p>
      )}
      {results.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {results.map((m) => (
            <li key={`${m.value}-${m.label}`} className="flex items-baseline gap-2">
              <span className="font-display text-lg font-medium text-text-primary">{m.value}</span>
              <span className="text-xs text-text-muted">{m.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
