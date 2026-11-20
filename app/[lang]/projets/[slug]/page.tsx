import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, isPortrait, projectHost, projects } from "@/data/projects";
import { getDictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath, type Locale } from "@/lib/i18n";
import { diagramCaption } from "@/components/featured-projects";
import { BrowserFrame, PhoneRow } from "@/components/project-media";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { getLabNotes } from "@/data/lab";
import { certificationForStack } from "@/data/certifications";
import { CertifiedMark } from "@/components/certified-mark";
import { ContactCta } from "@/components/contact-cta";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { Container, buttonStyles, textLink } from "@/components/primitives";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/[lang]/projets/[slug]">): Promise<Metadata> {
  const { slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const project = getProject(slug, lang);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: alternatesFor(lang, `/projets/${project.slug}`),
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectPage(props: PageProps<"/[lang]/projets/[slug]">) {
  const { slug, lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  const project = getProject(slug, lang);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug, lang);
  const host = projectHost(project);
  const web = project.images.filter((i) => !isPortrait(i));
  const mobile = project.images.filter(isPortrait);
  const [cover, ...moreWeb] = web;
  const labNote = getLabNotes(lang).find((n) => n.slug === project.labNote);

  const facts = [
    { label: t.projects.role, value: project.role },
    { label: t.projects.setting, value: project.client },
    { label: t.projects.period, value: project.period },
    { label: t.projects.platforms, value: project.categories.join(", ") },
    { label: t.projects.sector, value: project.domain },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <>
      <article className="pb-8">
        <Container className="pt-10 sm:pt-14">
          <Link href={localePath(lang, "/projets")} className="inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon className="size-4" />
            {t.project.back}
          </Link>

          <header className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="font-display text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-[46ch] text-xl text-pretty">{project.summary}</p>
            </div>
            {project.links.length > 0 ? (
              <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                {project.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={buttonStyles.primary}>
                    {t.project.open} {l.label}
                    <ArrowUpRightIcon />
                  </a>
                ))}
              </div>
            ) : null}
          </header>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-border py-6 text-[15px] md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
            {facts.map((f) => (
              <div key={f.label} className={f.label === t.projects.role ? "col-span-2 md:col-span-1" : ""}>
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-pretty">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            {cover ? (
              <BrowserFrame image={cover} host={host} sizes="(min-width: 1152px) 1088px, 100vw" />
            ) : mobile.length > 0 ? (
              <PhoneRow images={mobile} sizes="(min-width: 640px) 230px, 30vw" />
            ) : project.architecture ? (
              <ArchitectureDiagram architecture={project.architecture} caption={diagramCaption(project, lang)} />
            ) : null}
          </div>
        </Container>

        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {project.context ? (
              <>
                <h2 className="font-display text-2xl font-semibold tracking-tight">{t.project.about}</h2>
                <p className="mt-4 mb-12 text-lg leading-relaxed text-pretty">{project.context}</p>
              </>
            ) : null}
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t.project.built}</h2>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {project.highlights.map((h) => (
                <li key={h} className="py-4 text-pretty">
                  {h}
                </li>
              ))}
            </ul>
            {labNote ? (
              <p className="mt-8 text-[15px]">
                <span className="text-muted-foreground">{t.project.labNote}</span>
                <Link href={`${localePath(lang, "/lab")}#${labNote.slug}`} className={`font-medium ${textLink}`}>
                  {labNote.title}
                </Link>
              </p>
            ) : null}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-semibold tracking-tight">{t.project.technologies}</h2>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {project.stack.map((tech) => {
                  const cert = certificationForStack(tech);
                  return (
                    <li key={tech}>
                      {tech}
                      {cert ? <CertifiedMark cert={cert} lang={lang} /> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </Container>

        {moreWeb.length > 0 || (cover && mobile.length > 0) ? (
          <Container>
            <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight">{t.project.screenshots}</h2>
            <div className="space-y-12">
              {moreWeb.map((image) => (
                <figure key={image.src}>
                  <BrowserFrame image={image} host={host} sizes="(min-width: 1152px) 1088px, 100vw" />
                  <figcaption className="mt-3 text-[15px] text-muted-foreground">{image.alt}</figcaption>
                </figure>
              ))}
              {cover && mobile.length > 0 ? (
                <figure>
                  <PhoneRow images={mobile} sizes="(min-width: 640px) 230px, 30vw" />
                  <figcaption className="mt-3 text-[15px] text-muted-foreground">{mobile.map((i) => i.alt).join(", ")}</figcaption>
                </figure>
              ) : null}
            </div>
          </Container>
        ) : null}

        <Container>
          <nav aria-label={t.project.otherProjects} className="mt-16 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={localePath(lang, `/projets/${prev.slug}`)} className="group">
                <span className="text-[15px] text-muted-foreground">{t.project.previous}</span>
                <span className="mt-1 block font-display text-2xl font-semibold tracking-tight group-hover:underline decoration-2 underline-offset-4">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={localePath(lang, `/projets/${next.slug}`)} className="group sm:text-right">
                <span className="text-[15px] text-muted-foreground">{t.project.next}</span>
                <span className="mt-1 block font-display text-2xl font-semibold tracking-tight group-hover:underline decoration-2 underline-offset-4">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        </Container>
      </article>
      <ContactCta />
    </>
  );
}
