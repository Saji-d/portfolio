import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ExperienceTimeline from "@/components/home/ExperienceTimeline";
import ProjectsSection from "@/components/home/ProjectsSection";
import SkillsSection from "@/components/home/SkillsSection";
import EducationSection from "@/components/home/EducationSection";
import ResearchSpotlight from "@/components/home/ResearchSpotlight";
import CortexSection from "@/components/home/cortex/CortexSection";
import ContactSection from "@/components/home/ContactSection";
import { OverlayProvider } from "@/components/overlay-context";

export default function Home() {
  return (
    <OverlayProvider>
      <Hero />
      <AboutSection />
      <ExperienceTimeline />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <ResearchSpotlight />
      <CortexSection />
      <ContactSection />
    </OverlayProvider>
  );
}
