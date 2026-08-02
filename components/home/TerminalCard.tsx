"use client";

import { useEffect, useRef, useState } from "react";

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
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const line = LINES[lineIdx];

    if (phase === "typing") {
      if (text.length < line.length) {
        const t = setTimeout(() => setText(line.slice(0, text.length + 1)), TYPE_MS);
        timers.current.push(t);
      } else {
        const t = setTimeout(() => setPhase("holding"), HOLD_MS);
        timers.current.push(t);
      }
    } else if (phase === "holding") {
      const t = setTimeout(() => setPhase("erasing"), HOLD_MS);
      timers.current.push(t);
    } else if (phase === "erasing") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), ERASE_MS);
        timers.current.push(t);
      } else {
        const t = setTimeout(() => {
          setLineIdx((i) => (i + 1) % LINES.length);
          setPhase("typing");
        }, 300);
        timers.current.push(t);
      }
    }

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [text, phase, lineIdx]);

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
          {text}
          <span className="ml-0.5 inline-block h-4 w-[7px] animate-pulse bg-accent align-middle" />
        </span>
      </div>
      <p className="sr-only">
        Terminal: {LINES.join(" · ")}
      </p>
    </div>
  );
}
