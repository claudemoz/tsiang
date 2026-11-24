"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckIcon } from "lucide-react";

/** Events a demo reports; the guide ticks the matching "À essayer" item. */
const TrackContext = createContext<(event: string) => void>(() => {});

/** Inside a demo: `const track = useTrack(); track("install.success")`. A no-op outside a guide. */
export const useTrack = () => useContext(TrackContext);

/**
 * "À essayer": a short list of things to do in the demo, ticked as the visitor does them.
 * It tells a first-time visitor where to start, and shows the demo has more than one trick.
 * `events[i]` is the event that ticks `items[i]`.
 */
export function DemoGuide({
  title,
  of,
  items,
  events,
  aside,
  doneLabel,
  children,
}: {
  title: string;
  of: string;
  items: string[];
  events: string[];
  /** Screen-reader suffix of a ticked item ("fait"). */
  doneLabel: string;
  /** Rendered beside the list (the glossary). */
  aside?: ReactNode;
  children: ReactNode;
}) {
  const [done, setDone] = useState<string[]>([]);
  const track = useCallback(
    (event: string) => setDone((d) => (d.includes(event) || !events.includes(event) ? d : [...d, event])),
    [events],
  );
  const count = events.filter((e) => done.includes(e)).length;

  return (
    <TrackContext.Provider value={track}>
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div>
          <h3 className="flex items-baseline justify-between gap-3 text-[15px] font-medium">
            {title}
            <span className="font-normal text-muted-foreground tabular-nums" aria-live="polite">
              {count} {of} {items.length}
            </span>
          </h3>
          <ul className="mt-3 space-y-2.5 text-[15px]">
            {items.map((item, i) => {
              const ok = done.includes(events[i]);
              return (
                <li key={item} className="flex gap-3 leading-snug">
                  <span
                    aria-hidden
                    className={`mt-px grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
                      ok ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                    }`}
                  >
                    {ok ? <CheckIcon className="size-3" strokeWidth={3} /> : null}
                  </span>
                  <span className={ok ? "text-muted-foreground" : ""}>
                    {item}
                    {ok ? <span className="sr-only"> ({doneLabel})</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        {aside}
      </div>
      {children}
    </TrackContext.Provider>
  );
}
