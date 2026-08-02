# 04 — Technical Stack Matrix & Skills Inventory

## Skills Master Inventory (from MASTER_PROFILE.md, verified against code)

### Programming Languages
Python, C# (.NET), Java, C++, TypeScript, JavaScript, SQL, Solidity

### Backend & Distributed Systems
FastAPI, ASP.NET Core Web API, Express.js, Node.js (NestJS, Fastify), REST APIs, Microservices Architecture, Redis Streams, Celery, BullMQ, Cloudflare R2, Docker, Convex

### ML / AI / Data Science
PyTorch, Hugging Face (Transformers, FinBERT), Scikit-learn, OpenCV, CatBoost, Mindee OCR, Qdrant (Vector DB), Neo4j (GraphRAG), Pandas, NumPy, NLTK, BanglaBERT, SHAP/LIME, K-Means, Isolation Forest (designed), LBPH, EfficientNet, MLP

### Databases & Persistence
PostgreSQL (Row-Level Security / RLS), MongoDB (Geo-spatial indexing), Entity Framework Core, Prisma ORM, Drizzle ORM, Supabase, SQL Server, MySQL, SQLite

### Frontend
React 18/19, Next.js 15/16, Vite, TypeScript, Tailwind CSS, Redux Toolkit, Zustand, wouter, React Router, framer-motion, HTML5, CSS3, Bootstrap 5

### Web3 / Blockchain
Solidity, Foundry, Hardhat (referenced), OpenZeppelin (AccessControl, Pausable), Viem, Turnkey KMS, Polygon/Base L2, EAS (referenced), Ethers.js

### Software Engineering & Tools
Git, GitHub, Foundry, Pytest, Postman, Linux, Vercel, BullMQ, Docker Compose, Socket.IO, Swagger, Gitflow (feature branches), Jupyter

## Stack Per Project (quick matrix)

| Project | Languages | Backend | Frontend | DB | Queue/Async | AI/ML | Infra/Cloud |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| InvoicePilot | Python, TS, Solidity | FastAPI, Fastify | React 19 (Vite), wouter | Postgres (Supabase, RLS), Drizzle | Redis Streams, BullMQ, Celery (designed) | Mindee OCR, Isolation Forest (designed) | Cloudflare R2, Turnkey, Base/Polygon, Docker |
| CaseVault | Python, TS | FastAPI | Next.js 16 | SQLite (P1) / Postgres+Qdrant+Neo4j (P2) | Celery (P2) | Gemini 2.5 Flash, OpenAI embeddings, Datalab OCR, BGE-reranker (P2) | Docker compose (planned) |
| LedgerTurf | JavaScript | Express | React 18, Vite, Redux Toolkit | MongoDB Atlas | — | — | Vercel, Cloudinary, JWT |
| CustomerPulse AI | TypeScript | NestJS | React 18, Vite, Zustand | PostgreSQL (Neon), Prisma | Socket.IO | Claude Haiku/Sonnet (designed) | Docker Compose, nginx |
| dr-stone | TypeScript | Convex | React 18, Vite | Convex | Convex reactive | — | Convex, Vercel |
| Employee Registry | C#, JS | ASP.NET Core Web API, EF Core | React (Vite, Tailwind) | PostgreSQL | — | — | QuestPDF |
| NeuroScreen | Python | — | — | — | — | PyTorch, CatBoost, Scikit-learn | Jupyter |
| FinBERT | Python | — | — | — | — | Hugging Face, PyTorch, NLTK | Jupyter |
| Spark Gym | C# / PHP | PHP | WinForms / HTML | SQL Server (.mdf) / MySQL | — | — | Guna.UI2 |
| 3D City | C++ | — | — | — | — | — | OpenGL, Code::Blocks |

## Verified Skills Evidence (what the code actually shows)
1. **Redis Streams mastery** — XADD/XREADGROUP/XACK/XCLAIM, consumer groups, idle reclaim, DLQ, backoff — production-grade pattern (InvoicePilot worker.py).
2. **RLS/multi-tenant** — FORCE RLS, service-role connection `-c app.current_role=service`, per-tenant policies (InvoicePilot migrations + schema.sql).
3. **Solana-grade Solidity** — append-only SealRegistry, natspec, packed structs, role-based access, 8 Foundry tests.
4. **Cryptography awareness** — AES-256-GCM app-layer encryption, SHA-256 hashing, canonical JSON (JCS), Turnkey enclave signing.
5. **Testing discipline** — 218 pytest + 8 Foundry + TS verify/cache/rate-limit tests.
6. **SOC 2 knowledge** — policy docs, TRUST_CENTER, control mappings (CC6.x, PI1.4, A1.2).
7. **TypeScript rigor** — strict typing, ESM, discriminated unions, pure config parsing.
8. **Frontend polish** — design systems (DESIGN.md for dr-stone), UI kits, dark themes, framer-motion.
9. **Business/venture thinking** — unit economics, GTM, competitor teardowns, pricing strategy.

## Skill Gaps / Over-claims to verify
- **CaseVault GraphRAG (Qdrant/Neo4j/Celery)** — claimed in MASTER_PROFILE and CV, but code is Phase-1 MVP only. This is the biggest honesty risk in the resume. If a technical interviewer probes "GraphRAG," Sajid must be able to defend with Project SynthGraph design depth (which IS real).
- **Celery** — designed, not shipped (CaseVault P2).
- **"11-stage pipeline" vs shipped stages** — pipeline.py has stages 7-11 + 8.5-8.57 sub-stages; the 11-stage claim is defensible but stage numbering is inconsistent across docs (another honesty risk to align).
- **NestJS, Next.js 16** — real but thin (single-commit MVP; CaseVault frontend largely template-derived).
- **MongoDB geo-search** — implemented but currently disabled in LedgerTurf.
