"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/** Single-choice segmented control, same look as the project filter (selected item in `primary`). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-[15px] text-muted-foreground" aria-hidden>
        {label}
      </p>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(next: string[]) => {
          const v = next.at(-1);
          if (v) onChange(v as T);
        }}
        spacing={1}
        className="mt-2 flex-wrap rounded-xl border border-border bg-card p-1"
      >
        {options.map((o) => (
          <ToggleGroupItem
            key={o.value}
            value={o.value}
            className="h-9 px-3.5 text-[15px] text-muted-foreground hover:text-foreground data-pressed:bg-primary data-pressed:text-primary-foreground"
          >
            {o.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export type CopyLabels = { copy: string; copied: string };

/** Copies `text`, then says "Copié" for 2 s. Hidden when the clipboard API is missing. */
export function CopyButton({ text, labels, className = "" }: { text: string; labels: CopyLabels; className?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 2000);
    } catch {
      // Clipboard refused (permissions, insecure context): nothing to undo.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2 text-caption font-medium text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      {done ? <CheckIcon aria-hidden className="size-3.5 text-primary" /> : <CopyIcon aria-hidden className="size-3.5" />}
      <span aria-live="polite">{done ? labels.copied : labels.copy}</span>
    </button>
  );
}

/**
 * Code, config files and bytes. The only monospace on the site: it is real code, not a label.
 * Scrolls inside itself so the page never scrolls sideways. With `copy`, a copy button sits top right.
 */
export function CodeBlock({
  children,
  label,
  className = "",
  preClassName = "",
  copy,
}: {
  children: ReactNode;
  label?: string;
  /** Spacing around the block. */
  className?: string;
  /** Wrapping and breaking inside the block. */
  preClassName?: string;
  copy?: { text: string; labels: CopyLabels };
}) {
  const pre = (
    <pre
      aria-label={label}
      tabIndex={0}
      className={`max-w-full overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-[13px] leading-relaxed text-foreground ${
        copy ? "pr-24" : className
      } ${preClassName}`}
    >
      <code>{children}</code>
    </pre>
  );
  if (!copy) return pre;
  return (
    <div className={`relative ${className}`}>
      {pre}
      <CopyButton text={copy.text} labels={copy.labels} className="absolute top-2.5 right-2.5" />
    </div>
  );
}

export const inputClass =
  "mt-2 h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-[15px] text-foreground outline-none transition-colors focus-visible:border-primary aria-invalid:border-destructive";

export const fieldLabel = "block text-[15px] text-muted-foreground";
