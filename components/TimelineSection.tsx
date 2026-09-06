import { SectionFrame } from "./SectionFrame";
import { MetricCounter } from "./MetricCounter";
import { Highlight } from "./Highlight";
import { stats, experienceBullets } from "@/data/experience";

export function TimelineSection() {
  return (
    <section id="record" className="scroll-mt-20 pt-14">
      <SectionFrame sheet="SHEET A-05" title="Where the work happened" />

      <div className="mb-10 grid grid-cols-2 gap-px bg-line/15 border border-line/15 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface">
            <MetricCounter {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[32px_1fr] gap-6 sm:grid-cols-[88px_1fr]">
        <div className="relative border-l border-line">
          <span className="absolute -left-1 top-0 h-px w-2 bg-line" />
          <span className="absolute -left-1 bottom-0 h-px w-2 bg-line" />
          <span className="absolute left-2.5 top-1/2 hidden -translate-y-1/2 rotate-180 whitespace-nowrap font-mono text-[11px] text-muted sm:block [writing-mode:vertical-rl]">
            MAR 2022&ndash;PRESENT
          </span>
        </div>

        <div>
          <h3 className="text-[1.15rem] font-semibold">Senior Frontend Software Engineer</h3>
          <p className="mb-4.5 mt-0.5 font-mono text-[13px] text-accent-bright">
            doodleblue Innovations, Chennai
          </p>
          <ul className="list-disc space-y-2.5 pl-4.5 text-[14.5px] text-ink-dim">
            {experienceBullets.map((bullet) => (
              <li key={bullet}>
                <Highlight text={bullet} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
