import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRightIcon,
  BinaryIcon,
  ContainerIcon,
  ChevronDownIcon,
  NetworkIcon,
  PackageCheckIcon,
  ServerCogIcon,
  type LucideIcon,
} from "lucide-react";
import type { LabDemo, LabDemoKind } from "@/data/lab-demos";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { textLink } from "@/components/primitives";
import { AgentFleetDemo } from "./agent-fleet";
import { AgentInstallDemo } from "./agent-install";
import { PackagingDemo } from "./packaging-compare";
import { GrpcCallsDemo } from "./grpc-calls";
import { DemoGuide } from "./guide";
import { IpAllocatorDemo } from "./ip-allocator";
import { ProtoSizeDemo } from "./proto-size";

/** One plain icon per demo, used on the Lab index and in links to a demo. */
export const demoIcon: Record<LabDemoKind, LucideIcon> = {
  packaging: ContainerIcon,
  fleet: ServerCogIcon,
  install: PackageCheckIcon,
  ipam: NetworkIcon,
  grpc: ArrowLeftRightIcon,
  proto: BinaryIcon,
};

/** The event each "À essayer" item waits for, in the order of `tries` in lib/lab-demo-strings.ts. */
const guideEvents: Record<LabDemoKind, string[]> = {
  packaging: ["pack.before", "pack.after", "pack.compare"],
  fleet: ["fleet.add", "fleet.crash", "fleet.push", "fleet.update"],
  install: ["install.success", "install.fail", "install.variant"],
  ipam: ["ipam.add", "ipam.reuse", "ipam.network"],
  proto: ["proto.edit", "proto.bytes", "proto.pin"],
  grpc: ["grpc.unary", "grpc.stream", "grpc.all"],
};

export const demoPath = (lang: Locale, demo: LabDemo) => localePath(lang, `/lab/${demo.lab}/${demo.id}`);

function Widget({ demo, t }: { demo: LabDemo; t: Dictionary }) {
  const d = t.labDemos;
  // Shared actions every demo may use.
  const common = { copy: d.copy, copied: d.copied, reset: d.reset };
  switch (demo.kind) {
    case "packaging":
      return <PackagingDemo labels={{ ...d.packaging, ...common }} />;
    case "fleet":
      return <AgentFleetDemo labels={{ ...d.fleet, ...common }} />;
    case "install":
      return <AgentInstallDemo labels={{ ...d.install, ...common }} />;
    case "ipam":
      return <IpAllocatorDemo labels={{ ...d.ipam, ...common }} />;
    case "proto":
      return <ProtoSizeDemo labels={{ ...d.proto, ...common }} />;
    case "grpc":
      return <GrpcCallsDemo labels={{ ...d.grpc, ...common }} />;
  }
}

/** The words a recruiter may not know, closed by default so the demo stays close. */
function Terms({ demo, t }: { demo: LabDemo; t: Dictionary }) {
  return (
    <details className="group self-start rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
        {t.labDemos.termsTitle}
        <ChevronDownIcon
          aria-hidden
          className="size-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <dl className="space-y-3 px-4 pb-4 text-[15px]">
        {t.labDemos[demo.kind].terms.map((term) => (
          <div key={term.term}>
            <dt className="font-medium">{term.term}</dt>
            <dd className="mt-0.5 leading-relaxed text-pretty text-muted-foreground">{term.def}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

/** "Pourquoi cette démo": a margin note in the first person, with my portrait. */
export function DemoWhy({ demo, t }: { demo: LabDemo; t: Dictionary }) {
  return (
    <figure className="flex max-w-[62ch] gap-4">
      <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-border dark:brightness-[0.86]">
        <Image src={profile.photo.src} alt="" fill sizes="44px" className="object-cover object-top" />
      </div>
      <figcaption className="leading-relaxed text-pretty">
        <span className="block text-[15px] text-muted-foreground">{t.labDemos.whyLabel}</span>
        {t.labDemos[demo.kind].why}
      </figcaption>
    </figure>
  );
}

/** "À essayer" and the glossary side by side, then the experiment in its frame. */
export function DemoPlayground({ demo, t }: { demo: LabDemo; t: Dictionary }) {
  const d = t.labDemos;
  return (
    <DemoGuide
      title={d.guideTitle}
      of={d.of}
      doneLabel={d.doneLabel}
      items={d[demo.kind].tries}
      events={guideEvents[demo.kind]}
      aside={<Terms demo={demo} t={t} />}
    >
      <div className="mt-8 min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
        <Widget demo={demo} t={t} />
      </div>
    </DemoGuide>
  );
}

/** A demo as a link card: icon, title, the plain question, technologies. */
export function DemoCard({ demo, lang, t, compact = false }: { demo: LabDemo; lang: Locale; t: Dictionary; compact?: boolean }) {
  const s = t.labDemos[demo.kind];
  const Icon = demoIcon[demo.kind];
  return (
    <Link
      href={demoPath(lang, demo)}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60"
    >
      <span aria-hidden className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <span
        className={`mt-4 block font-display font-semibold tracking-tight text-balance transition-colors group-hover:text-primary ${
          compact ? "text-lg" : "text-xl"
        }`}
      >
        {s.title}
      </span>
      <span className="mt-1.5 block leading-snug text-pretty text-muted-foreground">{s.question}</span>
      {compact ? null : <span className="mt-3 block text-caption text-muted-foreground">{s.tags}</span>}
      <span className={`mt-auto block pt-5 text-[15px] ${textLink}`}>{t.labDemos.openDemo}</span>
    </Link>
  );
}
