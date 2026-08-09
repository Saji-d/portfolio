import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import ResearchShowcase from "@/components/research/ResearchShowcase";

export default function ResearchSpotlight() {
  return (
    <section
      id="research"
      aria-label="Research"
      className="relative scroll-mt-24 pb-16 pt-14 sm:pb-20 sm:pt-16"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="03">Research</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
              Featured thesis
            </h2>
            <p className="mt-1 font-display text-lg font-medium tracking-tight text-text-secondary sm:text-xl">
              Where the models meet the messy real world.
            </p>
          </div>
        </Reveal>

        <div className="mt-8">
          <ResearchShowcase />
        </div>
      </div>
    </section>
  );
}
