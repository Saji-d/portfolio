import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import {
  ProjectCard,
  ProjectSpotlightCard,
} from "@/components/work/ProjectCard";
import { getFeaturedProjects } from "@/data/projects";

export default function SelectedWork() {
  const featured = getFeaturedProjects();
  const spotlight = featured.find((p) => p.slug === "ledgerturf") ?? featured[0];
  const rest = featured.filter((p) => p.slug !== spotlight.slug);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="02"
          eyebrow="Projects"
          title="Systems that earn trust."
          lede="Ten selected projects across fintech, ML, NLP, computer vision, and full-stack — every one with open code, and the most involved backed by full case studies."
          actionLabel="View all projects"
          actionHref="/projects"
        />

        <Reveal className="mt-12">
          <ProjectSpotlightCard project={spotlight} />
        </Reveal>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
