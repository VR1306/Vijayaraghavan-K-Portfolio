export interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export const stats: Metric[] = [
  { value: 2, label: "production apps secured" },
  { value: 200, prefix: "100\u2013", suffix: "+", label: "monthly active users served" },
  { value: 80, prefix: "70\u2013", suffix: "%", label: "cut in production bugs" },
  { value: 10, label: "junior engineers mentored" },
];

export const experienceBullets: string[] = [
  "Architected a Zero-Trust frontend security model with Next.js API proxy routes and automated token refresh, removing client-side exposure of auth tokens across **2 production applications**.",
  "Own end-to-end frontend delivery for enterprise products serving **100\u2013200+ monthly active users**, working in Agile/Scrum sprints alongside design, backend, and QA.",
  "Refactored for performance with dynamic code-splitting and lazy loading, meaningfully cutting bundle size and improving First Contentful Paint and Time to Interactive.",
  "Built responsive, real-time analytics dashboards for AI-driven creator platforms, handling large, complex datasets smoothly.",
  "Introduced ESLint, Prettier, and Husky into the CI pipeline and tightened code review standards, cutting production bugs by **70\u201380%**.",
  "Mentored **10 junior engineers** through 40+ hours of structured frontend training, helping them ramp up to independent, production-ready work.",
];
