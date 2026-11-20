"use client";

import { useSyncExternalStore } from "react";
import { getDictionary } from "@/lib/dictionaries";
import { intlLocale, type Locale } from "@/lib/i18n";

const formats = Object.fromEntries(
  (["fr", "en"] as const).map((l) => [
    l,
    {
      absolute: new Intl.DateTimeFormat(intlLocale[l], { day: "numeric", month: "long", timeZone: "Europe/Paris" }),
      relative: new Intl.RelativeTimeFormat(l, { numeric: "auto" }),
    },
  ]),
) as Record<Locale, { absolute: Intl.DateTimeFormat; relative: Intl.RelativeTimeFormat }>;

function format(iso: string, precise: boolean, now: number, lang: Locale) {
  const { absolute, relative } = formats[lang];
  const t = getDictionary(lang).relativeTime;
  const then = new Date(iso).getTime();
  const minutes = Math.round((now - then) / 60000);
  if (precise && minutes < 60) return minutes < 1 ? t.justNow : relative.format(-minutes, "minute");
  if (precise && minutes < 24 * 60) return relative.format(-Math.round(minutes / 60), "hour");
  const days = Math.floor((now - then) / 86400000);
  if (days < 7) return relative.format(-Math.max(0, days), "day");
  return `${t.on} ${absolute.format(then)}`;
}

/** A minute clock shared by every RelativeTime on the page. */
const clock = {
  subscribe(onTick: () => void) {
    const id = setInterval(onTick, 60_000);
    return () => clearInterval(id);
  },
  // Rounded to the minute so the snapshot stays stable between ticks.
  now: () => Math.floor(Date.now() / 60_000) * 60_000,
  // During server render and hydration there is no clock: the absolute date is shown.
  server: () => null,
};

/**
 * Server and hydration render the date ("le 4 novembre"), identical on both sides.
 * Once hydrated it switches to a relative time and refreshes every minute.
 */
export function RelativeTime({ iso, precise, lang }: { iso: string; precise: boolean; lang: Locale }) {
  const now = useSyncExternalStore(clock.subscribe, clock.now, clock.server);
  const { absolute } = formats[lang];
  const on = getDictionary(lang).relativeTime.on;

  return (
    <time dateTime={iso} title={absolute.format(new Date(iso))}>
      {now === null ? `${on} ${absolute.format(new Date(iso))}` : format(iso, precise, now, lang)}
    </time>
  );
}
