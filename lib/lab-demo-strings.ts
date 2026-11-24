/**
 * Interface strings of the Lab demos (components/lab-demos/), exposed as `getDictionary(lang).labDemos`.
 * Plain strings only: these objects are passed to client components.
 * Every demo says what is simulated: nothing here may read as a fact about the real platform
 * beyond what data/lab.ts already states.
 */

const fr = {
  fromNote: "Tirée de la note",
  simulated: "Ce qui est simulé",
  reset: "Recommencer",
  copy: "Copier",
  copied: "Copié",
  guideTitle: "À essayer",
  backToNote: "Retour à la note",
  noteDemosTitle: "Les démos",
  noteDemosIntro: "Chaque démo a sa page\u00a0: un schéma expliqué, puis la démo à manipuler dans votre navigateur. Rien ne peut casser.",
  seeDemos: "Voir les démos",
  demoOne: "démo interactive",
  demoMany: "démos interactives",
  schemaTitle: "Le schéma",
  readTitle: "Comment le lire",
  playTitle: "À vous de jouer",
  playIntro: "La démo reprend le schéma ci-dessus. Suivez la liste ou explorez librement.",
  aboutTitle: "Pour aller plus loin",
  openDemo: "Ouvrir la démo",
  prevDemo: "Démo précédente",
  nextDemo: "Démo suivante",
  demoMeta: "Démo interactive du Lab de Claude Tsiangana",
  doneLabel: "fait",
  termsTitle: "Les mots utilisés",
  whyLabel: "Pourquoi cette démo",
  of: "sur",
  techLabel: "Technologies\u00a0:",

  fleet: {
    diagram: {
      "intro": "Qui parle à qui. Les ordres partent toujours de l'API vers les agents\u00a0; les serveurs VPN ne se parlent jamais entre eux.",
      "d": {
        "admin": "Administrateur",
        "backoffice": "Backoffice",
        "backofficeDetail": "crée les serveurs",
        "api": "API centrale",
        "apiDetail": "comptes, accès, adresses IP",
        "link": "gRPC, TLS et HMAC",
        "parallel": "en parallèle",
        "server": "Serveur VPN",
        "agent": "Agent",
        "systemd": "systemd",
        "wireguard": "WireGuard",
        "devices": "appareils des utilisateurs"
      },
      "legend": [
        {
          "term": "Backoffice",
          "def": "L'écran où l'administrateur crée un serveur. Il y copie la commande d'installation de l'agent."
        },
        {
          "term": "API centrale",
          "def": "Elle garde la configuration de référence (comptes, accès, adresses) et l'envoie aux agents, à tous en même temps."
        },
        {
          "term": "La ligne gRPC",
          "def": "Chaque agent est relié à l'API par gRPC. Le transport est chiffré par TLS, et chaque échange est signé par HMAC."
        },
        {
          "term": "Agent et systemd",
          "def": "Sur chaque serveur, l'agent applique la configuration à WireGuard. systemd le surveille et le relance s'il plante."
        }
      ]
    },
    title: "Piloter une flotte de serveurs VPN",
    question: "La plateforme en petit\u00a0: l'API et ses agents",
    tags: "Go, gRPC, systemd",
    summary: "Ajoutez des serveurs, faites planter un agent, envoyez une configuration à toute la flotte.",
    plain: "Une API centrale pilote plusieurs serveurs VPN. Sur chaque serveur tourne un petit programme, l'agent, qui applique ce que l'API lui demande. Ici, c'est vous l'administrateur.",
    why: "Je voulais qu'ajouter un serveur prenne quelques minutes\u00a0: on le crée dans le backoffice, on lance la commande sur le VPS, et l'API enrôle l'agent toute seule. Le serveur apparaît alors dans l'application.",
    disclaimer: "Toute la flotte vit dans votre navigateur. Les délais, les noms de serveurs et les numéros de version sont inventés\u00a0; les étapes et les comportements sont ceux décrits dans les notes.",
    tries: [
      "Ajouter un serveur",
      "Faire planter un agent",
      "Envoyer une configuration à toute la flotte",
      "Publier une nouvelle version de l'API, puis mettre un agent à jour"
    ],
    terms: [
      {
        "term": "API",
        "def": "Le programme central\u00a0: il gère les comptes, les accès et les adresses, et donne ses ordres aux agents."
      },
      {
        "term": "Agent",
        "def": "Le programme installé sur chaque serveur VPN. Il configure WireGuard pour le compte de l'API."
      },
      {
        "term": "Enrôlement",
        "def": "Le moment où l'API se connecte à un nouvel agent et l'ajoute à la flotte."
      },
      {
        "term": "En parallèle",
        "def": "L'API parle à tous les agents en même temps (des goroutines, en Go), pas l'un après l'autre."
      }
    ],
    api: "API centrale",
    version: "Version",
    config: "Configuration n°",
    push: "Envoyer une configuration",
    pushing: "Envoi en cours",
    parallel: "Les agents en ligne la reçoivent en parallèle.",
    updateApi: "Publier une nouvelle version de l'API",
    addTitle: "Ajouter un serveur",
    serverName: "Nom du serveur",
    create: "Créer le serveur",
    max: "Six serveurs au plus dans cette démo.",
    nameTaken: "Ce nom est déjà pris.",
    phases: [
      "Commande lancée sur le VPS",
      "Paquet installé",
      "Enrôlé par l'API"
    ],
    online: "En ligne",
    down: "Agent arrêté",
    restarting: "Relancé par systemd",
    receiving: "Reçoit la configuration",
    updating: "Mise à jour",
    behind: "en retard",
    outdated: "Version différente de l'API",
    crash: "Simuler un crash",
    rerun: "Relancer la commande",
    remove: "Retirer",
    empty: "Aucun serveur\u00a0: ajoutez-en un.",
    journal: "Journal",
    fleetLabel: "Serveurs VPN",
    log: {
      "created": "créé dans le backoffice",
      "installed": "paquet installé",
      "enrolled": "enrôlé par l'API, en ligne",
      "crashed": "l'agent s'est arrêté",
      "restarted": "agent relancé par systemd",
      "push": "configuration envoyée",
      "applied": "configuration appliquée",
      "api": "nouvelle version de l'API",
      "updated": "agent mis à jour",
      "removed": "retiré de la flotte"
    },
  },

  packaging: {
    title: "Avant et après\u00a0: de Docker au paquet Linux",
    question: "Ce qui change sur le serveur",
    tags: "Docker, nfpm, systemd, apt et dnf",
    summary: "Le même agent, installé de deux façons.",
    plain: "Le même agent, installé de deux façons. Avant, il tournait dans un conteneur Docker. Après, c'est un paquet Linux classique. Comparez ce que l'administrateur doit faire, et ce qui tourne ensuite sur le serveur.",
    why: "Docker marchait, mais il fallait l'installer, écrire un compose et régler les droits réseau du conteneur, tout ça pour un simple binaire Go. J'ai voulu que l'agent s'installe comme n'importe quel logiciel Linux.",
    disclaimer: "Les deux installations sont rejouées dans votre navigateur, rien n'est installé. Les étapes viennent de la note\u00a0; les noms de fichiers et de service sont simplifiés.",
    tries: [
      "Faire l'installation avec Docker",
      "Faire l'installation avec le paquet",
      "Regarder ce qui tourne sur le serveur dans les deux cas"
    ],
    terms: [
      {
        "term": "Docker",
        "def": "Un outil qui fait tourner un programme dans un conteneur isolé. Il faut d'abord l'installer sur le serveur."
      },
      {
        "term": "Compose",
        "def": "Un fichier qui décrit comment lancer un conteneur\u00a0: image, réseau, droits."
      },
      {
        "term": "nfpm",
        "def": "L'outil qui fabrique les paquets .deb et .rpm à partir du binaire Go."
      },
      {
        "term": "systemd",
        "def": "Le gestionnaire de services de Linux. Il démarre l'agent et le relance s'il plante."
      }
    ],
    mode: "Installation",
    before: "Avant\u00a0: Docker",
    after: "Après\u00a0: paquet Linux",
    todoTitle: "À faire sur le serveur",
    serverTitle: "Ce qui tourne sur le serveur",
    compare: "Comparer les deux serveurs",
    next: "Faire l'étape suivante",
    installed: "L'agent tourne.",
    stepOne: "étape",
    stepMany: "étapes",
    stepsBefore: [
      "Installer Docker",
      "Écrire le fichier compose",
      "Régler les droits réseau du conteneur",
      "Lancer le conteneur de l'agent"
    ],
    stepsAfter: [
      "Lancer la commande copiée dans le backoffice"
    ],
    afterDetail: "La commande détecte le système, télécharge et vérifie le paquet, l'installe avec apt ou dnf, puis démarre le service.",
    empty: "Rien pour l'instant.",
    layers: {
      "vps": "Serveur VPN",
      "docker": "Docker",
      "compose": "fichier compose",
      "container": "Conteneur",
      "rights": "droits réseau réglés",
      "agent": "Agent",
      "agentDocker": "binaire Go",
      "agentPackage": "service systemd",
      "deps": "wireguard-tools, iptables, iproute2",
      "depsLabel": "installées par le paquet"
    },
    outcomesTitle: "Ce que ça change",
    outcomes: [
      "Plus besoin de Docker sur les serveurs VPN.",
      "systemd redémarre l'agent en cas de crash, et ses logs sont dans journalctl.",
      "Relancer la commande met l'agent à jour.",
      "Ajouter un serveur prend quelques minutes."
    ],
    diagram: {
      "intro": "À gauche, l'agent dans Docker\u00a0: trois couches à installer et à régler avant qu'il tourne. À droite, le paquet\u00a0: apt ou dnf installe l'agent, son service et ses dépendances en une fois.",
      "d": {
        "before": "Avant\u00a0: dans Docker",
        "after": "Après\u00a0: un paquet Linux",
        "vps": "Serveur VPN",
        "docker": "Docker",
        "dockerDetail": "à installer",
        "compose": "Fichier compose",
        "composeDetail": "à écrire",
        "container": "Conteneur",
        "containerDetail": "droits réseau à régler",
        "agent": "Agent",
        "agentDetail": "binaire Go",
        "wireguard": "WireGuard",
        "manager": "apt ou dnf",
        "package": "Paquet .deb ou .rpm",
        "contents": [
          "binaire de l'agent",
          "service systemd",
          "script de configuration"
        ],
        "deps": "dépendances installées avec",
        "depsList": "wireguard-tools, iptables, iproute2",
        "systemd": "systemd lance l'agent"
      },
      "legend": [
        {
          "term": "Avant\u00a0: trois couches",
          "def": "Docker à installer, un fichier compose à écrire, des droits réseau à régler sur le conteneur. Tout ça pour faire tourner un seul binaire Go."
        },
        {
          "term": "Après\u00a0: un paquet",
          "def": "Le paquet, construit avec nfpm en amd64 et arm64, contient le binaire, son service systemd et un script de configuration."
        },
        {
          "term": "Les dépendances",
          "def": "Elles sont déclarées dans le paquet\u00a0: apt ou dnf installe wireguard-tools, iptables et iproute2 tout seul."
        },
        {
          "term": "systemd",
          "def": "Il démarre l'agent et le relance en cas de crash. Les logs de l'agent sont dans journalctl."
        }
      ]
    },
  },

  install: {
    diagram: {
      "intro": "La commande copiée dans le backoffice déroule quatre étapes, toujours dans cet ordre. Si l'empreinte du paquet ne correspond pas, tout s'arrête avant l'installation.",
      "d": {
        "backoffice": "Backoffice",
        "backofficeDetail": "on copie la commande",
        "vps": "Sur le VPS",
        "api": "API",
        "apiDetail": "sert les paquets et SHA256SUMS en HTTPS",
        "steps": [
          "Détecter",
          "Télécharger et vérifier",
          "Installer",
          "Démarrer"
        ],
        "details": [
          "apt ou dnf, amd64 ou arm64",
          "empreinte SHA-256 comparée",
          "le gestionnaire ajoute les dépendances",
          "wg0 configurée, service systemd lancé"
        ],
        "stop": "Empreinte différente\u00a0: arrêt, rien n'est installé",
        "enroll": "L'API enrôle l'agent, le serveur apparaît"
      },
      "legend": [
        {
          "term": "Détecter",
          "def": "La commande lit la distribution pour choisir apt ou dnf, et l'architecture pour choisir le bon paquet."
        },
        {
          "term": "Télécharger et vérifier",
          "def": "Le paquet vient de l'API en HTTPS. Son empreinte SHA-256 est comparée à celle du fichier SHA256SUMS."
        },
        {
          "term": "Installer",
          "def": "Le gestionnaire de paquets du système installe l'agent et ce dont il a besoin\u00a0: wireguard-tools, iptables, iproute2."
        },
        {
          "term": "Démarrer",
          "def": "L'interface wg0 est configurée et le service systemd démarre. L'API peut alors enrôler l'agent."
        }
      ]
    },
    question: "De la commande au service qui tourne",
    plain: "Pour ajouter un serveur VPN, l'administrateur copie une commande depuis le backoffice et la lance sur le serveur. Cette commande fait quatre choses, dans l'ordre. Lancez-la et regardez chaque étape se faire.",
    why: "Avant, l'agent tournait dans un conteneur Docker. Ça marchait, mais il fallait installer Docker, écrire un compose et régler les droits réseau pour un simple binaire Go. J'en ai fait un vrai paquet Linux.",
    tries: [
      "Lancer l'installation jusqu'au bout",
      "Abîmer le paquet et voir l'installation s'arrêter",
      "Changer de distribution ou d'architecture, et comparer le nom du paquet"
    ],
    terms: [
      {
        "term": "Paquet .deb / .rpm",
        "def": "Le format d'installation de Debian et Ubuntu (.deb) ou de RHEL et Fedora (.rpm). Il contient le programme et la liste de ce dont il a besoin."
      },
      {
        "term": "Empreinte SHA-256",
        "def": "Une suite de 64 caractères calculée à partir du fichier. Si un seul octet change, l'empreinte change complètement\u00a0: c'est ce qui prouve que le paquet est intact."
      },
      {
        "term": "amd64 / arm64",
        "def": "Les deux familles de processeurs des serveurs\u00a0: Intel et AMD d'un côté, ARM de l'autre. Chaque famille a son paquet."
      },
      {
        "term": "systemd",
        "def": "Le gestionnaire de services de Linux. Il démarre l'agent et le relance s'il plante."
      }
    ],
    title: "Installer l'agent sur un serveur",
    tags: "SHA-256, apt et dnf, systemd",
    retryClean: "Relancer avec un paquet intact",
    running: "En cours",
    summary:
      "La commande du backoffice, rejouée étape par étape\u00a0: détection du système, vérification de l'empreinte, installation, démarrage.",
    disclaimer:
      "Rien n'est installé. Le paquet est un fichier factice créé dans votre navigateur, mais son empreinte SHA-256 est vraiment calculée. Les noms de fichiers et de service sont simplifiés.",
    distro: "Distribution",
    arch: "Architecture",
    corrupt: "Abîmer le paquet pendant le téléchargement",
    run: "Lancer l'installation",
    steps: [
      "Détecter la distribution et l'architecture",
      "Télécharger le paquet et vérifier son empreinte SHA-256",
      "Installer avec le gestionnaire de paquets",
      "Configurer wg0 et démarrer le service",
    ],
    manager: "Gestionnaire de paquets",
    package: "Paquet",
    expected: "Attendue (SHA256SUMS)",
    computed: "Calculée",
    match: "Les empreintes sont identiques.",
    mismatch: "Les empreintes ne correspondent pas\u00a0: la démo s'arrête ici, rien n'est installé.",
    deps: "Dépendances installées par le paquet",
    interface: "Interface wg0 configurée",
    service: "Service démarré, redémarré par systemd en cas de crash",
    enrolled: "L'API se connecte à l'agent et l'enrôle\u00a0: le serveur apparaît dans l'application.",
    stepsLabel: "Étapes de l'installation",
  },

  ipam: {
    diagram: {
      "intro": "Une plage d'adresses, c'est une rangée de cases. Ici un petit réseau de 16 adresses, 10.8.0.0/28\u00a0: deux cases sont réservées, le serveur prend la première, et les appareils reçoivent les suivantes dans l'ordre.",
      "d": {
        "network": "réseau",
        "broadcast": "diffusion",
        "server": "serveur",
        "freed": "libérée",
        "next": "prochain appareil"
      },
      "legend": [
        {
          "term": "Réservées",
          "def": "La première adresse désigne le réseau, la dernière sert à la diffusion. Elles ne sont jamais données à un appareil."
        },
        {
          "term": "Serveur",
          "def": "Le serveur VPN prend toujours la première adresse utilisable, ici 10.8.0.1."
        },
        {
          "term": "Appareils",
          "def": "Chaque appareil connecté reçoit une adresse. Dans la démo, il reçoit le même numéro en IPv6\u00a0: 10.8.0.2 va avec fd00:8::2."
        },
        {
          "term": "Libérée",
          "def": "Quand un appareil part, son adresse redevient libre. Comme c'est la plus petite case libre, le prochain appareil la reçoit."
        }
      ]
    },
    question: "Une adresse pour chaque appareil",
    plain: "Chaque appareil qui se connecte au VPN a besoin de sa propre adresse dans le réseau privé, en IPv4 et en IPv6. La plateforme les attribue toute seule. Ajoutez et retirez des appareils pour voir comment.",
    why: "La plateforme gère l'attribution automatique des adresses IP, IPv6 comprise. Je voulais montrer le principe sans demander à personne de lire un fichier de configuration.",
    tries: [
      "Ajouter un appareil",
      "Retirer un appareil puis en ajouter un\u00a0: son adresse est réutilisée",
      "Changer de réseau, par exemple 10.8.0.0/29, et voir la place manquer"
    ],
    terms: [
      {
        "term": "10.8.0.0/24",
        "def": "Une plage d'adresses. Le /24 dit combien d'adresses elle contient\u00a0: ici 254 utilisables."
      },
      {
        "term": "IPv6",
        "def": "La version récente des adresses IP, beaucoup plus longue. Chaque appareil reçoit aussi une adresse de ce type."
      },
      {
        "term": "wg0.conf",
        "def": "Le fichier de configuration de WireGuard sur le serveur\u00a0: il liste chaque appareil, sa clé et son adresse."
      }
    ],
    title: "Attribuer les adresses IP",
    tags: "IPv4, IPv6, WireGuard",
    gets: "reçoit",
    reused: "adresse réutilisée",
    released: "libère",
    summary:
      "Chaque appareil reçoit une adresse IPv4 et une adresse IPv6 libres, et la configuration wg0 du serveur suit.",
    disclaimer:
      "Le principe, calculé dans votre navigateur\u00a0: la première adresse libre est attribuée, une adresse libérée est réutilisée. Les clés affichées sont fictives.",
    v4: "Réseau IPv4",
    v6: "Préfixe IPv6",
    v4Error: "Un réseau IPv4 entre /16 et /30, par exemple 10.8.0.0/24.",
    v6Error: "Un préfixe IPv6 entre /48 et /120, par exemple fd00:8::/64.",
    tooSmall: "Ce réseau est trop petit pour les appareils déjà ajoutés.",
    add: "Ajouter un appareil",
    full: "Le réseau est plein.",
    remove: "Retirer",
    server: "Serveur",
    peerPrefix: "appareil",
    used: "adresses utilisées sur",
    config: "wg0.conf côté serveur",
    serverKey: "serveur",
    peersLabel: "Appareils connectés",
  },

  proto: {
    diagram: {
      "intro": "Le même champ, écrit des deux façons. En JSON, le nom du champ voyage en texte dans chaque message. En Protobuf, il est remplacé par un seul octet, le tag\u00a0: le message passe de 34 à 23 octets pour ce seul champ.",
      "d": {
        "name": "nom du champ",
        "value": "valeur",
        "syntax": "guillemets et deux-points",
        "tag": "tag",
        "length": "longueur",
        "bytes": "octets",
        "byte": "octet"
      },
      "legend": [
        {
          "term": "Tag (1a)",
          "def": "Un octet qui dit quel champ suit et comment le lire. 1a en hexadécimal vaut 26, soit le champ n° 3 du schéma (endpoint = 3) et le type «\u00a0longueur puis valeur\u00a0»."
        },
        {
          "term": "Longueur (15)",
          "def": "15 en hexadécimal vaut 21\u00a0: la valeur qui suit fait 21 octets."
        },
        {
          "term": "Valeur",
          "def": "Le texte lui-même, identique dans les deux formats. Toute l'économie vient du nom du champ et de la syntaxe."
        },
        {
          "term": "Le schéma .proto",
          "def": "C'est lui qui fait le lien entre le numéro 3 et le nom endpoint. L'API et l'agent le partagent, d'où le contrat typé."
        }
      ]
    },
    question: "Pourquoi les messages sont plus légers",
    plain: "L'API et les agents s'envoient des messages. En JSON, chaque message répète le nom de ses champs en texte. Protobuf remplace ces noms par un numéro d'un octet. Modifiez le message et comparez le nombre d'octets.",
    why: "J'ai choisi gRPC, et donc Protobuf, entre l'API et les agents\u00a0: des messages plus légers que du REST/JSON, et un contrat typé qui signale un écart de format dès la compilation.",
    tries: [
      "Modifier une valeur et regarder les tailles changer",
      "Déclarer la clé en bytes",
      "Toucher un champ du tableau pour retrouver ses octets"
    ],
    terms: [
      {
        "term": "JSON",
        "def": "Un format texte lisible par un humain, très utilisé par les API web."
      },
      {
        "term": "Protobuf",
        "def": "Protocol Buffers\u00a0: un format binaire, compact, décrit par un schéma."
      },
      {
        "term": "Octet",
        "def": "L'unité de taille d'un message\u00a0: 8 bits, écrits ici en deux caractères hexadécimaux, comme 0a."
      },
      {
        "term": "Tag",
        "def": "Le premier octet d'un champ Protobuf\u00a0: il dit de quel champ il s'agit et comment le lire."
      }
    ],
    title: "Le même message en JSON et en Protobuf",
    tags: "Protocol Buffers, JSON",
    summary:
      "Modifiez la configuration d'un appareil\u00a0: les deux encodages sont recalculés octet par octet.",
    disclaimer:
      "Le message est un exemple écrit pour la démo, pas le contrat de la plateforme. L'encodage Protobuf, lui, est réel et calculé en direct.",
    schema: "Schéma d'exemple",
    publicKey: "Clé publique (base64)",
    newKey: "Nouvelle clé",
    allowedIps: "Adresses autorisées, séparées par des virgules",
    endpoint: "Point d'accès",
    keepalive: "Keepalive (secondes)",
    asBytes: "Déclarer la clé en bytes plutôt qu'en string",
    asBytesHint: "32 octets bruts au lieu des 44 caractères base64.",
    badKey: "Clé base64 invalide\u00a0: elle est encodée comme du texte.",
    json: "JSON",
    protobuf: "Protobuf",
    bytes: "octets",
    percent: "\u00a0%",
    smaller: "de moins que JSON",
    field: "Champ",
    tag: "Tag",
    length: "Longueur",
    value: "Valeur",
    breakdown: "Détail des octets Protobuf",
    hover: "Survolez ou touchez un champ, ou un octet, pour les relier. Le tag est en gras, la longueur en gris.",
  },

  grpc: {
    diagram: {
      "intro": "Chaque colonne est une forme d'appel. À gauche l'API, à droite l'agent. Chaque flèche est un message, et le temps s'écoule de haut en bas.",
      "d": {
        "api": "API",
        "agent": "Agent",
        "end": "fin"
      },
      "legend": [
        {
          "term": "Flèche vers la droite",
          "def": "Un message de l'API vers l'agent. C'est toujours l'API qui ouvre l'appel."
        },
        {
          "term": "Flèche vers la gauche",
          "def": "Un message de l'agent vers l'API."
        },
        {
          "term": "Fin",
          "def": "Le côté qui envoyait un flux a terminé. L'appel se ferme quand les deux côtés ont fini."
        },
        {
          "term": "Pourquoi les flux",
          "def": "Un flux garde l'appel ouvert\u00a0: pas besoin d'en recréer un pour chaque message. Dans la plateforme, c'est ce qui sert à synchroniser les configurations VPN."
        }
      ]
    },
    question: "Comment l'API parle aux agents",
    plain: "gRPC permet quatre façons d'échanger\u00a0: une question et une réponse, ou des flux de messages dans un sens, dans l'autre, ou dans les deux. Choisissez une forme et envoyez les messages un par un.",
    why: "Le streaming de gRPC sert à synchroniser les configurations VPN entre l'API et les agents. Ces quatre formes d'appel sont la raison principale de ce choix.",
    tries: [
      "Aller au bout d'un appel unaire",
      "Aller au bout d'un appel en flux",
      "Essayer les quatre formes"
    ],
    terms: [
      {
        "term": "RPC",
        "def": "Appel de procédure à distance\u00a0: l'API appelle une fonction qui s'exécute sur l'agent."
      },
      {
        "term": "Flux (stream)",
        "def": "Une suite de messages envoyés sur le même appel, sans en ouvrir un nouveau à chaque fois."
      },
      {
        "term": "HTTP/2",
        "def": "La version du protocole web utilisée par gRPC\u00a0: plusieurs échanges passent par une seule connexion."
      }
    ],
    title: "Les quatre formes d'appel gRPC",
    tags: "gRPC, HTTP/2, streaming",
    sendAll: "Tout envoyer",
    of: "sur",
    summary:
      "L'API appelle l'agent. Choisissez un type d'appel et envoyez les messages un par un.",
    disclaimer:
      "Contrat d'exemple écrit pour la démo\u00a0: les noms ne sont pas ceux de la plateforme. Les quatre formes d'appel sont celles de gRPC.",
    kinds: {
      unary: "Unaire",
      client: "Flux client",
      server: "Flux serveur",
      bidi: "Bidirectionnel",
    },
    explain: {
      unary: "Une requête, une réponse, comme un appel de fonction à distance.",
      client: "L'API envoie une suite de messages sur le même appel, l'agent répond une seule fois à la fin.",
      server: "Une requête, puis l'agent envoie des messages tant que l'appel reste ouvert.",
      bidi: "Les deux côtés envoient leurs messages quand ils veulent, sur une seule connexion HTTP/2.",
    },
    streamNote: "Dans la plateforme, le streaming sert à la synchronisation des configurations VPN.",
    kindLabel: "Type d'appel",
    api: "API",
    agent: "Agent",
    next: "Envoyer le message suivant",
    done: "Appel terminé.",
    endOfStream: "Fin du flux",
    empty: "Aucun message pour l'instant.",
    contract: "Contrat d'exemple",
    sequenceLabel: "Messages échangés",
  },
};

export type LabDemoStrings = typeof fr;

const en: LabDemoStrings = {
  fromNote: "From the note",
  simulated: "What is simulated",
  reset: "Start again",
  copy: "Copy",
  copied: "Copied",
  guideTitle: "Things to try",
  backToNote: "Back to the note",
  noteDemosTitle: "The demos",
  noteDemosIntro: "Each demo has its own page: an explained diagram, then the demo to play with in your browser. Nothing can break.",
  seeDemos: "See the demos",
  demoOne: "interactive demo",
  demoMany: "interactive demos",
  schemaTitle: "The diagram",
  readTitle: "How to read it",
  playTitle: "Your turn",
  playIntro: "The demo follows the diagram above. Use the list or explore freely.",
  aboutTitle: "Going further",
  openDemo: "Open the demo",
  prevDemo: "Previous demo",
  nextDemo: "Next demo",
  demoMeta: "Interactive demo from Claude Tsiangana's Lab",
  doneLabel: "done",
  termsTitle: "Words used here",
  whyLabel: "Why this demo",
  of: "of",
  techLabel: "Technologies:",

  fleet: {
    diagram: {
      "intro": "Who talks to whom. Orders always go from the API to the agents; VPN servers never talk to each other.",
      "d": {
        "admin": "Admin",
        "backoffice": "Back office",
        "backofficeDetail": "creates the servers",
        "api": "Central API",
        "apiDetail": "accounts, access, IP addresses",
        "link": "gRPC, TLS and HMAC",
        "parallel": "in parallel",
        "server": "VPN server",
        "agent": "Agent",
        "systemd": "systemd",
        "wireguard": "WireGuard",
        "devices": "users' devices"
      },
      "legend": [
        {
          "term": "Back office",
          "def": "The screen where the admin creates a server. That's where the agent's install command is copied from."
        },
        {
          "term": "Central API",
          "def": "It holds the reference configuration (accounts, access, addresses) and sends it to the agents, all at the same time."
        },
        {
          "term": "The gRPC line",
          "def": "Each agent is linked to the API through gRPC. The transport is encrypted with TLS, and every exchange is signed with HMAC."
        },
        {
          "term": "Agent and systemd",
          "def": "On each server, the agent applies the configuration to WireGuard. systemd watches it and restarts it if it crashes."
        }
      ]
    },
    title: "Running a fleet of VPN servers",
    question: "The platform in miniature: the API and its agents",
    tags: "Go, gRPC, systemd",
    summary: "Add servers, crash an agent, send a configuration to the whole fleet.",
    plain: "A central API drives several VPN servers. On each server runs a small program, the agent, which applies what the API asks. Here, you are the admin.",
    why: "I wanted adding a server to take a few minutes: you create it in the back office, run the command on the VPS, and the API enrolls the agent by itself. The server then shows up in the application.",
    disclaimer: "The whole fleet lives in your browser. Delays, server names and version numbers are made up; the steps and behaviors are those described in the notes.",
    tries: [
      "Add a server",
      "Crash an agent",
      "Send a configuration to the whole fleet",
      "Release a new API version, then update an agent"
    ],
    terms: [
      {
        "term": "API",
        "def": "The central program: it manages accounts, access and addresses, and gives the agents their orders."
      },
      {
        "term": "Agent",
        "def": "The program installed on each VPN server. It configures WireGuard on the API's behalf."
      },
      {
        "term": "Enrollment",
        "def": "The moment the API connects to a new agent and adds it to the fleet."
      },
      {
        "term": "In parallel",
        "def": "The API talks to every agent at the same time (goroutines, in Go), not one after the other."
      }
    ],
    api: "Central API",
    version: "Version",
    config: "Configuration #",
    push: "Send a configuration",
    pushing: "Sending",
    parallel: "Online agents receive it in parallel.",
    updateApi: "Release a new API version",
    addTitle: "Add a server",
    serverName: "Server name",
    create: "Create the server",
    max: "Six servers at most in this demo.",
    nameTaken: "This name is already taken.",
    phases: [
      "Command run on the VPS",
      "Package installed",
      "Enrolled by the API"
    ],
    online: "Online",
    down: "Agent stopped",
    restarting: "Restarted by systemd",
    receiving: "Receiving the configuration",
    updating: "Updating",
    behind: "behind",
    outdated: "Different version from the API",
    crash: "Simulate a crash",
    rerun: "Run the command again",
    remove: "Remove",
    empty: "No servers: add one.",
    journal: "Log",
    fleetLabel: "VPN servers",
    log: {
      "created": "created in the back office",
      "installed": "package installed",
      "enrolled": "enrolled by the API, online",
      "crashed": "the agent stopped",
      "restarted": "agent restarted by systemd",
      "push": "configuration sent",
      "applied": "configuration applied",
      "api": "new API version",
      "updated": "agent updated",
      "removed": "removed from the fleet"
    },
  },

  packaging: {
    title: "Before and after: from Docker to a Linux package",
    question: "What changes on the server",
    tags: "Docker, nfpm, systemd, apt and dnf",
    summary: "The same agent, installed two ways.",
    plain: "The same agent, installed two ways. Before, it ran in a Docker container. After, it is a regular Linux package. Compare what the admin has to do, and what then runs on the server.",
    why: "Docker worked, but it meant installing it, writing a compose file and tuning the container's network rights, all for a single Go binary. I wanted the agent to install like any Linux software.",
    disclaimer: "Both installations are replayed in your browser, nothing is installed. The steps come from the note; file and service names are simplified.",
    tries: [
      "Install with Docker",
      "Install with the package",
      "Look at what runs on the server in both cases"
    ],
    terms: [
      {
        "term": "Docker",
        "def": "A tool that runs a program in an isolated container. It must be installed on the server first."
      },
      {
        "term": "Compose",
        "def": "A file that describes how to start a container: image, network, rights."
      },
      {
        "term": "nfpm",
        "def": "The tool that builds the .deb and .rpm packages from the Go binary."
      },
      {
        "term": "systemd",
        "def": "Linux's service manager. It starts the agent and restarts it if it crashes."
      }
    ],
    mode: "Installation",
    before: "Before: Docker",
    after: "After: Linux package",
    todoTitle: "To do on the server",
    serverTitle: "What runs on the server",
    compare: "Compare both servers",
    next: "Do the next step",
    installed: "The agent is running.",
    stepOne: "step",
    stepMany: "steps",
    stepsBefore: [
      "Install Docker",
      "Write the compose file",
      "Tune the container's network rights",
      "Start the agent's container"
    ],
    stepsAfter: [
      "Run the command copied from the back office"
    ],
    afterDetail: "The command detects the system, downloads and checks the package, installs it with apt or dnf, then starts the service.",
    empty: "Nothing yet.",
    layers: {
      "vps": "VPN server",
      "docker": "Docker",
      "compose": "compose file",
      "container": "Container",
      "rights": "network rights tuned",
      "agent": "Agent",
      "agentDocker": "Go binary",
      "agentPackage": "systemd service",
      "deps": "wireguard-tools, iptables, iproute2",
      "depsLabel": "installed by the package"
    },
    outcomesTitle: "What it changes",
    outcomes: [
      "No more Docker on the VPN servers.",
      "systemd restarts the agent if it crashes, and its logs are in journalctl.",
      "Running the command again updates the agent.",
      "Adding a server takes a few minutes."
    ],
    diagram: {
      "intro": "On the left, the agent in Docker: three layers to install and tune before it runs. On the right, the package: apt or dnf installs the agent, its service and its dependencies in one go.",
      "d": {
        "before": "Before: in Docker",
        "after": "After: a Linux package",
        "vps": "VPN server",
        "docker": "Docker",
        "dockerDetail": "to install",
        "compose": "Compose file",
        "composeDetail": "to write",
        "container": "Container",
        "containerDetail": "network rights to tune",
        "agent": "Agent",
        "agentDetail": "Go binary",
        "wireguard": "WireGuard",
        "manager": "apt or dnf",
        "package": ".deb or .rpm package",
        "contents": [
          "agent binary",
          "systemd service",
          "configuration script"
        ],
        "deps": "dependencies installed with it",
        "depsList": "wireguard-tools, iptables, iproute2",
        "systemd": "systemd runs the agent"
      },
      "legend": [
        {
          "term": "Before: three layers",
          "def": "Docker to install, a compose file to write, network rights to tune on the container. All that to run a single Go binary."
        },
        {
          "term": "After: one package",
          "def": "The package, built with nfpm for amd64 and arm64, holds the binary, its systemd service and a configuration script."
        },
        {
          "term": "Dependencies",
          "def": "They are declared in the package: apt or dnf installs wireguard-tools, iptables and iproute2 by itself."
        },
        {
          "term": "systemd",
          "def": "It starts the agent and restarts it if it crashes. The agent's logs are in journalctl."
        }
      ]
    },
  },

  install: {
    diagram: {
      "intro": "The command copied from the back office runs four steps, always in this order. If the package checksum does not match, everything stops before installing.",
      "d": {
        "backoffice": "Back office",
        "backofficeDetail": "copy the command",
        "vps": "On the VPS",
        "api": "API",
        "apiDetail": "serves the packages and SHA256SUMS over HTTPS",
        "steps": [
          "Detect",
          "Download and check",
          "Install",
          "Start"
        ],
        "details": [
          "apt or dnf, amd64 or arm64",
          "SHA-256 checksum compared",
          "the package manager adds the dependencies",
          "wg0 configured, systemd service started"
        ],
        "stop": "Checksum mismatch: stop, nothing installed",
        "enroll": "The API enrolls the agent, the server shows up"
      },
      "legend": [
        {
          "term": "Detect",
          "def": "The command reads the distribution to pick apt or dnf, and the architecture to pick the right package."
        },
        {
          "term": "Download and check",
          "def": "The package comes from the API over HTTPS. Its SHA-256 checksum is compared with the one in the SHA256SUMS file."
        },
        {
          "term": "Install",
          "def": "The system's package manager installs the agent and what it needs: wireguard-tools, iptables, iproute2."
        },
        {
          "term": "Start",
          "def": "The wg0 interface is configured and the systemd service starts. The API can then enroll the agent."
        }
      ]
    },
    question: "From the command to a running service",
    plain: "To add a VPN server, the admin copies a command from the back office and runs it on the server. That command does four things, in order. Run it and watch each step happen.",
    why: "The agent used to run in a Docker container. It worked, but it meant installing Docker, writing a compose file and tuning network rights for a single Go binary. I turned it into a real Linux package.",
    tries: [
      "Run the installation to the end",
      "Damage the package and watch the installation stop",
      "Switch distribution or architecture, and compare the package name"
    ],
    terms: [
      {
        "term": ".deb / .rpm package",
        "def": "The install format of Debian and Ubuntu (.deb) or RHEL and Fedora (.rpm). It holds the program and the list of what it needs."
      },
      {
        "term": "SHA-256 checksum",
        "def": "64 characters computed from the file. If a single byte changes, the checksum changes completely: that is what proves the package is intact."
      },
      {
        "term": "amd64 / arm64",
        "def": "The two processor families of servers: Intel and AMD on one side, ARM on the other. Each family has its own package."
      },
      {
        "term": "systemd",
        "def": "Linux's service manager. It starts the agent and restarts it if it crashes."
      }
    ],
    title: "Installing the agent on a server",
    tags: "SHA-256, apt and dnf, systemd",
    retryClean: "Run again with an intact package",
    running: "Running",
    summary:
      "The back-office command, replayed step by step: system detection, checksum verification, installation, start.",
    disclaimer:
      "Nothing is installed. The package is a dummy file created in your browser, but its SHA-256 checksum is really computed. File and service names are simplified.",
    distro: "Distribution",
    arch: "Architecture",
    corrupt: "Damage the package during the download",
    run: "Run the installation",
    steps: [
      "Detect the distribution and architecture",
      "Download the package and check its SHA-256 checksum",
      "Install it with the package manager",
      "Configure wg0 and start the service",
    ],
    manager: "Package manager",
    package: "Package",
    expected: "Expected (SHA256SUMS)",
    computed: "Computed",
    match: "The checksums match.",
    mismatch: "The checksums do not match: the demo stops here, nothing is installed.",
    deps: "Dependencies installed by the package",
    interface: "wg0 interface configured",
    service: "Service started, restarted by systemd if it crashes",
    enrolled: "The API connects to the agent and enrolls it: the server shows up in the application.",
    stepsLabel: "Installation steps",
  },

  ipam: {
    diagram: {
      "intro": "An address range is a row of slots. Here a small network of 16 addresses, 10.8.0.0/28: two slots are reserved, the server takes the first one, and devices get the next ones in order.",
      "d": {
        "network": "network",
        "broadcast": "broadcast",
        "server": "server",
        "freed": "freed",
        "next": "next device"
      },
      "legend": [
        {
          "term": "Reserved",
          "def": "The first address names the network, the last one is for broadcast. They are never given to a device."
        },
        {
          "term": "Server",
          "def": "The VPN server always takes the first usable address, 10.8.0.1 here."
        },
        {
          "term": "Devices",
          "def": "Each connected device gets an address. In the demo it gets the same number in IPv6: 10.8.0.2 goes with fd00:8::2."
        },
        {
          "term": "Freed",
          "def": "When a device leaves, its address becomes free again. Being the lowest free slot, it goes to the next device."
        }
      ]
    },
    question: "An address for every device",
    plain: "Every device that joins the VPN needs its own address on the private network, in IPv4 and IPv6. The platform assigns them by itself. Add and remove devices to see how.",
    why: "The platform assigns IP addresses automatically, IPv6 included. I wanted to show the principle without asking anyone to read a configuration file.",
    tries: [
      "Add a device",
      "Remove a device, then add one: its address is reused",
      "Change the network, for example to 10.8.0.0/29, and watch it run out of room"
    ],
    terms: [
      {
        "term": "10.8.0.0/24",
        "def": "A range of addresses. The /24 says how many it holds: 254 usable here."
      },
      {
        "term": "IPv6",
        "def": "The newer, much longer version of IP addresses. Each device gets one of these too."
      },
      {
        "term": "wg0.conf",
        "def": "WireGuard's configuration file on the server: it lists every device, its key and its address."
      }
    ],
    title: "Assigning IP addresses",
    tags: "IPv4, IPv6, WireGuard",
    gets: "gets",
    reused: "address reused",
    released: "releases",
    summary: "Each device gets a free IPv4 and a free IPv6 address, and the server's wg0 configuration follows.",
    disclaimer:
      "The principle, computed in your browser: the first free address is assigned, a released address is reused. The keys shown are made up.",
    v4: "IPv4 network",
    v6: "IPv6 prefix",
    v4Error: "An IPv4 network between /16 and /30, for example 10.8.0.0/24.",
    v6Error: "An IPv6 prefix between /48 and /120, for example fd00:8::/64.",
    tooSmall: "This network is too small for the devices already added.",
    add: "Add a device",
    full: "The network is full.",
    remove: "Remove",
    server: "Server",
    peerPrefix: "device",
    used: "addresses used out of",
    config: "Server-side wg0.conf",
    serverKey: "server",
    peersLabel: "Connected devices",
  },

  proto: {
    diagram: {
      "intro": "The same field, written both ways. In JSON, the field name travels as text in every message. In Protobuf it is replaced by a single byte, the tag: this one field goes from 34 to 23 bytes.",
      "d": {
        "name": "field name",
        "value": "value",
        "syntax": "quotes and colon",
        "tag": "tag",
        "length": "length",
        "bytes": "bytes",
        "byte": "byte"
      },
      "legend": [
        {
          "term": "Tag (1a)",
          "def": "One byte that says which field follows and how to read it. 1a in hexadecimal is 26: field number 3 of the schema (endpoint = 3) with the \"length then value\" type."
        },
        {
          "term": "Length (15)",
          "def": "15 in hexadecimal is 21: the value that follows is 21 bytes long."
        },
        {
          "term": "Value",
          "def": "The text itself, the same in both formats. All the saving comes from the field name and the syntax."
        },
        {
          "term": "The .proto schema",
          "def": "It maps number 3 to the name endpoint. The API and the agent share it, hence the typed contract."
        }
      ]
    },
    question: "Why the messages are lighter",
    plain: "The API and the agents send each other messages. In JSON, every message repeats its field names as text. Protobuf replaces those names with a one-byte number. Edit the message and compare the byte counts.",
    why: "I chose gRPC, and so Protobuf, between the API and the agents: lighter messages than REST/JSON, and a typed contract that flags a format mismatch at compile time.",
    tries: [
      "Edit a value and watch the sizes change",
      "Declare the key as bytes",
      "Tap a field in the table to find its bytes"
    ],
    terms: [
      {
        "term": "JSON",
        "def": "A text format a human can read, widely used by web APIs."
      },
      {
        "term": "Protobuf",
        "def": "Protocol Buffers: a compact binary format, described by a schema."
      },
      {
        "term": "Byte",
        "def": "The unit of a message's size: 8 bits, written here as two hexadecimal characters, like 0a."
      },
      {
        "term": "Tag",
        "def": "The first byte of a Protobuf field: it says which field it is and how to read it."
      }
    ],
    title: "The same message in JSON and Protobuf",
    tags: "Protocol Buffers, JSON",
    summary: "Edit a device's configuration: both encodings are recomputed byte by byte.",
    disclaimer:
      "The message is an example written for the demo, not the platform's contract. The Protobuf encoding is real and computed live.",
    schema: "Example schema",
    publicKey: "Public key (base64)",
    newKey: "New key",
    allowedIps: "Allowed IPs, comma separated",
    endpoint: "Endpoint",
    keepalive: "Keepalive (seconds)",
    asBytes: "Declare the key as bytes instead of string",
    asBytesHint: "32 raw bytes instead of 44 base64 characters.",
    badKey: "Invalid base64 key: it is encoded as text.",
    json: "JSON",
    protobuf: "Protobuf",
    bytes: "bytes",
    percent: "%",
    smaller: "smaller than JSON",
    field: "Field",
    tag: "Tag",
    length: "Length",
    value: "Value",
    breakdown: "Protobuf bytes in detail",
    hover: "Hover or tap a field, or a byte, to link them. The tag is in bold, the length in grey.",
  },

  grpc: {
    diagram: {
      "intro": "Each column is one kind of call. The API on the left, the agent on the right. Each arrow is a message, and time flows from top to bottom.",
      "d": {
        "api": "API",
        "agent": "Agent",
        "end": "end"
      },
      "legend": [
        {
          "term": "Arrow to the right",
          "def": "A message from the API to the agent. The API always opens the call."
        },
        {
          "term": "Arrow to the left",
          "def": "A message from the agent to the API."
        },
        {
          "term": "End",
          "def": "The side that was streaming is done. The call closes once both sides are done."
        },
        {
          "term": "Why streams",
          "def": "A stream keeps the call open: no need to open a new one for every message. In the platform, that is what synchronizes the VPN configurations."
        }
      ]
    },
    question: "How the API talks to the agents",
    plain: "gRPC allows four ways to exchange: one question and one answer, or streams of messages one way, the other way, or both. Pick a kind and send the messages one at a time.",
    why: "gRPC streaming is used to synchronize the VPN configurations between the API and the agents. These four kinds of call are the main reason for that choice.",
    tries: [
      "Finish a unary call",
      "Finish a streaming call",
      "Try all four kinds"
    ],
    terms: [
      {
        "term": "RPC",
        "def": "Remote procedure call: the API calls a function that runs on the agent."
      },
      {
        "term": "Stream",
        "def": "A series of messages sent over the same call, without opening a new one each time."
      },
      {
        "term": "HTTP/2",
        "def": "The version of the web protocol gRPC uses: many exchanges share a single connection."
      }
    ],
    title: "The four kinds of gRPC call",
    tags: "gRPC, HTTP/2, streaming",
    sendAll: "Send all",
    of: "of",
    summary: "The API calls the agent. Pick a kind of call and send the messages one at a time.",
    disclaimer:
      "Example contract written for the demo: the names are not the platform's. The four kinds of call are gRPC's own.",
    kinds: {
      unary: "Unary",
      client: "Client stream",
      server: "Server stream",
      bidi: "Bidirectional",
    },
    explain: {
      unary: "One request, one response, like a remote function call.",
      client: "The API sends a series of messages on the same call, the agent answers once at the end.",
      server: "One request, then the agent sends messages as long as the call stays open.",
      bidi: "Both sides send messages whenever they want, over a single HTTP/2 connection.",
    },
    streamNote: "In the platform, streaming is used to synchronize the VPN configurations.",
    kindLabel: "Kind of call",
    api: "API",
    agent: "Agent",
    next: "Send the next message",
    done: "Call complete.",
    endOfStream: "End of stream",
    empty: "No messages yet.",
    contract: "Example contract",
    sequenceLabel: "Messages exchanged",
  },
};

export const labDemoStrings = { fr, en };
