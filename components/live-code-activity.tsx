"use client";

import { memo, useEffect, useRef, useState } from "react";
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
/** How long the "+N just now" note stays next to the total. */
const GAIN_MS = 8000;
/** Minimum time "mise à jour en cours" stays visible, and how long "à jour à l'instant" stays after. */
const CHECKING_MIN_MS = 700;
const FRESH_MS = 4000;

/** Wall clock ticking every second, null during server render and hydration. */
function useSecondClock() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

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
  // One cycle per scheduled check: restarts the countdown ring and the ping of the dot.
  const [cycle, setCycle] = useState(0);
  const [gained, setGained] = useState(0);
  // Status line next to "En direct": when the next check happens, a check running, a check just done.
  const [deadline, setDeadline] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkedAt, setCheckedAt] = useState(0);
  const latest = useRef(initial);

  useEffect(() => {
    let stopped = false;
    let nextCheck: ReturnType<typeof setTimeout> | undefined;
    let flashTimer: ReturnType<typeof setTimeout> | undefined;
    let gainTimer: ReturnType<typeof setTimeout> | undefined;

    function schedule() {
      clearTimeout(nextCheck);
      nextCheck = setTimeout(refresh, refreshSeconds * 1000);
      setDeadline(Date.now() + refreshSeconds * 1000);
      setCycle((c) => c + 1);
    }

    async function refresh() {
      // A hidden tab stops checking; coming back checks at once and starts a new cycle.
      if (document.visibilityState !== "visible") return;
      setChecking(true);
      try {
        // Keeps "mise à jour en cours" on screen long enough to be read.
        const [res] = await Promise.all([
          fetch("/api/activity", { cache: "no-store" }),
          new Promise((resolve) => setTimeout(resolve, CHECKING_MIN_MS)),
        ]);
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as CodeActivity;
        if (stopped) return;
        setOnline(true);
        if (next.checkedAt !== latest.current.checkedAt) {
          const before = new Map(toDays(latest.current).map((d) => [d.date, d.count]));
          const changed = toDays(next)
            .filter((d) => d.count > 0 && d.count !== before.get(d.date))
            .map((d) => d.date);
          const added = next.total - latest.current.total;
          latest.current = next;
          setActivity(next);
          if (changed.length > 0) {
            setFlashed(new Set(changed));
            clearTimeout(flashTimer);
            flashTimer = setTimeout(() => setFlashed(new Set()), FLASH_MS);
          }
          if (added > 0) {
            setGained(added);
            clearTimeout(gainTimer);
            gainTimer = setTimeout(() => setGained(0), GAIN_MS);
          }
        }
      } catch {
        if (!stopped) setOnline(false);
      }
      if (stopped) return;
      setChecking(false);
      setCheckedAt(Date.now());
      schedule();
    }

    function onVisibility() {
      if (document.visibilityState === "visible") refresh();
      else {
        clearTimeout(nextCheck);
        setDeadline(null);
      }
    }

    schedule();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      clearTimeout(nextCheck);
      clearTimeout(flashTimer);
      clearTimeout(gainTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refreshSeconds]);

  const t = getDictionary(lang).activity;
  const activeDays = activity.counts.filter((n) => n > 0).length;
  const total = formats[lang].number.format(activity.total);
  const sources = activity.sources.join(` ${t.and} `);

  return (
    <section aria-labelledby="activite-titre" className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h2 id="activite-titre" className="text-[15px] font-semibold">
            {t.title}
          </h2>
          <p className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <LiveIndicator online={online} cycle={cycle} seconds={refreshSeconds} />
            <span>
              <span className={online ? "font-medium text-foreground" : ""}>{online ? t.live : t.offline}</span>
              <LiveStatus online={online} checking={checking} checkedAt={checkedAt} deadline={deadline} lang={lang} />
            </span>
          </p>
        </div>
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
        {gained > 0 ? (
          <span key={`${activity.checkedAt}`} className="live-gain font-medium text-signal tabular-nums">
            {t.gained(gained)}
          </span>
        ) : null}
        {gained > 0 ? " " : null}
        {t.overYear} <span className="tabular-nums">{activeDays}</span> {t.activeDays} {sources}.
      </p>

      <ActivityCalendar activity={activity} flashed={flashed} lang={lang} label={t.ariaSummary(total, activeDays)} />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-caption text-muted-foreground">
        <p className="text-pretty">
          {t.privateNoteBefore}{" "}
          <a href={GITLAB_URL} target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-foreground">
            GitLab
          </a>
          {t.privateNoteAfter}
        </p>
        <div aria-hidden className="flex items-center gap-x-4">
          <p className="flex items-center gap-1.5">
            <span className="activity-swatch is-today" />
            {t.today}
          </p>
          <p className="flex items-center gap-1.5">
            {t.less}
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} data-level={l} className="activity-swatch" />
            ))}
            {t.more}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The words after "En direct": a countdown to the next check, then "checking", then "up to date".
 * The only part of the block that renders every second, so the 371 cells never re-render for it.
 */
function LiveStatus({
  online,
  checking,
  checkedAt,
  deadline,
  lang,
}: {
  online: boolean;
  checking: boolean;
  checkedAt: number;
  deadline: number | null;
  lang: Locale;
}) {
  const now = useSecondClock();
  const t = getDictionary(lang).activity;
  if (checking) return <>{t.checking}</>;
  if (now === null) return null;
  if (now - checkedAt < FRESH_MS) return <>{t.upToDate}</>;
  if (deadline === null) return null;
  const left = Math.max(1, Math.ceil((deadline - now) / 1000));
  return <span className="tabular-nums">{online ? t.nextUpdate(left) : t.retryIn(left)}</span>;
}

/**
 * The year grid. Memoized: it re-renders only when a check brings new counts or days flash.
 * Columns stretch to the full width on every screen; older weeks are hidden with CSS.
 */
const ActivityCalendar = memo(function ActivityCalendar({
  activity,
  flashed,
  lang,
  label,
}: {
  activity: CodeActivity;
  flashed: ReadonlySet<string>;
  lang: Locale;
  label: string;
}) {
  const t = getDictionary(lang).activity;
  const { shortDate, monthName } = formats[lang];
  const days = toDays(activity);
  const weeksCount = days.length / 7;
  const weeks = Array.from({ length: weeksCount }, (_, w) => days.slice(w * 7, w * 7 + 7));
  const max = Math.max(1, ...activity.counts);
  const today = days.findLast((d) => d.count >= 0)?.date;
  const monthOf = (i: number) => new Date(weeks[i][0].date).getUTCMonth();
  const months = weeks.map((week, i) => {
    const m = monthOf(i);
    if (i > 0 && m === monthOf(i - 1)) return "";
    // A label needs about three columns: skip a month that barely starts at either edge.
    if (i > weeks.length - 3) return "";
    if (i === 0 && monthOf(2) !== m) return "";
    return monthName.format(new Date(week[0].date));
  });
  const cellTitle = (count: number, date: string) =>
    `${count} ${count > 1 ? t.contributions : t.contribution} ${t.on} ${shortDate.format(new Date(date))}`;

  return (
    <div
      role="img"
      aria-label={label}
      className="mt-4 grid w-full gap-[3px] [--weeks:18] sm:[--weeks:40] lg:[--weeks:53]"
      style={{ gridTemplateColumns: "1.75rem repeat(var(--weeks), minmax(0, 1fr))" }}
    >
      <span aria-hidden className="h-5" />
      {months.map((m, i) => (
        <span key={`m${i}`} aria-hidden data-from={weekFrom(i, weeksCount)} className="relative h-5 text-micro leading-4 text-muted-foreground">
          {m ? <span className="absolute left-0 whitespace-nowrap">{m}</span> : null}
        </span>
      ))}
      {t.days.map((dayLabel, row) => (
        <Row
          key={row}
          label={dayLabel}
          cells={weeks.map((week) => week[row])}
          max={max}
          weeksCount={weeksCount}
          flashed={flashed}
          today={today}
          cellTitle={cellTitle}
        />
      ))}
    </div>
  );
});

/**
 * The live badge: an amber dot inside a ring that fills up until the next check, then the dot
 * sends out one ping when the check happens. Gray and still when the last check failed.
 */
function LiveIndicator({ online, cycle, seconds }: { online: boolean; cycle: number; seconds: number }) {
  return (
    <span aria-hidden className={`live-indicator ${online ? "" : "is-offline"}`}>
      <svg viewBox="0 0 16 16" className="live-ring">
        <circle cx="8" cy="8" r="6.75" pathLength={100} className="live-ring-track" />
        {online ? (
          <circle
            key={cycle}
            cx="8"
            cy="8"
            r="6.75"
            pathLength={100}
            className="live-ring-progress"
            style={{ animationDuration: `${seconds}s` }}
          />
        ) : null}
      </svg>
      <span className="live-dot" />
      {online && cycle > 0 ? <span key={cycle} className="live-ping" /> : null}
    </span>
  );
}

function Row({
  label,
  cells,
  max,
  weeksCount,
  flashed,
  today,
  cellTitle,
}: {
  label: string;
  cells: Day[];
  max: number;
  weeksCount: number;
  flashed: ReadonlySet<string>;
  today: string | undefined;
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
            data-today={day.date === today ? "" : undefined}
            style={{ "--w": week } as React.CSSProperties}
            title={cellTitle(day.count, day.date)}
            className={flashed.has(day.date) ? "activity-cell is-new" : "activity-cell"}
          />
        );
      })}
    </>
  );
}
