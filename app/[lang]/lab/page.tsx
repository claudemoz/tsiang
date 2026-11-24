import type { Metadata } from "next";
import Link from "next/link";
import { getLabCategories, getLabNotesForLab, getLabs, labCategoryLabel, labPath, type Lab } from "@/data/lab";
import { getLabDemosForLab } from "@/data/lab-demos";
import { ContactCta } from "@/components/contact-cta";
import { LabFilter } from "@/components/lab-filter";
import { ProvesList } from "@/components/lab-note";
import { Container, textLink } from "@/components/primitives";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(props: PageProps<"/[lang]/lab">): Promise<Metadata> {
  const { lang: raw } = await props.params;
  const lang = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  return { title: t.meta.labTitle, description: t.meta.labDescription, alternates: alternatesFor(lang, "/lab") };
}

/** Unique values, in first-seen order. */
const unique = <T,>(items: T[]) => [...new Set(items)];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * The Lab: one row per lab (résumé layout), with a category tab bar above (every category of
 * `labCategories` in data/lab.ts, empty ones included). Notes and demos live inside each lab.
 */
export default async function LabIndexPage() {
  const lang = await getLocale();
  const t = getDictionary(lang);

  return (
    <>
      <Container className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">{t.lab.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
          {t.lab.introBefore}{" "}
          <Link href={localePath(lang, "/projets")} className={textLink}>
            {t.lab.introLink}
          </Link>
          .
        </p>
      </Container>

      <Container className="pb-20">
        <LabFilter
          categories={getLabCategories(lang)}
          labels={{ aria: t.lab.filterAria, all: t.projects.filterAll, shown: t.lab.filterShown, empty: t.lab.filterEmpty }}
          items={getLabs(lang).map((lab) => ({
            key: lab.slug,
            category: lab.category,
            row: <LabRow lab={lab} lang={lang} t={t} />,
          }))}
        />
      </Container>

      <ContactCta />
    </>
  );
}

/** One lab: status, category and counts in the margin column; title, summary, what it shows, technologies. */
function LabRow({ lab, lang, t }: { lab: Lab; lang: Locale; t: Dictionary }) {
  const href = labPath(lang, lab.slug);
  const notes = getLabNotesForLab(lab.slug, lang);
  const demos = getLabDemosForLab(lab.slug);
  return (
    <article aria-labelledby={`${lab.slug}-titre`} className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-1 text-[15px] lg:col-span-4">
        <p className="font-medium">{labCategoryLabel(lab.category, lang)}</p>
        {lab.status ? <p className="text-muted-foreground">{lab.status}</p> : null}
        <p className="pt-2">{plural(notes.length, t.lab.noteOne, t.lab.noteMany)}</p>
        {demos.length > 0 ? <p>{plural(demos.length, t.labDemos.demoOne, t.labDemos.demoMany)}</p> : null}
      </div>
      <div className="max-w-[68ch] lg:col-span-8">
        <h2 id={`${lab.slug}-titre`} className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          <Link href={href} className="transition-colors hover:text-primary">
            {lab.title}
          </Link>
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-pretty">{lab.summary}</p>
        <h3 className="mt-6 text-[15px] text-muted-foreground">{t.lab.proves}</h3>
        <ProvesList
          items={unique(notes.flatMap((n) => n.proves))}
          className="mt-3 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:gap-y-2.5"
        />
        <p className="mt-6 text-[15px] text-muted-foreground">{unique(notes.flatMap((n) => n.stack)).join(", ")}</p>
        <Link
          href={href}
          className={`mt-6 inline-block text-[15px] ${textLink}`}
          aria-label={`${t.lab.openLab}${lang === "fr" ? " :" : ":"} ${lab.title}`}
        >
          {t.lab.openLab}
        </Link>
      </div>
    </article>
  );
}
