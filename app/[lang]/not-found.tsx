import type { Metadata } from "next";
import Link from "next/link";
import { Container, buttonStyles } from "@/components/primitives";
import { getDictionary } from "@/lib/dictionaries";
import { localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.meta.notFoundTitle, robots: { index: false } };
}

export default async function NotFound() {
  const lang = await getLocale();
  const t = getDictionary(lang).notFound;
  return (
    <Container className="py-32">
      <h1 className="font-display text-5xl font-semibold tracking-tight">{t.heading}</h1>
      <p className="mt-4 max-w-lg text-lg text-muted-foreground">{t.body}</p>
      <div className="mt-8 flex gap-3">
        <Link href={localePath(lang, "/")} className={buttonStyles.primary}>
          {t.home}
        </Link>
        <Link href={localePath(lang, "/projets")} className={buttonStyles.secondary}>
          {t.projects}
        </Link>
      </div>
    </Container>
  );
}
