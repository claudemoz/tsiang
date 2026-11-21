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
  /** What the note proves, in a recruiter's words: skills, not tools alone. */
  proves: string[];
  stack: string[];
  context: string[];
  /** "Ce que j'ai mis en place": hairline list. */
  built?: string[];
  /** Free sections after the context, each a titled hairline list (e.g. "Pourquoi Go"). */
  sections?: { title: string; items: string[] }[];
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
    proves: [
      "Packaging et distribution d'un logiciel Go sur Linux (.deb/.rpm)",
      "Administration Linux : systemd, apt et dnf, iptables",
      "Sécurité de la livraison : HTTPS et empreintes SHA-256",
      "Automatisation du déploiement d'une flotte de serveurs",
    ],
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
  {
    slug: "go-grpc-plateforme-vpn",
    title: "Pourquoi Go et gRPC pour piloter les serveurs VPN",
    project: "Plateforme VPN multi-serveurs",
    projectSlug: "plateforme-vpn",
    status: "En cours de développement",
    summary:
      "L'API centrale et l'agent installé sur chaque serveur VPN sont écrits en Go et se parlent en gRPC. Voici ce qui a guidé ces deux choix.",
    proves: [
      "Conception d'une architecture distribuée (API centrale et agents)",
      "Go côté serveur : concurrence, binaire unique, cross-compilation",
      "gRPC et Protocol Buffers : contrat typé, streaming, TLS",
      "Choisir une technologie pour ses contraintes et l'expliquer",
    ],
    stack: ["Go", "gRPC", "Protocol Buffers", "HTTP/2", "TLS/HMAC", "WireGuard"],
    context: [
      "La plateforme a deux côtés. Une API centrale gère les comptes, les accès et les adresses IP. Sur chaque serveur VPN, un agent applique la configuration WireGuard que l'API lui envoie.",
      "Il fallait donc choisir un langage pour ces deux programmes, et une façon pour l'API de donner ses ordres aux agents.",
    ],
    sections: [
      {
        title: "Pourquoi Go",
        items: [
          "Go compile en un seul binaire, sans runtime à installer sur le serveur. C'est ce qui permet de livrer l'agent dans un simple paquet .deb ou .rpm.",
          "WireGuard a son écosystème en Go (wireguard-go, wgctrl) : je reste dans le langage des outils du protocole.",
          "Les goroutines permettent à l'API de piloter plusieurs serveurs VPN en parallèle.",
          "L'API et l'agent sont écrits dans le même langage : ils partagent le code et les types générés depuis le contrat gRPC.",
        ],
      },
      {
        title: "Pourquoi gRPC",
        items: [
          "Un contrat typé : un fichier .proto décrit chaque échange entre l'API et l'agent, et un écart de format se voit à la compilation.",
          "Le streaming entre l'API et l'agent, pour la synchronisation des configurations VPN.",
          "TLS intégré au transport, complété par une signature HMAC.",
          "HTTP/2 et Protocol Buffers : des messages plus légers et plus rapides que du REST/JSON.",
        ],
      },
    ],
    outcomes: [
      "L'agent reste léger sur les serveurs VPN.",
      "La même CI compile l'agent en amd64 et en arm64.",
    ],
  },
];

export function getLabNote(slug: string, lang: Locale = "fr"): LabNote | undefined {
  return getLabNotes(lang).find((n) => n.slug === slug);
}

/** Notes attached to a project page, in Lab order. */
export function getLabNotesForProject(projectSlug: string, lang: Locale = "fr"): LabNote[] {
  return getLabNotes(lang).filter((n) => n.projectSlug === projectSlug);
}

export function getLabNotes(lang: Locale = "fr"): LabNote[] {
  if (lang === "fr") return labNotes;
  return labNotes.map((n) => {
    const t = labNotesEn[n.slug];
    return t ? { ...n, ...t } : n;
  });
}
