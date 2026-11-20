"use client";

import Link from "next/link";
import { useState } from "react";
import { DownloadIcon, MenuIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavLink } from "./site-nav";

/** Phone and tablet navigation: the full menu in a side sheet. */
export function MobileNav({
  items,
  name,
  subtitle,
  cv,
  labels,
}: {
  items: NavLink[];
  name: string;
  subtitle: string;
  cv: string;
  labels: { openMenu: string; mainNav: string; downloadCv: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={labels.openMenu}
        className={buttonVariants({ variant: "ghost", size: "icon-lg", className: "md:hidden" })}
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(20rem,85vw)] gap-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="font-display text-xl font-semibold tracking-tight">{name}</SheetTitle>
          <SheetDescription>{subtitle}</SheetDescription>
        </SheetHeader>
        <Separator />
        <nav aria-label={labels.mainNav} className="px-3 py-3">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <SheetClose
                  nativeButton={false}
                  render={<Link href={item.href} />}
                  className="flex h-11 items-center rounded-lg px-3 text-[17px] transition-colors hover:bg-muted"
                >
                  {item.label}
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <Separator />
        <div className="p-6">
          <a href={cv} download className={buttonVariants({ size: "xl", className: "w-full" })}>
            <DownloadIcon />
            {labels.downloadCv}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
