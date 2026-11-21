@AGENTS.md

# tsiang.fr

Portfolio of Claude Tsiangana, fullstack developer, built to get recruiters to request an interview for a CDI. Product truth lives in `PRODUCT.md`, the visual system in `DESIGN.md`. Read both before changing UI or copy.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build, all routes must stay static (○ / ●)
npm run lint     # ESLint (warnings from .claude/skills/impeccable/scripts are not ours)
npx next start -p 3123   # serve the production build for screenshots
```

If a CSS change does not show up after a build, Turbopack served a stale stylesheet: `rm -rf .next` and rebuild.

## Stack and Next.js 16 rules

Next.js 16.4 (App Router, `cacheComponents: true`, Turbopack), React 19, Tailwind CSS 4, TypeScript. This Next version differs from older training data; check `node_modules/next/dist/docs/` before using an API. Known gotchas in this repo:

- `params` is a Promise: `const { slug } = await props.params`. Type pages with the global `PageProps<"/projets/[slug]">` and layouts with `LayoutProps<"/">`.
- `dynamicParams`, `dynamic`, `revalidate` route configs are not allowed with Cache Components.
- `next/image`: use `preload` (not the deprecated `priority`) only for the hero portrait.
- `next/og` `ImageResponse`: every `div` with more than one child needs `display: "flex"`.
- Files added to `public/` after a build are not served by `next start`.

## Where things are

- `data/`: all content, typed. `profile.ts` (identity, links, CV path, hero `facts`), `projects.ts` (11 projects, helpers `getProject`, `projectHost`, `isPortrait`), `experience.ts`, `skills.ts`, `certifications.ts`. Edit content here, not in components.
- `app/[lang]/`: `page.tsx` (home), `projets/page.tsx` (filterable index), `lab/page.tsx` (technical notes from `data/lab.ts`, written from the owner's own notes such as `LAB.md`: never add dates, links or figures that are not in the source), `projets/[slug]/page.tsx` (project page, `generateStaticParams`), `layout.tsx` (fonts, metadata, Person JSON-LD), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `icon.svg`, `not-found.tsx`, `globals.css` (tokens).
- `lib/activity.ts`: code activity, counts per day only, never project names, messages or code. Sources, each in its own `"use cache"` function: GitLab events API with `GITLAB_TOKEN` (read_api, preferred, 5 min), public calendar `calendar.json` for `GITLAB_USERNAME` as fallback (rate-limited per IP: HTTP 429 `unauthenticated_traffic_per_ip`, 5 min), latest event time (60 s), GitHub public events (5 min). Cached functions never throw (a throw fails the prerender): a failure returns null with a 30 s lifetime, and `getCodeActivity()` falls back to the last good snapshot kept in memory. Served to the page and `app/api/activity/route.ts`; `components/live-code-activity.tsx` polls it every 60 s. Hidden only when no GitLab data has ever been fetched. Env template: `.env.example`.
- `components/ui/`: shadcn components (style `base-nova`, Base UI primitives, `cn` from the `cn` package): `button`, `toggle`, `toggle-group`, `sheet`, `separator`, `dialog`. Booking: `components/booking-dialog.tsx` with Calendly (`NEXT_PUBLIC_CALENDLY_URL`) and/or Cal.com (`NEXT_PUBLIC_CALCOM_URL`), default chosen by `NEXT_PUBLIC_BOOKING_PROVIDER`, `?rdv=calcom|calendly` overrides it per visit; button hidden when neither URL is set. Add more with `npx shadcn add <name>`, then check they use the site tokens. Icons come from `lucide-react`.
- `components/primitives.tsx` (was `ui.tsx`): `Container`, `Section` (résumé layout, `wide`, `tone="region"`), `StackLine`, `buttonStyles`, `textLink`.
- `components/project-media.tsx`: `BrowserFrame`, `PhoneFrame`, `PhoneRow`, `ProjectThumb`.
- Client components: `project-filter.tsx`, `site-nav.tsx` (active section), `relative-time.tsx` (minute clock via `useSyncExternalStore`) and `live-code-activity.tsx` (live calendar). Server components cannot import values from a `"use client"` module: shared data lives in `data/` (e.g. `data/navigation.ts`). Keep everything else a Server Component; anything using `usePathname` in the layout must sit inside `Suspense`.
- `public/images/` (projects, certifications, profile, all WebP) and `public/cv/`.
- Images live on Cloudinary (URLs in `data/`, resized by `lib/image-loader.ts`). After adding or replacing one, run `npm run placeholders` to regenerate its blurred preview in `data/placeholders.ts`.

## Design rules (from DESIGN.md)

- North star: a well-set résumé. Section title in a left margin column, content in the wide column; real screenshots carry the page.
- Colors are tokens in `app/globals.css` using shadcn names, used through Tailwind (`bg-primary`, `text-muted-foreground`, `bg-background`, `bg-card`, `border-border`, plus site tokens `bg-region`, `text-signal`, `bg-primary-soft`). Never hard-code hex in components. Dark mode follows `prefers-color-scheme` (the `dark:` variant is a media query, no `.dark` class).
  - Petrol `primary` = anything clickable. Amber `signal` = what is current, only. Deep petrol `region` = the contact band, only.
  - Light and dark are both designed; check both. Text pairs must stay ≥4.5:1.
- Type: Space Grotesk (`font-display` / `font-hero`, weights 500 and 600, negative tracking) for every heading; Instrument Sans for everything else. Paragraphs under ~65ch, headings `text-balance`.
- Radii: 8px buttons and filters, 12px frames, 16px portrait, 1.4rem phones. No pills except the status dot and the FR / EN switch.
- Motion: the hero entrance (`.hero-in`) and the activity calendar sweep on load; live updates flash changed days. Nothing else animates on its own. All off under reduced motion.
- Web screenshots go in `BrowserFrame`, mobile ones in `PhoneFrame` / `PhoneRow`. Never crop them into generic cards.

## Copy rules

- French, first person, sentence case, plain verbs. Buttons name their action ("Télécharger mon CV", "Lire la fiche du projet").
- Banned in copy and UI: em dashes (—), middle dots (·), decorative ellipses (…), "→" after links, eyebrow labels above headings, stat tiles, pulsing "available" badges, numbered section markers.
- Never invent facts: no testimonials, metrics, client logos, response-time promises, salary or availability dates. Missing project facts (client, period) are omitted, not guessed.
- Dates and employers must match the PDF CV and LinkedIn.

## Before calling a change done

1. `npm run lint` and `npm run build` pass, routes still static.
2. Screenshot desktop (1440px) and mobile (≤500px), light and dark (`--blink-settings=preferredColorScheme=0` in headless Chrome).
3. No horizontal scroll on mobile, focus visible, images have descriptive `alt`.

## Languages (French and English)

- French is the default and keeps the root URLs (`/`, `/projets`, `/lab`); English lives under `/en/…`. Every page lives in `app/[lang]/` (root layout `app/[lang]/layout.tsx`, `generateStaticParams` for `fr` and `en`). `proxy.ts` rewrites unprefixed paths to `/fr` internally and 308-redirects `/fr/…` to the clean URL.
- `lib/i18n.ts`: `locales`, `localePath(lang, path)` (always build internal links with it), `stripLocale`, `alternatesFor` (canonical + hreflang for `generateMetadata`). `lib/locale.ts`: `getLocale()` reads the locale from `next/root-params` in Server Components.
- Interface strings: `lib/dictionaries.ts` (`getDictionary(lang)`), French is the reference, English mirrors every key. Content: French in `data/*.ts`, English text in `data/en.ts`, merged by `getProfile`, `getProjects`, `getProject`, `getExperiences`, `getSkillGroups`, `getLabNotes` (pass `lang`). When adding or changing content, update both.
- Client components cannot call `getLocale()`: pass `lang` or ready-made strings as props (functions cannot cross the server/client boundary).
- `components/language-switch.tsx`: FR / EN segmented switch; the other language links to the same page and keeps the scroll position.
- Not translated yet: the CV PDF (French only).
