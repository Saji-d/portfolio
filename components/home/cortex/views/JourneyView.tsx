"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { JOURNEY } from "../lib";

export default function JourneyView() {
  const [active, setActive] = useState(JOURNEY[JOURNEY.length - 1].step);
  const reduced = useReducedMotion();
  const current = JOURNEY.find((s) => s.step === active)!;

  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent">$ journey</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// roadmap · ${JOURNEY.length} stops`}</span>
      </div>

      <div className="relative mt-6 hidden md:block">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <motion.line
            x1={4}
            y1={50}
            x2={94}
            y2={50}
            stroke="rgba(79, 209, 197, 0.35)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 1.4, ease: "easeInOut" }}
          />
        </svg>

        {JOURNEY.map((stop, i) => {
          const above = i % 2 === 0;
          const isActive = active === stop.step;
          return (
            <div
              key={stop.step}
              className="absolute top-0 h-full"
              style={{ left: `${stop.x}%`, transform: "translateX(-50%)" }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-4">
                {above && <StopLabel stop={stop} isActive={isActive} onSelect={() => setActive(stop.step)} />}
                <button
                  type="button"
                  onClick={() => setActive(stop.step)}
                  className="relative grid h-3.5 w-3.5 place-items-center"
                  aria-label={`${stop.label} — ${stop.period}`}
                >
                  {stop.current && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-accent/50"
                      animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-accent shadow-[0_0_12px_rgba(79,209,197,0.9)]"
                        : "bg-text-muted/50 hover:bg-accent/70"
                    }`}
                  />
                </button>
                {!above && <StopLabel stop={stop} isActive={isActive} onSelect={() => setActive(stop.step)} />}
              </div>
            </div>
          );
        })}
      </div>

      <ol className="relative mt-4 space-y-5 md:hidden">
        <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
        {JOURNEY.map((stop) => {
          const isActive = active === stop.step;
          return (
            <li key={stop.step} className="relative pl-6">
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setActive(stop.step)}
                className={`absolute left-0 top-1 h-[11px] w-[11px] rounded-full ${
                  isActive ? "bg-accent shadow-[0_0_10px_rgba(79,209,197,0.8)]" : "bg-text-muted/40"
                }`}
              />
              <button type="button" onClick={() => setActive(stop.step)} className="block text-left">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-accent">{stop.step}</span>
                  <span
                    className={`font-display text-sm font-medium ${
                      isActive ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {stop.label}
                  </span>
                  {stop.current && (
                    <span className="rounded-full bg-accent-dim px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                      now
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-text-muted">{stop.period}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="card-surface mt-5 p-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                stop {current.step} — {current.label}
              </span>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
                {current.note}
              </p>
            </div>
            <span className="shrink-0 font-mono text-xs text-text-muted">{current.period}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; each stop opens a note · the line always moves forward
      </p>
    </div>
  );
}

interface StopLabelProps {
  stop: (typeof JOURNEY)[number];
  isActive: boolean;
  onSelect: () => void;
}

function StopLabel({ stop, isActive, onSelect }: StopLabelProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
        {stop.step}
      </span>
      <button
        type="button"
        onClick={onSelect}
        className={`font-display text-sm font-medium transition-colors ${
          isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
        }`}
      >
        {stop.label}
      </button>
      <span className="font-mono text-[10px] text-text-muted">{stop.period}</span>
      {stop.current && (
        <span className="rounded-full bg-accent-dim px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
          you are here
        </span>
      )}
    </div>
  );
}
