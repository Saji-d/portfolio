import { Lock } from "lucide-react";
import type { Project } from "@/data/projects";
import { GithubIcon } from "@/components/ui/BrandIcons";

type RepoAccess = NonNullable<Project["repoAccess"]>;

/** True when the GitHub slot should render the locked, non-interactive icon. */
export function isRepoLocked(project: Pick<Project, "repoAccess">): boolean {
  return project.repoAccess === "private" || project.repoAccess === "unavailable";
}

/**
 * Locked GitHub chip: one button-shaped pill (GitHub mark with a lock badge, then "Proprietary"),
 * sized like the "Case Study" button. Purely presentational: no link, no handler, not a focus stop.
 * The title attribute spells out the repo status on hover.
 */
export default function PrivateRepoIcon({
  access = "private",
  className = "",
}: {
  access?: RepoAccess;
  className?: string;
  size?: "sm" | "md";
}) {
  const label = access === "private" ? "Private repository" : "Repository link unavailable";
  return (
    <span
      title={label}
      className={`inline-flex cursor-default select-none items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-1.5 font-mono text-xs font-medium text-text-secondary ${className}`}
    >
      <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden="true">
        <GithubIcon className="h-3.5 w-3.5 opacity-70" />
        <span className="absolute -bottom-1 -right-1.5 inline-flex h-3 w-3 items-center justify-center rounded-full border border-line bg-surface text-text-secondary">
          <Lock className="h-2 w-2" strokeWidth={2.5} />
        </span>
      </span>
      <span>Proprietary</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
