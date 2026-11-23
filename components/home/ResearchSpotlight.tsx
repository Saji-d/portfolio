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
      className="section-chapter relative overflow-hidden"
    >
      <div className="container-site">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="06">Research</Eyebrow>
            <h2 className="section-title lg:text-[1.625rem]">
              Research that starts with data and ends in a working tool.
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
