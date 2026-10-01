export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  code: string;
  name: string;
  category?: "Client Project" | "Personal Project";
  type: string;
  stack: string[];
  points: string[];
  /** Public links relevant to this client project — live product, docs, etc. No repos, since these are client-owned codebases. */
  links?: ProjectLink[];
  keywords?: string[];
}

export const projects: Project[] = [
  {
    code: "PRJ-01",
    name: "H&M",
    category: "Client Project",
    type: "Global fashion e-commerce platform (Adobe client engagement)",
    stack: [
      "React.js",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "REST APIs",
      "GraphQL",
      "Adobe Experience Cloud",
    ],
    points: [
      "Built fast, modular Product Listing Pages (PLP) and Product Detail Pages (PDP) with multi-region locale support, faceted filtering, and infinite scroll.",
      "Optimised the critical rendering path and image delivery, raising the mobile Lighthouse performance score from 64 to 92 and reducing Time to Interactive (TTI) by 35%.",
      "Worked with UX designers and Adobe specialists to integrate headless commerce APIs and Adobe Analytics event tracking for real-time shopper journey insights.",
    ],
    links: [{ label: "H&M global store", url: "https://www.hm.com/" }],
    keywords: ["hm", "h&m", "h & m", "h and m", "fashion", "ecommerce"],
  },
  {
    code: "PRJ-02",
    name: "Bath & Body Works",
    category: "Client Project",
    type: "Retail e-commerce & promotions platform (Adobe client engagement)",
    stack: ["React.js", "Redux Toolkit", "Sass/SCSS", "Axios", "Adobe Target"],
    points: [
      "Developed seasonal campaign landing pages and interactive product bundle builders designed to stay stable during flash-sale traffic spikes.",
      "Integrated Adobe Target for A/B testing and personalised content, increasing promotional click-through rate (CTR) by 18%.",
      "Standardised design system components to meet WCAG 2.1 AA standards, delivering full keyboard accessibility and screen reader support across the checkout flow.",
    ],
    links: [
      { label: "Bath & Body Works store", url: "https://www.bathandbodyworks.com/" },
    ],
    keywords: [
      "bbw",
      "bath",
      "body",
      "works",
      "bath and body works",
      "bath & body works",
      "retail",
      "promotions",
    ],
  },
  {
    code: "PRJ-03",
    name: "Yatra Prime",
    category: "Client Project",
    type: "Premium travel subscription platform",
    stack: ["React.js", "Redux Toolkit", "Axios", "Sass", "REST APIs"],
    points: [
      "Created a modular dashboard built from reusable UI components, improving feature delivery speed by 20%.",
      "Designed normalised Redux Toolkit slices to manage multi-tier subscription states and checkout flows, contributing to an increase of over 25% in subscription conversions.",
      "Implemented WCAG 2.1 AA-compliant UI patterns with full keyboard navigation across payment and onboarding flows.",
    ],
    links: [{ label: "View live", url: "https://www.yatra.com/prime" }],
    keywords: ["yatra", "yatra prime", "travel", "subscription"],
  },
  {
    code: "PRJ-04",
    name: "Animeta AI",
    category: "Client Project",
    type: "AI-backed creator growth & monetisation platform",
    stack: ["Next.js App Router", "TypeScript", "Tailwind CSS", "REST APIs"],
    points: [
      "Built real-time analytics dashboards and dynamic charts in TypeScript that render complex creator metrics smoothly at 60 FPS.",
      "Used Next.js Server and Client Components to optimise server-side rendering (SSR), reducing initial data loading time by 40%.",
    ],
    links: [{ label: "View live", url: "https://animeta.ai/" }],
    keywords: ["animeta", "animeta ai", "creator", "monetisation"],
  },
  {
    code: "PRJ-05",
    name: "Telesat Lightspeed",
    category: "Client Project",
    type: "Enterprise satellite network management portal",
    stack: ["React.js", "JavaScript (ES6+)", "REST APIs", "CSS3", "Material UI"],
    points: [
      "Optimised enterprise client interfaces for high-throughput network monitoring, delivering faster load times and smoother, more responsive data tables.",
      "Developed secure, modular client portal dashboards with role-based access control (RBAC) for international enterprise telecommunications management.",
      "Refactored legacy code into modular React functional components, reducing technical debt and making the codebase easier for distributed teams to maintain.",
    ],
    links: [
      {
        label: "Telesat Lightspeed portal",
        url: "https://portal.pathway-sb.telesatlightspeed.net/auth/login",
      },
    ],
    keywords: ["telesat", "lightspeed", "satellite", "telecom"],
  },
  {
    code: "PRJ-06",
    name: "Comviva Mobilytix",
    category: "Client Project",
    type: "AI marketing automation & customer engagement platform",
    stack: ["React.js", "Redux", "REST APIs", "Virtualised Tables", "Highcharts"],
    points: [
      "Developed marketing automation screens with virtualised data tables and real-time campaign reports that handle 50,000+ records without lag.",
      "Streamlined API handling and added error boundaries and retry logic, preventing UI freezes during heavy background data syncs.",
      "Built campaign configuration workflows and real-time analytics that help enterprise marketing teams monitor audience engagement.",
    ],
    links: [
      {
        label: "Mobilytix product page",
        url: "https://www.comviva.com/products-solutions/martech/mobilytix-real-time-marketing/",
      },
    ],
    keywords: ["comviva", "mobilytix", "marketing", "automation"],
  },
  {
    code: "PRJ-07",
    name: "TaskFlow",
    category: "Personal Project",
    type: "Full-stack collaborative task management platform",
    stack: [
      "Next.js 16 App Router",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Redux Toolkit",
      "@dnd-kit",
      "Node.js",
      "Express 5",
      "MongoDB",
      "Swagger",
    ],
    points: [
      "Built a task management platform featuring an interactive Kanban board with @dnd-kit drag-and-drop workflows, optimistic UI updates, and multi-criteria filtering.",
      "Implemented secure JWT authentication with custom role-based access control (RBAC) and protected route guards across Next.js App Router, with centralised state management in Redux Toolkit.",
      "Developed an Express 5 and MongoDB (Mongoose) backend with interactive OpenAPI/Swagger documentation and automated tests that meet SonarQube quality gate standards.",
    ],
    links: [
      { label: "View live", url: "https://taskflow-fe-beryl.vercel.app" },
      { label: "API Docs", url: "https://task-flow-be-eight.vercel.app/api-docs" },
      { label: "Frontend repo", url: "https://github.com/VR1306/taskFlow-FE" },
      { label: "Backend repo", url: "https://github.com/VR1306/taskFlow-BE" },
    ],
    keywords: ["taskflow", "task flow", "kanban"],
  },
  {
    code: "PRJ-08",
    name: "AidPro",
    category: "Personal Project",
    type: "CPR & first-aid training web app",
    stack: [
      "Next.js 16 App Router",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "React Compiler",
    ],
    points: [
      "Built a CPR and first-aid training app with step-by-step emergency guides covering CPR do's and don'ts, the Heimlich manoeuvre, the AVPU responsiveness scale, and the log-roll technique.",
      "Structured each procedure as a modular section with reusable components, statically prerendered (SSG) on the Next.js App Router for instant loads on any device.",
    ],
    links: [
      { label: "View live", url: "https://aid-pro-108.vercel.app" },
      { label: "Repo", url: "https://github.com/VR1306/aid-pro" },
    ],
    keywords: ["aidpro", "aid pro", "cpr", "first aid"],
  },
];
