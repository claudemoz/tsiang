import type { Locale } from "@/lib/i18n";
import { profileEn } from "./en";
import { imageSrc } from "./media";

export const profile = {
  name: "Claude Tsiangana",
  role: "Développeur fullstack",
  /** Short line under the name in the header. */
  tagline: "web, mobile et API",
  /** One sentence used for the page description and link previews. */
  summary:
    "Développeur fullstack depuis 4 ans, je conçois et livre des applications web et mobiles, de l'API à la mise en production.",
  /** Short presentation in the hero, above the note about where the code lives. */
  intro: "Je conçois et livre des applications web et mobiles complètes, de l'interface à la mise en production, avec une expertise en développement backend robuste et évolutif.",
  /** How I work, one sentence under the intro in the hero. */
  approach:
    "Avant d'écrire une fonctionnalité, je me mets à la place de la personne qui va l'utiliser : ce qu'elle veut accomplir, ce qui pourrait la freiner. Pour moi, elle n'est terminée que lorsqu'elle lui simplifie vraiment la tâche.",
  /** Quick facts shown beside the portrait in the hero, for a recruiter's first scan. */
  facts: [
    { label: "En ce moment", value: "Je développe STOOGO, en production", href: "/projets/stoogo" },
    // { label: "Disponibilité", value: "Immédiate" },
    { label: "Mode de travail", value: "Sur site, hybride ou télétravail" },
    { label: "Mobilité", value: "France, ouvert au déménagement" },
    { label: "Certifications", value: "8, dont Kubernetes, Go et GitLab CI/CD", href: "/#certifications" },
  ],
  /** Background shown under the experience timeline. */
  background: [
    { label: "Formation", value: "Bac+5 en systèmes d'information" },
    { label: "Langues", value: "Français, anglais" },
  ],
  /** Calendly booking page, e.g. https://calendly.com/ton-nom/30min. The button hides when empty. */
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  /** Cal.com booking page, e.g. https://cal.com/ton-nom/30min. */
  calcom: process.env.NEXT_PUBLIC_CALCOM_URL ?? "",
  /** Which booking service the button opens: "calendly" (default) or "calcom". */
  bookingProvider: process.env.NEXT_PUBLIC_BOOKING_PROVIDER ?? "calendly",
  email: "claudetsiangana@gmail.com",
  github: "https://github.com/claudemoz",
  gitlab: "https://gitlab.com/claudetsiangana",
  linkedin: "https://www.linkedin.com/in/claude-tsiangana-1164371b3/",
  cv: "/cv/CV-Claude-Tsiangana-Developpeur-Full-stack.pdf",
  photo: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199573/tsiang.fr/profile/photo_njy3ls.webp", 1008, 1066),
  siteUrl: "https://tsiang.fr",
} as const;

export type Profile = typeof profile;
type Fact = { label: string; value: string; href?: string };

/** Profile with its text in the given locale (links, images and contact details are shared). */
export function getProfile(lang: Locale = "fr") {
  if (lang === "fr") return { ...profile, facts: profile.facts as readonly Fact[], background: profile.background as readonly Fact[] };
  return {
    ...profile,
    role: profileEn.role,
    tagline: profileEn.tagline,
    summary: profileEn.summary,
    intro: profileEn.intro,
    approach: profileEn.approach,
    facts: (profile.facts as readonly Fact[]).map((f) => ({ ...f, ...(profileEn.facts[f.label] ?? {}) })),
    background: (profile.background as readonly Fact[]).map((f) => ({ ...f, ...(profileEn.background[f.label] ?? {}) })),
  };
}

export type BookingProvider = "calendly" | "calcom";
export type BookingConfig = { provider: BookingProvider; urls: Partial<Record<BookingProvider, string>> };

/**
 * Booking setup for the "Prendre rendez-vous" button, or null when no service is configured.
 * The configured provider wins when its URL is set; otherwise whichever service has a URL.
 */
export function getBookingConfig(): BookingConfig | null {
  const urls: BookingConfig["urls"] = {};
  if (profile.calendly) urls.calendly = profile.calendly;
  if (profile.calcom) urls.calcom = profile.calcom;
  const wanted: BookingProvider = profile.bookingProvider === "calcom" ? "calcom" : "calendly";
  const provider: BookingProvider | undefined = urls[wanted] ? wanted : urls.calendly ? "calendly" : urls.calcom ? "calcom" : undefined;
  return provider ? { provider, urls } : null;
}
