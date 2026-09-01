"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { GLOBE_LOCATIONS } from "@/data/globe";
import { SITE } from "@/data/site";

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
    <div className="flex flex-wrap items-center gap-1.5">
      {GLOBE_LOCATIONS.map((loc) => {
        const active = loc.id === selectedId;
        return (
          <button
            key={loc.id}
            type="button"
            onClick={() => onSelect(loc.id)}
            aria-pressed={active}
            aria-label={`${loc.label}, ${loc.sublabel}`}
            title={loc.sublabel}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider transition-all duration-300 ${
              active
                ? "border-accent/50 bg-accent-dim text-accent-hover"
                : "border-line bg-surface text-text-secondary hover:border-accent/30 hover:text-text-primary"
            }`}
          >
            <span
              className={`h-1 w-1 shrink-0 rounded-full transition-colors duration-300 ${
                active ? "bg-accent" : "bg-text-muted"
              }`}
            />
            {loc.label}
          </button>
        );
      })}
    </div>
  );
}

// Shared with the featured project reveal, so About's entrance reads as
// the same design language rather than a section-specific one-off.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

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
          <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent-hover">
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
      className="relative scroll-mt-0 flex min-h-screen min-h-dvh flex-col justify-center overflow-hidden pt-[calc(var(--nav-offset)_+_1.5rem)] pb-6 sm:pb-8"
    >
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-start lg:gap-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Eyebrow index="01">About</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="section-title text-gradient mt-2 sm:mt-2.5 sm:text-[1.4rem] lg:text-[1.5rem]"
            >
              The world is part of the work.
            </motion.h2>
            <ul className="mt-3.5 space-y-2 font-mono text-[12px] font-medium uppercase leading-[1.7] tracking-[0.08em] text-text-muted sm:mt-4">
              <motion.li variants={fadeUp} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="flex flex-wrap items-baseline gap-x-1.5">
                  <span>CURRENTLY BUILDING</span>
                  <span className="text-accent-hover">·</span>
                  <span className="text-text-secondary">SOFTWARE SYSTEMS</span>
                </span>
              </motion.li>
              <motion.li variants={fadeUp} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="flex flex-wrap items-baseline gap-x-1.5">
                  <span>WORKING ACROSS</span>
                  <span className="text-accent-hover">·</span>
                  <span className="text-text-secondary">FULL-STACK + AI/ML</span>
                </span>
              </motion.li>
              <motion.li variants={fadeUp} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="flex flex-wrap items-baseline gap-x-1.5">
                  <span>BASED IN DHAKA, BANGLADESH</span>
                  <span className="text-accent-hover">·</span>
                  <span className="text-text-secondary">{SITE.timezone}</span>
                </span>
              </motion.li>
            </ul>

            <div className="mt-4 space-y-2.5 sm:mt-5">
              <motion.p variants={fadeUp} className="max-w-md text-[14px] leading-relaxed text-text-secondary sm:text-[15px]">
                I&apos;m Sajid, a software engineer in Dhaka. I work across
                full-stack systems and AI/ML, building software that turns
                complicated problems into something practical and reliable.
              </motion.p>
              <motion.p variants={fadeUp} className="max-w-md text-[14px] leading-relaxed text-text-secondary sm:text-[15px]">
                The work reaches past my desk. There&apos;s a growing footprint
                across America and Europe, and I like software that travels well
                beyond where it was built.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className="mt-4 sm:mt-4.5">
              <LocationList selectedId={selectedId} onSelect={setSelectedId} />
            </motion.div>
          </motion.div>

          <Reveal delay={0.08} className="min-w-0 lg:mt-12">
            {/* No card border/fill here on purpose - a boxed panel is what
                made this read as "a widget next to some text" rather than
                one scene. The globe's edges dissolve into the page via a
                radial mask instead of a hard rounded-rectangle clip, so the
                atmosphere glow and the starfield behind it stay continuous. */}
            <div className="relative h-[300px] sm:h-[340px] lg:h-[380px]">
              {/* Only the canvas + its glow sit inside the mask - the "drag
                  to explore" hint and the location panel are UI, not scene,
                  so they stay fully legible even where the globe itself has
                  faded toward the edge. */}
              <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(62%_62%_at_50%_46%,black_58%,transparent_100%)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,var(--accent-dim),transparent)] opacity-50"
                />
                <AboutGlobe selectedId={selectedId} onSelect={setSelectedId} />
              </div>
              <span className="pointer-events-none absolute right-4 top-4 z-10 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                drag to explore
              </span>
              <FloatingLocationPanel id={selectedId} />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className="mt-10 flex items-center gap-3 pt-4 sm:mt-12">
            <span className="h-1 w-1 shrink-0 rounded-full bg-accent/70" />
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
              {GLOBE_LOCATIONS.length} regions tracked · footprint growing
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
