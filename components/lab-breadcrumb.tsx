import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

/**
 * Where the visitor is in the Lab: Lab, then the lab, then (on a note or demo) nothing more, since
 * the page title says it. Every crumb is a link; the current page is not repeated.
 */
export function LabBreadcrumb({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 ? <ChevronRightIcon aria-hidden className="size-3.5 shrink-0" /> : null}
            <Link href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
