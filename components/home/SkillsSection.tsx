import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { skillGroups } from "@/data/skills";

export default function SkillsSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="05"
          eyebrow="Capabilities"
          title="Tools I reach for under pressure."
          lede="A backend-and-AI core, with the frontend and Web3 skills to ship end-to-end when it counts."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.04}>
              <div className="card-surface h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40">
                <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
                  {group.label}
                </h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
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
