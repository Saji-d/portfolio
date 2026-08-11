import { techLogos, type TechLogo } from "@/components/ui/TechIcons";

const ROW_1_NAMES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  ".NET",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "NestJS",
  "Tailwind CSS",
  "HTML5",
  "CSS3",
];

const ROW_2_NAMES = [
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "PyTorch",
  "TensorFlow",
  "Scikit-learn",
  "Hugging Face",
  "OpenCV",
  "Docker",
  "Qdrant",
  "Neo4j",
  "Git",
  "Linux",
  "Vercel",
  "Cloudflare",
  "Solidity",
];

function byNames(names: string[]): TechLogo[] {
  const lookup = new Map(techLogos.map((logo) => [logo.name, logo]));
  return names.map((name) => lookup.get(name)).filter((logo): logo is TechLogo => Boolean(logo));
}

const row1 = byNames(ROW_1_NAMES);
const row2 = byNames(ROW_2_NAMES);

function Chip({ name, Icon }: TechLogo) {
  return (
    <div className="group/chip mr-2.5 flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 transition-colors duration-200 hover:border-accent/50 hover:bg-surface-2">
      <Icon className="h-4 w-4 shrink-0 opacity-90 transition-opacity group-hover/chip:opacity-100" />
      <span className="whitespace-nowrap font-mono text-xs text-text-secondary transition-colors group-hover/chip:text-text-primary">
        {name}
      </span>
    </div>
  );
}

function Row({
  logos,
  reverse,
  duration,
}: {
  logos: TechLogo[];
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-full border border-line bg-surface/30 py-2.5">
      <div
        aria-hidden="true"
        className={`marquee-track group flex w-max items-center ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: duration }}
      >
        <div className="flex w-max shrink-0 items-center">
          {logos.map((logo) => (
            <Chip key={`a-${logo.name}`} {...logo} />
          ))}
        </div>
        <div className="marquee-duplicate flex w-max shrink-0 items-center">
          {logos.map((logo) => (
            <Chip key={`b-${logo.name}`} {...logo} />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-bg to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-bg to-transparent sm:w-20" />
    </div>
  );
}

export default function TechMarquee() {
  const allLogos = [...row1, ...row2];
  return (
    <>
      <div className="space-y-2.5">
        <Row logos={row1} duration="38s" />
        <Row logos={row2} reverse duration="46s" />
      </div>
      <ul className="sr-only">
        {allLogos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
    </>
  );
}
