"use client";

import { memo, useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { allProjects, projectCategories, UNIVERSITY_WORK, type ProjectCategory } from "@/data/projects";
import { ProjectCard } from "@/components/work/ProjectCard";

const MemoCard = memo(ProjectCard);

function matchesQuery(p: (typeof allProjects)[number], q: string): boolean {
  if (!q) return true;
  const haystack = [
    p.name,
    p.tagline,
    p.summary,
    p.category,
    p.role,
    ...p.badges,
    ...p.stack,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export default function WorkGrid() {
  const [active, setActive] = useState<"All" | ProjectCategory>("All");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalized = deferredQuery.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      allProjects.filter((p) => {
        const matchesCategory = active === "All" || p.category === active;
        return matchesCategory && matchesQuery(p, normalized);
      }),
    [active, normalized]
  );

  // Unfiltered view: university projects drop into their own group below the main grid.
  const grouped = active === "All" && !normalized;
  const mainProjects = grouped ? filtered.filter((p) => !UNIVERSITY_WORK.has(p.slug)) : filtered;
  const universityProjects = grouped ? filtered.filter((p) => UNIVERSITY_WORK.has(p.slug)) : [];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search projects"
            placeholder="Search by title, stack or tagline…"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-10 font-mono text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        <p aria-live="polite" className="font-mono text-xs text-text-muted">
          {filtered.length} / {allProjects.length} projects
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filter projects by category">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={active === cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
              active === cat
                ? "border-accent bg-accent-dim text-accent-hover"
                : "border-line bg-surface text-text-secondary hover:border-accent/40 hover:text-text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div
          key={`${active}-${normalized}`}
          className="grid-enter mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mainProjects.map((p) => (
            <MemoCard
              key={p.slug}
              project={p}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
      ) : null}

      {filtered.length > 0 && universityProjects.length > 0 && (
        <section className="mt-14" aria-labelledby="university-work-heading">
          <h3 id="university-work-heading" className="font-display text-xl font-medium tracking-tight text-text-primary">
            University projects
          </h3>
          <p className="mt-1 text-sm text-text-muted">Coursework and projects from my time at AIUB, before my focus on full-stack engineering.</p>
          <div className="grid-enter mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {universityProjects.map((p) => (
              <MemoCard
                key={p.slug}
                project={p}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <div className="card-surface mt-8 px-6 py-16 text-center">
          <p className="font-display text-lg font-medium tracking-tight text-text-primary">
            No projects match{query ? ` “${query}”` : ""}.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActive("All");
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-hover transition-opacity hover:opacity-80"
          >
            Clear search & filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
