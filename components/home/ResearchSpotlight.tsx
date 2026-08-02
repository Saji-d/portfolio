import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { neuronscreen } from "@/data/research";

export default function ResearchSpotlight() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="04"
          eyebrow="Research"
          title="Featured thesis"
          lede="A hybrid ensemble trained on 2,237 student surveys detects cognitive impairment better than any single model."
        />

        <Reveal className="mt-12">
          <Link
            href="/research/neuronscreen"
            className="card-surface group block overflow-hidden p-8 transition-all duration-300 hover:border-accent/40 sm:p-10"
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
                {neuronscreen.metrics.map((m) => (
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
      </div>
    </section>
  );
}
