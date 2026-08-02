"use client";

import { motion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import TerminalCard from "@/components/home/TerminalCard";
import Eyebrow from "@/components/ui/Eyebrow";
import Stat from "@/components/ui/Stat";
import { SITE } from "@/data/site";

const stats = [
  { value: "3.92", label: "CGPA / 4.00" },
  { value: "218", label: "tests written" },
  { value: "2,237", label: "thesis dataset" },
  { value: "5x", label: "Dean's Award" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent-dim blur-[120px]"
      />
      <div className="container-site relative">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <Eyebrow>Software Engineer — Dhaka</Eyebrow>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-gradient sm:text-6xl lg:text-7xl"
          >
            Sajidur Rahman Sajid
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton
              href="/work"
              className="bg-accent px-6 py-3 text-sm font-medium text-[#0B0E14] hover:bg-accent/90"
            >
              View work <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href="/Sajidur_Rahman_Sajid.pdf"
              external
              className="border border-line bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent/50"
            >
              <Download className="h-4 w-4" /> Download CV
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-center"
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-1">
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
          <TerminalCard />
        </motion.div>
      </div>
    </section>
  );
}
