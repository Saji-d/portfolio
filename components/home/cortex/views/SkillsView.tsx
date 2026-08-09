"use client";

import SkillsNetwork from "../SkillsNetwork";

export default function SkillsView() {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent">$ skills</span>
        <span className="h-px flex-1 bg-line" />
        <span>{"// the engineer · 7 disciplines"}</span>
      </div>

      <div className="mt-2">
        <SkillsNetwork />
      </div>

      <p className="mt-2 font-mono text-[11px] text-text-muted">
        &gt; hover a discipline to trace its connection · click to see its stack
      </p>
    </div>
  );
}
