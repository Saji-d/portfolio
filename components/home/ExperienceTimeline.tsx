"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import TimelineProgress from "@/components/ui/TimelineProgress";

const experiences = [
  {
    period: "May 2026 - Present",
    company: "Ledgercross",
    position: "Software Developer Trainee",
    detail:
      "Engineering production software across the stack for enterprise finance, working with APIs, asynchronous processing, data layers, automated testing, cloud infrastructure, and system reliability.",
    tag: "Present",
  },
  {
    period: "Feb 2026 - Apr 2026",
    company: "Bangladesh Software Solution",
    position: "Software Engineering Intern",
    detail:
      "Developed and delivered responsive web applications, working across frontend and backend development, implementing production-ready features, fixing issues, collaborating with the engineering team, and completing client deliverables.",
    tag: "Complete",
  },
];

export default function ExperienceTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = entryRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.entryIndex);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="section-chapter relative pt-[calc(var(--nav-offset)_+_3.5rem)] pb-16 sm:pb-20"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="05">Experience</Eyebrow>
            <h2 className="section-title">
              Engineering scalable applications and enterprise production software.
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-8 lg:mt-12">
          {/* Single-column rail (mobile / tablet) */}
          <span
            aria-hidden="true"
            className="absolute inset-y-2 left-[15px] w-px bg-line lg:hidden"
          />
          <div className="lg:hidden">
            <TimelineProgress />
          </div>
          {/* Shared central axis (desktop) */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-line lg:block"
          />
          <div className="hidden lg:block">
            <TimelineProgress center />
          </div>

          <div className="space-y-5 lg:space-y-10">
            {experiences.map((experience, i) => {
              const isCurrent = i === 0;
              const active = isCurrent || activeIndex === i;
              return (
                <Reveal key={experience.company} delay={i * 0.08} y={16}>
                  <div
                    ref={(el) => {
                      entryRefs.current[i] = el;
                    }}
                    data-entry-index={i}
                    className="relative"
                  >
                    {/* Node riding on the rail / central axis */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-5 grid h-[30px] w-[30px] place-items-center lg:left-1/2 lg:-ml-[15px]"
                    >
                      <span
                        className={`rounded-full transition-all duration-500 ${
                          active
                            ? "h-2.5 w-2.5 bg-accent shadow-[0_0_16px_rgba(79,209,197,0.8)]"
                            : "h-2 w-2 bg-text-muted"
                        }`}
                      />
                    </span>

                    <article
                      className={`card-surface ml-10 overflow-hidden transition-all duration-500 hover:-translate-y-0.5 ${
                        isCurrent
                          ? "border-accent/40 shadow-[0_16px_50px_-28px_rgba(79,209,197,0.5)] lg:ml-0 lg:mr-[calc(50%_+_2rem)]"
                          : "hover:border-accent/40 lg:ml-[calc(50%_+_2rem)] lg:mr-0"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2/60 px-4 py-2.5">
                        <span className="font-mono text-xs text-text-muted">
                          {experience.period}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors duration-500 ${
                            isCurrent
                              ? "border-accent/30 bg-accent-dim text-accent"
                              : "border-line bg-surface text-text-muted"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isCurrent ? "animate-pulse bg-accent" : "bg-text-muted"
                            }`}
                          />
                          {experience.tag}
                        </span>
                      </div>

                      <div className="p-4 sm:p-5">
                        <h3 className="card-title-xl">{experience.company}</h3>
                        <p className="mt-0.5 font-mono text-sm font-medium text-accent">
                          {experience.position}
                        </p>
                        <p className="mt-2 body-copy text-text-secondary line-clamp-3">
                          {experience.detail}
                        </p>
                      </div>
                    </article>
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
