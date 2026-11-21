import Image from "next/image";
import { ArrowUpRightIcon, BadgeCheckIcon, ExpandIcon } from "lucide-react";
import { CERTIFIER, certifications } from "@/data/certifications";
import { placeholderProps } from "@/data/media";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { getLocale } from "@/lib/locale";

/**
 * Rendered inside the Compétences section: a grid of certificate thumbnails. A thumbnail opens the
 * certificate large in a dialog; "vérifier" goes straight to the proof.
 */
export async function Certifications() {
  const t = getDictionary(await getLocale()).certifications;
  return (
    <div id="certifications" className="mt-14 scroll-mt-24">
      <h3 className="font-display text-2xl font-semibold tracking-tight">{t.title}</h3>
      <p className="mt-2 max-w-[60ch] text-[15px] text-muted-foreground text-pretty">
        {t.intro(certifications.length, CERTIFIER)}
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
        {certifications.map((c) => (
          <li key={c.title}>
            <Dialog>
              <DialogTrigger aria-label={t.enlarge(c.title)} className="group block w-full text-left">
                <span className="relative block aspect-[1.44] overflow-hidden rounded-md border border-border bg-card">
                  <Image
                    src={c.image.src}
                    alt={t.certificate(c.title, CERTIFIER)}
                    fill
                    sizes="(min-width: 768px) 200px, 50vw"
                    {...placeholderProps(c.image)}
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute right-2 bottom-2 grid size-7 place-items-center rounded-md bg-card/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <ExpandIcon className="size-3.5" />
                  </span>
                </span>
                <span className="mt-3 flex items-center gap-1.5 font-medium group-hover:text-primary">
                  <BadgeCheckIcon aria-hidden className="size-4 shrink-0 text-primary" />
                  {c.title}
                </span>
              </DialogTrigger>
              <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
                <DialogHeader className="border-b border-border px-5 py-4 pr-12">
                  <DialogTitle className="font-display text-lg font-semibold tracking-tight">
                    {t.dialogTitle(c.title)}
                  </DialogTitle>
                  <DialogDescription>{t.issuedBy(CERTIFIER)}</DialogDescription>
                </DialogHeader>
                <div className="bg-muted p-4 sm:p-6">
                  <Image
                    src={c.image.src}
                    width={c.image.width}
                    height={c.image.height}
                    alt={t.certificate(c.title, CERTIFIER)}
                    sizes="(min-width: 768px) 720px, 100vw"
                    {...placeholderProps(c.image)}
                    className="h-auto w-full rounded-md border border-border bg-card shadow-sm"
                  />
                </div>
                <div className="flex justify-end border-t border-border px-5 py-3">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg" })}>
                    {t.verifyOn(CERTIFIER)}
                    <ArrowUpRightIcon />
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.verifyAria(c.title, CERTIFIER)}
              className="mt-0.5 inline-flex items-center gap-1 text-caption text-muted-foreground transition-colors hover:text-primary"
            >
              {t.verifyShort(CERTIFIER)}
              <ArrowUpRightIcon aria-hidden className="size-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
