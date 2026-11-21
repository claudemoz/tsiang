import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Space_Grotesk } from "next/font/google";
import { preconnect } from "react-dom";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getProfile, profile } from "@/data/profile";
import { getDictionary } from "@/lib/dictionaries";
import { alternatesFor, hasLocale, htmlLang, localePath, locales, ogLocale, type Locale } from "@/lib/i18n";
import "../globals.css";
import { cn } from "@/lib/utils";

/** Every heading, from the hero name to section titles. */
const heading = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const body = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang: raw } = await props.params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const p = getProfile(lang);
  const t = getDictionary(lang);
  const title = `${p.name}, ${t.meta.titleSuffix}`;
  const description = `${p.summary} React, Angular, Node.js, Go.`;
  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: title, template: `%s | ${p.name}` },
    description,
    authors: [{ name: p.name, url: profile.siteUrl }],
    keywords:
      lang === "fr"
        ? ["Développeur fullstack", "Développeur web et mobile", "React", "React Native", "Angular", "Vue.js", "Node.js", "NestJS", "Golang", "Spring Boot", "DevOps", "Paris"]
        : ["Fullstack developer", "Web and mobile developer", "React", "React Native", "Angular", "Vue.js", "Node.js", "NestJS", "Golang", "Spring Boot", "DevOps", "France"],
    alternates: alternatesFor(lang, "/"),
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      url: localePath(lang, "/"),
      siteName: p.name,
      title,
      description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1517" },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang: raw } = await params;
  const lang: Locale = hasLocale(raw) ? raw : "fr";
  const p = getProfile(lang);
  const t = getDictionary(lang);
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.role,
    url: profile.siteUrl,
    email: `mailto:${p.email}`,
    image: new URL(p.photo.src, profile.siteUrl).href,
    sameAs: [p.gitlab, p.github, p.linkedin],
    knowsAbout: ["React", "React Native", "Angular", "Vue.js", "Node.js", "Go", "Spring Boot", "Docker", "Kubernetes"],
  };

  // Every image comes from the Cloudinary CDN: open the connection before the first <img> is parsed.
  preconnect("https://res.cloudinary.com");

  return (
    <html lang={htmlLang[lang]} className={cn("h-full font-sans", heading.variable, body.variable)}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          {t.a11y.skipToContent}
        </a>
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
