import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LiveReadout } from "@/components/LiveReadout";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { TimelineSection } from "@/components/TimelineSection";
import { RecognitionSection } from "@/components/RecognitionSection";
import { ContactFooter } from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <Header />
      <div id="top" />
      <Hero />
      <main className="mx-auto max-w-[1040px] px-7">
        <LiveReadout />
        <SkillsSection />
        <ProjectsSection />
        <TimelineSection />
        <RecognitionSection />
      </main>
      <ContactFooter />
    </>
  );
}
