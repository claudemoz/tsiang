import { LIVE_REFRESH_SECONDS, getCodeActivity } from "@/lib/activity";
import { getLocale } from "@/lib/locale";
import { LiveCodeActivity } from "./live-code-activity";

/** Server entry: renders the latest snapshot, then the client keeps it live. */
export async function CodeActivity({ className = "" }: { className?: string }) {
  const [activity, lang] = await Promise.all([getCodeActivity(), getLocale()]);
  // GitHub alone shows only public side projects and would undersell the real volume:
  // the block appears once the GitLab calendar (private work included) is available.
  if (!activity || !activity.sources.includes("GitLab")) return null;
  return <LiveCodeActivity initial={activity} lang={lang} refreshSeconds={LIVE_REFRESH_SECONDS} className={className} />;
}
