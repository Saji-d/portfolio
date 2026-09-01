"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  title: string;
  caption?: string;
}

export default function CodeBlock({ code, title, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <figure className="card-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="font-mono text-xs text-text-muted">{title}</span>
        </div>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors hover:text-accent-hover"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-text-secondary">
        <code>{code}</code>
      </pre>
      {caption && (
        <figcaption className="border-t border-line px-4 py-3 font-mono text-xs text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
