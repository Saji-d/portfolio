"use client";

import { useSyncExternalStore } from "react";

type Variant = "branch" | "grid" | "pulse";

interface TraceDef {
  lines: string[];
  nodes: readonly [number, number][];
}

// Abstract, hand-drawn right-angle routes — the visual language of PCB
// traces / architecture diagrams, not a literal circuit board. Three
// variants are reused (mirrored/rotated via className) across sections
// rather than hand-authoring bespoke art per section, so the whole site
// reads as one system with subtle variation, not eight different graphics.
const TRACES: Record<Variant, TraceDef> = {
  branch: {
    lines: [
      "M20,8 L20,64 L78,64 L78,112",
      "M78,112 L136,112 L136,156",
      "M78,112 L52,112 L52,176",
    ],
    nodes: [
      [20, 8],
      [136, 156],
      [52, 176],
    ],
  },
  grid: {
    lines: [
      "M8,28 L84,28 L84,84",
      "M124,8 L124,72 L184,72",
      "M48,116 L48,176 L144,176",
    ],
    nodes: [
      [84, 84],
      [184, 72],
      [144, 176],
      [8, 28],
    ],
  },
  pulse: {
    lines: ["M8,180 L8,108 L68,108 L68,48 L156,48 L156,12"],
    nodes: [
      [8, 180],
      [156, 12],
    ],
  },
};

const PULSE_PATH = TRACES.pulse.lines[0];

function subscribeReducedMotion(cb: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

function useReducedMotionPref(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export default function CircuitTraces({
  variant,
  className = "",
  mirror = false,
}: {
  variant: Variant;
  className?: string;
  /** Horizontally flips the trace for cheap visual variety when a variant is reused elsewhere on the page. */
  mirror?: boolean;
}) {
  const reduced = useReducedMotionPref();
  const pulseEnabled = variant === "pulse" && !reduced;

  const def = TRACES[variant];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      fill="none"
      className={`pointer-events-none absolute text-accent ${mirror ? "-scale-x-100" : ""} ${className}`}
    >
      {def.lines.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeOpacity={0.16} strokeWidth={1} />
      ))}
      {def.nodes.map(([x, y], i) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={i === 0 ? 2.2 : 1.6} fill="currentColor" opacity={0.32} />
      ))}
      {variant === "pulse" && pulseEnabled && (
        <circle r="2" fill="var(--accent-3)" opacity="0.75">
          <animateMotion dur="7s" repeatCount="indefinite" path={PULSE_PATH} />
        </circle>
      )}
    </svg>
  );
}
