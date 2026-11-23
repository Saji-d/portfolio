"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import TimelineProgress from "@/components/ui/TimelineProgress";
import { EXPERIENCE } from "@/data/experience";

const experiences = EXPERIENCE.map((e) => ({
  period: e.period,
  company: e.shortOrg ?? e.org,
  position: e.role,
  location: e.location,
  detail: e.detail,
  tag: e.tag,
  current: e.current,
}));

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
      className="section-chapter relative overflow-hidden"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="02">Experience</Eyebrow>
            <h2 className="section-title">Shipping software across time zones.</h2>
          </div>
        </Reveal>

        <div className="relative mt-6 lg:mt-8">
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

          <div className="space-y-4 lg:space-y-6">
            {experiences.map((experience, i) => {
              const isCurrent = experience.current;
              const isLeft = i % 2 === 0;
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
                            ? "h-2.5 w-2.5 bg-accent shadow-[0_0_16px_rgba(99,102,241,0.6)]"
                            : "h-2 w-2 bg-text-muted"
                        }`}
                      />
                    </span>

                    <article
                      className={`card-surface group relative ml-10 overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                        (isCurrent
                          ? "border-accent/40 shadow-[0_16px_50px_-28px_rgba(99,102,241,0.4)] "
                          : "hover:border-accent/40 ") +
                        (isLeft
                          ? "lg:ml-0 lg:mr-[calc(50%_+_1.25rem)]"
                          : "lg:ml-[calc(50%_+_1.25rem)] lg:mr-0")
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent transition-opacity duration-500 ${
                          isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2/60 px-5 py-3">
                        <span className="font-mono text-xs text-text-muted">
                          {experience.period}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-wider transition-colors duration-500 ${
                            isCurrent
                              ? "border-accent/30 bg-accent-dim text-accent-hover"
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

                      <div className="flex gap-4 p-5 sm:p-6">
                        <span
                          aria-hidden="true"
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border font-display text-base font-semibold ${
                            isCurrent
                              ? "border-accent/40 bg-accent-dim text-accent-hover"
                              : "border-line bg-surface-2 text-text-secondary"
                          }`}
                        >
                          {experience.company.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <h3 className="card-title-xl">{experience.company}</h3>
                          <p className="mt-0.5 font-mono text-sm font-medium text-accent-hover">
                            {experience.position}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-text-muted">
                            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {experience.location}
                          </p>
                          <p className="mt-3 body-copy text-text-secondary">
                            {experience.detail}
                          </p>
                        </div>
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
