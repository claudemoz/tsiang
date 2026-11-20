import { cacheLife, cacheTag } from "next/cache";

/**
 * Code activity, volume only.
 * GitLab: the public contribution calendar (counts per day, private contributions included
 * when "Include private contributions on my profile" is enabled). With an optional read-only
 * GITLAB_TOKEN, the time of the latest event is read too (timestamp only, nothing else).
 * GitHub: public events of the account, reduced to counts per day.
 * Never project names, commit messages or code.
 */

export type CodeActivity = {
  /** First day of the calendar (a Monday, UTC, YYYY-MM-DD). */
  start: string;
  /**
   * Contributions per day from `start`, oldest first: always WEEKS * 7 entries, the last week
   * containing today. Future days are -1. A plain number list keeps the page and API payload small.
   */
  counts: number[];
  total: number;
  /** Most recent activity. `precise` is false when only the day is known (GitLab calendar). */
  last: { iso: string; precise: boolean } | null;
  sources: ("GitLab" | "GitHub")[];
  /** When this snapshot was computed on the server. */
  checkedAt: string;
};

/** A full year, like a contribution calendar. Smaller screens show the most recent part. */
export const ACTIVITY_WEEKS = 53;
/** How often the browser asks for a fresh snapshot, and how often the server recomputes it. */
export const LIVE_REFRESH_SECONDS = 60;

const TIMEOUT_MS = 5000;
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

type DayCounts = Record<string, number>;

/** Short cache for a failed refresh: retried after 30 s, still part of the prerendered page. */
const RETRY_SOON = { stale: 300, revalidate: 30, expire: 60 * 60 } as const;

/**
 * The contribution calendar only changes a few times a day and gitlab.com rate-limits it per IP
 * (HTTP 429): it is cached on its own for 5 minutes. A failure returns null with a 30 s lifetime
 * (throwing inside a cached function would fail the prerender).
 */
async function loadGitLabCalendar(baseUrl: string, username: string): Promise<DayCounts | null> {
  "use cache";
  cacheTag("code-activity");
  try {
    const res = await fetch(`${baseUrl}/users/${encodeURIComponent(username)}/calendar.json`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`GitLab calendar ${res.status}`);
    const calendar = (await res.json()) as DayCounts;
    cacheLife({ stale: 300, revalidate: 300, expire: 60 * 60 * 24 * 7 });
    return Object.fromEntries(Object.entries(calendar).filter(([, n]) => n > 0));
  } catch (error) {
    console.warn("[activity]", (error as Error).message);
    cacheLife(RETRY_SOON);
    return null;
  }
}

/** Event actions that do not count as contributions on a GitLab profile. */
const NON_CONTRIBUTIONS = new Set(["destroyed", "deleted", "updated", "joined", "left", "expired"]);
const MAX_EVENT_PAGES = 30;

/**
 * Contributions per day from the authenticated events API (private projects included). Preferred
 * over the public calendar when a token is set: the calendar is rate-limited per IP
 * (`unauthenticated_traffic_per_ip`, often hit on shared hosting), the API is not. Only the event
 * dates and action names are read. Cached 5 minutes; a failure returns null for 30 s.
 */
async function loadGitLabEvents(baseUrl: string, hasToken: boolean): Promise<DayCounts | null> {
  "use cache";
  cacheTag("code-activity");
  const token = process.env.GITLAB_TOKEN;
  if (!hasToken || !token) {
    cacheLife(RETRY_SOON);
    return null;
  }
  try {
    const after = new Date(Date.now() - (ACTIVITY_WEEKS * 7 + 1) * 86_400_000).toISOString().slice(0, 10);
    const counts: DayCounts = {};
    for (let page = 1; page <= MAX_EVENT_PAGES; page++) {
      const res = await fetch(`${baseUrl}/api/v4/events?after=${after}&per_page=100&page=${page}`, {
        headers: { "PRIVATE-TOKEN": token, Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`GitLab events API ${res.status}`);
      const events = (await res.json()) as { created_at: string; action_name: string }[];
      for (const e of events) {
        if (NON_CONTRIBUTIONS.has(e.action_name)) continue;
        const key = e.created_at.slice(0, 10);
        counts[key] = (counts[key] ?? 0) + 1;
      }
      if (!res.headers.get("x-next-page")) break;
    }
    cacheLife({ stale: 300, revalidate: 300, expire: 60 * 60 * 24 * 7 });
    return counts;
  } catch (error) {
    console.warn("[activity]", (error as Error).message);
    cacheLife(RETRY_SOON);
    return null;
  }
}

/** Time of the latest GitLab event, private projects included. Needs a read_api token. */
async function loadGitLabLatest(baseUrl: string, hasToken: boolean): Promise<string | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: LIVE_REFRESH_SECONDS, expire: 60 * 60 * 24 });
  cacheTag("code-activity");

  const token = process.env.GITLAB_TOKEN;
  if (!hasToken || !token) return null;
  try {
    const res = await fetch(`${baseUrl}/api/v4/events?per_page=1`, {
      headers: { "PRIVATE-TOKEN": token, Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const [event] = (await res.json()) as { created_at: string }[];
    return event?.created_at ?? null;
  } catch {
    return null;
  }
}

type GitHubEvent = { type: string; created_at: string; payload?: { size?: number; distinct_size?: number } };

/**
 * GitHub is cached on its own for 5 minutes: without a token the API allows 60 requests per hour,
 * and public side projects do not need minute precision.
 */
async function loadGitHub(username: string): Promise<{ counts: DayCounts; latest: string | null } | null> {
  "use cache";
  cacheTag("code-activity");
  try {
    const result = await fetchGitHub(username);
    cacheLife({ stale: 300, revalidate: 300, expire: 60 * 60 * 24 });
    return result;
  } catch (error) {
    console.warn("[activity]", (error as Error).message);
    cacheLife(RETRY_SOON);
    return null;
  }
}

async function fetchGitHub(username: string): Promise<{ counts: DayCounts; latest: string | null }> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-activity",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const counts: DayCounts = {};
  let latest: string | null = null;
  // The public events API keeps 90 days and at most 300 events (3 pages of 100).
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`,
      { headers, signal: AbortSignal.timeout(TIMEOUT_MS) },
    );
    if (!res.ok) throw new Error(`GitHub events ${res.status}`);
    const events = (await res.json()) as GitHubEvent[];
    for (const e of events) {
      const n = e.type === "PushEvent" ? Math.max(1, e.payload?.distinct_size ?? e.payload?.size ?? 1) : 1;
      const key = e.created_at.slice(0, 10);
      counts[key] = (counts[key] ?? 0) + n;
      if (!latest || e.created_at > latest) latest = e.created_at;
    }
    if (events.length < 100) break;
  }
  return { counts, latest };
}

/** Last complete snapshot computed by this server, used when a refresh fails. */
let lastGood: CodeActivity | null = null;

/**
 * Reads the configuration (part of the cache key: env vars alone are not) and never throws:
 * when GitLab is unavailable it returns the last complete snapshot, so the block does not vanish.
 */
export async function getCodeActivity(): Promise<CodeActivity | null> {
  try {
    const activity = await loadCodeActivity(
      (process.env.GITLAB_URL || "https://gitlab.com").replace(/\/$/, ""),
      process.env.GITLAB_USERNAME || "",
      process.env.GITHUB_USERNAME || "claudemoz",
      Boolean(process.env.GITLAB_TOKEN),
    );
    if (activity) lastGood = activity;
    return activity ?? lastGood;
  } catch {
    return lastGood;
  }
}

async function loadCodeActivity(
  gitlabUrl: string,
  gitlabUser: string,
  githubUser: string,
  hasGitLabToken: boolean,
): Promise<CodeActivity | null> {
  "use cache";
  cacheTag("code-activity");

  const [events, gitlabLatest, github] = await Promise.all([
    loadGitLabEvents(gitlabUrl, hasGitLabToken),
    loadGitLabLatest(gitlabUrl, hasGitLabToken),
    loadGitHub(githubUser),
  ]);
  // Authenticated API first; the public calendar (per-IP rate limited) only as a fallback.
  const calendar = events ?? (gitlabUser ? await loadGitLabCalendar(gitlabUrl, gitlabUser) : null);
  // No GitLab calendar: no snapshot, retried in 30 s; getCodeActivity serves the last good one.
  if (!calendar) {
    cacheLife(RETRY_SOON);
    return null;
  }
  // Recomputed at most once a minute: the page and /api/activity both read this snapshot, and the
  // browser polls /api/activity at the same pace. `stale` stays at 5 minutes, the minimum for the
  // snapshot to be part of the route's App Shell (instant navigation).
  cacheLife({ stale: 300, revalidate: LIVE_REFRESH_SECONDS, expire: 60 * 60 * 24 });

  const sources: CodeActivity["sources"] = [];
  const merged: DayCounts = {};
  let last: CodeActivity["last"] = null;
  const consider = (iso: string | null, precise: boolean) => {
    if (!iso) return;
    // A precise timestamp wins over a day-only date of the same day.
    if (!last || iso.slice(0, 10) > last.iso.slice(0, 10) || (iso.slice(0, 10) === last.iso.slice(0, 10) && precise))
      last = { iso, precise };
  };

  sources.push("GitLab");
  for (const [day, n] of Object.entries(calendar)) merged[day] = (merged[day] ?? 0) + n;
  const lastDay = Object.keys(calendar).sort().at(-1);
  if (lastDay) consider(`${lastDay}T00:00:00Z`, false);
  consider(gitlabLatest, true);
  if (github) {
    sources.push("GitHub");
    for (const [day, n] of Object.entries(github.counts)) merged[day] = (merged[day] ?? 0) + n;
    consider(github.latest, true);
  }

  // Grid of ACTIVITY_WEEKS full weeks (Monday to Sunday), the last one containing today.
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const weekday = (todayUtc.getUTCDay() + 6) % 7; // Monday = 0
  const start = new Date(todayUtc);
  start.setUTCDate(start.getUTCDate() - weekday - (ACTIVITY_WEEKS - 1) * 7);

  const counts: number[] = [];
  for (let i = 0; i < ACTIVITY_WEEKS * 7; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    counts.push(d > todayUtc ? -1 : (merged[dayKey(d)] ?? 0));
  }
  const total = counts.reduce((sum, n) => sum + Math.max(0, n), 0);

  return { start: dayKey(start), counts, total, last, sources, checkedAt: now.toISOString() };
}
