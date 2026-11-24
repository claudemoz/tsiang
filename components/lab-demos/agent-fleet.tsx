"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, LoaderCircleIcon, PlusIcon, RefreshCwIcon, SendIcon, TriangleAlertIcon, XIcon, ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabDemoStrings } from "@/lib/lab-demo-strings";
import { Segmented, fieldLabel, inputClass } from "./controls";
import { useTrack } from "./guide";

type Distro = "deb" | "rpm";
type Arch = "amd64" | "arm64";
type Status = "installing" | "online" | "down" | "restarting" | "receiving" | "updating";
type Server = {
  id: number;
  name: string;
  distro: Distro;
  arch: Arch;
  status: Status;
  /** Install progress, 0 to 3 (labels.phases). */
  phase: number;
  /** Configuration number applied by the agent. */
  rev: number;
  /** Build the agent comes from; the API and the agents are built from the same commit. */
  commit: string;
};
type Entry = { id: number; who: string; what: string };
type Labels = LabDemoStrings["fleet"] & { reset: string };

/** Made-up short commit hashes, one per API release. */
const commits = ["4f2a9c1", "b81e07d", "c3d5f62", "9e04ab7", "d7716c0", "a2c8e93", "5b9f1d4", "e60b2f8"];
const MAX_SERVERS = 6;
const distroName: Record<Distro, string> = { deb: "Debian / Ubuntu", rpm: "RHEL / Fedora" };

const initialServers: Server[] = [
  { id: 1, name: "vpn-1", distro: "deb", arch: "amd64", status: "online", phase: 3, rev: 3, commit: commits[0] },
  { id: 2, name: "vpn-2", distro: "rpm", arch: "arm64", status: "online", phase: 3, rev: 3, commit: commits[0] },
];

const busy: Status[] = ["installing", "restarting", "receiving", "updating"];

function StatusDot({ status }: { status: Status }) {
  const color = status === "online" ? "bg-primary" : status === "down" ? "bg-destructive" : "bg-signal";
  return <span aria-hidden className={`size-2 shrink-0 rounded-full ${color}`} />;
}

export function AgentFleetDemo({ labels }: { labels: Labels }) {
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [apiRelease, setApiRelease] = useState(0);
  const [revision, setRevision] = useState(3);
  const [pushing, setPushing] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("vpn-3");
  const [distro, setDistro] = useState<Distro>("deb");
  const [arch, setArch] = useState<Arch>("amd64");
  const ids = useRef({ server: 3, entry: 0 });
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const track = useTrack();
  // Latest fleet, read by delayed steps: a server removed meanwhile must not log anything.
  const current = useRef(servers);
  useEffect(() => {
    current.current = servers;
  }, [servers]);
  const alive = (id: number) => current.current.some((s) => s.id === id);

  // Pending steps must not touch the state of an unmounted demo.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function later(ms: number, fn: () => void) {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }

  const patch = (id: number, change: (s: Server) => Partial<Server> | null) =>
    setServers((ss) =>
      ss.map((s) => {
        if (s.id !== id) return s;
        const next = change(s);
        return next ? { ...s, ...next } : s;
      }),
    );

  const log = (who: string, what: string) => {
    ids.current.entry++;
    const entry = { id: ids.current.entry, who, what };
    setEntries((e) => [entry, ...e].slice(0, 8));
  };

  const apiCommit = commits[apiRelease % commits.length];
  const trimmed = name.trim();
  const taken = servers.some((s) => s.name === trimmed);
  const full = servers.length >= MAX_SERVERS;

  function addServer() {
    if (!trimmed || taken || full) return;
    const id = ids.current.server++;
    const commit = apiCommit;
    const rev = revision;
    setServers((ss) => [...ss, { id, name: trimmed, distro, arch, status: "installing", phase: 0, rev, commit }]);
    log(trimmed, labels.log.created);
    track("fleet.add");
    later(700, () => {
      if (!alive(id)) return;
      patch(id, () => ({ phase: 1 }));
      log(trimmed, `${labels.log.installed} (${distro === "deb" ? ".deb" : ".rpm"}, ${arch})`);
    });
    later(1400, () => patch(id, () => ({ phase: 2 })));
    later(2100, () => {
      if (!alive(id)) return;
      patch(id, () => ({ phase: 3, status: "online" }));
      log(trimmed, labels.log.enrolled);
    });
    setName(`vpn-${ids.current.server}`);
  }

  function crash(s: Server) {
    patch(s.id, () => ({ status: "down" }));
    log(s.name, labels.log.crashed);
    track("fleet.crash");
    later(1300, () => patch(s.id, (x) => (x.status === "down" ? { status: "restarting" } : null)));
    later(2100, () => {
      if (!alive(s.id)) return;
      patch(s.id, (x) => (x.status === "restarting" ? { status: "online" } : null));
      log(s.name, labels.log.restarted);
    });
  }

  /** Every online agent gets the new configuration at the same time, each at its own pace. */
  function push() {
    const rev = revision + 1;
    setRevision(rev);
    setPushing(true);
    log(labels.api, `${labels.log.push} (${labels.config}${rev})`);
    track("fleet.push");
    const targets = servers.filter((s) => s.status === "online");
    let slowest = 300;
    for (const s of targets) {
      patch(s.id, () => ({ status: "receiving" }));
      // Each agent its own pace, varied per server and per push, but reproducible.
      const delay = 400 + ((s.id * 7 + rev * 13) % 11) * 110;
      slowest = Math.max(slowest, delay);
      later(delay, () => {
        if (!alive(s.id)) return;
        patch(s.id, (x) => (x.status === "receiving" ? { status: "online", rev } : null));
        log(s.name, `${labels.log.applied} (${labels.config}${rev})`);
      });
    }
    later(slowest + 50, () => setPushing(false));
  }

  function releaseApi() {
    const next = apiRelease + 1;
    setApiRelease(next);
    log(labels.api, `${labels.log.api} (${commits[next % commits.length]})`);
  }

  /** Running the install command again updates the agent to the API's build. */
  function rerun(s: Server) {
    const commit = apiCommit;
    patch(s.id, () => ({ status: "updating" }));
    later(1200, () => {
      if (!alive(s.id)) return;
      patch(s.id, (x) => (x.status === "updating" ? { status: "online", commit } : null));
      log(s.name, `${labels.log.updated} (${commit})`);
    });
    track("fleet.update");
  }

  function remove(s: Server) {
    setServers((ss) => ss.filter((x) => x.id !== s.id));
    log(s.name, labels.log.removed);
  }

  function statusText(s: Server) {
    if (s.status === "installing") return labels.phases[Math.min(s.phase, labels.phases.length - 1)];
    return {
      online: labels.online,
      down: labels.down,
      restarting: labels.restarting,
      receiving: labels.receiving,
      updating: labels.updating,
    }[s.status];
  }

  return (
    <div>
      {/* The API: the one place orders come from. */}
      <div className="rounded-lg border border-primary/50 bg-primary-soft p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">{labels.api}</p>
            <p className="mt-0.5 text-[15px] text-muted-foreground tabular-nums">
              {labels.version} <span className="font-mono text-[13px] text-foreground">{apiCommit}</span>, {labels.config}
              {revision}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={push} disabled={pushing || !servers.some((s) => s.status === "online")}>
              {pushing ? (
                <LoaderCircleIcon aria-hidden className="animate-spin motion-reduce:animate-none" />
              ) : (
                <SendIcon aria-hidden />
              )}
              {pushing ? labels.pushing : labels.push}
            </Button>
            <Button size="lg" variant="outline" onClick={releaseApi}>
              <RefreshCwIcon aria-hidden />
              {labels.updateApi}
            </Button>
          </div>
        </div>
        <p className="mt-3 text-[15px] text-muted-foreground">{labels.parallel}</p>
      </div>

      {/* The fleet, hanging from the API. */}
      <div aria-hidden className="ml-8 h-5 w-px bg-primary/50" />
      {servers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-[15px] text-muted-foreground">
          {labels.empty}
        </p>
      ) : (
        <ul aria-label={labels.fleetLabel} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {servers.map((s) => {
            const outdated = s.status !== "installing" && s.commit !== apiCommit;
            const behind = s.status === "online" && s.rev < revision;
            return (
              <li key={s.id} className="flex flex-col rounded-lg border border-border bg-background/60 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-caption text-muted-foreground">
                      {distroName[s.distro]}, {s.arch}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`${labels.remove} ${s.name}`}
                    onClick={() => remove(s)}
                    className="-mt-1 -mr-1 text-muted-foreground"
                  >
                    <XIcon />
                  </Button>
                </div>

                <p className="mt-3 flex items-center gap-2 text-[15px]">
                  {busy.includes(s.status) ? (
                    <LoaderCircleIcon aria-hidden className="size-3.5 shrink-0 animate-spin text-signal motion-reduce:animate-none" />
                  ) : (
                    <StatusDot status={s.status} />
                  )}
                  <span className={s.status === "down" ? "font-medium text-destructive" : ""}>{statusText(s)}</span>
                </p>

                {s.status === "installing" ? (
                  <ol className="mt-2 space-y-1 text-caption">
                    {labels.phases.map((p, i) => (
                      <li key={p} className={`flex items-center gap-2 ${i < s.phase ? "" : "text-muted-foreground"}`}>
                        {i < s.phase ? (
                          <CheckIcon aria-hidden className="size-3.5 text-primary" />
                        ) : (
                          <span aria-hidden className="size-3.5 rounded-full border border-border" />
                        )}
                        {p}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <dl className="mt-2 space-y-0.5 text-caption">
                    <div className="flex gap-1.5">
                      <dt className="text-muted-foreground">{labels.config}</dt>
                      <dd className={`tabular-nums ${behind ? "font-medium" : ""}`}>
                        {s.rev}
                        {behind ? `, ${labels.behind}` : ""}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-muted-foreground">{labels.version}</dt>
                      <dd className="font-mono">{s.commit}</dd>
                    </div>
                  </dl>
                )}

                {outdated ? (
                  <p className="mt-2 flex items-center gap-1.5 text-caption font-medium">
                    <TriangleAlertIcon aria-hidden className="size-3.5 text-signal" />
                    {labels.outdated}
                  </p>
                ) : null}

                {s.status === "online" ? (
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {outdated ? (
                      <Button size="sm" variant="outline" onClick={() => rerun(s)}>
                        <RefreshCwIcon aria-hidden />
                        {labels.rerun}
                      </Button>
                    ) : null}
                    <Button size="sm" variant="outline" onClick={() => crash(s)}>
                      <ZapIcon aria-hidden />
                      {labels.crash}
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {/* Same flow as the back office: name the server, pick the system, create it. */}
      <div className="mt-6 rounded-lg border border-border p-4 sm:p-5">
        <h4 className="font-medium">{labels.addTitle}</h4>
        <form
          className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            addServer();
          }}
        >
          <div className="w-40">
            <label htmlFor="fleet-name" className={fieldLabel}>
              {labels.serverName}
            </label>
            <input
              id="fleet-name"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 16))}
              aria-invalid={taken}
              aria-describedby={taken ? "fleet-name-error" : undefined}
              spellCheck={false}
              autoComplete="off"
              className={inputClass}
            />
          </div>
          <Segmented<Distro>
            label="Distribution"
            value={distro}
            onChange={setDistro}
            options={[
              { value: "deb", label: distroName.deb },
              { value: "rpm", label: distroName.rpm },
            ]}
          />
          <Segmented<Arch>
            label="Architecture"
            value={arch}
            onChange={setArch}
            options={[
              { value: "amd64", label: "amd64" },
              { value: "arm64", label: "arm64" },
            ]}
          />
          <Button type="submit" size="xl" disabled={!trimmed || taken || full}>
            <PlusIcon aria-hidden />
            {labels.create}
          </Button>
        </form>
        {taken ? (
          <p id="fleet-name-error" className="mt-2 text-[15px] text-destructive">
            {labels.nameTaken}
          </p>
        ) : full ? (
          <p className="mt-2 text-[15px] text-muted-foreground">{labels.max}</p>
        ) : null}
      </div>

      {entries.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-[15px] text-muted-foreground">{labels.journal}</h4>
          <ol className="mt-2 divide-y divide-border border-y border-border text-[15px]">
            {entries.map((e, i) => (
              <li key={e.id} className={`flex flex-wrap gap-x-2 py-2 ${i === 0 ? "" : "text-muted-foreground"}`}>
                <span className="font-medium">{e.who}</span>
                <span>{e.what}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <p className="sr-only" role="status">
        {entries[0] ? `${entries[0].who}, ${entries[0].what}` : ""}
      </p>
    </div>
  );
}
