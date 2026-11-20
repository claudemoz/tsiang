import type { Locale } from "@/lib/i18n";
import { labNotesEn } from "./en";

/**
 * Lab: technical notes on personal projects. Content comes from the owner's own write-ups
 * (LAB.md). Do not add dates, links or figures that are not in the source.
 */
export type LabNote = {
  slug: string;
  title: string;
  project: string;
  /** Matching page in Projets, when the project is listed there. */
  projectSlug?: string;
  /** What the whole platform does, shown before the note so the problem has its context. */
  platform?: string[];
  status: string;
  summary: string;
  stack: string[];
  context: string[];
  built: string[];
  /** Ordered steps: rendered as a numbered sequence. */
  steps?: { title: string; items: string[]; after?: string[] };
  outcomes: string[];
};

export const labNotes: LabNote[] = [
  {
    slug: "agent-vpn-paquet-linux",
    title: "Agent VPN WireGuard : de Docker à un paquet Linux",
    project: "Plateforme VPN multi-serveurs",
    projectSlug: "plateforme-vpn",
    platform: [
      "Architecture VPN distribuée : une API centrale en Go pilote des agents distants via gRPC, un par serveur VPN WireGuard.",
      "Installation des serveurs automatisée par des paquets Linux (.deb/.rpm), avec authentification TLS/HMAC, démarrage automatique des services et synchronisation des configurations VPN.",
      "Multi-tenant, gestion des accès, attribution automatique des IP, IPv6 et filtrage DNS.",
    ],
    status: "En cours de développement",
    summary:
      "L'agent qui pilote WireGuard sur chaque serveur VPN n'est plus un conteneur Docker mais un vrai paquet Linux, installé par apt ou dnf.",
    stack: ["Go", "gRPC", "WireGuard", "TLS/HMAC", "nfpm", "systemd", "apt / dnf", "iptables"],
    context: [
      "Je développe une plateforme VPN basée sur WireGuard. Sur chaque serveur VPN tourne un agent, qui gère l'interface WireGuard pour le compte de l'API.",
      "Jusqu'ici, l'agent était déployé dans un conteneur Docker. Ça marchait, mais il fallait installer Docker, écrire un compose, régler les droits réseau du conteneur… pour un simple binaire Go. J'ai donc changé d'approche : l'agent est maintenant un vrai paquet Linux.",
    ],
    built: [
      "Des paquets .deb et .rpm, en amd64 et arm64, construits avec nfpm. Chaque paquet contient le binaire de l'agent, son service systemd et un script de configuration.",
      "Les dépendances sont déclarées dans le paquet (wireguard-tools, iptables, iproute2) : apt les installe tout seul.",
      "Les paquets sont construits pendant le build de l'image de l'API, donc l'agent et l'API viennent toujours du même commit.",
      "L'API sert les paquets en HTTPS, avec un fichier SHA256SUMS.",
    ],
    steps: {
      title: "L'installation, côté admin",
      items: [
        "Détecte la distribution (apt ou dnf) et l'architecture.",
        "Télécharge le bon paquet et vérifie son empreinte SHA-256.",
        "L'installe avec le gestionnaire de paquets du système.",
        "Configure l'interface wg0 et démarre le service systemd.",
      ],
      after: [
        "Dans le backoffice, on crée le serveur et on copie la commande affichée, qu'on lance sur le VPS. Ensuite, l'API se connecte à l'agent et l'enrôle toute seule : le serveur apparaît alors dans l'application.",
        "Pour ceux qui préfèrent tout faire à la main, le backoffice donne aussi les commandes une par une, pour Debian/Ubuntu et RHEL/Fedora, en amd64 comme en arm64.",
      ],
    },
    outcomes: [
      "Plus besoin de Docker sur les serveurs VPN.",
      "systemd redémarre l'agent en cas de crash, et ses logs sont dans journalctl.",
      "Relancer la commande met l'agent à jour.",
      "Ajouter un serveur prend quelques minutes.",
    ],
  },
];

export function getLabNotes(lang: Locale = "fr"): LabNote[] {
  if (lang === "fr") return labNotes;
  return labNotes.map((n) => {
    const t = labNotesEn[n.slug];
    return t ? { ...n, ...t } : n;
  });
}
