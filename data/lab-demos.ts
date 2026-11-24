/**
 * Lab demos: interactive experiments that run in the browser, each tied to the note it comes from.
 * Copy lives in lib/lab-demo-strings.ts; widgets in components/lab-demos/.
 * A demo only illustrates what its note states, and says what it simulates.
 */
export type LabDemoKind = "packaging" | "fleet" | "install" | "ipam" | "proto" | "grpc";

export type LabDemo = {
  /** Page slug under its lab, /lab/<lab>/<id>, the same in every language. */
  id: string;
  kind: LabDemoKind;
  /** The lab the demo belongs to (data/lab.ts). */
  lab: string;
  /** The note it illustrates. */
  noteSlug: string;
};

export const labDemos: LabDemo[] = [
  { id: "docker-vers-paquet", kind: "packaging", lab: "plateforme-vpn", noteSlug: "agent-vpn-paquet-linux" },
  { id: "flotte-agents", kind: "fleet", lab: "plateforme-vpn", noteSlug: "agent-vpn-paquet-linux" },
  { id: "installation-agent", kind: "install", lab: "plateforme-vpn", noteSlug: "agent-vpn-paquet-linux" },
  { id: "attribution-ip", kind: "ipam", lab: "plateforme-vpn", noteSlug: "agent-vpn-paquet-linux" },
  { id: "appels-grpc", kind: "grpc", lab: "plateforme-vpn", noteSlug: "go-grpc-plateforme-vpn" },
  { id: "json-protobuf", kind: "proto", lab: "plateforme-vpn", noteSlug: "go-grpc-plateforme-vpn" },
];

export const getLabDemo = (id: string) => labDemos.find((d) => d.id === id);

export const getLabDemosForLab = (labSlug: string) => labDemos.filter((d) => d.lab === labSlug);

export const getLabDemosForNote = (noteSlug: string) => labDemos.filter((d) => d.noteSlug === noteSlug);
