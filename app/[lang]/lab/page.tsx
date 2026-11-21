import type { Metadata } from "next";
import Link from "next/link";
import { getLabNotes } from "@/data/lab";
import { ContactCta } from "@/components/contact-cta";
import { ProvesList } from "@/components/lab-note";
import { Container, textLink } from "@/components/primitives";
import { getDictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(props: PageProps<"/[lang]/lab">): Promise<Metadata> {
  const { lang: raw } = await props.params;
  const lang = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  return { title: t.meta.labTitle, description: t.meta.labDescription, alternates: alternatesFor(lang, "/lab") };
}

/** Index of the notes: one row per note, résumé layout, each opening its own page. */
export default async function LabPage() {
  const lang = await getLocale();
  const t = getDictionary(lang);
  return (
    <>
      <Container className="pt-16 pb-4 sm:pt-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">{t.lab.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
          {t.lab.introBefore}{" "}
          <Link href={localePath(lang, "/projets")} className={textLink}>
            {t.lab.introLink}
          </Link>
          .
        </p>
      </Container>

      <Container className="pt-12 pb-20">
        <ul className="divide-y divide-border border-y border-border">
          {getLabNotes(lang).map((note) => {
            const href = localePath(lang, `/lab/${note.slug}`);
            return (
              <li key={note.slug}>
                <article aria-labelledby={`${note.slug}-titre`} className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-12">
                  <div className="text-[15px] lg:col-span-4">
                    {note.projectSlug ? (
                      <Link href={localePath(lang, `/projets/${note.projectSlug}`)} className="text-primary hover:text-foreground">
                        {note.project}
                      </Link>
                    ) : (
                      <p className="text-primary">{note.project}</p>
                    )}
                    <p className="mt-1 text-muted-foreground">{note.status}</p>
                  </div>
                  <div className="max-w-[68ch] lg:col-span-8">
                    <h2 id={`${note.slug}-titre`} className="font-display text-3xl font-semibold tracking-tight text-balance">
                      <Link href={href} className="transition-colors hover:text-primary">
                        {note.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-lg leading-relaxed text-pretty">{note.summary}</p>
                    <h3 className="mt-6 text-[15px] text-muted-foreground">{t.lab.proves}</h3>
                    <ProvesList items={note.proves} className="mt-3 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:gap-y-2.5" />
                    <p className="mt-6 text-[15px] text-muted-foreground">{note.stack.join(", ")}</p>
                    <Link href={href} className={`mt-6 inline-block text-[15px] ${textLink}`} aria-label={`${t.lab.readNote}${lang === "fr" ? "\u00a0:" : ":"} ${note.title}`}>
                      {t.lab.readNote}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>

      <ContactCta />
    </>
  );
}
