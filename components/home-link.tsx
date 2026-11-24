"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { stripLocale } from "@/lib/i18n";

/**
 * The name in the header. From another page it is a plain link home. On the home page itself
 * (scrolled down, or on /#projets), Next does not scroll for a same-page link, so this goes back to
 * the top and drops the hash: the name always means "the top of my home page".
 */
export function HomeLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || stripLocale(window.location.pathname) !== stripLocale(href)) return;
        e.preventDefault();
        if (window.location.hash) history.replaceState(history.state, "", href);
        window.scrollTo({ top: 0 });
      }}
      {...props}
    />
  );
}
