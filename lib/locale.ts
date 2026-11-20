import { lang } from "next/root-params";
import { defaultLocale, hasLocale, type Locale } from "./i18n";

/** Current locale in Server Components, read from the root [lang] segment. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return value && hasLocale(value) ? value : defaultLocale;
}
