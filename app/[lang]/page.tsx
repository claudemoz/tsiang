import { Hero } from "@/components/hero";
import { FeaturedProjects } from "@/components/featured-projects";
import { Background, ExperienceTimeline } from "@/components/experience-timeline";
import { SkillsGrid } from "@/components/skills-grid";
import { Certifications } from "@/components/certifications";
import { ContactCta } from "@/components/contact-cta";
import { Section } from "@/components/primitives";
import { getDictionary } from "@/lib/dictionaries";
import { getLocale } from "@/lib/locale";

export default async function Home() {
  const t = getDictionary(await getLocale());
  return (
    <>
      <Hero />
      <Section id="projets" title={t.nav.projets} intro={t.home.projectsIntro} wide>
        <FeaturedProjects />
      </Section>
      <Section id="experience" title={t.nav.experience} intro={t.home.experienceIntro}>
        <ExperienceTimeline />
        <Background />
      </Section>
      <Section id="competences" title={t.nav.competences} intro={t.home.skillsIntro}>
        <SkillsGrid />
        <Certifications />
      </Section>
      <ContactCta />
    </>
  );
}
