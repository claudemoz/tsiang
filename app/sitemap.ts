import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { localePath, locales } from "@/lib/i18n";

/** Every page in every locale, each entry listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl;
  const pages: { path: string; changeFrequency: "monthly" | "yearly"; priority: number }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/projets", changeFrequency: "monthly", priority: 0.8 },
    { path: "/lab", changeFrequency: "monthly", priority: 0.6 },
    ...projects.map((p) => ({ path: `/projets/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
  return pages.flatMap((page) =>
    locales.map((lang) => ({
      url: `${base}${localePath(lang, page.path)}`,
      changeFrequency: page.changeFrequency,
      priority: lang === "fr" ? page.priority : page.priority * 0.9,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}${localePath(l, page.path)}`])),
      },
    })),
  );
}
