---
name: tsiang.fr
description: Portfolio of Claude Tsiangana, fullstack developer, written for recruiters.
colors:
  bg: "#f3f6f6"
  surface: "#ffffff"
  ink: "#0f1d21"
  muted: "#52646a"
  line: "#d5dfe1"
  accent: "#0e6377"
  accent-ink: "#ffffff"
  accent-soft: "#e0eef0"
  device: "#0f1d21"
  region: "#0d4553"
  on-region: "#f2f8f9"
  on-region-muted: "#a9cdd5"
  signal: "#9a6212"
  dark-bg: "#0b1517"
  dark-surface: "#102024"
  dark-ink: "#e6eef0"
  dark-muted: "#93a7ad"
  dark-line: "#1f3439"
  dark-accent: "#5fc1d3"
  dark-accent-ink: "#0b1517"
  dark-accent-soft: "#12323a"
  dark-device: "#050b0c"
  dark-region: "#0f3a44"
  dark-on-region: "#eaf6f8"
  dark-on-region-muted: "#9fc9d1"
  dark-signal: "#f0b54a"
typography:
  hero:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.1vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  page-title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
  section-title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  item-title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  brand:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  caption:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  micro:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  swatch: "2px"
  cell: "3px"
  focus: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  device: "1.4rem"
  full: "999px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  gutter-lg: "32px"
  section: "64px"
  section-sm: "96px"
  container: "80rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  filter-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  filter-idle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  contact-band:
    backgroundColor: "{colors.region}"
    textColor: "{colors.on-region}"
  contact-button:
    backgroundColor: "{colors.on-region}"
    textColor: "{colors.region}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
---

# Design System: tsiang.fr

## Overview

**Creative North Star: the well-set résumé.** The site reads like a CV composed by a typographer: section names sit in a left margin column, content runs in a wide column beside them, and every element is something a recruiter can check. Real screenshots carry the visual weight; the interface stays quiet around them.

Mood: sober, precise, human. Written in the first person, sentence case, plain verbs. The page should never look generated: no eyebrow labels, no stat tiles, no pulsing badges, no em dashes or middle dots in copy.

Anti-references: SaaS landing pages (identical rounded cards, gradient washes, glass), "developer terminal" costumes (monospace labels, acid green on black), cream-and-terracotta editorial templates.

## Colors

Two hues, each with one job. Every color is a CSS custom property in `app/globals.css` with shadcn names (`--primary`, `--muted-foreground`, `--background`, `--card`, `--border`, `--ring`…) plus site tokens (`--primary-soft`, `--region`, `--signal`, `--device`), exposed to Tailwind through `@theme inline`. shadcn components read the same tokens. In this document, "accent" = `primary`, "muted" = `muted-foreground`, "line" = `border`, "ink" = `foreground`, "bg" = `background`, "surface" = `card`. Light and dark are both designed; dark is not an inversion.

### Primary: Petrol (`accent` #0e6377, dark #5fc1d3)
Everything the visitor can act on: primary buttons, the header CV button, link underlines, the selected filter. Never used as decoration.

### Secondary: Amber (`signal` #9a6212, dark #f0b54a)
Marks what is current, and nothing else. Today it only flags the ongoing role in the experience list (dot plus colored period, with a screen-reader "poste actuel").

### Region: Deep Petrol (`region` #0d4553, dark #0f3a44)
The one saturated area of the page: the contact band at the bottom of every page, where each visit should end. Text on it uses `on-region` and `on-region-muted`, never generic grey.

### Neutral
- `bg` #f3f6f6: a barely green-grey canvas, cool and calm.
- `surface` #ffffff: browser frames, idle buttons and filters.
- `ink` #0f1d21: deep petrol-black for text, never #000 or #111.
- `muted` #52646a: secondary text, metadata, stack lines.
- `line` #d5dfe1: hairline separators and borders.
- `accent-soft` #e0eef0: the panel behind phone screenshots.
- `device` #0f1d21: phone bezels, kept dark in both themes.

### Named Rules
- **One job per color.** Petrol means "you can act", amber means "this is now", deep petrol means "talk to me". Do not introduce a third hue.
- **Contrast floor is WCAG AA.** Every text pair is ≥4.5:1 in both themes (tightest: amber on light bg, 4.7:1). Check new pairs before shipping.

## Typography

Two clearly distinct families loaded with `next/font/google`:
- **Space Grotesk** (`font-display` and `font-hero`, variable `--font-space`, weights 500/600): every heading, from the hero name and role (tracking -0.04em) to section, project and role titles (600, -0.025em).
- **Instrument Sans** (`font-sans`, variable `--font-instrument`): all body text, metadata, buttons.

### Hierarchy
- Hero sentence: `clamp(1.75rem, 3.1vw, 2.6rem)`, a full first-person sentence, balanced.
- Page titles (`/projets`, project pages): 3rem mobile, 4.5rem desktop.
- Section titles: 1.875rem to 2.25rem, in the margin column.
- Item titles (projects, roles): 1.5rem to 2.25rem.
- Lead text 1.125rem, body 1rem, metadata 15px in `muted`.
- Small steps, as Tailwind tokens: `text-brand` 17px (name in the header), `text-caption` 13px (footnotes, footer labels, header tagline), `text-micro` 11px (calendar month and day labels, browser frame address bar).

### Named Rules
- Measure stays under ~65ch for paragraphs (`max-w-[62ch]`, `max-w-[65ch]`).
- Headings use `text-balance`, paragraphs `text-pretty`.
- No all-caps labels, no single-word color accents in headlines, no monospace.

## Layout

- Container: `max-w-7xl` (80rem), gutters 16px / 24px / 32px.
- **Résumé sections** (`Section` in `components/ui.tsx`): on `lg`, a 12-column grid with the heading in 3 columns (sticky at `top-24`) and content in 9. Sections are separated by a 1px top border and 64px / 96px vertical padding. `wide` puts screenshots at full width under the heading. An optional `intro` (one factual sentence, `muted`) sits under the heading in the margin column, or beside it for `wide` sections.
- Home order: hero, projects (wide), experience, skills (with certifications as an `h3` subsection, anchor `#certifications`), contact band.
- `/projets` is an index: rows of thumbnail (4 cols), text (5 cols), facts list (3 cols), divided by hairlines. It stacks on mobile.
- Project page: title and summary, a facts row (role, setting, period, platforms, sector), cover screenshot, then text (7 cols) beside a sticky technologies list (4 cols), then the screenshot gallery.
- Mobile first, verified at 375px and 500px with no horizontal scroll.

## Elevation & Depth

Flat by default; depth only where a physical object is depicted.
- Phone frames: `0 18px 40px -18px rgb(14 23 38 / 0.45)`, a real offset shadow under a device.
- Browser frames: border only, no shadow.
- Hero portrait: 1px `line` ring plus a soft offset shadow (`0 12px 32px -16px`), so the white photo background reads as a print on the page. Dimmed (`brightness 0.86`) in dark mode.
- Header: `bg/80` with `backdrop-blur-md` so content scrolling under it stays legible. This is the only blur.

## Shapes

- Buttons, filters: 8px (`rounded-lg`).
- Browser frames, screenshot panels: 12px (`rounded-xl`).
- Hero portrait: circle (`rounded-full`), 96px on phones, 128px from `sm`, 256px from `lg`, with 8% of padding at the top only (white backdrop matching the photo) so the head does not touch the edge.
- Phone frames: 1.4rem outer, 1.1rem screen.
- Certificates: 6px.
- No pills (`rounded-full`) except the hero portrait, the small status dot and the FR / EN switch.

## Components

### Buttons
shadcn `Button` / `buttonVariants` (`components/ui/button.tsx`) with a site size `xl` (44px, 15px text) for page actions and `lg` for the header. `outline` uses a `card` background. `buttonStyles.primary` (petrol fill) and `buttonStyles.secondary` (white with line border, border darkens on hover). Labels say what happens: "Télécharger mon CV", "M'écrire", "Lire la fiche du projet", "Ouvrir stoogo.com". Download icon only on CV buttons, external icon only on outbound project links. No arrows appended.

### Text links
`textLink`: petrol text at weight 500, no underline, ink on hover (the weight keeps links visible where petrol is close to the body text). Inside the contact band, `regionLink` is `on-region` text at weight 500, `on-region-muted` on hover. No link is ever underlined, at rest or on hover.

### Browser frame and phone frame (signature component)
`components/project-media.tsx`. Web screenshots sit in a plain browser window whose address bar shows the real domain when the project has one (`projectHost`). Mobile screenshots sit in dark phone outlines, up to three side by side on an `accent-soft` panel. `ProjectThumb` gives every project the same 16:10 thumbnail whatever the screenshot orientation.

### Experience entry
Period (amber with a dot when `current`), role title, employer (linked when it has a site), summary, highlights (`TaskList`: a list longer than five shows four tasks and folds the rest into a native `<details>`, "Afficher N autres missions" in `primary`, which disappears once open), stack line, then "Voir la fiche du projet …" when the role has a matching project page (`project` slug in `data/experience.ts`).

### Code activity (live)
`components/code-activity.tsx` (server) renders the latest snapshot into `components/live-code-activity.tsx` (client), in the hero right under the name and role, with no card around it.
- Header: "Activité de code", then the live indicator (`LiveIndicator`: an amber `signal` dot inside a thin ring that fills up over one refresh cycle, 60 s, with one ping per real check) and a status in words: "En direct, mise à jour dans 42 s" (counts down every second), "mise à jour en cours" during the check, "à jour à l'instant" for 4 s after it. When a check fails: gray dot, "Hors ligne, nouvel essai dans 42 s". On the right, "Dernière activité" as a live relative time.
- Figures: total contributions over 12 months, active days, sources, tabular numerals. The total flashes amber once when it changes.
- Calendar: one column per week, Monday on top, month labels above and lun./mer./ven. on the side, five steps from `line` to full `accent` on a square-root scale. One calendar for every screen: CSS variables set the visible weeks (18, 40 from `sm`, 53 from `lg`); columns stretch to the full width on every screen. A month label is skipped when its month shows less than three columns at either edge. Today carries an inset amber `signal` outline (the square the next check can fill), explained by an "Aujourd'hui" swatch before the Moins/Plus legend. Only `LiveStatus` re-renders every second; the grid (`ActivityCalendar`, memoized) re-renders only when a check brings new counts.
- Motion: on load the cells sweep in left to right (`.activity-cell`, 12ms per week), the page's single entrance moment with the hero. A day whose count changes during the visit gets an amber ring twice (`.is-new`), and "+N à l'instant" rises in, amber, right after the total for 8 s (`.live-gain`). All of it stops under `prefers-reduced-motion`.
- Live: the browser asks `/api/activity` every 60 s while the tab is visible and updates in place. Counts only. Hidden when GitLab data is missing.
- The live indicator is the one exception to "no pulsing badges": it is allowed only because the data next to it is genuinely live, and each ping matches a real check, never a loop for show.

### Lab page
The Lab has three levels. `/lab` (`app/[lang]/lab/page.tsx`) lists the labs (`labs` in `data/lab.ts`; a lab is one personal project explored in depth, today the VPN platform and the OPENPAY AI assistant; status is optional and hidden when the source does not state it): page title and intro, then a category tab bar (`components/lab-filter.tsx`, same look as the project filter: shadcn `ToggleGroup`, single choice, "Tous" then every category of `labCategories` in order (Réseau et sécurité, DevOps et cloud, Backend et API, IA; web and mobile work is shown in Projets), each with its count, empty ones included; picking an empty one shows "Aucun lab dans cette catégorie pour l'instant." between hairlines; selected tab in `primary`), then one row per lab between hairlines, résumé layout (margin column: the category in `font-medium`, status in `muted`, then "2 notes techniques" and "6 démos interactives"; wide column: title linking to the lab, summary in 18px, "Ce que ça montre" gathered from its notes, technologies, "Ouvrir le lab"). The lab page shows its category in its margin column. The lab page `/lab/<lab>` (`app/[lang]/lab/[lab]/page.tsx`): breadcrumb "Lab", a header (title as `h1`, summary in 20px, "2 notes techniques" as a jump link; margin column behind a hairline: status, technologies, "Voir la fiche du projet"), then résumé-layout sections: "La plateforme" (`LabPlatform`: the project's architecture diagram and the hairline list, shown here only, not in the notes), "Ce que ça montre", "Les notes" (one row each: title, summary, stack, "Lire la note", demo count with a flask icon in `muted`). No demos on the lab page: they all live in the note they come from, whose page ends with "Les démos" (demo cards: 12px `card`, a 40px `primary-soft` square with the demo's lucide icon, title in `font-display`, the plain question in `muted`, technologies in `caption`, "Ouvrir la démo", petrol border on hover). Notes and demos live one level down, `/lab/<lab>/<slug>` (`app/[lang]/lab/[lab]/[slug]/page.tsx` serves both; slugs never collide), each starting with the breadcrumb "Lab > <lab>", plus "> <note>" on a demo page (`components/lab-breadcrumb.tsx`, muted links, chevrons). A note page ends with "Les démos" (its own demos as cards, "Voir les démos (3)" in its margin column jumps there) and "Autres notes de ce lab". The old note URLs `/lab/<note>` redirect permanently (`next.config.ts`). Each demo page (`/lab/<lab>/<demo>`, ids in `data/lab-demos.ts`, copy in `lib/lab-demo-strings.ts`), read top to bottom: the breadcrumb; a header (the title as `h1`, the demo in plain words in 20px, "Pourquoi cette démo" as a margin note with a 44px round portrait, reason in the first person taken from the notes only) with a margin column behind a hairline (technologies, "Tirée de la note", "Ce qui est simulé"); "Le schéma" (`components/lab-demos/diagrams.tsx`, static, server-rendered): one sentence on what the drawing shows, the drawing on a `primary-soft` panel (cards in `card`, the key element with a 2px `primary` border, petrol arrows, real labels inside the drawing), then "Comment le lire", a two-column legend behind hairlines, one sentence per part; "À vous de jouer": "À essayer" (a checklist that ticks itself as the visitor does each thing) beside "Les mots utilisés" (a closed `details` glossary), then the experiment in a 12px `card` frame; "Démo précédente / suivante" through the demos of the same note, like project pages. Diagrams: before and after packaging (two panels: on the left the VPN server with Docker on `muted`, the compose file as a chip, the dashed container with its network rights, the agent inside; on the right apt or dnf, the .deb or .rpm package with its contents and dependencies, systemd, the agent), fleet (back office, API, a branch to three servers with agent, systemd and WireGuard), installation (the four numbered steps inside a dashed "Sur le VPS" frame, the API serving the package beside step 2, the checksum stop in `destructive`), IP allocation (a /28 as sixteen slots: reserved dashed on `muted`, server filled `primary`, devices outlined, the freed slot with an amber `signal` ring as the next one to be given), Protobuf (one field in JSON and in Protobuf, segments drawn to one scale), gRPC (four small sequence diagrams, API left, agent right, time going down). Code blocks in the demos have a "Copier" button. Six demos, all computed in the browser: before and after packaging (Avant / Après segmented control, the steps done one at a time with "Faire l'étape suivante", the server building up beside them; once both are done, "Comparer les deux serveurs" shows both servers side by side, then "Ce que ça change"), the agent fleet (the central API on a `primary-soft` card with "Envoyer une configuration" and "Publier une nouvelle version de l'API", a petrol line down to the server cards: name, system, status dot (`primary` online, `signal` while something happens, `destructive` when the agent is down), configuration number and build; "Simuler un crash" shows systemd restarting the agent, "Relancer la commande" updates an outdated agent; an add-server form like the back office; a short log, newest first), agent installation (distro and arch segmented controls, real SHA-256 of a dummy package, a checkbox to damage it; the running step gets an amber `signal` ring, done steps a petrol check, a failed checksum a `destructive` cross), IP allocation (IPv4/IPv6 inputs, first free address, server wg0.conf with made-up keys), JSON vs Protobuf (real proto3 encoding, size bars, hex dump, byte table: tag in bold, length in grey, hovered field on `primary-soft`) and the four gRPC call kinds (example contract with the selected rpc highlighted, messages sent one at a time by a button). Every demo states what it simulates; example contracts never pretend to be the platform's. Demos move only when the visitor acts (the installation spinner turns only while a run the visitor started is going, and stops under reduced motion). Each action is announced to screen readers in one sentence (`role="status"`). Code, config files and bytes use the system monospace inside `CodeBlock`, the only monospace on the site: it is real code, never a label. "Notes": one row per note (project in `primary`, status in `muted`; title, summary, "Ce que ça montre", stack, "À essayer" links to the note's demos, "Lire la note").

Each note has its own page `/lab/<lab>/<note>` (`components/lab-note.tsx`, share image `opengraph-image.tsx` with a console "Lab" tag): the breadcrumb, then a sticky margin column (the note title as `h1`, "Ce que ça montre", then status and technologies behind a hairline) and a reading column capped at 68ch: summary in 20px, "Le contexte", free titled sections (`sections`, hairline lists, e.g. "Pourquoi Go"), "Ce que j'ai mis en place" (hairline list), an optional numbered sequence (petrol-soft circles, used only for real ordered steps) and "Ce que ça change" (two-column list with petrol check icons), then "Les démos" (see above). "Autres notes de ce lab" closes the page. "Ce que ça montre" (`proves`) names skills a recruiter is looking for, not tools alone. The Lab is not a home section: it sits apart on the right of the header (`components/lab-link.tsx`), before the FR / EN switch and a hairline, as a small console screen: `foreground` fill and `background` text in light mode, `card` fill with a `border` inner ring in dark mode (an inverted white block would shout), 8px radius, terminal icon, block cursor. The cursor turns amber `signal` on `/lab` and blinks only while the link is hovered or focused (off under reduced motion). Phones show it at the end of the mobile menu instead, same surface, with "Mes notes techniques" under the label. No monospace, no green.

### Certifications
Each certification is attached to what it proves (`data/certifications.ts`: `skill` matches an item of `data/skills.ts`, `stack` the names used in project stacks). `CertifiedMark` (`components/certified-mark.tsx`) adds a small petrol "certifié" link with a badge-check icon, opening the Dyma verification page, next to: certified skills in Compétences (the skill itself turns `foreground`), and certified technologies on project pages. Under the skills, "Certifications" is a grid of certificate thumbnails (2 columns, 4 from `md`) with a badge-check and the title underneath, plus a small "Dyma, vérifier" link. A thumbnail opens the certificate large in a shadcn `Dialog` (title, issuer, image on a `muted` panel, "Vérifier sur Dyma" button). The hero facts list ends with "Certifications : 8, dont Kubernetes, Go et GitLab CI/CD", linking to `#certifications`.

### Background
Under the experience timeline, behind a hairline: "Formation" and "Langues" from `profile.background`, label in `muted-foreground` over the value in `font-display` 20px, two columns from `sm`.

### Architecture diagram
`components/architecture-diagram.tsx`, used for projects without screenshots (`project.architecture`, e.g. the VPN platform): on a `primary-soft` panel, the central service in a card with a petrol border, a vertical petrol line through a pill naming the protocol, then three remote nodes (illustrative, not a count). `compact` fills the 16:10 list thumbnail; the full version replaces the cover on the project page. The schema is described to screen readers in a `figcaption`.

### Projects and Lab
Projets shows whole products (need, role, setting, period, screenshots or diagram); Lab holds notes on one technical problem. They cross-link: every note whose `projectSlug` matches a project is listed under that project's highlights ("Note technique dans le Lab", or "Notes techniques dans le Lab" when there are several), and `projectSlug` turns the note's project label into a link to the project page.

### Facts list
A `dl` of label (`muted`) over value, used in project rows and on project pages. Missing facts are omitted, never invented.

### Booking dialog
Two booking services are supported (`getBookingConfig()` in `data/profile.ts`): Calendly (`NEXT_PUBLIC_CALENDLY_URL`) and Cal.com (`NEXT_PUBLIC_CALCOM_URL`); `NEXT_PUBLIC_BOOKING_PROVIDER` picks the default (`calendly` unless set to `calcom`). Adding `?rdv=calcom` or `?rdv=calendly` to a page URL switches service for that visit, to compare both. Calendly keeps the 40rem dialog (full-bleed card); Cal.com gets a wider dialog (up to 64rem) for its two-column month view, follows the site's light or dark theme, and its colors come from the Cal.com appearance settings. Both report their height to size the dialog.
`components/booking-dialog.tsx`: "Planifier un échange" (outline `xl` button with a calendar icon) next to the CV button in the hero. Opens a shadcn `Dialog` sized to Calendly: 40rem (640px) wide at most, the width under which Calendly drops its gray side margins, and as tall as the height Calendly reports via `postMessage` (`calendly.page_height`, needs `embed_domain`), capped to the viewport with inner scrolling with a compact header (petrol calendar tile, title, one line of context), no footer, a skeleton calendar while loading, then the Calendly page in an iframe (colors set to the site palette). The dialog stays mounted while closed and the iframe is created once the page has loaded and the browser is idle, or earlier when the button is hovered or focused, so the agenda is ready when the dialog opens. With Cal.com, once a meeting type is picked (`eventTypeSelected` / `__routeChanged` from its own iframe), the calendar tile in the header turns into a 40px outlined back-arrow button ("Revenir aux types d'échange") that reloads the embed on the list of meeting types. Hidden when `NEXT_PUBLIC_CALENDLY_URL` is empty.

### Navigation
In the hero aside, LinkedIn, GitLab and GitHub (in that order: LinkedIn is what a recruiter opens) as 40px outlined icon buttons (`border`, `muted-foreground` to `foreground` with `muted` fill on hover, brand marks from `components/brand-icons.tsx`): under the facts on desktop, under the two facts beside the portrait on mobile.

A two-segment FR / EN switch sits on the right of the header, before the mobile menu button: a pill track (`border`, `muted/60` fill, `text-caption` semibold) where the current language is filled (`foreground` on `background`, inverted in dark mode) and the other is a link to the same page in that language, labelled in the target language for screen readers. The group is named "Langue" / "Language". Switching keeps the reading position.
On phones and tablets a menu button opens a shadcn `Sheet` (`components/mobile-nav.tsx`) with the name, the section links and the CV button. Project filter on `/projets`: shadcn `ToggleGroup`, single choice, selected item in `primary`.
Sticky header. Transparent over the top of the page, then `bg/85`, blur and a bottom border after 48px of scroll, driven by a CSS scroll timeline (`.site-header` in `globals.css`); browsers without scroll-driven animations keep the solid header. Left: the name and the role and tagline underneath (shown on `sm` and from `lg`, hidden on `md` where the nav needs the room). Center (desktop): section anchors from `components/site-nav.tsx`; the section in view (IntersectionObserver, upper third of the viewport) or "Projets" on `/projets*` gets `aria-current`, ink text and a 2px petrol underline. Right: the Lab chip (from `sm`), the FR / EN switch, then the mobile menu button. No profile icons: LinkedIn, GitLab and GitHub live in the hero aside and the footer. The CV download lives in the hero and the mobile menu. The active nav is wrapped in `Suspense` with a static fallback, as Cache Components requires for `usePathname` in a layout.

### Hero
Left: the role as the `h1` (`ink`; the name lives in the header), then the pitch (`profile.intro` in `foreground`, `profile.approach` in `muted`, 17px), the CV and booking buttons, and below a hairline the live code activity: pitch, action, then proof. On phones the CV button sits in the first screen. Right (`aside`, "En bref"): the circular portrait, then the facts list from `profile.facts` (current work linking to STOOGO, availability, work mode, mobility) between hairlines. Two columns on desktop (`minmax(0,1fr)` and 16 to 21rem for the aside), 56px apart on `lg` and 96px from `xl`. On mobile the portrait sits beside the first two facts, above the heading.

### Footer
Continues the contact band in deep petrol (`region`, `on-region`, `on-region-muted`), so every page ends on one block. One row: identity on the left (name, then role and tagline; the pitch stays in the hero, never repeated), LinkedIn / GitLab / GitHub (same order as the hero) as 40px outlined icon buttons on the right. Bottom row behind a 15% `on-region` rule: copyright and a 36px outlined up-arrow button back to the top (labelled for screen readers). No page or contact lists: the header and the contact band already carry them.

### Contact band
`ContactCta`, rendered through `Section tone="region"` at the end of every page. "Un projet ensemble ?" in `font-display`, one paragraph (open to new opportunities, work mode, mobility, invitation to write or book, max 52ch), then actions on the band: "M'écrire" (light `on-region` button), "Planifier un échange" (the `BookingDialog` trigger restyled as an outlined `on-region` button, only when Calendly is configured). Focus outlines switch to `on-region` inside it.

### Do:
- Lead with real screenshots, live links and verifiable certificates.
- Keep copy in the first person, sentence case, plain French.
- Use tokens (`bg-accent`, `text-muted`, `bg-region`), never raw hex in components.
- Keep one orchestrated motion: the hero entrance (`.hero-in`), starting from a visible state, disabled under `prefers-reduced-motion`.
- Verify both themes and mobile after visual changes.

### Don't:
- Don't use em dashes (—), middle dots (·), decorative ellipses or "→" in copy.
- Don't add eyebrow/kicker labels above headings, stat tiles, pulsing availability badges, or numbered section markers. A ping only marks data that is genuinely live (the code activity), once per real check.
- Don't chop content into identical shadowed cards or add hover zoom on every image.
- Don't add a third accent hue, gradients, glass effects or monospace labels.
- Don't invent facts: no testimonials, metrics, client logos or availability dates.
