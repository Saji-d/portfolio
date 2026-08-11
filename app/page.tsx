import Hero from "@/components/home/Hero";
import CortexSection from "@/components/home/cortex/CortexSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ResearchSpotlight from "@/components/home/ResearchSpotlight";
import ExperienceTimeline from "@/components/home/ExperienceTimeline";
import EducationSection from "@/components/home/EducationSection";
import ContactSection from "@/components/home/ContactSection";
import SkillsSection from "@/components/home/SkillsSection";
import { OverlayProvider } from "@/components/overlay-context";

export default function Home() {
  return (
    <OverlayProvider>
      <Hero />
      <CortexSection />
      <ProjectsSection />
      <ResearchSpotlight />
      <ExperienceTimeline />
      <EducationSection />
      <SkillsSection />
      <ContactSection />
    </OverlayProvider>
  );
}
