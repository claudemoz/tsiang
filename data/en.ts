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
    context:
      "OpenPay lets individuals, merchants and partners pay and get paid through Mobile Money. Alongside the platform, I designed and built its RAG assistant end to end: it answers users' questions, signed in or not, from a knowledge base and cites its sources.",
    highlights: [
      "Customer portal, partner area and admin console",
      "Documented REST APIs for partner integration, API key authentication",
      "Real-time transactions with callback URLs",
      "RAG assistant: MySQL FULLTEXT search over the knowledge base, answers generated by Claude Haiku with cited sources",
      "Chat open to signed-out visitors through an anonymous browser ID, with conversations strictly isolated between users",
      "Assistant security: input sanitising, prompt injection protection (escaping, system instructions), parameterised SQL queries, rate limiting",
      "Controlled costs: lightweight model and limited context, estimated under $0.001 per question",
      "Responsive interface with conversation history, back office to manage the knowledge base",
      "Knowledge base of 66 articles built from the product's actual features",
      "Unit, integration (MySQL) and end-to-end (Playwright) tests run in CI",
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
      "RAG assistant built on Claude Haiku: MySQL FULLTEXT search, cited sources, prompt injection protection, Playwright tests in CI",
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
    status?: string;
    summary: string;
    proves: string[];
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
  "rag-sans-base-vectorielle": {
    "title": "A lean RAG, without a vector database",
    "project": "OPENPAY's AI assistant",
    "summary": "To answer customers from 66 articles, a MySQL FULLTEXT index is enough: no vector database. Claude Haiku writes, and the code keeps control of prices and links.",
    "proves": [
      "Designing a RAG end to end, from retrieval to generation",
      "Choosing the simplest architecture that does the job, and owning it",
      "Integrating an LLM with the Anthropic SDK, streaming over SSE",
      "Keeping facts in code: live prices, links from a closed list"
    ],
    "context": [
      "OPENPAY lets Congolese merchants collect Mobile Money payments. The same questions kept coming back: how much does a withdrawal cost, where is my API key, can I open an account without a company, why doesn't my callback arrive.",
      "They came by email or WhatsApp, at any hour, from three audiences: visitors discovering the service, merchants in the middle of an integration, and admins. The goal: an immediate, accurate and verifiable answer, on every page of the site, with no risk of the AI making up a price or a procedure."
    ],
    "built": [
      "An \"Ask me a question\" button opens a chat. Each answer is written by Claude only from a knowledge base managed by the team.",
      "Retrieval: the 5 most relevant articles are found by a MySQL FULLTEXT index.",
      "Augmented: those articles, the current prices and the last 10 messages are injected into the prompt.",
      "Generation: Claude Haiku writes a short answer, in French, never stepping outside that context."
    ],
    "sections": [
      {
        "title": "No vector database, on purpose",
        "items": [
          "The RAG reflex is embeddings and a vector database. For a base of 66 articles, that was oversized: one more service to host, a sync to maintain and an extra cost.",
          "I used MySQL's FULLTEXT index, already in the stack: the query returns the 5 published articles with the best relevance score.",
          "The trade-off I accept: FULLTEXT does not understand meaning and does not handle word variants (\"remboursé\" does not find \"remboursement\"). I made up for it in the content: each article ends with a Keywords line that repeats the customers' real wording.",
          "Semantic search remains a possible next step, to trigger when the admin data shows it is needed."
        ]
      },
      {
        "title": "The smallest model that does the job",
        "items": [
          "Claude Haiku 5.5, with a low reasoning effort and at most 2,048 output tokens.",
          "The task is to rephrase a given context, not to reason about an open problem. The result: answers in a few seconds and a minimal cost per question."
        ]
      },
      {
        "title": "Prices are never written in the articles",
        "items": [
          "The price of the API subscription is set by the admin and can change at any time. Written in an article, the assistant would end up quoting an old price.",
          "For each question, the backend reads the current configuration (with a 30 s cache) and injects it into a <tarifs_en_vigueur> block, which overrides the articles. One source of truth, shared with the site's Pricing page."
        ]
      },
      {
        "title": "Links, but from a closed list",
        "items": [
          "The assistant can offer buttons, such as \"Go to API key\" or \"Documentation: payment links\". But it never outputs a URL: it ends its answer with a marker like [[lien:cle-api]].",
          "The backend replaces it with a page from a closed list of 17 destinations, and ignores any unknown key. A hallucination cannot turn into a broken or malicious link."
        ]
      },
      {
        "title": "Streaming",
        "items": [
          "Answers appear as they are written, through Server-Sent Events over a POST, with fetch and a ReadableStream in the browser.",
          "A link marker can arrive split across two chunks. A visibleText function holds back any incomplete marker: the displayed text only grows, it never flickers or rewrites itself. A unit test checks it.",
          "If the customer closes the chat during generation, an AbortController tied to res.on(\"close\") cancels the model call, so nobody pays for an answer no one will read.",
          "Behind nginx, the X-Accel-Buffering: no header keeps the proxy from holding the stream back."
        ]
      },
      {
        "title": "Next steps",
        "items": [
          "Hybrid search (FULLTEXT and embeddings) if the share of questions without an article plateaus.",
          "Removing French stop words before searching.",
          "A shared limiter through Redis when running several instances.",
          "Turning tokens into real cost in the dashboard."
        ]
      }
    ],
    "outcomes": [
      "Restraint is an architecture choice: a well-fed FULLTEXT index beats a poorly fed vector database.",
      "The model writes, the code decides: prices, links, access rights and limits are set by the backend."
    ]
  },
  "securiser-une-ia-publique": {
    "title": "Securing a public AI",
    "project": "OPENPAY's AI assistant",
    "summary": "An assistant open to visitors is an attack surface. Each risk has its countermeasure, and the model has no power to act: it only writes text.",
    "proves": [
      "Securing a public AI: prompt injection, XSS, social engineering",
      "Cleaning and escaping input, parameterized SQL queries",
      "Rate limiting per account and per IP",
      "Reading an API's contract and fixing an existing bug"
    ],
    "context": [
      "The chat is public: any visitor can write in it. A public AI is secured like a public form, plus prompt injection."
    ],
    "sections": [
      {
        "title": "Risks and countermeasures",
        "items": [
          "Prompt injection (\"ignore your instructions\"): the question and the articles are escaped (< becomes &lt;) before going between tags. There is no way to close <question> or open a fake <system> block. The prompt treats the question as data, never as an instruction.",
          "Hidden text: Unicode NFKC normalization, and removal of invisible characters (zero width, direction overrides) and control characters.",
          "SQL injection: bound parameters only. I don't filter words like SELECT or DROP: that would block legitimate questions without protecting anything more. An integration test sends an injection attempt and checks that nothing moves.",
          "XSS through an answer: rendered as plain text, never v-html.",
          "Hallucinated price or procedure: the prompt forbids making up fees, delays or endpoints. Missing information points to the contact page.",
          "Social engineering: the assistant never asks for a password, PIN, OTP or API key. It cannot take any action: it only writes text.",
          "Abuse and cost: 20 questions per 10 minutes for an account, 40 per 10 minutes per IP for visitors."
        ]
      },
      {
        "title": "The limiter story",
        "items": [
          "While counting visitors per IP, I found a bug that already existed in the application. With express-rate-limit v8, ipKeyGenerator expects an IP address. The code was passing it the whole request.",
          "The limiting key was therefore \"[object Object]\" for everyone: one global counter instead of one per client.",
          "The fix is one line, but it also affected the limit on authentication emails. A good reminder: read an API's contract rather than guess its signature."
        ]
      }
    ],
    "outcomes": [
      "A public AI is secured like a public form, plus prompt injection: cleaning, escaping, rate limits, and no power to act.",
      "The per-IP limit is covered by an integration test: the 41st request gets a 429."
    ]
  },
  "piloter-un-assistant-ia": {
    "title": "Sounding like an advisor, and steering the assistant",
    "project": "OPENPAY's AI assistant",
    "summary": "With a small model, where an instruction sits matters as much as how it is worded. And a RAG is only as good as its knowledge base: the admin interface is there to grow it.",
    "proves": [
      "Writing a prompt that holds with a small model",
      "Measuring and steering an AI product: feedback, tokens, unanswered questions",
      "Testing an AI product without calling the real model",
      "Caring for the experience: performance, accessibility, continuity"
    ],
    "context": [
      "The first answers started with \"According to the articles in our base\". Technically accurate, but it sounds like a robot. Forbidding those words in the system prompt was not enough: a small model follows an instruction less well when it sits far from the text it is working on."
    ],
    "sections": [
      {
        "title": "What worked for the tone",
        "items": [
          "A section dedicated to tone, with a list of forbidden words (article, document, source, base) and examples to avoid and correct ones.",
          "A short reminder placed right after the question, in the last user message. It also undoes the effect of older, badly worded answers still in the history."
        ]
      },
      {
        "title": "The improvement loop",
        "items": [
          "Conversations: volume, satisfaction rate based on customers' positive and negative feedback, share of questions without an article, and tokens actually used, read from response.usage and stored for each answer. Each conversation opens in detail with the articles used, the links offered and the cost.",
          "Without an article: the questions for which the search found nothing. That is the list of articles to write. One click opens the editor with the question already as the title.",
          "Articles: managing the base (creation, publishing, categories)."
        ]
      },
      {
        "title": "Details that make the experience",
        "items": [
          "An invitation, not just an icon: \"Ask me a question, online, instant answer\". A welcome card offers 3 questions suited to the page, different on the public site and in the merchant area.",
          "The chat is loaded on demand, and preloaded when the browser is idle or on hovering the button: it weighs nothing on first paint.",
          "A visitor gets an anonymous identifier. When they sign in, their conversations move to their account automatically.",
          "prefers-reduced-motion respected, feedback buttons with aria-pressed, accessible names on panels, keyboard navigation.",
          "The button is hidden on the payment page, so as not to distract at the moment of paying."
        ]
      },
      {
        "title": "Quality and tests",
        "items": [
          "Unit (node:test): anti-injection cleaning, link extraction, streaming text filtering, model refusal cases, live prices.",
          "Integration (Supertest and a throwaway MySQL 8 in Docker): FULLTEXT search, conversation ownership, SSE stream, feedback, linking on sign-in, per-IP limit, admin statistics, SQL injection attempt.",
          "End to end (Playwright, with a fake backend able to emit SSE): visible streaming, links, feedback, resuming a conversation, errors and 429, welcome card, payment page, admin screens.",
          "No test calls the real model: the SDK is mocked, which makes the suite fast, deterministic and free in CI."
        ]
      }
    ],
    "outcomes": [
      "The backend suite (116 unit tests, 74 integration tests) passes in full with the assistant, and 10 e2e scenarios are dedicated to it.",
      "Without measurement, no steering: tokens, feedback and unanswered questions turn a chatbot into a product you can improve week after week."
    ]
  },
};

/** English text of the labs (data/lab.ts), keyed by slug. */
export const labsEn: Record<string, { title: string; status?: string; summary: string; platformTitle?: string; platform: string[] }> = {
  "plateforme-vpn": {
    title: "Multi-server VPN platform",
    status: "In development",
    summary: "Multi-server VPN platform built on WireGuard: a central Go API drives an agent on every VPN server.",
    platform: [
      "Distributed VPN architecture: a central Go API drives remote agents over gRPC, one per WireGuard VPN server.",
      "Server installation automated through Linux packages (.deb/.rpm), with TLS/HMAC authentication, automatic service startup and synchronization of VPN configurations.",
      "Multi-tenancy, access management, automatic IP assignment, IPv6 and DNS filtering.",
    ],
  },
  "assistant-ia-openpay": {
    "title": "OPENPAY's AI assistant: a lean RAG",
    "summary": "A RAG (Retrieval-Augmented Generation): for each question, the assistant retrieves the relevant articles from the knowledge base, then Claude writes the answer only from them. It answers OPENPAY's customers on every page of the site, and prices are read live from the configuration.",
    "platformTitle": "The RAG architecture",
    "platform": [
      "Browser (Nuxt): a floating button opens the chat, which sends the question to the API with POST /ask/stream and receives the answer as Server-Sent Events.",
      "API (Express): identification (JWT or visitor), cleaning and validation of the question, rate limiting per account or per IP.",
      "Retrieval: the 5 most relevant articles are found by a MySQL FULLTEXT index, along with the current prices.",
      "Augmented: those articles, the current prices and the last 10 messages are injected into the prompt.",
      "Generation: Claude Haiku writes a short answer, in French, never stepping outside that context. The answer is stored with its tokens and its links.",
      "Admin: the articles, the conversations and the questions left without an article."
    ]
  },
};

/** English labels of the lab categories (data/lab.ts). */
export const labCategoriesEn = {
  "reseau-securite": "Networking and security",
  "devops-cloud": "DevOps and cloud",
  "backend-api": "Backend and APIs",
  ia: "AI",
} as const;
