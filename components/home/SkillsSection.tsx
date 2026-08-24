"use client";

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

export default function SkillsSection() {
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => {
            const Icon = GROUP_ICON[group.label] ?? Server;
            return (
              <Reveal key={group.label} delay={i * 0.04}>
                <div
                  tabIndex={0}
                  className="group card-surface flex h-full flex-col p-5 outline-none transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-[3px] hover:border-accent/60 hover:shadow-[0_12px_32px_-20px_rgba(99,102,241,0.35)] focus-visible:-translate-y-[3px] focus-visible:border-accent/60 focus-visible:shadow-[0_12px_32px_-20px_rgba(99,102,241,0.35)] focus-visible:ring-2 focus-visible:ring-accent/30 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-text-primary transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
                        {group.label}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted">
                      {String(i + 1).padStart(2, "0")}/
                      {String(skillGroups.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-text-secondary"
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
    </section>
  );
}
