// Base URL the site is deployed at — used for metadataBase, sitemap.xml,
// robots.txt, and absolute Open Graph URLs. Update this if a custom domain
// is attached later.
export const siteUrl = "https://vijayaraghavan-k-portfolio.vercel.app";

export const site = {
  name: "Vijayaraghavan K",
  role: "Senior Frontend Software Engineer",
  location: "Chennai, Tamil Nadu, India",
  email: "vijayraghavan264@gmail.com",
  phone: "+91 7904480174",
  phoneHref: "+917904480174",
  linkedin: "https://www.linkedin.com/in/vijayaraghavan-k-b58391218",
  linkedinLabel: "linkedin.com/in/vijayaraghavan-k",
  github: "https://github.com/vr1306",
  githubLabel: "github.com/vr1306",
  resumeHref: "/resume.pdf",
  status: "Open to new roles",
  // Formspree endpoint — submissions from the contact form land in the
  // owner's inbox via Formspree; nothing is stored on this site.
  formspreeEndpoint: "https://formspree.io/f/xzebawyq",
  tagline:
    "I architect fast, secure interfaces with React, Next.js, and TypeScript \u2014 the kind that hold up under real traffic and real attackers.",
  description:
    "Four years spent turning fragile frontends into ones that scale, load quickly, and don't leak a single token.",
} as const;
