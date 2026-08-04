"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ResearchCard from "@/components/research/ResearchCard";
import { neuronscreen, researchPapers } from "@/data/research";

export default function ResearchSpotlight() {
  const [showMore, setShowMore] = useState(false);
  const rest = researchPapers.filter((p) => p.slug !== "neuronscreen");

  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="03"
          eyebrow="Research"
          title="Featured thesis"
          lede="A hybrid ensemble trained on 2,237 student surveys detects cognitive impairment better than any single model."
        />

        <Reveal className="mt-12">
          <Link
            href={`/research/${neuronscreen.slug}`}
            className="card-surface group block overflow-hidden p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:p-10"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="eyebrow">Thesis · ML / Deep Learning</p>
                <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
                  NeuroScreen
                </h3>
                <p className="mt-4 leading-relaxed text-text-secondary">
                  {neuronscreen.oneLiner}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Read the case study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
                {(neuronscreen.metrics ?? []).map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl font-medium tracking-tight text-accent">
                      {m.value}
                    </div>
                    <div className="mt-1 font-mono text-xs text-text-muted">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </Reveal>

        <Reveal className="mt-8">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            {showMore ? "Show less research" : `Show more research (${rest.length} studies)`}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
            />
          </button>
        </Reveal>

        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            showMore ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="grid gap-5 pt-8 md:grid-cols-2">
              {rest.map((paper, i) => (
                <Reveal key={paper.slug} delay={(i % 2) * 0.05}>
                  <ResearchCard paper={paper} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
