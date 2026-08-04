"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";
import { RESEARCH_TREE, type ResearchLeaf } from "../lib";

const initialOpen = { [RESEARCH_TREE[0].name]: true };

export default function ResearchView() {
  const [open, setOpen] = useState<Record<string, boolean>>(initialOpen);
  const [selected, setSelected] = useState<ResearchLeaf>(RESEARCH_TREE[0].leaves[0]);

  const toggle = (name: string) => setOpen((o) => ({ ...o, [name]: !o[name] }));

  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent">$ research</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// archive · ${RESEARCH_TREE.length} folders`}</span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="card-surface p-3 font-mono">
          <div className="flex items-center gap-2 px-2 py-1.5 text-text-muted">
            <Folder className="h-4 w-4 text-accent" />
            <span className="text-sm text-text-secondary">research/</span>
            <span className="ml-auto text-[10px]">5 files</span>
          </div>

          {RESEARCH_TREE.map((folder) => {
            const isOpen = !!open[folder.name];
            return (
              <div key={folder.name}>
                <button
                  type="button"
                  onClick={() => toggle(folder.name)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-2"
                >
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                  {isOpen ? (
                    <FolderOpen className="h-4 w-4 shrink-0 text-warning" />
                  ) : (
                    <Folder className="h-4 w-4 shrink-0 text-warning" />
                  )}
                  <span>{folder.name}/</span>
                  <span className="ml-auto text-[10px] text-text-muted">
                    {folder.leaves.length}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      {folder.leaves.map((leaf) => {
                        const isSelected = selected.id === leaf.id;
                        return (
                          <li key={leaf.id}>
                            <button
                              type="button"
                              onClick={() => setSelected(leaf)}
                              className={`ml-7 flex w-[calc(100%-1.75rem)] items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                                isSelected
                                  ? "bg-accent-dim/40 text-accent"
                                  : "text-text-secondary hover:bg-surface-2"
                              }`}
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                              <span className="truncate">{leaf.file}</span>
                              <span className="ml-auto shrink-0 pl-2 text-[10px] text-text-muted">
                                {leaf.metrics[0]?.value ?? ""}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="card-surface relative overflow-hidden p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
                <span className="text-accent">{`// reading`}</span>
                <span>{selected.file}</span>
              </div>
              <h4 className="mt-3 font-display text-lg font-medium text-text-primary">
                {selected.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {selected.oneLiner}
              </p>
              {selected.metrics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.metrics.slice(0, 4).map((m) => (
                    <span
                      key={m.label}
                      className="rounded-lg border border-line bg-surface-2 px-3 py-1.5"
                    >
                      <span className="block font-mono text-xs font-medium text-accent">
                        {m.value}
                      </span>
                      <span className="block text-[10px] text-text-muted">{m.label}</span>
                    </span>
                  ))}
                </div>
              )}
              <a
                href={selected.href}
                className="group mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-opacity hover:opacity-80"
              >
                read the full study
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; open a file to preview it · every entry links to the full write-up
      </p>
    </div>
  );
}
