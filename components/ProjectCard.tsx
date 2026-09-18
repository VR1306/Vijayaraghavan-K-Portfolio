import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative border border-line/15 border-t-0 px-6 py-7 transition-colors first:border-t hover:bg-surface-deep/40 sm:px-7.5">
      <span className="absolute -right-px -top-px border-b border-l border-line/15 px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted">
        {project.code}
      </span>

      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="text-[1.15rem] font-semibold transition-colors group-hover:text-accent-bright">
          {project.name}
        </h3>
        <span className="font-mono text-xs text-muted">{project.type}</span>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="border border-line/15 px-2.5 py-1 font-mono text-[11px] text-muted">
            {tech}
          </span>
        ))}
      </div>

      <ul className="mt-4 list-disc space-y-1.5 pl-4.5 text-[14.5px] text-ink-dim">
        {project.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      {project.links && project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 font-mono text-[12.5px]">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-line/15 pb-0.5 text-accent-bright transition-colors hover:border-accent"
            >
              {link.label} &rarr;
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
