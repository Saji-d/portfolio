"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  getResearch,
  researchPapers,
  type ResearchMetric,
  type ResearchStudy,
} from "@/data/research.full";
import { SITE } from "@/data/site";
import OverlayShell from "@/components/ui/OverlayShell";
import AnimatedMetric from "@/components/ui/AnimatedMetric";
import { GithubIcon } from "@/components/ui/BrandIcons";

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
    <section className="py-8 sm:py-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2.5 font-display text-xl font-medium tracking-tight text-gradient sm:text-2xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
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
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {m.role}
          </p>
        </div>
      ))}
    </div>
  );
}

function BaselineTable({
  baselines,
}: {
  baselines: { model: string; accuracy: string }[];
}) {
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
              i === 0
                ? "baseline"
                : `+${(best - parseFloat(b.accuracy)).toFixed(2)} vs best`;
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
                    <span className="ml-2 font-mono text-[10px] text-accent-hover">
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
  );
}

function FeatureGrid({
  features,
}: {
  features: { name: string; importance: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <div key={f.name} className="card-surface p-5">
          <p className="font-mono text-xs text-accent-hover">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-sm font-medium tracking-tight text-text-primary">
            {f.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-text-muted">
            importance {f.importance}
          </p>
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

// The top metrics grid rendered as a small instrument panel: each figure
// counts up and, for anything naturally 0-100% or 0-1 (accuracy, ROC-AUC,
// etc.), fills a bar underneath via AnimatedMetric's own showBar logic.
// Non-numeric or unbounded values (a backbone name, a raw count) simply
// count up (or render as-is) with no bar, exactly as AnimatedMetric already
// handles elsewhere in the site.
function MetricPanel({ metrics }: { metrics: ResearchMetric[] }) {
  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Measured results</p>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
          />
          live readout
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-line bg-surface-2 px-3.5 py-3"
          >
            <AnimatedMetric
              value={m.value}
              showBar
              className="block font-display text-xl font-medium tracking-tight text-accent-hover sm:text-2xl"
            />
            <div className="mt-1.5 font-mono text-[11px] uppercase tracking-wide text-text-muted">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Some studies describe their own methodology as an explicit chain of
// stages joined with "→" (currently only the Twitter sentiment pipeline:
// "lowercase → strip URLs... → TF-IDF → Naive Bayes"). When that pattern
// exists in the study's own methodology text, render it as a stage flow.
// Nothing here is invented: the stage names and order come verbatim from
// data/research.full.ts; entries without such a chain simply get no flow.
function findPipelineChain(
  methodology: string[]
): { label: string; stages: string[] } | null {
  const item = methodology.find((m) => m.includes("→"));
  if (!item) return null;
  const colonIndex = item.indexOf(":");
  const label = colonIndex !== -1 ? item.slice(0, colonIndex).trim() : "Pipeline";
  const chainText = colonIndex !== -1 ? item.slice(colonIndex + 1) : item;
  const stages = chainText
    .split("→")
    .map((s) => s.replace(/\.$/, "").trim())
    .filter(Boolean);
  return stages.length > 1 ? { label, stages } : null;
}

function Pipeline({ label, stages }: { label: string; stages: string[] }) {
  return (
    <div className="card-surface p-6 sm:p-8">
      <p className="eyebrow">{label}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-3 py-1.5 font-mono text-xs leading-snug text-text-secondary">
              <span className="mr-1.5 text-accent-hover">
                {String(i + 1).padStart(2, "0")}
              </span>
              {stage}
            </span>
            {i < stages.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-text-muted"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StudyBody({
  study,
  onOpenStudy,
}: {
  study: ResearchStudy;
  onOpenStudy?: (slug: string) => void;
}) {
  const related = researchPapers.filter((p) =>
    study.relatedSlugs.includes(p.slug)
  );
  const pipeline = findPipelineChain(study.methodology);

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
      <Bullets items={study.resultNotes} />
    ) : (
      <p className="leading-relaxed text-text-secondary">
        No quantitative results reported.
      </p>
    )
  );
  if (study.baselines)
    add("Baseline comparison", <BaselineTable baselines={study.baselines} />);
  if (study.featureImportance)
    add("What predicts impairment", <FeatureGrid features={study.featureImportance} />);
  add("Outcome", <Bullets items={study.outcome} />);
  add("Tools & Technologies", <Chips items={study.tools} />);
  add("Challenges", <Bullets items={study.challenges} />);
  add("Future Improvements", <Bullets items={study.futureWork} />);

  return (
    <>
      {study.metrics && study.metrics.length > 0 && (
        <MetricPanel metrics={study.metrics} />
      )}

      {pipeline && (
        <div className="mt-6">
          <Pipeline label={pipeline.label} stages={pipeline.stages} />
        </div>
      )}

      {numbered.map((section, i) => (
        <Section
          key={section.title}
          eyebrow={`[ ${String(i + 1).padStart(2, "0")} ]`}
          title={section.title}
        >
          {section.body}
        </Section>
      ))}

      {related.length > 0 && (
        <Section
          eyebrow={`[ ${String(numbered.length + 1).padStart(2, "0")} ]`}
          title="Related work"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((paper) => (
              <StudyLink
                key={paper.slug}
                paper={paper}
                onOpen={onOpenStudy}
              />
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
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/90"
            >
              Request the thesis <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Section>
      )}
    </>
  );
}

function StudyLink({
  paper,
  onOpen,
}: {
  paper: ResearchStudy;
  onOpen?: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(paper.slug)}
      className="card-surface group flex h-full items-start justify-between gap-3 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div>
        <h3 className="card-title">{paper.title}</h3>
        <p className="mt-1 card-meta">{paper.field}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent-hover" />
    </button>
  );
}

export default function ResearchOverlay({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const [activeSlug, setActiveSlug] = useState(slug);
  const study = getResearch(activeSlug);

  if (!study) return null;

  return (
    <OverlayShell
      ariaLabel={`${study.shortTitle} · Research`}
      onClose={onClose}
    >
      <div className="mx-auto w-full max-w-4xl px-5 pb-8 pt-10 sm:px-8 sm:pt-12">
        <header>
          <div className="flex flex-wrap items-center gap-3 pr-12">
            {study.featured && (
              <span className="rounded-full border border-accent/30 bg-accent-dim px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent-hover">
                FEATURED THESIS
              </span>
            )}
            <span className="font-mono text-xs text-text-muted">
              {study.field}
            </span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight text-gradient sm:text-3xl">
            {study.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {study.oneLiner}
          </p>
          <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
            {study.summary}
          </p>

          {(study.github || study.live) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {study.live && (
                <a
                  href={study.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/90"
                >
                  Live App <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {study.github && (
                <a
                  href={study.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/50 hover:text-accent-hover"
                >
                  <GithubIcon className="h-4 w-4" /> Source code
                </a>
              )}
            </div>
          )}
        </header>

        <div className="mt-2">
          <StudyBody
            key={study.slug}
            study={study}
            onOpenStudy={setActiveSlug}
          />
        </div>
      </div>
    </OverlayShell>
  );
}
