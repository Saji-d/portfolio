import { ArrowRight, ChevronDown, Download } from "lucide-react";
import Image from "next/image";
import MagneticButton from "@/components/ui/MagneticButton";
import TerminalCard from "@/components/home/TerminalCard";
import Eyebrow from "@/components/ui/Eyebrow";
import HeroStats from "@/components/home/HeroStats";
import HeroMarquee from "@/components/home/HeroMarquee";
// Imported (rather than referenced as a "/images/hero.webp" string) so
// Next.js fingerprints it by content hash at build time. Both the image
// optimizer cache and the browser's HTTP cache key off the URL — with a
// plain string path, replacing the file while keeping the same filename
// is invisible to either cache. A content-hashed import sidesteps that
// permanently: any future replacement gets a new URL automatically.
import heroPortrait from "@/public/images/hero.webp";

const delays = ["0s", "0.07s", "0.14s", "0.21s", "0.45s"];
const mobileDelays = [
  "0s",
  "0.06s",
  "0.12s",
  "0.18s",
  "0.24s",
  "0.3s",
  "0.36s",
  "0.42s",
];

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Home"
      className="relative scroll-mt-24 overflow-hidden pt-28 pb-8 sm:pt-32 sm:pb-10 lg:pt-40 lg:pb-14"
    >
      <div className="container-site relative">
        {/* Mobile / tablet: a compact, centered composition purpose-built for
            narrow viewports — eyebrow, portrait, name, positioning line,
            description, CTAs, credentials, scroll cue, in that order. This is
            not the desktop layout squeezed down; it's a separate hierarchy. */}
        <div className="lg:hidden">
          <div className="hero-enter" style={{ animationDelay: mobileDelays[0] }}>
            <Eyebrow className="text-center">AI Engineer &amp; Full-Stack Developer</Eyebrow>
          </div>

          <div
            className="hero-enter mx-auto mt-5 flex w-fit items-center justify-center"
            style={{ animationDelay: mobileDelays[1] }}
          >
            <Image
              src={heroPortrait}
              alt="Portrait of Sajidur Rahman Sajid"
              width={2916}
              height={4376}
              priority
              quality={90}
              sizes="180px"
              className="block h-auto w-36 sm:w-40"
            />
          </div>

          <h1
            className="hero-enter mt-5 text-center font-display text-[clamp(2.1rem,8.5vw,2.75rem)] font-medium leading-[1.08] tracking-tight text-neon"
            style={{ animationDelay: mobileDelays[2] }}
          >
            Sajidur Rahman Sajid
          </h1>

          <p
            className="hero-enter mt-2.5 text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary"
            style={{ animationDelay: mobileDelays[3] }}
          >
            Full-Stack · AI/ML · Product Engineering
          </p>

          <p
            className="hero-enter mx-auto mt-4 max-w-[32ch] text-center text-[15px] leading-relaxed text-text-secondary"
            style={{ animationDelay: mobileDelays[4] }}
          >
            I build full-stack software and production AI/ML systems, end to end.
          </p>

          <div
            className="hero-enter mx-auto mt-6 flex w-full max-w-[280px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
            style={{ animationDelay: mobileDelays[5] }}
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
            className="hero-enter mx-auto mt-9 max-w-[300px] sm:max-w-sm"
            style={{ animationDelay: mobileDelays[6] }}
          >
            <HeroStats />
          </div>

          <div
            className="hero-enter mt-8 flex flex-col items-center gap-1.5 text-text-muted"
            style={{ animationDelay: mobileDelays[7] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        {/* Desktop (lg+): the approved baseline composition, unchanged. */}
        <div className="hidden lg:block">
          <div>
            <div className="hero-enter" style={{ animationDelay: delays[0] }}>
              <Eyebrow>AI Engineer &amp; Full-Stack Developer</Eyebrow>
            </div>

            <h1
              className="hero-enter mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-neon sm:text-6xl lg:text-7xl"
              style={{ animationDelay: delays[1] }}
            >
              Sajidur Rahman Sajid
            </h1>

            <p
              className="hero-enter mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
              style={{ animationDelay: delays[2] }}
            >
              I build full-stack systems and production-ready AI/ML solutions,
              turning complex problems into reliable software for the real world.
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
          </div>

          <div
            className="hero-enter mt-16 grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-center"
            style={{ animationDelay: delays[4] }}
          >
            <HeroStats />
            <TerminalCard />
          </div>

          <div className="hero-enter mt-10 sm:mt-12 lg:mt-16" style={{ animationDelay: delays[4] }}>
            <HeroMarquee />
          </div>

          <Image
            src={heroPortrait}
            alt="Portrait of Sajidur Rahman Sajid"
            width={2916}
            height={4376}
            priority
            quality={100}
            sizes="240px"
            className="hero-enter pointer-events-none absolute right-28 top-[-17px] block h-auto w-60 rounded-2xl"
            style={{ animationDelay: delays[4] }}
          />
        </div>
      </div>
    </section>
  );
}
