import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import SelectedWork from "@/components/home/SelectedWork";
import CurrentlySection from "@/components/home/CurrentlySection";
import ResearchSpotlight from "@/components/home/ResearchSpotlight";
import ExperienceTimeline from "@/components/home/ExperienceTimeline";
import SkillsSection from "@/components/home/SkillsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <SelectedWork />
      <CurrentlySection />
      <ResearchSpotlight />
      <ExperienceTimeline />
      <SkillsSection />
      <CTASection />
    </>
  );
}
