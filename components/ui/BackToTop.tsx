import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <a
      href="#top"
      className="group/top flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-accent"
      aria-label="Back to top"
    >
      back to top
      <span className="relative grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded-full border border-line transition-colors duration-300 group-hover/top:border-accent/50">
        <ArrowUp className="h-3 w-3 transition-transform duration-300 group-hover/top:-translate-y-4 group-hover/top:opacity-0" />
        <ArrowUp className="absolute h-3 w-3 -translate-y-4 opacity-0 transition-transform duration-300 group-hover/top:translate-y-0 group-hover/top:opacity-100" />
      </span>
    </a>
  );
}
