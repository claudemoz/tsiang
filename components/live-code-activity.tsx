"use client";

import { useEffect, useRef, useState } from "react";
import type { CodeActivity } from "@/lib/activity";
import { profile } from "@/data/profile";
import { getDictionary } from "@/lib/dictionaries";
import { intlLocale, type Locale } from "@/lib/i18n";
import { RelativeTime } from "./relative-time";

const GITLAB_URL = profile.gitlab;

/** Date and number formats per locale, built once. */
const formats = Object.fromEntries(
  (["fr", "en"] as const).map((l) => [
    l,
    {
      shortDate: new Intl.DateTimeFormat(intlLocale[l], { day: "numeric", month: "short", timeZone: "UTC" }),
      monthName: new Intl.DateTimeFormat(intlLocale[l], { month: "short", timeZone: "UTC" }),
      number: new Intl.NumberFormat(intlLocale[l]),
    },
  ]),
) as Record<Locale, { shortDate: Intl.DateTimeFormat; monthName: Intl.DateTimeFormat; number: Intl.NumberFormat }>;
const WEEKS_SM = 40;
const WEEKS_BASE = 18;
const FLASH_MS = 2400;

/**
 * One calendar for every screen: older weeks are hidden with CSS (18 weeks, 40 from sm, all from lg).
 * Returns the breakpoint from which a week column shows, used as `data-from`.
 */
function weekFrom(index: number, total: number): "lg" | "sm" | undefined {
  if (index < total - WEEKS_SM) return "lg";
  if (index < total - WEEKS_BASE) return "sm";
  return undefined;
}

type Day = { date: string; count: number };

const DAY_MS = 86_400_000;

/** Expands the compact `start` + `counts` payload into dated days. */
function toDays(activity: CodeActivity): Day[] {
  const start = Date.parse(`${activity.start}T00:00:00Z`);
  return activity.counts.map((count, i) => ({ date: new Date(start + i * DAY_MS).toISOString().slice(0, 10), count }));
}

/** Square-root scale, so one exceptional day does not wash out every other one. */
function level(count: number, max: number) {
  if (count <= 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil(Math.sqrt(count / max) * 4)));
}

/**
 * The activity block, kept alive in the browser: it asks /api/activity for a fresh snapshot
 * every `refreshSeconds` while the tab is visible, updates the figures in place and lights up
 * the days that changed.
 */
export function LiveCodeActivity({
  initial,
  lang,
  refreshSeconds,
  className = "",
}: {
  initial: CodeActivity;
  lang: Locale;
  refreshSeconds: number;
  className?: string;
}) {
  const [activity, setActivity] = useState(initial);
  const [flashed, setFlashed] = useState<ReadonlySet<string>>(new Set());
  const [online, setOnline] = useState(true);
  const latest = useRef(initial);

  useEffect(() => {
    let flashTimer: ReturnType<typeof setTimeout> | undefined;

    async function refresh() {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/activity", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as CodeActivity;
        setOnline(true);
        if (next.checkedAt === latest.current.checkedAt) return;

        const before = new Map(toDays(latest.current).map((d) => [d.date, d.count]));
        const changed = toDays(next)
          .filter((d) => d.count > 0 && d.count !== before.get(d.date))
          .map((d) => d.date);
        latest.current = next;
        setActivity(next);
        if (changed.length > 0) {
          setFlashed(new Set(changed));
          clearTimeout(flashTimer);
          flashTimer = setTimeout(() => setFlashed(new Set()), FLASH_MS);
        }
      } catch {
        setOnline(false);
      }
    }

    const interval = setInterval(refresh, refreshSeconds * 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(interval);
      clearTimeout(flashTimer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [refreshSeconds]);

  const days = toDays(activity);
  const weeksCount = days.length / 7;
  const weeks = Array.from({ length: weeksCount }, (_, w) => days.slice(w * 7, w * 7 + 7));
  const max = Math.max(1, ...activity.counts);
  const activeDays = activity.counts.filter((n) => n > 0).length;
  const t = getDictionary(lang).activity;
  const { shortDate, monthName, number } = formats[lang];
  const total = number.format(activity.total);
  const sources = activity.sources.join(` ${t.and} `);
  const months = weeks.map((week, i) => {
    const m = new Date(week[0].date).getUTCMonth();
    const prev = i === 0 ? -1 : new Date(weeks[i - 1][0].date).getUTCMonth();
    return m !== prev && i < weeks.length - 2 ? monthName.format(new Date(week[0].date)) : "";
  });

  return (
    <section aria-labelledby="activite-titre" className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="activite-titre" className="flex items-center gap-2.5 text-[15px] font-semibold">
          {t.title}
          <span className="inline-flex items-center gap-1.5 text-caption font-normal text-muted-foreground">
            <span aria-hidden className={`live-dot ${online ? "" : "is-offline"}`} />
            {online ? t.live : t.offline}
          </span>
        </h2>
        {activity.last ? (
          <p className="text-caption text-muted-foreground">
            {t.lastActivity}{" "}
            <span className="font-medium text-foreground">
              <RelativeTime iso={activity.last.iso} precise={activity.last.precise} lang={lang} />
            </span>
          </p>
        ) : null}
      </div>
      <p className="mt-1 text-[15px] text-muted-foreground" aria-live="polite">
        <span
          key={activity.total}
          className={`font-semibold text-foreground tabular-nums ${activity.total !== initial.total ? "live-figure" : ""}`}
        >
          {total} {t.contributions}
        </span>{" "}
        {t.overYear} <span className="tabular-nums">{activeDays}</span> {t.activeDays} {sources}.
      </p>

      <div className="mt-4 overflow-hidden">
        <div
          role="img"
          aria-label={t.ariaSummary(total, activeDays)}
          className="grid w-max gap-[3px] [--cell:12px] lg:w-full lg:[--cell:minmax(0,1fr)] [--weeks:18] sm:[--weeks:40] lg:[--weeks:53]"
          style={{ gridTemplateColumns: "1.75rem repeat(var(--weeks), var(--cell))" }}
        >
          <span aria-hidden className="h-5" />
          {months.map((m, i) => (
            <span
              key={`m${i}`}
              aria-hidden
              data-from={weekFrom(i, weeksCount)}
              className="relative h-5 text-micro leading-4 text-muted-foreground"
            >
              {m ? <span className="absolute left-0 whitespace-nowrap">{m}</span> : null}
            </span>
          ))}
          {t.days.map((label, row) => (
            <Row
              key={row}
              label={label}
              cells={weeks.map((week) => week[row])}
              max={max}
              weeksCount={weeksCount}
              flashed={flashed}
              cellTitle={(count, date) =>
                `${count} ${count > 1 ? t.contributions : t.contribution} ${t.on} ${shortDate.format(new Date(date))}`
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-caption text-muted-foreground">
        <p className="text-pretty">
          {t.privateNoteBefore}{" "}
          <a href={GITLAB_URL} target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-foreground">
            GitLab
          </a>
          {t.privateNoteAfter}
        </p>
        <p aria-hidden className="flex items-center gap-1.5">
          {t.less}
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} data-level={l} className="activity-swatch" />
          ))}
          {t.more}
        </p>
      </div>
    </section>
  );
}

function Row({
  label,
  cells,
  max,
  weeksCount,
  flashed,
  cellTitle,
}: {
  label: string;
  cells: Day[];
  max: number;
  weeksCount: number;
  flashed: ReadonlySet<string>;
  cellTitle: (count: number, date: string) => string;
}) {
  return (
    <>
      <span aria-hidden className="self-center pr-1 text-micro leading-none text-muted-foreground">
        {label}
      </span>
      {cells.map((day, week) => {
        const from = weekFrom(week, weeksCount);
        if (day.count < 0) return <span key={day.date} aria-hidden data-from={from} className="activity-col" />;
        // Compact markup (368 cells): look and visibility live in globals.css, keyed by data attributes.
        return (
          <span
            key={day.date}
            aria-hidden
            data-from={from}
            data-level={level(day.count, max)}
            style={{ "--w": week } as React.CSSProperties}
            title={cellTitle(day.count, day.date)}
            className={flashed.has(day.date) ? "activity-cell is-new" : "activity-cell"}
          />
        );
      })}
    </>
  );
}
