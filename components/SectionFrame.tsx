import { ReactNode } from "react";

interface SectionFrameProps {
  sheet: string;
  title: string;
  children?: ReactNode;
}

export function SectionFrame({ sheet, title, children }: SectionFrameProps) {
  return (
    <div className="relative mb-1 border-l border-line/15 py-7.5 pl-5.5">
      <span className="absolute -left-px top-0 bg-accent px-2.5 py-1 font-mono text-[11px] tracking-wide text-on-accent">
        {sheet}
      </span>
      <h2 className="max-w-[34ch] font-display text-[1.5rem] font-bold tracking-tight sm:text-[1.9rem]">{title}</h2>
      {children}
    </div>
  );
}
