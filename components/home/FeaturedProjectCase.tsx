"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import type { Project } from "@/data/projects";
import { GithubIcon } from "@/components/ui/BrandIcons";
import MagneticButton from "@/components/ui/MagneticButton";
import { primaryHref, SmartLink } from "@/components/work/ProjectCard";

const reducedMotionQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

const finePointerQuery =
  typeof window !== "undefined" ? window.matchMedia("(pointer: fine)") : null;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const pillsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};

const pillFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

interface FeaturedProjectCaseProps {
  project: Project;
  index: number;
  total: number;
  imageFirst: boolean;
  onOpenCaseStudy: (slug: string) => void;
}

const FLAT_TRANSFORM = "perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

function FeaturedImage({
  project,
  onOpenCaseStudy,
}: {
  project: Project;
  onOpenCaseStudy: (slug: string) => void;
}) {
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  // Flat and undistorted at rest - the screenshot has to read accurately.
  // Tilt only appears while the cursor is actually over the card, and it's
  // kept small (max ~4deg) so it reads as a premium hover cue rather than a
  // gimmicky "tilted credit card".
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = frameRef.current;
    if (!el) return;
    if (reducedMotionQuery?.matches) return;
    if (finePointerQuery && !finePointerQuery.matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = px * 4;
    const rotateX = -py * 4;
    el.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
  }

  function onLeave() {
    const el = frameRef.current;
    if (!el) return;
    el.style.transform = FLAT_TRANSFORM;
  }

  const opensCaseStudy = Boolean(project.caseStudy);
  const href = primaryHref(project);

  const art = (
    <>
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1.03 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-[-10%]"
      >
        <Image
          src={project.cover}
          alt={`${project.name}: ${project.tagline}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-bg/0 transition-colors duration-300 group-hover:bg-bg/5" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span className="animate-scan-sweep absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
      </div>
      <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 -translate-x-1 -translate-y-1 border-l border-t border-accent/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:opacity-100" />
      <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 translate-x-1 -translate-y-1 border-r border-t border-accent/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 -translate-x-1 translate-y-1 border-b border-l border-accent/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 translate-x-1 translate-y-1 border-b border-r border-accent/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:opacity-100" />

      <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-ink opacity-0 shadow-[0_10px_28px_rgba(99,102,241,0.4)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </>
  );

  return (
    <div ref={scrollTargetRef} className="group relative" style={{ perspective: "1400px" }}>
      {/* Contact shadow - a soft blurred ellipse grounding the card, plus an
          accent-tinted bloom behind it that intensifies on hover, giving the
          mockup a "floating above the page" depth cue without a container. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[28px] bg-[radial-gradient(closest-side,var(--accent-dim),transparent)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -bottom-6 -z-10 h-14 rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.45),transparent)] opacity-60 blur-2xl"
      />

      <div
        ref={frameRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ transform: FLAT_TRANSFORM }}
        className="relative h-[190px] w-full overflow-hidden rounded-2xl border border-line/80 bg-surface-2 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out will-change-transform sm:h-[240px] lg:h-auto lg:aspect-[3/2]"
      >
        {opensCaseStudy ? (
          <button
            type="button"
            onClick={() => onOpenCaseStudy(project.slug)}
            aria-label={`Open ${project.name} case study`}
            className="absolute inset-0 block h-full w-full cursor-pointer"
          >
            {art}
          </button>
        ) : href ? (
          <SmartLink
            href={href}
            ariaLabel={`${project.name}: ${project.tagline}`}
            className="absolute inset-0 block h-full w-full"
          >
            {art}
          </SmartLink>
        ) : (
          <div className="absolute inset-0 h-full w-full">{art}</div>
        )}
      </div>
    </div>
  );
}

export default function FeaturedProjectCase({
  project,
  index,
  total,
  imageFirst,
  onOpenCaseStudy,
}: FeaturedProjectCaseProps) {
  const number = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");
  const opensCaseStudy = Boolean(project.caseStudy);
  const href = primaryHref(project);

  const infoColStart = imageFirst ? "lg:col-start-8" : "lg:col-start-1";
  const imageColStart = imageFirst ? "lg:col-start-1" : "lg:col-start-7";

  return (
    <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-14">
      <div className={`order-1 lg:order-none lg:col-span-6 lg:row-start-1 ${imageColStart}`}>
        <FeaturedImage project={project} onOpenCaseStudy={onOpenCaseStudy} />
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={stagger}
        className={`order-2 lg:order-none lg:col-span-5 lg:row-start-1 lg:pt-1 ${infoColStart}`}
      >
        <motion.div variants={fadeUp}>
          <span
            className="font-mono text-sm font-medium tracking-wide text-text-muted"
            aria-label={`Featured project ${number} of ${totalLabel}`}
          >
            {number}
          </span>
        </motion.div>

        <motion.h3
          variants={fadeUp}
          className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl lg:text-[2rem] lg:leading-[1.15]"
        >
          {opensCaseStudy ? (
            <button
              type="button"
              onClick={() => onOpenCaseStudy(project.slug)}
              className="text-left transition-colors hover:text-accent"
            >
              {project.name}
            </button>
          ) : href ? (
            <SmartLink href={href} className="transition-colors hover:text-accent">
              {project.name}
            </SmartLink>
          ) : (
            project.name
          )}
        </motion.h3>

        <motion.p
          variants={fadeUp}
          className="mt-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent sm:text-sm"
        >
          {project.role}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-3.5 max-w-md text-[14px] leading-relaxed text-text-secondary sm:text-[15px]"
        >
          {project.tagline}
        </motion.p>

        <motion.div variants={pillsContainer} className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <motion.span
              key={tech}
              variants={pillFade}
              className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-text-secondary"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-3">
          {opensCaseStudy ? (
            <MagneticButton
              onClick={() => onOpenCaseStudy(project.slug)}
              className="border border-accent/40 bg-surface px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent-dim"
            >
              <BookOpen className="h-4 w-4" />
              Case study
            </MagneticButton>
          ) : href ? (
            <MagneticButton
              href={href}
              external={href.startsWith("http")}
              className="border border-accent/40 bg-surface px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent-dim"
            >
              <BookOpen className="h-4 w-4" />
              View project
            </MagneticButton>
          ) : null}
          {project.github && (
            <MagneticButton
              href={project.github}
              external
              className="border border-line bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent/50"
            >
              <GithubIcon className="h-4 w-4" />
              Code
            </MagneticButton>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
