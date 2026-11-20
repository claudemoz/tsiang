import { BadgeCheckIcon } from "lucide-react";
import { CERTIFIER, type Certification } from "@/data/certifications";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/** Small "certifié" link next to a skill or technology, opening the verification page. */
export function CertifiedMark({ cert, lang }: { cert: Certification; lang: Locale }) {
  const t = getDictionary(lang).skills;
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      title={t.certifiedTitle(cert.title, CERTIFIER)}
      aria-label={t.certifiedAria(cert.title, CERTIFIER)}
      className="ml-1 inline-flex translate-y-[1px] items-center gap-0.5 rounded-sm text-caption font-medium text-primary hover:underline underline-offset-2"
    >
      <BadgeCheckIcon aria-hidden className="size-3.5" />
      {t.certified}
    </a>
  );
}
