import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { skillGroups } from "@/data/skills";

export default function SkillsSection() {
  return (
    <section
      id="capabilities"
      aria-label="Capabilities"
      className="relative scroll-mt-24 pb-16 pt-14 sm:pb-20 sm:pt-16"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="06">Capabilities</Eyebrow>
            <h2 className="mt-1 font-display text-lg font-medium tracking-tight text-text-secondary sm:text-xl">
              Tools I reach for under pressure.
            </h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.04}>
              <div className="card-surface h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
                  {group.label}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
