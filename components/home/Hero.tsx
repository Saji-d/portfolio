import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import MagneticButton from "@/components/ui/MagneticButton";
import TerminalCard from "@/components/home/TerminalCard";
import Eyebrow from "@/components/ui/Eyebrow";
import Stat from "@/components/ui/Stat";
import { SITE } from "@/data/site";

const stats = [
  { value: "3.92", label: "CGPA / 4.00" },
  { value: "218", label: "tests written" },
  { value: "2,237", label: "thesis dataset" },
  { value: "5x", label: "Dean's Award" },
];

const delays = ["0s", "0.07s", "0.14s", "0.21s", "0.45s"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,209,197,0.14),transparent)]"
      />
      <div className="container-site relative">
        <div>
          <div className="hero-enter" style={{ animationDelay: delays[0] }}>
            <Eyebrow>Software Engineer — Dhaka</Eyebrow>
          </div>

          <h1
            className="hero-enter mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-gradient sm:text-6xl lg:text-7xl"
            style={{ animationDelay: delays[1] }}
          >
            Sajidur Rahman Sajid
          </h1>

          <p
            className="hero-enter mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
            style={{ animationDelay: delays[2] }}
          >
            {SITE.tagline}
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
          className="hero-enter mt-14 grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-center"
          style={{ animationDelay: delays[4] }}
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-1">
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
          <TerminalCard />
        </div>

        <Image
          src="/images/hero.png"
          alt="Portrait of Sajidur Rahman Sajid"
          width={1080}
          height={1339}
          priority
          sizes="240px"
          className="hero-enter pointer-events-none absolute right-28 top-0.5 hidden h-auto w-60 rounded-2xl xl:block"
          style={{ animationDelay: delays[4] }}
        />
      </div>
    </section>
  );
}
