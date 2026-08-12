"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";

interface Step {
  key: string;
  name: string;
  detail: string;
}

const steps: Step[] = [
  { key: "problem", name: "Problem", detail: "Find the real constraint." },
  {
    key: "understand",
    name: "Understand",
    detail: "Reduce the problem to its essential shape.",
  },
  {
    key: "design",
    name: "Design",
    detail: "Choose the simplest architecture that can scale.",
  },
  {
    key: "build",
    name: "Build",
    detail: "Turn the design into working software.",
  },
  {
    key: "test",
    name: "Test",
    detail: "Verify behavior, edge cases, and failure paths.",
  },
  {
    key: "ship",
    name: "Ship",
    detail: "Make it useful in the real world.",
  },
];

// Node x-positions as fractions of the row width, matching the 6 equal
// grid columns the buttons sit in: center of column i = (i + 0.5) / 6.
const VIEWBOX_W = 600;
const VIEWBOX_H = 44;
const nodeX = (i: number) => ((i + 0.5) / steps.length) * VIEWBOX_W;
const SEQUENCE_STEP_MS = 320;

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

export default function EngineeringMindSection() {
  const reduced = useReducedMotionPref();
  const pipelineRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activated, setActivated] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const online = reduced || activated >= steps.length;

  // Once the pipeline enters the viewport it comes online step by step
  // (1 → 2 → … → 6), each transition landing on a short interval so the
  // system reads as a controlled sequence rather than a wall of animation.
  useEffect(() => {
    if (reduced) return;
    const el = pipelineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setActivated(0);
        let i = 0;
        timerRef.current = setInterval(() => {
          i += 1;
          setActivated(i);
          if (i >= steps.length && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }, SEQUENCE_STEP_MS);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reduced]);

  return (
    <section
      id="engineering-mind"
      aria-label="How I Build"
      className="relative scroll-mt-0 pt-6 pb-6 sm:pt-8 sm:pb-8"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>How I Build</Eyebrow>
            <h2 className="section-title">
              The loop I run on every project, from problem to production.
            </h2>
          </div>
        </Reveal>

        <div ref={pipelineRef} className="mt-4 sm:mt-5">
          {/* Mobile / tablet: vertical stack with a static rail */}
          <Reveal delay={0.06} className="lg:hidden">
            <div className="relative pl-9">
              <span
                aria-hidden="true"
                className="absolute inset-y-2 left-[15px] w-px bg-line"
              />
              <div className="space-y-5">
                {steps.map((step, i) => {
                  const isActive = hovered === i;
                  const reached = reduced || i < activated;
                  return (
                    <div key={step.key} className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[21px] top-1 grid h-[18px] w-[18px] place-items-center rounded-full border transition-colors duration-300 ${
                          reached || isActive
                            ? "border-accent bg-accent-dim"
                            : "border-line bg-surface-2"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                            reached || isActive ? "bg-accent" : "bg-text-muted"
                          }`}
                        />
                      </span>
                      <button
                        type="button"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered(null)}
                        aria-label={`Step ${i + 1} of ${steps.length}, ${step.name}: ${step.detail}`}
                        className="block w-full rounded-md text-left"
                      >
                        <span
                          className={`mono-label transition-colors duration-300 ${
                            isActive ? "text-accent" : "text-text-secondary"
                          }`}
                        >
                          {step.name}
                        </span>
                      </button>
                      <p
                        className={`mt-1 body-copy transition-colors duration-300 ${
                          isActive ? "text-text-secondary" : "text-text-muted"
                        }`}
                      >
                        {step.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Desktop: horizontal flow, nodes connected by an animated line */}
          <Reveal delay={0.06} className="hidden lg:block">
            <div className="relative">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-11 w-full"
                viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d={`M${nodeX(0)},${VIEWBOX_H / 2} L${nodeX(5)},${VIEWBOX_H / 2}`}
                  stroke="var(--line)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                  className="transition-opacity duration-300"
                  style={{ opacity: online ? 0.4 : 0.22 }}
                />
                {steps.slice(0, -1).map((step, i) => {
                  const hoverLit = hovered === i || hovered === i + 1;
                  const lit = online || i + 1 <= activated;
                  return (
                    <path
                      key={step.key}
                      d={`M${nodeX(i)},${VIEWBOX_H / 2} L${nodeX(i + 1)},${VIEWBOX_H / 2}`}
                      stroke="var(--accent)"
                      strokeWidth={hoverLit ? 1.8 : 1.3}
                      strokeDasharray="4 6"
                      className="animate-circuit-flow transition-[stroke-width,opacity] duration-300"
                      style={{
                        opacity: hovered !== null ? (hoverLit ? 0.85 : 0.15) : lit ? 0.65 : 0.1,
                      }}
                    />
                  );
                })}
              </svg>

              <div className="relative grid grid-cols-6">
                {steps.map((step, i) => {
                  const reached = reduced || i < activated;
                  const isActive = hovered === i;
                  const related = hovered !== null && Math.abs(hovered - i) === 1;
                  const dimmed = hovered !== null && !isActive && !related;
                  const front = activated === i + 1 && !online;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered(null)}
                        aria-label={`Step ${i + 1} of ${steps.length}, ${step.name}: ${step.detail}`}
                        className="group flex flex-col items-center rounded-lg transition-transform duration-300"
                      >
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-xs font-semibold transition-all duration-300 ${
                            reached
                              ? "border-accent/50 bg-accent-dim text-accent"
                              : "border-line bg-surface-2 text-text-muted"
                          } ${
                            isActive
                              ? "scale-110 border-accent bg-accent-dim text-accent shadow-[0_0_22px_var(--accent-soft)]"
                              : related
                                ? "border-accent/40 text-accent"
                                : ""
                          } ${
                            front
                              ? "animate-pipeline-front"
                              : ""
                          } ${dimmed ? "opacity-40" : "opacity-100"}`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={`mono-label mt-2.5 transition-colors duration-300 ${
                            reached ? "text-text-secondary" : "text-text-muted"
                          } ${isActive ? "text-accent" : ""} ${
                            dimmed ? "opacity-40" : "opacity-100"
                          }`}
                        >
                          {step.name}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-2.5 h-6">
                {steps.map((step, i) => (
                  <p
                    key={step.key}
                    aria-hidden={hovered !== i}
                    className={`absolute inset-x-0 text-center body-copy transition-all duration-300 ${
                      hovered === i
                        ? "translate-y-0 text-text-secondary opacity-100"
                        : "pointer-events-none -translate-y-0.5 text-text-muted opacity-0"
                    }`}
                  >
                    {step.detail}
                  </p>
                ))}
                {online && hovered === null && (
                  <p className="absolute inset-x-0 text-center body-copy text-text-muted">
                    Hover a stage to see how each step works.
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
