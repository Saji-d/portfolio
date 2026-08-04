import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ProjectsSection from "@/components/home/ProjectsSection";
import ResearchSpotlight from "@/components/home/ResearchSpotlight";
import ExperienceTimeline from "@/components/home/ExperienceTimeline";
import SkillsSection from "@/components/home/SkillsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <ProjectsSection />
      <ResearchSpotlight />
      <ExperienceTimeline />
      <SkillsSection />
      <CTASection />
    </>
  );
}
