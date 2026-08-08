"use client";

import Link from "next/link";
import { ArrowRight, Power, RefreshCw } from "lucide-react";
import { COMMANDS } from "../lib";

export function HelpView() {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent">$ help</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// available commands`}</span>
      </div>

      <ul className="card-surface mt-4 divide-y divide-line font-mono text-sm">
        {COMMANDS.map((cmd) => (
          <li key={cmd.id} className="flex items-center gap-4 px-5 py-3">
            <span className="w-24 shrink-0 text-accent">{cmd.id}</span>
            <span className="text-text-secondary">{cmd.hint}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; type a command above, or click it · `clear` resets the session
      </p>
    </div>
  );
}

export function ExitView({ onReconnect }: { onReconnect: () => void }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center">
      <div className="font-mono text-sm text-text-secondary">
        session ended<span className="animate-caret text-accent" data-cortex-anim>_</span>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-text-muted">
        Thanks for poking around inside the machine. When you&apos;re ready, the work is
        one command away.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReconnect}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 font-mono text-xs text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          reconnect
        </button>
        <Link
          href="/resume"
          className="group inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-mono text-xs font-medium text-[#0B0E14] transition-opacity hover:opacity-90"
        >
          view resume
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
        <Power className="mr-1 inline h-3 w-3" />
        cortex v2.4.1
      </span>
    </div>
  );
}

export function NotFoundView({ cmd }: { cmd: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
      <div className="font-mono text-sm text-danger">
        bash: <span className="text-text-primary">{cmd}</span>: command not found
      </div>
      <p className="font-mono text-xs text-text-muted">
        hint: type <span className="text-accent">help</span> to list available commands
      </p>
    </div>
  );
}
