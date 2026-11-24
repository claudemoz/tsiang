# Assistant IA d'OPENPAY : un RAG sobre, sans base vectorielle

> **Lab** · Plateforme de paiement mobile (MTN, Airtel) · Novembre 2026
> **Stack** : Node.js / Express · MySQL 8 (FULLTEXT) · Claude Haiku 5.5 (Anthropic SDK) · Nuxt 4 · PrimeVue 4 · TanStack Query · Server-Sent Events · Playwright

---

## Le problème

OPENPAY permet aux marchands congolais d'encaisser des paiements Mobile Money. Les mêmes questions revenaient sans cesse : *combien coûte un retrait ?*, *où trouver ma clé API ?*, *puis-je ouvrir un compte sans entreprise ?*, *pourquoi mon callback n'arrive pas ?*

Elles arrivaient par e-mail ou WhatsApp, à toute heure, et de trois publics différents :

- des **visiteurs** qui découvrent le service ;
- des **marchands** en pleine intégration ;
- des **admins**.

L'objectif : une réponse **immédiate, exacte et vérifiable**, sur chaque page du site, sans risque que l'IA invente un tarif ou une procédure.

## La solution en une phrase

Un bouton « Posez-moi une question » ouvre un chat. Chaque réponse est rédigée par Claude **uniquement à partir d'une base de connaissances** gérée par l'équipe. Les tarifs sont lus **en direct** dans la configuration, et un tableau de bord admin montre ce que les clients demandent et ce qui manque.

---

## Architecture

```
 Navigateur (Nuxt)                         API (Express)                          Externe
┌─────────────────────┐  POST /ask/stream  ┌───────────────────────────────────┐
│ Bouton flottant     │ ─────────────────► │ 1. Identification (JWT ou visiteur)│
│  └ Dialog de chat   │   (SSE)            │ 2. Nettoyage + validation          │
│     ├ Historique    │                    │ 3. Limite de débit (compte / IP)   │
│     └ Fil + liens   │ ◄── delta… done ── │ 4. Recherche FULLTEXT ─────────────┼──► MySQL
└─────────────────────┘                    │    + tarifs en vigueur ────────────┼──► MySQL
                                           │ 5. Génération en streaming ────────┼──► Claude Haiku
 Admin                                     │ 6. Enregistrement (tokens, liens)  │
┌─────────────────────┐                    └───────────────────────────────────┘
│ Articles · Conversa-│
│ tions · Sans article│
└─────────────────────┘
```

**R** (*Retrieval*) : les 5 articles les plus pertinents sont retrouvés par un index `FULLTEXT` MySQL.
**A** (*Augmented*) : ces articles, les tarifs du moment et les 10 derniers messages sont injectés dans le prompt.
**G** (*Generation*) : Claude Haiku rédige une réponse courte, en français, sans jamais sortir de ce contexte.

---

## Les choix, et pourquoi

### 1. Pas de base vectorielle, et c'est voulu

Le réflexe RAG, ce sont les embeddings et une base vectorielle. Pour une base de **66 articles**, c'était surdimensionné : un service de plus à héberger, une synchronisation à maintenir et un coût supplémentaire.

J'ai utilisé l'index `FULLTEXT` de MySQL, déjà présent dans la stack :

```sql
SELECT id_assistant_article, title, content,
       MATCH(title, content) AGAINST(:q IN NATURAL LANGUAGE MODE) AS score
  FROM assistant_article
 WHERE is_published = 1
   AND MATCH(title, content) AGAINST(:q IN NATURAL LANGUAGE MODE)
 ORDER BY score DESC
 LIMIT 5
```

**Le compromis assumé** : FULLTEXT ne comprend pas le sens et ne gère pas les variantes de mots (« remboursé » ne trouve pas « remboursement »). Je l'ai compensé côté contenu : chaque article se termine par une ligne `Mots-clés` qui reprend les formulations réelles des clients. La recherche sémantique reste une évolution possible, à déclencher quand les données admin montreront qu'elle est nécessaire.

### 2. Le plus petit modèle qui fait le travail

**Claude Haiku 5.5**, avec un effort de raisonnement `low` et 2 048 tokens de sortie au maximum. La tâche consiste à reformuler un contexte fourni, pas à raisonner sur un problème ouvert. Résultat : des réponses en quelques secondes et un coût par question minimal.

### 3. Les tarifs ne sont jamais écrits dans les articles

Le prix de l'abonnement API est réglé par l'admin et peut changer à tout moment. S'il était écrit dans un article, l'assistant finirait par annoncer un ancien prix.

À chaque question, le backend lit donc la configuration en cours (avec un cache de 30 s) et l'injecte dans un bloc `<tarifs_en_vigueur>`, qui **fait foi** sur les articles. Une seule source de vérité, partagée avec la page Tarifs du site.

### 4. Des liens, mais dans une liste fermée

L'assistant peut proposer des boutons, comme « Aller à Clé API » ou « Documentation : liens de paiement ». Mais il ne produit **jamais d'URL** : il termine sa réponse par un marqueur `[[lien:cle-api]]`. Le backend le remplace par une page tirée d'une **liste fermée de 17 destinations**, et ignore toute clé inconnue. Une hallucination ne peut donc pas devenir un lien cassé ou malveillant.

### 5. Le streaming

Les réponses s'affichent au fil de l'eau, via des Server-Sent Events sur un `POST`, avec un `fetch` et un `ReadableStream` côté navigateur. Trois cas méritaient une attention particulière :

- **Les marqueurs de lien coupés en deux** entre deux morceaux (`[[lien:cl` … `e-api]]`). Une fonction `visibleText` retient tout marqueur incomplet. Le texte affiché ne fait donc que s'allonger : il ne clignote jamais et ne se réécrit pas. Un test unitaire le vérifie.
- **Le client qui ferme le chat** pendant la génération. Un `AbortController` lié à `res.on("close")` coupe l'appel au modèle, pour ne pas payer une réponse que personne ne lira.
- **Le proxy nginx** : l'en-tête `X-Accel-Buffering: no` l'empêche de retenir le flux.

---

## Sécurité : une IA publique est une surface d'attaque

| Risque | Parade |
|---|---|
| **Injection de prompt** (« ignore tes consignes… ») | Question et articles échappés (`<` → `&lt;`) avant d'être placés entre balises : impossible de fermer `<question>` ou d'ouvrir un faux bloc `<system>`. Le prompt traite la question comme une donnée, jamais comme une instruction. |
| **Texte caché** | Normalisation Unicode NFKC et suppression des caractères invisibles (zéro largeur, inversion du sens d'écriture) et des caractères de contrôle. |
| **Injection SQL** | Paramètres liés uniquement. Je ne filtre pas des mots comme « SELECT » ou « DROP » : cela bloquerait des questions légitimes sans rien protéger de plus. Un test d'intégration envoie `') OR 1=1; DROP TABLE …` et vérifie que rien ne bouge. |
| **XSS via une réponse** | Rendu en texte brut, jamais de `v-html`. |
| **Hallucination de tarif ou de procédure** | Le prompt interdit d'inventer frais, délais ou endpoints. Une information manquante renvoie vers le contact. |
| **Ingénierie sociale** | L'assistant ne demande jamais de mot de passe, de code PIN, d'OTP ni de clé API. Il ne peut faire aucune action : il ne fait que rédiger du texte. |
| **Abus et coût** | 20 questions / 10 min par compte, 40 / 10 min par IP pour les visiteurs. |

**L'anecdote du limiteur.** En comptant les visiteurs par IP, j'ai découvert un bug qui existait déjà dans l'application. Avec express-rate-limit v8, `ipKeyGenerator` attend une **adresse IP**. Le code lui passait la **requête** entière. La clé de limitation valait donc `"[object Object]"` pour tout le monde : un seul compteur global au lieu d'un compteur par client. Le correctif tient en une ligne, mais il touchait aussi la limite d'envoi des e-mails d'authentification. C'est un bon rappel : lire le contrat d'une API plutôt que deviner sa signature.

---

## Le prompt : faire parler un conseiller, pas un moteur de recherche

Les premières réponses commençaient par *« D'après les articles de notre base… »*. C'est exact techniquement, mais cela sonne comme un robot. Interdire ces mots dans le prompt système n'a pas suffi : un petit modèle suit moins bien une consigne éloignée du texte qu'il traite.

Ce qui a fonctionné :

1. une section dédiée au **ton**, avec une liste de mots interdits (*article, document, source, base*) et des **exemples à éviter / corrects** ;
2. un **rappel court placé juste après la question**, dans le dernier message utilisateur. Il corrige aussi l'effet des anciennes réponses mal formulées encore présentes dans l'historique.

Leçon retenue : avec un petit modèle, **la position d'une consigne compte autant que sa formulation**.

---

## Piloter l'assistant : la boucle d'amélioration

Un RAG ne vaut que par sa base de connaissances. L'interface admin sert donc à faire tourner une boucle :

```
  Questions clients ──► « Sans article » ──► « Écrire l'article » ──► base enrichie
         ▲                                   (titre pré-rempli)            │
         └──────────── avis 👍 / 👎 ◄──── réponses meilleures ◄──────────────┘
```

- **Conversations** : volume, taux de satisfaction (calculé sur les avis 👍 / 👎 des clients), part de questions sans article, **tokens réellement consommés** (lus dans `response.usage` et enregistrés pour chaque réponse). Chaque conversation s'ouvre en détail avec les articles utilisés, les liens proposés et le coût.
- **Sans article** : les questions pour lesquelles la recherche n'a rien trouvé. C'est la liste des articles à écrire. Un clic ouvre l'éditeur avec la question déjà en titre.
- **Articles** : gestion de la base (création, publication, catégories).

## Les détails qui font l'expérience

- **Une invitation, pas seulement une icône** : une pilule « Posez-moi une question · En ligne · réponse immédiate ». Une carte de bienvenue propose 3 questions adaptées à la page (les questions changent entre le site public et l'espace marchand).
- **Performance** : le chat est chargé à la demande et préchargé quand le navigateur est inactif ou au survol du bouton. Il ne pèse rien au premier affichage.
- **Continuité** : un visiteur reçoit un identifiant anonyme. À sa connexion, ses conversations passent automatiquement sur son compte.
- **Accessibilité** : `prefers-reduced-motion` respecté, boutons d'avis avec `aria-pressed`, noms accessibles sur les panneaux, navigation au clavier.
- **Absent là où il gênerait** : le bouton est masqué sur la page de paiement, pour ne pas distraire au moment de payer.

---

## Qualité et tests

| Niveau | Outil | Couverture |
|---|---|---|
| Unitaire | `node:test` | Nettoyage anti-injection, extraction des liens, filtrage du texte en streaming, cas de refus du modèle, tarifs en direct |
| Intégration | Supertest + MySQL 8 jetable (Docker) | Recherche FULLTEXT, propriété des conversations, flux SSE, avis, rattachement à la connexion, limite par IP (la 41ᵉ requête reçoit un 429), statistiques admin, tentative d'injection SQL |
| Bout en bout | Playwright + faux backend capable d'émettre du SSE | Streaming visible, liens, avis, reprise d'une conversation, erreurs et 429, carte de bienvenue, page de paiement, écrans admin |

La suite backend (116 tests unitaires, 74 tests d'intégration) passe au complet avec l'assistant, et **10 scénarios e2e** lui sont dédiés. Aucun test n'appelle le vrai modèle : le SDK est simulé, ce qui rend la suite rapide, déterministe et gratuite en CI.

---

## Ce que j'en retiens

- **La sobriété est un choix d'architecture.** Un index FULLTEXT bien nourri vaut mieux qu'une base vectorielle mal alimentée. On ajoute de la complexité quand les données la réclament.
- **Le modèle rédige, le code décide.** Prix, liens, droits d'accès et limites sont fixés par le backend. Le modèle ne fait que mettre en mots.
- **Sans mesure, pas de pilotage.** Tokens, avis et questions sans réponse transforment un « chatbot » en produit qu'on peut améliorer semaine après semaine.
- **Une IA publique se sécurise comme un formulaire public**, plus l'injection de prompt : nettoyage, échappement, limites de débit, et aucun pouvoir d'action.

## Pistes suivantes

- Recherche hybride (FULLTEXT + embeddings) si le taux « sans article » plafonne.
- Retrait des mots vides français avant la recherche.
- Limiteur partagé via Redis pour le passage à plusieurs instances.
- Conversion des tokens en coût réel dans le tableau de bord.
