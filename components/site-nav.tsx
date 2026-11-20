"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavId } from "@/data/navigation";
import { stripLocale } from "@/lib/i18n";

export type NavLink = { id: NavId; href: string; label: string };

export const navLinkClass =
  "relative rounded-lg px-3 py-2 text-[15px] transition-colors hover:text-foreground";

/** Highlights the section currently in view on the home page, "Projets" on project pages, "Lab" on /lab. */
export function SiteNav({ items }: { items: NavLink[] }) {
  // Same value on the server ("/fr/…" from the rewrite) and in the browser ("/…" or "/en/…").
  const path = stripLocale(usePathname() ?? "/");
  const [inView, setInView] = useState<NavId | null>(null);
  const onHome = path === "/";

  useEffect(() => {
    if (!onHome) return;
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setInView(top.target.id as NavId);
        } else if (window.scrollY < 200) {
          setInView(null);
        }
      },
      // A section counts as current once it crosses the upper third of the viewport.
      { rootMargin: "-20% 0px -65% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome, items]);

  const active: NavId | null = path.startsWith("/projets")
    ? "projets"
    : path.startsWith("/lab")
      ? "lab"
      : onHome
        ? inView
        : null;

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const current = active === item.id;
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              aria-current={current ? "true" : undefined}
              className={`${navLinkClass} ${current ? "text-foreground" : "text-muted-foreground"}`}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary transition-opacity ${
                  current ? "opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Server-safe fallback used while the pathname is not known (prerendering). */
export function SiteNavFallback({ items }: { items: NavLink[] }) {
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={item.href} className={`${navLinkClass} text-muted-foreground`}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
