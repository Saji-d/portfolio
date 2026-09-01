"use client";

import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { SITE } from "@/data/site";
import { resume } from "@/data/resume";
import { SKILL_NETWORK } from "@/data/skills";
import { timeline } from "@/data/timeline";

const current = timeline.find((t) => t.type === "career" && t.current);

export default function AboutView() {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent-hover">$ about</span>
        <span className="h-px flex-1 bg-line" />
        <span>{"// profile"}</span>
      </div>

      <div className="card-surface mt-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent-dim font-display text-lg font-medium text-accent-hover">
            S
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
          </div>
          <div>
            <p className="font-display text-sm font-medium text-text-primary">
              {SITE.name}
            </p>
            <p className="font-mono text-xs text-text-muted">{SITE.role}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {resume.about}
        </p>

        <div className="mt-5 border-t border-line pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            focus areas
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {SKILL_NETWORK.disciplines.map((d) => (
              <span
                key={d.id}
                className="rounded-full border border-accent/25 bg-accent-dim/40 px-3 py-1 font-mono text-[11px] text-accent-hover"
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-line pt-4 font-mono text-xs">
          {current && (
            <div className="flex items-start gap-2 text-text-secondary">
              <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
              <span>
                {current.title} · {current.org} ·{" "}
                <span className="text-text-muted">{current.period}</span>
              </span>
            </div>
          )}
          <div className="flex items-start gap-2 text-text-secondary">
            <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
            <span>
              {resume.education[0].degree} · {resume.education[0].org} ·{" "}
              <span className="text-text-muted">{resume.education[0].detail}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" />
            <span>
              {SITE.location} · {SITE.timezone}
            </span>
          </div>
        </dl>
      </div>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; {SITE.availability}
      </p>
    </div>
  );
}
