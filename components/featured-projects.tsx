import Link from "next/link";
import { getFeaturedProjects, getProjects, projectHost, type Project } from "@/data/projects";
import { getDictionary } from "@/lib/dictionaries";
import { localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BrowserFrame, ProjectThumb } from "./project-media";
import { StackLine, buttonStyles, textLink } from "./primitives";

const meta = (p: Project) =>
  [p.client, p.period && p.period.charAt(0).toLowerCase() + p.period.slice(1)].filter(Boolean).join(", ");

export async function FeaturedProjects() {
  const lang = await getLocale();
  const t = getDictionary(lang);
  const [lead, ...others] = getFeaturedProjects(lang);
  const total = getProjects(lang).length;
  const href = (slug: string) => localePath(lang, `/projets/${slug}`);

  return (
    <div>
      <article className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Link href={href(lead.slug)} tabIndex={-1} aria-hidden className="block lg:col-span-7">
          <BrowserFrame image={lead.images[0]} host={projectHost(lead)} sizes="(min-width: 1024px) 640px, 100vw" />
        </Link>
        <div className="lg:col-span-5">
          <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{lead.title}</h3>
          <p className="mt-1.5 text-muted-foreground">{meta(lead)}</p>
          <p className="mt-5 text-lg text-pretty">{lead.context ?? lead.summary}</p>
          <StackLine items={lead.stack} className="mt-5" label={t.skills.technologies} />
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={href(lead.slug)} className={buttonStyles.secondary}>
              {t.home.readProject}
            </Link>
            {lead.links[0] ? (
              <a href={lead.links[0].href} target="_blank" rel="noopener noreferrer" className={`text-[15px] ${textLink}`}>
                {t.home.open} {lead.links[0].label}
              </a>
            ) : null}
          </div>
        </div>
      </article>

      <div className="mt-16 grid gap-x-8 gap-y-14 border-t border-border pt-12 md:grid-cols-3">
        {others.map((project) => (
          <article key={project.slug} className="group relative">
            <ProjectThumb
              project={project}
              sizes="(min-width: 768px) 360px, 100vw"
              diagramCaption={diagramCaption(project, lang)}
            />
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
              <Link
                href={href(project.slug)}
                className="after:absolute after:inset-0 transition-colors group-hover:text-primary"
              >
                {project.title}
              </Link>
            </h3>
            <p className="mt-1 text-[15px] text-muted-foreground">{meta(project)}</p>
            <p className="mt-3 text-pretty">{project.summary}</p>
          </article>
        ))}
      </div>

      <p className="mt-14 text-lg">
        <Link href={localePath(lang, "/projets")} className={textLink}>
          {t.home.seeAllProjects(total)}
        </Link>
        <span className="text-muted-foreground">{t.home.seeAllProjectsAfter}</span>
      </p>
    </div>
  );
}

/** Screen-reader description of a project's architecture sketch, when it has one. */
export function diagramCaption(project: Project, lang: Parameters<typeof getDictionary>[0]) {
  const a = project.architecture;
  return a ? getDictionary(lang).project.diagram(a.center, a.centerDetail, a.link, a.node, a.nodeDetail) : undefined;
}
