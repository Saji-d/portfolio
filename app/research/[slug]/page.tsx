import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ResearchCard from "@/components/research/ResearchCard";
import { getResearch, researchPapers } from "@/data/research";
import { SITE } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return researchPapers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getResearch(slug);
  if (!study) return { title: "Research" };
  return {
    title: `${study.shortTitle} — Research`,
    description: study.oneLiner,
    alternates: { canonical: `/research/${study.slug}` },
  };
}

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

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-text-secondary">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <p key={item} className="leading-relaxed text-text-secondary">
          {item}
        </p>
      ))}
    </div>
  );
}

function Models({ items }: { items: { name: string; role: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((m) => (
        <div key={m.name} className="card-surface p-5">
          <h3 className="font-display text-base font-medium tracking-tight text-text-primary">
            {m.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{m.role}</p>
        </div>
      ))}
    </div>
  );
}

function ResultNotes({ items }: { items: string[] }) {
  return <Bullets items={items} />;
}

function BaselineTable({ baselines }: { baselines: { model: string; accuracy: string }[] }) {
  return (
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
          {baselines.map((b, i) => {
            const best = parseFloat(baselines[0].accuracy);
            const delta =
              i === 0 ? "baseline" : `+${(best - parseFloat(b.accuracy)).toFixed(2)} vs best`;
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
                    <span className="ml-2 font-mono text-[10px] text-accent">winner</span>
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
  );
}

function FeatureGrid({ features }: { features: { name: string; importance: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <div key={f.name} className="card-surface p-5">
          <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 font-display text-sm font-medium tracking-tight text-text-primary">
            {f.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-text-muted">importance {f.importance}</p>
        </div>
      ))}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-xs text-text-secondary"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getResearch(slug);

  if (!study) {
    notFound();
  }

  const related = researchPapers.filter((p) => study.relatedSlugs.includes(p.slug));

  const numbered: { title: string; body: React.ReactNode }[] = [];
  const add = (title: string, body: React.ReactNode) =>
    numbered.push({ title, body });

  add("Research Overview", <Paragraphs items={study.overview} />);
  add("Problem Statement", <Bullets items={study.problem} />);
  add("Objective", <Bullets items={study.objective} />);
  add("Methodology", <Bullets items={study.methodology} />);
  add("Models Used", <Models items={study.models} />);
  add("Dataset", <Bullets items={study.dataset} />);
  add("Implementation", <Bullets items={study.implementation} />);
  add("Key Features", <Bullets items={study.keyFeatures} />);
  add(
    "Results",
    study.resultNotes.length > 0 ? (
      <ResultNotes items={study.resultNotes} />
    ) : (
      <p className="leading-relaxed text-text-secondary">No quantitative results reported.</p>
    )
  );
  if (study.baselines) add("Baseline comparison", <BaselineTable baselines={study.baselines} />);
  if (study.featureImportance)
    add("What predicts impairment", <FeatureGrid features={study.featureImportance} />);
  add("Outcome", <Bullets items={study.outcome} />);
  add("Tools & Technologies", <Chips items={study.tools} />);
  add("Challenges", <Bullets items={study.challenges} />);
  add("Future Improvements", <Bullets items={study.futureWork} />);

  return (
    <article>
      <div className="container-site pt-32 sm:pt-40">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            {study.featured && (
              <span className="rounded-full border border-accent/30 bg-accent-dim px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent">
                FEATURED THESIS
              </span>
            )}
            <span className="font-mono text-xs text-text-muted">{study.field}</span>
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-gradient sm:text-5xl lg:text-6xl">
            {study.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {study.oneLiner}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-text-secondary">
            {study.summary}
          </p>
        </Reveal>

        {study.metrics && study.metrics.length > 0 && (
          <div className="mt-10 pb-4">
            <Reveal>
              <div className="card-surface grid grid-cols-2 gap-8 p-8 sm:grid-cols-3 sm:p-10">
                {study.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl font-medium tracking-tight text-accent sm:text-3xl">
                      {m.value}
                    </div>
                    <div className="mt-1 font-mono text-xs text-text-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>

      <div className="container-site pb-8">
        {numbered.map((section, i) => (
          <Section key={section.title} eyebrow={`[ ${String(i + 1).padStart(2, "0")} ]`} title={section.title}>
            {section.body}
          </Section>
        ))}

        {related.length > 0 && (
          <Section eyebrow={`[ ${String(numbered.length + 1).padStart(2, "0")} ]`} title="Related work">
            <div className="grid gap-5 md:grid-cols-2">
              {related.map((paper) => (
                <ResearchCard key={paper.slug} paper={paper} />
              ))}
            </div>
          </Section>
        )}

        {study.thesisCta && (
          <Section
            eyebrow={`[ ${String(numbered.length + 2).padStart(2, "0")} ]`}
            title="Get the thesis"
          >
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
        )}

        <Link
          href="/research"
          className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to research
        </Link>
      </div>
    </article>
  );
}
