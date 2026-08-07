"use client";

import { useEffect, useRef } from "react";

const LINES = [
  "pip install trust",
  "218 tests passed — 0 failed",
  "Redis Streams -> seal -> verify",
  "pipeline status: ACTIVE",
  "ready for your hardest problems",
];

const TYPE_MS = 34;
const HOLD_MS = 1600;
const ERASE_MS = 14;

export default function TerminalCard() {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let lineIdx = 0;
    let text = "";
    let phase: "typing" | "holding" | "erasing" = "typing";
    let timer: ReturnType<typeof setTimeout> | null = null;
    let visible = true;

    const tick = () => {
      timer = null;
      if (!visible) return;
      const line = LINES[lineIdx];

      if (phase === "typing") {
        if (text.length < line.length) {
          text = line.slice(0, text.length + 1);
          timer = setTimeout(tick, TYPE_MS);
        } else {
          phase = "holding";
          timer = setTimeout(tick, HOLD_MS);
        }
      } else if (phase === "holding") {
        phase = "erasing";
        timer = setTimeout(tick, HOLD_MS);
      } else if (text.length > 0) {
        text = text.slice(0, -1);
        timer = setTimeout(tick, ERASE_MS);
      } else {
        lineIdx = (lineIdx + 1) % LINES.length;
        phase = "typing";
        timer = setTimeout(tick, 300);
      }

      el.textContent = text;
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !timer) timer = setTimeout(tick, TYPE_MS);
    });
    observer.observe(el);

    timer = setTimeout(tick, TYPE_MS);

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="card-surface overflow-hidden font-mono">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="text-xs text-text-muted">zsh — portfolio</span>
        </div>
        <span className="text-xs text-text-muted">~/src</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-4 text-sm">
        <span aria-hidden="true" className="shrink-0 text-accent">sajid:~$</span>
        <span aria-hidden="true" className="text-text-primary">
          <span ref={textRef} />
          <span className="ml-0.5 inline-block h-4 w-[7px] animate-pulse bg-accent align-middle" />
        </span>
      </div>
      <p className="sr-only">
        Terminal: {LINES.join(" · ")}
      </p>
    </div>
  );
}
