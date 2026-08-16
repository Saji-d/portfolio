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
  contribution?: string[];
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
      "A team-built, audit-ready invoice operations platform: capture → OCR extraction → normalization → validation → duplicate and fraud checks → human approval → a cryptographic on-chain seal of the exact uploaded bytes → billing sync, end to end for finance teams.",
    role: "AI/ML Engineer · AI extraction service",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/invoicepilot-thumbnail.webp",
    caseStudy: true,
    stack: ["React", "Fastify", "FastAPI", "PostgreSQL", "BullMQ", "Solidity"],
    problem: [
      "Bookkeeping firms process invoices by hand: transcribing totals, matching purchase orders, and hunting for duplicates, an error-prone paper trail that takes hours and leaves no proof of what was actually done.",
      "Duplicate payments and fraud slip through because there is no structured audit trail, and any claim that an invoice was processed rests on someone's word.",
      "Generic extraction tools pull fields but cannot vouch that the extracted data matches the file, so automation stops before approval, exactly where the hours get saved.",
    ],
    solution: [
      "InvoicePilot is a team-built platform for audit-ready invoice operations. A React frontend handles upload, extraction review, and approval; a Fastify API coordinates the workflow; the FastAPI invoice-ai-service performs OCR extraction, normalization, and validation; BullMQ workers run duplicate checks, fraud checks, and the on-chain seal; and a SolidInvoice sync worker hands approved invoices to billing. Auth is Supabase; the database is PostgreSQL with row-level security.",
      "One end-to-end pipeline runs per document: capture → extraction → normalization → duplicate, business, and fraud checks → human approval → on-chain cryptographic seal → accounting sync. A sha-256 of the exact uploaded bytes is the document's identity, re-verified by the AI service, so a seal can never cover a file that doesn't match its hash.",
      "OCR and sealing are deliberately one pipeline: what the OCR extracts is what gets sealed on-chain. Two ingest routes (sync and async) fold onto the same invoices row through a single shared, frozen mapper, so the same document always produces the same on-chain hash.",
      "Async work runs on BullMQ queues (extraction, duplicate-check, anomaly-check, blockchain-seal, solidinvoice-sync) while PostgreSQL row-level security FORCE policies keep every tenant's data isolated at the database, not the ORM.",
    ],
    contribution: [
      "I built the invoice-ai-service, the platform's extraction backbone: a FastAPI pipeline that turns an uploaded invoice into a structured, validated record: R2 ingest → OCR → transform → normalize → validate → persist.",
      "Designed the provider-agnostic OCR layer (base provider plus a Mindee V2 adapter and a local Tesseract provider) so the extraction engine can swap OCR vendors without touching app code, and integrated the OCR path with Cloudflare R2 storage.",
      "Authored the structured invoice schema and the normalization/transformer services (money normalization, field coercion), including the {value, confidence, present} field contract the frontend's extraction review consumes.",
      "Implemented the validation layer and the 12-rule business scoring (empty invoice, non-positive totals, date/currency mismatches, OCR-confidence floors, duplicate line items, and more).",
      "Implemented duplicate detection (exact match on normalized vendor + invoice number + date per tenant) and the fraud rule set: 9 historical/statistical rules with risk levels that flag amount spikes, invoice-number/counterpart mismatches, and repeated-volume patterns once enough history exists.",
      "My invoice-ai-service history was merged into the team monorepo and continues as the extraction backbone; the rest of the stack (frontend, API, worker, contracts, billing sync) was built by teammates.",
    ],
    architecture: [
      "  Frontend (Vite + React) · Supabase auth · Cloudflare R2",
      "        │  multipart upload / presigned R2 URL",
      "        ▼",
      "  Fastify API · JWT (Supabase JWKS) · RBAC · rate-limit · audit log",
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
      "  PostgreSQL 17 · RLS FORCE · NOBYPASSRLS service role",
      "        │",
      "        ▼",
      "  SealRegistry.sol (Base Sepolia)",
      "   { recordHash, recordType, sealedAt, sealedBy } · append-only, no PII",
    ],
    decisions: [
      {
        title: "Hash-only on-chain (privacy by design)",
        body: "The contract stores only {recordHash, recordType, sealedAt, sealedBy}, never amounts, PII, or vendor data. Each hash is sha-256 over RFC 8785 (JCS) canonical JSON (NFC-normalized, money in integer minor units) tagged with a versioned domain string, so a document can be verified without any sensitive data leaving its owner's control.",
      },
      {
        title: "The frozen anti-fabrication mapper",
        body: "The AI service emits {value: 0.0, present: false} for a field it never found. The one shared mapper omits any key the extractor did not produce instead of writing a zero, so a $0 invoice invented from a default can never reach an approver, let alone a seal. It is deliberately frozen in shared-types so both ingest routes seal identical bytes.",
      },
      {
        title: "RLS FORCE + service-role split",
        body: "Tenant isolation is enforced at the database, not the ORM. The API sets per-request GUCs, the worker connects with app.current_role='service' under a NOBYPASSRLS production role, and FORCE ROW LEVEL SECURITY keeps reads tenant-scoped however the query is written.",
      },
      {
        title: "AES-256-GCM for PII at rest",
        body: "Vendor bank details and firm tax IDs are encrypted field-level with aes-256-gcm, stored hex-serialized, and tied to a referenced KMS key alias. Decryption happens only where a route genuinely needs the plaintext. The rest of the system never sees it.",
      },
      {
        title: "Versioned, frozen approval hashes",
        body: "The hashing kernel lives in shared-types behind a versioned domain tag (invoicepilot/approval/v1). v1 seals must stay verifiable forever, so a changed sealed-field set ships as approval-v2 rather than an edit to the payload builder.",
      },
      {
        title: "Verify never writes",
        body: "The public verify path recomputes sha-256 in-process and calls a keyless view function on-chain: no DB write, no audit row, no signer. Every outcome (match, mismatch, not-yet-sealed, chain error, payload error) resolves explicitly and never throws.",
      },
    ],
    highlights: [
      {
        title: "The hash kernel: one payload becomes a bytes32",
        code: `// shared-types/src/canonical.ts: the backend-agnostic seal core.
// recordHash = '0x' + sha256( domainTag + '\\n' + canonicalJSON(payload) )
export function computeRecordHash(
  payload: unknown,
  domainTag: string,
): \`0x\${string}\` {
  return \`0x\${sha256Hex(domainTag + '\\n' + canonicalJSON(payload))}\`;
}`,
        caption: "RFC 8785 (JCS) canonical JSON + a versioned domain tag make the hash deterministic across languages: the Python service extracts, TypeScript seals, Solidity verifies.",
      },
      {
        title: "The anti-fabrication rule (frozen mapper)",
        code: `// AI emits { value: 0.0, present: false } for fields it never found.
// A mapper checking only typeof value === 'number' writes amount 0,
// marks the invoice approvable; then it gets SEALED ON-CHAIN.
// So every key is OMITTED unless the extractor produced it:
export interface ExtractedInvoiceFields {
  vendorName?: string;       // nfc'd, varchar(255)
  invoiceNumber?: string;    // nfc'd, varchar(128)
  amount?: string;           // fixed-4 decimal, numeric(19,4)
  currency?: string;         // /^[A-Z]{3}$/
  lineItems?: NormalizedLineItem[]; // jsonb, sealed as-stored
}`,
        caption: "An invoice with no extracted total is never handed to an approver: the exact $0-invoice-sealed bug this branch exists to kill.",
      },
      {
        title: "The single on-chain write, with a fee policy",
        code: `// seal.ts: the only tx this worker ever pays for.
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
  throw new Error('seal: chain is expensive; not submitting, retry later');
}
const txHash = await walletClient.writeContract({
  address: SEAL_CONTRACT_ADDRESS, abi: sealRegistryAbi,
  functionName: 'sealRecord',
  args: [recordHash, RECORD_TYPE_APPROVAL],
  maxFeePerGas: fees.maxFeePerGas,
  maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
});`,
        caption: "The tip is our number, not the RPC's. A seal is never urgent, so over a hard fee cap the job waits for a cheaper block instead of overpaying.",
      },
    ],
    metrics: [
      { value: "700", label: "API tests (Fastify suite)" },
      { value: "160", label: "AI-service tests" },
      { value: "12+9", label: "business + fraud rules" },
      { value: "4", label: "BullMQ queues" },
      { value: "78.6k", label: "gas per on-chain seal" },
      { value: "2", label: "OCR providers (Mindee + local)" },
    ],
    screenshots: [
      { src: "/images/invoicepilot/invoice-gpt.webp", alt: "Structured extraction sample from an invoice" },
      { src: "/images/invoicepilot/invoice-1.webp", alt: "Sample invoice processed by the pipeline" },
      { src: "/images/invoicepilot/invoice-2.webp", alt: "Sample invoice line data" },
    ],
    nextSteps: [
      "Reconcile schema drift: base SQL defines 7 invoice_status values, the code enum has 12, the SOC 2 spec lists 15. Align before the base schema is ever re-imported.",
      "Add a per-currency minor-unit exponent table (JPY=0, BHD=3) before any non-2-decimal currency reaches production.",
      "Backfill pre-006 rows and replace the rule-based anomaly placeholder with the planned Isolation Forest path.",
      "Public demo environment with seeded sample invoices so the pipeline is explorable without credentials.",
    ],
  },
  {
    slug: "fumak-inventory",
    name: "Inventory Management System",
    tagline: "Production inventory and point-of-sale system for a retail operation: a phone barcode scanner feeds a web app that manages products, stock, sales, and revenue analytics over the shop's local network.",
    summary:
      "A two-part system for a real retail shop: an Android barcode scanner (CameraX + ML Kit, on-device decode) pairs over the shop's LAN with a Next.js web app that owns all product, stock, sales, and analytics data in a Postgres database, covering the full sell flow from scan to checkout to revenue reporting.",
    role: "Full-stack Engineer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/fumak-thumbnail.webp",
    caseStudy: true,
    github: "https://github.com/Saji-d/fumak-inventory",
    stack: ["Kotlin", "Jetpack Compose", "Next.js", "Neon PostgreSQL", "Prisma", "Cloudflare R2"],
    problem: [
      "A single-shop retail business kept inventory and revenue on paper and in memory: stock counts drifted, and nobody could say how much revenue a given period actually produced.",
      "The products already carry manufacturer barcodes, so generating new labels was never the answer: the shop just had no way to read those barcodes at the counter and tie a scan to a stock count or a sale.",
      "A general-purpose POS or accounting suite was the wrong size of solution: the shop needed a narrow inventory + point-of-sale companion where a phone scans while a desktop or tablet runs the shop, without adopting a full accounting system.",
    ],
    solution: [
      "The system is two-part, talking over the shop's local network. The Android app is a thin barcode-scanner remote: CameraX + Google ML Kit decode barcodes on-device, and the app POSTs each value to the desktop web app, which holds no database of its own.",
      "The Next.js web app is the actual inventory, POS, and analytics application. It owns all data in a Neon PostgreSQL database (via Prisma), stores product photos in Cloudflare R2, and is where a staff member runs the shop from a browser while a phone on the counter feeds it scanned barcodes in real time.",
      "The product catalog covers name, category, color, size/variant, buying and selling prices, stock, barcode, and photo. Every stock change (add, remove, adjust-to-counted-value, and automatic deductions from a sale) is written to a full inventory-transaction audit log with the resulting stock level snapshotted on each entry.",
      "The POS checkout builds a multi-item cart (with per-line discounts), computes total / amount due / change live, then completes in one atomic database transaction: sale header + line items inserted, stock decremented, and a SALE inventory transaction logged per item. Dashboard KPIs and period-filtered revenue analytics (Today / Month / 3M / 6M / Year / custom) aggregate over the same ledger.",
    ],
    contribution: [
      "I designed and built the system end-to-end as the sole developer: the Android scanner remote (CameraX + ML Kit on-device decoding, saved desktop connection profiles, LAN heartbeat) and the Next.js web app (Prisma schema, inventory audit log, atomic POS checkout, dashboard and revenue analytics).",
      "I owned the LAN integration contract between the two apps: the /api/scanner/events short-polling feed that turns a phone scan into a live product lookup at the counter, including the connected/disconnected heartbeat state shown in the POS.",
      "I defined the data model (products, inventory transactions, sales, sale items, settings) with money stored as integer poisha, and the checkout/analytics logic over it.",
    ],
    architecture: [
      "┌──────────────────────────┐      LAN Wi-Fi (HTTP POST)      ┌─────────────────────────────────┐",
      "│ Scanner Remote (Android) │  /api/scanner/events              │  Web App (Next.js 16)            │",
      "│  CameraX + ML Kit        │ ────────────────────▶  { type:   │  In-memory scan queue            │",
      "│  on-device barcode decode│     \"scan\", barcode, format }   │  /sales live scan feed → cart →  │",
      "│  connection profiles     │    + periodic heartbeat          │  checkout                        │",
      "│  (name, IP, port)        │                                   │  Prisma ORM                      │",
      "└──────────────────────────┘                                   │       │                          │",
      "                                                               │       ▼                          │",
      "                                                               │  Neon PostgreSQL                 │",
      "                                                               │  (products, inventory txns,      │",
      "                                                               │   sales, sale items, settings)   │",
      "                                                               │  Cloudflare R2 (product photos)  │",
      "                                                               └─────────────────────────────────┘",
    ],
    decisions: [
      {
        title: "Data lives in the web app, not the phone",
        body: "The scanner is deliberately stateless: it only decodes a barcode and POSTs it to the desktop's LAN IP and port. All business logic, validation, and persistence live in the Next.js API routes, so the phone never touches the database or object storage directly.",
      },
      {
        title: "Stock is an audit ledger, not a number",
        body: "Every stock-affecting event (ADD, REMOVE, ADJUST, or the automatic SALE deduction) is an InventoryTransaction row with the resulting stock level snapshotted on each entry, so the current count is provable from history rather than a mutable field.",
      },
      {
        title: "Atomic checkout",
        body: "Completing a sale inserts the header and line items, decrements stock, and logs the SALE inventory transactions in a single database transaction. Prices are snapshotted at sale time, so historical gross-profit figures stay correct even after a product's prices later change.",
      },
      {
        title: "Integer poisha, never floats",
        body: "Monetary fields are stored as integer poisha (1/100 BDT) rather than floating point, so summing sales can never drift into rounding error.",
      },
      {
        title: "Soft-delete products only",
        body: "Products are archived, never hard-deleted, so historical sales stay intact and the ledger remains fully reconcilable.",
      },
    ],
    highlights: [
      {
        title: "The LAN scan contract",
        code: `// Android scanner → desktop web app, one fire-and-forget POST:
POST http://<desktop-ip>:<port>/api/scanner/events
  { type: "scan", barcode: "1234567890123", format: "EAN_13" }
  { type: "heartbeat" }   // keeps the POS "Connected" badge alive

// /sales page short-polls GET /api/scanner/events?since=<id>
// and resolves each arriving barcode against the product catalog.`,
        caption: "Decoding is on-device (ML Kit) and needs no network; only the decoded value is sent onward, so the scan feed works entirely over the shop's LAN.",
      },
      {
        title: "One transaction per sale",
        code: `Checkout, in a single DB transaction:
  insert Sale        (header: total, paid, due, change, payment type)
  insert SaleItem ×N (selling price / buying cost / discount snapshotted)
  decrement Product.stock ×N
  insert InventoryTransaction(SALE, signed delta, resulting stock) ×N

receipt.invoiceNumber = \`INV-\${year}-\${saleId}\``,
        caption: "A sale and its inventory effect can never diverge: the commit that writes the sale also deducts stock and logs the ledger entries.",
      },
      {
        title: "Scan-to-sale pipeline",
        code: `Phone Camera
   │
   ▼
CameraX (image analysis stream)
   │
   ▼
Google ML Kit Barcode Scanning (on-device decode)
   │
   ▼
BarcodeSender ── POST /api/scanner/events ──▶ /sales live scan panel
   │
   ▼
Product Lookup ── not found ──▶ Register New Product
   │ found
   ▼
Add to Cart ──▶ qty / discount ──▶ Checkout ──▶ Dashboard + Analytics`,
        caption: "One continuous path from a physical barcode to a recorded sale and its revenue figures.",
      },
    ],
    metrics: [
      { value: "2", label: "apps: Android scanner + web" },
      { value: "8", label: "barcode formats (EAN/UPC/CODE/QR)" },
      { value: "5", label: "Prisma data models" },
      { value: "4", label: "stock event types" },
      { value: "5", label: "areas: dashboard, products, inventory, POS, analytics" },
      { value: "LAN", label: "phone ↔ desktop pairing" },
    ],
    screenshots: [],
    nextSteps: [
      "Authentication and user roles (currently any device on the LAN can operate the app).",
      "An automated test suite; verification is currently manual and on-device.",
      "Supplier management and partial-payment / credit (debtor) tracking.",
      "Remote (non-LAN) scanner pairing and multi-shop / multi-location support.",
    ],
  },
  {
    slug: "casevault",
    name: "CaseVault",
    tagline: "Privacy-first legal research workspace that ingests case documents, ranks search results by relevance, and provides AI-generated summaries with verifiable citations.",
    summary:
      "Privacy-first legal research for Bangladeshi law firms: ingest case documents, search with relevance-ranked results, and read with AI tabs for summaries and citations, built around 'verify, don't trust AI.'",
    role: "Full-Stack / AI Engineer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/casevault-thumbnail.webp",
    caseStudy: true,
    stack: ["GraphRAG", "Neo4j", "Qdrant", "FastAPI", "LLMs"],
    problem: [
      "Bangladeshi law firms work with thousands of handwritten and scanned documents, losing annotations and struggling to find relevant precedents.",
      "Generic AI chatbots hallucinate citations, and firms cannot upload confidential client files to public AI tools without risking privacy.",
    ],
    solution: [
      "CaseVault Phase 1 is a working MVP: a FastAPI backend ingests markdown legal documents (front-matter metadata) into SQLite, with repositories that score document relevance per query and a full-text search API.",
      "The Next.js frontend is a dark-theme research workspace: hero search, live stats, category cards, a document reader with AI tabs (summary / ask / citations / related), query highlighting, and an XSS-safe hand-rolled markdown renderer.",
      "Phase 2 is fully designed (Project SynthGraph): Qdrant semantic search + Neo4j knowledge graph with Leiden community detection, Celery pipelines for OCR → chunking → embeddings, and sub-graph context injected into a reranker, targeting ~790ms to first token.",
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
        body: "The reader renderer is hand-rolled and output-sanitized rather than pulling in a full markdown engine: small surface, safe by default for legal content.",
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
    slug: "ledgerturf",
    name: "LedgerTurf",
    tagline: "Real-time turf booking platform that lets players discover and reserve grounds on a map while owners publish and manage slots with overlapping-time protection.",
    summary:
      "Real-time turf booking for Dhaka: players find grounds on a map, owners publish slots, and every reservation is protected by an overlap check, live in production on Vercel.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Professional",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/ledgerturf-thumbnail.webp",
    caseStudy: true,
    github: "https://github.com/Saji-d/ledgerturf",
    demo: "https://ledgerturf.vercel.app",
    stack: ["Next.js", "TypeScript", "Mapbox"],
    problem: [
      "Turf owners in Dhaka booked slots over phone and WhatsApp: double-booking was routine, availability was never current, and players had no way to compare grounds.",
      "Timezones and 24-hour clock confusion made 'is this slot free right now' a genuinely hard query to answer correctly.",
    ],
    solution: [
      "LedgerTurf is a monorepo (npm workspaces) with an Express REST API and a React SPA. Players discover turfs on a geo-indexed map, owners publish and manage slots, and admins get full visibility, with JWT auth and role-based access at every layer.",
      "Slots are protected with an overlap check inside a Mongoose transaction session, and availability is computed in UTC with Bangladesh's UTC+6 offset handled explicitly, so 'available now' means the same thing to everyone.",
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
        body: "Turf locations are stored as GeoJSON and indexed with MongoDB's 2dsphere index for radius-based discovery: the spatial query is commented out in production for Vercel stability but the index and model are in place.",
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
    slug: "neuro-screen",
    name: "Neuro-Screen",
    tagline: "Hybrid CatBoost + ANN framework that screens cognitive-impairment risk in insomniac university students from a self-reported lifestyle questionnaire, with explainable predictions.",
    summary:
      "Undergraduate thesis (AIUB) fusing a CatBoost gradient-boosting classifier with a three-layer PyTorch MLP, blended by averaging their probabilities. Trained on 2,237 survey responses, the hybrid reaches 95.20% accuracy / 0.982 ROC-AUC and explains every prediction through its contributing factors. Ships as an interactive Streamlit research prototype.",
    role: "ML / DL Researcher",
    status: "COMPLETE",
    category: "Research",
    badges: [],
    featured: true,
    cover: "/images/thumbnails/neuro-screen-thumbnail.webp",
    github: "https://github.com/Saji-d/neuro-screen",
    demo: "https://neuro-screen.streamlit.app/",
    stack: ["Python", "CatBoost", "PyTorch", "Streamlit"],
  },
  {
    slug: "finbert",
    name: "FinBERT",
    tagline: "Comparative study proving domain-tuned transformers outperform generic models on financial sentiment, with a full fine-tuning-to-evaluation pipeline in a single notebook.",
    summary:
      "A comparative study proving domain-tuned transformers beat generic models on financial jargon: fine-tuned FinBERT and BERT on earnings and market text, with the full training-to-evaluation pipeline in one notebook.",
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
    name: "CodingVibes",
    tagline: "Interactive Java learning platform featuring courses, quizzes, and progress tracking built around a clean event-driven architecture with persistent state.",
    summary:
      "An interactive learning platform with courses, quizzes, and progress tracking, engineered around a clean event-driven architecture with persistent state behind every screen.",
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
    tagline: "Real-time face identification pipeline that detects faces in video, trains embeddings on a known set, and identifies people live, from dataset to inference in one reproducible notebook.",
    summary:
      "A complete face identification pipeline: detect faces in video, train embeddings on a known set, then identify people in real time, from dataset to inference in one reproducible notebook.",
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
    slug: "3d-city-simulation",
    name: "3D City Simulator",
    tagline: "Procedurally generated 3D city with dynamic day-night lighting, rain and snow effects, and functioning traffic-light logic in a pure graphics showcase.",
    summary:
      "A 3D procedurally laid-out city with dynamic day/night lighting, rain and snow, and working traffic-light logic, a pure graphics engineering showcase.",
    role: "Graphics Engineer",
    status: "COMPLETE",
    category: "Graphics",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/three-d-city-thumbnail.webp",
    github: "https://github.com/Saji-d/3d-city-simulation-opengl",
    stack: ["C++", "OpenGL", "SFML"],
    problem: [
      "Computer graphics coursework needed to demonstrate mastery of the full graphics pipeline (geometry, lighting, and interaction) rather than a single static scene.",
    ],
    solution: [
      "The simulator builds an entire block grid with buildings, roads, and vehicles. A day/night cycle interpolates ambient and directional light; weather modes toggle particle rain and snow; and traffic lights cycle red → green with keyboard-controlled camera navigation.",
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
        caption: "Snow falls slowly and drifts; rain falls fast. One particle system, two parameter sets.",
      },
    ],
    metrics: [
      { value: "6", label: "rendered modes (day, night, rain, snow, traffic)" },
      { value: "1", label: "scene graph for all state" },
      { value: "WASD", label: "free camera controls" },
    ],
    screenshots: [
      { src: "/images/3d-city/day-mode.webp", alt: "3D City Simulator in daylight" },
      { src: "/images/3d-city/night-mode.webp", alt: "3D City Simulator at night" },
      { src: "/images/3d-city/rain-mode.webp", alt: "3D City Simulator under rain" },
      { src: "/images/3d-city/snow-mode.webp", alt: "3D City Simulator in snow" },
      { src: "/images/3d-city/traffic-light-red.webp", alt: "Traffic light state: red" },
      { src: "/images/3d-city/traffic-light-green.webp", alt: "Traffic light state: green" },
    ],
    nextSteps: [
      "Add textured buildings and reflections for a stronger visual pass.",
    ],
  },
  {
    slug: "spark-powerhouse-gym-csharp",
    name: "Spark Powerhouse",
    tagline: "Windows gym management application separating member and admin workflows for memberships, payments, and daily records in a role-aware system.",
    summary:
      "A Windows gym-management app that separates member and admin workflows: memberships, payments, and daily records kept in one role-aware system.",
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
    slug: "employee-family-registry",
    name: "Employee & Family Registry",
    tagline: "Employee registry with family relationship trees, full-text search, and on-demand PDF CV and list exports in one polished API-driven workspace.",
    summary:
      "An employee registry with family-relationship trees, full-text search, and on-demand PDF CV and list exports, one API serving a polished workspace.",
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
    tagline: "Cinematic digital wedding invitation with RSVP, live countdown, polaroid gallery, and venue maps, designed and deployed as a live experience.",
    summary:
      "A cinematic digital wedding invitation with RSVP, live countdown, polaroid gallery, and venue maps, designed from scratch and deployed live.",
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
    name: "Bookstore Database",
    tagline: "Fully normalized relational design for an online bookstore mapping every entity and dependency, ready to run catalog, orders, and inventory queries.",
    summary:
      "A fully normalized relational design for an online bookstore: every entity mapped, every dependency resolved, and the queries that run catalog, orders, and inventory.",
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
