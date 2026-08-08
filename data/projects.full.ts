import type {
  ProjectStatus,
  ProjectBadge,
  ProjectCategory,
  ProjectMetric,
  ProjectScreenshot,
  ProjectDecision,
  ProjectHighlight,
} from "@/data/projects";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  role: string;
  status: ProjectStatus;
  category: ProjectCategory;
  badges: ProjectBadge[];
  featured: boolean;
  cover: string;
  caseStudy?: boolean;
  github?: string;
  demo?: string;
  thesis?: string;
  stack: string[];
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
    tagline: "AI-powered invoice processing platform that extracts, validates, and analyzes invoices while detecting duplicates and anomalies to streamline financial document workflows.",
    summary:
      "Audit-grade invoice processing: extraction, normalization, business and fraud rule checks, human approval, then a cryptographic on-chain seal of the exact uploaded bytes — hash-only, so no invoice data ever lands on-chain.",
    role: "Backend / AI Engineer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/invoicepilot-thumbnail.webp",
    caseStudy: true,
    stack: ["FastAPI", "Fastify", "BullMQ", "PostgreSQL", "Solidity"],
    problem: [
      "Bookkeeping firms process invoices by hand: transcribing totals, matching purchase orders, and hunting for duplicates — an error-prone paper trail that takes hours and leaves no proof of what was actually done.",
      "Duplicate payments and fraud slip through because there is no structured audit trail, and any claim that an invoice was processed rests on someone's word.",
      "Generic extraction tools pull fields but cannot vouch that the extracted data matches the file — so automation stops before approval, exactly where the hours get saved.",
    ],
    solution: [
      "InvoicePilot runs one end-to-end pipeline per document: capture → extraction → normalization → duplicate, business, and fraud checks → human approval → on-chain cryptographic seal → accounting sync. A sha-256 of the exact uploaded bytes is the document's identity, re-verified by the AI service, so a seal can never cover a file that doesn't match its hash.",
      "OCR and sealing are deliberately one pipeline — what the OCR extracts is what gets sealed on-chain. Two ingest routes (sync and async) fold onto the same invoices row through a single shared, frozen mapper, so the same document always produces the same on-chain hash.",
      "Async work runs on BullMQ workers — extraction, duplicate-check, anomaly-check, blockchain-seal, solidinvoice-sync — while PostgreSQL row-level security FORCE policies keep every tenant's data isolated at the database, not the ORM.",
    ],
    architecture: [
      "  Frontend (Vite + React) · Supabase auth · Cloudflare R2",
      "        │  multipart upload / presigned R2 URL",
      "        ▼",
      "  Fastify API — JWT (Supabase JWKS) · RBAC · rate-limit · audit log",
      "        │                          │",
      "        │ sync /invoices/process   │ async /invoices → BullMQ",
      "        ▼                          ▼",
      "  invoice-ai-service (FastAPI)     Worker queues",
      "   verify sha-256 · OCR (Mindee)    invoice-extraction · duplicate-check",
      "   transform · normalize ·          anomaly-check · blockchain-seal",
      "   business rules (12) · fraud (9)  solidinvoice-sync",
      "   classify · validate · persist",
      "        │                          │",
      "        ▼──────────────────────────▼",
      "  PostgreSQL 17 — RLS FORCE · NOBYPASSRLS service role",
      "        │",
      "        ▼",
      "  SealRegistry.sol (Base Sepolia)",
      "   { recordHash, recordType, sealedAt, sealedBy } — append-only, no PII",
    ],
    decisions: [
      {
        title: "Hash-only on-chain (privacy by design)",
        body: "The contract stores only {recordHash, recordType, sealedAt, sealedBy} — never amounts, PII, or vendor data. Each hash is sha-256 over RFC 8785 (JCS) canonical JSON (NFC-normalized, money in integer minor units) tagged with a versioned domain string, so a document can be verified without any sensitive data leaving its owner's control.",
      },
      {
        title: "The frozen anti-fabrication mapper",
        body: "The AI service emits {value: 0.0, present: false} for a field it never found. The one shared mapper omits any key the extractor did not produce instead of writing a zero — so a $0 invoice invented from a default can never reach an approver, let alone a seal. It is deliberately frozen in shared-types so both ingest routes seal identical bytes.",
      },
      {
        title: "RLS FORCE + service-role split",
        body: "Tenant isolation is enforced at the database, not the ORM. The API sets per-request GUCs, the worker connects with app.current_role='service' under a NOBYPASSRLS production role, and FORCE ROW LEVEL SECURITY keeps reads tenant-scoped however the query is written.",
      },
      {
        title: "AES-256-GCM for PII at rest",
        body: "Vendor bank details and firm tax IDs are encrypted field-level with aes-256-gcm, stored hex-serialized, and tied to a referenced KMS key alias. Decryption happens only where a route genuinely needs the plaintext — the rest of the system never sees it.",
      },
      {
        title: "Versioned, frozen approval hashes",
        body: "The hashing kernel lives in shared-types behind a versioned domain tag (invoicepilot/approval/v1). v1 seals must stay verifiable forever, so a changed sealed-field set ships as approval-v2 rather than an edit to the payload builder.",
      },
      {
        title: "Verify never writes",
        body: "The public verify path recomputes sha-256 in-process and calls a keyless view function on-chain: no DB write, no audit row, no signer. Every outcome — match, mismatch, not-yet-sealed, chain error, payload error — resolves explicitly and never throws.",
      },
    ],
    highlights: [
      {
        title: "The hash kernel — one payload becomes a bytes32",
        code: `// shared-types/src/canonical.ts — the backend-agnostic seal core.
// recordHash = '0x' + sha256( domainTag + '\\n' + canonicalJSON(payload) )
export function computeRecordHash(
  payload: unknown,
  domainTag: string,
): \`0x\${string}\` {
  return \`0x\${sha256Hex(domainTag + '\\n' + canonicalJSON(payload))}\`;
}`,
        caption: "RFC 8785 (JCS) canonical JSON + a versioned domain tag make the hash deterministic across languages — the Python service extracts, TypeScript seals, Solidity verifies.",
      },
      {
        title: "The anti-fabrication rule (frozen mapper)",
        code: `// AI emits { value: 0.0, present: false } for fields it never found.
// A mapper checking only typeof value === 'number' writes amount 0,
// marks the invoice approvable — then it gets SEALED ON-CHAIN.
// So every key is OMITTED unless the extractor produced it:
export interface ExtractedInvoiceFields {
  vendorName?: string;       // nfc'd, varchar(255)
  invoiceNumber?: string;    // nfc'd, varchar(128)
  amount?: string;           // fixed-4 decimal, numeric(19,4)
  currency?: string;         // /^[A-Z]{3}$/
  lineItems?: NormalizedLineItem[]; // jsonb, sealed as-stored
}`,
        caption: "An invoice with no extracted total is never handed to an approver — the exact $0-invoice-sealed bug this branch exists to kill.",
      },
      {
        title: "The single on-chain write, with a fee policy",
        code: `// seal.ts — the only tx this worker ever pays for.
const [block, suggestedTip] = await Promise.all([
  publicClient.getBlock(),
  publicClient.estimateMaxPriorityFeePerGas(),
]);
const fees = computeSealFees({
  baseFeePerGas: block.baseFeePerGas,
  suggestedPriorityFeePerGas: suggestedTip,
  maxPriorityFeeWei: config.maxPriorityFeeWei,
  baseFeeMultiplier: config.baseFeeMultiplier,
  maxFeeCapWei: config.maxFeeCapWei,
});
if (fees.maxFeePerGas > config.maxFeeCapWei) {
  throw new Error('seal: chain is expensive — not submitting, retry later');
}
const txHash = await walletClient.writeContract({
  address: SEAL_CONTRACT_ADDRESS, abi: sealRegistryAbi,
  functionName: 'sealRecord',
  args: [recordHash, RECORD_TYPE_APPROVAL],
  maxFeePerGas: fees.maxFeePerGas,
  maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
});`,
        caption: "The tip is our number, not the RPC's — a seal is never urgent, so over a hard fee cap the job waits for a cheaper block instead of overpaying.",
      },
    ],
    metrics: [
      { value: "146", label: "AI-service pytest cases" },
      { value: "366", label: "API tests · 43 files" },
      { value: "12+9", label: "business + fraud rules" },
      { value: "4", label: "BullMQ seal & check workers" },
      { value: "78.6k", label: "gas per on-chain seal" },
      { value: "1", label: "frozen shared mapper" },
    ],
    screenshots: [
      { src: "/images/invoicepilot/invoice-gpt.webp", alt: "Structured extraction sample from an invoice" },
      { src: "/images/invoicepilot/invoice-1.webp", alt: "Sample invoice processed by the pipeline" },
      { src: "/images/invoicepilot/invoice-2.webp", alt: "Sample invoice line data" },
    ],
    nextSteps: [
      "Reconcile schema drift: base SQL defines 7 invoice_status values, the code enum has 12, the SOC 2 spec lists 15 — align before the base schema is ever re-imported.",
      "Add a per-currency minor-unit exponent table (JPY=0, BHD=3) before any non-2-decimal currency reaches production.",
      "Backfill pre-006 rows and replace the rule-based anomaly placeholder with the planned Isolation Forest path.",
      "Public demo environment with seeded sample invoices so the pipeline is explorable without credentials.",
    ],
  },
  {
    slug: "ledgerturf",
    name: "LedgerTurf",
    tagline: "Real-time turf booking platform that lets players discover and reserve grounds on a map while owners publish and manage slots with overlapping-time protection.",
    summary:
      "Real-time turf booking for Dhaka: players find grounds on a map, owners publish slots, and every reservation is protected by an overlap check — live in production on Vercel.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Professional",
    badges: [],
    featured: true,
    cover: "/images/thumbnails/ledgerturf-thumbnail.webp",
    caseStudy: true,
    github: "https://github.com/Saji-d/ledgerturf",
    demo: "https://ledgerturf.vercel.app",
    stack: ["Next.js", "TypeScript", "Mapbox"],
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
    name: "CaseVault GraphRAG",
    tagline: "Privacy-first legal research workspace that ingests case documents, ranks search results by relevance, and provides AI-generated summaries with verifiable citations.",
    summary:
      "Privacy-first legal research for Bangladeshi law firms: ingest case documents, search with relevance-ranked results, and read with AI tabs for summaries and citations — built around 'verify, don't trust AI.'",
    role: "Backend / AI Engineer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/casevault-thumbnail.webp",
    caseStudy: true,
    stack: ["GraphRAG", "Neo4j", "Qdrant", "FastAPI", "LLMs"],
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
    slug: "finbert",
    name: "FinBERT Financial Sentiment Analysis",
    tagline: "Comparative study proving domain-tuned transformers outperform generic models on financial sentiment, with a full fine-tuning-to-evaluation pipeline in a single notebook.",
    summary:
      "A comparative study proving domain-tuned transformers beat generic models on financial jargon — fine-tuned FinBERT and BERT on earnings and market text, with the full training-to-evaluation pipeline in one notebook.",
    role: "ML Researcher",
    status: "COMPLETE",
    category: "NLP",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/finbert-thumbnail.webp",
    github: "https://github.com/Saji-d/financial-sentiment-analysis-bert",
    stack: ["BERT", "Transformers", "PyTorch", "NLP"],
  },
  {
    slug: "codingvibes-java-gui",
    name: "CodingVibes Learning Platform",
    tagline: "Interactive Java learning platform featuring courses, quizzes, and progress tracking built around a clean event-driven architecture with persistent state.",
    summary:
      "An interactive learning platform with courses, quizzes, and progress tracking — engineered around a clean event-driven architecture with persistent state behind every screen.",
    role: "Desktop Developer",
    status: "COMPLETE",
    category: "Desktop",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/codingvibes-thumbnail.webp",
    github: "https://github.com/Saji-d/codingvibes-java-gui",
    stack: ["Java", "Swing", "MySQL"],
  },
  {
    slug: "face-recognition-system",
    name: "Face Recognition System",
    tagline: "Real-time face identification pipeline that detects faces in video, trains embeddings on a known set, and identifies people live — from dataset to inference in one reproducible notebook.",
    summary:
      "A complete face identification pipeline — detect faces in video, train embeddings on a known set, then identify people in real time — from dataset to inference in one reproducible notebook.",
    role: "CV Engineer",
    status: "COMPLETE",
    category: "CVPR",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/face-recognition-thumbnail.webp",
    github: "https://github.com/Saji-d/face-recognition-system",
    stack: ["Python", "OpenCV", "FaceNet"],
  },
  {
    slug: "spark-powerhouse-gym-csharp",
    name: "SparkPowerhouse Gym Desktop",
    tagline: "Windows gym management application separating member and admin workflows for memberships, payments, and daily records in a role-aware system.",
    summary:
      "A Windows gym-management app that separates member and admin workflows — memberships, payments, and daily records kept in one role-aware system.",
    role: "Desktop Developer",
    status: "COMPLETE",
    category: "Desktop",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/sparkpowerhouse-gym-desktop-thumbnail.webp",
    github: "https://github.com/Saji-d/spark-powerhouse-gym-csharp",
    stack: ["C#", "WinForms", "SQL Server"],
  },
  {
    slug: "3d-city-simulation",
    name: "3D Procedural City Generator",
    tagline: "Procedurally generated 3D city with dynamic day-night lighting, rain and snow effects, and functioning traffic-light logic in a pure graphics showcase.",
    summary:
      "A 3D procedurally laid-out city with dynamic day/night lighting, rain and snow, and working traffic-light logic — a pure graphics engineering showcase.",
    role: "Graphics Engineer",
    status: "COMPLETE",
    category: "Graphics",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/three-d-city-thumbnail.webp",
    github: "https://github.com/Saji-d/3d-city-simulation-opengl",
    stack: ["C++", "OpenGL", "SFML"],
    problem: [
      "Computer graphics coursework needed to demonstrate mastery of the full graphics pipeline — geometry, lighting, and interaction — rather than a single static scene.",
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
      { src: "/images/3d-city/day-mode.webp", alt: "Simulation City in daylight" },
      { src: "/images/3d-city/night-mode.webp", alt: "Simulation City at night" },
      { src: "/images/3d-city/rain-mode.webp", alt: "Simulation City under rain" },
      { src: "/images/3d-city/snow-mode.webp", alt: "Simulation City in snow" },
      { src: "/images/3d-city/traffic-light-red.webp", alt: "Traffic light state: red" },
      { src: "/images/3d-city/traffic-light-green.webp", alt: "Traffic light state: green" },
    ],
    nextSteps: [
      "Add textured buildings and reflections for a stronger visual pass.",
    ],
  },
  {
    slug: "spark-powerhouse-gym-web",
    name: "SparkPowerhouse Gym Web",
    tagline: "Web-based gym management system with distinct member and admin areas for class bookings, memberships, and billing in one session-driven application.",
    summary:
      "A web gym-management simulation with distinct member and admin areas — class booking, memberships, and billing kept in one session-driven application.",
    role: "Web Developer",
    status: "COMPLETE",
    category: "Web",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/sparkpowerhouse-gym-web-thumbnail.webp",
    github: "https://github.com/Saji-d/spark-powerhouse-gym-web",
    stack: ["PHP", "JavaScript", "CSS", "MySQL"],
  },
  {
    slug: "employee-family-registry",
    name: "Employee & Family Registry",
    tagline: "Employee registry with family relationship trees, full-text search, and on-demand PDF CV and list exports in one polished API-driven workspace.",
    summary:
      "An employee registry with family-relationship trees, full-text search, and on-demand PDF CV and list exports — one API serving a polished workspace.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Desktop",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/employee-registry-thumbnail.webp",
    github: "https://github.com/Saji-d/employee-family-registry",
    stack: ["C#", "SQL Server"],
  },
  {
    slug: "my-wedding-invitation",
    name: "Interactive Wedding Invitation",
    tagline: "Cinematic digital wedding invitation with RSVP, live countdown, polaroid gallery, and venue maps — designed and deployed as a live experience.",
    summary:
      "A cinematic digital wedding invitation with RSVP, live countdown, polaroid gallery, and venue maps — designed from scratch and deployed live.",
    role: "Creative Developer",
    status: "COMPLETE",
    category: "Creative",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/wedding-thumbnail.webp",
    github: "https://github.com/Saji-d/my-wedding-invitation",
    demo: "https://sajid-weds-dilruba.vercel.app",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    slug: "online-bookstore-database-design",
    name: "Online Bookstore Database",
    tagline: "Fully normalized relational design for an online bookstore mapping every entity and dependency, ready to run catalog, orders, and inventory queries.",
    summary:
      "A fully normalized relational design for an online bookstore — every entity mapped, every dependency resolved, and the queries that run catalog, orders, and inventory.",
    role: "Database Designer",
    status: "COMPLETE",
    category: "Database",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/database-thumbnail.webp",
    github: "https://github.com/Saji-d/online-bookstore-database-design",
    stack: ["SQL", "Normalization", "ER Diagram"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getCaseStudyProjects(): Project[] {
  return projects.filter((p) => p.caseStudy);
}
