import { ArrowRight, ChevronDown, Download } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Eyebrow from "@/components/ui/Eyebrow";
import HeroStats from "@/components/home/HeroStats";
import HeroPortrait from "@/components/home/HeroPortrait";
// Imported (rather than referenced as a "/images/hero.webp" string) so
// Next.js fingerprints it by content hash at build time. Both the image
// optimizer cache and the browser's HTTP cache key off the URL - with a
// plain string path, replacing the file while keeping the same filename
// is invisible to either cache. A content-hashed import sidesteps that
// permanently: any future replacement gets a new URL automatically.
import heroPortrait from "@/public/images/herooo.webp";

// [eyebrow, headline, description, ctas, portrait, stats]
const delays = ["0s", "0.08s", "0.18s", "0.28s", "0.36s", "0.5s"];
const mobileDelays = [
  "0s",
  "0.07s",
  "0.16s",
  "0.26s",
  "0.36s",
  "0.46s",
  "0.56s",
];

const accentSplit =
  "bg-gradient-to-r from-accent to-accent-3 bg-clip-text text-transparent";

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Home"
      className="relative flex min-h-screen min-h-dvh scroll-mt-24 flex-col justify-center overflow-hidden pt-[calc(var(--nav-offset)_+_1.5rem)] pb-10 sm:pb-14"
    >
      <div className="container-site relative">
        {/* Mobile / tablet: a compact, centered composition purpose-built for
            narrow viewports - eyebrow, portrait, headline, description,
            CTAs, credentials, scroll cue, in that order. This is not the
            desktop layout squeezed down; it's a separate hierarchy. */}
        <div className="lg:hidden">
          <div className="hero-enter" style={{ animationDelay: mobileDelays[0] }}>
            <Eyebrow className="text-center">
              Software Engineer · AI/ML · Dhaka, Bangladesh
            </Eyebrow>
          </div>

          <div
            className="hero-enter mx-auto mt-6 flex w-fit items-center justify-center"
            style={{ animationDelay: mobileDelays[1] }}
          >
            <HeroPortrait src={heroPortrait} className="w-32 sm:w-36" />
          </div>

          <h1
            className="hero-enter mt-6 text-center font-display text-[2rem] font-semibold leading-[1.1] tracking-tight text-text-primary"
            style={{ animationDelay: mobileDelays[2] }}
          >
            Full-stack systems.
            <br />
            <span className={accentSplit}>Production-grade AI.</span>
          </h1>

          <p
            className="hero-enter mx-auto mt-4 max-w-[34ch] text-center text-[15px] leading-relaxed text-text-secondary"
            style={{ animationDelay: mobileDelays[3] }}
          >
            I build full-stack products and applied AI systems that turn
            complex problems into reliable software.
          </p>

          <div
            className="hero-enter mx-auto mt-7 flex w-full max-w-[280px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
            style={{ animationDelay: mobileDelays[4] }}
          >
            <MagneticButton
              href="/projects"
              className="w-full justify-center bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink hover:bg-accent/90 sm:w-auto"
            >
              View projects <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href="/Sajidur_Rahman_Sajid.pdf"
              external
              className="w-full justify-center border border-line bg-surface px-6 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-accent/50 sm:w-auto"
            >
              <Download className="h-4 w-4" /> Download CV
            </MagneticButton>
          </div>

          <div
            className="hero-enter mx-auto mt-10 flex justify-center"
            style={{ animationDelay: mobileDelays[5] }}
          >
            <HeroStats />
          </div>

          <div
            className="hero-enter mt-9 flex flex-col items-center gap-1.5 text-text-muted"
            style={{ animationDelay: mobileDelays[6] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        {/* Desktop (lg+): an editorial split rather than an absolute overlay
            - headline/copy and portrait each own half of the row (equal
            grid columns, not an auto-sized image floating in the leftover
            space), so the two halves read as one composition instead of a
            text block with a photo stranded off to the side. The metrics
            close out the left column itself (not a full-width strip below
            both columns), so they stay inside the text column's width and
            never reach toward the portrait. items-start (not items-center)
            keeps the portrait pinned to the top of the row regardless of
            how tall the left column grows with the metrics appended. */}
        <div className="hidden lg:block">
          <div className="grid items-start gap-10 lg:grid-cols-2 xl:gap-14">
            <div className="max-w-xl">
              <div className="hero-enter" style={{ animationDelay: delays[0] }}>
                <Eyebrow>Software Engineer · AI/ML · Dhaka, Bangladesh</Eyebrow>
              </div>

              <h1
                className="hero-enter mt-6 font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-text-primary sm:text-[3rem] lg:text-[3.25rem]"
                style={{ animationDelay: delays[1] }}
              >
                Full-stack systems.
                <br />
                <span className={accentSplit}>Production-grade AI.</span>
              </h1>

              <p
                className="hero-enter mt-6 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg"
                style={{ animationDelay: delays[2] }}
              >
                I build full-stack products and applied AI systems that turn
                complex problems into reliable software.
              </p>

              <div
                className="hero-enter mt-8 flex flex-wrap items-center gap-3"
                style={{ animationDelay: delays[3] }}
              >
                <MagneticButton
                  href="/projects"
                  className="bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:bg-accent/90"
                >
                  View projects <ArrowRight className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton
                  href="/Sajidur_Rahman_Sajid.pdf"
                  external
                  className="border border-line bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent/50"
                >
                  <Download className="h-4 w-4" /> Download CV
                </MagneticButton>
              </div>

              <div
                className="hero-enter mt-10 xl:mt-12"
                style={{ animationDelay: delays[5] }}
              >
                <HeroStats />
              </div>
            </div>

            <HeroPortrait
              src={heroPortrait}
              className="hero-enter mt-6 w-60 justify-self-end xl:mt-10 xl:w-64"
              style={{ animationDelay: delays[4] }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
