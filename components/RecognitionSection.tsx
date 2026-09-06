"use client";

import { motion } from "framer-motion";
import { SectionFrame } from "./SectionFrame";
import { award, education } from "@/data/recognition";

export function RecognitionSection() {
  return (
    <section id="recognition" className="scroll-mt-20 pt-14">
      <SectionFrame sheet="SHEET A-06" title="Reviewed, approved" />

      <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[240px_1fr]">
        <motion.div
          initial={{ rotate: -8 }}
          whileHover={{ rotate: -4 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mx-auto flex h-[206px] w-[206px] items-center justify-center rounded-full border-2 border-dashed border-accent p-5 text-center font-mono text-accent-bright sm:mx-0"
        >
          <span>
            <span className="mb-2.5 block text-[10px] tracking-wide">APPROVED</span>
            <span className="block text-[12.5px] leading-relaxed text-ink">
              {award.title}
              <br />
              {award.company}
            </span>
            <span className="mt-2.5 block text-[10px] text-muted">
              {award.date.toUpperCase()}
            </span>
          </span>
        </motion.div>

        <div>
          <h3 className="text-[1.15rem] font-semibold">{award.title}</h3>
          <p className="mt-2 max-w-[52ch] text-[14.5px] text-ink-dim">{award.description}</p>

          <div className="mt-7.5 border-t border-line/15 pt-6.5">
            <h3 className="text-base font-semibold">{education.degree}</h3>
            <p className="mt-1 text-[13.5px] text-muted">{education.institution}</p>
            <p className="mt-2 text-[13.5px] text-ink-dim">Core focus: {education.focus}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
