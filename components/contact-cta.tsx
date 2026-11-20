import { MailIcon } from "lucide-react";
import { getBookingConfig, profile } from "@/data/profile";
import { BookingDialog } from "./booking-dialog";
import { getDictionary } from "@/lib/dictionaries";
import { getLocale } from "@/lib/locale";
import { Section } from "./primitives";

/** Buttons on the deep petrol band: light primary, outlined secondary. */
const onRegion = {
  primary:
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-on-region px-4 text-[15px] font-medium text-region transition-colors hover:bg-on-region/90 [&_svg]:size-4",
  secondary:
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-on-region/30 bg-transparent px-4 text-[15px] font-medium text-on-region transition-colors hover:border-on-region/70 hover:bg-on-region/10 hover:text-on-region dark:border-on-region/30 dark:bg-transparent dark:hover:border-on-region/70 dark:hover:bg-on-region/10 [&_svg]:size-4",
};

export async function ContactCta() {
  const lang = await getLocale();
  const t = getDictionary(lang);
  const booking = getBookingConfig();
  /** Prefilled subject so the first message lands with context in my inbox. */
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(t.contact.mailSubject)}`;
  return (
    <Section id="contact" title={t.contact.title} tone="region">
      <div>
        <p className="font-display text-3xl font-semibold tracking-tight text-balance text-on-region sm:text-4xl">
          {t.contact.heading}
        </p>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-pretty">
          {t.contact.body} <br />
          {t.contact.bodyCta}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={mailto} className={onRegion.primary}>
            <MailIcon />
            {t.contact.write}
          </a>
          {booking ? <BookingDialog booking={booking} labels={t.booking} className={onRegion.secondary} preloadOnIdle={false} /> : null}
        </div>
      </div>
    </Section>
  );
}
