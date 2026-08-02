"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects, projectCategories, type ProjectCategory } from "@/data/projects";
import { ProjectCard, CompactProjectCard } from "@/components/work/ProjectCard";

export default function WorkGrid() {
  const [active, setActive] = useState<"All" | ProjectCategory>("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  const featured = filtered.filter((p) => p.featured);
  const compact = filtered.filter((p) => !p.featured);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
              active === cat
                ? "border-accent bg-accent-dim text-accent"
                : "border-line bg-surface text-text-secondary hover:border-accent/40 hover:text-text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          {featured.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {featured.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          )}
          {compact.length > 0 && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {compact.map((p) => (
                <CompactProjectCard key={p.slug} project={p} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
