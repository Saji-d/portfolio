"use client";

import { Moon, Sun } from "lucide-react";

const DEFAULT_CLASSES =
  "grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface/60 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent";

export default function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      /* localStorage unavailable (private mode, disabled storage) */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={className ?? DEFAULT_CLASSES}
    >
      <Sun className="theme-icon-sun h-4 w-4" />
      <Moon className="theme-icon-moon h-4 w-4" />
    </button>
  );
}
