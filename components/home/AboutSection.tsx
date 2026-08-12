"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { GLOBE_LOCATIONS } from "@/data/globe";

const AboutGlobe = dynamic(() => import("@/components/home/about/AboutGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
        loading globe…
      </span>
    </div>
  ),
});

function LocationList({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {GLOBE_LOCATIONS.map((loc) => {
        const active = loc.id === selectedId;
        return (
          <button
            key={loc.id}
            type="button"
            onClick={() => onSelect(loc.id)}
            aria-pressed={active}
            aria-label={`${loc.label} — ${loc.sublabel}`}
            className={`group flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all duration-300 ${
              active
                ? "border-accent/40 bg-accent-dim/50"
                : "border-transparent hover:border-line hover:bg-surface-2/60"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                active ? "bg-accent" : "bg-text-muted"
              }`}
            />
            <span className="min-w-0">
              <span
                className={`block font-mono text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                  active ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                }`}
              >
                [ {loc.label} ]
              </span>
              <span className="mt-0.5 block text-xs text-text-muted">{loc.sublabel}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FloatingLocationPanel({ id }: { id: string }) {
  const loc = GLOBE_LOCATIONS.find((l) => l.id === id);
  if (!loc) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4 sm:justify-start sm:p-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={loc.id}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-auto rounded-xl border border-line bg-surface/85 px-4 py-2.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
            {loc.label}
          </p>
          <p className="mt-0.5 text-sm text-text-secondary">{loc.sublabel}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function AboutSection() {
  const [selectedId, setSelectedId] = useState<string>(
    GLOBE_LOCATIONS.find((l) => l.home)?.id ?? GLOBE_LOCATIONS[0].id
  );

  return (
    <section
      id="about"
      aria-label="About"
      className="relative scroll-mt-24 overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24"
    >
      <div className="container-site">
        <Reveal>
          <Eyebrow index="02">About</Eyebrow>
        </Reveal>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-stretch lg:gap-14">
          <Reveal className="flex flex-col justify-center">
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-gradient sm:text-4xl">
              The world is part of the work.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
              Based in Bangladesh, with a growing professional footprint
              across America and Europe. I enjoy building software that
              travels beyond the environment it was created in.
            </p>

            <div className="mt-8">
              <LocationList selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <div className="relative h-[380px] overflow-hidden rounded-2xl border border-line bg-surface/30 sm:h-[440px] lg:h-full lg:min-h-[520px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,var(--accent-dim),transparent)] opacity-40"
              />
              <span className="pointer-events-none absolute right-4 top-4 z-10 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                drag to explore
              </span>
              <AboutGlobe selectedId={selectedId} onSelect={setSelectedId} />
              <FloatingLocationPanel id={selectedId} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
