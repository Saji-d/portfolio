"use client";

import { useState } from "react";
import {
  Blocks,
  Cpu,
  Database,
  MonitorSmartphone,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import TechMarquee from "@/components/home/Marquee";
import { skillGroups } from "@/data/skills";

const GROUP_ICON: Record<string, LucideIcon> = {
  Backend: Server,
  "AI / ML": Cpu,
  Frontend: MonitorSmartphone,
  "Data & Databases": Database,
  Blockchain: Blocks,
  "Tooling & Practice": Wrench,
};

// Index pairs matching skillGroups order: 0 Backend, 1 AI/ML, 2 Frontend,
// 3 Data & Databases, 4 Blockchain, 5 Tooling & Practice. Drives both the
// connector paths below and which cards light up together on hover.
const CONNECTIONS: [number, number][] = [
  [0, 2],
  [0, 1],
  [1, 3],
  [3, 4],
  [1, 5],
];

const PATHS = [
  "M75,45 Q56,100 37.5,155",
  "M75,45 Q150,45 225,45",
  "M225,45 Q168,100 112.5,155",
  "M112.5,155 Q150,155 187.5,155",
  "M225,45 Q243,100 262.5,155",
];

export default function SkillsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  const isRelated = (i: number) =>
    hovered !== null &&
    (i === hovered || CONNECTIONS.some(([a, b]) => (a === hovered && b === i) || (b === hovered && a === i)));

  return (
    <section
      id="capabilities"
      aria-label="Skills"
      className="section-chapter relative pb-10 sm:pb-12"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="07">Skills</Eyebrow>
            <h2 className="section-title">
              My current engineering toolkit.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8">
            <TechMarquee />
          </div>
        </Reveal>

        <div className="relative mt-8">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 300 200"
            preserveAspectRatio="none"
            fill="none"
          >
            {PATHS.map((d, i) => {
              const active = hovered !== null && CONNECTIONS[i].includes(hovered);
              const tone = i === 1 || i === 3 ? "var(--accent)" : "var(--accent-2)";
              return (
                <path
                  key={d}
                  d={d}
                  stroke={active ? "var(--accent)" : tone}
                  strokeWidth={active ? 1.6 : 1}
                  strokeDasharray="3 5"
                  className="animate-circuit-flow transition-[stroke-width,opacity] duration-300"
                  style={{ opacity: hovered === null ? 0.35 : active ? 0.9 : 0.12 }}
                />
              );
            })}
          </svg>

          <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            {skillGroups.map((group, i) => {
              const Icon = GROUP_ICON[group.label] ?? Server;
              // Backend and AI/ML carry the actual role narrative (Backend &
              // AI Systems) - give them the primary row and let the rest sit
              // as the supporting layer, instead of six uniform boxes.
              const primary = i < 2;
              const related = isRelated(i);
              const dimmed = hovered !== null && !related;
              return (
                <Reveal
                  key={group.label}
                  delay={i * 0.04}
                  className={primary ? "lg:col-span-6" : "lg:col-span-3"}
                >
                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className={`card-surface group h-full transition-all duration-300 hover:-translate-y-0.5 ${
                      primary ? "border-accent/25 p-5 sm:p-6" : "p-4"
                    } ${
                      related
                        ? "border-accent/60 shadow-[0_16px_40px_-24px_rgba(99, 102, 241,0.4)]"
                        : "hover:border-accent/40"
                    } ${dimmed ? "opacity-60" : "opacity-100"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`grid shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent transition-colors duration-300 group-hover:border-accent/40 ${
                            primary ? "h-9 w-9" : "h-7 w-7"
                          }`}
                        >
                          <Icon className={primary ? "h-4.5 w-4.5" : "h-3.5 w-3.5"} />
                        </span>
                        <h3
                          className={`font-mono font-semibold uppercase tracking-widest text-accent ${
                            primary ? "text-xs" : "text-[11px]"
                          }`}
                        >
                          {group.label}
                        </h3>
                      </div>
                      <span className="font-mono text-[10px] text-text-muted">
                        {String(i + 1).padStart(2, "0")}/
                        {String(skillGroups.length).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-text-secondary transition-colors group-hover:border-accent/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
