import Reveal from "@/components/ui/Reveal";
import { timeline } from "@/data/timeline";

const typeLabel: Record<string, string> = {
  career: "Career",
  education: "Education",
  honor: "Honor",
  leadership: "Leadership",
};

export default function FullTimeline() {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[7px] top-0 w-px bg-line" />
      <div className="space-y-10">
        {timeline.map((entry, i) => (
          <Reveal key={entry.title + entry.period} delay={i * 0.03}>
            <div className="relative pl-10">
              <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border border-accent bg-bg" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  {typeLabel[entry.type]}
                </span>
                {entry.current && (
                  <span className="rounded-full border border-accent/30 bg-accent-dim px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent">
                    CURRENT
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-display text-lg font-medium tracking-tight text-text-primary">
                {entry.title}
              </h3>
              <p className="mt-0.5 font-mono text-xs text-text-muted">
                {entry.org}
                {entry.location ? ` · ${entry.location}` : ""} · {entry.period}
              </p>
              <ul className="mt-3 space-y-1.5">
                {entry.points.map((p) => (
                  <li
                    key={p}
                    className="flex gap-2 text-sm leading-relaxed text-text-secondary"
                  >
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
