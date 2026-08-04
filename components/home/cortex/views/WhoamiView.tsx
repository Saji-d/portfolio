"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { GitBranch, Globe, Mail, MapPin, ScanLine, Check } from "lucide-react";
import { WHOAMI_ROLES, WHOAMI_LINKS } from "../lib";

function useTypewriter(items: string[], start: boolean) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [char, setChar] = useState(0);

  useEffect(() => {
    if (!start || reduced) return;
    if (count >= items.length) return;
    if (count === 0) {
      const t = setTimeout(() => setCount(1), 180);
      return () => clearTimeout(t);
    }
    const line = items[count - 1];
    if (char < line.length) {
      const t = setTimeout(() => setChar(char + 1), 14);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCount((c) => c + 1);
      setChar(0);
    }, 170);
    return () => clearTimeout(t);
  }, [start, count, char, items, reduced]);

  const isReduced = !!reduced;
  return {
    count: isReduced ? items.length : count,
    char: isReduced ? 0 : char,
    typing: !isReduced,
  };
}

const LINK_ICONS: Record<string, typeof Mail> = {
  email: Mail,
  github: GitBranch,
  linkedin: Globe,
};

export default function WhoamiView() {
  const { count, char, typing } = useTypewriter(WHOAMI_ROLES, true);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(300px,340px)]">
      <div className="card-surface relative overflow-hidden p-5 sm:p-6">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="text-accent">$ whoami</span>
          <span className="h-px flex-1 bg-line" />
          <span>{`// identity`}</span>
        </div>

        <ul className="mt-5 space-y-2.5 font-mono text-sm">
          {WHOAMI_ROLES.map((role, i) => {
            const done =
              count === WHOAMI_ROLES.length &&
              char === WHOAMI_ROLES[WHOAMI_ROLES.length - 1].length;
            const active = typing && !done && i === count - 1;
            const text = active ? role.slice(0, char) : role;
            return (
              <li key={role} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                <span className={active ? "text-text-primary" : "text-text-secondary"}>
                  {text}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="animate-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-accent"
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center gap-2 font-mono text-xs text-success">
          <Check className="h-3.5 w-3.5" />
          <span>identity verified</span>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">occupation: software developer trainee — ledgerturf</span>
        </div>
      </div>

      <div className="card-surface relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="animate-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-accent/[0.07] to-transparent"
        />
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent-dim font-display text-lg font-medium text-accent">
            S
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
          </div>
          <div>
            <p className="font-display text-sm font-medium text-text-primary">
              Sajidur Rahman Sajid
            </p>
            <p className="font-mono text-xs text-text-muted">sajid · backend &amp; AI</p>
          </div>
        </div>

        <dl className="mt-5 space-y-2.5 font-mono text-xs">
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin className="h-3.5 w-3.5 text-text-muted" />
            <span>Dhaka, Bangladesh · UTC+6</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <ScanLine className="h-3.5 w-3.5 text-text-muted" />
            <span>AIUB · BSc CSE · 3.92 / 4.00</span>
          </div>
        </dl>

        <ul className="mt-5 space-y-1.5 border-t border-line pt-4 font-mono text-xs">
          {WHOAMI_LINKS.map((link) => {
            const Icon = LINK_ICONS[link.label];
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-text-secondary transition-colors hover:bg-surface-2 hover:text-accent"
                >
                  <Icon className="h-3.5 w-3.5 text-text-muted transition-colors group-hover:text-accent" />
                  <span className="truncate">{link.value}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
                    open
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
          <span>scan</span>
          <span className="text-accent">██████░░ 94%</span>
          <span className="text-success">id ok</span>
        </div>
      </div>
    </div>
  );
}
