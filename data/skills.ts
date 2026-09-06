export interface SkillModule {
  title: string;
  items: string;
}

export const skillModules: SkillModule[] = [
  {
    title: "Languages & Frameworks",
    items:
      "JavaScript (ES6+), TypeScript, React.js, Next.js \u2014 both the App Router and Pages Router, HTML5, CSS3, Sass/SCSS.",
  },
  {
    title: "State & Data",
    items: "Redux Toolkit, React Context API, REST APIs, GraphQL, Axios.",
  },
  {
    title: "UI & Styling",
    items:
      "Tailwind CSS, Material UI, Styled Components, responsive layouts built component-first.",
  },
  {
    title: "Performance Engineering",
    items:
      "Code splitting, lazy loading, tree shaking, bundle optimisation, Lighthouse auditing, Core Web Vitals \u2014 FCP, LCP, TTI, CLS.",
  },
  {
    title: "Security Architecture",
    items:
      "Zero-Trust frontend design, secure API proxy routes, automated token refresh, cookie-based auth.",
  },
  {
    title: "Testing & Quality",
    items: "Jest, React Testing Library, ESLint, Prettier, Husky wired into every pipeline I own.",
  },
  {
    title: "Tools & Workflow",
    items: "Git, GitHub, CI/CD, Webpack, Vite, Babel, npm, yarn, pnpm.",
  },
  {
    title: "Team Process",
    items: "Agile/Scrum delivery, cross-functional planning with design, backend, QA, and product.",
  },
];
