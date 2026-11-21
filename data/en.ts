/**
 * English content. French data in this folder is the reference; this file only holds the
 * translated text, keyed by project slug, experience index, lab note slug, etc. Anything that is
 * not text (URLs, images, stacks, dates used for sorting) is shared and stays in the French files.
 * Keep the facts identical to the French version: translate, never add.
 */

export const profileEn = {
  role: "Fullstack developer",
  tagline: "web, mobile and API",
  summary:
    "Fullstack developer for 4 years, I design and ship web and mobile applications, from the API to production.",
  intro:
    "I design and ship complete web and mobile applications, from the interface to production, with strong expertise in robust and scalable backend development.",
  approach:
    "Before writing a feature, I put myself in the shoes of the person who will use it: what they want to get done, what could get in their way. To me, it is only finished when it actually makes their task simpler.",
  facts: {
    "En ce moment": { label: "Right now", value: "Building STOOGO, in production" },
    "Disponibilité": { label: "Availability", value: "Immediate" },
    "Mode de travail": { label: "Work mode", value: "On site, hybrid or remote" },
    "Mobilité": { label: "Location", value: "France, open to relocation" },
    "Certifications": { label: "Certifications", value: "8, including Kubernetes, Go and GitLab CI/CD" },
  } as Record<string, { label: string; value: string }>,
  background: {
    "Formation": { label: "Education", value: "Master's degree (Bac+5) in information systems" },
    "Langues": { label: "Languages", value: "French, English" },
  } as Record<string, { label: string; value: string }>,
};

type ProjectText = {
  title?: string;
  domain: string;
  client?: string;
  period?: string;
  role?: string;
  summary: string;
  context?: string;
  highlights: string[];
  /** Link labels, same order as the French links. */
  links?: string[];
  /** Image alt texts, same order as the French images. */
  images?: string[];
  architecture?: { center: string; centerDetail: string; link: string; node: string; nodeDetail: string };
};

export const projectsEn: Record<string, ProjectText> = {
  stoogo: {
    domain: "Student life",
    client: "Side project",
    period: "Since 2026",
    role: "Founder. I design, build and run the whole product in production.",
    summary: "Mobile app connecting students with each other, with a back office and built-in AI.",
    context:
      "STOOGO helps students find each other and prepare their applications. I launched the project on my own: the mobile app, the back office, the real-time backend, the deployments and production monitoring.",
    highlights: [
      "React Native mobile app: matching, profiles, real-time messaging",
      "Angular back office for administration and moderation",
      "AI: resume analysis, cover letter generation, automated applications",
      "Go backend, WebSockets, GitLab CI/CD, OTA deployments for iOS/Android",
      "Sentry monitoring and PostHog analytics",
    ],
    images: ["STOOGO app interface"],
  },
  "plateforme-vpn": {
    title: "Multi-server VPN platform",
    domain: "Networking and security",
    client: "Personal project",
    period: "Ongoing",
    role: "Design and development of the whole platform",
    summary:
      "Multi-server VPN platform built on WireGuard: a central Go API drives an agent on every VPN server.",
    context:
      "A mobile app and back office with a central API that drives a fleet of WireGuard VPN servers. On each server, an agent installed as a Linux package receives its orders from the API and applies the configuration.",
    highlights: [
      "Designed a distributed VPN architecture with a central Go API and remote agents driven over gRPC.",
      "Automated VPN server installation through Linux packages (.deb/.rpm), with secure TLS/HMAC authentication, automatic service startup and automatic synchronization of VPN configurations.",
      "Implemented multi-tenancy, access management, automatic IP assignment, IPv6 and DNS filtering.",
    ],
    images: [
      "Agent installation command on a VPN server",
      "Dashboard of the multi-server VPN platform",
      "Adding VPN servers in the platform",
    ],
    architecture: {
      center: "Central API",
      centerDetail: "Go, multi-tenant, access, IP, DNS",
      link: "gRPC, TLS/HMAC",
      node: "Agent",
      nodeDetail: "WireGuard, systemd",
    },
  },
  almamater: {
    domain: "EdTech",
    client: "Agence TILD",
    period: "2022 to 2026",
    role: "Fullstack web and mobile developer at Agence TILD",
    summary: "School management suite: CRM, ERP, student extranet and mobile app.",
    context:
      "Almamater helps schools manage their prospects, students and documents. I worked on it for nearly four years, in a Scrum team.",
    highlights: [
      "CRM and ERP modules for the schools' internal management",
      "Student extranet and mobile app: grades, timetables, documents",
      "Blockchain anchoring of diplomas to guarantee their authenticity",
      "Azure and GitLab CI/CD deployments",
    ],
    images: ["Almamater teaching module", "Almamater student extranet", "Almamater mobile app"],
  },
  openpay: {
    domain: "FinTech",
    client: "OPENPAY CG",
    period: "Since 2019",
    role: "Co-founder and fullstack developer at OpenPay CG",
    summary: "Mobile payment aggregator for individuals, merchants and partners in Central Africa.",
    highlights: [
      "Customer portal, partner area and admin console",
      "Documented REST APIs for partner integration",
      "API key authentication",
      "Real-time transactions with callback URLs",
      "Docker/Nginx deployment, GitLab CI/CD",
    ],
    images: ["Home page", "Partner area", "Admin console"],
  },
  "orient-ex": {
    domain: "Mentoring",
    client: "Orient'Ex (non-profit)",
    period: "2025 to 2026",
    role: "Fullstack developer, Vue.js, Nuxt and Node.js",
    summary: "Mentoring platform connecting volunteer mentors with young people looking for guidance.",
    highlights: [
      "Three separate interfaces: admin, mentor and mentee",
      "Real-time messaging and notifications (Socket.IO)",
      "One-off and recurring appointment booking",
      "Authentication, Redis sessions, GitLab CI/CD pipeline",
    ],
    images: ["Orient'Ex home page", "Orient'Ex mentoring area"],
  },
  "app-bancaire": {
    title: "Banking aggregator app",
    domain: "FinTech",
    summary: "Bank accounts brought together through Open Banking, with built-in money management.",
    highlights: [
      "Multi-bank connection through the TrueLayer Open Banking API",
      "Account overview, transfers and virtual cards",
      "Keycloak authentication and Stripe payments",
      "Spring Boot backend containerized with Docker",
    ],
    images: ["Accounts screen of the banking app", "Transfers screen of the banking app", "Cards screen of the banking app"],
  },
  loukka: {
    domain: "Local business",
    summary: "Discover hard-to-find local businesses on an interactive map.",
    highlights: [
      "Interactive map and location-based search (Maps API)",
      "Business pages with photos and practical information",
      "Node.js REST API with PostgreSQL, Dockerized backend",
    ],
    images: ["Loukka interactive map", "Business page in Loukka", "Location-based search in Loukka"],
  },
  airnes: {
    domain: "E-commerce",
    summary: "Complete online store with a customer storefront and an admin back office.",
    highlights: [
      "Storefront: catalog, cart and full checkout flow",
      "Back office: stock, orders, sales tracking",
      "Stripe payments, Node.js API and MongoDB",
    ],
    images: ["Airnes store home page", "Airnes store back office"],
  },
  gestache: {
    domain: "Productivity",
    summary: "Task manager with a built-in timer to track working time.",
    highlights: [
      "Task CRUD with categories and statuses",
      "Per-task timer with cumulative time tracking",
      "Firebase authentication, deployed on Netlify",
    ],
    links: ["the demo"],
    images: ["Gestache task board"],
  },
  "api-rendez-vous": {
    title: "Appointment booking API",
    domain: "Booking",
    summary: "REST API documented with Swagger for a mobile appointment booking app.",
    highlights: [
      "CRUD endpoints for appointments, users and time slots",
      "Complete Swagger documentation, testable online",
      "Sequelize ORM with a MySQL database",
    ],
    links: ["the Swagger documentation"],
    images: ["Swagger documentation of the appointment API"],
  },
  "api-gestion-sportive": {
    title: "Sports management API",
    domain: "Sport",
    summary: "Documented Spring Boot API for managing tournaments and matches.",
    highlights: [
      "Layered Spring Boot architecture with services and repositories",
      "Built-in Swagger/OpenAPI documentation",
      "Docker containerization for deployment",
    ],
    images: ["OpenAPI documentation of the sports management API"],
  },
  "h3-freelance": {
    title: "H3 freelance site",
    domain: "Marketplace",
    summary: "Platform where students sell their freelance services.",
    highlights: [
      "Service catalog with detailed pages",
      "Symfony backend managing users and orders",
    ],
    images: ["Service catalog of the H3 site"],
  },
};

/** Same order as data/experience.ts. */
export const experiencesEn: {
  role: string;
  company?: string;
  place?: string;
  period: string;
  summary: string;
  highlights: string[];
  groups?: { title: string; items: string[] }[];
  /** Only when a technology name differs in English (e.g. "IA" / "AI"). */
  stack?: string[];
}[] = [
  {
    role: "Founder and fullstack developer",
    period: "Since April 2026",
    summary: "Mobile app connecting students with each other, with an admin back office and built-in AI features.",
    highlights: [
      "Design and development of the mobile app (React Native) and the back office (Angular)",
      "Matching system, real-time messaging and notifications (WebSockets)",
      "Generative AI: resume analysis, cover letters and automated applications (OpenAI API)",
      "GitLab CI/CD, Docker containerization, OTA deployments for iOS/Android",
      "Observability: Sentry (errors) and PostHog (product analytics)",
    ],
  },
  {
    role: "Fullstack web and mobile developer",
    period: "September 2022 to July 2026",
    summary:
      "Development of the Almamater school platform (CRM, ERP, extranet, mobile app) within an Agile Scrum team.",
    highlights: [],
    groups: [
      {
        title: "Web platform: CRM, ERP and extranet",
        items: [
          "Requirements analysis, design and development of features",
          "Exposing REST APIs, integrating and consuming external APIs",
          "Incident resolution, performance optimization and user support",
          "Automated imports, exports and backups, CRON job scheduling",
          "Database modeling, migrations, technical and API documentation with Swagger",
          "Code review, refactoring and deployment through GitLab CI/CD on Azure",
          "Monitoring with Kibana and APM to improve application availability and performance",
          "Unit and integration tests to ensure quality and reliability",
          "Agile Scrum teamwork (daily, planning, review, retro), collaboration through Git, wiki, Slack, Teams and Trello",
          "Anchoring documents on the blockchain to guarantee their authenticity",
          "MCP server to plug in AI tools",
        ],
      },
      {
        title: "Mobile app",
        items: [
          "Design and development of the mobile app from the existing features of the web platform",
          "Adapting the web platform's business features to mobile use",
          "Building new mobile features with React Native and TypeScript",
          "Integrating and consuming the REST APIs built for the web platform",
          "OTA updates to update the app remotely without a store release every time",
          "Deep links to open a specific feature or screen of the app directly",
          "Push notifications on Android and iOS",
          "Handling Android and iOS platform specifics",
          "Deployment and publishing on Google Play and the App Store",
          "Performance tracking, error analysis and incident resolution with Sentry and APM",
        ],
      },
    ],
  },
  {
    role: "Co-founder and fullstack developer",
    period: "Since January 2019",
    summary: "Design and development of a mobile payment aggregation platform for the African market.",
    highlights: [
      "REST APIs and MCP servers, integrating the APIs of Mobile Money carriers",
      "Technical documentation and integration guides, automated deployment with CI/CD pipelines",
      "Migration from Java and Angular to Node.js and Vue 3 with Nuxt",
    ],
    stack: ["Vue 3", "Nuxt", "Pinia", "Node.js", "GitLab CI/CD", "JWT", "Docker", "MySQL", "Sequelize", "AI", "Claude Code", "MCP"],
  },
  {
    role: "Fullstack developer, Vue.js, Nuxt and Node.js",
    company: "Orient'Ex (non-profit)",
    period: "October 2025 to March 2026",
    summary: "Mentoring platform connecting mentors and young people, with role-specific interfaces and appointment booking.",
    highlights: [
      "Admin, mentor and mentee interfaces, with real-time messaging (Socket.IO)",
      "One-off and recurring appointment management",
      "Authentication, Redis sessions, GitLab CI/CD pipeline and Docker",
    ],
  },
  {
    role: "IT technician",
    period: "August to September 2022",
    summary: "IT equipment maintenance, user support and help with digital tools.",
    highlights: [],
  },
];

/** Skill group titles; the skills themselves are technology names and stay as they are. */
export const skillGroupTitlesEn: Record<string, string> = {
  Frontend: "Frontend",
  Mobile: "Mobile",
  Backend: "Backend",
  "Bases de données": "Databases",
  "Infrastructure & DevOps": "Infrastructure & DevOps",
  "IA / LLM": "AI / LLM",
};

export const labNotesEn: Record<
  string,
  {
    title: string;
    project: string;
    status: string;
    summary: string;
    proves: string[];
    platform?: string[];
    context: string[];
    built?: string[];
    sections?: { title: string; items: string[] }[];
    steps?: { title: string; items: string[]; after?: string[] };
    outcomes: string[];
  }
> = {
  "agent-vpn-paquet-linux": {
    title: "WireGuard VPN agent: from Docker to a Linux package",
    project: "Multi-server VPN platform",
    status: "In development",
    summary:
      "The agent that drives WireGuard on each VPN server is no longer a Docker container but a real Linux package, installed with apt or dnf.",
    proves: [
      "Packaging and shipping Go software on Linux (.deb/.rpm)",
      "Linux administration: systemd, apt and dnf, iptables",
      "Secure delivery: HTTPS and SHA-256 checksums",
      "Automating the rollout of a fleet of servers",
    ],
    platform: [
      "Distributed VPN architecture: a central Go API drives remote agents over gRPC, one per WireGuard VPN server.",
      "Server installation automated through Linux packages (.deb/.rpm), with TLS/HMAC authentication, automatic service startup and synchronization of VPN configurations.",
      "Multi-tenancy, access management, automatic IP assignment, IPv6 and DNS filtering.",
    ],
    context: [
      "I'm building a VPN platform based on WireGuard. Each VPN server runs an agent that manages the WireGuard interface on behalf of the API.",
      "Until now, the agent was deployed in a Docker container. It worked, but it meant installing Docker, writing a compose file, tuning the container's network permissions… for a simple Go binary. So I changed approach: the agent is now a real Linux package.",
    ],
    built: [
      ".deb and .rpm packages, for amd64 and arm64, built with nfpm. Each package contains the agent binary, its systemd service and a configuration script.",
      "Dependencies are declared in the package (wireguard-tools, iptables, iproute2): apt installs them on its own.",
      "Packages are built during the API image build, so the agent and the API always come from the same commit.",
      "The API serves the packages over HTTPS, with a SHA256SUMS file.",
    ],
    steps: {
      title: "Installation, on the admin side",
      items: [
        "Detects the distribution (apt or dnf) and the architecture.",
        "Downloads the right package and checks its SHA-256 checksum.",
        "Installs it with the system package manager.",
        "Configures the wg0 interface and starts the systemd service.",
      ],
      after: [
        "In the back office, you create the server and copy the displayed command, then run it on the VPS. The API then connects to the agent and enrolls it automatically: the server shows up in the application.",
        "For those who prefer to do everything by hand, the back office also lists the commands one by one, for Debian/Ubuntu and RHEL/Fedora, on amd64 and arm64.",
      ],
    },
    outcomes: [
      "No more Docker on the VPN servers.",
      "systemd restarts the agent if it crashes, and its logs are in journalctl.",
      "Running the command again updates the agent.",
      "Adding a server takes a few minutes.",
    ],
  },
  "go-grpc-plateforme-vpn": {
    title: "Why Go and gRPC to drive the VPN servers",
    project: "Multi-server VPN platform",
    status: "In development",
    summary:
      "The central API and the agent installed on each VPN server are written in Go and talk over gRPC. Here is what drove these two choices.",
    proves: [
      "Designing a distributed architecture (central API and agents)",
      "Server-side Go: concurrency, single binary, cross-compilation",
      "gRPC and Protocol Buffers: typed contract, streaming, TLS",
      "Choosing a technology for its constraints and explaining why",
    ],
    context: [
      "The platform has two sides. A central API manages accounts, access and IP addresses. On each VPN server, an agent applies the WireGuard configuration the API sends it.",
      "So I had to choose a language for these two programs, and a way for the API to give its orders to the agents.",
    ],
    sections: [
      {
        title: "Why Go",
        items: [
          "Go compiles to a single binary, with no runtime to install on the server. That is what makes it possible to ship the agent as a plain .deb or .rpm package.",
          "WireGuard has its own Go ecosystem (wireguard-go, wgctrl): I stay in the language of the protocol's tools.",
          "Goroutines let the API drive several VPN servers in parallel.",
          "The API and the agent are written in the same language: they share code and the types generated from the gRPC contract.",
        ],
      },
      {
        title: "Why gRPC",
        items: [
          "A typed contract: a .proto file describes every exchange between the API and the agent, and a format mismatch shows up at compile time.",
          "Streaming between the API and the agent, to synchronize the VPN configurations.",
          "TLS built into the transport, backed by an HMAC signature.",
          "HTTP/2 and Protocol Buffers: lighter, faster messages than REST/JSON.",
        ],
      },
    ],
    outcomes: [
      "The agent stays light on the VPN servers.",
      "The same CI builds the agent for amd64 and arm64.",
    ],
  },
};
