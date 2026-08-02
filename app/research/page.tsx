import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ResearchCard from "@/components/research/ResearchCard";
import Reveal from "@/components/ui/Reveal";
import { researchPapers } from "@/data/research";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Thesis and research — NeuroScreen hybrid ensemble, FinBERT sentiment, water turbidity, and explainable Bangla toxicity detection.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  const featured = researchPapers.find((p) => p.slug === "neuronscreen");
  const rest = researchPapers.filter((p) => p.slug !== "neuronscreen");

  return (
    <>
      <PageHeader
        eyebrow="[ 02 ] — Research"
        title="Work that pushes a claim until it holds."
        lede="Every study uses a real dataset, a rigorous method, and honest numbers. The flagship is the thesis below."
      />

      <section className="container-site pb-28 pt-12">
        {featured && (
          <Reveal>
            <Link
              href="/research/neuronscreen"
              className="card-surface group block overflow-hidden p-8 transition-all duration-300 hover:border-accent/40 sm:p-10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="eyebrow">Featured thesis</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Read it <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <h2 className="mt-4 max-w-3xl font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
                {featured.summary}
              </p>
              {featured.metrics && (
                <div className="mt-6 flex flex-wrap gap-8">
                  {featured.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-display text-2xl font-medium tracking-tight text-accent">
                        {m.value}
                      </div>
                      <div className="font-mono text-xs text-text-muted">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          </Reveal>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {rest.map((paper, i) => (
            <Reveal key={paper.slug} delay={(i % 2) * 0.05}>
              <ResearchCard paper={paper} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
