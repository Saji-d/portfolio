import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import MagneticButton from "@/components/ui/MagneticButton";
import TerminalCard from "@/components/home/TerminalCard";
import Eyebrow from "@/components/ui/Eyebrow";
import HeroStats from "@/components/home/HeroStats";
import HeroMarquee from "@/components/home/HeroMarquee";

const delays = ["0s", "0.07s", "0.14s", "0.21s", "0.45s"];

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Home"
      className="relative scroll-mt-24 overflow-hidden pt-32 pb-10 sm:pt-40 sm:pb-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,209,197,0.14),transparent)]"
      />
      {/* Deliberate seam between the hero and the About chapter: the hero
          content fades into the page background instead of running straight
          into the next section's heading. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-bg sm:h-20"
      />
      <div className="container-site relative">
        <div>
          <div className="hero-enter" style={{ animationDelay: delays[0] }}>
            <Eyebrow>Software Engineer, Dhaka</Eyebrow>
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
            I enjoy building software and figuring things out along the way.
            Most of my work spans full-stack systems and AI/ML, with trips
            across the stack when a project calls for it.
          </p>

          <div
            className="hero-enter mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: delays[3] }}
          >
            <MagneticButton
              href="/projects"
              className="bg-accent px-6 py-3 text-sm font-medium text-[#0B0E14] hover:bg-accent/90"
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
          className="hero-enter mt-6 grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-center"
          style={{ animationDelay: delays[4] }}
        >
          <HeroStats />
          <TerminalCard />
        </div>

        <div className="hero-enter mt-10 sm:mt-12" style={{ animationDelay: delays[4] }}>
          <HeroMarquee />
        </div>

        <Image
          src="/images/hero.webp"
          alt="Portrait of Sajidur Rahman Sajid"
          width={2916}
          height={4376}
          priority
          quality={100}
          sizes="240px"
          className="hero-enter pointer-events-none absolute right-28 top-[-25px] block h-auto w-60 rounded-2xl"
          style={{ animationDelay: delays[4] }}
        />
      </div>
    </section>
  );
}