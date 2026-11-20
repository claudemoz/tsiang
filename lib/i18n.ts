/**
 * Locales. French is the default and lives at the root (/, /projets…); English lives under /en.
 * proxy.ts rewrites unprefixed paths to /fr internally and redirects /fr/… to the clean URL.
 */
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Public path for a locale: "/projets" in French, "/en/projets" in English. */
export function localePath(lang: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Strips the locale prefix from a browser or server pathname ("/en/lab" and "/fr/lab" give "/lab"). */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(fr|en)(?=\/|$)/);
  if (!match) return pathname || "/";
  return pathname.slice(match[0].length) || "/";
}

/** BCP 47 tags for <html lang>, Intl and Open Graph. */
export const htmlLang: Record<Locale, string> = { fr: "fr", en: "en" };
export const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };
export const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };
export const localeName: Record<Locale, string> = { fr: "Français", en: "English" };

/** hreflang alternates for a path that exists in every locale ("/", "/projets", "/lab"…). */
export function alternatesFor(lang: Locale, path: string) {
  return {
    canonical: localePath(lang, path),
    languages: {
      fr: localePath("fr", path),
      en: localePath("en", path),
      "x-default": localePath("fr", path),
    },
  };
}
