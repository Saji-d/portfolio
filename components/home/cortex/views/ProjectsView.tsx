"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FLOW_COLUMNS, FLOW_EDGES, type FlowNode, type FlowTag } from "../lib";

interface MeasuredEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const TAG_STYLE: Record<FlowTag, string> = {
  production: "border-accent/30 bg-accent-dim text-accent",
  research: "border-accent-2/30 bg-accent-2/10 text-accent-2",
  project: "border-line bg-surface-2 text-text-muted",
};

const DOT_TONE: Record<string, string> = {
  accent: "bg-accent",
  violet: "bg-accent-2",
  muted: "bg-text-muted/50",
};

function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export default function ProjectsView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useDesktop();
  const [edges, setEdges] = useState<MeasuredEdge[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<FlowNode | null>(null);

  useEffect(() => {
    if (!isDesktop) return;
    let rafId = 0;
    const same = (a: MeasuredEdge[], b: MeasuredEdge[]) =>
      a.length === b.length &&
      a.every((e, i) => {
        const f = b[i];
        return (
          f &&
          e.id === f.id &&
          e.x1 === f.x1 &&
          e.y1 === f.y1 &&
          e.x2 === f.x2 &&
          e.y2 === f.y2
        );
      });
    const measure = () => {
      const root = containerRef.current;
      if (!root) return;
      const rootRect = root.getBoundingClientRect();
      const next: MeasuredEdge[] = [];
      for (const [a, b] of FLOW_EDGES) {
        const ea = root.querySelector(`[data-flow-id="${a}"]`) as HTMLElement | null;
        const eb = root.querySelector(`[data-flow-id="${b}"]`) as HTMLElement | null;
        if (!ea || !eb) continue;
        const ra = ea.getBoundingClientRect();
        const rb = eb.getBoundingClientRect();
        next.push({
          id: `${a}->${b}`,
          x1: ra.left - rootRect.left + ra.width / 2,
          y1: ra.top - rootRect.top + ra.height / 2,
          x2: rb.left - rootRect.left + rb.width / 2,
          y2: rb.top - rootRect.top + rb.height / 2,
        });
      }
      setEdges((prev) => (same(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        measure();
      });
    };
    measure();
    const ro = new ResizeObserver(schedule);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [isDesktop]);

  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent">$ projects</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// dependency graph · ${FLOW_COLUMNS.length} clusters`}</span>
      </div>

      <div ref={containerRef} className="relative mt-4">
        {isDesktop && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {edges.map((e) => {
              const lit = hovered !== null && (e.id.startsWith(`${hovered}->`) || e.id.endsWith(`->${hovered}`));
              return (
                <motion.path
                  key={e.id}
                  d={`M ${e.x1} ${e.y1} C ${(e.x1 + e.x2) / 2} ${e.y1}, ${(e.x1 + e.x2) / 2} ${e.y2}, ${e.x2} ${e.y2}`}
                  fill="none"
                  stroke={lit ? "rgba(79, 209, 197, 0.9)" : "rgba(124, 125, 255, 0.22)"}
                  strokeWidth={1}
                  pathLength={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })}
          </svg>
        )}

        <div className="relative flex flex-col gap-4 lg:flex-row">
          {FLOW_COLUMNS.map((col, colIdx) => (
            <div key={col.label} className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${DOT_TONE[col.tone]}`}
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                  {col.label}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
              {col.items.map((node, rowIdx) => {
                const isHovered = hovered === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    data-flow-id={node.id}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() =>
                      setSelected(
                        selected?.id === node.id
                          ? null
                          : { ...node, col: colIdx, row: rowIdx },
                      )
                    }
                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                      isHovered || selected?.id === node.id
                        ? "border-accent/50 bg-surface-2"
                        : "border-line bg-surface hover:border-line-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-text-muted">
                        {colIdx + 1}.{rowIdx + 1}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TAG_STYLE[node.tag]}`}
                      >
                        {node.tag}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-sm font-medium text-text-primary">
                      {node.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                      {node.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="card-surface mt-4 border-accent/20 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  inspecting {selected.tag}
                </span>
                <h4 className="mt-1 font-display text-base font-medium text-text-primary">
                  {selected.title}
                </h4>
              </div>
              <a
                href={selected.href}
                className="group inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-opacity hover:opacity-80"
              >
                open node
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {selected.tagline}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; the graph follows a build path — production, research, vision, craft · click a node
      </p>
    </div>
  );
}
