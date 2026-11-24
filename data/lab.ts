import { localePath, type Locale } from "@/lib/i18n";
import { labCategoriesEn, labNotesEn, labsEn } from "./en";

/**
 * Lab: technical notes on personal projects. Content comes from the owner's own write-ups
 * (labs/*.md: vpn.md, go-grpc.md, assistant-ia.md). Do not add dates, links or figures that are not in the source.
 */
/**
 * Lab categories, in the order of the /lab tab bar. Every category gets a tab, even before it holds
 * a lab (its count then reads 0), so a new lab only needs its `category`.
 * English labels: `labCategoriesEn` in data/en.ts.
 */
export const labCategories = {
  "reseau-securite": "Réseau et sécurité",
  "devops-cloud": "DevOps et cloud",
  "backend-api": "Backend et API",
  ia: "IA",
} as const;

export type LabCategory = keyof typeof labCategories;

/**
 * A lab: one personal project explored in depth, with its technical notes and its demos.
 * Today there is one, the VPN platform. Its text comes from the project and the notes.
 */
export type Lab = {
  slug: string;
  title: string;
  category: LabCategory;
  /** Matching page in Projets. */
  projectSlug?: string;
  /** Only when the source states it; the line is hidden otherwise. */
  status?: string;
  summary: string;
  /** Heading of the overview section, "La plateforme" by default. */
  platformTitle?: string;
  /** What the whole platform does, shown with the project's architecture diagram when it has one. */
  platform: string[];
};

export const labs: Lab[] = [
  {
    slug: "plateforme-vpn",
    title: "Plateforme VPN multi-serveurs",
    category: "reseau-securite",
    projectSlug: "plateforme-vpn",
    status: "En cours de développement",
    summary:
      "Plateforme VPN multi-serveurs basée sur WireGuard\u00a0: une API centrale en Go pilote un agent sur chaque serveur VPN.",
    platform: [
      "Architecture VPN distribuée : une API centrale en Go pilote des agents distants via gRPC, un par serveur VPN WireGuard.",
      "Installation des serveurs automatisée par des paquets Linux (.deb/.rpm), avec authentification TLS/HMAC, démarrage automatique des services et synchronisation des configurations VPN.",
      "Multi-tenant, gestion des accès, attribution automatique des IP, IPv6 et filtrage DNS.",
    ],
  },
  {
    slug: "assistant-ia-openpay",
    title: "Assistant IA d'OPENPAY",
    category: "ia",
    projectSlug: "openpay",
    summary: "Un assistant qui répond aux clients d'OPENPAY sur chaque page du site. Chaque réponse est rédigée par Claude uniquement à partir d'une base de connaissances gérée par l'équipe, et les tarifs sont lus en direct dans la configuration.",
    platformTitle: "L'architecture",
    platform: [
      "Navigateur (Nuxt) : un bouton flottant ouvre le chat, qui envoie la question à l'API en POST /ask/stream et reçoit la réponse en Server-Sent Events.",
      "API (Express) : identification (JWT ou visiteur), nettoyage et validation de la question, limite de débit par compte ou par IP.",
      "Retrieval : les 5 articles les plus pertinents sont retrouvés par un index FULLTEXT MySQL, avec les tarifs en vigueur.",
      "Augmented : ces articles, les tarifs du moment et les 10 derniers messages sont injectés dans le prompt.",
      "Generation : Claude Haiku rédige une réponse courte, en français, sans jamais sortir de ce contexte. La réponse est enregistrée avec ses tokens et ses liens.",
      "Admin : les articles, les conversations et les questions restées sans article."
    ],
  }
];

export type LabNote = {
  slug: string;
  /** The lab this note belongs to: its page is /lab/<lab>/<slug>. */
  lab: string;
  title: string;
  project: string;
  /** Matching page in Projets, when the project is listed there. */
  projectSlug?: string;
  /** Only when the source states it; the line is hidden otherwise. */
  status?: string;
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
    lab: "plateforme-vpn",
    title: "Agent VPN WireGuard : de Docker à un paquet Linux",
    project: "Plateforme VPN multi-serveurs",
    projectSlug: "plateforme-vpn",
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
    lab: "plateforme-vpn",
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
  {
    slug: "rag-sans-base-vectorielle",
    lab: "assistant-ia-openpay",
    title: "Un RAG sobre, sans base vectorielle",
    project: "Assistant IA d'OPENPAY",
    projectSlug: "openpay",
    summary: "Pour répondre aux clients à partir de 66 articles, un index FULLTEXT MySQL suffit : pas de base vectorielle. Claude Haiku rédige, et le code garde la main sur les tarifs et les liens.",
    proves: [
      "Concevoir un RAG de bout en bout, de la recherche à la génération",
      "Choisir l'architecture la plus simple qui suffit, et l'assumer",
      "Intégrer un LLM avec le SDK Anthropic, en streaming SSE",
      "Garder les faits côté code : tarifs en direct, liens en liste fermée"
    ],
    stack: [
      "Node.js",
      "Express",
      "MySQL 8 (FULLTEXT)",
      "Claude Haiku 5.5",
      "Anthropic SDK",
      "Nuxt 4",
      "Server-Sent Events"
    ],
    context: [
      "OPENPAY permet aux marchands congolais d'encaisser des paiements Mobile Money. Les mêmes questions revenaient sans cesse : combien coûte un retrait, où trouver ma clé API, puis-je ouvrir un compte sans entreprise, pourquoi mon callback n'arrive pas.",
      "Elles arrivaient par e-mail ou WhatsApp, à toute heure, de trois publics : des visiteurs qui découvrent le service, des marchands en pleine intégration, et des admins. L'objectif : une réponse immédiate, exacte et vérifiable, sur chaque page du site, sans risque que l'IA invente un tarif ou une procédure."
    ],
    built: [
      "Un bouton « Posez-moi une question » ouvre un chat. Chaque réponse est rédigée par Claude uniquement à partir d'une base de connaissances gérée par l'équipe.",
      "Retrieval : les 5 articles les plus pertinents sont retrouvés par un index FULLTEXT MySQL.",
      "Augmented : ces articles, les tarifs du moment et les 10 derniers messages sont injectés dans le prompt.",
      "Generation : Claude Haiku rédige une réponse courte, en français, sans jamais sortir de ce contexte."
    ],
    sections: [
      {
        "title": "Pas de base vectorielle, et c'est voulu",
        "items": [
          "Le réflexe RAG, ce sont les embeddings et une base vectorielle. Pour une base de 66 articles, c'était surdimensionné : un service de plus à héberger, une synchronisation à maintenir et un coût supplémentaire.",
          "J'ai utilisé l'index FULLTEXT de MySQL, déjà présent dans la stack : la requête renvoie les 5 articles publiés qui ont le meilleur score de pertinence.",
          "Le compromis assumé : FULLTEXT ne comprend pas le sens et ne gère pas les variantes de mots (« remboursé » ne trouve pas « remboursement »). Je l'ai compensé côté contenu : chaque article se termine par une ligne Mots-clés qui reprend les formulations réelles des clients.",
          "La recherche sémantique reste une évolution possible, à déclencher quand les données admin montreront qu'elle est nécessaire."
        ]
      },
      {
        "title": "Le plus petit modèle qui fait le travail",
        "items": [
          "Claude Haiku 5.5, avec un effort de raisonnement low et 2 048 tokens de sortie au maximum.",
          "La tâche consiste à reformuler un contexte fourni, pas à raisonner sur un problème ouvert. Résultat : des réponses en quelques secondes et un coût par question minimal."
        ]
      },
      {
        "title": "Les tarifs ne sont jamais écrits dans les articles",
        "items": [
          "Le prix de l'abonnement API est réglé par l'admin et peut changer à tout moment. S'il était écrit dans un article, l'assistant finirait par annoncer un ancien prix.",
          "À chaque question, le backend lit la configuration en cours (avec un cache de 30 s) et l'injecte dans un bloc <tarifs_en_vigueur>, qui fait foi sur les articles. Une seule source de vérité, partagée avec la page Tarifs du site."
        ]
      },
      {
        "title": "Des liens, mais dans une liste fermée",
        "items": [
          "L'assistant peut proposer des boutons, comme « Aller à Clé API » ou « Documentation : liens de paiement ». Mais il ne produit jamais d'URL : il termine sa réponse par un marqueur [[lien:cle-api]].",
          "Le backend le remplace par une page tirée d'une liste fermée de 17 destinations, et ignore toute clé inconnue. Une hallucination ne peut donc pas devenir un lien cassé ou malveillant."
        ]
      },
      {
        "title": "Le streaming",
        "items": [
          "Les réponses s'affichent au fil de l'eau, via des Server-Sent Events sur un POST, avec un fetch et un ReadableStream côté navigateur.",
          "Un marqueur de lien peut arriver coupé en deux entre deux morceaux. Une fonction visibleText retient tout marqueur incomplet : le texte affiché ne fait que s'allonger, il ne clignote jamais et ne se réécrit pas. Un test unitaire le vérifie.",
          "Si le client ferme le chat pendant la génération, un AbortController lié à res.on(\"close\") coupe l'appel au modèle, pour ne pas payer une réponse que personne ne lira.",
          "Derrière nginx, l'en-tête X-Accel-Buffering: no empêche le proxy de retenir le flux."
        ]
      },
      {
        "title": "Pistes suivantes",
        "items": [
          "Recherche hybride (FULLTEXT et embeddings) si le taux de questions sans article plafonne.",
          "Retrait des mots vides français avant la recherche.",
          "Limiteur partagé via Redis pour le passage à plusieurs instances.",
          "Conversion des tokens en coût réel dans le tableau de bord."
        ]
      }
    ],
    outcomes: [
      "La sobriété est un choix d'architecture : un index FULLTEXT bien nourri vaut mieux qu'une base vectorielle mal alimentée.",
      "Le modèle rédige, le code décide : prix, liens, droits d'accès et limites sont fixés par le backend."
    ],
  },
  {
    slug: "securiser-une-ia-publique",
    lab: "assistant-ia-openpay",
    title: "Sécuriser une IA publique",
    project: "Assistant IA d'OPENPAY",
    projectSlug: "openpay",
    summary: "Un assistant ouvert aux visiteurs est une surface d'attaque. Chaque risque a sa parade, et le modèle n'a aucun pouvoir d'action : il ne fait que rédiger du texte.",
    proves: [
      "Sécuriser une IA publique : injection de prompt, XSS, ingénierie sociale",
      "Nettoyer et échapper les entrées, requêtes SQL paramétrées",
      "Limiter le débit par compte et par IP",
      "Lire le contrat d'une API et corriger un bug existant"
    ],
    stack: [
      "Node.js",
      "Express",
      "express-rate-limit",
      "MySQL 8",
      "Supertest"
    ],
    context: [
      "Le chat est public : n'importe quel visiteur peut y écrire. Une IA publique se sécurise comme un formulaire public, avec en plus l'injection de prompt."
    ],
    sections: [
      {
        "title": "Les risques et leurs parades",
        "items": [
          "Injection de prompt (« ignore tes consignes ») : la question et les articles sont échappés (< devient &lt;) avant d'être placés entre balises. Impossible de fermer <question> ou d'ouvrir un faux bloc <system>. Le prompt traite la question comme une donnée, jamais comme une instruction.",
          "Texte caché : normalisation Unicode NFKC, et suppression des caractères invisibles (zéro largeur, inversion du sens d'écriture) et des caractères de contrôle.",
          "Injection SQL : paramètres liés uniquement. Je ne filtre pas des mots comme SELECT ou DROP : cela bloquerait des questions légitimes sans rien protéger de plus. Un test d'intégration envoie une tentative d'injection et vérifie que rien ne bouge.",
          "XSS via une réponse : rendu en texte brut, jamais de v-html.",
          "Hallucination de tarif ou de procédure : le prompt interdit d'inventer frais, délais ou endpoints. Une information manquante renvoie vers le contact.",
          "Ingénierie sociale : l'assistant ne demande jamais de mot de passe, de code PIN, d'OTP ni de clé API. Il ne peut faire aucune action : il ne fait que rédiger du texte.",
          "Abus et coût : 20 questions par 10 minutes pour un compte, 40 par 10 minutes par IP pour les visiteurs."
        ]
      },
      {
        "title": "L'anecdote du limiteur",
        "items": [
          "En comptant les visiteurs par IP, j'ai découvert un bug qui existait déjà dans l'application. Avec express-rate-limit v8, ipKeyGenerator attend une adresse IP. Le code lui passait la requête entière.",
          "La clé de limitation valait donc \"[object Object]\" pour tout le monde : un seul compteur global au lieu d'un compteur par client.",
          "Le correctif tient en une ligne, mais il touchait aussi la limite d'envoi des e-mails d'authentification. C'est un bon rappel : lire le contrat d'une API plutôt que deviner sa signature."
        ]
      }
    ],
    outcomes: [
      "Une IA publique se sécurise comme un formulaire public, plus l'injection de prompt : nettoyage, échappement, limites de débit, et aucun pouvoir d'action.",
      "La limite par IP est vérifiée par un test d'intégration : la 41ᵉ requête reçoit un 429."
    ],
  },
  {
    slug: "piloter-un-assistant-ia",
    lab: "assistant-ia-openpay",
    title: "Faire parler un conseiller, et piloter l'assistant",
    project: "Assistant IA d'OPENPAY",
    projectSlug: "openpay",
    summary: "Avec un petit modèle, la position d'une consigne compte autant que sa formulation. Et un RAG ne vaut que par sa base de connaissances : l'interface admin sert à l'enrichir.",
    proves: [
      "Écrire un prompt qui tient avec un petit modèle",
      "Mesurer et piloter un produit IA : avis, tokens, questions sans réponse",
      "Tester un produit IA sans appeler le vrai modèle",
      "Soigner l'expérience : performance, accessibilité, continuité"
    ],
    stack: [
      "Claude Haiku 5.5",
      "Nuxt 4",
      "PrimeVue 4",
      "TanStack Query",
      "node:test",
      "Supertest",
      "Playwright"
    ],
    context: [
      "Les premières réponses commençaient par « D'après les articles de notre base ». C'est exact techniquement, mais cela sonne comme un robot. Interdire ces mots dans le prompt système n'a pas suffi : un petit modèle suit moins bien une consigne éloignée du texte qu'il traite."
    ],
    sections: [
      {
        "title": "Ce qui a fonctionné pour le ton",
        "items": [
          "Une section dédiée au ton, avec une liste de mots interdits (article, document, source, base) et des exemples à éviter et corrects.",
          "Un rappel court placé juste après la question, dans le dernier message utilisateur. Il corrige aussi l'effet des anciennes réponses mal formulées encore présentes dans l'historique."
        ]
      },
      {
        "title": "La boucle d'amélioration",
        "items": [
          "Conversations : volume, taux de satisfaction calculé sur les avis positifs et négatifs des clients, part de questions sans article, et tokens réellement consommés, lus dans response.usage et enregistrés pour chaque réponse. Chaque conversation s'ouvre en détail avec les articles utilisés, les liens proposés et le coût.",
          "Sans article : les questions pour lesquelles la recherche n'a rien trouvé. C'est la liste des articles à écrire. Un clic ouvre l'éditeur avec la question déjà en titre.",
          "Articles : gestion de la base (création, publication, catégories)."
        ]
      },
      {
        "title": "Les détails qui font l'expérience",
        "items": [
          "Une invitation, pas seulement une icône : « Posez-moi une question, en ligne, réponse immédiate ». Une carte de bienvenue propose 3 questions adaptées à la page, différentes sur le site public et dans l'espace marchand.",
          "Le chat est chargé à la demande, et préchargé quand le navigateur est inactif ou au survol du bouton : il ne pèse rien au premier affichage.",
          "Un visiteur reçoit un identifiant anonyme. À sa connexion, ses conversations passent automatiquement sur son compte.",
          "prefers-reduced-motion respecté, boutons d'avis avec aria-pressed, noms accessibles sur les panneaux, navigation au clavier.",
          "Le bouton est masqué sur la page de paiement, pour ne pas distraire au moment de payer."
        ]
      },
      {
        "title": "Qualité et tests",
        "items": [
          "Unitaire (node:test) : nettoyage anti-injection, extraction des liens, filtrage du texte en streaming, cas de refus du modèle, tarifs en direct.",
          "Intégration (Supertest et un MySQL 8 jetable dans Docker) : recherche FULLTEXT, propriété des conversations, flux SSE, avis, rattachement à la connexion, limite par IP, statistiques admin, tentative d'injection SQL.",
          "Bout en bout (Playwright, avec un faux backend capable d'émettre du SSE) : streaming visible, liens, avis, reprise d'une conversation, erreurs et 429, carte de bienvenue, page de paiement, écrans admin.",
          "Aucun test n'appelle le vrai modèle : le SDK est simulé, ce qui rend la suite rapide, déterministe et gratuite en CI."
        ]
      }
    ],
    outcomes: [
      "La suite backend (116 tests unitaires, 74 tests d'intégration) passe au complet avec l'assistant, et 10 scénarios e2e lui sont dédiés.",
      "Sans mesure, pas de pilotage : tokens, avis et questions sans réponse transforment un chatbot en produit qu'on peut améliorer semaine après semaine."
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

export function getLabs(lang: Locale = "fr"): Lab[] {
  if (lang === "fr") return labs;
  return labs.map((l) => {
    const t = labsEn[l.slug];
    return t ? { ...l, ...t } : l;
  });
}

export const getLab = (slug: string, lang: Locale = "fr") => getLabs(lang).find((l) => l.slug === slug);

/** Notes of a lab, in Lab order. */
export const getLabNotesForLab = (labSlug: string, lang: Locale = "fr") =>
  getLabNotes(lang).filter((n) => n.lab === labSlug);

export const labCategoryLabel = (category: LabCategory, lang: Locale = "fr") =>
  lang === "fr" ? labCategories[category] : labCategoriesEn[category];

/** Every category in tab order, with its label in the given locale. */
export const getLabCategories = (lang: Locale = "fr") =>
  (Object.keys(labCategories) as LabCategory[]).map((category) => ({
    value: category,
    label: labCategoryLabel(category, lang),
  }));

/** Public paths: /lab/<lab> and /lab/<lab>/<note or demo>. */
export const labPath = (lang: Locale, labSlug: string) => localePath(lang, `/lab/${labSlug}`);
export const notePath = (lang: Locale, note: Pick<LabNote, "lab" | "slug">) =>
  localePath(lang, `/lab/${note.lab}/${note.slug}`);
