import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlaskConicalIcon, InfoIcon } from "lucide-react";
import { getLab, getLabNote, getLabNotesForLab, labNotes, notePath, labPath, type Lab, type LabNote } from "@/data/lab";
import { getLabDemo, getLabDemosForNote, labDemos, type LabDemo } from "@/data/lab-demos";
import { ContactCta } from "@/components/contact-cta";
import { LabBreadcrumb } from "@/components/lab-breadcrumb";
import { DemoDiagram } from "@/components/lab-demos/diagrams";
import { DemoCard, DemoPlayground, DemoWhy, demoPath } from "@/components/lab-demos/lab-demo";
import { LabNoteArticle } from "@/components/lab-note";
import { Container, Section, textLink } from "@/components/primitives";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath, type Locale } from "@/lib/i18n";

/**
 * Everything inside a lab lives one level down: /lab/<lab>/<note> and /lab/<lab>/<demo>.
 * Note and demo slugs never collide (data/lab.ts, data/lab-demos.ts).
 */
export function generateStaticParams() {
  return [
    ...labNotes.map((n) => ({ lab: n.lab, slug: n.slug })),
    ...labDemos.map((d) => ({ lab: d.lab, slug: d.id })),
  ];
}

type Item = { kind: "note"; lab: Lab; note: LabNote } | { kind: "demo"; lab: Lab; demo: LabDemo; note?: LabNote };

function resolve(labSlug: string, slug: string, lang: Locale): Item | null {
  const lab = getLab(labSlug, lang);
  if (!lab) return null;
  const note = getLabNote(slug, lang);
  if (note) return note.lab === lab.slug ? { kind: "note", lab, note } : null;
  const demo = getLabDemo(slug);
  if (demo && demo.lab === lab.slug) return { kind: "demo", lab, demo, note: getLabNote(demo.noteSlug, lang) };
  return null;
}

export async function generateMetadata(props: PageProps<"/[lang]/lab/[lab]/[slug]">): Promise<Metadata> {
  const { lab, slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const item = resolve(lab, slug, lang);
  if (!item) return {};
  const path = `/lab/${item.lab.slug}/${slug}`;
  if (item.kind === "note") {
    const { title, summary } = item.note;
    return { title, description: summary, alternates: alternatesFor(lang, path), openGraph: { title, description: summary, type: "article" } };
  }
  const s = getDictionary(lang).labDemos[item.demo.kind];
  return {
    title: s.title,
    description: s.plain,
    alternates: alternatesFor(lang, path),
    openGraph: { title: s.title, description: s.plain, type: "article" },
  };
}

export default async function LabItemPage(props: PageProps<"/[lang]/lab/[lab]/[slug]">) {
  const { lab, slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  const item = resolve(lab, slug, lang);
  if (!item) notFound();

  // A demo belongs to its note: the trail goes through it.
  const crumbs = [
    { href: localePath(lang, "/lab"), label: t.lab.title },
    { href: labPath(lang, item.lab.slug), label: item.lab.title },
    ...(item.kind === "demo" && item.note ? [{ href: notePath(lang, item.note), label: item.note.title }] : []),
  ];

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <LabBreadcrumb label={t.lab.breadcrumb} items={crumbs} />
      </Container>
      {item.kind === "note" ? (
        <NoteView lab={item.lab} note={item.note} lang={lang} t={t} />
      ) : (
        <DemoView demo={item.demo} note={item.note} lang={lang} t={t} />
      )}
      <ContactCta />
    </>
  );
}

/** A note: the article, its demos, then the other notes of the same lab. */
function NoteView({ lab, note, lang, t }: { lab: Lab; note: LabNote; lang: Locale; t: Dictionary }) {
  const demos = getLabDemosForNote(note.slug);
  const others = getLabNotesForLab(lab.slug, lang).filter((n) => n.slug !== note.slug);
  return (
    <Container className="pb-8">
      <LabNoteArticle
        note={note}
        t={t}
        aside={
          demos.length > 0 ? (
            <a href="#demos" className={`mt-6 inline-flex items-center gap-2 text-[15px] ${textLink}`}>
              <FlaskConicalIcon aria-hidden className="size-4" />
              {t.labDemos.seeDemos} ({demos.length})
            </a>
          ) : null
        }
      />

      {demos.length > 0 ? (
        <section id="demos" aria-labelledby="demos-titre" className="border-t border-border py-12">
          <div className="grid gap-3 lg:grid-cols-12 lg:gap-12">
            <h2 id="demos-titre" className="font-display text-3xl font-semibold tracking-tight lg:col-span-4">
              {t.labDemos.noteDemosTitle}
            </h2>
            <p className="max-w-[60ch] text-lg text-pretty text-muted-foreground lg:col-span-8">{t.lab.demosIntro}</p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((demo) => (
              <li key={demo.id}>
                <DemoCard demo={demo} lang={lang} t={t} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {others.length > 0 ? (
        <nav aria-label={t.lab.otherNotesOfLab} className="border-t border-border pt-8">
          <h2 className="text-[15px] text-muted-foreground">{t.lab.otherNotesOfLab}</h2>
          <ul className="mt-2 grid gap-6 sm:grid-cols-2">
            {others.map((n) => (
              <li key={n.slug}>
                <Link href={notePath(lang, n)} className="group block">
                  <span className="mt-1 block font-display text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary">
                    {n.title}
                  </span>
                  <span className="mt-1 block text-pretty text-muted-foreground">{n.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </Container>
  );
}

/**
 * A demo, read top to bottom: what it is and why I built it, the diagram and how to read it, then
 * the demo itself. The fine print (technologies, source note, what is simulated) sits in the
 * header's margin column, like the facts of a project page.
 */
function DemoView({ demo, note, lang, t }: { demo: LabDemo; note?: LabNote; lang: Locale; t: Dictionary }) {
  const d = t.labDemos;
  const s = d[demo.kind];
  // Previous and next stay inside the note: its demos read as one series.
  const siblings = note ? getLabDemosForNote(note.slug) : [demo];
  const index = siblings.indexOf(demo);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];

  return (
    <>
      <Container>
        <header className="grid gap-10 pt-8 pb-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{s.title}</h1>
            <p className="mt-5 max-w-[62ch] text-xl leading-relaxed text-pretty">{s.plain}</p>
            <div className="mt-8">
              <DemoWhy demo={demo} t={t} />
            </div>
          </div>
          <dl className="space-y-5 border-t border-border pt-6 text-[15px] lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div>
              <dt className="text-muted-foreground">{t.lab.technologies}</dt>
              <dd className="mt-0.5">{s.tags}</dd>
            </div>
            {note ? (
              <div>
                <dt className="text-muted-foreground">{d.fromNote}</dt>
                <dd className="mt-0.5">
                  <Link href={notePath(lang, note)} className={textLink}>
                    {note.title}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="flex items-center gap-2 text-muted-foreground">
                <InfoIcon aria-hidden className="size-4" />
                {d.simulated}
              </dt>
              <dd className="mt-0.5 leading-relaxed text-pretty">{s.disclaimer}</dd>
            </div>
          </dl>
        </header>
      </Container>

      <Section id="schema" title={d.schemaTitle}>
        <DemoDiagram kind={demo.kind} strings={d} readTitle={d.readTitle} />
      </Section>

      <Section id="essayer" title={d.playTitle} intro={d.playIntro}>
        <DemoPlayground demo={demo} t={t} />
      </Section>

      <Container className="pb-16">
        <nav aria-label={d.noteDemosTitle} className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={demoPath(lang, prev)} className="group block">
              <span className="text-[15px] text-muted-foreground">{d.prevDemo}</span>
              <span className="mt-1 block font-display text-xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary">
                {d[prev.kind].title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={demoPath(lang, next)} className="group block sm:text-right">
              <span className="text-[15px] text-muted-foreground">{d.nextDemo}</span>
              <span className="mt-1 block font-display text-xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary">
                {d[next.kind].title}
              </span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </>
  );
}
