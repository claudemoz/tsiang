import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { getLabNote, getLabNotes, labNotes } from "@/data/lab";
import { ContactCta } from "@/components/contact-cta";
import { LabNoteArticle } from "@/components/lab-note";
import { Container } from "@/components/primitives";
import { getDictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return labNotes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata(props: PageProps<"/[lang]/lab/[slug]">): Promise<Metadata> {
  const { slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const note = getLabNote(slug, lang);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    alternates: alternatesFor(lang, `/lab/${note.slug}`),
    openGraph: { title: note.title, description: note.summary, type: "article" },
  };
}

export default async function LabNotePage(props: PageProps<"/[lang]/lab/[slug]">) {
  const { slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  const note = getLabNote(slug, lang);
  if (!note) notFound();
  const others = getLabNotes(lang).filter((n) => n.slug !== note.slug);

  return (
    <>
      <Container className="pt-10 pb-8 sm:pt-14">
        <Link
          href={localePath(lang, "/lab")}
          className="inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {t.lab.allNotes}
        </Link>

        <LabNoteArticle note={note} lang={lang} t={t} />

        {others.length > 0 ? (
          <nav aria-label={t.lab.otherNotes} className="mt-8 border-t border-border pt-8">
            <h2 className="text-[15px] text-muted-foreground">{t.lab.otherNotes}</h2>
            <ul className="mt-2 grid gap-6 sm:grid-cols-2">
              {others.map((n) => (
                <li key={n.slug}>
                  <Link href={localePath(lang, `/lab/${n.slug}`)} className="group block">
                    <span className="text-[15px] text-muted-foreground">{n.project}</span>
                    <span className="mt-1 block font-display text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary">
                      {n.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Container>
      <ContactCta />
    </>
  );
}
