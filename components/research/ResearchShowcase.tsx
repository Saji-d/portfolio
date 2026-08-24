"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import ResearchCard from "@/components/research/ResearchCard";
import AnimatedMetric from "@/components/ui/AnimatedMetric";
import { researchPapers } from "@/data/research";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export default function ResearchShowcase({
  onOpenResearch,
}: {
  onOpenResearch?: (slug: string) => void;
}) {
  const featured = researchPapers.find((p) => p.slug === "neuronscreen");
  const rest = researchPapers.filter((p) => p.slug !== "neuronscreen");

  const featuredClasses =
    "card-surface group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:p-6";

  return (
    <>
      {featured && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={stagger}
          className={featuredClasses}
        >
          <FeaturedCardBody
            featured={featured}
            onOpenResearch={onOpenResearch}
          />
        </motion.div>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {rest.map((paper, i) => (
          <Reveal key={paper.slug} delay={(i % 2) * 0.05}>
            <ResearchCard paper={paper} onOpen={onOpenResearch} />
          </Reveal>
        ))}
      </div>
    </>
  );
}

function FeaturedCardBody({
  featured,
  onOpenResearch,
}: {
  featured: (typeof researchPapers)[number];
  onOpenResearch?: (slug: string) => void;
}) {
  const readHref = `/research/${featured.slug}`;
  const readLabel = (
    <>
      Read the research{" "}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </>
  );
  const linkClasses =
    "inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80";

  return (
    <>
      <span
        aria-hidden="true"
        className="animate-trace-sweep pointer-events-none absolute -top-px left-0 h-px w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent"
      />
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Featured thesis</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {featured.live && (
            <a
              href={featured.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink shadow-[0_4px_16px_-4px_var(--accent-soft)] transition-colors hover:bg-accent/90"
            >
              Live App <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {onOpenResearch ? (
            <button
              type="button"
              onClick={() => onOpenResearch(featured.slug)}
              className={linkClasses}
            >
              {readLabel}
            </button>
          ) : (
            <Link href={readHref} className={linkClasses}>
              {readLabel}
            </Link>
          )}
        </div>
      </motion.div>
      <div className="mt-3 lg:grid lg:grid-cols-[1fr_260px] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <motion.h2
            variants={fadeUp}
            className="max-w-3xl font-display text-xl font-medium leading-7 tracking-tight text-text-primary sm:text-2xl sm:leading-8"
          >
            {featured.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 max-w-2xl body-copy text-text-secondary">
            {featured.summary}
          </motion.p>
        </div>
        {featured.metrics && (
          <motion.div variants={fadeUp} className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-0 lg:grid-cols-2">
            {featured.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-line bg-surface-2 px-2.5 py-2"
              >
                <AnimatedMetric
                  value={m.value}
                  showBar
                  className="block font-display text-base font-medium tracking-tight text-accent sm:text-lg"
                />
                <div className="mt-0.5 card-meta">{m.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
