"use client";

import { useState } from "react";
import { CheckIcon, ColumnsIcon, FileTextIcon, ListChecksIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabDemoStrings } from "@/lib/lab-demo-strings";
import { Segmented } from "./controls";
import { useTrack } from "./guide";

type Mode = "before" | "after";
type Labels = LabDemoStrings["packaging"] & { reset: string };

/**
 * What the VPN server holds after `done` steps. Before: Docker, then the compose file, then the
 * container with its network rights, then the agent inside. After: the agent as a systemd service,
 * with its dependencies, in one step.
 */
function ServerStack({ mode, done, labels }: { mode: Mode; done: number; labels: Labels }) {
  const l = labels.layers;
  const total = mode === "before" ? labels.stepsBefore.length : labels.stepsAfter.length;
  const running = done >= total;
  return (
    <div className="rounded-lg border border-dashed border-border p-3">
      <p className="text-caption text-muted-foreground">{l.vps}</p>
      {done === 0 ? (
        <p className="mt-3 py-6 text-center text-[15px] text-muted-foreground">{labels.empty}</p>
      ) : mode === "before" ? (
        <div className="mt-2 rounded-md border border-border bg-muted p-2.5">
          <p className="text-[15px] font-medium">{l.docker}</p>
          {done >= 2 ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-caption">
              <FileTextIcon aria-hidden className="size-3.5 text-muted-foreground" />
              {l.compose}
            </p>
          ) : null}
          {done >= 3 ? (
            <div className="mt-2 rounded-md border border-dashed border-foreground/30 bg-card p-2.5">
              <p className="text-[15px] font-medium">{l.container}</p>
              <p className="text-caption text-muted-foreground">{l.rights}</p>
              {done >= 4 ? <AgentBox title={l.agent} detail={l.agentDocker} /> : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          <AgentBox title={l.agent} detail={l.agentPackage} />
          <div className="rounded-md border border-border bg-card px-2.5 py-2 text-caption">
            <span className="block">{l.deps}</span>
            <span className="block text-muted-foreground">{l.depsLabel}</span>
          </div>
        </div>
      )}
      {running ? (
        <p className="mt-3 flex items-center gap-2 text-[15px] font-medium">
          <span aria-hidden className="size-2 rounded-full bg-primary" />
          {labels.installed}
        </p>
      ) : null}
    </div>
  );
}

function AgentBox({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mt-2 rounded-md border-2 border-primary bg-primary-soft px-2.5 py-2">
      <p className="text-[15px] font-medium">{title}</p>
      <p className="text-caption text-muted-foreground">{detail}</p>
    </div>
  );
}

export function PackagingDemo({ labels }: { labels: Labels }) {
  const [mode, setMode] = useState<Mode>("before");
  const [progress, setProgress] = useState<Record<Mode, number>>({ before: 0, after: 0 });
  const [compare, setCompare] = useState(false);
  const track = useTrack();

  const steps = mode === "before" ? labels.stepsBefore : labels.stepsAfter;
  const done = progress[mode];
  const finished = done >= steps.length;
  const bothDone = progress.before >= labels.stepsBefore.length && progress.after >= labels.stepsAfter.length;
  const count = (n: number) => `${n} ${n === 1 ? labels.stepOne : labels.stepMany}`;

  function nextStep() {
    const n = done + 1;
    setProgress((p) => ({ ...p, [mode]: n }));
    if (n >= steps.length) track(mode === "before" ? "pack.before" : "pack.after");
  }

  function reset() {
    setProgress({ before: 0, after: 0 });
    setCompare(false);
    setMode("before");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Segmented<Mode>
          label={labels.mode}
          value={mode}
          onChange={setMode}
          options={[
            { value: "before", label: `${labels.before} (${count(labels.stepsBefore.length)})` },
            { value: "after", label: `${labels.after} (${count(labels.stepsAfter.length)})` },
          ]}
        />
        {progress.before + progress.after > 0 ? (
          <Button variant="outline" size="lg" onClick={reset}>
            <RotateCcwIcon aria-hidden />
            {labels.reset}
          </Button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="flex items-baseline justify-between gap-3 text-[15px] font-medium">
            {labels.todoTitle}
            <span className="font-normal text-muted-foreground tabular-nums">
              {done} / {steps.length}
            </span>
          </h4>
          <ol className="mt-3 divide-y divide-border border-y border-border">
            {steps.map((step, i) => {
              const ok = i < done;
              const current = i === done;
              return (
                <li key={step} className="flex gap-3 py-3" aria-current={current ? "step" : undefined}>
                  <span
                    aria-hidden
                    className={`grid size-6 shrink-0 place-items-center rounded-full text-caption font-semibold tabular-nums ${
                      ok
                        ? "bg-primary text-primary-foreground"
                        : current
                          ? "bg-primary-soft text-foreground ring-2 ring-signal"
                          : "bg-primary-soft text-primary"
                    }`}
                  >
                    {ok ? <CheckIcon className="size-3.5" /> : i + 1}
                  </span>
                  <span className={ok || current ? "" : "text-muted-foreground"}>
                    {step}
                    {mode === "after" ? (
                      <span className="mt-1 block text-[15px] text-muted-foreground">{labels.afterDetail}</span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ol>
          <Button size="lg" className="mt-4" onClick={nextStep} disabled={finished}>
            <ListChecksIcon aria-hidden />
            {labels.next}
          </Button>
        </div>

        <div>
          <h4 className="text-[15px] font-medium">{labels.serverTitle}</h4>
          <div className="mt-3" aria-live="polite">
            <ServerStack mode={mode} done={done} labels={labels} />
          </div>
        </div>
      </div>

      {bothDone ? (
        <div className="mt-8 border-t border-border pt-6">
          <Button
            variant="outline"
            size="lg"
            aria-pressed={compare}
            onClick={() => {
              setCompare((c) => !c);
              track("pack.compare");
            }}
          >
            <ColumnsIcon aria-hidden />
            {labels.compare}
          </Button>
          {compare ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(["before", "after"] as const).map((m) => (
                <div key={m}>
                  <p className="text-[15px] font-medium">{m === "before" ? labels.before : labels.after}</p>
                  <div className="mt-2">
                    <ServerStack mode={m} done={progress[m]} labels={labels} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <h4 className="mt-6 text-[15px] font-medium">{labels.outcomesTitle}</h4>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {labels.outcomes.map((o) => (
              <li key={o} className="flex gap-2.5 leading-snug">
                <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
