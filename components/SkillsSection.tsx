import { SectionFrame } from "./SectionFrame";
import { skillModules } from "@/data/skills";

export function SkillsSection() {
  return (
    <section id="systems" className="scroll-mt-20 pt-14">
      <SectionFrame
        sheet="SHEET A-03"
        title="The stack I reach for, and the disciplines that keep it stable in production"
      />
      <div className="grid grid-cols-1 gap-px border border-line/15 bg-line/15 sm:grid-cols-2">
        {skillModules.map((mod) => (
          <div key={mod.title} className="bg-surface px-6 py-5.5">
            <h3 className="font-mono text-[12.5px] uppercase tracking-wide text-accent-bright">
              {mod.title}
            </h3>
            <p className="mt-3 text-[14.5px] text-ink-dim">{mod.items}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
