import Image from "next/image";
import { Award, Calendar, MapPin, Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import TiltCard from "@/components/ui/TiltCard";

interface EducationEntry {
  institution: string;
  degree: string;
  gpa: string;
  gpaLabel: string;
  period: string;
  location?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  badges?: string[];
  featured?: boolean;
}

const education: EducationEntry[] = [
  {
    institution: "American International University-Bangladesh",
    degree: "Bachelor of Science in Computer Science and Engineering",
    gpa: "3.92",
    gpaLabel: "CGPA / 4.00",
    period: "Sep 2022 — Apr 2026",
    location: "Dhaka, Bangladesh",
    image: "/images/education/aiub-campus_v2.webp",
    imageAlt: "AIUB campus — the iconic dome building",
    imagePosition: "center center",
    badges: ["5× Dean's Award", "AIUB Merit Scholar", "Duke of Edinburgh Bronze"],
    featured: true,
  },
  {
    institution: "BAF Shaheen College Dhaka",
    degree: "Higher Secondary Certificate (HSC) · Science",
    gpa: "5.00",
    gpaLabel: "GPA / 5.00",
    period: "Jun 2019 — Dec 2021",
    location: "Dhaka, Bangladesh",
    image: "/images/education/baf-shaheen.webp",
    imageAlt: "BAF Shaheen College Dhaka logo",
  },
  {
    institution: "Kurmitola High School & College",
    degree: "Secondary School Certificate (SSC) · Science",
    gpa: "5.00",
    gpaLabel: "GPA / 5.00",
    period: "Jan 2017 — Feb 2019",
    location: "Dhaka, Bangladesh",
    image: "/images/education/kurmitola.webp",
    imageAlt: "Kurmitola High School & College logo",
  },
];

function FeaturedCard({ entry }: { entry: EducationEntry }) {
  return (
    <TiltCard className="h-full">
      <article className="card-surface group relative flex h-full flex-col overflow-hidden border-accent/30 shadow-[0_0_0_1px_rgba(79,209,197,0.12),0_20px_60px_-24px_rgba(79,209,197,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_0_1px_rgba(79,209,197,0.25),0_32px_80px_-28px_rgba(79,209,197,0.38)]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-accent via-accent-2 to-transparent"
        />

        <div className="relative aspect-[16/4] overflow-hidden bg-surface-2 sm:aspect-[16/2.25]">
          <Image
            src={entry.image}
            alt={entry.imageAlt}
            fill
            sizes="(min-width: 640px) 76rem, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ objectPosition: entry.imagePosition ?? "center center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/30 to-[#0B0E14]/10" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-[#0B0E14]/70 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider text-accent backdrop-blur-md">
            <Star className="h-3 w-3 fill-current" />
            Highest qualification
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-xl">
              <h3 className="font-display text-xl font-medium tracking-tight text-gradient sm:text-2xl">
                {entry.institution}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-accent">
                {entry.degree}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-medium tracking-tight text-accent">
                {entry.gpa}
              </div>
              <div className="mt-0.5 font-mono text-xs text-text-muted">
                {entry.gpaLabel}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {entry.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {entry.period}
            </span>
          </div>

          <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-2">
            {(entry.badges ?? []).map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-dim px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent"
              >
                <Award className="h-3 w-3" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

function SchoolCard({ entry }: { entry: EducationEntry }) {
  return (
    <TiltCard className="h-full">
      <article className="card-surface group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_60px_-24px_rgba(79,209,197,0.22)]">
        <div className="relative h-20 w-full overflow-hidden bg-surface-2">
          <Image
            src={entry.image}
            alt={entry.imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-3 opacity-90 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="font-display text-lg font-medium tracking-tight text-text-primary">
            {entry.institution}
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            {entry.degree}
          </p>
          <p className="mt-0.5 font-mono text-xs text-text-muted">
            {entry.period}
          </p>

          <div className="mt-auto flex items-end justify-between border-t border-line pt-1.5">
            <div>
              <div className="font-display text-xl font-medium tracking-tight text-accent">
                {entry.gpa}
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-text-muted">
                {entry.gpaLabel}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted">
              <MapPin className="h-3.5 w-3.5" />
              Dhaka
            </span>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default function EducationSection() {
  const featured = education.find((e) => e.featured);
  const schools = education.filter((e) => !e.featured);

  return (
    <section
      id="education"
      aria-label="Education"
      className="relative scroll-mt-24 pb-8 pt-8 sm:pb-9 sm:pt-10"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="05">Education</Eyebrow>
            <h2 className="mt-1 font-display text-lg font-medium tracking-tight text-text-secondary sm:text-xl">
              Built the fundamentals, then taught the code what to do with them.
            </h2>
          </div>
        </Reveal>

        <div className="mt-2.5 space-y-3">
          {featured && (
            <Reveal>
              <FeaturedCard entry={featured} />
            </Reveal>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {schools.map((entry, i) => (
              <Reveal key={entry.institution} delay={i * 0.06}>
                <SchoolCard entry={entry} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
