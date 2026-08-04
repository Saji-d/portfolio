import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TimelineProgress from "@/components/ui/TimelineProgress";

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
  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="04"
          eyebrow="Experience"
          title="A path engineered, not walked."
          lede="From a 5.00 SSC to a shipped fintech pipeline — every step was deliberate."
        />

        <div className="relative mt-14">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-line sm:left-1/2" />
          <TimelineProgress />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const leftSide = i % 2 === 0;
              return (
                <div
                  key={step.title}
                  className="relative grid gap-4 pl-12 sm:grid-cols-2 sm:pl-0"
                >
                  <span className="absolute left-4 top-1 grid h-4 w-4 -translate-x-1/2 place-items-center sm:left-1/2">
                    <Reveal scale={0} y={0}>
                      <span className="block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_16px_rgba(79,209,197,0.8)]" />
                    </Reveal>
                  </span>

                  <Reveal
                    x={leftSide ? -20 : 20}
                    y={0}
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
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
