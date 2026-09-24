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
}

export const projects: Project[] = [
  {
    code: "PRJ-01",
    name: "Yatra Prime",
    category: "Client Project",
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
    category: "Client Project",
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
    name: "Comviva Mobilytix",
    category: "Client Project",
    type: "Real-time marketing automation & customer engagement platform",
    stack: ["React.js", "REST APIs", "JavaScript", "Redux"],
    points: [
      "Integrated complex real-time marketing-automation APIs into the frontend, streamlining high-volume campaign data fetching and error handling.",
      "Built intuitive campaign configuration workflows and real-time analytics to help enterprise marketing teams monitor audience engagement.",
    ],
    links: [
      { label: "Mobilytix product page", url: "https://www.comviva.com/products-solutions/martech/mobilytix-real-time-marketing/" },
    ],
  },
  {
    code: "PRJ-04",
    name: "Telesat Lightspeed",
    category: "Client Project",
    type: "Enterprise satellite network management portal",
    stack: ["React.js", "REST APIs", "JavaScript"],
    points: [
      "Optimised enterprise-client interfaces for high-throughput network monitoring, delivering faster load times and smoother, more responsive data tables.",
      "Developed secure, modular client portal dashboards with role-based access for international enterprise telecommunications management.",
    ],
    links: [
      { label: "Telesat Lightspeed portal", url: "https://portal.pathway-sb.telesatlightspeed.net/auth/login" },
    ],
  },
  {
    code: "PRJ-05",
    name: "TaskFlow",
    category: "Personal Project",
    type: "Full-stack collaborative task management platform",
    stack: [
      "Next.js 16 App Router",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "@dnd-kit",
      "Redux Toolkit",
      "Node.js",
      "Express 5",
      "MongoDB",
      "Swagger",
    ],
    points: [
      "Built an end-to-end personal task management platform featuring an interactive Kanban board with @dnd-kit drag-and-drop workflows, optimistic UI updates, and multi-criteria filtering.",
      "Architected secure JWT authentication with custom Role-Based Access Control (RBAC), protected route guards across Next.js App Router, and centralized state management using Redux Toolkit.",
      "Developed a robust Express 5 backend with MongoDB/Mongoose models, interactive OpenAPI/Swagger documentation, and automated test suites maintaining SonarQube quality gate standards.",
    ],
    links: [
      { label: "View live", url: "https://taskflow-fe-beryl.vercel.app" },
      { label: "API Docs", url: "https://task-flow-be-eight.vercel.app/api-docs" },
      { label: "Frontend repo", url: "https://github.com/VR1306/taskFlow-FE" },
      { label: "Backend repo", url: "https://github.com/VR1306/taskFlow-BE" },
    ],
    links: [
      { label: "Mobilytix product page", url: "https://www.comviva.com/products-solutions/martech/mobilytix-real-time-marketing/" },
      { label: "Telesat Lightspeed portal", url: "https://portal.pathway-sb.telesatlightspeed.net/auth/login" },
    ],
  },
];
