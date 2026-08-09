"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrainCircuit } from "lucide-react";
import { SKILL_NETWORK, type SkillNetworkNode } from "@/data/skills";

const POSITIONS: Record<string, { x: number; y: number }> = {
  research: { x: 50, y: 13 },
  "ai-engineering": { x: 21, y: 30 },
  "computer-vision": { x: 79, y: 30 },
  "machine-learning": { x: 23, y: 72 },
  databases: { x: 42, y: 84 },
  backend: { x: 76, y: 72 },
};

const NLP_Y = 88;
const NLP_MIN_LEFT = 73;
const NLP_MAX_LEFT = 82;
const NLP_RIGHT_GAP = 138;

const pillClass = (on: boolean) =>
  `absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-1 font-mono text-[clamp(0.4375rem,2.1cqw,0.75rem)] leading-none transition-colors sm:gap-1.5 sm:px-2 sm:py-1.5 ${
    on
      ? "border-accent/50 bg-surface-2 text-accent"
      : "border-line bg-surface text-text-secondary hover:border-accent/30 hover:text-text-primary"
  }`;

export default function SkillsNetwork() {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<SkillNetworkNode | null>(null);
  const [nlpX, setNlpX] = useState(NLP_MAX_LEFT);
  const containerRef = useRef<HTMLDivElement>(null);

  const nlpNode = SKILL_NETWORK.disciplines.find((n) => n.id === "nlp");

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (!w) return;
      const fitted = 100 - (NLP_RIGHT_GAP / w) * 100;
      setNlpX(Math.max(NLP_MIN_LEFT, Math.min(NLP_MAX_LEFT, fitted)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
          {nlpNode && (
            <line
              x1={50}
              y1={50}
              x2={nlpX}
              y2={NLP_Y}
              vectorEffect="non-scaling-stroke"
              strokeWidth={
                active === nlpNode.id || selected?.id === nlpNode.id ? 1.5 : 1
              }
              className={
                active === nlpNode.id || selected?.id === nlpNode.id
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
              className="grid h-16 w-16 place-items-center rounded-full border border-accent/40 bg-surface text-accent shadow-[0_0_24px_rgba(79,209,197,0.18)]"
            >
              <BrainCircuit className="h-7 w-7" />
            </span>
          </div>
          <span className="mx-auto mt-1.5 block w-fit rounded-md bg-surface px-1.5 py-0.5 text-center font-mono font-semibold uppercase tracking-[0.18em] text-accent text-[clamp(0.4375rem,1.9cqw,0.6875rem)]">
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

        {nlpNode && (
          <button
            type="button"
            aria-pressed={selected?.id === nlpNode.id}
            onMouseEnter={() => setActive(nlpNode.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(nlpNode.id)}
            onBlur={() => setActive(null)}
            onClick={() =>
              setSelected(selected?.id === nlpNode.id ? null : nlpNode)
            }
            className={pillClass(active === nlpNode.id || selected?.id === nlpNode.id)}
            style={{ left: `${nlpX}%`, top: `${NLP_Y}%` }}
          >
            <span
              aria-hidden="true"
              className={`h-1 w-1 rounded-full ${
                active === nlpNode.id || selected?.id === nlpNode.id
                  ? "bg-accent"
                  : "bg-accent/60"
              }`}
            />
            {nlpNode.label}
          </button>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
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
                className="rounded-md border border-accent/20 bg-accent-dim/30 px-1.5 py-0.5 font-mono text-[10px] text-accent"
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
