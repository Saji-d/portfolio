import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FullTimeline from "@/components/about/FullTimeline";
import Reveal from "@/components/ui/Reveal";
import { Award, Sparkles, Scale, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software Engineer in Dhaka building high-throughput backends and production ML — 5× Dean's Award, thesis on hybrid ML ensembles, now at LedgerCross.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Scale,
    title: "Honesty over hype",
    body: "Every project lists its real numbers — and its real limitations. Blending beats a single model 95.20% of the time; I also tell you where it can't.",
  },
  {
    icon: Wrench,
    title: "Systems thinking",
    body: "From Redis Streams consumer groups to RLS tenant isolation, I design for the whole pipeline — not just the happy path.",
  },
  {
    icon: Sparkles,
    title: "Ship, then polish",
    body: "A working MVP with honest boundaries beats a perfect spec. CaseVault's Phase 1 shipped before Phase 2 was even started.",
  },
  {
    icon: Award,
    title: "Engineering receipts",
    body: "218 passing tests, 16 reference papers, 2,237 survey responses — I keep the evidence that a claim is true.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 03 ] — About"
        title="Engineer, thesis author, and reluctant trust-builder."
        lede="I work where backend reliability meets machine-learning rigor — and I care that the numbers you see are real."
      />

      <section className="container-site py-12">
        <Reveal>
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-text-secondary">
            <p>
              I&apos;m Sajidur Rahman Sajid, a Software Engineer in Dhaka currently
              building{" "}
              <span className="text-text-primary">InvoicePilot</span> at
              LedgerCross — an 11-stage AI invoice pipeline whose processing
              history is anchored on-chain. Before that I interned as a Software
              Engineer at BSS, where I shipped 18 responsive projects and worked
              through Bootstrap, JavaScript, and Figma-driven frontend work.
            </p>
            <p>
              My thesis, <span className="text-text-primary">NeuroScreen</span>,
              trained a hybrid CatBoost + ANN ensemble on 2,237 student surveys
              to detect cognitive impairment — 95.20% accuracy and a 0.982
              ROC-AUC, beating both standalone models. It taught me that the
              best ML systems combine complementary strengths, and that real
              datasets beat toy ones.
            </p>
            <p>
              Across AIUB I earned the Dean&apos;s Award five times and an AIUB Merit
              Scholarship (70% tuition waiver). I&apos;ve coordinated the Space
              Innovation Camp and represented WRO Bangladesh. Underlying all of
              it: an earned Duke of Edinburgh&apos;s Bronze Award — evidence that I
              finish what I start.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="container-site py-12">
        <Reveal>
          <p className="eyebrow">[ 02 ] — Values</p>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
            How I work
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.04}>
              <div className="card-surface h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40">
                <v.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-display text-base font-medium tracking-tight text-text-primary">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site py-12">
        <Reveal>
          <p className="eyebrow">[ 03 ] — Timeline</p>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
            Career & education
          </h2>
        </Reveal>
        <div className="mt-10">
          <FullTimeline />
        </div>
      </section>
    </>
  );
}
