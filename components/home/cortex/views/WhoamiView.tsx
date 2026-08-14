"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { WHOAMI_ROLES } from "../lib";

// Small system-diagram graph for the right panel: one hub plus four
// satellite nodes, laid out once as plain numbers so both the static line
// geometry and the signal's motion path stay in sync.
const HUB = { x: 100, y: 45 };
const SYS_NODES = [
  { x: 55, y: 20 },
  { x: 145, y: 20 },
  { x: 145, y: 70 },
  { x: 55, y: 70 },
];
const SIGNAL_PATH = `M${SYS_NODES[0].x},${SYS_NODES[0].y} L${HUB.x},${HUB.y} L${SYS_NODES[1].x},${SYS_NODES[1].y} L${HUB.x},${HUB.y} L${SYS_NODES[2].x},${SYS_NODES[2].y} L${HUB.x},${HUB.y} L${SYS_NODES[3].x},${SYS_NODES[3].y} L${HUB.x},${HUB.y} Z`;

const SYSTEM_ROWS: { label: string; value: string }[] = [
  { label: "mode", value: "building & shipping" },
  { label: "focus", value: "ai/ml + full-stack" },
  { label: "research", value: "ml · cv · nlp" },
];

function useTypewriter(items: string[], start: boolean) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [char, setChar] = useState(0);

  useEffect(() => {
    if (!start || reduced) return;
    if (count >= items.length) return;
    if (count === 0) {
      const t = setTimeout(() => setCount(1), 180);
      return () => clearTimeout(t);
    }
    const line = items[count - 1];
    if (char < line.length) {
      const t = setTimeout(() => setChar(char + 1), 14);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCount((c) => c + 1);
      setChar(0);
    }, 170);
    return () => clearTimeout(t);
  }, [start, count, char, items, reduced]);

  const isReduced = !!reduced;
  return {
    count: isReduced ? items.length : count,
    char: isReduced ? 0 : char,
    typing: !isReduced,
  };
}

export default function WhoamiView() {
  const roles = WHOAMI_ROLES.filter((r) => r.trim().length > 0);
  const { count, char, typing } = useTypewriter(roles, true);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(300px,340px)]">
      <div className="card-surface relative overflow-hidden p-5 sm:p-6">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="text-accent">$ whoami</span>
          <span className="h-px flex-1 bg-line" />
          <span>{`// identity`}</span>
        </div>

        <ul className="mt-5 space-y-2.5 font-mono text-sm">
          {roles.map((role, i) => {
            const done =
              count === roles.length &&
              char === roles[roles.length - 1].length;
            const active = typing && !done && i === count - 1;
            const text = active ? role.slice(0, char) : role;
            return (
              <li key={role} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                <span className={active ? "text-text-primary" : "text-text-secondary"}>
                  {text}
                  {active && (
                    <span
                      aria-hidden="true"
                      data-cortex-anim
                      className="animate-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-accent"
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center gap-2 font-mono text-xs text-success">
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
          <span className="text-accent">$ system</span>
          <span className="h-px flex-1 bg-line" />
          <span>{`// runtime`}</span>
        </div>

        <div className="mt-4 flex justify-center">
          <svg
            viewBox="0 0 200 90"
            role="img"
            aria-label="System diagram: a signal circulating through four connected nodes around a central hub"
            className="h-[100px] w-full max-w-[230px]"
          >
            <defs>
              <radialGradient id="whoami-hub-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="rgba(99, 102, 241, 0.45)" />
                <stop offset="1" stopColor="rgba(99, 102, 241, 0)" />
              </radialGradient>
            </defs>

            <g stroke="rgba(129, 140, 248, 0.32)" strokeWidth="1" fill="none">
              {SYS_NODES.map((n, i) => (
                <line key={i} x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} />
              ))}
            </g>

            {SYS_NODES.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={2.4}
                data-cortex-anim
                className="whoami-node-twinkle"
                style={{ animationDelay: `${i * 0.6}s` }}
                fill="#a5b4fc"
              />
            ))}

            <circle
              cx={HUB.x}
              cy={HUB.y}
              r={13}
              fill="url(#whoami-hub-glow)"
              data-cortex-anim
              className="whoami-hub-pulse"
            />
            <circle cx={HUB.x} cy={HUB.y} r={3} fill="#f8fafc" />

            <circle
              r={2.6}
              fill="#f8fafc"
              data-cortex-anim
              className="whoami-signal-travel"
              style={{ offsetPath: `path("${SIGNAL_PATH}")` }}
            />
          </svg>
        </div>

        <div className="mt-1 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" data-cortex-anim />
          system online
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-line pt-4 font-mono text-xs">
          {SYSTEM_ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <dt className="uppercase tracking-[0.14em] text-text-muted">{row.label}</dt>
              <dd className="text-text-secondary">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
