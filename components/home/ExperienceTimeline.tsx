"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import TimelineProgress from "@/components/ui/TimelineProgress";

const experiences = [
  {
    period: "Oct 2026 - Present",
    company: "RemoteIntegrity LLC",
    position: "Full-Stack Developer",
    location: "Clearwater, Florida, USA · Contract · Flexible hours",
    detail:
      "Building and maintaining front-end and back-end components of web applications, designing server-side logic, APIs and database integrations and shipping through code review, testing and deployment.",
    tag: "Contract",
    current: true,
  },
  {
    period: "Oct 2026 - Present",
    company: "2BitSoft",
    position: "Full-Stack Developer",
    location: "Dubai, UAE · Remote",
    detail:
      "Developing full-stack web applications for software, automation and digital transformation projects, from responsive interfaces to the services and data layers behind them.",
    tag: "Present",
    current: true,
  },
  {
    period: "May 2026 - Sep 2026",
    company: "Ledgercross",
    position: "Software Developer",
    location: "Dhaka, Bangladesh · On-site",
    detail:
      "Engineered production software across the stack for enterprise finance, working with APIs, asynchronous processing, data layers, automated testing, cloud infrastructure and system reliability.",
    tag: "Complete",
    current: false,
  },
  {
    period: "Feb 2026 - Apr 2026",
    company: "Bangladesh Software Solution",
    position: "Software Engineer Intern",
    location: "Dhaka, Bangladesh · Hybrid",
    detail:
      "Developed responsive frontend interfaces with HTML5, CSS3 and modern JavaScript (ES6+), integrated them with backend RESTful APIs with robust error handling and worked in agile, Git-based workflows.",
    tag: "Complete",
    current: false,
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
                      className={`card-surface ml-10 overflow-hidden transition-all duration-500 hover:-translate-y-0.5 ${
                        (isCurrent
                          ? "border-accent/40 shadow-[0_16px_50px_-28px_rgba(99,102,241,0.4)] "
                          : "hover:border-accent/40 ") +
                        (isLeft
                          ? "lg:ml-0 lg:mr-[calc(50%_+_2rem)]"
                          : "lg:ml-[calc(50%_+_2rem)] lg:mr-0")
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2/60 px-4 py-2.5">
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

                      <div className="p-4 sm:p-5">
                        <h3 className="card-title-xl">{experience.company}</h3>
                        <p className="mt-0.5 font-mono text-sm font-medium text-accent-hover">
                          {experience.position}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-text-muted">
                          {experience.location}
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
