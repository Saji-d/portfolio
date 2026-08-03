import { skillGroups } from "@/data/skills";

const skills = [...new Set(skillGroups.flatMap((g) => g.skills))];

function Pill({ skill }: { skill: string }) {
  return (
    <span className="rounded-full border border-line bg-surface-2 px-4 py-1.5 font-mono text-xs text-text-secondary">
      {skill}
    </span>
  );
}

function Separator() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />;
}

function Segment({ hidden }: { hidden?: boolean }) {
  return (
    <div className={`marquee-segment flex items-center gap-3 ${hidden ? "marquee-segment-duplicate" : ""}`}>
      {skills.map((skill) => (
        <div key={skill} className="flex items-center gap-3">
          <Pill skill={skill} />
          <Separator />
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Technologies" className="relative overflow-hidden border-y border-line bg-surface/40 py-6">
      <div
        aria-hidden="true"
        className="marquee-track group flex w-max items-center gap-3 group-hover:[animation-play-state:paused]"
      >
        <Segment />
        <Segment hidden />
      </div>
      <ul className="sr-only">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </section>
  );
}
