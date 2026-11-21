import Link from "next/link";
import { Suspense } from "react";
import { labItem, navItems } from "@/data/navigation";
import { getProfile } from "@/data/profile";
import { getDictionary } from "@/lib/dictionaries";
import { localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { LabLink, LabLinkFallback } from "./lab-link";
import { LanguageSwitch, LanguageSwitchFallback } from "./language-switch";
import { MobileNav } from "./mobile-nav";
import { Container } from "./primitives";
import { SiteNav, SiteNavFallback, type NavLink } from "./site-nav";

export async function SiteHeader() {
  const lang = await getLocale();
  const profile = getProfile(lang);
  const t = getDictionary(lang);
  const other = getDictionary(lang === "fr" ? "en" : "fr");
  const items: NavLink[] = navItems.map((item) => ({
    id: item.id,
    href: localePath(lang, item.path),
    label: t.nav[item.id],
  }));
  const lab = { href: localePath(lang, labItem.path), label: t.nav.lab, hint: t.nav.labHint };

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={localePath(lang, "/")} className="rounded-md" aria-label={`${t.a11y.home}, ${profile.name}`}>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-brand font-semibold tracking-tight">{profile.name}</span>
            <span className="hidden text-caption text-muted-foreground sm:block md:hidden lg:block">
              {profile.role} {profile.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label={t.a11y.mainNav} className="hidden md:block">
          <Suspense fallback={<SiteNavFallback items={items} />}>
            <SiteNav items={items} />
          </Suspense>
        </nav>

        <div className="flex items-center gap-1">
          {/* Phones: the header has no room left, the Lab sits in the mobile menu. */}
          <Suspense fallback={<LabLinkFallback {...lab} className="max-sm:hidden" />}>
            <LabLink {...lab} className="max-sm:hidden" />
          </Suspense>
          <span aria-hidden className="mx-1.5 hidden h-5 w-px bg-border sm:block" />
          <Suspense
            fallback={<LanguageSwitchFallback lang={lang} label={other.a11y.switchTo} groupLabel={t.a11y.language} />}
          >
            <LanguageSwitch lang={lang} label={other.a11y.switchTo} groupLabel={t.a11y.language} />
          </Suspense>
          <MobileNav
            items={items}
            lab={lab}
            name={profile.name}
            subtitle={`${profile.role} ${profile.tagline}`}
            cv={profile.cv}
            labels={{ openMenu: t.a11y.openMenu, mainNav: t.a11y.mainNav, downloadCv: t.hero.downloadCv }}
          />
        </div>
      </Container>
    </header>
  );
}
