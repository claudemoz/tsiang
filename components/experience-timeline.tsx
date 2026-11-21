import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { getExperiences } from "@/data/experience";
import { getProfile } from "@/data/profile";
import { getProject } from "@/data/projects";
import { getDictionary } from "@/lib/dictionaries";
import { localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { StackLine, textLink } from "./primitives";

export async function ExperienceTimeline() {
  const lang = await getLocale();
  const t = getDictionary(lang);

  return (
    <ol className="divide-y divide-border">
      {getExperiences(lang).map((xp) => (
        <li key={`${xp.company}-${xp.period}`} className="py-10 first:pt-0 last:pb-0">
          <p className={`flex items-center gap-2 text-[15px] ${xp.current ? "font-medium text-signal" : "text-muted-foreground"}`}>
            {xp.current ? <span aria-hidden className="size-2 rounded-full bg-signal" /> : null}
            {xp.period}
            {xp.current ? <span className="sr-only">{t.a11y.currentRole}</span> : null}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{xp.role}</h3>
          <p className="mt-1 text-lg">
            {xp.url ? (
              <a href={xp.url} target="_blank" rel="noopener noreferrer" className={textLink}>
                {xp.company}
              </a>
            ) : (
              xp.company
            )}
            {xp.place ? <span className="text-muted-foreground">, {xp.place}</span> : null}
          </p>
          <p className="mt-4 max-w-[65ch] text-pretty">{xp.summary}</p>
          {xp.highlights.length > 0 ? (
            <TaskList items={xp.highlights} more={t.experience.showMore} className="mt-4 max-w-[65ch]" />
          ) : null}
          {xp.groups?.map((group) => (
            <div key={group.title} className="mt-6 max-w-[65ch]">
              <h4 className="font-medium">{group.title}</h4>
              <TaskList items={group.items} more={t.experience.showMore} className="mt-2" />
            </div>
          ))}
          {xp.stack.length > 0 ? <StackLine items={xp.stack} className="mt-4" label={t.skills.technologies} /> : null}
          {xp.project ? (
            <p className="mt-4 text-[15px]">
              <Link href={localePath(lang, `/projets/${xp.project}`)} className={textLink}>
                {t.experience.seeProject} {getProject(xp.project, lang)?.title}
              </Link>
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** Lists longer than this show their first items and fold the rest. */
const VISIBLE_TASKS = 4;

/**
 * A role's tasks. Long lists (the Almamater role has 20) show the first four and fold the rest into
 * a native disclosure, so the page reads like a CV and not a job description; everything stays in
 * the HTML for search engines and Ctrl+F.
 */
function TaskList({ items, more, className = "" }: { items: string[]; more: (n: number) => string; className?: string }) {
  const list = "list-disc space-y-1.5 pl-5 text-muted-foreground marker:text-border";
  const folded = items.length > VISIBLE_TASKS + 1;
  const shown = folded ? items.slice(0, VISIBLE_TASKS) : items;
  const rest = folded ? items.slice(VISIBLE_TASKS) : [];
  return (
    <div className={className}>
      <ul className={list}>
        {shown.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      {rest.length > 0 ? (
        <details className="group">
          {/* Like "read more": once open, the full list simply continues and the toggle goes away. */}
          <summary className="mt-2 inline-flex cursor-pointer list-none items-center gap-1 rounded-sm text-[15px] font-medium text-primary transition-colors group-open:hidden hover:text-foreground [&::-webkit-details-marker]:hidden">
            <ChevronDownIcon aria-hidden className="size-4" />
            {more(rest.length)}
          </summary>
          <ul className={`mt-1.5 ${list}`}>
            {rest.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

/** Education and languages, under the roles: the two things recruiters filter on after experience. */
export async function Background() {
  const lang = await getLocale();
  return (
    <dl className="mt-12 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
      {getProfile(lang).background.map((item) => (
        <div key={item.label}>
          <dt className="text-[15px] text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 font-display text-xl font-semibold tracking-tight">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
