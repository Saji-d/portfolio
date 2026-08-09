"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { RESEARCH_TREE, type ResearchLeaf } from "../lib";
import { getResearch } from "@/data/research";

const LEAVES: ResearchLeaf[] = RESEARCH_TREE.flatMap((folder) => folder.leaves);

const FOLDER_FOR: Record<string, string> = {};
for (const folder of RESEARCH_TREE) {
  for (const leaf of folder.leaves) FOLDER_FOR[leaf.id] = folder.name;
}

export default function ResearchView() {
  const [selectedId, setSelectedId] = useState<string>(LEAVES[0].id);
  const selected = LEAVES.find((l) => l.id === selectedId) ?? LEAVES[0];
  const study = getResearch(selected.id);
  const main = selected.metrics.slice(0, 4);
  const extra = selected.metrics.slice(4);

  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent">$ research</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// research archive · ${LEAVES.length} studies`}</span>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-lg border border-line bg-surface/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:14px_14px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative p-3 sm:p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  <span className="text-accent">{FOLDER_FOR[selected.id]}</span>
                  <span className="h-2.5 w-px bg-line" />
                  <span className="truncate">{selected.file}</span>
                </div>
                <h4 className="mt-1.5 truncate font-display text-sm font-medium text-text-primary">
                  {selected.title}
                </h4>
                <p className="mt-1 truncate font-mono text-[10px] text-text-muted">
                  {study?.field ?? ""}
                </p>
              </div>
              <a
                href={selected.href}
                className="group inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-accent transition-opacity hover:opacity-80"
              >
                open study
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-secondary">
              {selected.oneLiner}
            </p>

            {main.length > 0 && (
              <div className="mt-3 grid grid-cols-4 border-t border-line">
                {main.map((m, i) => (
                  <div
                    key={m.label}
                    className={`py-1.5 ${i > 0 ? "border-l border-line px-2.5" : "pr-2.5"}`}
                  >
                    <div className="truncate font-mono text-xs font-medium text-accent">
                      {m.value}
                    </div>
                    <div className="truncate text-[9px] uppercase tracking-[0.12em] text-text-muted">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {extra.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-t border-line py-1.5 font-mono text-[10px] text-text-muted">
                {extra.map((m) => (
                  <span key={m.label}>
                    <span className="text-text-secondary">{m.value}</span>
                    <span className="ml-1">{m.label}</span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
          <span>archive</span>
          <span className="h-px flex-1 bg-line" />
          <span>{LEAVES.length} entries</span>
        </div>
        <ul className="mt-1.5">
          {LEAVES.map((leaf, i) => {
            const on = leaf.id === selectedId;
            return (
              <li key={leaf.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(leaf.id)}
                  className={`group flex w-full items-center gap-3 border-b border-line/60 py-1 text-left last:border-b-0 ${
                    on ? "text-accent" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span
                    className={`w-6 shrink-0 font-mono text-[10px] ${
                      on ? "text-accent" : "text-text-muted/60"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`w-40 shrink-0 truncate font-mono text-[10px] ${
                      on ? "text-accent/80" : "text-text-muted"
                    }`}
                  >
                    {leaf.file}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs">{leaf.title}</span>
                  <span className="shrink-0 font-mono text-[10px] text-text-muted">
                    {leaf.metrics[0]?.value ?? ""}
                  </span>
                  <span
                    className={`hidden shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider sm:inline ${
                      on
                        ? "border-accent/40 bg-accent-dim/30 text-accent"
                        : "border-line bg-surface text-text-muted"
                    }`}
                  >
                    {FOLDER_FOR[leaf.id]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-3 font-mono text-[11px] text-text-muted">
        &gt; select an entry to inspect it · every entry links to the full study
      </p>
    </div>
  );
}
