import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ResearchCard from "@/components/research/ResearchCard";
import { neuronscreen, researchPapers } from "@/data/research";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "NeuroScreen — Cognitive Impairment Detection",
  description: neuronscreen.oneLiner,
  alternates: { canonical: "/research/neuronscreen" },
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.08} className="mt-6">
        {children}
      </Reveal>
    </section>
  );
}

export default function NeuroScreenPage() {
  const related = researchPapers.filter((p) =>
    neuronscreen.relatedSlugs.includes(p.slug)
  );

  return (
    <article>
      <div className="container-site pt-32 sm:pt-40">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent/30 bg-accent-dim px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent">
              FEATURED THESIS
            </span>
            <span className="font-mono text-xs text-text-muted">
              {neuronscreen.field}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-gradient sm:text-5xl lg:text-6xl">
            {neuronscreen.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {neuronscreen.oneLiner}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-text-secondary">
            {neuronscreen.summary}
          </p>
        </Reveal>
      </div>

      <div className="container-site pb-8">
        <Section eyebrow="[ 01 ] — Results" title="Metrics">
          <div className="card-surface grid grid-cols-2 gap-8 p-8 sm:grid-cols-3 sm:p-10">
            {neuronscreen.metrics.map((m) => (
              <div key={m.label}>
                <div className="font-display text-2xl font-medium tracking-tight text-accent sm:text-3xl">
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-xs text-text-muted">{m.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="[ 02 ] — Method" title="How it works">
          <ul className="space-y-3">
            {neuronscreen.method.map((m) => (
              <li key={m} className="flex gap-3 text-text-secondary">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section eyebrow="[ 03 ] — Why it wins" title="Baseline comparison">
          <div className="card-surface overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line font-mono text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3 font-medium">Model</th>
                  <th className="px-5 py-3 text-right font-medium">Accuracy</th>
                  <th className="px-5 py-3 text-right font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {neuronscreen.baselines.map((b, i) => {
                  const delta =
                    i === 0 ? "baseline" : `+${(95.2 - parseFloat(b.accuracy)).toFixed(2)} vs best`;
                  const isWinner = i === 0;
                  return (
                    <tr
                      key={b.model}
                      className={`border-b border-line last:border-0 ${
                        isWinner ? "bg-accent-dim/60" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-text-primary">
                        {b.model}
                        {isWinner && (
                          <span className="ml-2 font-mono text-[10px] text-accent">
                            winner
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-sm text-text-secondary">
                        {b.accuracy}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-xs text-text-muted">
                        {delta}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            Ensemble blending (arithmetic mean of probabilities) lifts accuracy
            above both standalone models — complementary learners catch what each
            alone misses.
          </p>
        </Section>

        <Section eyebrow="[ 04 ] — Interpretability" title="What predicts impairment">
          <div className="grid gap-4 sm:grid-cols-3">
            {neuronscreen.features.map((f, i) => (
              <div key={f.name} className="card-surface p-5">
                <p className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-base font-medium tracking-tight text-text-primary">
                  {f.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-text-muted">
                  importance {f.importance}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="[ 05 ] — Related work" title="More research">
          <div className="grid gap-5 md:grid-cols-2">
            {related.map((paper) => (
              <ResearchCard key={paper.slug} paper={paper} />
            ))}
          </div>
          <Link
            href="/research"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to research
          </Link>
        </Section>

        <Section eyebrow="[ 06 ] — Want the full write-up?" title="Get the thesis">
          <div className="card-surface flex flex-wrap items-center justify-between gap-6 p-6">
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
              The complete thesis report covers the literature review, dataset
              construction, full feature set, and 16 reference papers. Reach out
              and I&apos;ll share it.
            </p>
            <a
              href={`mailto:${SITE.email}?subject=NeuroScreen thesis request`}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-[#0B0E14] transition-colors hover:bg-accent/90"
            >
              Request the thesis <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Section>
      </div>
    </article>
  );
}
