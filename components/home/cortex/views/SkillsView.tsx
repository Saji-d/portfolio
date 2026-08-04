"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Brain } from "lucide-react";
import { SKILL_NODES, SKILL_DETAILS, SKILLS_MOBILE } from "../lib";

export default function SkillsView() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [inspect, setInspect] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const inspector =
    inspect &&
    SKILL_DETAILS[inspect] && (
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-surface px-4 py-3 font-mono text-xs">
        <span className="text-accent">inspecting</span>
        <span className="text-text-primary">
          {SKILL_NODES.find((n) => n.id === inspect)?.label}
        </span>
        <span className="text-text-muted">→</span>
        <span className="text-text-secondary">{SKILL_DETAILS[inspect].join(" · ")}</span>
      </div>
    );

  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent">$ skills</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// neural map · 7 disciplines`}</span>
      </div>

      <div className="relative mt-4 hidden h-[440px] lg:block">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {SKILL_NODES.map((node, i) => (
            <motion.line
              key={node.id}
              x1={50}
              y1={50}
              x2={node.x}
              y2={node.y}
              stroke={
                hovered === node.id
                  ? "rgba(79, 209, 197, 0.85)"
                  : "rgba(79, 209, 197, 0.28)"
              }
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: reduced ? 0 : 1,
                delay: 0.3 + i * 0.08,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid h-24 w-24 place-items-center rounded-full border border-accent/30 bg-surface/90">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-accent/40"
              animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <div className="flex flex-col items-center gap-1 font-mono text-[10px] text-text-secondary">
              <Brain className="h-5 w-5 text-accent" />
              <span className="uppercase tracking-[0.14em]">the engineer</span>
            </div>
          </div>
        </div>

        {SKILL_NODES.map((node, i) => {
          const active = hovered === node.id || inspect === node.id;
          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3 + i * 0.06,
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
            >
              <motion.button
                type="button"
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setInspect(inspect === node.id ? null : node.id)}
                whileHover={reduced ? undefined : { scale: 1.07 }}
                whileTap={reduced ? undefined : { scale: 0.95 }}
                className={`-translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-xs backdrop-blur transition-colors ${
                  active
                    ? "border-accent/60 bg-accent-dim text-accent"
                    : "border-line bg-surface/80 text-text-secondary hover:border-accent/40"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${active ? "bg-accent" : "bg-text-muted"}`}
                />
                {node.label}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <ul className="mt-4 space-y-2.5 lg:hidden">
        {SKILLS_MOBILE.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex flex-col items-center">
              <span
                className={`h-2 w-2 rounded-full ${
                  inspect === SKILL_NODES[i].id ? "bg-accent" : "bg-text-muted/50"
                }`}
              />
              <span className="h-4 w-px bg-line" />
            </span>
            <button
              type="button"
              onClick={() =>
                setInspect(inspect === SKILL_NODES[i].id ? null : SKILL_NODES[i].id)
              }
              className={`font-mono text-sm transition-colors ${
                inspect === SKILL_NODES[i].id
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {inspector}

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; hover a node to trace its lines · click to inspect the stack
      </p>
    </div>
  );
}
