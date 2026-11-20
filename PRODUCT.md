# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters, talent acquisition and hiring managers (tech leads, CTOs) screening a fullstack developer for a **CDI** (permanent) position. They arrive from a CV, a LinkedIn message or a job application, often on mobile or between two calls, and decide in under a minute whether to book an interview.

Their job on the site: confirm the profile matches the role (stack, seniority, scope), check that the work is real (shipped products, screenshots, live links, verifiable certifications), then get the CV or contact details.

## Product Purpose

Personal portfolio of Claude Tsiangana, fullstack developer (web, mobile, API, DevOps, AI integration), about 4 years of experience in companies and freelance. It exists to turn a recruiter's quick visit into an interview request for a CDI.

Success: the visitor downloads the CV, emails or calls, or opens LinkedIn.

## Positioning

A developer who delivers whole products end to end and has shipped them to production: founder of STOOGO (React Native app, Angular back-office, Go backend, OpenAI features, OTA deployments), nearly four years on the Almamater school management suite at Agence TILD, a mentoring platform for Orient'Ex, and OpenPay, the mobile payment aggregator for Central Africa, co-founded and still developed by the owner (since 2019, migrated from Java/Angular to Node.js/Vue 3). Range covers frontend (React, Angular, Vue/Nuxt), mobile (React Native/Expo), backend (Node/NestJS, Go, Spring Boot, Symfony) and infrastructure (Docker, Kubernetes, GitLab CI/CD, Azure/AWS).

## Operating Context

- Open to on-site, hybrid or full remote work; no location constraint stated.
- Visitors compare the site against the PDF CV and LinkedIn profile, so facts (dates, employers, stack) must stay consistent with them.
- Site domain: tsiang.fr.

## Capabilities and Constraints

- Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, TypeScript. All pages statically prerendered; no backend, no contact form.
- Content lives in typed data files: `data/profile.ts`, `data/projects.ts`, `data/experience.ts`, `data/skills.ts`, `data/certifications.ts`.
- Routes: `/` (home), `/projets` (filterable project index), `/projets/[slug]` (one page per project), plus sitemap, robots and a generated Open Graph image.
- **Languages: French and English.** French at the root URLs, English under `/en`. Both versions must say the same things. The CV PDF exists in French only.

## Brand Commitments

- Voice: first person, plain and direct, sentence case. No marketing superlatives.
- The owner explicitly rejected AI-template tells: no em dashes (—), no middle-dot separators (·), no ellipses as decoration, no arrows appended to links, no pulsing "available" badges, no big-number stat tiles.

## Evidence on Hand

- Portrait: `public/images/profile/photo.png`.
- CV (PDF): `public/cv/CV-Claude-Tsiangana-Developpeur-Full-stack.pdf`.
- Real project screenshots for 11 projects: `public/images/projects/`.
- 8 Dyma certificates with public verification URLs: `public/images/certifications/`, links in `data/certifications.ts`.
- Live links: stoogo.com, orient-ex.org, openpay.cg, Gestache demo, Swagger docs of the appointment API. GitHub (claudemoz) and LinkedIn profiles.
- Client/employer and period are only known for STOOGO, Almamater, Orient'Ex and OpenPay; the 7 other projects have none on record.
- None exist, do not fabricate: testimonials, recommendations, client logos, metrics (users, revenue, performance), response-time promises, salary or availability dates.

## Product Principles

1. A recruiter must understand who, what stack and how to contact within the first screen.
2. Every claim is backed by something checkable: a screenshot, a live link, a certificate, a dated role.
3. Real work leads; the interface stays out of the way of the projects.
4. Sounds like a person, not a template.
5. French and English versions say the same things.

## Accessibility & Inclusion

WCAG 2.1 AA as the baseline: keyboard navigation, visible focus, sufficient contrast in light and dark modes, reduced motion respected, descriptive alt text on every screenshot.
