"use client";

import { useEffect, useRef } from "react";
import { PROMPT, TERMINAL_SCRIPT } from "@/components/home/cortex/terminal";

const TYPE_MS = 34;
const HOLD_MS = 1200;
const ERASE_MS = 14;

export default function TerminalCard() {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = TERMINAL_SCRIPT[TERMINAL_SCRIPT.length - 1];
      return;
    }

    let lineIdx = 0;
    let text = "";
    let phase: "typing" | "erasing" = "typing";
    let timer: ReturnType<typeof setTimeout> | null = null;
    let visible = true;
    let done = false;

    const tick = () => {
      timer = null;
      if (done || !visible) return;
      const line = TERMINAL_SCRIPT[lineIdx];

      if (phase === "typing") {
        if (text.length < line.length) {
          text = line.slice(0, text.length + 1);
          timer = setTimeout(tick, TYPE_MS);
        } else if (lineIdx === TERMINAL_SCRIPT.length - 1) {
          done = true;
          el.textContent = text;
          return;
        } else {
          phase = "erasing";
          timer = setTimeout(tick, HOLD_MS);
        }
      } else if (text.length > 0) {
        text = text.slice(0, -1);
        timer = setTimeout(tick, ERASE_MS);
      } else {
        lineIdx += 1;
        phase = "typing";
        timer = setTimeout(tick, 300);
      }

      el.textContent = text;
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !timer && !done) timer = setTimeout(tick, TYPE_MS);
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
          <span className="text-xs text-text-muted">cortex, compact</span>
        </div>
        <span className="text-xs text-text-muted">~/brain</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-4 text-sm">
        <span aria-hidden="true" className="shrink-0 text-accent">{PROMPT}</span>
        <span aria-hidden="true" className="min-w-0 flex-1 truncate text-text-primary">
          <span ref={textRef} />
        </span>
        <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[7px] shrink-0 animate-pulse bg-accent align-middle" />
      </div>
      <p className="sr-only">
        Terminal: {TERMINAL_SCRIPT.join(" · ")}
      </p>
    </div>
  );
}
