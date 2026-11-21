"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquareTerminalIcon } from "lucide-react";
import { stripLocale } from "@/lib/i18n";

/**
 * A small console screen: ink in light mode, card surface in dark mode (an inverted white block
 * would shout on a dark page), with an inner hairline like a terminal window.
 */
export const consoleSurface =
  "console-link group bg-foreground text-background ring-1 ring-inset ring-background/10 shadow-sm transition-colors hover:bg-foreground/90 dark:bg-card dark:text-foreground dark:ring-border dark:hover:bg-muted";

/** Block cursor after the label: amber `signal` on /lab (what is current), dim otherwise. */
export function ConsoleCursor({ current, className = "" }: { current: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`console-cursor w-1.5 rounded-[1px] ${
        current ? "bg-signal" : "bg-background/40 dark:bg-muted-foreground/60"
      } ${className}`}
    />
  );
}

export function ConsoleIcon({ current }: { current: boolean }) {
  return (
    <SquareTerminalIcon
      aria-hidden
      className={`size-4 transition-opacity ${current ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
    />
  );
}

type LabProps = { href: string; label: string; hint: string; className?: string };

function LabChip({ href, label, hint, current, className = "" }: LabProps & { current: boolean }) {
  return (
    <Link
      href={href}
      title={hint}
      aria-current={current ? "page" : undefined}
      className={`${consoleSurface} inline-flex h-9 items-center gap-1.5 rounded-lg pr-2.5 pl-2 text-[15px] font-medium ${className}`}
    >
      <ConsoleIcon current={current} />
      <span>{label}</span>
      <ConsoleCursor current={current} className="h-3.5" />
    </Link>
  );
}

function useOnLab() {
  return stripLocale(usePathname() ?? "/").startsWith("/lab");
}

export function LabLink(props: LabProps) {
  return <LabChip {...props} current={useOnLab()} />;
}

/** Server-safe fallback while the pathname is not known (prerendering). */
export function LabLinkFallback(props: LabProps) {
  return <LabChip {...props} current={false} />;
}
