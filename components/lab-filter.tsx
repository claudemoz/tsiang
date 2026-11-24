"use client";

import { useState, type ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type LabFilterItem = { key: string; category: string; row: ReactNode };

/**
 * The Lab's category tab bar, same look as the project filter: "Tous" then every category with its
 * count, empty ones included (they say so when picked). Rows are rendered on the server and only
 * shown or hidden here.
 */
export function LabFilter({
  items,
  categories,
  labels,
}: {
  items: LabFilterItem[];
  categories: { value: string; label: string }[];
  labels: { aria: string; all: string; shown: string; empty: string };
}) {
  const [active, setActive] = useState("all");
  const visible = items.filter((i) => active === "all" || i.category === active);
  const options = [{ value: "all", label: labels.all }, ...categories];

  return (
    <>
      <ToggleGroup
        aria-label={labels.aria}
        value={[active]}
        // Single choice that can never be empty: clicking the active tab keeps it.
        onValueChange={(value: string[]) => {
          const next = value.at(-1);
          if (next) setActive(next);
        }}
        spacing={1}
        className="flex-wrap rounded-xl border border-border bg-card p-1"
      >
        {options.map((o) => (
          <ToggleGroupItem
            key={o.value}
            value={o.value}
            className="h-9 gap-2 px-3.5 text-[15px] text-muted-foreground hover:text-foreground data-pressed:bg-primary data-pressed:text-primary-foreground"
          >
            {o.label}
            <span className="text-caption tabular-nums opacity-70">
              {items.filter((i) => o.value === "all" || i.category === o.value).length}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="sr-only" aria-live="polite">
        {visible.length} {labels.shown}
      </p>
      {visible.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {visible.map((i) => (
            <li key={i.key}>{i.row}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 border-y border-border py-10 text-muted-foreground">{labels.empty}</p>
      )}
    </>
  );
}
