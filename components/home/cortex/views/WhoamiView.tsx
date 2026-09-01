"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { WHOAMI_ROLES } from "../lib";

// Small "system status" radar for the right panel: a sweep rotates once
// every RADAR_PERIOD seconds and four blips flash exactly as the sweep
// passes their angle (each blip's animation-delay is its own fraction of
// that same period) - reads as an active monitor rather than an ambiguous
// hub-and-spoke diagram.
const RADAR_PERIOD = 4;
const RADAR_BLIPS = [18, 100, 195, 288].map((angle) => ({
  angle,
  x: 50 + 34 * Math.cos((angle * Math.PI) / 180),
  y: 50 + 34 * Math.sin((angle * Math.PI) / 180),
  delay: (angle / 360) * RADAR_PERIOD,
}));

// A small piece of personality rather than another résumé row - cycles in
// place with a pure-CSS crossfade (negative animation-delay stagger, no
// timers, no React state) so it costs nothing per frame.
const STATUS_PHRASES = [
  "turning ideas into systems",
  "coffee → code → ship → repeat",
  "iterating in production",
];

// Persists across remounts within the same page session - switching to
// another Cortex command and back to whoami re-enters this component, but
// shouldn't replay the reveal every single time. Resets naturally on a full
// page reload since the module is re-evaluated fresh.
let hasPlayedWhoamiIntro = false;

const REVEAL_START_MS = 160;
const REVEAL_CHAR_MS = 9;
const REVEAL_LINE_PAUSE_MS = 240;

interface RevealState {
  /** Lines that have fully finished typing - rendered in full, permanently. */
  completedLines: string[];
  /** The one line currently being typed, if any. Never a stand-in for a
   *  line that hasn't started yet - when there's nothing left to type this
   *  is null, so there is no ambiguous "empty line + cursor" state. */
  currentLine: { text: string; char: number } | null;
}

// Explicit accumulating-reveal model: `completedLines` only ever grows by
// appending a fully-typed line, and `currentLine` describes progress on
// exactly one line (or nothing). Rendering is `completedLines + currentLine`
// - never a slice/index into the source array - so a not-yet-reached line
// can never accidentally render as blank text with a cursor.
function useAccumulatingReveal(lines: string[], start: boolean): RevealState {
  const reduced = useReducedMotion();
  const skip = !!reduced || hasPlayedWhoamiIntro;

  const [completedLines, setCompletedLines] = useState<string[]>(() =>
    skip ? lines : [],
  );
  const [char, setChar] = useState(0);

  useEffect(() => {
    if (!start || skip) return;
    if (completedLines.length >= lines.length) {
      hasPlayedWhoamiIntro = true;
      return;
    }
    const line = lines[completedLines.length];
    if (char < line.length) {
      const delay =
        completedLines.length === 0 && char === 0 ? REVEAL_START_MS : REVEAL_CHAR_MS;
      const t = setTimeout(() => setChar((c) => c + 1), delay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCompletedLines((prev) => [...prev, line]);
      setChar(0);
    }, REVEAL_LINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [start, completedLines, char, lines, skip]);

  const currentLine =
    !skip && completedLines.length < lines.length
      ? { text: lines[completedLines.length], char }
      : null;

  return { completedLines, currentLine };
}

export default function WhoamiView() {
  const roles = WHOAMI_ROLES.filter((r) => r.trim().length > 0);
  const { completedLines, currentLine } = useAccumulatingReveal(roles, true);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(300px,340px)]">
      <div className="card-surface relative overflow-hidden p-5 sm:p-6">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="text-accent-hover">$ whoami</span>
          <span className="h-px flex-1 bg-line" />
          <span>{`// identity`}</span>
        </div>

        <ul className="mt-5 space-y-2.5 font-mono text-sm">
          {completedLines.map((line) => (
            <li key={line} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
              <span className="text-text-secondary">{line}</span>
            </li>
          ))}
          {currentLine && (
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
              <span className="text-text-primary">
                {currentLine.text.slice(0, currentLine.char)}
                <span
                  aria-hidden="true"
                  data-cortex-anim
                  className="animate-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-accent"
                />
              </span>
            </li>
          )}
        </ul>

        <div
          className={`mt-5 flex items-center gap-2 font-mono text-xs text-success transition-opacity duration-300 ${
            completedLines.length === roles.length ? "opacity-100" : "opacity-0"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          <span>identity verified</span>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">occupation: software developer trainee, ledgercross</span>
        </div>
      </div>

      <div className="card-surface relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden="true"
          data-cortex-anim
          className="animate-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-accent/[0.07] to-transparent"
        />
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="text-accent-hover">$ system</span>
          <span className="h-px flex-1 bg-line" />
          <span>{`// runtime`}</span>
        </div>

        <div className="mt-4 flex justify-center">
          <div
            role="img"
            aria-label="System status radar: a sweep scanning four active signal points"
            className="relative h-[92px] w-[92px]"
          >
            <div
              aria-hidden="true"
              data-cortex-anim
              className="whoami-radar-sweep absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0) 30%, rgba(99, 102, 241, 0) 100%)",
              }}
            />
            <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full">
              <defs>
                <radialGradient id="whoami-hub-glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="rgba(99, 102, 241, 0.45)" />
                  <stop offset="1" stopColor="rgba(99, 102, 241, 0)" />
                </radialGradient>
              </defs>

              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(129, 140, 248, 0.28)" strokeWidth="1" />
              <circle cx="50" cy="50" r="26" fill="none" stroke="rgba(129, 140, 248, 0.16)" strokeWidth="1" />

              {RADAR_BLIPS.map((b, i) => (
                <circle
                  key={i}
                  cx={b.x}
                  cy={b.y}
                  r={2.4}
                  fill="#a5b4fc"
                  data-cortex-anim
                  className="whoami-radar-blip"
                  style={{ animationDelay: `${b.delay}s` }}
                />
              ))}

              <circle cx="50" cy="50" r="13" fill="url(#whoami-hub-glow)" />
              <circle
                cx="50"
                cy="50"
                r="3"
                fill="#f8fafc"
                data-cortex-anim
                className="whoami-hub-pulse"
              />
            </svg>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" data-cortex-anim />
          system online
        </div>

        <div className="mt-5 border-t border-line pt-4 font-mono text-xs">
          <span className="text-accent-hover">$ status</span>
          <div aria-hidden="true" className="relative mt-2 h-4 overflow-hidden">
            {STATUS_PHRASES.map((phrase, i) => (
              <span
                key={phrase}
                data-cortex-anim
                className="whoami-status-rotate absolute inset-0 whitespace-nowrap text-text-secondary"
                style={{ animationDelay: `${-i * 3.6}s` }}
              >
                <span className="text-accent-hover">›</span> {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
