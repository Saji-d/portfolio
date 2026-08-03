"use client";

import { useEffect, useRef, useState } from "react";
import { X, TerminalSquare } from "lucide-react";
import { useTerminal } from "@/components/terminal-context";
import { SITE } from "@/data/site";
import { projects, getProject } from "@/data/projects";
import { neuronscreen } from "@/data/research";
import { skillGroups } from "@/data/skills";

interface Line {
  kind: "cmd" | "out";
  text: string;
}

const banner = [
  "Sajidur Rahman Sajid — interactive profile",
  `role     : ${SITE.role}`,
  `location : ${SITE.location}`,
  `email    : ${SITE.email}`,
  `github   : ${SITE.github}`,
  "",
  "Type `help` to list commands.",
];

function renderProjects() {
  return projects
    .map((p) => {
      const flag = p.featured ? "*" : " ";
      return `  ${flag} ${p.slug.padEnd(26)} ${p.tagline}`;
    })
    .join("\n");
}

function renderProject(slug: string) {
  const p = getProject(slug);
  if (!p) return `project not found: ${slug}`;
  return [
    `# ${p.name}`,
    `  status   : ${p.status}`,
    `  role     : ${p.role}`,
    `  category : ${p.category}`,
    "",
    `  ${p.summary}`,
    "",
    `  stack: ${p.stack.join(", ")}`,
  ].join("\n");
}

function renderResearch() {
  return [
    "# NeuroScreen (thesis)",
    `  ${neuronscreen.oneLiner}`,
    `  accuracy 95.20% · precision 94.40% · recall 96.10%`,
    `  F1 95.24% · ROC-AUC 0.982 · n = 2,237 students`,
  ].join("\n");
}

function renderSkills() {
  return skillGroups
    .map((g) => `  ${g.label.padEnd(18)} ${g.skills.join("  ·  ")}`)
    .join("\n");
}

function TerminalShell({ onExit }: { onExit: () => void }) {
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: banner.join("\n") }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => {
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

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

  function run(raw: string) {
    const cmd = raw.trim();
    setLines((prev) => [...prev, { kind: "cmd", text: raw }]);
    setInput("");

    if (!cmd) return;

    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ");

    let out = "";

    switch (name) {
      case "help":
        out = [
          "Available commands:",
          "  help                     show this list",
          "  whoami                   about me",
          "  work                     list projects",
          "  projects <slug>          project detail",
          "  research                 thesis & research",
          "  skills                   skill groups",
          "  timeline                 education & career",
          "  contact                  contact details",
          "  resume                   view resume",
          "  clear                    clear the screen",
          "  exit                     close the terminal",
          "",
          "Tip: press ` (backtick) anytime to toggle.",
        ].join("\n");
        break;
      case "whoami":
        out = [
          `Sajidur Rahman Sajid`,
          `${SITE.role}`,
          `Software Developer Trainee @ LedgerCross (May 2026 – present)`,
          `Software Engineer Intern @ BSS (Feb – Apr 2026)`,
          `BSc CSE, AIUB — CGPA 3.92/4.00 · 5× Dean's Award`,
          `Thesis: NeuroScreen hybrid ensemble (95.20% acc, 0.982 AUC)`,
        ].join("\n");
        break;
      case "work":
        out = ["All projects ( * = featured ):", renderProjects()].join("\n");
        break;
      case "projects":
        out = arg ? renderProject(arg) : ["usage: projects <slug>", renderProjects()].join("\n");
        break;
      case "research":
        out = renderResearch();
        break;
      case "skills":
        out = renderSkills();
        break;
      case "timeline":
        out = [
          "  2026–     LedgerCross · Software Developer Trainee (current)",
          "  2026      BSS · Software Engineer Intern",
          "  2022–26   AIUB · BSc CSE (CGPA 3.92) · 5× Dean's Award",
          "  2019–21   BAF Shaheen · HSC 5.00",
          "  2017–19   Kurmitola · SSC 5.00",
        ].join("\n");
        break;
      case "contact":
        out = [
          `email    : ${SITE.email}`,
          `phone    : ${SITE.phone}`,
          `linkedin : ${SITE.linkedin}`,
          `github   : ${SITE.github}`,
          `location : ${SITE.location}`,
        ].join("\n");
        break;
      case "resume":
        out = "Open /resume from the nav to view the full CV inline.";
        break;
      case "clear":
        setLines([]);
        return;
      case "exit":
        onExit();
        return;
      default:
        out = `command not found: ${name}  (try \`help\`)`;
    }

    setLines((prev) => [...prev, { kind: "out", text: out }]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setHistory((prev) => [input, ...prev].slice(0, 50));
      setHistoryIdx(-1);
      run(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      if (history[idx]) setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = historyIdx - 1;
      setHistoryIdx(Math.max(idx, -1));
      setInput(idx >= 0 && history[idx] ? history[idx] : "");
    } else if (e.key === "Escape") {
      onExit();
    }
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/92 p-4 backdrop-blur-md sm:p-8"
      onKeyDown={trapTab}
      onClick={(e) => {
        if (e.target === e.currentTarget) onExit();
      }}
    >
      <div className="flex h-full max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2 text-text-muted">
            <TerminalSquare className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs">sajid@portfolio — zsh</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] text-text-muted sm:inline">
              press ` to toggle
            </span>
            <button
              onClick={onExit}
              aria-label="Close terminal"
              className="text-text-muted transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed"
        >
          {lines.map((line, i) =>
            line.kind === "cmd" ? (
              <div key={i} className="whitespace-pre-wrap">
                <span className="text-accent">sajid@portfolio:~$</span>{" "}
                <span className="text-text-primary">{line.text}</span>
              </div>
            ) : (
              <pre key={i} className="whitespace-pre-wrap pb-2 text-text-secondary">
                {line.text}
              </pre>
            )
          )}
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-accent">sajid@portfolio:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full bg-transparent font-mono text-[13px] text-text-primary caret-accent outline-none"
              aria-label="Terminal input"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Terminal() {
  const { open, setOpen } = useTerminal();

  if (!open) return null;

  return <TerminalShell onExit={() => setOpen(false)} />;
}
