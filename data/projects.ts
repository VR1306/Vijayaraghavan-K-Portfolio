export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  code: string;
  name: string;
  type: string;
  stack: string[];
  points: string[];
  /** Public links relevant to this client project — live product, docs, etc. No repos, since these are client-owned codebases. */
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    code: "PRJ-01",
    name: "Yatra Prime",
    type: "Premium travel subscription platform",
    stack: ["React.js", "Redux Toolkit", "Axios", "Sass"],
    points: [
      "Built a scalable dashboard layout from modular, reusable UI components, so new features slot in without re-architecting the page.",
      "Designed Redux Toolkit slices to manage deeply nested subscription data, and rebuilt the checkout flow to remove the friction that was costing conversions.",
    ],
    links: [{ label: "View live", url: "https://www.yatra.com/prime" }],
  },
  {
    code: "PRJ-02",
    name: "Animeta AI",
    type: "AI-backed creator growth platform",
    stack: ["Next.js App Router", "TypeScript", "Tailwind CSS", "REST APIs"],
    points: [
      "Engineered real-time charts and metric-tracking modules that render large volumes of data without dropping a frame.",
      "Used the App Router to keep the architecture clean and server rendering fast, even as the product's data surface grew.",
    ],
    links: [{ label: "View live", url: "https://animeta.ai/" }],
  },
  {
    code: "PRJ-03",
    name: "Comviva Telesat & Mobilytix",
    type: "Enterprise marketing-automation interfaces",
    stack: ["React.js", "REST APIs", "JavaScript"],
    points: [
      "Integrated complex marketing-automation APIs into the frontend, streamlining data fetching and error handling across the platform.",
      "Optimised enterprise-client interfaces for faster load times and smoother, more responsive data tables.",
    ],
    links: [
      { label: "Mobilytix product page", url: "https://www.comviva.com/products-solutions/martech/mobilytix-real-time-marketing/" },
      { label: "Telesat Lightspeed portal", url: "https://portal.pathway-sb.telesatlightspeed.net/auth/login" },
    ],
  },
];
