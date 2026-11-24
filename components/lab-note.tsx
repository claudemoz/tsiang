import type { ReactNode } from "react";
import { CheckIcon } from "lucide-react";
import type { Lab, LabNote } from "@/data/lab";
import { getProject } from "@/data/projects";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { diagramCaption } from "@/components/featured-projects";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const h2Class = "mt-12 font-display text-2xl font-semibold tracking-tight";

/** "Ce que ça montre": the skills a note proves, with petrol checks. */
export function ProvesList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 leading-snug text-pretty">
          <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function HairlineList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li key={item} className="py-4 leading-relaxed text-pretty">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * "La plateforme" of a lab: the architecture diagram of its project, then what the platform does.
 * Shown once, on the lab page, so each note can go straight to its problem.
 */
export function LabPlatform({ lab, lang }: { lab: Lab; lang: Locale }) {
  const project = lab.projectSlug ? getProject(lab.projectSlug, lang) : undefined;
  return (
    <>
      {project?.architecture ? (
        <ArchitectureDiagram architecture={project.architecture} caption={diagramCaption(project, lang)} />
      ) : null}
      <HairlineList items={lab.platform} />
    </>
  );
}

/** A whole note on its own page: margin column (title, what it shows, status, stack), then the reading column. */
export function LabNoteArticle({
  note,
  t,
  aside,
}: {
  note: LabNote;
  t: Dictionary;
  /** Closes the sticky margin column (the link to the note's demos). */
  aside?: ReactNode;
}) {
  return (
    <article aria-labelledby="note-titre" className="grid grid-cols-[minmax(0,1fr)] gap-10 pt-8 pb-12 lg:grid-cols-12 lg:gap-12">
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <h1 id="note-titre" className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {note.title}
          </h1>

          <h2 className="mt-8 text-[15px] text-muted-foreground">{t.lab.proves}</h2>
          <ProvesList items={note.proves} className="mt-3 text-[15px] font-medium" />

          <dl className="mt-8 space-y-4 border-t border-border pt-6 text-[15px]">
            {note.status ? (
              <div>
                <dt className="text-muted-foreground">{t.lab.status}</dt>
                <dd className="mt-0.5 font-medium">{note.status}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground">{t.lab.technologies}</dt>
              <dd className="mt-0.5">{note.stack.join(", ")}</dd>
            </div>
          </dl>
          {aside}
        </div>
      </aside>

      <div className="min-w-0 max-w-[68ch] lg:col-span-8">
        <p className="text-xl leading-relaxed text-pretty">{note.summary}</p>

        <h2 className={h2Class}>{t.lab.context}</h2>
        {note.context.map((p) => (
          <p key={p} className="mt-4 leading-relaxed text-pretty">
            {p}
          </p>
        ))}

        {note.sections?.map((section) => (
          <section key={section.title}>
            <h2 className={h2Class}>{section.title}</h2>
            <HairlineList items={section.items} />
          </section>
        ))}

        {note.built ? (
          <>
            <h2 className={h2Class}>{t.lab.built}</h2>
            <HairlineList items={note.built} />
          </>
        ) : null}

        {note.steps ? (
          <>
            <h2 className={h2Class}>{note.steps.title}</h2>
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

        <h2 className={h2Class}>{t.lab.outcomes}</h2>
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
