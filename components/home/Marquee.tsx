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
      <Icon className="tech-marquee-icon h-4 w-4 shrink-0 opacity-90 transition-opacity group-hover/chip:opacity-100" />
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
    <div
      aria-hidden="true"
      className={`marquee-track flex w-max items-center ${
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
  );
}

// U-shaped endcap geometry on the left edge. The two lanes are 50px pills
// separated by a 10px gap, so the connecting arc swings a 30px radius from the
// top lane centerline (y=25) to the bottom lane centerline (y=85), bulging
// 30px past the lane end.
const ENDCAP_VIEWBOX = "0 0 32 110";
const ARC_LEFT = "M 32 25 A 30 30 0 0 1 32 85";

function Endcap() {
  return (
    <svg
      aria-hidden="true"
      viewBox={ENDCAP_VIEWBOX}
      className="pointer-events-none absolute top-0 left-0 h-full w-[32px] text-line"
      fill="none"
    >
      <path
        d={ARC_LEFT}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
    </svg>
  );
}
export default function TechMarquee() {
  const allLogos = [...row1, ...row2];
  return (
    <div className="group relative">
      <div className="relative">
        <div className="flex flex-col gap-2.5">
          <div className="relative overflow-hidden py-2.5">
            <Row logos={row1} duration="38s" />
          </div>
          <div className="relative overflow-hidden py-2.5">
            <Row logos={row2} reverse duration="46s" />
          </div>
        </div>
        <Endcap />
      </div>
      <ul className="sr-only">
        {allLogos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
    </div>
  );
}
