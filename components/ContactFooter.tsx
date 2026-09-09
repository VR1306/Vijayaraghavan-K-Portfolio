import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";

export function ContactFooter() {
  return (
    <footer id="contact" className="scroll-mt-20 px-7 pb-10 pt-[70px]">
      <div className="mx-auto max-w-[1040px]">
        <div className="flex flex-wrap items-end justify-between gap-7.5 border-t border-line/15 pt-9">
          <h2 className="max-w-[16ch] font-display text-2xl font-bold tracking-tight sm:text-4xl">
            Building something that needs to be fast, secure, and hard to break? Let&rsquo;s talk.
          </h2>
          <div className="flex flex-col items-start gap-2.5">
            <a
              href={`mailto:${site.email}`}
              className="border-b border-line/15 pb-0.5 font-mono text-sm text-ink-dim transition-colors hover:border-accent hover:text-accent-bright"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phoneHref}`}
              className="border-b border-line/15 pb-0.5 font-mono text-sm text-ink-dim transition-colors hover:border-accent hover:text-accent-bright"
            >
              {site.phone}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-line/15 pb-0.5 font-mono text-sm text-ink-dim transition-colors hover:border-accent hover:text-accent-bright"
            >
              {site.linkedinLabel}
            </a>
          </div>
        </div>

        <div className="mt-9">
          <ContactForm />
        </div>

        <div className="mt-12.5 flex flex-wrap justify-between gap-2.5 font-mono text-[11.5px] text-muted">
          <span>{site.name}. Chennai, India.</span>
          <span>Sheet A-01&ndash;A-06. Last revised 2026.</span>
        </div>
      </div>
    </footer>
  );
}
