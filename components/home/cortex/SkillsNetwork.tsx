"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrainCircuit } from "lucide-react";
import { SKILL_NETWORK, type SkillNetworkNode } from "@/data/skills";

const POSITIONS: Record<string, { x: number; y: number }> = {
  nlp: { x: 50, y: 13 },
  "ai-engineering": { x: 21, y: 30 },
  "computer-vision": { x: 79, y: 30 },
  "machine-learning": { x: 17, y: 59 },
  databases: { x: 42, y: 84 },
  backend: { x: 83, y: 61 },
};

const RESEARCH_Y = 88;
const RESEARCH_MIN_LEFT = 73;
const RESEARCH_MAX_LEFT = 82;
const RESEARCH_RIGHT_GAP = 138;

const pillClass = (on: boolean) =>
  `absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-1 font-mono text-[clamp(0.4375rem,2.1cqw,0.75rem)] leading-none transition-colors sm:gap-1.5 sm:px-2 sm:py-1.5 ${
    on
      ? "border-accent/50 bg-surface-2 text-accent-hover"
      : "border-line bg-surface text-text-secondary hover:border-accent/30 hover:text-text-primary"
  }`;

export default function SkillsNetwork() {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<SkillNetworkNode | null>(null);
  const [researchX, setResearchX] = useState(RESEARCH_MAX_LEFT);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const researchNode = SKILL_NETWORK.disciplines.find(
    (n) => n.id === "research",
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (!w) return;
      const fitted = 100 - (RESEARCH_RIGHT_GAP / w) * 100;
      setResearchX(
        Math.max(RESEARCH_MIN_LEFT, Math.min(RESEARCH_MAX_LEFT, fitted)),
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The tech-stack panel renders below the network diagram, which can push
  // it past the bottom of the console's scrollable output - without this,
  // clicking a discipline that's already visible looks like a no-op, so
  // people don't think to scroll and never see the stack. Bring it into view
  // whenever a discipline is selected.
  useEffect(() => {
    if (!selected) return;
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-xl @container"
    >
      <div className="relative aspect-[9/5] w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {SKILL_NETWORK.disciplines.map((node) => {
            const pos = POSITIONS[node.id];
            if (!pos) return null;
            const on = active === node.id || selected?.id === node.id;
            return (
              <line
                key={node.id}
                x1={50}
                y1={50}
                x2={pos.x}
                y2={pos.y}
                vectorEffect="non-scaling-stroke"
                strokeWidth={on ? 1.5 : 1}
                className={on ? "stroke-accent" : "stroke-accent/35"}
                style={{
                  transition: "stroke 0.2s ease, stroke-width 0.2s ease",
                }}
              />
            );
          })}
          {researchNode && (
            <line
              x1={50}
              y1={50}
              x2={researchX}
              y2={RESEARCH_Y}
              vectorEffect="non-scaling-stroke"
              strokeWidth={
                active === researchNode.id || selected?.id === researchNode.id
                  ? 1.5
                  : 1
              }
              className={
                active === researchNode.id || selected?.id === researchNode.id
                  ? "stroke-accent"
                  : "stroke-accent/35"
              }
              style={{
                transition: "stroke 0.2s ease, stroke-width 0.2s ease",
              }}
            />
          )}
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid place-items-center">
            <span
              aria-hidden="true"
              data-cortex-anim
              className="absolute -inset-3 animate-pulse rounded-full border border-accent/20"
            />
            <span
              aria-hidden="true"
              className="grid h-16 w-16 place-items-center rounded-full border border-accent/40 bg-surface text-accent-hover shadow-[0_0_24px_rgba(99, 102, 241,0.18)]"
            >
              <BrainCircuit className="h-7 w-7" />
            </span>
          </div>
          <span className="mx-auto mt-1.5 block w-fit rounded-md bg-surface px-1.5 py-0.5 text-center font-mono font-semibold uppercase tracking-[0.18em] text-accent-hover text-[clamp(0.4375rem,1.9cqw,0.6875rem)]">
            {SKILL_NETWORK.center}
          </span>
        </div>

        {SKILL_NETWORK.disciplines.map((node) => {
          const pos = POSITIONS[node.id];
          if (!pos) return null;
          const on = active === node.id || selected?.id === node.id;
          return (
            <button
              key={node.id}
              type="button"
              aria-pressed={selected?.id === node.id}
              onMouseEnter={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
              onClick={() =>
                setSelected(selected?.id === node.id ? null : node)
              }
              className={pillClass(on)}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span
                aria-hidden="true"
                className={`h-1 w-1 rounded-full ${
                  on ? "bg-accent" : "bg-accent/60"
                }`}
              />
              {node.label}
            </button>
          );
        })}

        {researchNode && (
          <button
            type="button"
            aria-pressed={selected?.id === researchNode.id}
            onMouseEnter={() => setActive(researchNode.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(researchNode.id)}
            onBlur={() => setActive(null)}
            onClick={() =>
              setSelected(
                selected?.id === researchNode.id ? null : researchNode,
              )
            }
            className={pillClass(
              active === researchNode.id || selected?.id === researchNode.id,
            )}
            style={{ left: `${researchX}%`, top: `${RESEARCH_Y}%` }}
          >
            <span
              aria-hidden="true"
              className={`h-1 w-1 rounded-full ${
                active === researchNode.id || selected?.id === researchNode.id
                  ? "bg-accent"
                  : "bg-accent/60"
              }`}
            />
            {researchNode.label}
          </button>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            ref={detailRef}
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto mt-2 flex w-fit max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 rounded-md border border-line bg-surface-2/40 px-2 py-1"
          >
            <span className="mr-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">
              {selected.label}
            </span>
            {selected.techs.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-accent/20 bg-accent-dim/30 px-1.5 py-0.5 font-mono text-[10px] text-accent-hover"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
