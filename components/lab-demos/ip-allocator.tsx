"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabDemoStrings } from "@/lib/lab-demo-strings";
import {
  fakeKey,
  ipv4MaxOffset,
  ipv4ToString,
  ipv6ToString,
  nextFreeOffset,
  parseIPv4Cidr,
  parseIPv6Cidr,
  type V4Net,
  type V6Net,
} from "@/lib/lab/ipam";
import { CodeBlock, fieldLabel, inputClass, type CopyLabels } from "./controls";
import { useTrack } from "./guide";

type Peer = { id: number; offset: number };
type Labels = LabDemoStrings["ipam"] & CopyLabels;

/** Three devices to start with, so removing the middle one shows its address being reused. */
const initialPeers: Peer[] = [
  { id: 1, offset: 2 },
  { id: 2, offset: 3 },
  { id: 3, offset: 4 },
];

/**
 * A network field that keeps the last valid value while the visitor types: the list and the config
 * do not vanish on every keystroke, and the error only shows once the field is left invalid.
 */
function NetworkField<T>({
  id,
  label,
  error,
  initial,
  parse,
  onValid,
}: {
  id: string;
  label: string;
  error: string;
  initial: string;
  parse: (s: string) => T | null;
  onValid: (net: T) => void;
}) {
  const [text, setText] = useState(initial);
  const [showError, setShowError] = useState(false);
  const invalid = parse(text) === null;
  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <input
        id={id}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const net = parse(e.target.value);
          if (net) {
            onValid(net);
            setShowError(false);
          }
        }}
        onBlur={() => setShowError(invalid)}
        aria-invalid={showError}
        aria-describedby={showError ? `${id}-error` : undefined}
        spellCheck={false}
        autoComplete="off"
        className={inputClass}
      />
      {showError ? (
        <p id={`${id}-error`} className="mt-1.5 text-[15px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const rowClass =
  "grid grid-cols-[minmax(0,1fr)_2rem] items-center gap-x-4 px-2 py-3 sm:grid-cols-[8rem_9rem_minmax(0,1fr)_2rem]";

export function IpAllocatorDemo({ labels }: { labels: Labels }) {
  const [v4, setV4] = useState<V4Net>(() => parseIPv4Cidr("10.8.0.0/24")!);
  const [v6, setV6] = useState<V6Net>(() => parseIPv6Cidr("fd00:8::/64")!);
  const [peers, setPeers] = useState<Peer[]>(initialPeers);
  const [nextId, setNextId] = useState(4);
  /** The device touched last (highlighted) and the sentence announced for it. */
  const [lastId, setLastId] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const track = useTrack();

  // Each device keeps the same host number in both families, capped by the smaller network.
  const max = Math.min(ipv4MaxOffset(v4), 2 ** Math.min(128 - v6.prefix, 30) - 1);
  const tooSmall = peers.some((p) => p.offset > max);
  const free = tooSmall ? null : nextFreeOffset(peers.map((p) => p.offset), max);

  const name = (id: number) => `${labels.peerPrefix}-${id}`;
  const addr4 = (offset: number) => ipv4ToString((v4.base + offset) >>> 0);
  const addr6 = (offset: number) => ipv6ToString(v6.base + BigInt(offset));
  const sorted = [...peers].sort((a, b) => a.offset - b.offset);
  const highest = peers.reduce((m, p) => Math.max(m, p.offset), 1);

  function add() {
    if (free === null) return;
    const reused = free < highest;
    track("ipam.add");
    if (reused) track("ipam.reuse");
    setPeers((ps) => [...ps, { id: nextId, offset: free }]);
    setLastId(nextId);
    setAnnounce(
      `${name(nextId)} ${labels.gets} ${addr4(free)}, ${addr6(free)}${reused ? ` (${labels.reused})` : ""}`,
    );
    setNextId((n) => n + 1);
  }

  function remove(p: Peer) {
    setPeers((ps) => ps.filter((x) => x.id !== p.id));
    setLastId(null);
    setAnnounce(`${name(p.id)} ${labels.released} ${addr4(p.offset)}, ${addr6(p.offset)}`);
  }

  const config = tooSmall
    ? null
    : [
        "[Interface]",
        `Address = ${addr4(1)}/${v4.prefix}, ${addr6(1)}/${v6.prefix}`,
        "ListenPort = 51820",
        `PrivateKey = ${fakeKey(`${labels.serverKey}-private`)}`,
        ...sorted.flatMap((p) => [
          "",
          "[Peer]",
          `# ${name(p.id)}`,
          `PublicKey = ${fakeKey(`peer-${p.id}`)}`,
          `AllowedIPs = ${addr4(p.offset)}/32, ${addr6(p.offset)}/128`,
        ]),
      ].join("\n");

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NetworkField
          id="ipam-v4"
          label={labels.v4}
          error={labels.v4Error}
          initial="10.8.0.0/24"
          parse={parseIPv4Cidr}
          onValid={(net) => {
            setV4(net);
            track("ipam.network");
          }}
        />
        <NetworkField
          id="ipam-v6"
          label={labels.v6}
          error={labels.v6Error}
          initial="fd00:8::/64"
          parse={parseIPv6Cidr}
          onValid={(net) => {
            setV6(net);
            track("ipam.network");
          }}
        />
      </div>

      <ul aria-label={labels.peersLabel} className="mt-6 divide-y divide-border border-y border-border text-[15px]">
        <li className={rowClass}>
          <span className="font-medium">{labels.server}</span>
          <span className="row-start-2 tabular-nums sm:row-start-auto">{addr4(1)}</span>
          <span className="row-start-3 break-all text-muted-foreground sm:row-start-auto">{addr6(1)}</span>
        </li>
        {sorted.map((p) => {
          const outside = p.offset > max;
          return (
            <li key={p.id} className={`${rowClass} ${p.id === lastId ? "bg-primary-soft" : ""}`}>
              <span>{name(p.id)}</span>
              <span className={`row-start-2 tabular-nums sm:row-start-auto ${outside ? "text-destructive" : ""}`}>
                {outside ? "" : addr4(p.offset)}
              </span>
              <span className="row-start-3 break-all text-muted-foreground sm:row-start-auto">
                {outside ? "" : addr6(p.offset)}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`${labels.remove} ${name(p.id)}`}
                onClick={() => remove(p)}
                className="col-start-2 row-start-1 justify-self-end text-muted-foreground sm:col-start-4"
              >
                <XIcon />
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button size="lg" variant="outline" onClick={add} disabled={free === null}>
          <PlusIcon aria-hidden />
          {labels.add}
        </Button>
        <p className="text-[15px] text-muted-foreground tabular-nums">
          {tooSmall ? (
            <span className="text-destructive">{labels.tooSmall}</span>
          ) : free === null ? (
            labels.full
          ) : (
            `${peers.length + 1} ${labels.used} ${max}`
          )}
        </p>
      </div>
      <p className="sr-only" role="status">
        {announce}
      </p>

      {config ? (
        <>
          <h4 className="mt-6 text-[15px] text-muted-foreground">{labels.config}</h4>
          <CodeBlock
            label={labels.config}
            className="mt-2"
            copy={{ text: config, labels: { copy: labels.copy, copied: labels.copied } }}
          >
            {config}
          </CodeBlock>
        </>
      ) : null}
    </div>
  );
}
