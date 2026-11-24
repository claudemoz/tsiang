"use client";

import { useState } from "react";
import { RefreshCwIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabDemoStrings } from "@/lib/lab-demo-strings";
import {
  base64ToBytes,
  byteLength,
  hex,
  lengthDelimited,
  segmentsLength,
  stringField,
  varintField,
  type Segment,
} from "@/lib/lab/protobuf";
import { CodeBlock, fieldLabel, inputClass, type CopyLabels } from "./controls";
import { useTrack } from "./guide";

type Labels = LabDemoStrings["proto"] & CopyLabels & { reset: string };

const schema = (asBytes: boolean) => `message PeerConfig {
  ${asBytes ? "bytes " : "string"} public_key           = 1;
  repeated string allowed_ips = 2;
  string endpoint             = 3;
  uint32 keepalive            = 4;
}`;

const partClass: Record<Segment["part"], string> = {
  tag: "font-semibold text-foreground",
  length: "text-muted-foreground",
  value: "text-foreground",
};

function randomKey() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b));
}

const initial = {
  publicKey: "yAnz5TF+lXXJte14tji3zlMNq+hd2rYUIgJBgB3fBmk=",
  allowed: "10.8.0.2/32, fd00:8::2/128",
  endpoint: "vpn.example.com:51820",
  keepalive: 25,
};

export function ProtoSizeDemo({ labels }: { labels: Labels }) {
  const [publicKey, setPublicKey] = useState(initial.publicKey);
  const [allowed, setAllowed] = useState(initial.allowed);
  const [endpoint, setEndpoint] = useState(initial.endpoint);
  const [keepalive, setKeepalive] = useState(initial.keepalive);
  const [asBytes, setAsBytes] = useState(false);
  /** A field under the pointer wins over the one picked by tap or keyboard (pinned until picked again). */
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;
  const track = useTrack();
  const toggle = (field: string) => {
    track("proto.pin");
    setPinned((p) => (p === field ? null : field));
  };
  const copyLabels = { copy: labels.copy, copied: labels.copied };
  const edited =
    publicKey !== initial.publicKey ||
    allowed !== initial.allowed ||
    endpoint !== initial.endpoint ||
    keepalive !== initial.keepalive ||
    asBytes;

  function resetValues() {
    setPublicKey(initial.publicKey);
    setAllowed(initial.allowed);
    setEndpoint(initial.endpoint);
    setKeepalive(initial.keepalive);
    setAsBytes(false);
    setPinned(null);
  }

  const ips = allowed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const keyBytes = asBytes ? base64ToBytes(publicKey) : null;
  const badKey = asBytes && publicKey.trim() !== "" && keyBytes === null;

  const segments: Segment[] = [
    ...(keyBytes && keyBytes.length > 0
      ? lengthDelimited("public_key", 1, keyBytes)
      : stringField("public_key", 1, publicKey.trim())),
    ...ips.flatMap((ip) => stringField("allowed_ips", 2, ip)),
    ...stringField("endpoint", 3, endpoint.trim()),
    ...varintField("keepalive", 4, keepalive),
  ];

  // proto3 JSON mapping: lowerCamelCase names, default values left out.
  const jsonObject: Record<string, unknown> = {};
  if (publicKey.trim()) jsonObject.publicKey = publicKey.trim();
  if (ips.length) jsonObject.allowedIps = ips;
  if (endpoint.trim()) jsonObject.endpoint = endpoint.trim();
  if (keepalive) jsonObject.keepalive = keepalive;
  const json = JSON.stringify(jsonObject);

  const jsonSize = byteLength(json);
  const protoSize = segmentsLength(segments);
  const saved = jsonSize > 0 ? Math.round((1 - protoSize / jsonSize) * 100) : 0;

  const fields = ["public_key", "allowed_ips", "endpoint", "keepalive"].map((f) => {
    const segs = segments.filter((s) => s.field === f);
    const sum = (part: Segment["part"]) => segs.filter((s) => s.part === part).reduce((n, s) => n + s.bytes.length, 0);
    return { name: f, tag: sum("tag"), length: sum("length"), value: sum("value"), total: segmentsLength(segs) };
  });

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="proto-key" className={fieldLabel}>
            {labels.publicKey}
          </label>
          <div className="flex gap-2">
            <input
              id="proto-key"
              value={publicKey}
              onChange={(e) => {
                setPublicKey(e.target.value);
                track("proto.edit");
              }}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={badKey}
              aria-describedby={badKey ? "proto-key-error" : undefined}
              className={`${inputClass} font-mono text-[13px]`}
            />
            <Button variant="outline" size="lg" className="mt-2 h-10" onClick={() => {
                setPublicKey(randomKey());
                track("proto.edit");
              }}>
              <RefreshCwIcon aria-hidden />
              {labels.newKey}
            </Button>
          </div>
          {badKey ? (
            <p id="proto-key-error" className="mt-1.5 text-[15px] text-destructive">
              {labels.badKey}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="proto-ips" className={fieldLabel}>
            {labels.allowedIps}
          </label>
          <input
            id="proto-ips"
            value={allowed}
            onChange={(e) => {
                setAllowed(e.target.value);
                track("proto.edit");
              }}
            spellCheck={false}
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="proto-endpoint" className={fieldLabel}>
            {labels.endpoint}
          </label>
          <input
            id="proto-endpoint"
            value={endpoint}
            onChange={(e) => {
                setEndpoint(e.target.value);
                track("proto.edit");
              }}
            spellCheck={false}
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="proto-keepalive" className={fieldLabel}>
            {labels.keepalive}
          </label>
          <input
            id="proto-keepalive"
            type="number"
            min={0}
            max={65535}
            value={keepalive}
            onChange={(e) => {
              setKeepalive(Math.max(0, Math.min(65535, Math.trunc(Number(e.target.value) || 0))));
              track("proto.edit");
            }}
            className={`${inputClass} tabular-nums`}
          />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-[15px]">
        <input
          type="checkbox"
          checked={asBytes}
          onChange={(e) => {
            setAsBytes(e.target.checked);
            if (e.target.checked) track("proto.bytes");
          }}
          className="mt-1 size-4 accent-primary"
        />
        <span>
          {labels.asBytes}
          <span className="block text-muted-foreground">{labels.asBytesHint}</span>
        </span>
      </label>
      {edited ? (
        <Button variant="outline" size="lg" className="mt-4" onClick={resetValues}>
          <RotateCcwIcon aria-hidden />
          {labels.reset}
        </Button>
      ) : null}

      <h4 className="mt-6 text-[15px] text-muted-foreground">{labels.schema}</h4>
      <CodeBlock className="mt-2" copy={{ text: schema(asBytes), labels: copyLabels }}>
        {schema(asBytes)}
      </CodeBlock>

      <div className="mt-6" aria-live="polite">
        <p className="font-display text-2xl font-semibold tracking-tight tabular-nums">
          {labels.protobuf} {protoSize} {labels.bytes}, {labels.json} {jsonSize} {labels.bytes}
        </p>
        {saved > 0 ? (
          <p className="mt-1 text-[15px] text-muted-foreground tabular-nums">
            {saved}
            {labels.percent} {labels.smaller}
          </p>
        ) : null}
      </div>
      {/* Two bars on the same scale: the difference reads at a glance. */}
      <div className="mt-4 space-y-2" aria-hidden>
        {[
          { label: labels.json, size: jsonSize, className: "bg-muted-foreground/40" },
          { label: labels.protobuf, size: protoSize, className: "bg-primary" },
        ].map((bar) => (
          <div key={bar.label} className="grid grid-cols-[5rem_1fr] items-center gap-3 text-[15px]">
            <span className="text-muted-foreground">{bar.label}</span>
            <span className="h-2.5 rounded-sm bg-muted">
              <span
                className={`block h-full rounded-sm ${bar.className}`}
                style={{ width: `${Math.max(jsonSize, protoSize) ? (bar.size / Math.max(jsonSize, protoSize)) * 100 : 0}%` }}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <h4 className="text-[15px] text-muted-foreground">
            {labels.json}, {jsonSize} {labels.bytes}
          </h4>
          <CodeBlock className="mt-2" preClassName="break-all whitespace-pre-wrap" copy={{ text: json, labels: copyLabels }}>
            {json}
          </CodeBlock>
        </div>
        <div className="min-w-0">
          <h4 className="text-[15px] text-muted-foreground">
            {labels.protobuf}, {protoSize} {labels.bytes}
          </h4>
          <CodeBlock
            className="mt-2"
            preClassName="whitespace-pre-wrap"
            label={labels.breakdown}
            copy={{ text: segments.flatMap((seg) => seg.bytes).map(hex).join(" "), labels: copyLabels }}
          >
            {segments.map((seg, i) => (
              <span
                key={i}
                title={seg.field}
                onMouseEnter={() => setHovered(seg.field)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggle(seg.field)}
                className={`${partClass[seg.part]} cursor-pointer rounded-sm ${active === seg.field ? "bg-primary-soft" : ""}`}
              >
                {seg.bytes.map(hex).join(" ")}{" "}
              </span>
            ))}
          </CodeBlock>
        </div>
      </div>

      <h4 className="mt-6 text-[15px] text-muted-foreground">{labels.breakdown}</h4>
      <p className="mt-1 text-[15px] text-muted-foreground">{labels.hover}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[26rem] text-left text-[15px] tabular-nums">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-normal">{labels.field}</th>
              <th scope="col" className="py-2 pr-4 font-normal">{labels.tag}</th>
              <th scope="col" className="py-2 pr-4 font-normal">{labels.length}</th>
              <th scope="col" className="py-2 pr-4 font-normal">{labels.value}</th>
              <th scope="col" className="py-2 font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr
                key={f.name}
                tabIndex={0}
                aria-selected={pinned === f.name}
                onMouseEnter={() => setHovered(f.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggle(f.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(f.name);
                  }
                }}
                className={`cursor-pointer border-b border-border focus-visible:outline-offset-[-2px] ${
                  active === f.name ? "bg-primary-soft" : ""
                } ${pinned === f.name ? "font-medium" : ""}`}
              >
                <th scope="row" className="py-2 pr-4 font-mono text-[13px] font-normal">{f.name}</th>
                <td className="py-2 pr-4">{f.tag}</td>
                <td className="py-2 pr-4">{f.length}</td>
                <td className="py-2 pr-4">{f.value}</td>
                <td className="py-2 font-medium">{f.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
