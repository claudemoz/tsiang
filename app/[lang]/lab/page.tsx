import type { Metadata } from "next";
import { CheckIcon } from "lucide-react";
import { getLabNotes, type LabNote } from "@/data/lab";
import { getProject } from "@/data/projects";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ContactCta } from "@/components/contact-cta";
import Link from "next/link";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { diagramCaption } from "@/components/featured-projects";
import { Container, textLink } from "@/components/primitives";

export async function generateMetadata(props: PageProps<"/[lang]/lab">): Promise<Metadata> {
  const { lang: raw } = await props.params;
  const lang = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  return { title: t.meta.labTitle, description: t.meta.labDescription, alternates: alternatesFor(lang, "/lab") };
}

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
        <ol className="divide-y divide-border border-y border-border">
          {getLabNotes(lang).map((note) => (
            <li key={note.slug}>
              <Note note={note} lang={lang} t={t} />
            </li>
          ))}
        </ol>
      </Container>

      <ContactCta />
    </>
  );
}

function Note({ note, lang, t }: { note: LabNote; lang: Locale; t: Dictionary }) {
  const project = note.projectSlug ? getProject(note.projectSlug, lang) : undefined;
  const platform = note.platform;
  return (
    <article id={note.slug} aria-labelledby={`${note.slug}-titre`} className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-12">
      {/* Margin column: what it is, at a glance. */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          {note.projectSlug ? (
            <Link href={localePath(lang, `/projets/${note.projectSlug}`)} className={`text-[15px] `}>
              {note.project}
            </Link>
          ) : (
            <p className="text-[15px] text-primary">{note.project}</p>
          )}
          <h2 id={`${note.slug}-titre`} className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance">
            {note.title}
          </h2>
          <dl className="mt-6 space-y-4 text-[15px]">
            <div>
              <dt className="text-muted-foreground">{t.lab.status}</dt>
              <dd className="mt-0.5 font-medium">{note.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t.lab.technologies}</dt>
              <dd className="mt-0.5">{note.stack.join(", ")}</dd>
            </div>
          </dl>
        </div>
      </aside>

      <div className="max-w-[68ch] lg:col-span-8">
        <p className="text-xl leading-relaxed text-pretty">{note.summary}</p>

        {platform ? (
          <>
            <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">{t.lab.platform}</h3>
            {project?.architecture ? (
              <ArchitectureDiagram architecture={project.architecture} caption={diagramCaption(project, lang)} className="mt-5" />
            ) : null}
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {platform.map((item) => (
                <li key={item} className="py-4 leading-relaxed text-pretty">
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">{t.lab.context}</h3>
        {note.context.map((p) => (
          <p key={p} className="mt-4 leading-relaxed text-pretty">
            {p}
          </p>
        ))}

        <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">{t.lab.built}</h3>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {note.built.map((item) => (
            <li key={item} className="py-4 leading-relaxed text-pretty">
              {item}
            </li>
          ))}
        </ul>

        {note.steps ? (
          <>
            <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">{note.steps.title}</h3>
            {note.steps.after?.[0] ? <p className="mt-4 leading-relaxed text-pretty">{note.steps.after[0]}</p> : null}
            <p className="mt-6 text-[15px] text-muted-foreground">{t.lab.onServer}</p>
            {/* A real sequence, so numbered. */}
            <ol className="mt-3 space-y-3">
              {note.steps.items.map((item, i) => (
                <li key={item} className="flex gap-4">
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-caption font-semibold text-primary tabular-nums"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
            {note.steps.after?.slice(1).map((p) => (
              <p key={p} className="mt-6 leading-relaxed text-pretty">
                {p}
              </p>
            ))}
          </>
        ) : null}

        <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">{t.lab.outcomes}</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {note.outcomes.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <CheckIcon aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
