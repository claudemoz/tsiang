"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, LoaderCircleIcon, PlayIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabDemoStrings } from "@/lib/lab-demo-strings";
import { CodeBlock, Segmented, type CopyLabels } from "./controls";
import { useTrack } from "./guide";

type Distro = "deb" | "rpm";
type Arch = "amd64" | "arm64";
type Labels = LabDemoStrings["install"] & CopyLabels & { reset: string };

const unameArch: Record<Arch, string> = { amd64: "x86_64", arm64: "aarch64" };

/** nfpm naming: Debian uses amd64/arm64, RPM uses the kernel names x86_64/aarch64. */
const packageName = (distro: Distro, arch: Arch) =>
  distro === "deb" ? `agent_${arch}.deb` : `agent.${unameArch[arch]}.rpm`;

async function sha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
const STEP_MS = 600;

export function AgentInstallDemo({ labels }: { labels: Labels }) {
  const [distro, setDistro] = useState<Distro>("deb");
  const [arch, setArch] = useState<Arch>("amd64");
  const [corrupt, setCorrupt] = useState(false);
  /** Steps finished so far (0 to 4), the step running, and the checksum pair once computed. */
  const [doneCount, setDoneCount] = useState(0);
  const [current, setCurrent] = useState<number | null>(null);
  const [sums, setSums] = useState<{ expected: string; computed: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const run = useRef(0);
  const track = useTrack();
  // A run still pending when the demo unmounts must not touch its state.
  useEffect(() => () => void run.current++, []);

  const pkg = packageName(distro, arch);
  const manager = distro === "deb" ? "apt" : "dnf";
  const installCommand = `${manager} install ./${pkg}`;
  const serviceCommand = "systemctl enable --now agent";
  const running = current !== null;
  const started = running || doneCount > 0 || failed;

  function reset() {
    run.current++;
    setDoneCount(0);
    setCurrent(null);
    setSums(null);
    setFailed(false);
  }

  async function start(damaged = corrupt) {
    reset();
    const id = run.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let i = 0; i < 4; i++) {
      setCurrent(i);
      await pause(reduced ? 0 : STEP_MS);
      if (id !== run.current) return;
      if (i === 1) {
        // The package the API serves, and the one that reached the server.
        const served = new TextEncoder().encode(`${pkg}\n`.repeat(512));
        const received = served.slice();
        if (damaged) received[received.length >> 1] ^= 0x20;
        const [expected, computed] = await Promise.all([sha256(served), sha256(received)]);
        if (id !== run.current) return;
        setSums({ expected, computed });
        if (expected !== computed) {
          track("install.fail");
          setFailed(true);
          setCurrent(null);
          return;
        }
      }
      setDoneCount(i + 1);
    }
    setCurrent(null);
    track("install.success");
  }

  /** After a failed checksum: untick the damage and run again, in one click. */
  function retryClean() {
    setCorrupt(false);
    void start(false);
  }

  const copyLabels = { copy: labels.copy, copied: labels.copied };
  const details: React.ReactNode[] = [
    <dl key="0" className="grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
      <dt className="text-muted-foreground">{labels.manager}</dt>
      <dd>{manager}</dd>
      <dt className="text-muted-foreground">uname -m</dt>
      <dd>
        {unameArch[arch]}, {arch}
      </dd>
    </dl>,
    <div key="1">
      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
        <dt className="text-muted-foreground">{labels.package}</dt>
        <dd>{pkg}</dd>
        {sums ? (
          <>
            <dt className="text-muted-foreground">{labels.expected}</dt>
            <dd className="font-mono text-[13px] break-all">{sums.expected}</dd>
            <dt className="text-muted-foreground">{labels.computed}</dt>
            <dd className={`font-mono text-[13px] break-all ${failed ? "text-destructive" : ""}`}>{sums.computed}</dd>
          </>
        ) : null}
      </dl>
      {sums ? (
        <p className={`mt-2 font-medium ${failed ? "text-destructive" : ""}`}>{failed ? labels.mismatch : labels.match}</p>
      ) : null}
      {failed ? (
        <Button size="lg" variant="outline" className="mt-3" onClick={retryClean}>
          <RotateCcwIcon aria-hidden />
          {labels.retryClean}
        </Button>
      ) : null}
    </div>,
    <div key="2">
      <CodeBlock copy={{ text: installCommand, labels: copyLabels }}>{installCommand}</CodeBlock>
      <dl className="mt-2">
        <dt className="text-muted-foreground">{labels.deps}</dt>
        <dd>wireguard-tools, iptables, iproute2</dd>
      </dl>
    </div>,
    <div key="3">
      <CodeBlock copy={{ text: serviceCommand, labels: copyLabels }}>{serviceCommand}</CodeBlock>
      <p className="mt-2">{labels.interface}</p>
      <p>{labels.service}</p>
    </div>,
  ];

  // One sentence for screen readers per change, instead of re-reading the whole list.
  const status = failed
    ? labels.mismatch
    : doneCount === 4
      ? labels.enrolled
      : running
        ? `${labels.running}, ${labels.steps[current]}`
        : "";

  return (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <Segmented<Distro>
          label={labels.distro}
          value={distro}
          onChange={(v) => {
            setDistro(v);
            track("install.variant");
            reset();
          }}
          options={[
            { value: "deb", label: "Debian / Ubuntu" },
            { value: "rpm", label: "RHEL / Fedora" },
          ]}
        />
        <Segmented<Arch>
          label={labels.arch}
          value={arch}
          onChange={(v) => {
            setArch(v);
            track("install.variant");
            reset();
          }}
          options={[
            { value: "amd64", label: "amd64" },
            { value: "arm64", label: "arm64" },
          ]}
        />
      </div>

      <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-[15px]">
        <input
          type="checkbox"
          checked={corrupt}
          onChange={(e) => {
            setCorrupt(e.target.checked);
            reset();
          }}
          className="size-4 accent-primary"
        />
        {labels.corrupt}
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="xl" onClick={() => void start()} disabled={running}>
          {running ? (
            <LoaderCircleIcon aria-hidden className="animate-spin motion-reduce:animate-none" />
          ) : (
            <PlayIcon aria-hidden />
          )}
          {labels.run}
        </Button>
        {started ? (
          <Button size="xl" variant="outline" onClick={reset}>
            <RotateCcwIcon aria-hidden />
            {labels.reset}
          </Button>
        ) : null}
      </div>
      <p className="sr-only" role="status">
        {status}
      </p>

      <ol aria-label={labels.stepsLabel} className="mt-6 divide-y divide-border border-y border-border">
        {labels.steps.map((title, i) => {
          const isDone = i < doneCount;
          const isCurrent = current === i;
          const isFailed = failed && i === 1;
          return (
            <li key={title} className="flex gap-4 py-4" aria-current={isCurrent ? "step" : undefined}>
              <span
                aria-hidden
                className={`grid size-7 shrink-0 place-items-center rounded-full text-caption font-semibold tabular-nums ${
                  isFailed
                    ? "bg-destructive/10 text-destructive"
                    : isDone
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary-soft text-foreground ring-2 ring-signal"
                        : "bg-primary-soft text-primary"
                }`}
              >
                {isFailed ? <XIcon className="size-4" /> : isDone ? <CheckIcon className="size-4" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className={isDone || isCurrent || isFailed ? "font-medium" : "text-muted-foreground"}>{title}</p>
                {isDone || isFailed ? <div className="mt-3 text-[15px]">{details[i]}</div> : null}
              </div>
            </li>
          );
        })}
      </ol>

      {doneCount === 4 ? (
        <p className="mt-4 flex gap-3 leading-relaxed">
          <CheckIcon aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
          {labels.enrolled}
        </p>
      ) : null}
    </div>
  );
}
