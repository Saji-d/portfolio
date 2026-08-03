"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CornerDownLeft,
  Folder,
  GraduationCap,
  Mail,
  Search,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";
import { NAV_LINKS, SITE } from "@/data/site";
import { projects } from "@/data/projects";
import { neuronscreen } from "@/data/research";
import { useCommandPalette } from "@/components/command-palette-context";
import { useTerminal } from "@/components/terminal-context";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

interface Item {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon?: LucideIcon | ((props: { className?: string }) => React.ReactNode);
  keywords: string;
  external?: boolean;
  run: () => void;
}

function primaryHref(project: (typeof projects)[number]): string | undefined {
  if (project.caseStudy) return `/projects/${project.slug}`;
  if (project.thesis) return project.thesis;
  return project.github;
}

function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t.includes(q)) return 100 + q.length;
  let qi = 0;
  let score = 0;
  let prev = -1;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      const gap = i - prev - 1;
      score += Math.max(0, 10 - gap);
      prev = i;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}

export default function CommandPalette() {
  const router = useRouter();
  const { setOpen } = useCommandPalette();
  const { setOpen: setTerminalOpen } = useTerminal();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (href: string, external = false) => {
      setOpen(false);
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    },
    [router, setOpen]
  );

  const items: Item[] = useMemo(
    () => [
      ...NAV_LINKS.map((link) => ({
        id: `page-${link.href}`,
        group: "Pages",
        label: link.label,
        keywords: `${link.label} ${link.href}`,
        run: () => go(link.href),
      })),
      {
        id: "act-terminal",
        group: "Actions",
        label: "Open terminal",
        hint: "backtick (`)",
        icon: TerminalSquare,
        keywords: "terminal shell open",
        run: () => {
          setOpen(false);
          setTerminalOpen(true);
        },
      },
      {
        id: "act-email",
        group: "Actions",
        label: "Copy email",
        hint: SITE.email,
        icon: Mail,
        keywords: "email contact copy",
        run: () => {
          navigator.clipboard?.writeText(SITE.email);
          setOpen(false);
        },
      },
      {
        id: "act-github",
        group: "Actions",
        label: "GitHub",
        hint: SITE.githubHandle,
        icon: GithubIcon,
        keywords: "github code source",
        external: true,
        run: () => go(SITE.github, true),
      },
      {
        id: "act-linkedin",
        group: "Actions",
        label: "LinkedIn",
        hint: "in/sajidur-rahman-sajid",
        icon: LinkedinIcon,
        keywords: "linkedin profile",
        external: true,
        run: () => go(SITE.linkedin, true),
      },
      {
        id: "act-resume",
        group: "Actions",
        label: "Download CV",
        hint: "PDF",
        icon: ArrowUp,
        keywords: "resume cv pdf download",
        external: true,
        run: () => go("/Sajidur_Rahman_Sajid.pdf", true),
      },
      ...projects.map((p) => {
        const href = primaryHref(p);
        return {
          id: `project-${p.slug}`,
          group: "Projects",
          label: p.name,
          hint: `${p.category} · ${p.year}`,
          icon: Folder,
          keywords: `${p.name} ${p.tagline} ${p.category} ${p.stack.join(" ")}`,
          external: href?.startsWith("http"),
          run: () => href && go(href, href.startsWith("http")),
        };
      }),
      {
        id: "research-neuronscreen",
        group: "Research",
        label: neuronscreen.title,
        hint: neuronscreen.oneLiner,
        icon: GraduationCap,
        keywords: `${neuronscreen.title} thesis cognitive impairment`,
        run: () => go("/research/neuronscreen"),
      },
    ],
    [go, setOpen, setTerminalOpen]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const scored = items
      .map((item) => ({ item, score: fuzzyScore(q, item.keywords) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.map((s) => s.item);
  }, [query, items]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => {
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${selected}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  function trapTab(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const container = dialogRef.current;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !container.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !container.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) item.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  const activeIndex = Math.min(selected, filtered.length - 1);
  const activeItem = filtered[activeIndex];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[60] flex items-start justify-center bg-[#0B0E14]/90 p-4 pt-[14vh] backdrop-blur-sm"
      onKeyDown={trapTab}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onInputKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={activeItem ? `cp-item-${activeItem.id}` : undefined}
            aria-label="Search commands and projects"
            placeholder="Type a command or search…"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-transparent py-4 font-mono text-sm text-text-primary caret-accent placeholder:text-text-muted focus:outline-none"
          />
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            esc
          </span>
        </div>

        <div
          ref={listRef}
          id="command-palette-list"
          role="listbox"
          aria-label="Results"
          className="max-h-[50vh] overflow-y-auto p-2"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center font-mono text-sm text-text-muted">
              No matches for “{query}”
            </p>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`cp-item-${item.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => item.run()}
                  onMouseEnter={() => setSelected(i)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                    i === activeIndex
                      ? "bg-accent-dim text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        i === activeIndex ? "text-accent" : "text-text-muted"
                      }`}
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{item.label}</span>
                    {item.hint && (
                      <span className="block truncate font-mono text-xs text-text-muted">
                        {item.hint}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    {item.group}
                  </span>
                  {i === activeIndex && (
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-accent" />
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <ArrowRight className="h-3 w-3" /> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <CornerDownLeft className="h-3 w-3" /> select
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" /> esc to close
          </span>
        </div>
      </div>
    </div>
  );
}
