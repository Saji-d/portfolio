import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ResearchCard from "@/components/research/ResearchCard";
import { researchPapers } from "@/data/research";

export default function ResearchShowcase() {
  const featured = researchPapers.find((p) => p.slug === "neuronscreen");
  const rest = researchPapers.filter((p) => p.slug !== "neuronscreen");

  return (
    <>
      {featured && (
        <Reveal>
          <Link
            href={`/research/${featured.slug}`}
            className="card-surface group block overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">Featured thesis</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
                Read it{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            <h2 className="feature-title mt-3 max-w-3xl">
              {featured.title}
            </h2>
            <p className="mt-2.5 max-w-2xl body-copy text-text-secondary">
              {featured.summary}
            </p>
            {featured.metrics && (
              <div className="mt-4 flex flex-wrap gap-6">
                {featured.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl font-medium tracking-tight text-accent">
                      {m.value}
                    </div>
                    <div className="card-meta">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </Link>
        </Reveal>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rest.map((paper, i) => (
          <Reveal key={paper.slug} delay={(i % 2) * 0.05}>
            <ResearchCard paper={paper} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
