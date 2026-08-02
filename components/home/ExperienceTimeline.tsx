"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    period: "May 2026 — Present",
    title: "LedgerCross",
    detail: "Software Developer Trainee — InvoicePilot, Redis Streams, Solidity seals",
    tag: "NOW",
  },
  {
    period: "Feb — Apr 2026",
    title: "BSS Internship",
    detail: "Software Engineer Intern — shipped 18 responsive projects + 6 assigned tasks",
  },
  {
    period: "2022 — 2026",
    title: "5× Dean's Award",
    detail: "AIUB Merit Scholar (70% waiver) across the CSE program",
  },
  {
    period: "Sep 2022 — Apr 2026",
    title: "AIUB · BSc CSE",
    detail: "CGPA 3.92 / 4.00 — thesis: NeuroScreen hybrid ensemble (0.982 AUC)",
  },
];

export default function ExperienceTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="05"
          eyebrow="Experience"
          title="A path engineered, not walked."
          lede="From a 5.00 SSC to a shipped fintech pipeline — every step was deliberate."
        />

        <div ref={ref} className="relative mt-14">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-line sm:left-1/2" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-4 top-0 w-px origin-top bg-accent sm:left-1/2"
          />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const leftSide = i % 2 === 0;
              return (
                <div
                  key={step.title}
                  className="relative grid gap-4 pl-12 sm:grid-cols-2 sm:pl-0"
                >
                  <span className="absolute left-4 top-1 grid h-4 w-4 -translate-x-1/2 place-items-center sm:left-1/2">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_16px_rgba(79,209,197,0.8)]"
                    />
                  </span>

                  <motion.div
                    initial={{ opacity: 0, x: leftSide ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`sm:px-8 ${leftSide ? "sm:text-right" : "sm:col-start-2"}`}
                  >
                    <div
                      className={`flex flex-col gap-1 ${leftSide ? "sm:items-end" : ""}`}
                    >
                      <p className="font-mono text-xs text-text-muted">
                        {step.period}
                      </p>
                      <h3 className="font-display text-lg font-medium tracking-tight text-text-primary">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {step.detail}
                      </p>
                      {step.tag && (
                        <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent-dim px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent">
                          {step.tag}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
