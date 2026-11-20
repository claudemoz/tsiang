"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProjectRow, type ProjectRowLabels } from "./project-row";

export type FilterRow = { project: Project; href: string; diagramCaption?: string };

const matches = (p: Project, f: ProjectCategory | "all") => f === "all" || p.categories.includes(f);

export function ProjectFilter({
  rows,
  labels,
}: {
  rows: FilterRow[];
  labels: ProjectRowLabels & { filterAria: string; filterAll: string; shownSuffix: string };
}) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");
  const visible = rows.filter((r) => matches(r.project, active));
  const filters: { value: ProjectCategory | "all"; label: string }[] = [
    { value: "all", label: labels.filterAll },
    { value: "Web", label: "Web" },
    { value: "Mobile", label: "Mobile" },
    { value: "API", label: "API" },
  ];

  return (
    <>
      <ToggleGroup
        aria-label={labels.filterAria}
        value={[active]}
        // Single choice that can never be empty: clicking the active filter keeps it.
        onValueChange={(value: string[]) => {
          const next = value.at(-1);
          if (next) setActive(next as ProjectCategory | "all");
        }}
        spacing={1}
        className="flex-wrap rounded-xl border border-border bg-card p-1"
      >
        {filters.map((f) => (
          <ToggleGroupItem
            key={f.value}
            value={f.value}
            className="h-9 gap-2 px-3.5 text-[15px] text-muted-foreground hover:text-foreground data-pressed:bg-primary data-pressed:text-primary-foreground"
          >
            {f.label}
            <span className="text-caption tabular-nums opacity-70">
              {rows.filter((r) => matches(r.project, f.value)).length}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="sr-only" aria-live="polite">
        {visible.length} {labels.shownSuffix}
      </p>
      <ol className="mt-8 divide-y divide-border border-y border-border">
        {visible.map((r) => (
          <ProjectRow key={r.project.slug} project={r.project} href={r.href} labels={labels} diagramCaption={r.diagramCaption} />
        ))}
      </ol>
    </>
  );
}
