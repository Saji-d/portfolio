"use client";

import { useSyncExternalStore } from "react";
import { skillGroups } from "@/data/skills";

const skills = [...new Set(skillGroups.flatMap((g) => g.skills))];

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Pill({ skill }: { skill: string }) {
  return (
    <span className="rounded-full border border-line bg-surface-2 px-4 py-1.5 font-mono text-xs text-text-secondary">
      {skill}
    </span>
  );
}

function Separator() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />;
}

export default function Marquee() {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => true);

  if (reduced) {
    return (
      <section aria-label="Technologies" className="border-y border-line bg-surface/40 py-6">
        <div className="container-site flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {skills.map((skill) => (
            <Pill key={skill} skill={skill} />
          ))}
        </div>
      </section>
    );
  }

  const track = [...skills, ...skills];

  return (
    <section aria-label="Technologies" className="relative overflow-hidden border-y border-line bg-surface/40 py-6">
      <div className="marquee-track group flex w-max items-center gap-3 group-hover:[animation-play-state:paused]">
        {track.map((skill, i) => (
          <div key={i} className="flex items-center gap-3">
            <Pill skill={skill} />
            <Separator />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </section>
  );
}
