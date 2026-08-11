import type { CSSProperties } from "react";
import { techLogos, type TechLogo } from "@/components/ui/TechIcons";

const ICON_NAMES = [
  "TypeScript",
  "Python",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "FastAPI",
  "NestJS",
  "Express",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "SQLAlchemy",
  "Docker",
  "PyTorch",
  "TensorFlow",
  "Scikit-learn",
  "Hugging Face",
  "Pandas",
  "NumPy",
  "OpenCV",
  "Tailwind CSS",
  "Qdrant",
  "Neo4j",
  "Git",
  "Linux",
  "Vercel",
];

function byNames(names: string[]): TechLogo[] {
  const lookup = new Map(techLogos.map((logo) => [logo.name, logo]));
  return names.map((name) => lookup.get(name)).filter((logo): logo is TechLogo => Boolean(logo));
}

const logos = byNames(ICON_NAMES);

function IconItem({ Icon, color }: TechLogo) {
  return (
    <span
      className="tech-marquee-icon mx-4 flex shrink-0 items-center justify-center opacity-70 transition-all duration-300 group-hover:opacity-90 hover:!opacity-100 sm:mx-6"
      style={{ "--icon-color": color } as CSSProperties}
    >
      <Icon className="h-6 w-6 drop-shadow-[0_0_0_rgba(0,0,0,0)] transition-[filter,transform] duration-300 hover:drop-shadow-[0_0_10px_var(--icon-color)] hover:scale-105 sm:h-7 sm:w-7" />
    </span>
  );
}

export default function HeroMarquee() {
  return (
    <div className="relative" aria-label="Technologies I work with">
      <div className="group relative overflow-hidden">
        <div
          aria-hidden="true"
          className="marquee-track animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "46s" }}
        >
          <div className="flex w-max shrink-0 items-center">
            {logos.map((logo) => (
              <IconItem key={`a-${logo.name}`} {...logo} />
            ))}
          </div>
          <div className="marquee-duplicate flex w-max shrink-0 items-center">
            {logos.map((logo) => (
              <IconItem key={`b-${logo.name}`} {...logo} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent sm:w-24" />
      </div>
      <ul className="sr-only">
        {logos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
    </div>
  );
}
