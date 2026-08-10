import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import ResearchShowcase from "@/components/research/ResearchShowcase";

export default function ResearchSpotlight() {
  return (
    <section
      id="research"
      aria-label="Research"
      className="relative scroll-mt-24 pb-10 pt-10 sm:pb-12 sm:pt-12"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="03">Research</Eyebrow>
            <h2 className="section-title">
              Where the models meet the messy real world.
            </h2>
          </div>
        </Reveal>

        <div className="mt-5">
          <ResearchShowcase />
        </div>
      </div>
    </section>
  );
}
