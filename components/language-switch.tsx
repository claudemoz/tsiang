"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { localePath, stripLocale, type Locale } from "@/lib/i18n";

/** Where the visitor was when switching language, so the other version opens at the same spot. */
const SCROLL_KEY = "lang-switch-scroll";

function rememberScroll(target: string) {
  try {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    sessionStorage.setItem(
      SCROLL_KEY,
      JSON.stringify({ path: target, ratio: max > 0 ? window.scrollY / max : 0, y: window.scrollY }),
    );
  } catch {
    // Private mode or storage disabled: the page simply opens at the top.
  }
}

/** On the page reached through the switch, jump (no smooth scroll) back to the same reading position. */
function useRestoreScroll() {
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SCROLL_KEY);
      if (!raw) return;
      sessionStorage.removeItem(SCROLL_KEY);
      const { path, ratio, y } = JSON.parse(raw) as { path: string; ratio: number; y: number };
      if (path !== window.location.pathname) return;
      // The two versions have the same structure but not the same text length: keep the same
      // proportion of the page, which lands on the same section.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const top = max > 0 && ratio > 0 ? Math.round(ratio * max) : y;
      window.scrollTo({ top, behavior: "instant" });
    } catch {
      // Ignore malformed or unavailable storage.
    }
  }, []);
}

const LOCALES: Locale[] = ["fr", "en"];

const trackClass =
  "inline-flex h-9 items-center gap-0.5 rounded-full border border-border bg-muted/60 p-0.5 text-caption font-semibold tracking-wide";
const segmentClass = "inline-flex h-full min-w-9 items-center justify-center rounded-full px-2 transition-colors sm:px-2.5";
const currentClass = `${segmentClass} bg-foreground text-background shadow-sm`;
const otherClass = `${segmentClass} text-muted-foreground hover:bg-background hover:text-foreground`;

type SwitchProps = {
  lang: Locale;
  /** Accessible label in the target language, e.g. "View the site in English". */
  label: string;
  /** Name of the control in the current language, e.g. "Langue". */
  groupLabel: string;
  className?: string;
};

/**
 * Two-segment FR / EN switch: the current language is filled, the other one is a link to the same
 * page in that language. The browser pathname has no "/fr" prefix while the prerender sees one:
 * stripLocale makes both agree.
 */
export function LanguageSwitch(props: SwitchProps) {
  useRestoreScroll();
  const target: Locale = props.lang === "fr" ? "en" : "fr";
  const href = localePath(target, stripLocale(usePathname() ?? "/"));
  return <Segments {...props} href={href} onNavigate={() => rememberScroll(href)} />;
}

/** Static fallback while the pathname is unknown (prerender): points to the other language's home. */
export function LanguageSwitchFallback(props: SwitchProps) {
  const target: Locale = props.lang === "fr" ? "en" : "fr";
  return <Segments {...props} href={localePath(target, "/")} />;
}

function Segments({
  lang,
  label,
  groupLabel,
  className = "",
  href,
  onNavigate,
}: SwitchProps & { href: string; onNavigate?: () => void }) {
  return (
    <div role="group" aria-label={groupLabel} className={`${trackClass} ${className}`}>
      {LOCALES.map((l) =>
        l === lang ? (
          <span key={l} aria-current="true" lang={l} className={currentClass}>
            {l.toUpperCase()}
          </span>
        ) : (
          <Link
            key={l}
            href={href}
            scroll={false}
            onClick={onNavigate}
            hrefLang={l}
            lang={l}
            aria-label={label}
            title={label}
            className={otherClass}
          >
            {l.toUpperCase()}
          </Link>
        ),
      )}
    </div>
  );
}
