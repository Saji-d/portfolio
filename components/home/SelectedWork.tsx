import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getFeaturedProjects } from "@/data/projects";

export default function SelectedWork() {
  const featured = getFeaturedProjects();

  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="02"
          eyebrow="Featured Work"
          title="Systems that earn trust."
          lede="Eight featured projects across fintech, ML, NLP, computer vision, and full-stack — every one with open code, and the four most involved backed by full case studies."
          actionLabel="View all projects"
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
