import type { Locale } from "@/lib/i18n";
import { experiencesEn } from "./en";

export type Experience = {
  role: string;
  company: string;
  url?: string;
  place?: string;
  period: string;
  current?: boolean;
  /** Slug of the matching project page, when there is one. */
  project?: string;
  summary: string;
  highlights: string[];
  /** Highlights split by product, shown under a short heading each (replaces `highlights` when set). */
  groups?: { title: string; items: string[] }[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: "Fondateur et développeur fullstack",
    company: "STOOGO",
    project: "stoogo",
    url: "https://stoogo.com/",
    period: "Depuis avril 2026",
    current: true,
    summary:
      "Application mobile de mise en relation entre étudiants, avec back-office admin et fonctionnalités IA intégrées.",
    highlights: [
      "Conception et développement de l'app mobile (React Native) et du back-office (Angular)",
      "Système de matching, messagerie et notifications en temps réel (WebSockets)",
      "IA générative : analyse de CV, lettres de motivation et candidatures automatisées (OpenAI API)",
      "CI/CD GitLab, conteneurisation Docker, déploiements OTA iOS/Android",
      "Observabilité : Sentry (erreurs) et PostHog (analytics produit)",
    ],
    stack: ["Angular", "React Native", "Go", "WebSockets", "Docker", "PostgreSQL", "OpenAI API", "Sentry", "PostHog"],
  },
  {
    role: "Développeur fullstack web et mobile",
    company: "Agence TILD",
    project: "almamater",
    place: "Paris La Défense",
    period: "Septembre 2022 à juillet 2026",
    summary:
      "Développement de la plateforme scolaire Almamater (CRM, ERP, extranet, app mobile) au sein d'une équipe Agile Scrum.",
    highlights: [],
    groups: [
      {
        title: "Plateforme web : CRM, ERP et extranet",
        items: [
          "Analyse des besoins, conception et développement des fonctionnalités",
          "Exposition d'API REST, intégration et consommation d'API externes",
          "Résolution des incidents, optimisation des performances et accompagnement des utilisateurs",
          "Automatisation des imports, exports et sauvegardes, planification des tâches CRON",
          "Modélisation de base de données, gestion des migrations, documentation technique et API avec Swagger",
          "Code review, refactoring et déploiement via GitLab CI/CD sur Azure",
          "Monitoring avec Kibana et APM pour améliorer la disponibilité et les performances des applications",
          "Tests unitaires et d'intégration pour garantir la qualité et la fiabilité",
          "Travail en équipe Agile Scrum (daily, planning, review, rétro), collaboration via Git, wiki, Slack, Teams et Trello",
          "Ancrage des documents sur la blockchain pour garantir leur authenticité",
          "Serveur MCP pour brancher des outils IA",
        ],
      },
      {
        title: "Application mobile",
        items: [
          "Conception et développement de l'application mobile à partir des fonctionnalités existantes de la plateforme web",
          "Adaptation des fonctionnalités métier de la plateforme web à un usage mobile",
          "Développement de nouvelles fonctionnalités mobiles avec React Native et TypeScript",
          "Intégration et consommation des API REST développées pour la plateforme web",
          "Mises à jour OTA pour mettre à jour l'application à distance sans publication systématique sur les stores",
          "Deep links pour ouvrir directement une fonctionnalité ou un écran précis de l'application",
          "Notifications push sur Android et iOS",
          "Gestion des spécificités des environnements Android et iOS",
          "Déploiement et publication sur Google Play et l'App Store",
          "Suivi des performances, analyse des erreurs et résolution des incidents avec Sentry et APM",
        ],
      },
    ],
    stack: [
      "Vue.js",
      "React Native",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Python",
      "MySQL",
      "Sequelize",
      "Elasticsearch",
      "Blockchain",
      "Kibana",
      "Sentry",
      "Docker",
      "GitLab CI/CD",
      "Azure",
      "Cursor",
      "Git",
      "Swagger",
    ],
  },
  {
    role: "Co-fondateur et développeur fullstack",
    company: "OPENPAY CG",
    project: "openpay",
    url: "https://openpay.cg",
    period: "Depuis janvier 2019",
    current: true,
    summary: "Conception et développement d'une plateforme d'agrégation de paiements mobiles destinée au marché africain.",
    highlights: [
      "Développement d'API REST et de serveurs MCP, avec intégration des API des opérateurs Mobile Money",
      "Rédaction de la documentation technique et des guides d'intégration, déploiement automatisé avec des pipelines CI/CD",
      "Migration de Java et Angular vers Node.js et Vue 3 avec Nuxt",
    ],
    stack: [
      "Vue 3",
      "Nuxt",
      "Pinia",
      "Node.js",
      "GitLab CI/CD",
      "JWT",
      "Docker",
      "MySQL",
      "Sequelize",
      "IA",
      "Claude Code",
      "MCP",
    ],
  },
  {
    role: "Développeur fullstack Vue.js, Nuxt et Node.js",
    company: "Association Orient'Ex",
    project: "orient-ex",
    url: "https://orient-ex.org",
    period: "Octobre 2025 à mars 2026",
    summary:
      "Plateforme de mentorat connectant mentors et jeunes, avec interfaces dédiées par rôle et prise de rendez-vous.",
    highlights: [
      "Interfaces admin, mentor et mentoré, avec messagerie temps réel (Socket.IO)",
      "Gestion des rendez-vous ponctuels et récurrents",
      "Authentification, sessions Redis, pipeline CI/CD GitLab et Docker",
    ],
    stack: ["Vue.js", "Nuxt", "TypeScript", "Node.js", "Socket.io", "PostgreSQL", "Redis", "Docker"],
  },
  {
    role: "Technicien informatique",
    company: "Centre Social Pasteur Sablons",
    place: "Sarcelles",
    period: "Août à septembre 2022",
    summary:
      "Maintenance du parc informatique, support utilisateurs et accompagnement aux usages numériques.",
    highlights: [],
    stack: [],
  },
];

export function getExperiences(lang: Locale = "fr"): Experience[] {
  if (lang === "fr") return experiences;
  return experiences.map((xp, i) => {
    const t = experiencesEn[i];
    return t
      ? {
          ...xp,
          role: t.role,
          company: t.company ?? xp.company,
          place: t.place ?? xp.place,
          period: t.period,
          summary: t.summary,
          highlights: t.highlights,
          groups: t.groups ?? xp.groups,
          stack: t.stack ?? xp.stack,
        }
      : xp;
  });
}
