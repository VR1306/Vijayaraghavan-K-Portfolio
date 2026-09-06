import { SectionFrame } from "./SectionFrame";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section id="built" className="scroll-mt-20 pt-14">
      <SectionFrame sheet="SHEET A-04" title="Structures I've shipped" />
      <div>
        {projects.map((project) => (
          <ProjectCard key={project.code} project={project} />
        ))}
      </div>
    </section>
  );
}
