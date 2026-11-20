import type { Metadata } from "next";
import { getProjects } from "@/data/projects";
import { getProfile } from "@/data/profile";
import { ProjectFilter } from "@/components/project-filter";
import { ContactCta } from "@/components/contact-cta";
import { Container, textLink } from "@/components/primitives";
import { diagramCaption } from "@/components/featured-projects";
import { getDictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(props: PageProps<"/[lang]/projets">): Promise<Metadata> {
  const { lang: raw } = await props.params;
  const lang = hasLocale(raw) ? raw : "fr";
  const t = getDictionary(lang);
  return {
    title: t.meta.projectsTitle,
    description: t.meta.projectsDescription,
    alternates: alternatesFor(lang, "/projets"),
  };
}

export default async function ProjectsPage() {
  const lang = await getLocale();
  const t = getDictionary(lang);
  const profile = getProfile(lang);
  const projects = getProjects(lang);
  const rows = projects.map((project) => ({
    project,
    href: localePath(lang, `/projets/${project.slug}`),
    diagramCaption: diagramCaption(project, lang),
  }));

  return (
    <>
      <Container className="pt-16 pb-4 sm:pt-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">{t.projects.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">{t.projects.intro(projects.length)}</p>
        <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground text-pretty">
          {t.projects.privateBefore}{" "}
          <a href={profile.gitlab} target="_blank" rel="noopener noreferrer" className={textLink}>
            GitLab
          </a>
          {t.projects.privateAfter}
        </p>
      </Container>
      <Container className="pt-10 pb-20">
        <ProjectFilter
          rows={rows}
          labels={{
            sector: t.projects.sector,
            platforms: t.projects.platforms,
            setting: t.projects.setting,
            period: t.projects.period,
            technologies: t.skills.technologies,
            filterAria: t.projects.filterAria,
            filterAll: t.projects.filterAll,
            shownSuffix: t.projects.shown(0).replace(/^0 /, ""),
          }}
        />
      </Container>
      <ContactCta />
    </>
  );
}
