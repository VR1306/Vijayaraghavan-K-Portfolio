import { site } from "./site";
import { skillModules } from "./skills";
import { projects } from "./projects";
import { stats } from "./experience";
import { award, education } from "./recognition";

export interface ChatTopic {
  id: string;
  keywords: string[];
  /** Shown as a suggestion chip when present; omit for topics only reachable by typing. */
  suggestion?: string;
  answer: () => string;
}

function findModule(title: string): string {
  return skillModules.find((m) => m.title === title)?.items ?? "";
}

function formatStat(s: (typeof stats)[number]): string {
  return `${s.prefix ?? ""}${s.value}${s.suffix ?? ""} ${s.label}`;
}

export const chatTopics: ChatTopic[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "sup"],
    answer: () =>
      `Hi! I'm a simple rule-based FAQ bot \u2014 no AI behind me, just answers pulled straight from ${site.name}'s résumé data. Try asking about skills, experience, projects, availability, or how to get in touch.`,
  },
  {
    id: "skills",
    keywords: ["skill", "tech", "stack", "technologies", "react", "typescript", "javascript", "frontend"],
    suggestion: "What's your tech stack?",
    answer: () =>
      `Core stack: ${findModule("Languages & Frameworks")} On top of that: ${findModule(
        "State & Data"
      )} Two specialties stand out \u2014 performance engineering (${findModule(
        "Performance Engineering"
      )}) and security architecture (${findModule("Security Architecture")})`,
  },
  {
    id: "experience",
    keywords: ["experience", "job", "work", "doodleblue", "years", "role", "career"],
    suggestion: "Tell me about your experience",
    answer: () =>
      `${site.name} has been a ${site.role} at doodleblue Innovations, Chennai, since March 2022. A few numbers from that time: ${stats
        .map(formatStat)
        .join("; ")}.`,
  },
  {
    id: "projects",
    keywords: ["project", "built", "shipped", "portfolio project"],
    suggestion: "What projects have you built?",
    answer: () =>
      `Shipped work includes: ${projects
        .map((p) => `${p.name} (${p.type})`)
        .join("; ")}. Ask about one by name \u2014 e.g. "tell me about Animeta AI" \u2014 for more detail.`,
  },
  ...projects.map((p) => ({
    id: `project-${p.code}`,
    keywords: [
      p.name.toLowerCase(),
      ...p.name
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => /^[a-z0-9]+$/.test(w)),
    ],
    answer: () => `${p.name} \u2014 ${p.type}. Built with ${p.stack.join(", ")}. ${p.points.join(" ")}`,
  })),
  {
    id: "security",
    keywords: ["security", "zero trust", "zero-trust", "auth", "token"],
    answer: () => `On security: ${findModule("Security Architecture")}`,
  },
  {
    id: "performance",
    keywords: ["performance", "speed", "core web vitals", "lighthouse", "optimize", "optimise", "optimization"],
    answer: () => `On performance: ${findModule("Performance Engineering")}`,
  },
  {
    id: "availability",
    keywords: ["available", "hiring", "hire", "opportunity", "looking for", "open to"],
    suggestion: "Are you open to new roles?",
    answer: () =>
      `${site.status}, based in ${site.location}. The contact form at the bottom of this page or a direct email both work well.`,
  },
  {
    id: "contact",
    keywords: ["contact", "email", "phone", "number", "reach", "get in touch", "linkedin"],
    suggestion: "How can I contact you?",
    answer: () =>
      `You can reach ${site.name} at ${site.email}, by phone at ${site.phone}, or on LinkedIn (${site.linkedinLabel}). There's also a quick contact form at the bottom of this page.`,
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download"],
    answer: () => `There's a "Download r\u00e9sum\u00e9" button in the hero section at the top of this page.`,
  },
  {
    id: "award",
    keywords: ["award", "recognition", "rockstar", "achievement"],
    answer: () => `${award.title} at ${award.company}, ${award.date}. ${award.description}`,
  },
  {
    id: "education",
    keywords: ["education", "degree", "college", "university", "study", "studied"],
    answer: () => `${education.degree} from ${education.institution}. Focus: ${education.focus}`,
  },
  {
    id: "location",
    keywords: ["location", "based", "where", "city", "country"],
    answer: () => `${site.name} is based in ${site.location}.`,
  },
];

export const FALLBACK_ANSWER =
  "I don't have a canned answer for that one \u2014 I'm just a simple rule-based bot, not real AI. Try one of the suggestions above, or use the contact form below to ask directly.";
