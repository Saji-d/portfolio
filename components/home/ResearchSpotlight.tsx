"use client";

import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import ResearchShowcase from "@/components/research/ResearchShowcase";
import { useOverlay } from "@/components/overlay-context";

export default function ResearchSpotlight() {
  const { openResearch } = useOverlay();

  return (
    <section
      id="research"
      aria-label="Research"
      className="section-chapter relative overflow-hidden pb-10 sm:pb-12"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="04">Research</Eyebrow>
            <h2 className="section-title lg:text-[1.625rem]">
              Where the models meet the messy real world.
            </h2>
          </div>
        </Reveal>

        <div className="mt-5">
          <ResearchShowcase onOpenResearch={openResearch} />
        </div>
      </div>
    </section>
  );
}
