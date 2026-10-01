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
          <div key={mod.title} className="bg-surface px-4.5 py-4 sm:px-6 sm:py-5.5">
            <h3 className="font-mono text-xs sm:text-[12.5px] uppercase tracking-wide text-accent-bright">
              {mod.title}
            </h3>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-[14.5px] text-ink-dim leading-relaxed">{mod.items}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
