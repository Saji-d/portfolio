# 03 — Complete Project Inventory

Each entry: Name | Purpose | Problem solved | Tech Stack | Architecture | Interesting engineering decisions | Challenges | Screenshots/Demo/GitHub | Status | Complexity | Feature-worthiness.

---

## A. PROFESSIONAL / WORK PROJECTS (LedgerCross)

### A1. InvoicePilot — AI Invoice Microservice + Web3 Cryptographic Seal Engine
- **Purpose:** Enterprise-grade AI invoice processing microservice + Web3-sealed auditing platform for bookkeeping firms / small businesses (B2B SaaS).
- **Problem solved:** Manual invoice data-entry hours, duplicate payments, PO mismatches, weak audit trails, scattered files, fraud going undetected.
- **Tech Stack:** Python 3.11 (FastAPI), Node.js (Fastify API Gateway + TypeScript), React 19 (Vite), TypeScript, PostgreSQL (Supabase + Row-Level Security), Redis Streams, BullMQ, Cloudflare R2, Solidity (Foundry `SealRegistry`), Viem, Turnkey KMS SDK, Mindee V2 OCR SDK, Drizzle ORM, Fastify + wouter (frontend).
- **Architecture (three sub-systems):**
  - **AI/ML Pipeline (invoice-ai-service):** 11-stage processing engine — file upload validation, Mindee OCR extraction (30+ fields, per-field confidence), transformation, normalization (10 functions: currencies, vendor names, dates, emails, phones, URLs), exact-match duplicate detection, 12-rule business logic engine, 9-rule fraud detection, classification, validation, DB persistence.
  - **Async Processing Engine:** Redis Streams consumer groups (XADD/XREADGROUP/XACK/XCLAIM), async worker with `asyncio.Semaphore` (default 5 slots), `asyncio.to_thread` for blocking I/O, exponential backoff retries (3, 30s), dead-letter queue with 7-day TTL, idle-reclaim crash recovery.
  - **Web3 Seal Kernel:** `SealRegistry.sol` (Foundry, OpenZeppelin AccessControl + Pausable) — append-only, stores only {recordHash, recordType, sealedAt, sealedBy}, never PII/amounts. BullMQ seal worker using Viem + Turnkey KMS (SIGNER_MODE=local|turnkey). Hash = sha256(domainTag + canonicalJSON(payload)) with NFC normalization, minor-unit money, RFC3339 UTC.
  - **Fastify API Gateway:** JWT auth (Supabase remote JWKS), RBAC + RoleGuard, Redis sliding-window rate limiter, Redis query caching, AES-256-GCM encryption at rest (vendor bank details), presigned R2 URLs, audit logging, SOC 2 readiness suite (5 policy docs + TRUST_CENTER + RLS migrations).
- **Interesting decisions:** hash-only on-chain (privacy), versioned seal seam (shared-types payloads), provider-agnostic OCR boundary (only 1 file imports Mindee), signer abstraction (Turnkey enclave), RLS FORCE + service role connection, soft-ref seals (no hard FK), read-only API chain client.
- **Challenges:** SOC 2 readiness, Mindee MIME-type Windows bug (webp workaround), RLS for worker inserts, multi-tenant isolation, QuickBooks/Xero OAuth (named biggest risk).
- **Screenshots:** sample invoices in X:\INVOICESSSSSSSSSSSSSSS (webp/png/pdf/jpg test files + invoice-gpt.png + Test_Reports). No polished UI screenshots found.
- **Demo:** Not deployed publicly; dev via docker-compose.
- **GitHub:** https://github.com/ledgercross-team/invoice-pilot (70 commits main; X:\InvoicePilot branch `Sajid` 23 commits).
- **Status:** ACTIVE. **Complexity:** High. **Feature-worthiness:** ★★★★★ (10/10 flagship).
- **Extra:** ENGINEERING artifacts — PROJECT_BLUEPRINT.md (84KB), InvoicePilot_Engineering_Handbook.html (24 sections), InvoicePilot_Learning_Guide.html (19 chapters, junior-engineer pedagogy), Siam_Brief full design-doc set (architecture/security/schema/API/mockups/ERP integration), 218 pytest cases (188 services + 41 queue + 4 api + 13 storage), 8 Foundry contract tests.

### A2. CaseVault — AI Legal Intelligence Platform & GraphRAG
- **Purpose:** AI legal intelligence for Bangladeshi law firms: document ingestion + citation-backed legal research. Tagline in deck: "Don't trust AI. Verify AI."
- **Problem solved:** Thousands of handwritten/scanned documents, lost annotations, hallucinated AI citations, firms can't upload confidential files to public AI (privacy).
- **Tech Stack (Planned/Phase 2):** FastAPI, Next.js 15/16, PostgreSQL, Qdrant (Vector DB), Neo4j (Knowledge Graph), Redis, Celery, Gemini 2.5 Flash, OpenAI Embeddings, Datalab OCR. **Actual (Phase 1 MVP):** FastAPI + SQLAlchemy + SQLite, Next.js 16.2.9 + React 19.2.4 + Tailwind v4 + framer-motion.
- **Architecture (Phase 1, shipped):** FastAPI backend — SQLAlchemy models (Document, Tag, M2M document_tag), YAML-front-matter markdown ingestion, `DocumentService.sync_documents_from_disk()` ingests 46 generated legal docs into SQLite, repositories with relevance scoring (`case()`), routers (documents, search), seed script. Frontend — dark-themed SPA, hero search, live stats, category cards, DocumentCard with query highlighting, advanced filter drawer, DocumentReader with AI tabs (summary/ask/citations/related), XSS-safe hand-rolled markdown renderer, `/` keyboard shortcut, `/admin /chat /dashboard /library /workspace` placeholders for Phase 2.
- **GraphRAG (Phase 2 design, Project SynthGraph):** Qdrant semantic search + Neo4j KG (NER); Celery async pipelines for OCR → chunking → embeddings; Leiden community detection (gds.leiden.write) with per-community LLM summaries; sub-graph context as structured triples injected into reranker; latency budget ~790ms to TTFT; tech catalog in `graph_rag_architecture.md`.
- **Interesting decisions:** Hand-rolled XSS-safe markdown renderer; AGENTS.md warns "Next 16 APIs differ from training data"; frontend kept as nested git repo; Phase-2 placeholders designed in advance.
- **Challenges:** Phase 1 vs vision gap (Qdrant/Neo4j/Celery exist only in prose, not code); single initial commit; uncommitted repo changes.
- **Screenshots:** CaseVault_Presentation folder (HTML deck, README, casevault-end.mp4); CaseVault Vision.pdf.
- **Demo:** None deployed.
- **GitHub:** https://github.com/ledgercross-team/casevault (branch `Sajid`, 1 commit).
- **Status:** ACTIVE, Phase 1 MVP complete / Phase 2 designed. **Complexity:** High. **Feature-worthiness:** ★★★★★ (9.5/10 — as AI/legal AI narrative).

### A3. LedgerTurf — Turf Booking Ecosystem (MERN)
- **Purpose:** Full-stack turf (football/cricket ground) booking platform for Dhaka.
- **Problem solved:** Manual slot booking, double-booking race conditions, timezone confusion, SPA deep-link 404s on Vercel.
- **Tech Stack:** React, Vite, Tailwind CSS, Redux Toolkit, Node.js, Express.js, MongoDB Atlas, Cloudinary, JWT, @react-google-maps/api, Vercel. Root = npm-workspaces monorepo (frontend/backend/api-shim).
- **Architecture:** Express REST API (`/api/v1`), Mongoose models (User, Turf, Booking, Review), role-based access (player / turfOwner / superAdmin), JWT bearer auth, asyncHandler pattern, BD phone validation, Cloudinary uploads, review averageRating hooks. Frontend: Redux authSlice persisted to localStorage, axios services, pages for listing/details/dashboards (user/owner/admin).
- **Interesting engineering decisions:** Mongo `2dsphere` GeoJSON index for location (though geo query currently commented out "disabled temporarily for Vercel stability"); booking overlap check + Mongoose transaction session; UTC+6 (+6h) BD timezone handling for `availableNow` and past-date validation; separate Vercel configs for frontend/backend + SPA rewrite rules; `$regex` search, pagination, filters.
- **Challenges (honest):** Booking race-condition prevention is partial — `checkOverlap` read is NOT session-bound, and index is a query-speed index (not unique partial), so double-booking is still theoretically possible. Geo search disabled. `durationHours=1` placeholder.
- **Screenshots:** README references screenshots section; live demo URL in README.
- **Demo:** Live demo (Vercel) referenced in README. **GitHub:** https://github.com/Saji-d/ledgerturf (37 commits).
- **Status:** COMPLETE / deployed. **Complexity:** Medium. **Feature-worthiness:** ★★★★☆ (8/10).

### A4. CustomerPulse AI — Shopify × Meta DM Sales Triage SaaS
- **Purpose:** Turn DMs (Instagram/WhatsApp/Messenger) into Shopify revenue — AI triage, draft responses, in-chat order actions, revenue attribution.
- **Problem solved:** DM-drowning Shopify operators (lost sales: engaged shoppers convert ~12% vs ~3%), bill-shock from Gorgias/respond.io, Meta's free agent being generic.
- **Tech Stack:** Node.js NestJS 11, Prisma ORM, PostgreSQL (Neon), Turborepo + pnpm workspaces, React 18 + Vite + Tailwind, Socket.IO, Docker Compose, Zustand (frontend), Swagger.
- **Architecture:** apps/api (NestJS: auth mock-JWT, customers, conversations, messages with `message.created`/`conversation.updated` realtime, dashboard, integrations in-memory) + apps/web (React Router, Zustand with localStorage tokens, Login/Dashboard/Inbox/Customers/CustomerDetail, real Socket.IO client) + packages (ui/shared/config/types). Docker: postgres:15-alpine + NestJS API :3000 + nginx-served web :8080.
- **Interesting decisions:** Socket.IO realtime from day 1; monorepo package architecture; Swagger docs; pitch deck baked into repo (customerpulse-deck.html) with deep Meta compliance analysis (24h/72h state machine, per-message billing, AI-provider rules), unit economics ($0.04/resolution COGS, 52–65% blended GM), honest LTV modeling (retired $140k fantasy).
- **Challenges:** Schema minimal (only Customer/Conversation/Message — no Staff/User/Integration/Order yet); mock auth; in-memory integrations; single commit; no .env.example.
- **Screenshots:** customerpulse-deck.html (22-slide pitch deck); drawio Mermaid architecture diagrams.
- **Demo:** Docker compose locally; not public.
- **GitHub:** https://github.com/ledgercross-team/customer-pulse (private, 1 commit).
- **Status:** MVP bootstrap / pitch-stage. **Complexity:** Medium. **Feature-worthiness:** ★★★★☆ (7.5/10 — strong pitch, thin code).

### A5. dr-stone — NITOR Patient Management System (Convex)
- **Purpose:** Hospital patient management for NITOR (National Institute of Traumatology & Orthopaedic Rehabilitation) "Unit Blue-II Trauma" — patient records, OT (operation theater) list, ward/bed management, roster exports, follow-ups, notifications, admin stats.
- **Problem solved:** Paper-based patient tracking, OT scheduling chaos, roster export overhead.
- **Tech Stack:** React 18 + Vite + TypeScript, Convex (backend-as-a-service, reactive queries), Convex Auth (password), framer-motion, lucide-react, jsPDF + jspdf-autotable, html2canvas, react-router-dom v6, pnpm.
- **Architecture:** Convex schema — doctorProfiles (pending/approved/rejected/disabled), wards, beds, patients (unique registrationNumber), followUps, otList (E OT / D OT / C OT-1/3/4 types, priority, status), patientImages (xray/ct/mri/other via Convex storage), notifications, otRosterExports (snapshot rows), auditLogs. Auth guards chain (requireAuth / requireApprovedDoctor / requireAdmin). Functions: doctors signup→auto-notify admins, patients CRUD + enrichPatient, search (registration index + substring), statistics (7 queries), OT week board, roster PDF/JPG export, wards/beds + migrations backfill.
- **Interesting decisions:** Strict DESIGN.md spec ("Clarity over cleverness / Calm over flashy", navy/teal institutional palette, no emoji in clinical data, formal black-and-white roster matching NITOR header exactly); audit trail everywhere; disable-not-delete semantics; archive not delete; uncommitted WIP branch (wards/beds/search/migrations).
- **Challenges:** Working tree NOT clean (uncommitted features); Convex text-index limitations (manual substring search); doctor approval workflow.
- **Screenshots:** X:\dr-stone\images\try.jpeg (single test image). README screenshots referenced.
- **Demo:** Vercel-configured (vercel.json). **GitHub:** https://github.com/ledgercross-team/dr-stone (branch Sajid, 26 commits).
- **Status:** ACTIVE, WIP. **Complexity:** Medium-High. **Feature-worthiness:** ★★★★☆ (8/10 — domain-rich, real-world hospital client).

### A6. Argas — AI Voice-Agent SaaS for Shopify (Research/Docs)
- **Purpose:** AI voice agent that calls hesitant high-AOV Shopify shoppers to close sales; billed only on holdout-proven incremental revenue.
- **Problem solved:** Abandoned high-value carts; "almost-customers" who need a human call.
- **Tech Stack (docs):** Shopify Web Pixel / Woo plugin JS, CNAME + Cloudflare Queues/SQS, Meta CAPI/GA4/TikTok pixels, LLM voice agents, own pixel.
- **Architecture:** Docs-only (12 files, no code). Strategy: "Provable-Lift Ledger" — default 5–20% holdout per flow, report only incremental revenue. Competitor teardown: markopolo.ai (~$2M seed, HF0 SF, ~$150–250K ARR est). Build economics: MVP ≈ 34–46 person-weeks, ~$0.040/thread LLM, flat tiers $299/$699/$1,499. Legal risk: TCPA/CIPA treated as first-class.
- **Interesting decisions:** Provenance discipline — every claim tagged [V] verified or [E] estimate with claims-and-sources ledger; adversarial competitor analysis; honest unit economics.
- **Status:** IDEA/RESEARCH only. **Complexity:** N/A (planning). **Feature-worthiness:** ★★★☆☆ as a venture pitch; shows business acumen.

---

## B. THESIS & RESEARCH

### B1. NeuroScreen — Hybrid ML/DL Ensemble for Cognitive Impairment Detection (Thesis)
- **Purpose:** Detect cognitive impairment in insomniac university students.
- **Problem solved:** Undiagnosed cognitive decline in students; single-model limitations.
- **Tech Stack:** Python, PyTorch (3-layer ANN 128-64-1 MLP, ReLU, Adam, dropout 0.3), CatBoost, Scikit-learn, Pandas.
- **Architecture:** Dual-path training — CatBoost (GBDT) + ANN; arithmetic-mean probability blending; feature engineering/scaling across 7 cognitive symptom categories; custom survey dataset 2,237 students (20-35 yrs); 80/20 stratified split.
- **Results:** Accuracy 95.20%, Precision 94.40%, Recall 96.10%, F1 95.24%, ROC-AUC 0.982. Beats standalone CatBoost (94.12%) and ANN (91.25%). Key features: Mental/Physical Fatigue, Stress Frequency, GPA Impact (0.095 importance).
- **Interesting decisions:** Ensemble blending over single model; feature-importance-driven conclusions; rigorous literature review (XLSX, 16 reference papers, per-member review folders).
- **Status:** COMPLETE. **Complexity:** High. **Feature-worthiness:** ★★★★★ (9.5/10 — academic anchor).

### B2. FinBERT Financial Sentiment Analysis (NLP course research)
- **Purpose:** Classify sentiment in financial text using fine-tuned domain transformers.
- **Problem solved:** Generic BERT underperforms on financial jargon.
- **Tech Stack:** PyTorch, Hugging Face Transformers (FinBERT), NLTK, Scikit-learn.
- **Approach:** Fine-tuned FinBERT vs BERT comparison; NLP preprocessing pipelines (tokenization).
- **Status:** COMPLETE. **GitHub:** https://github.com/Saji-d/natural-language-processing. **Complexity:** Medium-High. **Feature-worthiness:** ★★★★☆ (9.0/10).

### B3. Twitter Sentiment Analysis (NLP)
- **Purpose:** Sentiment classification of tweets.
- **Tech Stack:** Python, NLTK, TF-IDF, Scikit-learn.
- **Status:** COMPLETE. **Complexity:** Medium. **Feature-worthiness:** ★★★☆☆ (7.5/10).

### B4. RFM-Based Customer Segmentation & Early Risk Prediction (Data Science)
- **Purpose:** Early-warning model for high-value customers (churn prediction).
- **Tech Stack:** Python, Scikit-learn, Pandas, K-Means.
- **Dataset:** UK online-retail dataset. RFM segmentation + clustering + churn.
- **Status:** COMPLETE. **Complexity:** Medium. **Feature-worthiness:** ★★★★☆ (8/10).

### B5. Water Turbidity Classification (CVPR paper)
- **Purpose:** Classify water turbidity from phone photos (High/Low/Medium).
- **Approach:** EfficientNet-B0 + transfer learning fine-tuning with small real-world dataset (~300 photos); cat/dog/panda auxiliary dataset. Paper: "Improving Generalization of Image-Based Water Turbidity Classification Using Fine-Tuning with Small Real-World Datasets."
- **Status:** COMPLETE (Group 10). **Complexity:** Medium-High. **Feature-worthiness:** ★★★★☆ (8.5/10).

### B6. Explainable Bangla Toxic Comment Detection (Data Mining)
- **Purpose:** Detect toxic Bangla comments with explainability.
- **Approach:** BanglaBERT + SHAP + LIME, k-fold CV (kfold5, 70/15/15 splits). IEEE format paper with Fatima Hridi & Asif Akber. Multiple toxicity datasets.
- **Status:** COMPLETE. **Complexity:** Medium-High. **Feature-worthiness:** ★★★★☆ (8.5/10 — explainable AI angle is differentiating).

### B7. Other papers (RM/HCI courses)
- "Entrepreneurship Over Employment: Guiding Bangladeshi Youth Towards Innovation and Self-Reliance" (RM Group 7).
- "Adaptive InteractOut: A Context-Aware, Personalized Intervention for Smartphone Overuse" (HCI group paper + poster).

---

## C. ACADEMIC / COURSE PROJECTS

### C1. Spark Powerhouse Gym — Gymnasium Management System (C# / PHP)
- **Purpose:** Gym membership management (memberships, payments, equipment, routines, login).
- **Tech Stack (C# version):** C# WinForms, Guna.UI2, SQL Server (.mdf). ~20 forms (Front_Page, HomePage, SignUp, User/Admin login, Admin Dashboard, Membership, Payment/Bank/Bkash, Equipment_Buy, Routine, Contact, About).
- **Tech Stack (PHP version):** PHP/MySQL MVC-style (control/, model/db.php, View/, js/validation.js, css/style.css) — Web Tech course project, 8th semester.
- **Screenshots:** 14 PNGs + gifs (C#). **GitHub:** spark-powerhouse-gym-csharp (public). **Status:** COMPLETE. **Complexity:** Medium. **Feature-worthiness:** ★★★☆☆ (6.5/10).

### C2. Simulation City — 3D City Simulation (OpenGL, C++)
- **Purpose:** 3D simulated city with dynamic day/night cycles, weather (rain/snow), traffic-light logic, keyboard controls.
- **Tech Stack:** C++, OpenGL, Code::Blocks.
- **Screenshots:** day-mode, night-mode, rain-mode, snow-mode, traffic-light-red/green (6 PNGs).
- **Status:** COMPLETE. **Complexity:** Medium-High. **Feature-worthiness:** ★★★★☆ (8/10 — great visual portfolio piece).

### C3. CodingVibes — Java Swing Online Course Platform
- **Purpose:** Desktop app simulating an online course-selling platform.
- **Tech Stack:** Java Swing, ~40 .java files, text-file DB (Admin/User), 18 course pages.
- **Screenshots:** ~35 UI images, ~50 PPTX/PPTM mockups.
- **Status:** COMPLETE. **Complexity:** Medium. **Feature-worthiness:** ★★★☆☆.

### C4. BookStore Management System (Database)
- **Purpose:** Online bookstore DB design.
- **Tech Stack:** ER modeling, normalization, SQL. Report only (docx/pdf). **GitHub:** online-bookstore-database-design (public).
- **Status:** COMPLETE. **Complexity:** Low-Medium. **Feature-worthiness:** ★★☆☆☆.

### C5. CVPR Projects (5 notebooks)
- EfficientNet face recognition; KNN multiclass image classification; LBPH face recognition; MLP pattern recognition; NN MNIST digit recognition. All in computer-vision-and-pattern-recognition repo.
- **Status:** COMPLETE. **Feature-worthiness:** ★★★★☆ (8.5/10 collectively).

### C6. Employee & Family Registry (Fionetix Solutions Technical Assessment)
- **Purpose:** Employee + spouse/child family registry with CV/PDF export — a take-home technical test.
- **Tech Stack:** ASP.NET Core Web API, EF Core, PostgreSQL, QuestPDF (backend); React (Vite + Tailwind) (frontend). Entities Employee/Spouse/Child, DbSeeder, migrations, EmployeePdfService.
- **Screenshots:** 9 PNGs (add/edit employee, family, validation, search, PDF CV/list).
- **GitHub:** https://github.com/Saji-d/employee-family-registry (1 commit). **SRS_Document.pdf** present.
- **Status:** COMPLETE. **Complexity:** Medium-High. **Feature-worthiness:** ★★★★☆ (8.5/10 — shows .NET + React breadth).

### C7. Java Projects (E:\Java Projects — course work, zipped)
- AIUB Parking Management System, Boi Jatra, Fast Food Train, Job Management, Remotely Assistant Workers (RAW), Science Pro Courses, TripGo. (7 Java Swing/desktop course projects, un-extracted zips.)
- **Feature-worthiness:** ★★☆☆☆ (minor course work; could mine for screenshots).

---

## D. INTERNSHIP LEARNING JOURNEYS (BSS)

- **html-css-learning-journey** (36 commits, public): 18 numbered projects — semantic layout, pricing grid, forms, shoe cards, flexbox, freelance form, Lumina Creative website, Tutor website, Leno website.
- **bootstrap-learning-journey:** 10 modules + mini-apps (Employee Management System, Blog App, Education Website).
- **javascript-learning-journey:** 7 modules (basics→arrays/functions/objects).
- **bss-internship-tasks** (public): 6 tasks — Bangladesh flag (CSS position), grid bento gallery, analog clock, furniture store, Doc House (Figma), JS loader.
- **Feature-worthiness:** ★★☆☆☆ as standalone; ★★★★☆ as evidence of systematic learning discipline (shows progression).

---

## E. COURSE-BASED LEARNING REPOS (X:\Course-Projects)
- **Blockchain – Ethereum and Solidity (Udemy):** blockchain-ethereum-solidity-learning-journey.
- **IBM Full-Stack JavaScript Developer Professional Certificate (Coursera):** ibm-fullstack-javascript-learning-journey. Capstones: shopping app, RESTful review system.
- **Feature-worthiness:** ★★★☆☆ (certification evidence).

---

## F. IDEAS / PITCH DECKS (X:\IDEAS, X:\Temporary Docs)
- **Warranty Wallet:** Bangladesh product-ownership infrastructure — digital warranty + after-sales CRM, QR via SMS/WhatsApp, retailer SaaS ৳500–5,000/mo, 6 revenue streams, GTM phases.
- **Project SynthGraph:** GraphRAG backend architecture blueprint (FastAPI, Qdrant, Neo4j GDS Leiden, Redis 3-tier cache, Kafka, BGE-reranker, latency budgets).
- **CaseVault Vision deck** (in IDEAS/CaseVault_Presentation).
- **LedgerCross legal AI speech deck** (legal-domain AI for Bangladeshi lawyers; Harvey vs NotebookLM comparison).
- **CustomerPulse AI deck** (analyzed above).
- See `09-ideas-and-pitchdecks.md` for details.

---

## Feature-worthiness Summary Table

| Rank | Project | Score | Why |
| :--- | :--- | :--- | :--- |
| 1 | InvoicePilot | 10/10 | Flagship: microservices, Redis Streams, Web3, SOC 2, 218 tests, deep docs |
| 2 | CaseVault | 9.5/10 | AI legal + GraphRAG narrative; strong vision |
| 3 | NeuroScreen Thesis | 9.5/10 | Academic anchor, 95.2% acc / 0.982 AUC |
| 4 | FinBERT | 9/10 | Domain-specific transformer fine-tuning |
| 5 | dr-stone | 8/10 | Real hospital domain, Convex, rich features |
| 6 | LedgerTurf | 8/10 | Deployed full-stack MERN |
| 7 | RFM Risk Model | 8/10 | Data science + business value |
| 8 | CVPR Collection | 8/10 | CV breadth |
| 9 | Employee Registry | 8/10 | .NET + React + PDF generation |
| 10 | BanglaBERT Explainable | 8.5/10 | Explainable AI angle |
| 11 | CustomerPulse AI | 7.5/10 | Great pitch, thin code |
| 12 | Water Turbidity | 8/10 | Real dataset paper |
| 13 | 3D City Simulation | 8/10 | Visual wow |
| 14 | Twitter Sentiment | 7.5/10 | Standard ML |
| 15 | Gym Management | 6.5/10 | Course project |
| 16 | Learning journeys | 5/10 | Evidence of discipline |
| 17 | BookStore DB | 4/10 | Basic |
| 18 | Java course zips | 4/10 | Unpolished coursework |
