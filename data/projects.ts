import type { Locale } from "@/lib/i18n";
import { projectsEn } from "./en";

export type ProjectCategory = "Web" | "Mobile" | "API";

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  domain: string;
  categories: ProjectCategory[];
  summary: string;
  role?: string;
  context?: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  images: ProjectImage[];
  /**
   * For projects without screenshots (backend, infrastructure): a simple architecture sketch,
   * one central service linked to several remote nodes.
   */
  architecture?: { center: string; centerDetail: string; link: string; node: string; nodeDetail: string };
  /** Slug of the matching Lab note, when there is one. */
  labNote?: string;
  /** Où le projet a été réalisé (entreprise, client). */
  client?: string;
  period?: string;
  featured?: boolean;
};

const img = (file: string, width: number, height: number, alt: string): ProjectImage => ({
  src: `/images/projects/${file}`,
  width,
  height,
  alt,
});

export const projects: Project[] = [
  {
    slug: "stoogo",
    client: "Side project",
    period: "Depuis 2026",
    title: "STOOGO",
    domain: "Vie étudiante",
    categories: ["Mobile", "Web"],
    featured: true,
    role: "Fondateur. Je conçois, développe et mets en production l'ensemble du produit.",
    summary: "App mobile de mise en relation entre étudiants, avec back-office et IA intégrée.",
    context:
      "STOOGO aide les étudiants à se trouver entre eux et à préparer leurs candidatures. J'ai lancé le projet seul : l'application mobile, le back-office, le backend temps réel, les déploiements et le suivi en production.",
    highlights: [
      "Application mobile React Native : matching, profils, messagerie temps réel",
      "Back-office Angular pour l'administration et la modération",
      "IA : analyse de CV, génération de lettres de motivation, candidatures automatisées",
      "Backend Go, WebSockets, CI/CD GitLab, déploiements OTA iOS/Android",
      "Monitoring Sentry et analytics PostHog",
    ],
    stack: ["React Native", "Angular", "Golang", "PostgreSQL", "Docker", "OpenAI API", "Sentry", "PostHog"],
    links: [{ label: "stoogo.com", href: "https://stoogo.com/" }],
    images: [img("stoogo.webp", 1747, 1017, "Interface de l'application STOOGO")],
  },
  {
    slug: "plateforme-vpn",
    title: "Plateforme VPN multi-serveurs",
    domain: "Réseau et sécurité",
    categories: ["API"],
    featured: true,
    client: "Projet personnel",
    period: "En cours",
    role: "Conception et développement de l'ensemble de la plateforme",
    summary: "Plateforme VPN multi-serveurs basée sur WireGuard : une API centrale en Go pilote un agent sur chaque serveur VPN.",
    context:
      "Une application mobile et back-office avec une API centrale qui pilote une flotte de serveurs VPN WireGuard. Sur chaque serveur, un agent installé comme un paquet Linux reçoit ses ordres de l'API et applique la configuration.",
    highlights: [
      "Conception d'une architecture VPN distribuée avec API centrale en Go et agents distants pilotés via gRPC.",
      "Automatisation de l'installation des serveurs VPN via des paquets Linux (.deb/.rpm), avec authentification sécurisée par TLS/HMAC, démarrage automatique des services et synchronisation automatique des configurations VPN.",
      "Implémentation du multi-tenant, de la gestion des accès, de l'attribution automatique des IP, d'IPv6 et du filtrage DNS.",
    ],
    stack: ["Go", "gRPC", "WireGuard", "TLS/HMAC", "systemd", "nfpm (.deb/.rpm)", "IPv6", "Linux", "PostgreSQL", "Docker", "GitLab CI/CD"],
    links: [],
    images: [
      img("cgsecure-install-agent.webp", 2000, 975, "Commande d'installation de l'agent sur un serveur VPN"),
      img("cgsecure.webp", 2000, 922, "Dashboard de la plateforme VPN multi-serveurs"),
      img("cgsecure-server.webp", 2000, 975, "Espace d'ajout des serveurs VPN dans la plateforme"),
    ],
    architecture: {
      center: "API centrale",
      centerDetail: "Go, multi-tenant, accès, IP, DNS",
      link: "gRPC, TLS/HMAC",
      node: "Agent",
      nodeDetail: "WireGuard, systemd",
    },
    labNote: "agent-vpn-paquet-linux",
  },
  {
    slug: "almamater",
    client: "Agence TILD",
    period: "2022 à 2026",
    title: "Almamater",
    domain: "EdTech",
    categories: ["Web", "Mobile"],
    featured: true,
    role: "Développeur fullstack web et mobile chez Agence TILD",
    summary: "Suite de gestion scolaire : CRM, ERP, extranet étudiants et application mobile.",
    context:
      "Almamater sert aux écoles à gérer leurs prospects, leurs étudiants et leurs documents. J'ai travaillé dessus pendant près de quatre ans, dans une équipe en Scrum.",
    highlights: [
      "Modules CRM et ERP pour la gestion interne des établissements",
      "Extranet étudiants et application mobile : notes, emplois du temps, documents",
      "Ancrage blockchain de diplômes pour garantir leur authenticité",
      "Déploiements Azure et GitLab CI/CD",
    ],
    stack: ["Vue.js", "React Native", "NestJS", "Node.js", "Prisma", "MySQL", "Docker", "Azure", "GitLab CI/CD"],
    links: [],
    images: [
      img("pedaalma.webp", 2000, 971, "Module pédagogique d'Almamater"),
      img("extrantetalma.webp", 2000, 956, "Extranet étudiants d'Almamater"),
      img("alma1.webp", 738, 1600, "Application mobile Almamater"),
    ],
  },
  {
    slug: "openpay",
    client: "OpenPay CG",
    period: "Depuis 2019",
    title: "OpenPay",
    domain: "FinTech",
    categories: ["Web"],
    featured: true,
    role: "Co-fondateur et développeur fullstack",
    summary:
      "Agrégateur de paiements mobiles pour particuliers, commerçants et partenaires en Afrique centrale.",
    highlights: [
      "Portail client, espace partenaire et console admin",
      "API REST documentées pour l'intégration des partenaires",
      "Authentification par clé API",
      "Transactions en temps réel avec URL de callback",
      "Déploiement Docker/Nginx, CI/CD GitLab",
    ],
    stack: ["Vue.js", "Nuxt", "PrimeVue", "Java", "Spring Boot", "Keycloak", "MySQL", "Docker", "WebSocket"],
    links: [{ label: "openpay.cg", href: "https://openpay.cg" }],
    images: [
      img("openpay-home.webp", 2000, 979, "Page d'accueil"),
      img("openpay-partner.webp", 2000, 964, "Espace Partenaire"),
      img("openpay-admin.webp", 2000, 992, "Console d'administration"),
    ],
  },
  {
    slug: "orient-ex",
    client: "Association Orient'Ex",
    period: "2025 à 2026",
    title: "Orient'Ex",
    domain: "Mentorat",
    categories: ["Web"],
    role: "Développeur fullstack Vue.js, Nuxt et Node.js",
    summary: "Plateforme de mentorat connectant mentors bénévoles et jeunes en recherche d'orientation.",
    highlights: [
      "Trois interfaces distinctes : admin, mentor et mentoré",
      "Messagerie et notifications en temps réel (Socket.IO)",
      "Prise de rendez-vous ponctuels et récurrents",
      "Authentification, sessions Redis, pipeline CI/CD GitLab",
    ],
    stack: ["Vue.js", "Nuxt", "Node.js", "Socket.io", "PostgreSQL", "Redis", "Docker", "GitLab CI/CD"],
    links: [{ label: "orient-ex.org", href: "https://orient-ex.org" }],
    images: [
      img("orientex1.webp", 2000, 922, "Page d'accueil d'Orient'Ex"),
      img("orientex2.webp", 2000, 975, "Espace mentorat d'Orient'Ex"),
    ],
  },
  {
    slug: "app-bancaire",
    title: "App bancaire agrégatrice",
    domain: "FinTech",
    categories: ["Mobile"],
    summary: "Centralisation de comptes bancaires via Open Banking avec gestion financière intégrée.",
    highlights: [
      "Connexion multi-banques via API Open Banking (TrueLayer)",
      "Consultation de comptes, virements et cartes virtuelles",
      "Authentification Keycloak et paiements Stripe",
      "Backend Spring Boot conteneurisé avec Docker",
    ],
    stack: ["React Native", "Expo", "Java", "Spring Boot", "PostgreSQL", "Keycloak", "TrueLayer", "Stripe", "Docker"],
    links: [],
    images: [
      img("hb1.webp", 244, 527, "Écran des comptes de l'app bancaire"),
      img("hb2.webp", 241, 522, "Écran des virements de l'app bancaire"),
      img("hb3.webp", 240, 521, "Écran des cartes de l'app bancaire"),
    ],
  },
  {
    slug: "loukka",
    title: "Loukka",
    domain: "Commerce local",
    categories: ["Mobile"],
    summary: "Découverte d'établissements locaux difficilement repérables sur une carte interactive.",
    highlights: [
      "Carte interactive et recherche géolocalisée (Maps API)",
      "Fiches établissements avec photos et informations pratiques",
      "API REST Node.js avec PostgreSQL, backend dockerisé",
    ],
    stack: ["React Native", "Expo", "Maps API", "Node.js", "Sequelize", "PostgreSQL", "Docker"],
    links: [],
    images: [
      img("loukka1.webp", 1290, 2796, "Carte interactive de Loukka"),
      img("loukka2.webp", 1290, 2796, "Fiche établissement dans Loukka"),
      img("loukka4.webp", 1290, 2796, "Recherche géolocalisée dans Loukka"),
    ],
  },
  {
    slug: "airnes",
    title: "Airnes",
    domain: "E-commerce",
    categories: ["Web"],
    summary: "Boutique en ligne complète avec front-office client et back-office admin.",
    highlights: [
      "Front-office : catalogue, panier et parcours d'achat complet",
      "Back-office : stocks, commandes, suivi des ventes",
      "Paiement Stripe, API Node.js et MongoDB",
    ],
    stack: ["React", "Tailwind", "Node.js", "MongoDB", "Stripe"],
    links: [],
    images: [
      img("airnes1.webp", 2000, 974, "Page d'accueil de la boutique Airnes"),
      img("airnes2.webp", 2000, 968, "Back-office de la boutique Airnes"),
    ],
  },
  {
    slug: "gestache",
    title: "Gestache",
    domain: "Productivité",
    categories: ["Web"],
    summary: "Gestionnaire de tâches avec minuteur intégré pour suivre son temps de travail.",
    highlights: [
      "CRUD de tâches avec catégories et statuts",
      "Minuteur par tâche avec suivi du temps cumulé",
      "Authentification Firebase, déploiement sur Netlify",
    ],
    stack: ["Vue.js", "Vuetify", "Firebase", "Netlify"],
    links: [{ label: "la démo", href: "https://gestache-tsiang.netlify.app/" }],
    images: [img("gestache.webp", 2000, 992, "Tableau de tâches de Gestache")],
  },
  {
    slug: "api-rendez-vous",
    title: "API de prise de rendez-vous",
    domain: "Réservation",
    categories: ["API"],
    summary: "API REST documentée avec Swagger pour une application mobile de prise de rendez-vous.",
    highlights: [
      "Endpoints CRUD pour rendez-vous, utilisateurs et créneaux",
      "Documentation Swagger complète et testable en ligne",
      "ORM Sequelize avec base MySQL",
    ],
    stack: ["Node.js", "Sequelize", "MySQL", "Swagger", "REST API"],
    links: [{ label: "la documentation Swagger", href: "https://androidapi.herokuapp.com/api/v1/api-docs/" }],
    images: [img("api-docs.webp", 2000, 989, "Documentation Swagger de l'API de rendez-vous")],
  },
  {
    slug: "api-gestion-sportive",
    title: "API de gestion sportive",
    domain: "Sport",
    categories: ["API"],
    summary: "API Spring Boot documentée pour la gestion de tournois et de matchs.",
    highlights: [
      "Architecture Spring Boot en couches service et repository",
      "Documentation Swagger/OpenAPI intégrée",
      "Conteneurisation Docker pour le déploiement",
    ],
    stack: ["Java", "Spring Boot", "Docker", "Swagger", "REST API"],
    links: [],
    images: [img("api-tennis.webp", 2000, 967, "Documentation OpenAPI de l'API de gestion sportive")],
  },
  {
    slug: "h3-freelance",
    title: "Site freelance H3",
    domain: "Marketplace",
    categories: ["Web"],
    summary: "Plateforme de mise en vente de services freelance pour étudiants.",
    highlights: [
      "Catalogue de services avec fiches détaillées",
      "Backend Symfony avec gestion des utilisateurs et des commandes",
    ],
    stack: ["HTML", "CSS", "JavaScript", "PHP", "Symfony"],
    links: [],
    images: [img("h3freelance.webp", 2000, 954, "Catalogue de services du site H3")],
  },
];

/** Domain shown in the browser frame address bar, when the project has a public site. */
export function projectHost(project: Project) {
  return project.links.find((l) => /^[\w-]+(\.[\w-]+)+$/.test(l.label))?.label;
}

export const isPortrait = (image: ProjectImage) => image.height > image.width;

/** French is the reference; other locales take their text from data/en.ts. */
function localizeProject(project: Project, lang: Locale): Project {
  if (lang === "fr") return project;
  const t = projectsEn[project.slug];
  if (!t) return project;
  return {
    ...project,
    title: t.title ?? project.title,
    domain: t.domain,
    client: t.client ?? project.client,
    period: t.period ?? project.period,
    role: t.role ?? project.role,
    summary: t.summary,
    context: t.context ?? project.context,
    highlights: t.highlights,
    links: project.links.map((l, i) => ({ ...l, label: t.links?.[i] ?? l.label })),
    images: project.images.map((img, i) => ({ ...img, alt: t.images?.[i] ?? img.alt })),
    architecture: t.architecture ?? project.architecture,
  };
}

export function getProjects(lang: Locale = "fr"): Project[] {
  return projects.map((p) => localizeProject(p, lang));
}

export function getFeaturedProjects(lang: Locale = "fr"): Project[] {
  return getProjects(lang).filter((p) => p.featured);
}

export function getProject(slug: string, lang: Locale = "fr") {
  const project = projects.find((p) => p.slug === slug);
  return project ? localizeProject(project, lang) : undefined;
}

export function getAdjacentProjects(slug: string, lang: Locale = "fr") {
  const list = getProjects(lang);
  const i = list.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i < list.length - 1 ? list[i + 1] : undefined,
  };
}
