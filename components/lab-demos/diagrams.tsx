import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, CircleXIcon, FileTextIcon, LaptopIcon, SmartphoneIcon } from "lucide-react";
import type { LabDemoKind } from "@/data/lab-demos";
import type { LabDemoStrings } from "@/lib/lab-demo-strings";

/**
 * One explained diagram per demo. Static (server components, no JavaScript): the diagram says how
 * the thing works, the demo underneath lets the visitor try it. Every label sits in the drawing
 * itself, and "Comment le lire" explains each part in a sentence.
 */

const panel = "rounded-xl bg-primary-soft p-4 sm:p-8";
const node = "rounded-lg border border-border bg-card px-3 py-2.5 text-center";
const nodeTitle = "block text-[15px] font-medium leading-snug";
const nodeDetail = "mt-0.5 block text-caption text-muted-foreground leading-snug";
const vline = "mx-auto w-px bg-primary/60";

function Down({ className = "" }: { className?: string }) {
  return <ArrowDownIcon aria-hidden className={`mx-auto my-1.5 size-5 text-primary ${className}`} />;
}

/* Packaging: the same agent on a VPN server, in Docker (left) and as a Linux package (right). */
function PackagingDiagram({ d }: { d: LabDemoStrings["packaging"]["diagram"]["d"] }) {
  const agent = (
    <div className="rounded-md border-2 border-primary bg-card px-3 py-2 text-center">
      <span className={nodeTitle}>{d.agent}</span>
      <span className={nodeDetail}>{d.agentDetail}</span>
    </div>
  );
  const wireguard = <div className="rounded-md border border-border bg-card px-3 py-1.5 text-center text-[15px]">{d.wireguard}</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={panel}>
        <p className="font-display text-lg font-semibold tracking-tight">{d.before}</p>
        <div className="mt-4 rounded-xl border border-dashed border-primary/60 p-3">
          <p className="text-caption font-medium text-muted-foreground">{d.vps}</p>
          <div className="mt-2 rounded-lg border border-border bg-muted p-3">
            <p className="text-[15px] font-medium">
              {d.docker} <span className="font-normal text-muted-foreground">({d.dockerDetail})</span>
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-caption">
              <FileTextIcon aria-hidden className="size-3.5 text-muted-foreground" />
              {d.compose} ({d.composeDetail})
            </p>
            <div className="mt-2 rounded-lg border border-dashed border-foreground/30 bg-card/70 p-3">
              <p className="text-[15px] font-medium">{d.container}</p>
              <p className="text-caption text-muted-foreground">{d.containerDetail}</p>
              <div className="mt-2">{agent}</div>
              <Down className="my-1 size-4" />
              {wireguard}
            </div>
          </div>
        </div>
      </div>

      <div className={panel}>
        <p className="font-display text-lg font-semibold tracking-tight">{d.after}</p>
        <div className="mt-4 rounded-xl border border-dashed border-primary/60 p-3">
          <p className="text-caption font-medium text-muted-foreground">{d.vps}</p>
          <div className={`${node} mt-2`}>
            <span className={nodeTitle}>{d.manager}</span>
          </div>
          <Down className="my-1 size-4" />
          <div className="rounded-lg border-2 border-primary bg-card p-3">
            <p className="text-[15px] font-medium">{d.package}</p>
            <ul className="mt-1.5 space-y-0.5 text-caption">
              {d.contents.map((c) => (
                <li key={c} className="flex items-center gap-1.5">
                  <span aria-hidden className="size-1 rounded-full bg-primary" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-2 border-t border-border pt-2 text-caption">
              <span className="block text-muted-foreground">{d.deps}</span>
              {d.depsList}
            </p>
          </div>
          <Down className="my-1 size-4" />
          <p className="text-center text-caption text-muted-foreground">{d.systemd}</p>
          <div className="mt-1">{agent}</div>
          <Down className="my-1 size-4" />
          {wireguard}
        </div>
      </div>
    </div>
  );
}

/* Fleet: the back office, the API, then three VPN servers hanging from it. */
function FleetDiagram({ d }: { d: LabDemoStrings["fleet"]["diagram"]["d"] }) {
  return (
    <div className={panel}>
      <div className="mx-auto max-w-xs">
        <div className={node}>
          <span className={nodeTitle}>{d.backoffice}</span>
          <span className={nodeDetail}>
            {d.admin}, {d.backofficeDetail}
          </span>
        </div>
        <Down />
        <div className={`${node} border-2 border-primary`}>
          <span className={`${nodeTitle} font-display text-lg font-semibold`}>{d.api}</span>
          <span className={nodeDetail}>{d.apiDetail}</span>
        </div>
      </div>

      <div className={`${vline} h-4`} />
      <p className="mx-auto w-fit rounded-md bg-card px-2.5 py-1 text-center text-caption font-medium text-primary ring-1 ring-primary/40">
        {d.link}, {d.parallel}
      </p>
      <div className={`${vline} h-4`} />
      {/* The branch: one line across, one tick down to each server. */}
      <div className="mx-[16.6%] h-px bg-primary/60" />
      <ul className="grid grid-cols-3 gap-2 sm:gap-4">
        {[1, 2, 3].map((n) => (
          <li key={n}>
            <div className={`${vline} h-4`} />
            <div className="rounded-lg border border-border bg-card p-2 sm:p-3">
              <span className="block text-center text-caption text-muted-foreground">
                {d.server} {n}
              </span>
              <div className="mt-2 rounded-md border border-primary/60 bg-primary-soft px-2 py-1.5 text-center">
                <span className="block text-[15px] font-medium">{d.agent}</span>
                <span className="block text-caption text-muted-foreground">{d.systemd}</span>
              </div>
              <Down className="my-1 size-4" />
              <div className="rounded-md border border-border px-2 py-1.5 text-center text-[15px]">{d.wireguard}</div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-muted-foreground" aria-hidden>
              <SmartphoneIcon className="size-4" />
              <LaptopIcon className="size-4" />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-center text-caption text-muted-foreground">{d.devices}</p>
    </div>
  );
}

/* Install: the four steps on the VPS, the API serving the package, the stop on a bad checksum. */
function InstallDiagram({ d }: { d: LabDemoStrings["install"]["diagram"]["d"] }) {
  return (
    <div className={panel}>
      <div className={`${node} mx-auto max-w-xs`}>
        <span className={nodeTitle}>{d.backoffice}</span>
        <span className={nodeDetail}>{d.backofficeDetail}</span>
      </div>
      <Down />
      <div className="rounded-xl border border-dashed border-primary/60 p-3 sm:p-5">
        <p className="text-caption font-medium text-muted-foreground">{d.vps}</p>
        <ol className="mt-3">
          {d.steps.map((step, i) => (
            <li key={step}>
              <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,14rem)]">
                <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
                  <span
                    aria-hidden
                    className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-caption font-semibold text-primary tabular-nums"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className={nodeTitle}>{step}</span>
                    <span className={nodeDetail}>{d.details[i]}</span>
                  </span>
                </div>
                {i === 1 ? (
                  <>
                    <ArrowLeftIcon aria-hidden className="mx-auto hidden size-5 text-primary sm:block" />
                    <div className={`${node} border-primary/60`}>
                      <span className={nodeTitle}>{d.api}</span>
                      <span className={nodeDetail}>{d.apiDetail}</span>
                    </div>
                  </>
                ) : null}
              </div>
              {i === 1 ? (
                <p className="mt-2 ml-1 flex items-center gap-2 text-caption font-medium text-destructive">
                  <CircleXIcon aria-hidden className="size-4 shrink-0" />
                  {d.stop}
                </p>
              ) : null}
              {i < d.steps.length - 1 ? <Down className="my-1 ml-3 sm:ml-3" /> : null}
            </li>
          ))}
        </ol>
      </div>
      <Down />
      <div className={`${node} mx-auto max-w-xs border-2 border-primary`}>
        <span className={nodeTitle}>{d.enroll}</span>
      </div>
    </div>
  );
}

/* IP allocation: a /28 as a row of sixteen slots. */
function IpamDiagram({ d, peerPrefix }: { d: LabDemoStrings["ipam"]["diagram"]["d"]; peerPrefix: string }) {
  type Slot = { role: "reserved" | "server" | "device" | "freed" | "free"; label?: string };
  const slots: Slot[] = Array.from({ length: 16 }, (_, i): Slot => {
    if (i === 0) return { role: "reserved", label: d.network };
    if (i === 15) return { role: "reserved", label: d.broadcast };
    if (i === 1) return { role: "server", label: d.server };
    if (i === 3) return { role: "freed", label: d.freed };
    if (i === 2) return { role: "device", label: `${peerPrefix}-1` };
    if (i === 4) return { role: "device", label: `${peerPrefix}-3` };
    if (i === 5) return { role: "device", label: `${peerPrefix}-4` };
    return { role: "free" };
  });
  const style: Record<Slot["role"], string> = {
    reserved: "border-dashed border-border bg-muted text-muted-foreground",
    server: "border-primary bg-primary text-primary-foreground",
    device: "border-primary/60 bg-card",
    freed: "border-dashed border-primary bg-card ring-2 ring-signal",
    free: "border-border bg-card/60 text-muted-foreground",
  };
  return (
    <div className={panel}>
      <p className="font-mono text-[13px] font-medium">10.8.0.0/28</p>
      <ol className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {slots.map((slot, i) => (
          <li
            key={i}
            className={`flex min-h-18 flex-col justify-between gap-1 rounded-md border p-2 ${style[slot.role]}`}
          >
            <span className="font-mono text-[13px] font-medium">.{i}</span>
            {slot.label ? <span className="text-caption leading-tight">{slot.label}</span> : null}
          </li>
        ))}
      </ol>
      <p className="mt-4 flex items-center gap-2 text-caption">
        <span aria-hidden className="size-3 shrink-0 rounded-sm border border-dashed border-primary ring-2 ring-signal" />
        10.8.0.3 = {d.next}
      </p>
    </div>
  );
}

/* Protobuf: one field, both encodings, segments drawn to scale (one unit per byte). */
function ProtoDiagram({ d }: { d: LabDemoStrings["proto"]["diagram"]["d"] }) {
  type Seg = { text: string; label: string; bytes: number; className: string };
  const json: Seg[] = [
    { text: '"endpoint"', label: d.name, bytes: 10, className: "bg-muted text-muted-foreground" },
    { text: ': " "', label: d.syntax, bytes: 3, className: "bg-muted/60 text-muted-foreground" },
    { text: "vpn.example.com:51820", label: d.value, bytes: 21, className: "bg-card" },
  ];
  const proto: Seg[] = [
    { text: "1a", label: d.tag, bytes: 1, className: "bg-primary text-primary-foreground" },
    { text: "15", label: d.length, bytes: 1, className: "bg-card ring-1 ring-primary ring-inset" },
    { text: "vpn.example.com:51820", label: d.value, bytes: 21, className: "bg-card" },
  ];
  const row = (title: string, segs: Seg[]) => {
    const total = segs.reduce((n, s) => n + s.bytes, 0);
    return (
      <div>
        <p className="text-[15px] font-medium">
          {title}, {total} {d.bytes}
        </p>
        <div className="mt-2 flex gap-1" style={{ width: `${(total / 34) * 100}%`, minWidth: "min(100%, 18rem)" }}>
          {segs.map((s) => (
            <div key={s.label} className="min-w-16" style={{ flex: `${s.bytes} 0 0` }}>
              <div
                className={`rounded-md border border-border px-1.5 py-2 text-center font-mono text-[13px] break-all ${s.className}`}
                title={s.text}
              >
                {s.text}
              </div>
              <p className="mt-1.5 text-caption leading-tight">{s.label}</p>
              <p className="text-caption leading-tight text-muted-foreground tabular-nums">
                {s.bytes} {s.bytes === 1 ? d.byte : d.bytes}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className={`${panel} space-y-6`}>
      {row("JSON", json)}
      {row("Protobuf", proto)}
    </div>
  );
}

/* gRPC: four small sequence diagrams, API on the left, agent on the right, time going down. */
function GrpcDiagram({ d, kinds }: { d: LabDemoStrings["grpc"]["diagram"]["d"]; kinds: LabDemoStrings["grpc"]["kinds"] }) {
  type Step = "req" | "res" | "endApi" | "endAgent";
  const calls: { kind: keyof typeof kinds; steps: Step[] }[] = [
    { kind: "unary", steps: ["req", "res"] },
    { kind: "client", steps: ["req", "req", "req", "endApi", "res"] },
    { kind: "server", steps: ["req", "res", "res", "res", "endAgent"] },
    { kind: "bidi", steps: ["req", "res", "req", "res", "endApi", "endAgent"] },
  ];
  return (
    <div className={`${panel} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
      {calls.map((call) => (
        <div key={call.kind} className="rounded-lg border border-border bg-card p-3">
          <p className="text-[15px] font-medium">{kinds[call.kind]}</p>
          <div className="mt-2 flex justify-between text-caption text-muted-foreground">
            <span>{d.api}</span>
            <span>{d.agent}</span>
          </div>
          <ol className="mt-1 space-y-2 border-x-2 border-border px-1 py-2">
            {call.steps.map((step, i) => (
              <li key={i} className="flex h-4 items-center">
                {step === "req" ? (
                  <>
                    <span className="h-0.5 flex-1 bg-primary" />
                    <ArrowRightIcon aria-hidden className="-ml-1.5 size-4 text-primary" />
                  </>
                ) : step === "res" ? (
                  <>
                    <ArrowLeftIcon aria-hidden className="-mr-1.5 size-4 text-foreground" />
                    <span className="h-0.5 flex-1 bg-foreground/70" />
                  </>
                ) : (
                  <span
                    className={`flex-1 text-micro text-muted-foreground ${step === "endAgent" ? "text-right" : ""}`}
                  >
                    {d.end}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/** The diagram of a demo, its one-paragraph reading guide, and the legend underneath. */
export function DemoDiagram({
  kind,
  strings,
  readTitle,
}: {
  kind: LabDemoKind;
  strings: LabDemoStrings;
  readTitle: string;
}) {
  const diagram = strings[kind].diagram;
  let drawing: ReactNode;
  switch (kind) {
    case "packaging":
      drawing = <PackagingDiagram d={strings.packaging.diagram.d} />;
      break;
    case "fleet":
      drawing = <FleetDiagram d={strings.fleet.diagram.d} />;
      break;
    case "install":
      drawing = <InstallDiagram d={strings.install.diagram.d} />;
      break;
    case "ipam":
      drawing = <IpamDiagram d={strings.ipam.diagram.d} peerPrefix={strings.ipam.peerPrefix} />;
      break;
    case "proto":
      drawing = <ProtoDiagram d={strings.proto.diagram.d} />;
      break;
    case "grpc":
      drawing = <GrpcDiagram d={strings.grpc.diagram.d} kinds={strings.grpc.kinds} />;
      break;
  }
  return (
    <figure>
      <figcaption className="max-w-[62ch] text-lg leading-relaxed text-pretty">{diagram.intro}</figcaption>
      <div className="mt-6">{drawing}</div>
      <h3 className="mt-10 font-display text-xl font-semibold tracking-tight">{readTitle}</h3>
      <dl className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {diagram.legend.map((item) => (
          <div key={item.term} className="border-t border-border pt-4">
            <dt className="font-medium">{item.term}</dt>
            <dd className="mt-1 leading-relaxed text-pretty text-muted-foreground">{item.def}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
