import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ChatBot } from "@/components/ChatBot";
import { AmbientSky } from "@/components/AmbientSky";
import { ThemeAutoSync } from "@/components/ThemeAutoSync";
import { WeatherProvider } from "@/lib/WeatherProvider";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name} \u2014 ${site.role}`,
  description: site.tagline,
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: `${site.name} \u2014 ${site.role}`,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router layout, not pages/_document */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WeatherProvider>
            <ThemeAutoSync />
            <AmbientSky />
            <div className="blueprint-grid pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
            <ScrollProgress />
            <div className="relative z-[1]">{children}</div>
            <ChatBot />
          </WeatherProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
