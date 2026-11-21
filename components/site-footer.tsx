import { ArrowUpIcon } from "lucide-react";
import { getProfile } from "@/data/profile";
import { getDictionary } from "@/lib/dictionaries";
import { getLocale } from "@/lib/locale";
import { GitHubIcon, GitLabIcon, LinkedInIcon } from "./brand-icons";
import { Container } from "./primitives";


/** Continues the contact band in deep petrol, so every page ends on one block. */
export async function SiteFooter() {
  const lang = await getLocale();
  const profile = getProfile(lang);
  const t = getDictionary(lang);
  const profiles = [
    { label: "LinkedIn", href: profile.linkedin, Icon: LinkedInIcon },
    { label: "GitLab", href: profile.gitlab, Icon: GitLabIcon },
    { label: "GitHub", href: profile.github, Icon: GitHubIcon },
  ];
  return (
    <footer className="bg-region text-[15px] text-on-region-muted">
      <Container className="pb-14">
        <div className="mb-14 border-t border-on-region/15" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-on-region">{profile.name}</p>
            <p className="mt-1">
              {profile.role} {profile.tagline}
            </p>
          </div>
          <ul className="flex gap-2" aria-label={t.a11y.profiles}>
            {profiles.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (${t.a11y.newTab})`}
                  title={label}
                  className="grid size-10 place-items-center rounded-lg border border-on-region/20 text-on-region transition-colors hover:border-on-region/60 hover:bg-on-region/10"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-on-region/15 pt-6 text-caption">
          <p>© 2026 {profile.name}</p>
          <a
            href="#contenu"
            aria-label={t.a11y.backToTop}
            title={t.a11y.backToTopShort}
            className="group grid size-9 place-items-center rounded-lg border border-on-region/20 text-on-region transition-colors hover:border-on-region/60 hover:bg-on-region/10"
          >
            <ArrowUpIcon aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
