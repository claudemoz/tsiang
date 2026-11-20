"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, CalendarDaysIcon } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { BookingConfig, BookingProvider } from "@/data/profile";

/**
 * Calendly lays its booking page out full-bleed (no gray margins around the card) below about
 * 650px of width, so the dialog is capped at 40rem (640px). Its height follows the page height
 * Calendly reports through postMessage, so there is no empty band under the card either.
 */
const FALLBACK_HEIGHT = 680;

/** Calendly colors follow the site palette (hex without #). */
const CALENDLY_PARAMS = new URLSearchParams({
  embed_type: "Inline",
  hide_gdpr_banner: "1",
  primary_color: "0e6377",
  text_color: "0f1d21",
  background_color: "ffffff",
});

/**
 * "Planifier un échange": the booking calendar in a dialog, preloaded so it opens instantly.
 * The iframe is created once the page has finished loading and the browser is idle (or as soon as
 * the visitor points at the button), inside a dialog that stays mounted while closed. It never
 * competes with the page's own loading.
 */
export type BookingLabels = { trigger: string; title: string; description: string; iframeTitle: string; back: string };

/**
 * Which service to embed. The configured provider is the default; for testing, `?rdv=calcom` or
 * `?rdv=calendly` in the page URL switches to the other one when its URL is set. Read in the
 * browser only, when the embed is created, so the server render stays the same.
 */
function pickProvider(booking: BookingConfig): BookingProvider {
  const asked = new URLSearchParams(window.location.search).get("rdv");
  if ((asked === "calcom" || asked === "calendly") && booking.urls[asked]) return asked;
  return booking.provider;
}

function embedUrl(provider: BookingProvider, url: string) {
  const join = url.includes("?") ? "&" : "?";
  if (provider === "calendly") {
    // Calendly only posts its page height when it knows the embedding domain.
    const params = new URLSearchParams(CALENDLY_PARAMS);
    params.set("embed_domain", window.location.host);
    return `${url}${join}${params}`;
  }
  // Cal.com follows the site's light or dark theme; colors come from the Cal.com appearance settings.
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return `${url}${join}${new URLSearchParams({ embed: "true", layout: "month_view", theme: dark ? "dark" : "light" })}`;
}

/**
 * Cal.com only: true when the embed left the page it was opened on (the visitor picked a meeting
 * type and now sees its time slots). Cal.com reports navigation with `__routeChanged` and the
 * choice with `eventTypeSelected`; the page itself is cross-origin and cannot be read.
 */
function leftStartPage(e: MessageEvent): boolean {
  if (!e.origin.endsWith("cal.com")) return false;
  const type = (e.data as { type?: unknown } | null)?.type;
  return type === "__routeChanged" || type === "eventTypeSelected";
}

/** Height reported by the embedded page, whichever service it is; null when the message is not one. */
function reportedHeight(e: MessageEvent): number | null {
  const data = e.data as Record<string, unknown> | null;
  if (!data || typeof data !== "object") return null;
  if (e.origin.endsWith("calendly.com")) {
    const payload = data.payload as { height?: string } | undefined;
    return data.event === "calendly.page_height" && payload?.height ? Number.parseInt(payload.height, 10) : null;
  }
  if (e.origin.endsWith("cal.com")) {
    const inner = data.data as { iframeHeight?: number } | undefined;
    return typeof inner?.iframeHeight === "number" ? inner.iframeHeight : null;
  }
  return null;
}

export function BookingDialog({
  booking,
  labels,
  className,
  preloadOnIdle = true,
}: {
  booking: BookingConfig;
  labels: BookingLabels;
  className?: string;
  /** Load the calendar once the page is idle. Only one button per page should, the others load on hover. */
  preloadOnIdle?: boolean;
}) {
  const [embed, setEmbed] = useState<{ src: string; provider: BookingProvider } | null>(null);
  const [height, setHeight] = useState(FALLBACK_HEIGHT);
  const [loaded, setLoaded] = useState(false);
  /** Bumped on close: the iframe reloads in the background, so the next opening starts from the calendar. */
  const [session, setSession] = useState(0);
  /** Cal.com: the visitor is on a meeting type's slots and can go back to the list of types. */
  const [canGoBack, setCanGoBack] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  /** Starts the booking flow over: a new iframe on the start page (the list of meeting types). */
  const restart = () => {
    setLoaded(false);
    setCanGoBack(false);
    setSession((n) => n + 1);
  };

  const preload = embed !== null;
  const setPreload = (on: boolean) => {
    if (!on || embed) return;
    const provider = pickProvider(booking);
    setEmbed({ provider, src: embedUrl(provider, booking.urls[provider]!) });
  };

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const h = reportedHeight(e);
      if (h !== null && Number.isFinite(h) && h > 80) setHeight(h);
      // Two booking buttons can be on the page: only this dialog's own iframe counts.
      if (e.source === frame.current?.contentWindow && leftStartPage(e)) setCanGoBack(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (embed || !preloadOnIdle) return;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(() => setPreload(true), { timeout: 4000 });
      else timer = setTimeout(() => setPreload(true), 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embed]);

  const warmUp = () => setPreload(true);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open || !embed) return;
        // Wait for the close animation, then restart the booking flow out of sight.
        setTimeout(restart, 250);
      }}
    >
      <DialogTrigger
        onPointerEnter={warmUp}
        onFocus={warmUp}
        className={cn(buttonVariants({ variant: "outline", size: "xl" }), className)}
      >
        <CalendarDaysIcon />
        {labels.trigger}
      </DialogTrigger>
      <DialogContent
        keepMounted
        className={cn(
          "flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0",
          // Calendly drops its gray margins under ~650px; Cal.com needs room for its two-column layout.
          embed?.provider === "calcom" ? "sm:max-w-[min(64rem,calc(100%-2rem))]" : "sm:max-w-[40rem]",
        )}
      >
        <DialogHeader className="flex-row items-center gap-3 border-b border-border px-5 py-4 pr-12">
          {canGoBack && embed?.provider === "calcom" ? (
            <button
              type="button"
              onClick={restart}
              aria-label={labels.back}
              title={labels.back}
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeftIcon className="size-5" />
            </button>
          ) : (
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
              <CalendarDaysIcon className="size-5" />
            </span>
          )}
          <span className="min-w-0">
            <DialogTitle className="font-display text-lg font-semibold tracking-tight">{labels.title}</DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
          </span>
        </DialogHeader>
        <div
          className={`relative min-h-0 flex-1 overflow-y-auto overscroll-contain ${embed?.provider === "calcom" ? "bg-popover" : "bg-white"}`}
        >
          {loaded ? null : (
            <div aria-hidden className="absolute inset-0 animate-pulse space-y-4 p-6">
              <div className="mx-auto h-4 w-1/3 rounded bg-[#e7eded]" />
              <div className="mx-auto h-6 w-1/2 rounded bg-[#e7eded]" />
              <div className="mx-auto mt-8 grid max-w-sm grid-cols-7 gap-2">
                {Array.from({ length: 28 }, (_, i) => (
                  <div key={i} className="aspect-square rounded-full bg-[#eef3f3]" />
                ))}
              </div>
            </div>
          )}
          {preload && embed ? (
            <iframe
              key={session}
              ref={frame}
              src={embed.src}
              data-provider={embed.provider}
              title={labels.iframeTitle}
              style={{ height }}
              className="relative block w-full border-0"
              allow="payment"
              onLoad={() => setLoaded(true)}
            />
          ) : (
            <div style={{ height }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
