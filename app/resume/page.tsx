import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { resume } from "@/data/resume";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Full resume of ${SITE.name}: Full-Stack Software Engineer | AI/ML. Downloadable PDF.`,
  alternates: { canonical: "/resume" },
};

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="mt-8 first:mt-0">
        <div aria-hidden="true" className="border-t border-line/60" />
        <h2 className="mt-4 flex items-baseline gap-2 font-display text-base font-semibold tracking-tight text-text-primary">
          <span className="font-mono text-base text-accent">{index}</span>
          <span className="uppercase tracking-[0.06em]">{title}</span>
        </h2>
        <div className="mt-3">{children}</div>
      </section>
    </Reveal>
  );
}

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 09 ] · Resume"
        title="The source of truth."
        lede="Everything on this site traces back to this document. Download it, or read it inline below."
      />

      <section className="container-site py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="/Sajidur_Rahman_Sajid.pdf"
                download="Sajidur_Rahman_Sajid.pdf"
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-medium text-accent-ink transition-colors hover:bg-accent/90"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </a>
              <a
                href={`mailto:${SITE.email}?subject=Resume request`}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-4 py-2 font-mono text-xs font-medium text-text-primary transition-colors hover:border-accent/50"
              >
                Request a tailored version <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </Reveal>

          <div className="card-surface mt-6 p-5 sm:p-8">
            <Section index="01" title="About">
              <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">{resume.about}</p>
            </Section>

            <Section index="02" title="Experience">
              <div className="space-y-4">
                {resume.experience.map((exp) => (
                  <div key={exp.org}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-text-primary text-xs sm:text-sm">{exp.org}</h3>
                      <span className="font-mono text-[11px] text-text-muted">{exp.period}</span>
                    </div>
                    <p className="font-mono text-xs text-accent">
                      {exp.role} · {exp.location}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {exp.points.map((p) => (
                        <li key={p} className="flex gap-2 text-xs leading-normal text-text-secondary">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section index="03" title="Projects">
              <div className="space-y-4">
                {resume.projects.map((proj) => (
                  <div key={proj.name}>
                    <h3 className="font-semibold text-text-primary text-xs sm:text-sm">{proj.name}</h3>
                    <p className="font-mono text-[11px] text-text-muted">{proj.stack}</p>
                    <ul className="mt-1.5 space-y-1">
                      {proj.points.map((p) => (
                        <li key={p} className="flex gap-2 text-xs leading-normal text-text-secondary">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section index="04" title="Education">
              <div className="space-y-3">
                {resume.education.map((ed) => (
                  <div key={ed.org}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-text-primary text-xs sm:text-sm">{ed.org}</h3>
                      <span className="font-mono text-[11px] text-text-muted">{ed.period}</span>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {ed.degree} · <span className="text-accent">{ed.detail}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section index="05" title="Thesis & Research">
              <h3 className="font-semibold text-text-primary text-xs sm:text-sm">{resume.thesis.name}</h3>
              <p className="font-mono text-[11px] text-text-muted">{resume.thesis.stack}</p>
              <ul className="mt-1.5 space-y-1">
                {resume.thesis.points.map((p) => (
                  <li key={p} className="flex gap-2 text-xs leading-normal text-text-secondary">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </Section>

            <Section index="06" title="Certifications & Training">
              <ul className="space-y-1">
                {resume.certifications.map((c) => (
                  <li key={c} className="flex gap-2 text-xs leading-normal text-text-secondary">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </Section>

            <Section index="07" title="Technical Skills">
              <div className="space-y-2">
                {resume.skills.map((s) => (
                  <p key={s.group} className="text-xs leading-normal text-text-secondary">
                    <span className="font-semibold text-text-primary">{s.group}:</span>{" "}
                    {s.items}
                  </p>
                ))}
              </div>
            </Section>

            <Section index="08" title="Honors & Awards">
              <div className="space-y-3">
                {resume.honors.map((h) => (
                  <div key={h.name}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-text-primary text-xs sm:text-sm">{h.name}</h3>
                      <span className="font-mono text-[11px] text-text-muted">{h.period}</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-normal text-text-secondary">{h.detail}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section index="09" title="Leadership & Activities">
              <div className="space-y-3">
                {resume.leadership.map((l) => (
                  <div key={l.role}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-text-primary text-xs sm:text-sm">{l.role}</h3>
                      <span className="font-mono text-[11px] text-text-muted">{l.period}</span>
                    </div>
                    <p className="font-mono text-xs text-accent">{l.org}</p>
                    <p className="mt-0.5 text-xs leading-normal text-text-secondary">{l.detail}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section index="10" title="References">
              <div className="grid gap-3 sm:grid-cols-2">
                {resume.references.map((ref) => (
                  <div key={ref.name} className="rounded-lg border border-line bg-surface p-3.5">
                    <h3 className="font-semibold text-text-primary text-xs sm:text-sm">{ref.name}</h3>
                    <p className="mt-0.5 text-xs text-text-secondary">{ref.role}</p>
                    {"extra" in ref && ref.extra ? (
                      <p className="text-xs text-text-muted">{ref.extra}</p>
                    ) : "org" in ref && ref.org ? (
                      <p className="text-xs text-text-muted">{ref.org}</p>
                    ) : null}
                    <a
                      href={`mailto:${ref.email}`}
                      className="mt-1.5 inline-block font-mono text-[11px] text-accent hover:underline"
                    >
                      {ref.email}
                    </a>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}
