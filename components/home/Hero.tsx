import { ArrowRight, Download } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Eyebrow from "@/components/ui/Eyebrow";
import HeroStats from "@/components/home/HeroStats";
import HeroPortrait from "@/components/home/HeroPortrait";
import HeroMarquee from "@/components/home/HeroMarquee";
// Imported (rather than referenced as a "/images/hero.webp" string) so
// Next.js fingerprints it by content hash at build time. Both the image
// optimizer cache and the browser's HTTP cache key off the URL - with a
// plain string path, replacing the file while keeping the same filename
// is invisible to either cache. A content-hashed import sidesteps that
// permanently: any future replacement gets a new URL automatically.
import heroPortrait from "@/public/images/herooo.webp";

// [eyebrow/name, description, ctas, stats, portrait]
const delays = ["0s", "0.1s", "0.2s", "0.3s", "0.36s"];
// [portrait, eyebrow/name, description, ctas, stats]
const mobileDelays = ["0s", "0.08s", "0.18s", "0.28s", "0.36s"];

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Home"
      className="relative flex min-h-screen min-h-dvh scroll-mt-24 flex-col justify-center overflow-hidden pt-[calc(var(--nav-offset)_+_1.5rem)] pb-10 sm:pb-14"
    >
      <div className="container-site relative">
        {/* Mobile / tablet: a compact, centered composition purpose-built for
            narrow viewports - portrait, eyebrow/name, description, CTAs,
            credentials, technology strip, in that order. This is not the
            desktop layout squeezed down; it's a separate hierarchy. */}
        <div className="lg:hidden">
          <div
            className="hero-enter mx-auto flex w-fit items-center justify-center"
            style={{ animationDelay: mobileDelays[0] }}
          >
            <HeroPortrait src={heroPortrait} className="w-36 sm:w-40" />
          </div>

          <div
            className="hero-enter mt-6 text-center"
            style={{ animationDelay: mobileDelays[1] }}
          >
            <Eyebrow className="text-center">AI Engineer &amp; Full-Stack Developer</Eyebrow>
            <h1 className="mt-2 bg-linear-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text font-display text-[1.9rem] font-semibold leading-[1.15] tracking-tight text-transparent sm:text-[2.2rem]">
              Sajidur Rahman <span>Sajid</span>
            </h1>
          </div>

          <p
            className="hero-enter mx-auto mt-4 max-w-[34ch] text-center text-[15px] leading-relaxed text-text-secondary"
            style={{ animationDelay: mobileDelays[2] }}
          >
            I build full-stack systems and production-ready AI/ML solutions,
            turning complex problems into reliable software for the real
            world.
          </p>

          <div
            className="hero-enter mx-auto mt-7 flex w-full max-w-[280px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
            style={{ animationDelay: mobileDelays[3] }}
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
            className="hero-enter mx-auto mt-9 flex justify-center"
            style={{ animationDelay: mobileDelays[4] }}
          >
            <HeroStats />
          </div>

          <div className="hero-enter mt-10" style={{ animationDelay: mobileDelays[4] }}>
            <HeroMarquee />
          </div>
        </div>

        {/* Desktop (lg+): an editorial split - eyebrow/name/copy and portrait
            each own half of the row, so the two halves read as one
            composition instead of a text block with a photo stranded off
            to the side. items-start (not items-center) keeps the portrait
            pinned to the top of the row regardless of how tall the left
            column grows with the metrics appended. */}
        <div className="hidden lg:block">
          <div className="grid items-start gap-10 lg:grid-cols-2 xl:gap-14">
            <div className="max-w-xl">
              <div className="hero-enter" style={{ animationDelay: delays[0] }}>
                <Eyebrow>AI Engineer &amp; Full-Stack Developer</Eyebrow>
                <h1 className="mt-3 bg-linear-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-transparent sm:text-[3rem] lg:text-[3.25rem]">
                  Sajidur Rahman <span>Sajid</span>
                </h1>
              </div>

              <p
                className="hero-enter mt-6 -mr-3 max-w-md text-base leading-relaxed text-text-secondary sm:max-w-[36rem] sm:text-lg"
                style={{ animationDelay: delays[1] }}
              >
                I build full-stack systems and production-ready AI/ML
                solutions, turning complex problems into reliable software
                for the real world.
              </p>

              <div
                className="hero-enter mt-8 flex flex-wrap items-center gap-3"
                style={{ animationDelay: delays[2] }}
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
                style={{ animationDelay: delays[3] }}
              >
                <HeroStats />
              </div>
            </div>

            <HeroPortrait
              src={heroPortrait}
              className="hero-enter w-[350px] justify-self-end"
              style={{ animationDelay: delays[4] }}
            />
          </div>

          <div className="hero-enter mt-20 xl:mt-24" style={{ animationDelay: delays[4] }}>
            <HeroMarquee />
          </div>
        </div>
      </div>
    </section>
  );
}
