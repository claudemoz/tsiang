"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ListChecksIcon, RotateCcwIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabDemoStrings } from "@/lib/lab-demo-strings";
import { CopyButton, Segmented, type CopyLabels } from "./controls";
import { useTrack } from "./guide";

type Kind = "unary" | "client" | "server" | "bidi";
type Labels = LabDemoStrings["grpc"] & CopyLabels & { reset: string };
/** `end`: the sender closes its side of the stream. */
type Message = { from: "api" | "agent"; text: string } | { from: "api" | "agent"; end: true };

const contract = [
  'syntax = "proto3";',
  "",
  "service Agent {",
  "  rpc Enroll(EnrollRequest) returns (EnrollReply);",
  "  rpc PushPeers(stream Peer) returns (PushReply);",
  "  rpc Apply(ApplyRequest) returns (stream ApplyProgress);",
  "  rpc Sync(stream SyncCommand) returns (stream SyncEvent);",
  "}",
];
const contractLine: Record<Kind, number> = { unary: 3, client: 4, server: 5, bidi: 6 };

const calls: Record<Kind, Message[]> = {
  unary: [
    { from: "api", text: 'EnrollRequest { server_id: "vpn-1" }' },
    { from: "agent", text: "EnrollReply { public_key: <32 bytes> }" },
  ],
  client: [
    { from: "api", text: 'Peer { allowed_ips: "10.8.0.2/32" }' },
    { from: "api", text: 'Peer { allowed_ips: "10.8.0.3/32" }' },
    { from: "api", text: 'Peer { allowed_ips: "10.8.0.4/32" }' },
    { from: "api", end: true },
    { from: "agent", text: "PushReply { applied: 3 }" },
  ],
  server: [
    { from: "api", text: "ApplyRequest { revision: 42 }" },
    { from: "agent", text: 'ApplyProgress { step: "wg0", done: 1, total: 3 }' },
    { from: "agent", text: 'ApplyProgress { step: "peers", done: 2, total: 3 }' },
    { from: "agent", text: 'ApplyProgress { step: "iptables", done: 3, total: 3 }' },
    { from: "agent", end: true },
  ],
  bidi: [
    { from: "api", text: 'SyncCommand { add_peer: "10.8.0.5/32" }' },
    { from: "agent", text: 'SyncEvent { applied: "10.8.0.5/32" }' },
    { from: "api", text: 'SyncCommand { remove_peer: "10.8.0.3/32" }' },
    { from: "agent", text: 'SyncEvent { removed: "10.8.0.3/32" }' },
    { from: "api", end: true },
    { from: "agent", end: true },
  ],
};

export function GrpcCallsDemo({ labels }: { labels: Labels }) {
  const [kind, setKind] = useState<Kind>("unary");
  const [shown, setShown] = useState(0);
  const [tried, setTried] = useState<Kind[]>(["unary"]);
  const messages = calls[kind];
  const finished = shown >= messages.length;
  const track = useTrack();

  function show(count: number) {
    setShown(count);
    if (count >= messages.length) track(kind === "unary" ? "grpc.unary" : "grpc.stream");
  }

  return (
    <div>
      <Segmented<Kind>
        label={labels.kindLabel}
        value={kind}
        onChange={(k) => {
          setKind(k);
          setShown(0);
          const next = tried.includes(k) ? tried : [...tried, k];
          setTried(next);
          if (next.length === 4) track("grpc.all");
        }}
        options={(["unary", "client", "server", "bidi"] as const).map((k) => ({ value: k, label: labels.kinds[k] }))}
      />
      <p className="mt-4 max-w-[60ch] leading-relaxed text-pretty">
        {labels.explain[kind]} {kind === "unary" ? null : <span className="text-muted-foreground">{labels.streamNote}</span>}
      </p>

      <div className="mt-6 flex items-end justify-between gap-3">
        <h4 className="text-[15px] text-muted-foreground">{labels.contract}</h4>
        <CopyButton text={contract.join("\n")} labels={{ copy: labels.copy, copied: labels.copied }} />
      </div>
      <pre
        tabIndex={0}
        className="mt-2 max-w-full overflow-x-auto rounded-lg border border-border bg-muted/60 py-4 font-mono text-[13px] leading-relaxed"
      >
        <code>
          {contract.map((line, i) => (
            <span
              key={i}
              className={`block px-4 ${i === contractLine[kind] ? "bg-primary-soft font-semibold" : ""}`}
            >
              {line || " "}
            </span>
          ))}
        </code>
      </pre>

      <div className="mt-6 grid grid-cols-2 border-b border-border pb-2 text-[15px] font-medium">
        <span>{labels.api}</span>
        <span className="text-right">{labels.agent}</span>
      </div>
      <ol aria-label={labels.sequenceLabel} aria-live="polite" className="min-h-24 space-y-2.5 py-4">
        {shown === 0 ? <li className="text-[15px] text-muted-foreground">{labels.empty}</li> : null}
        {messages.slice(0, shown).map((m, i) => {
          const fromApi = m.from === "api";
          const sender = fromApi ? labels.api : labels.agent;
          return (
            <li key={i} className={`flex items-center gap-2 ${fromApi ? "justify-start" : "justify-end"}`}>
              <span className="sr-only">{sender}, </span>
              {!fromApi ? <ArrowLeftIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" /> : null}
              {"end" in m ? (
                <span className="text-[15px] text-muted-foreground">{labels.endOfStream}</span>
              ) : (
                <span className="min-w-0 max-w-[85%] rounded-lg border border-border bg-card px-3 py-2 font-mono text-[13px] break-words">
                  {m.text}
                </span>
              )}
              {fromApi ? <ArrowRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" /> : null}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button size="lg" onClick={() => show(shown + 1)} disabled={finished}>
          <SendIcon aria-hidden />
          {labels.next}
        </Button>
        {!finished ? (
          <Button size="lg" variant="outline" onClick={() => show(messages.length)}>
            <ListChecksIcon aria-hidden />
            {labels.sendAll}
          </Button>
        ) : null}
        {shown > 0 ? (
          <Button size="lg" variant="outline" onClick={() => setShown(0)}>
            <RotateCcwIcon aria-hidden />
            {labels.reset}
          </Button>
        ) : null}
        <p className="text-[15px] text-muted-foreground tabular-nums sm:ml-auto" role="status">
          {finished ? <span className="font-medium text-foreground">{labels.done}</span> : null}{" "}
          {shown} {labels.of} {messages.length}
        </p>
      </div>
    </div>
  );
}
