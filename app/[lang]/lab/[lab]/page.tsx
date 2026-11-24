import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlaskConicalIcon } from "lucide-react";
import { getLab, getLabNotesForLab, labCategoryLabel, labs, notePath } from "@/data/lab";
import { getLabDemosForNote } from "@/data/lab-demos";
import { ContactCta } from "@/components/contact-cta";
import { LabBreadcrumb } from "@/components/lab-breadcrumb";
import { LabPlatform, ProvesList } from "@/components/lab-note";
import { Container, Section, textLink } from "@/components/primitives";
import { getDictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return labs.map((l) => ({ lab: l.slug }));
}

export async function generateMetadata(props: PageProps<"/[lang]/lab/[lab]">): Promise<Metadata> {
  const { lab: slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const lab = getLab(slug, lang);
  if (!lab) return {};
  return {
    title: lab.title,
    description: lab.summary,
    alternates: alternatesFor(lang, `/lab/${lab.slug}`),
    openGraph: { title: lab.title, description: lab.summary, type: "article" },
  };
}

/** Unique values, in first-seen order. */
const unique = <T,>(items: T[]) => [...new Set(items)];

/**
 * One lab: the project it explores, what the platform does, what the whole lab shows, then its
 * notes. Demos are not listed here: each note shows its own.
 */
export default async function LabPage(props: PageProps<"/[lang]/lab/[lab]">) {
  const { lab: slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  const lab = getLab(slug, lang);
  if (!lab) notFound();
  const notes = getLabNotesForLab(lab.slug, lang);
  const stack = unique(notes.flatMap((n) => n.stack));
  const proves = unique(notes.flatMap((n) => n.proves));

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <LabBreadcrumb label={t.lab.breadcrumb} items={[{ href: localePath(lang, "/lab"), label: t.lab.title }]} />

        <header className="grid gap-10 pt-8 pb-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <h1 className="font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl">{lab.title}</h1>
            <p className="mt-5 max-w-[62ch] text-xl leading-relaxed text-pretty">{lab.summary}</p>
            <p className="mt-6 text-[15px]">
              <a href="#notes" className={textLink}>
                {notes.length} {notes.length === 1 ? t.lab.noteOne : t.lab.noteMany}
              </a>
            </p>
          </div>
          <dl className="space-y-5 border-t border-border pt-6 text-[15px] lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div>
              <dt className="text-muted-foreground">{t.lab.category}</dt>
              <dd className="mt-0.5">{labCategoryLabel(lab.category, lang)}</dd>
            </div>
            {lab.status ? (
              <div>
                <dt className="text-muted-foreground">{t.lab.status}</dt>
                <dd className="mt-0.5 font-medium">{lab.status}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground">{t.lab.technologies}</dt>
              <dd className="mt-0.5">{stack.join(", ")}</dd>
            </div>
            {lab.projectSlug ? (
              <div>
                <dt className="text-muted-foreground">{t.lab.project}</dt>
                <dd className="mt-0.5">
                  <Link href={localePath(lang, `/projets/${lab.projectSlug}`)} className={textLink}>
                    {t.lab.projectPage}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </header>
      </Container>

      <Section id="plateforme" title={lab.platformTitle ?? t.lab.platform}>
        <div className="max-w-[68ch]">
          <LabPlatform lab={lab} lang={lang} />
        </div>
      </Section>

      <Section id="ce-que-ca-montre" title={t.lab.proves}>
        <ProvesList items={proves} className="sm:grid sm:grid-cols-2 sm:gap-x-8 sm:space-y-0 sm:gap-y-3" />
      </Section>

      <Section id="notes" title={t.lab.notesTitle} intro={t.lab.notesIntro}>
        <ol className="divide-y divide-border border-y border-border">
          {notes.map((note) => {
            const count = getLabDemosForNote(note.slug).length;
            return (
              <li key={note.slug} className="py-8">
                <article aria-labelledby={`${note.slug}-titre`}>
                  <h3 id={`${note.slug}-titre`} className="font-display text-2xl font-semibold tracking-tight text-balance">
                    <Link href={notePath(lang, note)} className="transition-colors hover:text-primary">
                      {note.title}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-[65ch] leading-relaxed text-pretty">{note.summary}</p>
                  <p className="mt-3 text-[15px] text-muted-foreground">{note.stack.join(", ")}</p>
                  <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
                    <Link
                      href={notePath(lang, note)}
                      className={textLink}
                      aria-label={`${t.lab.readNote}${lang === "fr" ? " :" : ":"} ${note.title}`}
                    >
                      {t.lab.readNote}
                    </Link>
                    {count > 0 ? (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <FlaskConicalIcon aria-hidden className="size-4" />
                        {count} {count === 1 ? t.labDemos.demoOne : t.labDemos.demoMany}
                      </span>
                    ) : null}
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      </Section>

      <ContactCta />
    </>
  );
}
