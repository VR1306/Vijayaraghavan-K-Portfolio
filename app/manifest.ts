import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: "Vijay K",
    description: `${site.tagline} ${site.description}`,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F5",
    theme_color: "#0A192F",
    orientation: "portrait-primary",
    scope: "/",
    categories: ["portfolio", "productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    shortcuts: [
      {
        name: "Projects",
        url: "/#built",
        description: "View shipped production systems",
      },
      {
        name: "Technical Stack",
        url: "/#systems",
        description: "Core technologies and disciplines",
      },
      {
        name: "Track Record",
        url: "/#record",
        description: "Experience timeline and metrics",
      },
      {
        name: "Contact",
        url: "/#contact",
        description: "Send a message or get in touch",
      },
    ],
  };
}
