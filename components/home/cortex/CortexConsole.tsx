"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
} from "motion/react";
import { CornerDownLeft } from "lucide-react";
import { getProject } from "@/data/projects";
import { COMMANDS, CONSOLE_LABEL, CONSOLE_VERSION, PROMPT } from "./lib";
import WhoamiView from "./views/WhoamiView";
import SkillsView from "./views/SkillsView";
import ProjectsView from "./views/ProjectsView";
import TimelineView from "./views/TimelineView";
import ResearchView from "./views/ResearchView";
import ContactView from "./views/ContactView";
import ProjectDetailView from "./views/ProjectDetailView";
import AboutView from "./views/AboutView";
import SynapseOverlay from "./SynapseOverlay";
import { ExitView, HelpView, NotFoundView } from "./views/MiscViews";
import CoffeeView from "./views/CoffeeView";

type ViewId =
  | "whoami"
  | "about"
  | "skills"
  | "projects"
  | "timeline"
  | "research"
  | "contact"
  | "project-detail"
  | "synapse"
  | "coffee"
  | "help"
  | "exit"
  | "not-found";

interface LogEntry {
  id: number;
  cmd: string;
  view: ViewId;
}

const VIEW_FOR: Record<string, ViewId> = {
  help: "help",
  whoami: "whoami",
  about: "about",
  projects: "projects",
  timeline: "timeline",
  research: "research",
  skills: "skills",
  contact: "contact",
};

let logCounter = 0;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const PARTICLES = [
  { left: 6, top: 18, size: 2, dur: 7, delay: 0 },
  { left: 12, top: 70, size: 2, dur: 8, delay: 1.2 },
  { left: 20, top: 40, size: 1, dur: 6, delay: 0.4 },
  { left: 34, top: 12, size: 2, dur: 9, delay: 2.1 },
  { left: 46, top: 82, size: 1, dur: 7.5, delay: 0.8 },
  { left: 58, top: 24, size: 2, dur: 8.5, delay: 1.6 },
  { left: 70, top: 64, size: 1, dur: 6.5, delay: 0.2 },
  { left: 82, top: 30, size: 2, dur: 7.5, delay: 2.6 },
  { left: 90, top: 76, size: 1, dur: 8, delay: 1.1 },
  { left: 96, top: 14, size: 2, dur: 9, delay: 3.2 },
];

export default function CortexConsole() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const bootedRef = useRef(false);
  const historyRef = useRef<string[]>([]);
  const histIdx = useRef(0);

  const [input, setInput] = useState("");
  const [view, setView] = useState<ViewId | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastCmd, setLastCmd] = useState<string | null>(null);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [synapseActive, setSynapseActive] = useState(false);

  const clockRef = useRef<HTMLSpanElement>(null);
  const bootInterval = useRef<number | null>(null);
  const bootTimeout = useRef<number | null>(null);

  const sessionId = useId().replace(/[^a-z0-9]/gi, "").slice(-4);

  const run = useCallback((raw: string) => {
    const text = raw.trim();
    setInput("");
    if (!text) return;
    const [name, ...rest] = text.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");
    if (historyRef.current[historyRef.current.length - 1] !== text) {
      historyRef.current = [...historyRef.current, text].slice(-9);
    }
    histIdx.current = historyRef.current.length;

    if (name === "clear") {
      setLog([]);
      setLastCmd(null);
      setProjectSlug(null);
      setView(null);
      return;
    }
    if (name === "exit") {
      setLastCmd(text);
      setView("exit");
      return;
    }
    if (name === "projects" && arg) {
      if (getProject(arg)) {
        setProjectSlug(arg);
        setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd: text, view: "project-detail" }]);
        setLastCmd(text);
        setView("project-detail");
      } else {
        setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd: text, view: "not-found" }]);
        setLastCmd(text);
        setView("not-found");
      }
      return;
    }
    if (name === "synapse") {
      setLastCmd(text);
      setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd: text, view: "synapse" }]);
      setSynapseActive(true);
      return;
    }
    if (name === "coffee") {
      setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd: text, view: "coffee" }]);
      setLastCmd(text);
      setView("coffee");
      return;
    }
    const target = VIEW_FOR[name];
    if (target) {
      setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd: text, view: target }]);
      setLastCmd(text);
      setView(target);
    } else {
      setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd: text, view: "not-found" }]);
      setLastCmd(text);
      setView("not-found");
    }
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        el.dataset.cortexAnimPaused = visible ? "false" : "true";
        if (!visible || bootedRef.current) return;
        bootedRef.current = true;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          run("whoami");
          return;
        }
        const word = "whoami";
        let i = 0;
        bootInterval.current = window.setInterval(() => {
          i += 1;
          setInput(word.slice(0, i));
          if (i >= word.length) {
            window.clearInterval(bootInterval.current!);
            bootInterval.current = null;
            bootTimeout.current = window.setTimeout(() => run("whoami"), 140);
          }
        }, 30);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (bootInterval.current) window.clearInterval(bootInterval.current);
      if (bootTimeout.current) window.clearTimeout(bootTimeout.current);
    };
  }, [run]);

  useEffect(() => {
    const el = clockRef.current;
    const tick = () => {
      if (!el) return;
      el.textContent = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    tick();
    const iv = window.setInterval(tick, 30000);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: 0 });
  }, [view]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx.current > 0) {
        histIdx.current -= 1;
        setInput(historyRef.current[histIdx.current] ?? "");
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx.current < historyRef.current.length) {
        histIdx.current += 1;
        setInput(historyRef.current[histIdx.current] ?? "");
      }
      return;
    }
    if (e.key === "Escape") {
      setInput("");
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        onClick={() => inputRef.current?.focus()}
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface/60 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            aria-hidden="true"
            data-cortex-anim
            className="animate-cortex-float pointer-events-none absolute rounded-full bg-accent/25"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}

        <div className="relative flex items-center justify-between gap-3 border-b border-line px-4 py-2 sm:px-5">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" data-cortex-anim />
            {CONSOLE_LABEL}
            <span className="hidden text-text-muted/60 sm:inline">{CONSOLE_VERSION}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-text-muted">
            <span className="flex items-center gap-1.5 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              online
            </span>
            <span ref={clockRef} className="hidden sm:inline" />
            <span className="hidden md:inline">0x{sessionId}</span>
          </div>
        </div>

        <form
          className="relative flex items-center gap-3 border-b border-line px-4 py-2 sm:px-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="cortex-input" className="sr-only">
            Enter a command
          </label>
          <span className="shrink-0 font-mono text-sm text-accent">{PROMPT}</span>
          <input
            id="cortex-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="type a command…"
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none"
          />
          <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted md:inline-flex">
            <CornerDownLeft className="h-3 w-3" />
          </kbd>
        </form>

        <div className="relative flex flex-wrap items-center gap-2 border-b border-line px-4 py-2 sm:px-5">
          {COMMANDS.map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              onClick={() => run(cmd.id)}
              title={cmd.desc}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                lastCmd === cmd.id
                  ? "border-accent/60 bg-accent-dim text-accent"
                  : "border-line bg-surface-2 text-text-secondary hover:border-accent/40 hover:text-accent"
              }`}
            >
              {cmd.id}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[11px] text-text-muted lg:inline">
            type a command · ↑ history
          </span>
        </div>

        <div ref={outputRef} className="console-scroll relative min-h-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view ?? "idle"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="px-4 py-3 sm:px-5"
            >
              {view === "whoami" && <WhoamiView />}
              {view === "about" && <AboutView />}
              {view === "skills" && <SkillsView />}
              {view === "projects" && <ProjectsView />}
              {view === "timeline" && <TimelineView />}
              {view === "research" && <ResearchView />}
              {view === "contact" && <ContactView />}
              {view === "project-detail" && (
                <ProjectDetailView slug={projectSlug ?? ""} key={projectSlug ?? "none"} />
              )}
              {view === "coffee" && <CoffeeView />}
              {view === "help" && <HelpView />}
              {view === "exit" && <ExitView onReconnect={() => run("clear")} />}
              {view === "not-found" && <NotFoundView cmd={lastCmd ?? ""} />}
              {view === null && (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                  <div className="font-mono text-sm text-text-muted">
                    awaiting input<span className="animate-caret text-accent" data-cortex-anim>_</span>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-text-muted">
                    run <span className="text-accent">help </span>  or click a command above
                    to explore what&apos;s inside.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex flex-wrap items-center gap-2 border-t border-line px-4 py-2 sm:px-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            history
          </span>
          {log.length === 0 && (
            <span className="font-mono text-xs text-text-muted/50">no history yet</span>
          )}
          {log.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setLastCmd(entry.cmd);
                if (entry.view === "synapse") {
                  setSynapseActive(true);
                  return;
                }
                if (entry.view === "project-detail") {
                  const m = entry.cmd.match(/^projects\s+(\S+)/);
                  if (m) setProjectSlug(m[1]);
                }
                setView(entry.view);
              }}
              className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
            >
              $ {entry.cmd}
            </button>
          ))}
        </div>
      </div>
      {synapseActive && (
        <SynapseOverlay onDone={() => setSynapseActive(false)} />
      )}
    </MotionConfig>
  );
}
