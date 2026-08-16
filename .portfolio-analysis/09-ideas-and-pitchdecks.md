# 09: Ideas & Pitch Decks

## Source locations
- `X:\IDEAS\` - graph_rag_architecture.md, CustomerPulse AI.drawio(+png), ledgercross final project speech.md, project_trellis_architecture_slides.html, warranty-wallet.html, CaseVault_Presentation/
- `X:\Temporary Docs\` - InvoicePilot blueprints/handbooks, Siam_Brief design-doc set, PROJECT_BLUEPRINT.md

## 1. Warranty Wallet: "Bangladesh's Product Ownership Infrastructure"
- **Concept:** Replace lost paper warranty cards with a digital product-ownership network linking customers, retailers, service centers, distributors, manufacturers.
- **Flow:** Customer buys → retailer creates digital warranty → instant QR → SMS/WhatsApp → service center scans → repair history → manufacturer analytics.
- **Positioning:** After-sales CRM for electronics retail; "product life in your pocket."
- **Business model (6 streams):** Retailer SaaS ৳500–5,000/mo; Manufacturer Analytics ৳20K–1L/mo; SMS/WhatsApp campaigns; extended-warranty commissions; insurance partnership rev-share; premium customer plan.
- **GTM:** small electronics retail → dealers → service centers → distributors → major brands (Walton, Singer, Vision, LG, Samsung).
- **Long-term vision:** "Become the Ownership Layer of Bangladesh" (alongside bKash = money, Pathao = mobility, Foodpanda = food).
- **Assessment:** Strong consumer-trust + data-network idea; very senior thinking for an undergrad. A great "vision" piece for a portfolio blog.

## 2. Project SynthGraph (GraphRAG architecture): X:\IDEAS
- **Deck:** project_trellis_architecture_slides.html (dark-themed, 8 slides) - Hybrid Graph-RAG backend blueprint.
- **Core:** sub-graph context serialized as triples injected alongside vector chunks into a reranker; offline Leiden community detection (Neo4j GDS) with per-community LLM summaries stored with embeddings (never traversed at query time); global queries hit community summaries via ANN search.
- **Latency budget:** context ~10ms; graph_overlay SSE ≤200ms; LLM TTFT ~600ms; fast path ~180ms retrieval / ~400ms TTFT.
- **Stack:** FastAPI, Qdrant, Neo4j Enterprise, Redis (3-tier cache), BGE-Reranker, text-embedding-3-large, Kafka, Rust/Tokio ingestion workers, Kubernetes, MinIO, vLLM/Triton GPU, spaCy, MinHash+LSH.
- **Assessment:** Shows serious distributed-systems + IR + graph thinking. Documented in `graph_rag_architecture.md` with per-tool rationale and difficulty ratings. Excellent "system design deep-dive" content.

## 3. LedgerCross Legal AI (final project speech): X:\IDEAS
- **Concept:** Legal-domain AI for Bangladeshi lawyers. Problem: thousands of handwritten/scanned docs, lost annotations, hallucinated citations, can't upload confidential client files to public AI.
- **Competitors:** Harvey AI ($1,500/mo, flawed answers/wrong citations, claims 60 countries but one US region); NotebookLM (no image parsing, isolated doc connections).
- **Solution:** Digitize docs, continuous integration, personalized AI, "own private personal library" model.
- **Assessment:** Positioning deck; solution placeholder. This is the marketing voice for CaseVault. "Don't trust AI. Verify AI." is the tagline.

## 4. CustomerPulse AI: full pitch deck (X:\CustomerPulse AI\customerpulse-deck.html, 22 slides)
- **Thesis:** "Conversation is the storefront." Meta made generic inbox+auto-reply free (Business Agent 2026), so defensible value moved down-stack: deep Shopify order resolution + auditable attribution inside Meta DMs.
- **Target:** visual-impulse D2C (beauty, skincare, supplements, fashion), $1–20M GMV.
- **Three pains:** lost sales (engaged shoppers convert ~12% vs ~3%); bill shock (Gorgias $14k overage, respond.io $79→$400-700 trap); DIY rules break at BFCM.
- **Product:** shared team inbox, Shopify-connected, AI triage+draft, in-chat order actions, revenue-per-conversation dashboard, compliance cockpit.
- **Pricing:** Free / $79 Starter / $299 Growth / $699 Scale. AI bundled; Meta fees at-cost; one-click cancel; honest capped pricing.
- **Unit economics:** AI COGS ~$0.04/resolution; 52–65% blended GM (target 70%); underwrite floor 60%. Retired the "$80–200k LTV" fantasy (real mid-market ~$26k, SMB ~$6k).
- **Meta compliance:** 24h/72h window state machine, per-message billing reconciliation, Jan-2026 AI-Provider rule, right-to-erasure cascade.
- **GTM:** BEACHHEAD Bangladesh/SEA → MONETIZE US mid-market → EXPAND GCC/SEA.
- **Stack:** TypeScript Fastify, BullMQ+Redis, transactional outbox + sagas, Postgres+pgvector, Next.js+shadcn+Shopify Polaris, Ably WebSockets, Clerk/WorkOS, Orb+Stripe, PostHog, Langfuse, Promptfoo.
- **Assessment:** Exceptional, mature SaaS thinking - real competitor matrix (Gorgias/respond.io/Meta/Wati/Shopify Inbox), honest numbers, compliance depth. Senior product-owner quality.

## 5. InvoicePilot engineering-doc ecosystem (X:\Temporary Docs)
- **PROJECT_BLUEPRINT.md** (84KB): junior-engineer teaching blueprint - 24 sections incl. sprint roadmap (4 weeks, 2 seniors + 4 interns), team responsibility matrix, OCR deep-dive, engineering decision log, interview prep, glossary, cheat sheet.
- **InvoicePilot_Engineering_Handbook.html:** formal handbook, 24 sections. "The one rule: everything flows through the backend." Security (OWASP table), testing strategy, deployment, risks, decision log, roadmap v2/v3.
- **Learning Guide (index.html):** 19 chapters with restaurant analogies and "Remember this" boxes - pedagogy for juniors. Includes a real 14-stage invoice journey and competitor research (BILL, Ramp, Tipalti, Stampli, Airbase, AvidXchange).
- **Siam_Brief:** full design-doc set - blockchain-seal.md, data-model-er.md, security-trust-boundaries.md, sequence-flows.md, deployment.md, system-context.md, screen-definitions/screen-field-spec, schema.sql + schema.prisma + SealRegistry.sol + SealRegistry.t.sol, ERP integration guides (Netsuite, QuickBooks, Sage, Xero), API endpoints.md (71KB), 24 lo-fi mockups.

## Assessment of idea/venture portfolio
- **Pattern:** Sajid doesn't just code - he designs products, runs competitor teardowns, models unit economics, and writes teachable docs. This is a distinctive "product-engineering" voice.
- **Best showcase angles:** (a) system-design essays (SynthGraph latency budgets), (b) honest-SaaS-operator essays (CustomerPulse unit economics), (c) tech-leadership content (InvoicePilot handbooks for interns).
