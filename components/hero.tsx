import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { DownloadIcon } from "lucide-react";
import { getBookingConfig, getProfile } from "@/data/profile";
import { placeholderProps } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BookingDialog } from "./booking-dialog";
import { GitHubIcon, GitLabIcon, LinkedInIcon } from "./brand-icons";
import { CodeActivity } from "./code-activity";
import { Container, buttonStyles, textLink } from "./primitives";

export async function Hero() {
  const lang = await getLocale();
  const profile = getProfile(lang);
  const t = getDictionary(lang);
  const booking = getBookingConfig();

  return (
    <section aria-labelledby="hero-titre">
      <Container className="grid gap-10 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:gap-x-24 lg:gap-y-14 lg:pt-20 lg:pb-24">
        <div className="hero-in order-2 lg:order-1 lg:col-span-8 lg:self-center">
          <h1
            id="hero-titre"
            className="font-hero text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em]"
          >
            {/* <span className="block whitespace-nowrap">{profile.name}</span> */}
            <span className="block font-medium text-muted-foreground">{profile.role}</span>
          </h1>
          <Suspense fallback={<div aria-hidden className="mt-8 min-h-[13.5rem] max-w-[44rem]" />}>
            <CodeActivity className="mt-8 max-w-[44rem]" />
          </Suspense>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href={profile.cv} download className={buttonStyles.primary}>
              <DownloadIcon />
              {t.hero.downloadCv}
            </a>
            {booking ? <BookingDialog booking={booking} labels={t.booking} /> : null}
          </div>
          <p className="mt-8 max-w-[58ch] text-[17px] leading-relaxed text-pretty">{profile.intro}</p>
          <p className="mt-3 max-w-[58ch] text-[17px] leading-relaxed text-pretty">{profile.approach}</p>
        </div>

        <aside
          aria-label={t.a11y.inBrief}
          className="hero-in order-1 flex items-start gap-5 lg:order-2 lg:col-span-4 lg:flex-col lg:gap-0"
        >
          <div className="relative w-24 shrink-0 sm:w-32 lg:w-64">
            {/* Top padding only: the head no longer touches the top of the circle. The white
                backdrop matches the photo background; the dark-mode dimming applies to both. */}
            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-white shadow-[0_1px_2px_rgb(15_29_33/0.06),0_12px_32px_-16px_rgb(15_29_33/0.25)] ring-1 ring-border dark:brightness-[0.86] dark:contrast-[1.05]">
              <div className="absolute inset-x-0 top-[8%] bottom-0">
                <Image
                  src={profile.photo.src}
                  alt={`${t.a11y.portrait} ${profile.name}`}
                  fill
                  preload
                  sizes="(min-width: 1024px) 256px, 128px"
                  {...placeholderProps(profile.photo)}
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
          <dl className="hidden w-full divide-y divide-border border-y border-border text-[15px] lg:mt-6 lg:block">
            {profile.facts.map((f) => (
              <div key={f.label} className="py-3">
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className="mt-0.5 font-medium">
                  <FactValue fact={f} lang={lang} />
                </dd>
              </div>
            ))}
          </dl>
          <ProfileLinks
            profile={profile}
            label={t.a11y.profiles}
            newTab={t.a11y.newTab}
            className="mt-5 hidden lg:flex"
          />
          {/* Mobile: the two facts a recruiter needs first, beside the portrait, then the profiles. */}
          <div className="lg:hidden">
            <dl className="space-y-2 text-[15px]">
              {profile.facts.slice(0, 2).map((f) => (
                <div key={f.label}>
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="font-medium">
                    <FactValue fact={f} lang={lang} />
                  </dd>
                </div>
              ))}
            </dl>
            <ProfileLinks profile={profile} label={t.a11y.profiles} newTab={t.a11y.newTab} className="mt-3 flex" />
          </div>
        </aside>
      </Container>
    </section>
  );
}

function FactValue({ fact, lang }: { fact: { value: string; href?: string }; lang: Locale }) {
  return fact.href ? (
    <Link href={localePath(lang, fact.href)} className={textLink}>
      {fact.value}
    </Link>
  ) : (
    fact.value
  );
}

/** LinkedIn first: it is the profile a recruiter opens. GitLab holds the professional code, GitHub the public side projects. */
function ProfileLinks({
  profile,
  label,
  newTab,
  className = "",
}: {
  profile: { linkedin: string; gitlab: string; github: string };
  label: string;
  newTab: string;
  className?: string;
}) {
  const links = [
    { label: "LinkedIn", href: profile.linkedin, Icon: LinkedInIcon },
    { label: "GitLab", href: profile.gitlab, Icon: GitLabIcon },
    { label: "GitHub", href: profile.github, Icon: GitHubIcon },
  ];
  return (
    <ul aria-label={label} className={`gap-2 ${className}`}>
      {links.map(({ label: name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} (${newTab})`}
            title={name}
            className="grid size-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground"
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
