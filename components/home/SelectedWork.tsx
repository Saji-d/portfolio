import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projects } from "@/data/projects";

export default function SelectedWork() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="02"
          eyebrow="Selected Work"
          title="Systems that earn trust."
          lede="The flagship trio — an audited fintech pipeline, a deployed full-stack platform, and an AI legal-intelligence MVP."
          actionLabel="All projects"
          actionHref="/work"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
