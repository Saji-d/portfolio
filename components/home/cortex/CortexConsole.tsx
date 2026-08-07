"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
} from "motion/react";
import { CornerDownLeft } from "lucide-react";
import { COMMANDS, CONSOLE_LABEL, CONSOLE_VERSION, PROMPT } from "./lib";
import WhoamiView from "./views/WhoamiView";
import SkillsView from "./views/SkillsView";
import ProjectsView from "./views/ProjectsView";
import JourneyView from "./views/JourneyView";
import ResearchView from "./views/ResearchView";
import { ExitView, HelpView, NotFoundView } from "./views/MiscViews";

type ViewId =
  | "whoami"
  | "skills"
  | "projects"
  | "journey"
  | "research"
  | "help"
  | "exit"
  | "not-found";

interface LogEntry {
  id: number;
  cmd: string;
  view: ViewId;
}

const VIEW_FOR: Record<string, ViewId> = {
  whoami: "whoami",
  skills: "skills",
  projects: "projects",
  journey: "journey",
  research: "research",
  help: "help",
};

let logCounter = 0;

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
  const bootedRef = useRef(false);
  const historyRef = useRef<string[]>([]);
  const histIdx = useRef(0);

  const [input, setInput] = useState("");
  const [view, setView] = useState<ViewId | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastCmd, setLastCmd] = useState<string | null>(null);
  const [clock, setClock] = useState("");

  const sessionId = useId().replace(/[^a-z0-9]/gi, "").slice(-4);

  const run = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    setInput("");
    if (!cmd) return;
    if (historyRef.current[historyRef.current.length - 1] !== cmd) {
      historyRef.current = [...historyRef.current, cmd].slice(-9);
    }
    histIdx.current = historyRef.current.length;

    if (cmd === "clear") {
      setLog([]);
      setLastCmd(null);
      setView("whoami");
      return;
    }
    if (cmd === "exit") {
      setLastCmd(cmd);
      setView("exit");
      return;
    }
    const target = VIEW_FOR[cmd];
    if (target) {
      setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd, view: target }]);
      setLastCmd(cmd);
      setView(target);
    } else {
      setLog((l) => [...l.slice(-8), { id: ++logCounter, cmd, view: "not-found" }]);
      setLastCmd(cmd);
      setView("not-found");
    }
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || bootedRef.current) return;
        bootedRef.current = true;
        const word = "whoami";
        let i = 0;
        const iv = window.setInterval(() => {
          i += 1;
          setInput(word.slice(0, i));
          if (i >= word.length) {
            window.clearInterval(iv);
            window.setTimeout(() => run("whoami"), 280);
          }
        }, 48);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const iv = window.setInterval(tick, 30000);
    return () => window.clearInterval(iv);
  }, []);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(glowX, { stiffness: 55, damping: 18 });
  const springY = useSpring(glowY, { stiffness: 55, damping: 18 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    glowX.set(e.clientX - rect.left - rect.width / 2);
    glowY.set(e.clientY - rect.top - rect.height / 2);
  };

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
        onPointerMove={onPointerMove}
        onClick={() => inputRef.current?.focus()}
        className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface/60 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-[160%]"
          style={{
            x: springX,
            y: springY,
            background:
              "radial-gradient(520px at 50% 50%, rgba(79, 209, 197, 0.07), transparent 70%)",
          }}
        />
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            aria-hidden="true"
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

        <div className="relative flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {CONSOLE_LABEL}
            <span className="hidden text-text-muted/60 sm:inline">{CONSOLE_VERSION}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-text-muted">
            <span className="flex items-center gap-1.5 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              online
            </span>
            <span className="hidden sm:inline">{clock}</span>
            <span className="hidden md:inline">0x{sessionId}</span>
          </div>
        </div>

        <form
          className="relative flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5"
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

        <div className="relative flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
          {COMMANDS.map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              onClick={() => run(cmd.id)}
              title={cmd.hint}
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

        <div className="relative min-h-[540px] sm:min-h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={view ?? "idle"}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="px-4 py-6 sm:px-5"
            >
              {view === "whoami" && <WhoamiView />}
              {view === "skills" && <SkillsView />}
              {view === "projects" && <ProjectsView />}
              {view === "journey" && <JourneyView />}
              {view === "research" && <ResearchView />}
              {view === "help" && <HelpView />}
              {view === "exit" && <ExitView onReconnect={() => run("clear")} />}
              {view === "not-found" && <NotFoundView cmd={lastCmd ?? ""} />}
              {view === null && (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                  <div className="font-mono text-sm text-text-muted">
                    awaiting input<span className="animate-caret text-accent">_</span>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-text-muted">
                    run <span className="text-accent">help</span> or click a command above
                    to explore what&apos;s inside.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex flex-wrap items-center gap-2 border-t border-line px-4 py-3 sm:px-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            history
          </span>
          {log.length === 0 && (
            <span className="font-mono text-xs text-text-muted/50">—</span>
          )}
          {log.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setLastCmd(entry.cmd);
                setView(entry.view);
              }}
              className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
            >
              $ {entry.cmd}
            </button>
          ))}
        </div>
      </div>
    </MotionConfig>
  );
}
