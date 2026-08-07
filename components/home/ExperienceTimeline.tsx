import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TimelineProgress from "@/components/ui/TimelineProgress";

const experiences = [
  {
    period: "May 2026 — Present",
    company: "Ledgercross",
    position: "Software Developer Trainee",
    detail:
      "Building production-grade AI software and backend systems for enterprise finance. Contributing to InvoicePilot's intelligent invoice processing platform, OCR pipeline integration, validation workflows, fraud detection features, and scalable backend services while collaborating in an agile development team.",
    tag: "Present",
  },
  {
    period: "Feb 2026 — Apr 2026",
    company: "Bangladesh Software Solutions",
    position: "Software Engineering Intern",
    detail:
      "Developed and delivered responsive web applications for multiple client projects. Worked across frontend and backend development, implemented production-ready features, fixed bugs, collaborated with the development team, and successfully completed assigned client deliverables within deadlines.",
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
          lede="Professional work across two companies — enterprise fintech to client delivery."
        />

        <div className="relative mt-14">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-line sm:left-1/2" />
          <TimelineProgress />

          <div className="space-y-12">
            {experiences.map((experience, i) => {
              const leftSide = i % 2 === 0;
              return (
                <div
                  key={experience.company}
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
                        {experience.period}
                      </p>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                        {experience.company}
                      </h3>
                      <p className="font-mono text-sm font-medium text-accent">
                        {experience.position}
                      </p>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {experience.detail}
                      </p>
                      {experience.tag && (
                        <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent-dim px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent">
                          {experience.tag}
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
