# Vijayaraghavan K — Portfolio

A personal portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer Motion.

The whole site is laid out like a set of engineering drawings — a title block for the intro, numbered "sheets" for each section, a dimension-line timeline for work history, and an approval-stamp treatment for the doodleblue award — a nod to the "architecting" language used throughout the résumé.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
app/
  layout.tsx         Root layout — ThemeProvider, metadata, font <link>, background grid, scroll progress, Person JSON-LD
  page.tsx            Assembles all sections
  globals.css         Tailwind v4 theme tokens (light "blueline" + dark "cyanotype") + base styles
  opengraph-image.tsx  Dynamically generated 1200x630 OG/Twitter share image (next/og)
  apple-icon.tsx       Dynamically generated 180x180 Apple touch icon (next/og)
  sitemap.ts           Generates /sitemap.xml from data/site.ts's siteUrl
  robots.ts            Generates /robots.txt, points crawlers at the sitemap
  api/geo/route.ts     Server-side IP geolocation (fallback when GPS is denied/unavailable)
  api/weather/route.ts Server-side weather proxy (Open-Meteo, no API key required)
  api/chat/route.ts    Streams Claude API responses for the AI FAQ chatbot (ANTHROPIC_API_KEY)
components/
  Header.tsx          Sticky nav with scrollspy, mobile menu, theme toggle
  ThemeToggle.tsx      Light/dark switch (next-themes, persisted, no flash-of-wrong-theme)
  Hero.tsx             Title-block hero with animated SVG frame + CTA buttons
  LiveReadout.tsx      Live demo: personalization + consent gate + weather/forecast
  PrivacyNotice.tsx    Modal explaining exactly what's collected, with a one-click revoke
  WeatherIcon.tsx       Small monoline weather icon set matching the blueprint aesthetic
  ChatBot.tsx          Floating AI FAQ widget (Claude API, streamed) with a rule-based fallback
  ScrollProgress.tsx   Copper progress line under the header
  SectionFrame.tsx     Shared "sheet number + heading" wrapper
  SkillsSection.tsx    "Systems" — skills grid
  ProjectsSection.tsx  "Built" — project list
  ProjectCard.tsx      Single project panel
  MetricCounter.tsx    Animated count-up stat block
  TimelineSection.tsx  "Track record" — stats strip + experience timeline
  RecognitionSection.tsx  "Recognition" — award stamp + education
  ContactFooter.tsx    Footer with real mailto/tel/LinkedIn links + optional contact form
  ContactForm.tsx      Formspree-backed contact form (optional, never gates content)
  Highlight.tsx        Renders **bold** substrings in copper
lib/
  useActiveSection.ts  IntersectionObserver-based scrollspy hook
  useLocalStorage.ts   SSR-safe localStorage-backed state hook
  useLiveWeather.ts    Orchestrates GPS -> IP fallback -> weather fetch
  weatherCodes.ts      WMO weather code -> label/icon mapping
  matchChatTopic.ts    Keyword-scoring matcher for the FAQ bot
data/
  site.ts, skills.ts, projects.ts, experience.ts, recognition.ts, chatbot.ts
  All real content, typed, and single-sourced — the chatbot's answers are
  generated from the exact same data the visible sections render.
public/
  resume.pdf           Downloaded via the hero's "Download résumé" button
```

## AI FAQ chatbot

The floating chat launcher (bottom-right) is backed by the Claude API (`claude-haiku-4-5`). `app/api/chat/route.ts` attaches the actual `public/resume.pdf` to the first message as a real PDF document (`lib/resumeDocument.ts` reads and base64-encodes it) — the model reads the résumé itself rather than answering from a hand-duplicated summary of it. `lib/portfolioContext.ts` supplies a short system prompt with only the site-specific details that aren't necessarily in the résumé (exact contact/social links, live project URLs) and instructs the model to treat the résumé as the source of truth and say "I don't know, use the contact form" for anything outside that scope.

**Setup:** copy `.env.example` to `.env.local`, get a key at [console.anthropic.com](https://console.anthropic.com/settings/keys), and set `ANTHROPIC_API_KEY`. Add the same variable in your Vercel project's Environment Variables when you deploy. If you swap in a new `public/resume.pdf`, the chatbot picks it up automatically — no other changes needed.

**Without a key**, or if the API call errors or gets rate-limited, the chatbot automatically falls back to the original **rule-based** matcher (`lib/matchChatTopic.ts` + `data/chatbot.ts`) — a keyword-scored lookup against canned answers, no API key or network call required. It matches whole words for single-word keywords (so "yo" won't fire on "you"/"your") and substrings for multi-word phrases, with an honest fallback message when nothing matches. This keeps the widget working out of the box for anyone who clones the repo without setting up a key.

**Cost & abuse guardrails:** `app/api/chat/route.ts` caps message length and conversation length, and applies a best-effort in-memory rate limit (20 messages / 10 min per IP — resets on cold start, not shared across serverless instances, so treat it as a courtesy brake rather than a hard limit). Both the system prompt and the résumé document are cached (`cache_control: ephemeral`) since they're identical across requests within a conversation.

To add a new fallback topic: add an entry to the `chatTopics` array in `data/chatbot.ts` with a list of keywords and an `answer()` function. Add a `suggestion` string if you also want it to appear as a quick-reply chip.

## The "Live" panel — theming, weather, location & privacy

A dedicated, clearly-labeled section (`#live`, "Sheet A-02") demonstrates several real engineering concerns end to end, rather than silently profiling every visitor:

- **Theme toggle** — light mode is styled as a "blueline" diazo print (navy ink on parchment), dark mode as the original cyanotype blueprint. Persisted via `next-themes` (localStorage), defaults to system preference, no flash of the wrong theme on load.
- **Consent-gated location** — nothing is requested until the visitor clicks "Allow." Declining is a first-class, remembered choice, not a dead end.
- **GPS first, IP as fallback** — tries the browser's native Geolocation API; if denied or unsupported, falls back to a coarse IP-based estimate via `/api/geo`.
- **Weather** — `/api/weather` proxies Open-Meteo server-side (no API key, no personal data sent to them beyond coordinates).
- **Transparency** — every weather reading shows *how* the location was derived (device GPS vs. IP estimate, including the IP itself when that path is used), plus a "Privacy details" link with the full data-handling explanation and a one-click way to turn it off.
- **Personalization** — a name is only ever used if the visitor types it in voluntarily; it's stored in `localStorage` only and never inferred any other way.
- **No server-side persistence** — neither route writes anything to a database or a durable log; IP addresses are used transiently within a single request and are never logged.

## Contact form (Formspree) & analytics

The footer includes an optional contact form — nothing on the site is gated behind it, it's just a lower-friction alternative to the mailto/tel/LinkedIn links right above it.

**To receive submissions**, you need a free Formspree endpoint:
1. Sign up at [formspree.io](https://formspree.io) (free tier is plenty for a portfolio) and create a form.
2. Copy the endpoint it gives you (looks like `https://formspree.io/f/xxxxxxxx`).
3. Paste it into `formspreeEndpoint` in `data/site.ts`, replacing `YOUR_FORM_ID`.

Until you do that, the form shows a clear "not wired up yet" message instead of silently failing or pretending to work.

**Visitor analytics** are handled by `@vercel/analytics` — it's already wired into `app/layout.tsx`. It only activates automatically when deployed on Vercel with Analytics enabled for the project (Project → Analytics tab); it's a no-op everywhere else, including local dev. It's cookie-free and doesn't collect personal data, so there's nothing extra to disclose beyond what's already in the Privacy details modal.

## Updating content


Everything you'd actually want to change lives in `data/*.ts` — no need to touch component markup to update your role, contact info, skills, projects, or experience bullets. Metric numbers live in `data/experience.ts` as plain numbers so the count-up animation can drive them.

To swap your résumé file, replace `public/resume.pdf` and keep the filename the same (or update `resumeHref` in `data/site.ts`).

**If you attach a custom domain**, update `siteUrl` in `data/site.ts` — it drives `metadataBase`, the OG/canonical URLs, `sitemap.xml`, and `robots.txt`. It currently points at the default Vercel URL as a placeholder.

**Project links**: `data/projects.ts`'s `Project` type has an optional `links` array (`{ label, url }[]`) — set it per project to show clickable links on `ProjectCard` (e.g. "View live", a product page); omit it for client work that can't be public.

## SEO & sharing

- `app/opengraph-image.tsx` and `app/apple-icon.tsx` generate share-preview and home-screen icons on the fly (via `next/og`), styled to match the blueprint theme — no static image asset to keep in sync.
- `app/sitemap.ts` / `app/robots.ts` generate `/sitemap.xml` and `/robots.txt` from `siteUrl`.
- `app/layout.tsx` emits a `Person` JSON-LD block (name, role, contact, `sameAs` links to LinkedIn/GitHub) for richer search results.

## Testing & CI

Component and logic tests run on Jest + React Testing Library:

```bash
npm test
```

`lib/matchChatTopic.test.ts` covers the FAQ bot's whole-word/phrase matching rules; `components/Highlight.test.tsx` covers the `**bold**` renderer. `.github/workflows/ci.yml` runs lint, tests, and a production build on every push/PR.

## Fonts

IBM Plex Sans and IBM Plex Mono are loaded via a Google Fonts `<link>` tag in `app/layout.tsx` rather than `next/font/google`, so the build doesn't require network access to Google's font servers at build time. If you'd prefer `next/font` (automatic self-hosting, zero layout shift by default), swap it in once you're building somewhere with normal internet access — it's a drop-in change.

## Build & deploy

```bash
npm run build
npm run start   # serve the production build locally
```

The easiest deploy path is [Vercel](https://vercel.com/new) (made by the Next.js team — push this to a GitHub repo and import it, zero config needed). Netlify and Cloudflare Pages also work with their standard Next.js build presets.

## Notes

- All copy and metrics reflect real, verified information — nothing was fabricated to fill a placeholder.
- Motion respects `prefers-reduced-motion`: the hero's draw-in animation and stat counters resolve instantly for anyone who has that setting on.
- The `/api/geo` and `/api/weather` routes call ipwho.is and Open-Meteo respectively — both free, keyless services — so they need normal outbound internet access from wherever you deploy. Both fail gracefully with clear messages and a "Try again" button if a lookup is blocked or times out.
- No database is required. `ANTHROPIC_API_KEY` is the one optional environment variable — everything else, including `/api/geo` and `/api/weather`, needs no configuration.
