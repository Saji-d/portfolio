import type { ProjectStatus } from "@/data/projects";

const statusColor: Record<ProjectStatus, string> = {
  ACTIVE: "text-success border-success/30 bg-success/10",
  COMPLETE: "text-accent border-accent/30 bg-accent-dim",
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
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider ${statusColor[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}

export function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-text-secondary">
      {children}
    </span>
  );
}

export function ProjectBadgeChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-dim px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
