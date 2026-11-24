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
  /** Organisation or client the work was delivered for. */
  attribution?: string;
  /** "private" / "unavailable" render a non-interactive locked GitHub icon; omit the github URL for these. */
  repoAccess?: "public" | "private" | "unavailable";
  demo?: string;
  thesis?: string;
  stack: string[];
  /** Stack intended but not yet built; rendered after the confirmed stack. */
  plannedStack?: string[];
  featuredTagline?: string;
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
    slug: "voicecon",
    attribution: "Client Project",
    repoAccess: "private",
    name: "VoiceCon",
    tagline: "Android-first AI voice calling that converts your voice live on a GPU and delivers it over a normal phone call.",
    summary:
      "An Android app, a billing-aware backend, an admin panel, a realtime media gateway and a Seed-VC GPU worker, bridged through Twilio so a call's audio is converted live and delivered over the phone network. If conversion ever fails the call ends, so the caller's raw voice is never sent to the recipient.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Professional",
    badges: ["Production"],
    featured: false,
    cover: "/images/thumbnails/voicecon-cover-3.webp",
    demo: "https://voicecon.app/",
    caseStudy: true,
    stack: ["Kotlin", "Jetpack Compose", "Fastify", "Prisma", "PostgreSQL", "Twilio", "Python", "PyTorch", "Seed-VC", "React", "Vite", "Hilt", "Retrofit", "RunPod"],
    featuredTagline: "Android-first AI voice calling: live speech is converted on a GPU into an authorized voice and delivered over a normal phone call, via a Twilio bridge that ends the call rather than ever forwarding raw audio.",
    problem: [
      "Changing a voice during a phone call has to happen in real time: the converted audio must reach the recipient with conversational latency, over a normal phone line, from a phone app.",
      "Twilio's media streams return audio only to the call leg they run on, so a single leg that dials the phone network cannot carry converted audio to the recipient.",
      "Voice conversion is sensitive. A caller may only speak as a voice profile they are authorized to use, every conversion minute has to be metered against a package or credits, and a failure must never expose the caller's real voice to the other person.",
      "Realtime GPU inference is expensive and bursty, so the system has to be measured, not guessed: which card, how many diffusion steps, how large a block and how much delay is acceptable.",
    ],
    solution: [
      "VoiceCon splits the product into a control plane and a media plane. A Fastify and Prisma backend on PostgreSQL owns accounts, KYC, voice profiles, packages, credits and call authorization. A Python asyncio gateway handles realtime audio over Twilio Media Streams, and a GPU worker runs Seed-VC inference. The backend never touches audio packets, and the gateway and worker never decide billing or authorization: they ask the backend over HMAC-signed internal APIs.",
      "Each call is a two-leg bridge. The Android app places a VoIP leg into Twilio, the gateway streams that audio to the GPU worker as 16 kHz PCM, and the converted audio goes out on a second leg that dials the recipient on the phone network. The recipient's voice returns to the caller as passthrough. The backend dials the second leg only after the first is authorized and a GPU session is ready, so the recipient never hears dead air.",
      "Conversion fails safe: if the worker errors or disconnects, the bridge enters a failed state, clears the recipient-side audio queue, reports the error and tears the call down. There is no code path that routes the caller's raw audio to the recipient.",
      "Money is handled like a ledger: package minutes are spent first, then credits, every change is an append-only row written under a wallet row lock with an idempotency key, and call deadlines are derived from stored timestamps so a reconciler can enforce them even after a restart.",
    ],
    contribution: [
      "I build across the stack: the Kotlin and Jetpack Compose Android app (dialer, Voice Studio, Voice Lab, profile, KYC and package flows), the backend call, billing and credit services with their tests, the React admin panel, and the deployment, migration and RunPod bootstrap tooling.",
      "I wrote the access rules around calls and conversion (KYC, an active package, callable minutes, an approved and owned voice) and the user-facing messaging that explains why something is unavailable, with a shortcut to the packages screen.",
      "I ran the GPU benchmarks and the quality and latency sweeps that picked the card and the streaming settings, and I documented the results.",
    ],
    architecture: [
      "Android ──VoIP──▶ Twilio leg A ──Connect/Stream──▶ Gateway ──PCM 16k──▶ GPU worker (Seed-VC)",
      "                                                       │◀──converted PCM──┘",
      "Recipient ◀─PSTN── Twilio leg B ◀──Connect/Stream──────┘   (A converted → B)",
      "                   leg B audio ──▶ Gateway ──▶ leg A   (recipient voice → caller, passthrough)",
      "",
      "Control plane: Fastify + Prisma + PostgreSQL (accounts, KYC, voice profiles, packages, credits, call state machine, audit log)",
      "Media plane: Python asyncio gateway + GPU worker on RunPod (model loaded once, kept in VRAM)",
      "Admin panel (React + Vite)  ·  HMAC-signed internal APIs between gateway, worker and backend",
    ],
    decisions: [
      {
        title: "Control plane and media plane stay separate",
        body: "The backend decides who may convert and how many minutes remain; the gateway and worker only move and transform audio. Keeping billing and authorization out of the audio path means a slow database call can never glitch a live call.",
      },
      {
        title: "Fail safe on conversion errors",
        body: "If voice conversion fails mid-call, the bridge clears the recipient's audio queue, flushes what Twilio has buffered and ends the call. A fallback to the caller's real voice was rejected on purpose: it is exactly what the product must never do.",
      },
      {
        title: "PostgreSQL is the only source of truth",
        body: "Credits and call state live in the database. Call deadlines are derived from connected_at plus the maximum duration, so a reconciler can end a call even if an in-process timer is lost. Redis was deliberately left out to keep one source of truth.",
      },
      {
        title: "A ledger, not a counter",
        body: "Every credit change is an append-only row that stores the balance after it, written inside a transaction that locks the wallet row and checks an idempotency key twice. A retried request or duplicate webhook cannot charge twice, and any balance can be explained from its history.",
      },
      {
        title: "Signed internal APIs",
        body: "Gateway and backend authenticate each other with HMAC over the timestamp, method, path and body hash, reject requests older than 60 seconds and compare signatures in constant time. Public WebSocket streams use per-call, per-leg tokens that can be authorized once.",
      },
      {
        title: "Pick the GPU from a benchmark",
        body: "An RTX A5000 on RunPod ($0.27 an hour) was chosen from recorded runs of the real worker: one call per GPU at a real-time factor of about 0.5, no dropped audio over a five-minute run. The model loads once at startup so a call never pays load time.",
      },
      {
        title: "Measure quality, then tune",
        body: "A later sweep varied diffusion steps, block size, lookahead, prompt length and context one at a time, then re-scored the outputs with independent speaker encoders. One tuned configuration cut server-side delay by about 95 ms with equal or better similarity.",
      },
    ],
    highlights: [
      {
        title: "The two-leg bridge",
        code: `Android ──VoIP──▶ Twilio leg A ──<Connect><Stream>──▶ Gateway ──PCM16k──▶ GPU worker (Seed-VC)
                                                          │◀──converted PCM──┘
Recipient ◀─PSTN── Twilio leg B ◀──<Connect><Stream>──────┘   (A converted → B)`,
        caption: "A media stream returns audio only to its own leg, so converted audio is carried to the recipient on a second leg that the backend dials only after leg A is authorized and a GPU session is ready.",
      },
      {
        title: "Fail safe by construction",
        code: `# gateway/voicecon_gateway/bridge.py
A -> worker -> B : converted audio only.
B -> A           : passthrough.

FAIL-CLOSED: once the worker errors or disconnects the bridge enters FAILED;
from then on nothing derived from leg A can reach leg B (the B pacer queue is
cleared and only silence is paced until the sockets close).`,
        caption: "Leg A audio is only ever passed to the worker, and leg B receives only what the worker returns. The pacer emits silence if conversion is interrupted.",
      },
      {
        title: "Billing arithmetic",
        code: `// backend/src/calls/billing.ts
billableMinutes    = ceil(durationSeconds / 60)
packageMinutesUsed = min(billableMinutes, remainingPackageMinutes)
creditMinutes      = billableMinutes - packageMinutesUsed
creditsConsumed    = creditMinutes * creditsPerMinute`,
        caption: "Billing starts when the recipient answers, never at dialing, and a call that never connects costs nothing. Settlement runs once, inside a transaction, against the package that was valid when the call was answered.",
      },
      {
        title: "Measured on the real worker",
        code: `RTX A5000, Seed-VC, 6 diffusion steps, 180 ms blocks, 5-minute run
inference p50 ~86 ms, p95 ~106 ms per 180 ms block
real-time factor 0.50, audio dropped 0 ms (11 of 1490 blocks over budget)
server-side delay ~480-500 ms (block + lookahead + crossfade + jitter buffer + inference)`,
      },
    ],
    metrics: [
      { value: "6", label: "layers: app, API, admin, gateway, GPU worker, database" },
      { value: "2", label: "Twilio legs bridged per call" },
      { value: "~85 ms", label: "GPU inference per 180 ms block (p50)" },
      { value: "~0.5 s", label: "server-side conversion delay" },
      { value: "0 ms", label: "audio dropped over a 5-minute run" },
      { value: "336", label: "backend tests, plus 53 admin and 103 Android" },
    ],
    screenshots: [
      { src: "/images/voicecon/website-home.webp", alt: "VoiceCon website: live voice conversion for phone calls" },
      { src: "/images/voicecon/app-screens.webp", alt: "VoiceCon Android app: Dialer, Voice Studio, Voice Lab and Profile (emulator, seeded demo account)" },
    ],
  },
  {
    slug: "invoicepilot",
    attribution: "Ledgercross",
    repoAccess: "private",
    name: "InvoicePilot",
    tagline: "AI invoice platform that extracts, validates and flags duplicate or anomalous invoices before they reach finance teams.",
    summary:
      "Built by a four-person team, InvoicePilot brings invoice intake, review, approval and billing into one workflow. I built the FastAPI extraction service, covering OCR, normalization, validation, duplicate detection and fraud and anomaly checks.",
    role: "AI/ML Engineer · AI extraction service",
    status: "COMPLETE",
    category: "Professional",
    badges: ["Production"],
    featured: false,
    cover: "/images/thumbnails/invoicepilot-cover-3.webp",
    caseStudy: true,
    stack: ["FastAPI", "Python", "Mindee OCR", "PostgreSQL", "Redis Streams", "Cloudflare R2"],
    featuredTagline: "AI-powered invoice platform that extracts data with OCR, validates and normalizes it and flags duplicates, fraud and anomalies before invoices reach finance teams for approval.",
    problem: [
      "Bookkeeping firms process invoices by hand: transcribing totals, matching purchase orders and hunting for duplicates, an error-prone paper trail that takes hours and leaves no proof of what was actually done.",
      "Duplicate payments and fraud slip through because there is no structured audit trail and any claim that an invoice was processed rests on someone's word.",
      "Generic extraction tools pull fields but cannot vouch that the extracted data matches the file, so automation stops before approval, exactly where the hours get saved.",
    ],
    solution: [
      "InvoicePilot is a team-built platform for audit-ready invoice operations. A React frontend handles upload, extraction review and approval; a Fastify API coordinates the workflow; the FastAPI invoice-ai-service performs OCR extraction, normalization and validation; BullMQ workers run duplicate checks, fraud checks and the on-chain seal; and a SolidInvoice sync worker hands approved invoices to billing. Auth is Supabase; the database is PostgreSQL with row-level security.",
      "One end-to-end pipeline runs per document: capture → extraction → normalization → duplicate, business and fraud checks → human approval → on-chain cryptographic seal → accounting sync. A sha-256 of the exact uploaded bytes is the document's identity, re-verified by the AI service, so a seal can never cover a file that doesn't match its hash.",
      "OCR and sealing are deliberately one pipeline: what the OCR extracts is what gets sealed on-chain. Two ingest routes (sync and async) fold onto the same invoices row through a single shared, frozen mapper, so the same document always produces the same on-chain hash.",
      "Async work runs on BullMQ queues (extraction, duplicate-check, anomaly-check, blockchain-seal, solidinvoice-sync) while PostgreSQL row-level security FORCE policies keep every tenant's data isolated at the database, not the ORM.",
    ],
    contribution: [
      "I built the invoice-ai-service, the platform's extraction backbone: a FastAPI pipeline that turns an uploaded invoice into a structured, validated record: R2 ingest → OCR → transform → normalize → validate → persist.",
      "Designed the provider-agnostic OCR layer (base provider plus the Mindee V2 adapter; teammates later added a local Tesseract provider) so the extraction engine can swap OCR vendors without touching app code and integrated the OCR path with Cloudflare R2 storage.",
      "Authored the structured invoice schema and the normalization/transformer services (money normalization, field coercion), including the {value, confidence, present} field contract the frontend's extraction review consumes.",
      "Implemented the validation layer and the 12-rule business scoring (empty invoice, non-positive totals, date/currency mismatches, OCR-confidence floors, duplicate line items and more).",
      "Implemented duplicate detection (exact match on normalized vendor + invoice number + date) and the fraud rule set: 9 historical/statistical rules with risk levels that flag amount spikes, invoice-number/counterpart mismatches and repeated-volume patterns once enough history exists.",
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
        title: "Hash-only on-chain (privacy by design) (team)",
        body: "Built by my teammates on the platform side; my AI service supplies the fields it seals. The contract stores only {recordHash, recordType, sealedAt, sealedBy}, never amounts, PII or vendor data. Each hash is sha-256 over RFC 8785 (JCS) canonical JSON (NFC-normalized, money in integer minor units) tagged with a versioned domain string, so a document can be verified without any sensitive data leaving its owner's control.",
      },
      {
        title: "The frozen anti-fabrication mapper (team)",
        body: "Built by my teammates on the platform side; my AI service supplies the fields it seals. The AI service emits {value: 0.0, present: false} for a field it never found. The one shared mapper omits any key the extractor did not produce instead of writing a zero, so a $0 invoice invented from a default can never reach an approver, let alone a seal. It is deliberately frozen in shared-types so both ingest routes seal identical bytes.",
      },
      {
        title: "RLS FORCE + service-role split (team)",
        body: "Built by my teammates on the platform side; my AI service supplies the fields it seals. Tenant isolation is enforced at the database, not the ORM. The API sets per-request GUCs, the worker connects with app.current_role='service' under a NOBYPASSRLS production role and FORCE ROW LEVEL SECURITY keeps reads tenant-scoped however the query is written.",
      },
      {
        title: "AES-256-GCM for PII at rest (team)",
        body: "Built by my teammates on the platform side; my AI service supplies the fields it seals. Vendor bank details and firm tax IDs are encrypted field-level with aes-256-gcm, stored hex-serialized and tied to a referenced KMS key alias. Decryption happens only where a route genuinely needs the plaintext. The rest of the system never sees it.",
      },
      {
        title: "Versioned, frozen approval hashes (team)",
        body: "Built by my teammates on the platform side; my AI service supplies the fields it seals. The hashing kernel lives in shared-types behind a versioned domain tag (invoicepilot/approval/v1). v1 seals must stay verifiable forever, so a changed sealed-field set ships as approval-v2 rather than an edit to the payload builder.",
      },
      {
        title: "Verify never writes (team)",
        body: "Built by my teammates on the platform side; my AI service supplies the fields it seals. The public verify path recomputes sha-256 in-process and calls a keyless view function on-chain: no DB write, no audit row, no signer. Every outcome (match, mismatch, not-yet-sealed, chain error, payload error) resolves explicitly and never throws.",
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
        caption: "Teammate code, shown for context: RFC 8785 (JCS) canonical JSON + a versioned domain tag make the hash deterministic across languages: the Python service extracts, TypeScript seals, Solidity verifies.",
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
        caption: "Teammate code, shown for context: An invoice with no extracted total is never handed to an approver: keeping the approval and sealing workflow tied to verified invoice totals.",
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
        caption: "Teammate code, shown for context: The tip is our number, not the RPC's. A seal is never urgent, so over a hard fee cap the job waits for a cheaper block instead of overpaying.",
      },
    ],
    metrics: [
      { value: "700", label: "API tests (teammates' Fastify suite)" },
      { value: "160", label: "AI-service tests (team repo)" },
      { value: "12+9", label: "business + fraud rules" },
      { value: "4", label: "BullMQ queues (teammates' worker)" },
      { value: "78.6k", label: "gas per on-chain seal (teammates' contract)" },
      { value: "2", label: "OCR providers (my Mindee adapter + a teammate's local one)" },
    ],
    screenshots: [
      { src: "/images/invoicepilot/invoice-gpt.webp", alt: "Structured extraction sample from an invoice" },
      { src: "/images/invoicepilot/invoice-1.webp", alt: "Sample invoice processed by the pipeline" },
      { src: "/images/invoicepilot/invoice-2.webp", alt: "Sample invoice line data" },
    ],
  },
  {
    slug: "fumak-inventory",
    attribution: "Ledgercross",
    repoAccess: "unavailable",
    name: "FUMAK Inventory",
    tagline: "Inventory and point-of-sale system built for FUMAK, a retail store in Chattagram, Bangladesh.",
    summary:
      "I built FUMAK’s inventory and checkout system end to end. Staff scan existing product barcodes with an Android phone and use a web app to run checkout, track stock changes and review sales across reporting periods.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Professional",
    badges: ["Production"],
    featured: false,
    cover: "/images/thumbnails/fumak-cover-3.webp",
    caseStudy: true,
    demo: "https://fumak-inventory.vercel.app/",
    stack: ["Kotlin", "Jetpack Compose", "Next.js", "Prisma", "Neon PostgreSQL", "CameraX", "ML Kit", "Cloudflare R2"],
    featuredTagline: "Android barcode scanning, inventory, checkout and sales reporting for FUMAK in Chattagram, Bangladesh.",
    problem: [
      "FUMAK, a retail store in Chattagram, Bangladesh, needed a single checkout and inventory workflow for its counter staff. The store’s products already carried manufacturer barcodes. Staff needed to scan those labels, keep stock counts current as items sold and review revenue over a selected period.",
    ],
    solution: [
      "The system is two-part, talking over the shop's local network. Staff pair an Android phone with the counter’s web app over the store’s local network. CameraX and ML Kit decode existing barcodes on the phone, then send each scan to the web app for product lookup and checkout.",
      "The Next.js web app gives staff a browser workspace for the product catalog, stock adjustments, checkout and revenue reporting. Prisma connects it to Neon PostgreSQL, and Cloudflare R2 stores product photos.",
      "The product catalog covers name, category, color, size/variant, buying and selling prices, stock, barcode and photo. Every stock change (add, remove, adjust-to-counted-value and automatic deductions from a sale) is written to a full inventory-transaction audit log with the resulting stock level snapshotted on each entry.",
      "The POS checkout builds a multi-item cart (with per-line discounts), computes total / amount due / change live, then completes in one atomic database transaction: sale header + line items inserted, stock decremented and a SALE inventory transaction logged per item. Dashboard KPIs and period-filtered revenue analytics (Today / Month / 3M / 6M / Year / custom) aggregate over the same ledger.",
    ],
    contribution: [
      "I designed and built the system end-to-end as the sole developer: the Android scanner remote (CameraX + ML Kit on-device decoding, saved desktop connection profiles, LAN heartbeat) and the Next.js web app (Prisma schema, inventory audit log, atomic POS checkout, dashboard and revenue analytics).",
      "I owned the LAN integration contract between the two apps: the /api/scanner/events short-polling feed that turns a phone scan into a live product lookup at the counter, including the connected/disconnected heartbeat state shown in the POS.",
      "I defined the data model (products, inventory transactions, sales, sale items, settings) with money stored as integer poisha and the checkout/analytics logic over it.",
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
        body: "The scanner is deliberately stateless: it only decodes a barcode and POSTs it to the desktop's LAN IP and port. All business logic, validation and persistence live in the Next.js API routes, so the phone never touches the database or object storage directly.",
      },
      {
        title: "Stock is an audit ledger, not a number",
        body: "Every stock-affecting event (ADD, REMOVE, ADJUST or the automatic SALE deduction) is an InventoryTransaction row with the resulting stock level snapshotted on each entry, so the current count is provable from history rather than a mutable field.",
      },
      {
        title: "Atomic checkout",
        body: "Completing a sale inserts the header and line items, decrements stock and logs the SALE inventory transactions in a single database transaction. Prices are snapshotted at sale time, so historical gross-profit figures stay correct even after a product's prices later change.",
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
  },
  {
    slug: "nitor-patient-management",
    attribution: "Ledgercross",
    repoAccess: "private",
    name: "NITOR Patient Management",
    tagline: "Clinical operations platform used by NITOR’s Blue-II Trauma Unit for patient records, bed occupancy and operating-theatre planning.",
    summary:
      "NITOR’s Blue-II Trauma Unit uses this platform to manage patient records, track bed occupancy and coordinate operating-theatre schedules. I built the entire frontend, including the clinical workspace and public faculty directory, and worked with a teammate on Convex backend logic for patient management and occupancy.",
    role: "Full-Stack Engineer · Frontend lead",
    status: "COMPLETE",
    category: "Professional",
    badges: ["Production"],
    featured: false,
    featuredTagline: "Clinical operations for NITOR’s Blue-II Trauma Unit, covering patient records, bed occupancy and operating-theatre rosters.",
    cover: "/images/thumbnails/dr-stone-cover.webp",
    caseStudy: true,
    demo: "https://dr-stone.vercel.app/",
    stack: ["React", "TypeScript", "Vite", "Convex", "Convex Auth", "Tailwind", "Vercel"],
    problem: [
      "NITOR’s Blue-II Trauma Unit needed a shared workspace for clinicians to coordinate patient records, bed occupancy, follow-ups and daily operating-theatre lists.",
    ],
    solution: [
      "The National Institute of Traumatology and Orthopaedic Rehabilitation’s Blue-II Trauma Unit uses the platform to maintain patient records and investigation images, manage follow-ups and discharges, and track patient occupancy across wards and beds.",
      "Doctors use an approved account to plan operating-theatre lists. Administrators can export daily rosters as PDF or JPG, with saved snapshots for historical reference. Convex subscriptions keep dashboards current across sessions.",
    ],
    contribution: [
      "I built the full React and TypeScript frontend, including the clinical management workspace and public site with a faculty directory organised by academic designation.",
      "I contributed Convex backend logic for patient records, ward and bed occupancy, and related clinical workflows, working with a teammate on implementation and integration.",
    ],
    architecture: [
      "  React + Vite + TypeScript on Vercel",
      "        │  Reactive queries and mutations",
      "        ▼",
      "  Convex database + TypeScript functions + Convex Auth",
      "   Patient records · occupancy · OT planning · roster snapshots",
    ],
    decisions: [
      {
        title: "Live clinical dashboards",
        body: "Reactive Convex queries keep clinicians’ views current when patient records or operating-theatre lists change.",
      },
      {
        title: "Historical roster snapshots",
        body: "Each export preserves the roster as it was issued so administrators can refer back to it after the schedule changes.",
      },
    ],
  },
  {
    slug: "lumifi-sms",
    attribution: "Lumifi Solutions",
    name: "Lumifi SMS",
    tagline: "Student and learning management for Australian training providers, from first application to completion.",
    summary:
      "A multi-tenant student and learning platform for Australian RTOs. I own the Applications and Enrolments module.",
    role: "Full-Stack Developer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/lumifi-sms-admissions.webp",
    caseStudy: true,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle ORM", "Better Auth", "Tailwind CSS", "Vitest"],
    problem: [
      "Australian Registered Training Organisations (RTOs) are vocational colleges that deliver nationally recognised training. Most of their day goes on moving a learner through the same path: an application arrives, documents are checked, an offer is made, the learner is enrolled, trained and assessed, and a certificate is issued and reported.",
      "That path is often split across disconnected tools. Applications live in one place, learner records in another, and course delivery and assessment in a separate learning system. The same details get typed again at every hand-off, records drift out of step, and staff build workarounds around the gaps.",
      "Applications also come from three directions: learners applying online, staff entering paper forms and agents applying on a learner's behalf. Each route needs the same rules, and each college needs its own fields, documents and ID format.",
      "Trainers and assessors need to see their own learners, deliver the course, mark attendance and record unit outcomes and feedback. Learners need to see where they are. Neither should depend on an administrator copying information between systems.",
      "One platform serving many colleges has to keep every college's records, files and settings strictly apart, and it has to handle personal and identity documents with care.",
    ],
    solution: [
      "Lumifi SMS is designed as one cloud platform for many colleges, combining a Student Management System (SMS) with a Learning Management System (LMS). It aims to keep one record per learner and reuse it from the first application through enrolment, training, assessment, certification and reporting.",
      "The SMS side is designed to cover the administration of a college: online applications from the public, staff and agents, review and approval, enrolment, student records with a unique Student ID and USI status, courses and units, fees and payments, certificates and reporting for national VET data standards.",
      "The LMS side aims to deliver the learning itself: course delivery with lessons, video and quizzes, online assessment, trainer marking and feedback, and a learner's progress through each unit. Because it reads from the same student and course records, a learner enrolled in the SMS is designed to appear in the right course and class without being keyed in a second time.",
      "Each college is a separate tenant with its own users, branding, fields, documents and settings. It is designed so staff, trainers and agents each see only the work and data their role allows, with sensitive actions recorded in an audit trail.",
      "Application, enrolment, unit outcome and payment are designed as separate statuses, so a change in one cannot silently overwrite another.",
    ],
    contribution: [
      "I am the Full-Stack Developer for the Applications and Enrolments module, where a learner's journey begins. I work across the database design in Drizzle and PostgreSQL, the Next.js interface and the server logic behind it.",
      "The module is built around one shared application form and validation layer used by the public apply page, staff entry and agent entry, so every route produces the same clean record. It covers resumable drafts with a generated reference, an Offer ID once submitted, review with approve, reject and reconsider, offer letters, permanent Student IDs and bulk import by CSV.",
      "I wrote the tests with the code, including integration tests, a concurrency test for Student ID generation and checks that one college can never read another college's data.",
    ],
    decisions: [
      {
        title: "One record per learner",
        body: "The platform is designed around a single student record per college that applications, enrolments, delivery, payments and certificates all reuse, so details are entered once and never copied between systems.",
      },
      {
        title: "One form, three entry points",
        body: "Public apply, staff entry and agent entry share the same form definition and validation, so a rule changes in one place and applies everywhere.",
      },
      {
        title: "Tenancy enforced in the database",
        body: "Each college is a tenant. A least-privilege database role and row-level scoping keep queries inside one college's data, and tests check that one college cannot see another's.",
      },
      {
        title: "Separate lifecycles",
        body: "Application, enrolment, unit outcome and payment each carry their own status, so progress in one area never overwrites another.",
      },
    ],
    metrics: [
      { value: "3", label: "entry points sharing one form" },
      { value: "0", label: "duplicate Student IDs in the concurrency test" },
      { value: "16", label: "viewports in the responsive audit" },
    ],
    screenshots: [],
    featuredTagline: "A student and learning management platform for Australian training colleges, designed to carry a learner from application to enrolment, delivery and certificate.",
  },
  {
    slug: "world-bridge",
    attribution: "Lumifi Solutions",
    name: "World Bridge",
    tagline: "Cross-border staffing platform connecting Australian employers with remote professionals in Bangladesh.",
    summary:
      "World Bridge is a managed staffing platform that brings employer intake and candidate sourcing into one workflow. Australian teams submit structured hiring briefs, while Bangladeshi professionals build profiles and upload CVs across eight job segments. The platform is designed to help staffing teams build shortlists, track requests and coordinate placements from one workspace.",
    role: "Full-Stack Developer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/world-bridge-thumbnail.webp",
    caseStudy: true,
    stack: ["Next.js", "React", "TypeScript", "GSAP", "CSS"],
    plannedStack: ["PostgreSQL", "Prisma", "Cloudflare R2", "Auth.js", "Resend", "Vercel"],
    solution: [
      "Employers use a guided brief to describe the roles they need, while candidates create searchable profiles with their experience, job segment and CV. The placement workflow is designed to carry those records from candidate review and shortlisting through employer follow-up and placement.",
    ],
    contribution: [
      "I am building it as the Full-Stack Developer.",
    ],
    featuredTagline: "Cross-border hiring for Australian businesses, with structured staffing requests and a talent network spanning eight job segments in Bangladesh.",
  },
  {
    slug: "aria-erp",
    attribution: "RemoteIntegrity",
    name: "Aria ERP",
    tagline: "Cloud ERP for service businesses, unifying sales, procurement, inventory, finance and workforce operations.",
    summary: "Aria ERP gives service businesses one workspace for sales, purchasing, inventory, finance and people operations. Teams can follow the flow from quote to invoice and from purchase request to goods receipt, with shared customer, supplier and product records. The operations dashboard is designed to surface pending approvals, low stock, open orders and outstanding balances across departments.",
    role: "Full-Stack Developer (contract)",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/aria-erp-warm-ink.webp",
    caseStudy: true,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Better Auth", "Tailwind CSS", "Vitest", "Vercel"],
    solution: [
      "Sales, purchasing, inventory, finance and HR share the same records. Aria is designed to link quotes to orders and invoices, match purchase orders with receipts and supplier bills, and give managers a view of open commitments, stock movement and cash flow.",
    ],
    contribution: [
      "I am the full-stack developer on the project, working across the front end, back end, APIs and database on a contract basis.",
    ],
    featuredTagline: "Cloud ERP for service businesses, with quote-to-invoice, purchase approvals, stock control and financial reporting in one workspace.",
    problem: [
      "Day-to-day operations are often spread across separate spreadsheets and tools, so sales, stock, purchasing, payments and HR records drift out of step and are slow to reconcile.",
    ],
  },
  {
    slug: "casevault",
    name: "CaseVault",
    tagline: "Legal research workspace for Bangladeshi law: relevance-ranked search over statutes and judgements, with a focused document reader.",
    summary:
      "Privacy-first legal research for Bangladeshi law firms: ingest case documents, search with relevance-ranked results and read each document in a viewer with query highlighting.",
    role: "Full-Stack Engineer",
    status: "ACTIVE",
    category: "Web",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/casevault-thumbnail.webp",
    github: "https://github.com/Saji-d/casevault",
    demo: "https://casevault-bd.vercel.app",
    caseStudy: true,
    stack: ["FastAPI", "Python", "Next.js", "TypeScript", "SQLAlchemy", "Tailwind CSS", "SQLite", "Pydantic", "Alembic", "Framer Motion"],
    problem: [
      "Bangladeshi law firms work with thousands of handwritten and scanned documents, losing annotations and struggling to find relevant precedents.",
      "Generic AI chatbots hallucinate citations and firms cannot upload confidential client files to public AI tools without risking privacy.",
    ],
    solution: [
      "CaseVault is a working application: a FastAPI backend ingests markdown legal documents (front-matter metadata) into SQLite, with repositories that score document relevance per query and a full-text search API.",
      "The Next.js frontend is a dark-theme research workspace: hero search, live stats, category cards, a document reader with query highlighting and an XSS-safe hand-rolled markdown renderer.",
    ],
    architecture: [
      "  ┌──────────────────────────────────────────────────────────────────────┐",
      "  │  Next.js 16 SPA  ──►  FastAPI  ──►  SQLAlchemy  ──►  SQLite          │",
      "  │  / (search)  /reader  /dashboard  /library                           │",
      "  │  DocumentService.sync_documents_from_disk() → 46 legal docs          │",
      "  └──────────────────────────────────────────────────────────────────────┘",
    ],
    decisions: [
      {
        title: "XSS-safe markdown without a heavy renderer",
        body: "The reader renderer is hand-rolled and output-sanitized rather than pulling in a full markdown engine: small surface, safe by default for legal content.",
      },
      {
        title: "Relevance scoring at the repository layer",
        body: "Document relevance is computed in SQL against indexed columns and cached, keeping the search API fast without a separate search server.",
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
      { value: "9", label: "REST API endpoints" },
    ],
    screenshots: [],
  },
  {
    slug: "ledgerturf",
    attribution: "Ledgercross",
    name: "LedgerTurf",
    tagline: "Turf booking platform where players find grounds on a Google Map and owners manage slots with overlap checks.",
    summary:
      "Turf booking for Dhaka: players find grounds on a Google Map, owners publish slots and every reservation is checked for overlaps, live on Vercel.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Web",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/ledgerturf-thumbnail.webp",
    caseStudy: true,
    github: "https://github.com/Saji-d/ledgerturf",
    demo: "https://ledgerturf.vercel.app",
    stack: ["React", "Express", "Node.js", "MongoDB Atlas", "Redux Toolkit", "Tailwind CSS", "Google Maps", "Vite", "Mongoose", "Cloudinary", "JWT"],
    problem: [
      "Turf owners in Dhaka booked slots over phone and WhatsApp: double-booking was routine, availability was never current and players had no way to compare grounds.",
      "Timezones and 24-hour clock confusion made 'is this slot free right now' a genuinely hard query to answer correctly.",
    ],
    solution: [
      "LedgerTurf is a monorepo (npm workspaces) with an Express REST API and a React SPA. Players discover turfs on Google Maps (owners pin their location with a map picker), locations carry a GeoJSON 2dsphere index, owners publish and manage slots and admins get full visibility, with JWT auth and role-based access at every layer.",
      "Bookings are checked for overlapping slots before a Mongoose transaction writes them and availability is computed in UTC with Bangladesh's UTC+6 offset handled explicitly, so 'available now' means the same thing to everyone.",
      "SPA deep links are handled with Vercel rewrite rules so refreshing /turf/:id never 404s.",
    ],
    architecture: [
      "  React SPA (Vite + Redux) ──► /api/v1 ──► Express (JWT bearer)",
      "                                          │  asyncHandler pattern",
      "                                          ├──► Mongo 2dsphere geo index",
      "                                          ├──► Booking overlap check",
      "                                          │    (before the txn write)",
      "                                          ├──► Review avg-rating hooks",
      "                                          └──► Cloudinary uploads",
      "  Vercel: frontend + backend, SPA rewrite rules",
    ],
    decisions: [
      {
        title: "GeoJSON 2dsphere index",
        body: "Turf locations are stored as GeoJSON and indexed with MongoDB's 2dsphere index, so the data model is ready for spatial queries.",
      },
      {
        title: "Explicit UTC+6 handling",
        body: "Past-date validation and 'availableNow' both compute against a single UTC clock offset, eliminating the midnight-rollover class of bugs common to BD booking apps.",
      },
      {
        title: "Npm workspaces monorepo",
        body: "frontend, backend and an api-shim share the repo so type shapes stay in sync while each package deploys independently to Vercel.",
      },
    ],
    highlights: [
      {
        title: "Booking overlap check",
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
        caption: "Every reservation is checked for time-range overlap and rejected with a dedicated conflict error before a booking is written.",
      },
    ],
    metrics: [
      { value: "37", label: "commits" },
      { value: "3", label: "roles (player / owner / admin)" },
      { value: "2dsphere", label: "geo index on locations" },
      { value: "+6", label: "UTC offset handled explicitly" },
    ],
    screenshots: [],
  },
  {
    slug: "zenji-storefront",
    name: "ZENJI Storefront",
    tagline: "Anime streetwear storefront with quick view, a cart drawer with shipping meter, a saved wishlist and a campaign-style homepage.",
    summary:
      "A limited-drop shopping experience on React 19, strict TypeScript and Vite: ten designs with quick view and size picking, a cart drawer and page with a free-shipping meter, a persisted wishlist and a Vitest suite plus axe-core accessibility scans.",
    role: "Frontend Engineer",
    status: "COMPLETE",
    category: "Web",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/zenji-thumbnail.webp",
    github: "https://github.com/Saji-d/zenji-storefront",
    demo: "https://zenji-webstore.vercel.app",
    stack: ["React", "TypeScript", "Vite", "React Router", "Framer Motion", "Vitest"],
  },
  {
    slug: "doctor-tracker",
    name: "Doctor Tracker",
    tagline: "Admin console for managing doctors and patients, with search, filters, pagination and an analytics dashboard.",
    summary:
      "A Next.js frontend (TanStack Query) over a TypeScript Express API on MongoDB Atlas: doctor and patient CRUD, URL-synced search, filters and pagination, patient reassignment, a Recharts analytics dashboard, rate-limited JWT cookie auth and Jest + Supertest integration tests. Built for a full-stack take-home task.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Mini Project",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/doctor-tracker-thumbnail.webp",
    github: "https://github.com/Saji-d/doctor-tracker",
    demo: "https://doctor-tracker-web.vercel.app",
    stack: ["Next.js", "TypeScript", "Express", "MongoDB Atlas", "TanStack Query", "Tailwind CSS", "shadcn/ui", "React Hook Form", "Zod", "Recharts", "Jest"],
  },
  {
    slug: "neuro-screen",
    name: "Neuro-Screen",
    tagline: "Applied ML research at AIUB: a leakage-controlled stacked-ensemble study on sleep risk and cognitive symptoms in students, with a Streamlit app.",
    summary:
      "Group research project at AIUB (paper forthcoming). I built the Streamlit app (five-step assessment, results with reasons, a Reliability page) and ran the re-analysis. A stack of CatBoost, XGBoost, LightGBM and a PyTorch ANN, combined by logistic regression, is evaluated with nested cross-validation on 2,236 survey responses (cognitive accuracy 0.621 vs majority baseline 0.621; ROC-AUC 0.480). Not a medical device; no data is stored.",
    role: "Group research project · app and re-analysis",
    status: "COMPLETE",
    category: "Research",
    badges: [],
    featured: true,
    cover: "/images/thumbnails/neuro-screen-live.webp",
    github: "https://github.com/Saji-d/neuro-screen",
    demo: "https://neuro-screen.streamlit.app/",
    stack: ["Python", "CatBoost", "XGBoost", "LightGBM", "PyTorch", "Streamlit", "scikit-learn", "Pandas", "NumPy", "Plotly"],
  },
  {
    slug: "mini-kanban-board",
    name: "Mini Kanban Board",
    tagline: "Multi-user Kanban board with owner, editor and viewer roles and drag-and-drop task ordering, built as an assessment.",
    summary:
      "A NestJS + Prisma + PostgreSQL API with a Next.js 14 frontend: boards shared under a three-role RBAC model enforced at the route-guard and service layers, drag-and-drop task reordering with float-midpoint positions and row-locked moves and 40 unit + e2e tests.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Mini Project",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/mini-kanban-thumbnail.webp",
    github: "https://github.com/Saji-d/mini-kanban-board",
    demo: "https://mini-kanban-board-frontend.vercel.app",
    stack: ["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL", "Docker", "Tailwind CSS", "TanStack Query", "dnd-kit", "Passport JWT", "Jest"],
  },
  {
    slug: "face-recognition-system",
    name: "Face Recognition System",
    tagline: "Face recognition with OpenCV: Haar cascade detection, LBPH training per identity and recognition of known faces.",
    summary:
      "A complete face identification pipeline: detect faces with a Haar cascade, train an LBPH recognizer on a known set, then identify people in real time, from dataset to inference in one reproducible notebook.",
    role: "CV Engineer",
    status: "COMPLETE",
    category: "CVPR",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/face-recognition-cover-2.webp",
    github: "https://github.com/Saji-d/face-recognition-system",
    stack: ["Python", "OpenCV", "LBPH", "Haar Cascade", "NumPy", "Jupyter"],
  },
  {
    slug: "bytespace-learn",
    name: "ByteSpace",
    tagline: "Pixel-faithful recreation of a course-platform landing page from Figma, with live course search and login pages.",
    summary:
      "A responsive Next.js recreation of an online-learning landing page: hero with live course search, topic-chip filtering driven by shareable URL params, course and category grids, testimonials and bonus login and register pages, statically prerendered with Tailwind CSS v4 design tokens.",
    role: "Frontend Engineer",
    status: "COMPLETE",
    category: "Web",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/bytespace-thumbnail.webp",
    github: "https://github.com/Saji-d/bytespace-learn",
    demo: "https://bytespace-learn.vercel.app",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "finbert",
    name: "FinBERT",
    tagline: "Comparative study showing FinBERT, pretrained on financial text, beats generic BERT at classifying financial sentiment.",
    summary:
      "A comparative study proving domain-tuned transformers beat generic models on financial jargon: fine-tuned FinBERT and BERT on earnings and market text, with the full training-to-evaluation pipeline in one notebook.",
    role: "ML Researcher",
    status: "COMPLETE",
    category: "NLP",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/finbert-cover-2.webp",
    github: "https://github.com/Saji-d/financial-sentiment-analysis-bert",
    stack: ["FinBERT", "BERT", "Transformers", "PyTorch", "scikit-learn", "Hugging Face Datasets", "Pandas", "NLTK", "Matplotlib"],
  },
  {
    slug: "3d-city-simulation",
    name: "City Simulator",
    tagline: "Interactive OpenGL city scene with day and night, rain and snow, traffic controls and moving vehicles.",
    summary:
      "I built an animated city scene in C++ with OpenGL and GLUT. The simulation includes a day–night toggle, particle-based rain and snow, keyboard-controlled traffic lights, moving vehicles and pedestrians.",
    role: "Graphics Developer",
    status: "COMPLETE",
    category: "Graphics",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/three-d-city-thumbnail.webp",
    github: "https://github.com/Saji-d/3d-city-simulation-opengl",
    stack: ["C++", "OpenGL", "GLUT"],
    problem: [
      "Computer graphics coursework needed to demonstrate mastery of the full graphics pipeline (geometry, lighting and interaction) rather than a single static scene.",
    ],
    solution: [
      "The scene draws roads, buildings and vehicles with legacy immediate-mode OpenGL on a 2D orthographic view. A day/night toggle (n/d keys) switches object colors and headlights; weather modes run particle systems for rain and snow; and a red/yellow/green traffic light, switched by keyboard, makes the bus and car stop at the crosswalk.",
      "State lives in a few global flags and timers (night mode, weather particles, light state, vehicle positions), updated by GLUT timer callbacks.",
    ],
    architecture: [
      "  main.cpp (GLUT loop, 2D orthographic view)",
      "   ├── isNight flag → per-object color branches",
      "   ├── Weather     → rain / snow particle emitters",
      "   ├── TrafficLights → per-intersection state machine",
      "   └── Animation   → vehicles, pedestrians, birds, clouds",
    ],
    decisions: [
      {
        title: "State-as-machine over per-frame hacks",
        body: "The traffic light is a three-state machine (red, yellow, green) switched by the r/y/g keys; the vehicle update loop checks the state and stops the bus and car before the crosswalk on red.",
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
      { value: "2D", label: "orthographic OpenGL view" },
    ],
    screenshots: [
      { src: "/images/3d-city/day-mode.webp", alt: "City Simulator in daylight" },
      { src: "/images/3d-city/night-mode.webp", alt: "City Simulator at night" },
      { src: "/images/3d-city/rain-mode.webp", alt: "City Simulator under rain" },
      { src: "/images/3d-city/snow-mode.webp", alt: "City Simulator in snow" },
      { src: "/images/3d-city/traffic-light-red.webp", alt: "Traffic light state: red" },
      { src: "/images/3d-city/traffic-light-green.webp", alt: "Traffic light state: green" },
    ],
  },
  {
    slug: "my-wedding-invitation",
    name: "My Wedding Invitation",
    tagline: "Cinematic wedding invitation with RSVP, live countdown, polaroid gallery and venue maps, designed and deployed live.",
    summary:
      "A cinematic digital wedding invitation with RSVP, live countdown, polaroid gallery and venue maps, designed from scratch and deployed live.",
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
    slug: "codingvibes-java-gui",
    name: "CodingVibes",
    tagline: "Java Swing course storefront with admin and user logins, course browsing and a cart, storing accounts in flat files.",
    summary:
      "A desktop Java Swing storefront for programming courses: admin and user login and signup, course browsing and a cart, with accounts persisted to flat text files through plain file I/O.",
    role: "Desktop Developer",
    status: "COMPLETE",
    category: "Desktop",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/codingvibes-thumbnail.webp",
    github: "https://github.com/Saji-d/codingvibes-java-gui",
    stack: ["Java", "Swing", "File I/O"],
  },
  {
    slug: "spark-powerhouse-gym-csharp",
    name: "Spark Powerhouse",
    tagline: "Windows gym management app separating member and admin workflows for memberships, payments and daily records.",
    summary:
      "A Windows gym-management app that separates member and admin workflows: memberships, payments and daily records kept in one role-aware system.",
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
    tagline: "Employee registry with spouse and children records, fast search and one-click PDF exports from an ASP.NET Core API.",
    summary:
      "An employee registry with spouse and children records, case-insensitive search across name, NID and department and QuestPDF-generated CV and list exports, one ASP.NET Core API serving a React workspace.",
    role: "Full-stack Engineer",
    status: "COMPLETE",
    category: "Web",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/employee-registry-thumbnail.webp",
    github: "https://github.com/Saji-d/employee-family-registry",
    stack: ["ASP.NET Core", "EF Core", "PostgreSQL", "React", "QuestPDF"],
  },
  {
    slug: "online-bookstore-database-design",
    name: "Bookstore Database",
    tagline: "Online bookstore database designed from UNF to 3NF, with an ER diagram, Oracle SQL schema and catalog, order and payment queries.",
    summary:
      "A relational design for an online bookstore, worked from UNF through 3NF, with an ER diagram, the Oracle SQL schema and the queries that run the catalog, orders and payments.",
    role: "Database Designer",
    status: "COMPLETE",
    category: "Database",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/database-thumbnail.webp",
    github: "https://github.com/Saji-d/online-bookstore-database-design",
    stack: ["SQL", "Oracle", "ER Diagram", "Normalization"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getCaseStudyProjects(): Project[] {
  return projects.filter((p) => p.caseStudy);
}
