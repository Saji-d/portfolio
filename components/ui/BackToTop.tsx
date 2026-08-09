import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <a
      href="#top"
      className="flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-accent"
      aria-label="Back to top"
    >
      back to top <ArrowUp className="h-3.5 w-3.5" />
    </a>
  );
}
