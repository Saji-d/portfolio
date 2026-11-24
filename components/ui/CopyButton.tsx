"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Small "copy to clipboard" button with an inline "Copied" confirmation. */
export default function CopyButton({
  value,
  label,
  iconOnly = false,
  className = "",
}: {
  value: string;
  /** What is being copied, for the accessible name, e.g. "email address". */
  label: string;
  /** Compact round icon button (no text), for tight cards. */
  iconOnly?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        title={copied ? "Copied" : "Copy"}
        className={`grid h-7 w-7 place-items-center rounded-full border border-line bg-surface-2 text-text-muted transition-colors hover:border-accent/50 hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
          copied ? "border-accent/50 text-accent-hover" : ""
        } ${className}`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied" : ""}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 font-mono text-[0.6875rem] font-medium text-text-secondary transition-colors hover:border-accent/50 hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${className}`}
    >
      {copied ? <Check className="h-3 w-3 text-accent-hover" /> : <Copy className="h-3 w-3" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
