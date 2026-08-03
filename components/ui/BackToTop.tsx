"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-accent"
      aria-label="Back to top"
    >
      back to top <ArrowUp className="h-3.5 w-3.5" />
    </button>
  );
}
