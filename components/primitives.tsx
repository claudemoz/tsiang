import type { ComponentProps, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`} {...props} />;
}

/**
 * Sections read like a résumé: the heading sits in the left margin column,
 * the content runs in the wide column. `wide` puts the content under the heading
 * at full width (used for project screenshots).
 */
export function Section({
  id,
  title,
  children,
  intro,
  wide = false,
  tone = "default",
}: {
  id: string;
  title: string;
  /** One factual sentence that frames the section. */
  intro?: ReactNode;
  children: ReactNode;
  wide?: boolean;
  /** "region": the brand blue band, reserved for the contact section. */
  tone?: "default" | "region";
}) {
  const headingId = `${id}-titre`;
  const toneClass = tone === "region" ? "bg-region text-on-region" : "border-t border-border";
  return (
    <section id={id} aria-labelledby={headingId} className={`py-16 sm:py-24 ${toneClass}`}>
      <Container className={wide ? "" : "grid gap-8 lg:grid-cols-12 lg:gap-12"}>
        <div
          className={
            wide
              ? "mb-10 grid gap-3 sm:mb-14 lg:grid-cols-12 lg:items-end lg:gap-12"
              : "lg:sticky lg:top-24 lg:col-span-3 lg:self-start"
          }
        >
          <h2
            id={headingId}
            className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${wide ? "lg:col-span-3" : ""}`}
          >
            {title}
          </h2>
          {intro ? (
            <p
              className={`text-pretty ${tone === "region" ? "text-on-region-muted" : "text-muted-foreground"} ${
                wide ? "max-w-[60ch] text-lg lg:col-span-9" : "mt-3 max-w-[34ch] text-[15px]"
              }`}
            >
              {intro}
            </p>
          ) : null}
        </div>
        <div className={wide ? "" : "lg:col-span-9"}>{children}</div>
      </Container>
    </section>
  );
}

/** Technologies written as a plain sentence instead of a row of pills. */
export function StackLine({
  items,
  className = "",
  label = "Technologies\u00a0: ",
}: {
  items: string[];
  className?: string;
  /** Screen-reader prefix, localized by the caller. */
  label?: string;
}) {
  return (
    <p className={`text-[15px] text-muted-foreground ${className}`}>
      <span className="sr-only">{label}</span>
      {items.join(", ")}
    </p>
  );
}

/** Page-level buttons are shadcn `Button` variants, applied to links. */
export const buttonStyles = {
  primary: buttonVariants({ size: "xl" }),
  secondary: buttonVariants({ variant: "outline", size: "xl" }),
};

/** Links on the deep petrol band (contact section and footer). */
export const regionLink =
  "underline decoration-on-region-muted/60 decoration-1 underline-offset-4 transition-colors hover:decoration-on-region hover:decoration-2";

export const textLink =
  "underline decoration-primary/40 decoration-1 underline-offset-4 transition-colors hover:decoration-primary hover:decoration-2";
