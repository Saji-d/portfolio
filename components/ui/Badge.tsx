import type { ProjectStatus } from "@/data/projects";

const statusColor: Record<ProjectStatus, string> = {
  ACTIVE: "text-success border-success/30 bg-success/10",
  COMPLETE: "text-accent-hover border-accent/30 bg-accent-dim",
  CONCEPT: "text-warning border-warning/30 bg-warning/10",
};

const statusDot: Record<ProjectStatus, string> = {
  ACTIVE: "bg-success",
  COMPLETE: "bg-accent",
  CONCEPT: "bg-warning",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem] font-medium tracking-wider ${statusColor[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}

export function Pill({ children, planned = false }: { children: string; planned?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] ${
        planned
          ? "border-dashed border-line-strong bg-transparent text-text-muted"
          : "border-line bg-surface-2 text-text-secondary"
      }`}
    >
      {children}
    </span>
  );
}

export function ProjectBadgeChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-dim px-2.5 py-0.5 font-mono text-[0.625rem] font-medium tracking-wider text-accent-hover">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/** The attribution names that have a dedicated colour. */
export type AttributionName = "Lumifi Solutions" | "RemoteIntegrity" | "Ledgercross" | "Client Project";

/** Single source of badge colours (border / fill / text classes). Replace values here to recolour. */
export const attributionColors: Record<AttributionName | "fallback", string> = {
  "Lumifi Solutions": "border-amber-300/35 bg-amber-300/15 text-amber-200",
  RemoteIntegrity: "border-sky-400/45 bg-sky-400/15 text-sky-300",
  Ledgercross: "border-lime-300/40 bg-lime-300/15 text-lime-200",
  "Client Project": "border-fuchsia-300/40 bg-fuchsia-300/15 text-fuchsia-200",
  fallback: "border-line-strong bg-surface-2 text-text-secondary",
};

/** Company / client attribution. One colour per company, static, wherever it appears. */
export function AttributionBadge({ children }: { children: string }) {
  const tone = (attributionColors as Record<string, string>)[children] ?? attributionColors.fallback;
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[0.6875rem] font-medium normal-case tracking-normal ${tone}`}
    >
      {children}
    </span>
  );
}
