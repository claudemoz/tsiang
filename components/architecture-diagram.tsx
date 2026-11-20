import type { Project } from "@/data/projects";

type Architecture = NonNullable<Project["architecture"]>;

/**
 * Architecture sketch for projects without screenshots: one central service, the protocol that
 * links it, and three remote nodes (illustrative, not a count). Drawn with HTML so it follows the
 * theme and stays crisp at any size.
 */
export function ArchitectureDiagram({
  architecture: a,
  compact = false,
  caption,
  className = "",
}: {
  architecture: Architecture;
  compact?: boolean;
  /** Screen-reader description, localized by the caller. */
  caption?: string;
  className?: string;
}) {
  const box = compact ? "rounded-md px-2 py-1.5" : "rounded-lg px-4 py-3";
  return (
    <figure
      className={`flex flex-col items-center justify-center rounded-xl border border-border bg-primary-soft ${
        compact ? "gap-2 p-4" : "gap-4 px-6 py-12 sm:py-16"
      } ${className}`}
    >
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
      <div aria-hidden className={`${box} border border-primary bg-card text-center shadow-sm`}>
        <p className={`font-semibold ${compact ? "text-caption" : "text-[17px]"}`}>{a.center}</p>
        {compact ? null : <p className="mt-0.5 text-caption text-muted-foreground">{a.centerDetail}</p>}
      </div>
      <div aria-hidden className="flex flex-col items-center">
        <span className={`w-px bg-primary/50 ${compact ? "h-3" : "h-5"}`} />
        <span
          className={`rounded-full border border-primary/30 bg-card font-medium text-primary ${
            compact ? "px-2 text-micro" : "px-3 py-0.5 text-caption"
          }`}
        >
          {a.link}
        </span>
        <span className={`w-px bg-primary/50 ${compact ? "h-3" : "h-5"}`} />
      </div>
      <div aria-hidden className={`grid w-full grid-cols-3 ${compact ? "max-w-[15rem] gap-2" : "max-w-xl gap-3"}`}>
        {[1, 2, 3].map((n) => (
          <div key={n} className={`${box} border border-border bg-card text-center`}>
            <p className={`font-medium ${compact ? "text-micro" : "text-[15px]"}`}>{a.node}</p>
            {compact ? null : <p className="mt-0.5 text-caption text-muted-foreground">{a.nodeDetail}</p>}
          </div>
        ))}
      </div>
    </figure>
  );
}
