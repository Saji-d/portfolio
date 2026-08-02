export type ProjectStatus = "ACTIVE" | "COMPLETE" | "CONCEPT";
export type ProjectCategory = "Backend" | "AI/ML" | "Full-stack" | "Data" | "Graphics";

export interface ProjectLink {
  label: string;
  href?: string;
  external?: boolean;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
}

export interface ProjectDecision {
  title: string;
  body: string;
}

export interface ProjectHighlight {
  title: string;
  code: string;
  caption?: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  role: string;
  status: ProjectStatus;
  year: string;
  category: ProjectCategory;
  featured: boolean;
  stack: string[];
  links?: ProjectLink[];
  problem?: string[];
  solution?: string[];
  architecture?: string[];
  decisions?: ProjectDecision[];
  highlights?: ProjectHighlight[];
  metrics?: ProjectMetric[];
  screenshots?: ProjectScreenshot[];
  nextSteps?: string[];
}

export const projects: Project[] = [
  {
    slug: "invoicepilot",
    name: "InvoicePilot",
    tagline: "AI invoice microservice + Web3 cryptographic seal engine",
    summary:
      "Enterprise invoice-processing platform: an 11-stage AI pipeline, Redis Streams async workers, and an append-only Solidity seal registry for tamper-evident audit trails.",
    role: "Backend / AI Engineer",
    status: "ACTIVE",
    year: "2026",
    category: "Backend",
    featured: true,
    stack: [
      "Python 3.11",
      "FastAPI",
      "Fastify",
      "PostgreSQL",
      "Redis Streams",
      "BullMQ",
      "React 19",
      "Solidity",
      "Foundry",
      "Viem",
      "Turnkey KMS",
      "Mindee OCR",
      "Cloudflare R2",
      "Docker",
    ],
    links: [{ label: "Case study (this page)" }],
    problem: [
      "Bookkeeping firms and small businesses drown in manual data entry — hours spent transcribing invoices, matching purchase orders, and reconciling duplicates.",
      "Duplicate payments, PO mismatches, and fraud go undetected because there is no structured audit trail, and files are scattered across inboxes and drives.",
      "Existing tools either cannot process varied invoice formats at enterprise scale or offer no tamper-evident record of what was processed, when, and by whom.",
    ],
    solution: [
      "InvoicePilot is a three-sub-system platform. The AI pipeline turns any invoice file — PDF, webp, jpeg, png — into structured, validated line data. An async engine absorbs spikes without blocking request threads. A Web3 seal kernel anchors every processed record on-chain.",
      "The AI/ML service runs an 11-stage pipeline: file validation → Mindee OCR extraction (30+ fields, per-field confidence) → transformation → normalization (10 functions for currencies, vendor names, dates, emails, phones, URLs) → exact-match duplicate detection → a 12-rule business-logic engine → a 9-rule fraud engine → classification → validation → persistence.",
      "Processing is decoupled through Redis Streams consumer groups. A Fastify API gateway fronts the system with JWT auth (Supabase JWKS), RBAC, sliding-window rate limiting, Redis query caching, and AES-256-GCM encryption for vendor bank details at rest.",
    ],
    architecture: [
      "                     ┌───────────────────────────────────────────────┐",
      "                     │  Fastify API Gateway                          │",
      "                     │  JWT (Supabase JWKS) · RBAC · rate-limit      │",
      "                     └──────────────┬────────────────────────────────┘",
      "                                    │ HTTPS / multipart",
      "                                    ▼",
      "                     ┌───────────────────────────────────────────────┐",
      "                     │  invoice-ai-service (FastAPI)                 │",
      "                     │  11-stage pipeline · 30+ fields · validation  │",
      "                     └──────────────┬────────────────────────────────┘",
      "                                    │ XADD  (Redis Streams)",
      "                                    ▼",
      "                     ┌───────────────────────────────────────────────┐",
      "                     │  Async workers  ·  asyncio.Semaphore(5)       │",
      "                     │  retry (3×, backoff) · DLQ (7-day TTL)        │",
      "                     └──────────────┬────────────────────────────────┘",
      "                                    │  RLS + service role",
      "                                    ▼",
      "                     ┌───────────────────────────────────────────────┐",
      "                     │  PostgreSQL (Supabase, Row-Level Security)    │",
      "                     └──────────────┬────────────────────────────────┘",
      "                                    │  hash + type + ts + signer",
      "                                    ▼",
      "                     ┌───────────────────────────────────────────────┐",
      "                     │  BullMQ seal worker → SealRegistry.sol        │",
      "                     │  Viem + Turnkey KMS · append-only · no PII    │",
      "                     └───────────────────────────────────────────────┘",
    ],
    decisions: [
      {
        title: "Hash-only on-chain (privacy by design)",
        body: "The contract stores only {recordHash, recordType, sealedAt, sealedBy} — never invoice amounts or PII. Records are anchored with sha256(domainTag + canonicalJSON(payload)) using NFC normalization, minor-unit money, and RFC3339 UTC. Clients can verify a document without any sensitive data leaving their control.",
      },
      {
        title: "Provider-agnostic OCR boundary",
        body: "Exactly one file imports the Mindee SDK. Every other module consumes a neutral `DocumentFields` interface, so OCR vendors can be swapped or A/B-tested without touching the pipeline.",
      },
      {
        title: "Signer abstraction",
        body: "Seal signing runs in two modes — local keypair for dev, Turnkey enclave KMS for production — behind a single `SealSigner` interface. The audit logs record which signer produced each seal.",
      },
      {
        title: "RLS FORCE + service-role split",
        body: "Tenant isolation is enforced at the database, not the ORM. The API connects with a service role and row-level security FORCE policies keep multi-tenant reads scoped no matter how the query is written.",
      },
      {
        title: "Soft-ref seals, crash-safe reclaim",
        body: "Seals are soft references (no hard FK) so the ledger stays append-only, and the worker uses XCLAIM idle-reclaim so a crashed consumer's stream entries resume instead of silently dropping.",
      },
    ],
    highlights: [
      {
        title: "Canonical seal hash",
        code: `from hashlib import sha256
from utils import canonical_json  # stable key order + NFC

def seal_hash(payload: dict) -> bytes:
    domain = b"invoice-pilot.v1"          # domain tag, versioned
    data = canonical_json(payload)        # deterministic serialization
    return sha256(domain + data.encode("utf-8")).digest()`,
        caption: "Versioned domain tag prevents cross-domain replay of hashes.",
      },
      {
        title: "Async engine with bounded concurrency",
        code: `# Redis Streams consumer group
stream, group = "invoices:processing", "workers"

for message in stream.pending_and_new(group):
    async with asyncio.Semaphore(5):      # max 5 concurrent
        await asyncio.to_thread(run_pipeline, message)  # release GIL
        await xack(stream, group, message)              # commit offset`,
        caption: "Concurrency capped at 5 to bound downstream load and DB connections.",
      },
    ],
    metrics: [
      { value: "218", label: "pytest cases passing" },
      { value: "11", label: "processing stages" },
      { value: "9", label: "fraud rules" },
      { value: "12", label: "business rules" },
      { value: "5", label: "bounded async workers" },
      { value: "30+", label: "extracted fields" },
    ],
    screenshots: [
      { src: "/images/invoicepilot/invoice-gpt.png", alt: "Structured extraction sample from an invoice" },
      { src: "/images/invoicepilot/invoice-1.webp", alt: "Sample invoice processed by the pipeline" },
      { src: "/images/invoicepilot/invoice-2.png", alt: "Sample invoice line data" },
    ],
    nextSteps: [
      "QuickBooks / Xero OAuth two-way sync — currently the named biggest integration risk.",
      "SOC 2 readiness suite (5 policy docs, trust center, RLS migrations) — continue toward audit.",
      "Public demo environment with seeded sample invoices so the pipeline is explorable without credentials.",
    ],
  },
  {
    slug: "ledgerturf",
    name: "LedgerTurf",
    tagline: "Turf booking ecosystem — live on Vercel",
    summary:
      "Full-stack MERN platform for booking football and cricket turfs in Dhaka, with real-time slot availability, role-based dashboards, and a deployed production demo.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    year: "2025",
    category: "Full-stack",
    featured: true,
    stack: ["React", "Vite", "Tailwind CSS", "Redux Toolkit", "Node.js", "Express", "MongoDB Atlas", "Mongoose", "Cloudinary", "JWT", "Vercel"],
    links: [
      { label: "Live demo", href: "https://ledgerturf.vercel.app", external: true },
      { label: "GitHub", href: "https://github.com/Saji-d/ledgerturf", external: true },
    ],
    problem: [
      "Turf owners in Dhaka booked slots over phone and WhatsApp — double-booking was routine, availability was never current, and players had no way to compare grounds.",
      "Timezones and 24-hour clock confusion made 'is this slot free right now' a genuinely hard query to answer correctly.",
    ],
    solution: [
      "LedgerTurf is a monorepo (npm workspaces) with an Express REST API and a React SPA. Players discover turfs on a geo-indexed map, owners publish and manage slots, and admins get full visibility — with JWT auth and role-based access at every layer.",
      "Slots are protected with an overlap check inside a Mongoose transaction session, and availability is computed in UTC with Bangladesh's UTC+6 offset handled explicitly — so 'available now' means the same thing to everyone.",
      "SPA deep links are handled with Vercel rewrite rules so refreshing /turf/:id never 404s.",
    ],
    architecture: [
      "  React SPA (Vite + Redux) ──► /api/v1 ──► Express (JWT bearer)",
      "                                          │  asyncHandler pattern",
      "                                          ├──► Mongo 2dsphere geo index",
      "                                          ├──► Booking overlap check",
      "                                          │    (transaction session)",
      "                                          ├──► Review avg-rating hooks",
      "                                          └──► Cloudinary uploads",
      "  Vercel: frontend + backend, SPA rewrite rules",
    ],
    decisions: [
      {
        title: "GeoJSON 2dsphere index",
        body: "Turf locations are stored as GeoJSON and indexed with MongoDB's 2dsphere index for radius-based discovery — the spatial query is commented out in production for Vercel stability but the index and model are in place.",
      },
      {
        title: "Explicit UTC+6 handling",
        body: "Past-date validation and 'availableNow' both compute against a single UTC clock offset, eliminating the midnight-rollover class of bugs common to BD booking apps.",
      },
      {
        title: "Npm workspaces monorepo",
        body: "frontend, backend, and an api-shim share the repo so type shapes stay in sync while each package deploys independently to Vercel.",
      },
    ],
    highlights: [
      {
        title: "Overlap check inside a transaction",
        code: `const session = await mongoose.startSession();
session.startTransaction();
try {
  const clash = await Booking.findOne({
    turf, startTime: { $lt: end },
    endTime: { $gt: start },
  }).session(session);
  if (clash) throw new BookingConflictError();
  await Booking.create([{ turf, start, end }], { session });
  await session.commitTransaction();
} finally { session.endSession(); }`,
        caption: "Honest note: overlap validation is session-bound at creation; a unique partial index is the planned hardening step.",
      },
    ],
    metrics: [
      { value: "37", label: "commits" },
      { value: "3", label: "roles (player / owner / admin)" },
      { value: "2dsphere", label: "geo index on locations" },
      { value: "+6", label: "UTC offset handled explicitly" },
    ],
    screenshots: [],
    nextSteps: [
      "Unique partial index on (turf, startTime) to make double-booking impossible at the DB level.",
      "Re-enable the geo-search path now that Vercel configuration is stable.",
    ],
  },
  {
    slug: "casevault",
    name: "CaseVault",
    tagline: "AI legal intelligence platform — concept & MVP",
    summary:
      "Document ingestion, citation-backed legal research, and a privacy-first vision for Bangladeshi law firms. Tagline: 'Don't trust AI. Verify AI.' Phase 1 MVP shipped; GraphRAG is designed for Phase 2.",
    role: "Backend / AI Engineer",
    status: "ACTIVE",
    year: "2026",
    category: "Backend",
    featured: true,
    stack: ["FastAPI", "SQLAlchemy", "SQLite", "Next.js 16", "React 19", "Tailwind CSS v4", "framer-motion"],
    links: [{ label: "Case study (this page)" }],
    problem: [
      "Bangladeshi law firms work with thousands of handwritten and scanned documents, losing annotations and struggling to find relevant precedents.",
      "Generic AI chatbots hallucinate citations — and firms cannot upload confidential client files to public AI tools without risking privacy.",
    ],
    solution: [
      "CaseVault Phase 1 is a working MVP: a FastAPI backend ingests markdown legal documents (front-matter metadata) into SQLite, with repositories that score document relevance per query and a full-text search API.",
      "The Next.js frontend is a dark-theme research workspace — hero search, live stats, category cards, a document reader with AI tabs (summary / ask / citations / related), query highlighting, and an XSS-safe hand-rolled markdown renderer.",
      "Phase 2 is fully designed (Project SynthGraph): Qdrant semantic search + Neo4j knowledge graph with Leiden community detection, Celery pipelines for OCR → chunking → embeddings, and sub-graph context injected into a reranker — targeting ~790ms to first token.",
    ],
    architecture: [
      "  ┌───────────────────────── Phase 1 (shipped) ─────────────────────────┐",
      "  │  Next.js 16 SPA  ──►  FastAPI  ──►  SQLAlchemy  ──►  SQLite          │",
      "  │  / (search)  /reader  /admin  /dashboard  /library  /workspace      │",
      "  │  DocumentService.sync_documents_from_disk() → 46 legal docs          │",
      "  └──────────────────────────────────────────────────────────────────────┘",
      "  ┌───────────────────────── Phase 2 (designed) ────────────────────────┐",
      "  │  OCR → chunk → embed → Qdrant (vector) · Neo4j (KG, Leiden)         │",
      "  │  Celery async pipelines · BGE reranker · ~790ms TTFT budget          │",
      "  └──────────────────────────────────────────────────────────────────────┘",
    ],
    decisions: [
      {
        title: "XSS-safe markdown without a heavy renderer",
        body: "The reader renderer is hand-rolled and output-sanitized rather than pulling in a full markdown engine — small surface, safe by default for legal content.",
      },
      {
        title: "Relevance scoring at the repository layer",
        body: "Document relevance is computed in SQL against indexed columns and cached, keeping the search API fast without introducing a search server in Phase 1.",
      },
      {
        title: "Phase-2 placeholders designed up front",
        body: "Routes like /admin, /chat, and /workspace exist as intentional shells so the product structure survives the Phase 1 → Phase 2 migration.",
      },
    ],
    highlights: [
      {
        title: "Relevance-scored search",
        code: `def search(self, q: str, limit: int = 20) -> list[Document]:
    like = f"%{escape_like(q)}%"
    rows = self.session.query(Document).filter(
        or_(Document.title.ilike(like),
            Document.content.ilike(like))
    ).order_by(relevance_rank(q)).limit(limit).all()
    return rows`,
        caption: "Keyword relevance rank prioritizes title matches over body matches.",
      },
    ],
    metrics: [
      { value: "46", label: "legal docs ingested" },
      { value: "6", label: "product surfaces designed" },
      { value: "790ms", label: "Phase-2 TTFT budget" },
      { value: "0", label: "hallucinated citations (target)" },
    ],
    screenshots: [],
    nextSteps: [
      "Phase 2 build: Qdrant + Neo4j + Celery pipelines per the SynthGraph design.",
      "Admin review queue where firms approve AI-suggested citations before they reach research notes.",
    ],
  },
  {
    slug: "3d-city-simulation",
    name: "3D City Simulation",
    tagline: "OpenGL city with day/night cycles and live weather",
    summary:
      "A 3D procedurally laid-out city rendered in C++/OpenGL with dynamic day/night lighting, rain and snow, and working traffic-light logic — a pure graphics engineering showcase.",
    role: "Graphics Engineer",
    status: "COMPLETE",
    year: "2024",
    category: "Graphics",
    featured: true,
    stack: ["C++", "OpenGL", "Code::Blocks", "GLUT"],
    links: [{ label: "Case study (this page)" }],
    problem: [
      "Computer graphics coursework needed to demonstrate mastery of the full OpenGL pipeline — geometry, lighting, and interaction — rather than a single static scene.",
    ],
    solution: [
      "Simulation City builds an entire block grid with buildings, roads, and vehicles. A day/night cycle interpolates ambient and directional light; weather modes toggle particle rain and snow; and traffic lights cycle red → green with keyboard-controlled camera navigation.",
      "Everything is generated from a single scene graph, so light state, weather state, and traffic state compose cleanly.",
    ],
    architecture: [
      "  SceneGraph (city blocks, roads, vehicles)",
      "   ├── DayCycle    → ambient + directional light lerp",
      "   ├── Weather     → rain / snow particle emitters",
      "   ├── TrafficLights → per-intersection state machine",
      "   └── Camera      → WASD + orbit (GLUT keyboard)",
    ],
    decisions: [
      {
        title: "State-as-machine over per-frame hacks",
        body: "Traffic lights are a three-state machine (red → green → amber) advanced by a timer, so timing stays consistent regardless of frame rate.",
      },
    ],
    highlights: [
      {
        title: "Weather without geometry explosion",
        code: `struct Particle { vec3 pos; vec3 vel; float life; };

for (auto &p : particles) {
    p.vel.y = mode == RAIN ? -9.8f : -1.2f;   // gravity per mode
    p.life -= dt;
    if (p.life <= 0) respawn(p);               // recycle, no alloc
}`,
        caption: "Snow falls slowly and drifts; rain falls fast — one particle system, two parameter sets.",
      },
    ],
    metrics: [
      { value: "6", label: "rendered modes (day, night, rain, snow, traffic)" },
      { value: "1", label: "scene graph for all state" },
      { value: "WASD", label: "free camera controls" },
    ],
    screenshots: [
      { src: "/images/3d-city/day-mode.png", alt: "Simulation City in daylight" },
      { src: "/images/3d-city/night-mode.png", alt: "Simulation City at night" },
      { src: "/images/3d-city/rain-mode.png", alt: "Simulation City under rain" },
      { src: "/images/3d-city/snow-mode.png", alt: "Simulation City in snow" },
      { src: "/images/3d-city/traffic-light-red.png", alt: "Traffic light state: red" },
      { src: "/images/3d-city/traffic-light-green.png", alt: "Traffic light state: green" },
    ],
    nextSteps: [
      "Add textured buildings and reflections for a stronger visual pass.",
    ],
  },
  {
    slug: "finbert",
    name: "FinBERT Sentiment",
    tagline: "Domain-fine-tuned financial sentiment analysis",
    summary:
      "Fine-tuned FinBERT against vanilla BERT on financial text to show why domain-specific transformers win on jargon-heavy corpora.",
    role: "ML Researcher",
    status: "COMPLETE",
    year: "2025",
    category: "AI/ML",
    featured: false,
    stack: ["PyTorch", "Hugging Face", "FinBERT", "NLTK", "Scikit-learn"],
    links: [{ label: "GitHub", href: "https://github.com/Saji-d/natural-language-processing", external: true }],
  },
  {
    slug: "employee-family-registry",
    name: "Employee & Family Registry",
    tagline: ".NET API + React SPA with PDF CV export",
    summary:
      "A take-home technical assessment: ASP.NET Core Web API with EF Core + PostgreSQL, a React front end, and QuestPDF-generated CV/list documents.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    year: "2026",
    category: "Full-stack",
    featured: false,
    stack: [".NET", "ASP.NET Core", "EF Core", "PostgreSQL", "React", "Vite", "Tailwind", "QuestPDF"],
    links: [
      { label: "GitHub", href: "https://github.com/Saji-d/employee-family-registry", external: true },
    ],
  },
  {
    slug: "rfm-risk",
    name: "RFM Risk Model",
    tagline: "Churn early-warning for high-value customers",
    summary:
      "RFM segmentation + K-Means clustering over the UK online-retail dataset to flag high-value customers drifting toward churn.",
    role: "Data Scientist",
    status: "COMPLETE",
    year: "2025",
    category: "Data",
    featured: false,
    stack: ["Python", "Pandas", "Scikit-learn", "K-Means"],
  },
  {
    slug: "water-turbidity",
    name: "Water Turbidity",
    tagline: "EfficientNet-B0 with small real-world datasets",
    summary:
      "CVPR paper on fine-tuning EfficientNet-B0 to classify water turbidity (High/Low/Medium) from ~300 phone photos — with cat/dog/panda auxiliary data.",
    role: "CV Researcher",
    status: "COMPLETE",
    year: "2025",
    category: "AI/ML",
    featured: false,
    stack: ["PyTorch", "EfficientNet-B0", "Transfer Learning"],
  },
  {
    slug: "cvpr-collection",
    name: "CVPR Notebook Suite",
    tagline: "Five computer-vision notebooks",
    summary:
      "EfficientNet face recognition, KNN multiclass classification, LBPH face recognition, MLP pattern recognition, and NN MNIST digit recognition.",
    role: "CV Engineer",
    status: "COMPLETE",
    year: "2025",
    category: "AI/ML",
    featured: false,
    stack: ["Python", "PyTorch", "OpenCV", "Scikit-learn"],
    links: [{ label: "GitHub", href: "https://github.com/Saji-d/computer-vision-and-pattern-recognition", external: true }],
  },
  {
    slug: "twitter-sentiment",
    name: "Twitter Sentiment",
    tagline: "NLTK + TF-IDF tweet classification",
    summary:
      "Classic NLP pipeline — tokenization, TF-IDF vectorization, and linear models — to classify tweet sentiment.",
    role: "ML Engineer",
    status: "COMPLETE",
    year: "2025",
    category: "AI/ML",
    featured: false,
    stack: ["Python", "NLTK", "Scikit-learn"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "Backend",
  "AI/ML",
  "Full-stack",
  "Data",
  "Graphics",
];
