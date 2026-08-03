import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import { SITE } from "@/data/site";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <Reveal>
          <div className="card-surface relative overflow-hidden p-10 text-center sm:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,209,197,0.14),transparent)]"
            />
            <p className="eyebrow">[ 07 ] — Let&apos;s talk</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-gradient sm:text-4xl">
              Let&apos;s build something trustworthy.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-secondary">
              Backend pipelines, ML products, or an audit-ready system — I&apos;m
              currently open to engineering work and collaborations.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                href="/contact"
                className="bg-accent px-6 py-3 text-sm font-medium text-[#0B0E14] hover:bg-accent/90"
              >
                Start a conversation <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton
                href={`mailto:${SITE.email}`}
                className="border border-line bg-surface px-6 py-3 font-mono text-sm text-text-primary transition-colors hover:border-accent/50"
              >
                {SITE.email}
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
