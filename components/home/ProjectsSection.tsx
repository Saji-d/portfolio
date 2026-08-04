import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="02"
          eyebrow="Projects"
          title="Systems that earn trust."
          lede="A curated collection of software engineering, AI, computer vision, graphics, database, and production systems I've built."
          actionLabel="View all projects"
          actionHref="/projects"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <ProjectCard
                project={p}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
