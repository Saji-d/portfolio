# 12 — Portfolio Design Specification (v1, PENDING APPROVAL)

> This is the design gate document. **No code is written until approved.** Approved 2026-08-02. Canonical contact/experience data locked from `E:\CV\cv.tex` (2026-07-30) — the latest CV on disk.

---

## 0. Decisions Applied (from user instructions)

| # | Decision | Applied |
| :-- | :-- | :-- |
| 1 | No credentials/API keys/.env/internal docs/confidential assets | ✅ Nothing secret is used; all copy is written from the analysis store only |
| 2 | Exclude LedgerCross private/company-owned code & docs | ✅ CustomerPulse, dr-stone, Argas, blueprints/handbooks/learning-guides are EXCLUDED. Only InvoicePilot + CaseVault shown (user-authorized as his own engineering work). |
| 3 | CaseVault = "AI-powered legal intelligence platform (Concept & MVP)" | ✅ No GraphRAG/Neo4j/Qdrant claims as shipped; listed as concept/planned |
| 4 | No internship-seeking wording | ✅ Profile is a working trainee/engineer, never "seeking internship" |
| 5 | Latest CV only for contact/experience | ✅ Locked from cv.tex (below) |
| 6 | InvoicePilot = flagship | ✅ Hero project, first case study, deepest detail |
| 7 | NeuroScreen = featured research | ✅ Research section anchor |
| 8 | LedgerTurf = strongest deployed full-stack app | ✅ Presented with live demo link |
| 9 | Premium engineer portfolio (not student) | ✅ Design system + copy tone below |
| 10 | Design gate before code | ✅ This document |

## 0.1 Canonical Contact & Experience (LOCKED — do not deviate)

- **Name:** Sajidur Rahman Sajid
- **Role line:** `Software Engineer | Backend & AI Systems.`
- **Email:** sajidsajidurrahman99@gmail.com
- **Phone:** +8801954832959
- **LinkedIn:** https://www.linkedin.com/in/sajidur-rahman-sajid/
- **GitHub:** https://github.com/Saji-d
- **Location:** Dhaka, Bangladesh
- **Experience:**
  - LedgerCross — Software Developer Trainee, May 2026 – Present
  - Bangladesh Software Solution (BSS) — Software Engineer Intern, Feb 2026 – Apr 2026
- **Education:** AIUB BSc CSE, CGPA 3.92/4.00, Sep 2022 – Apr 2026; HSC 5.00 (BAF Shaheen, 2019–2021); SSC 5.00 (Kurmitola, 2017–2019)
- **Honors:** 5x Dean's Award & AIUB Merit Scholar (70% waiver); Duke of Edinburgh's **Bronze** Award (per CV)
- **Leadership:** Student Activity Coordinator, Space Innovation Camp (2022–2025); PR Rep, WRO Bangladesh (2023–2024)

---

## 1. Sitemap

```
/                                Home (hero + all major sections)
├── /work                        Projects index (grid)
│   ├── /work/invoicepilot       ★ Flagship case study
│   ├── /work/ledgerturf         Deployed full-stack case study
│   ├── /work/casevault          Concept & MVP case study
│   └── /work/3d-city-simulation  Secondary case study
├── /research                    Research index
│   └── /research/neuronscreen   ★ Featured thesis case study
├── /about                       Bio, timeline, awards, leadership
├── /resume                      Full CV (download + inline)
├── /contact                     Contact page
└── /404                         Not found
```

**Notes:**
- 4 primary case studies + 1 research case study get full pages. Other secondary projects (FinBERT, Employee Registry, RFM, CVPR suite, Water Turbidity) appear as compact cards on `/work` and `/research` with short descriptions, not full pages.
- Single-page-per-major-section keeps it crawlable, fast, and premium (no student-style everything-on-one-page).

## 2. Information Architecture

### Global Navigation (sticky, top)
`Home` · `Work` · `Research` · `About` · `Resume` · `Contact` → right side: GitHub + LinkedIn icons + "Get in touch" button.

### Page → Section Mapping

**Home:**
1. Hero — name, role, tagline ("Learning > knowing." + engineering line), CTA buttons (View Work / Download CV), terminal card w/ rotating typed lines, quick stats (3.92 CGPA · 218 tests written · 2,237-dataset thesis · 4 production systems touched)
2. Selected Work — 3 featured cards (InvoicePilot, LedgerTurf, CaseVault) → `/work`
3. Research Spotlight — NeuroScreen metrics card → `/research/neuronscreen`
4. Experience — compact timeline (LedgerCross, BSS)
5. Skills — grouped pills (Backend, AI/ML, Frontend, Data, Web3, Tooling)
6. CTA — "Let's build something trustworthy." → `/contact`

**Work:** grid of all projects. Featured (4) large; secondary (FinBERT, Employee Registry, RFM, 3D City, CVPR, Water Turbidity) compact. Filters by category (Backend/AI/Full-stack/CV/Graphics).

**Work/[slug] (case study template):** Hero (title, role, stack, links) → Problem → Solution → Architecture (diagram) → Key decisions → Engineering highlights (code/math blocks) → Results/metrics → Screenshots gallery → Next steps/status → Other work CTA.

**Research:** NeuroScreen featured hero + metrics; paper list (FinBERT, Water Turbidity, BanglaBERT-XAI, HCI, RM) as compact academic entries.

**About:** short bio (premium tone) → timeline (education+career) → awards → leadership → values.

**Resume:** downloadable PDF (linked from canonical CV) + inline rendered content + references (2, from CV).

**Contact:** email, phone, LinkedIn, GitHub, location + short availability note.

### Priority of content
1. InvoicePilot (flagship) → 2. NeuroScreen (research anchor) → 3. LedgerTurf (deployed) → 4. CaseVault (concept/MVP) → 5. Experience/About credibility → 6. Secondary projects.

## 3. Design System

**Theme:** Dark-first (default), premium engineering aesthetic. Light theme optional (deferred to v2 — keeps scope tight).
**Feel:** "Trust-engineered" — precise, calm, high contrast, editorial whitespace, mono accents, one signature accent. Inspired by Linear / Vercel / Stripe-grade dark UIs.

### Principles
1. **Restraint** — one accent color, generous whitespace, no decorative clutter.
2. **Clarity over cleverness** — content legibility first; animation never obscures.
3. **Engineering honesty** — mono labels, terminal motifs, metrics shown as plain numbers.
4. **Accessibility** — WCAG AA contrast, reduced-motion support, keyboard nav, semantic HTML.

## 4. Color Palette

| Token | Hex | Usage |
| :-- | :-- | :-- |
| `--bg` | `#0B0E14` | Page background (deep ink-blue) |
| `--surface` | `#11151D` | Cards, panels |
| `--surface-2` | `#171C26` | Elevated cards, hover states |
| `--border` | `rgba(255,255,255,0.08)` | Hairlines, dividers |
| `--text-primary` | `#E6EAF2` | Headings, body emphasis |
| `--text-secondary` | `#9AA6B5` | Body copy |
| `--text-muted` | `#6B7686` | Meta, captions, eyebrows |
| `--accent` | `#4FD1C5` | **Signature teal** — links, CTAs, active states, data highlights |
| `--accent-dim` | `rgba(79,209,197,0.14)` | Glows, backgrounds, code highlights |
| `--accent-2` | `#7C7DFF` | Secondary (sparingly) — gradients, chart contrast |
| `--success/--warning/--danger` | `#3FB28A` / `#E8B44B` / `#E05B5B` | Only in metrics/labels where semantic |

**Contrast check:** `--text-primary` on `--bg` ≈ 15:1; `--text-secondary` ≈ 7.5:1; `--accent` ≈ 6.5:1 (AA for large text/UI). Dark mode default → no separate light palette yet.

## 5. Typography

| Role | Font | Weights | Notes |
| :-- | :-- | :-- | :-- |
| Display | **Space Grotesk** | 500 / 700 | Hero, section titles, card titles — distinctive geometric-tech character |
| Body | **Inter** | 400 / 500 / 600 | Paragraphs, UI, buttons |
| Mono | **JetBrains Mono** | 400 / 500 / 700 | Eyebrows, labels, code, stats, terminal, metadata |

### Type Scale (fluid, clamp-based)
| Token | Size | Line height | Usage |
| :-- | :-- | :-- | :-- |
| `display-1` | clamp(2.5rem, 6vw, 4.5rem) | 1.05 | Hero H1 |
| `display-2` | clamp(2rem, 4vw, 3rem) | 1.1 | Section titles |
| `h3` | 1.25–1.5rem | 1.3 | Card titles |
| `body-lg` | 1.125rem | 1.7 | Lead paragraphs |
| `body` | 1rem | 1.7 | Default |
| `body-sm` | 0.875rem | 1.6 | Secondary text |
| `caption` | 0.75rem | 1.5 | Meta, eyebrows (mono, uppercase, letter-spacing 0.12em) |

### Copy Tone (premium, not student)
- **Hero:** "Sajidur Rahman Sajid — Software Engineer & AI Engineer building high-throughput backends and production ML."
- **No** "Welcome to my portfolio 🎉". **No** "passionate about code". Instead: concrete, confident, metric-backed.
- Example eyebrow pattern: `[ 01 ] — SELECTED WORK`

## 6. Animation Plan (Framer Motion)

- **Motion-safe default:** everything uses `transform` + `opacity` only; global `prefers-reduced-motion` guard disables scroll/parallax animations.
- **Hero:** staggered fade+rise on load (70ms stagger); terminal card types rotating role lines; subtle radial glow behind H1.
- **Scroll reveals:** `whileInView` with `viewport={{ once: true, margin: '-15%' }}` — fade+rise 24px, 24ms ease, staggered for grids.
- **Hover:** cards lift 2px + border accent glow; project media scales 1.03; magnetic CTA button; animated underline links (scaleX).
- **Stats:** count-up on view (e.g., "218 tests", "0.982 AUC").
- **Page transitions:** light fade/slide between routes via `AnimatePresence` (keep <300ms).
- **Ticker/marquee:** slow auto-scroll of tech-stack pills on home (pausable on hover, hidden on reduced-motion).
- **Nav:** border/underline states on scroll; backdrop blur after 24px scroll.

## 7. Component Hierarchy

```
Layout
├── Nav (sticky, blur, active-section underline)
├── Footer (contact echo + copyright + back-to-top)
├── PageTransition
├── Metadata (SEO head)

Atoms
├── Button (primary / ghost / link variants; sizes)
├── Icon (lucide-react)
├── Badge / Pill (stack, status: ACTIVE/COMPLETE/CONCEPT)
├── Eyebrow (mono, uppercase, `[ 01 ]` numbering)
├── Stat (value + label; count-up)
├── CodeBlock (terminal motif, copy button)
├── Tag / Chip (category filter)
└── Divider / GridLine

Molecules
├── SectionHeading (eyebrow + title + lede + optional link)
├── ProjectCard (featured / compact variants)
├── ResearchCard
├── TimelineItem (experience/education)
├── SkillGroup (category + pill list)
├── MetricCard (research results)
├── TerminalCard (hero typing effect)
├── GalleryItem (screenshot w/ lightbox)
└── LinkCard (GitHub / Live / Paper)

Organisms
├── Hero (intro + terminal + stats)
├── SelectedWork / WorkGrid (with category filter)
├── ResearchSpotlight / ResearchList
├── ExperienceTimeline
├── SkillsSection
├── ContactCTA / ContactSection
└── CaseStudy (hero→gallery, data-driven from content files)

Pages (Templates)
├── HomePage
├── WorkPage / WorkIndexPage
├── CaseStudyPage (slug-driven)
├── ResearchPage / ResearchIndexPage
├── ResearchCasePage (slug-driven)
├── AboutPage
├── ResumePage
├── ContactPage
└── NotFoundPage
```

## 8. Technology Stack

| Layer | Choice | Why |
| :-- | :-- | :-- |
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR/SSG, SEO, his core stack, premium feel |
| Styling | **Tailwind CSS v4** + CSS custom properties | Design tokens, fast, no runtime |
| Animation | **Framer Motion (motion)** | Declarative, reduced-motion aware |
| Content | **MDX** (case studies) + typed TS data files (projects.ts, research.ts) | Content-rich case studies, type-safe data |
| Icons | **lucide-react** | Consistent, lightweight |
| Fonts | **next/font** — Space Grotesk, Inter, JetBrains Mono | Self-hosted, zero CLS |
| Deploy | **Vercel** (+ `sajidur.dev` domain recommended) | CI/CD, previews, analytics |
| SEO | Metadata API + OpenGraph + JSON-LD (`Person` schema) | Discoverability |
| Perf targets | Lighthouse ≥ 95 (Perf/A11y/Best-Practices/SEO), LCP < 1.8s | Premium requirement |

**Explicitly not used:** no heavy CMS, no client DB, no auth, no framework boilerplate; static + MDX only.

## 9. Page Structure (wireframes)

### Home
```
Nav
Hero
  eyebrow [ SOFTWARE ENGINEER — DHAKA ]
  H1  Sajidur Rahman Sajid
  lede "Building high-throughput backends and production machine learning. Learning > knowing."
  CTA [View Work] [Download CV]
  TerminalCard (rotating: "~$ pip install trust · 218 tests passed · Redis Streams → seal → verify")
  Stats strip (3.92 CGPA · 218 tests · 2,237 dataset · 5x Dean's)
Selected Work (3 featured cards + "All projects →")
Research Spotlight (NeuroScreen metrics card + link)
Experience (2-item timeline: LedgerCross, BSS)
Skills (6 groups)
Contact CTA
Footer
```

### Case Study (e.g. InvoicePilot) — template
```
Nav
Hero: title, role badge, stack pills, links (GitHub·live if any), status badge
Problem (why)
Solution (what I built)
Architecture (ASCII/SVG diagram block)
Key Engineering Decisions (numbered list)
Highlights (code/math blocks)
Results (metrics grid)
Screenshots (gallery + lightbox)
Status & Next Steps
Other Work (2 cards)
Footer
```

### Research (NeuroScreen)
```
Hero: title, field, one-liner
Metrics grid: Acc 95.20% · Pre 94.40% · Rec 96.10% · F1 95.24% · AUC 0.982
Method (dataset, dual-path ensemble, blending)
Results table vs baselines (CatBoost 94.12, ANN 91.25)
Feature importance
Related research list (FinBERT, Turbidity, BanglaBERT-XAI)
CTA: thesis PDF / GitHub
```

## 10. Content Inventory (pre-filled from analysis store)

- **Featured (case studies):** InvoicePilot, LedgerTurf, CaseVault, 3D City Simulation, NeuroScreen.
- **Secondary cards (/work):** FinBERT, Employee & Family Registry, RFM Customer Segmentation, CVPR Collection, Water Turbidity, Twitter Sentiment.
- **Secondary cards (/research):** FinBERT, Water Turbidity, BanglaBERT Explainable Toxicity, HCI Paper, RM Paper.
- **Excluded entirely:** CustomerPulse, dr-stone, Argas, all LedgerCross internal docs/blueprints/handbooks/learning guides, Spark Gym (low value), Java course zips, BookStore DB (skip or lowest-priority card), learning journeys.
- **Contact & Experience:** locked in §0.1.

## 11. Refinements v1.1 (APPROVED)

| # | Refinement | Applied |
| :-- | :-- | :-- |
| 1 | Role line = `Software Engineer \| Backend & AI Systems.` | ✅ |
| 2 | Replace "Learning > knowing." with natural engineering tagline | ✅ Tagline: "I build high-throughput backend systems and production ML pipelines — engineered to be fast, reliable, and worth trusting." |
| 3 | "Currently" section highlighting LedgerCross active work | ✅ Home section between Work and Research |
| 4 | Animated career timeline: AIUB → Dean's Awards → BSS → LedgerCross | ✅ Home (scroll-driven line draw + node glow) |
| 5 | Apple/Stripe/Linear-grade premium UI (spacing, typography, subtle interactions) | ✅ Design tokens + interaction layer below |
| 6 | Interactions: cursor glow, card tilt, magnetic buttons, depth-on-hover, animated network/grid background (performant) | ✅ |
| 7 | Optional Terminal Mode (visitor browses profile via commands) | ✅ ` (backtick) or nav button → full-screen terminal |
| 8 | Strong animated statistics (3.92/4.00, 218+ tests, 5× Dean's, etc.) | ✅ Count-up counters |
| 9 | Handcrafted, unique pages — no template look | ✅ Bespoke copy + per-page layouts |

### Interaction Layer (v1.1)
- **Cursor glow:** fixed radial gradient following pointer (transform-only, disabled on touch/reduced-motion).
- **Card tilt:** subtle perspective tilt on project cards (≤3°), reset on leave.
- **Magnetic buttons:** CTAs translate toward cursor by a few px.
- **Depth on hover:** lift +2px, border accent glow, media scale 1.03.
- **Background:** canvas network/topology (nodes + nearest-neighbor lines + travelling signal pulses), DPR-aware, paused when tab hidden / reduced-motion.
- **Terminal mode:** full-screen overlay; commands `help whoami about work research projects <slug> skills timeline contact resume clear exit`; JetBrains Mono, teal prompt.

## 12. Open Questions (resolved)
1. ✅ Approved 2026-08-02.
2. **Domain:** Vercel subdomain during build; `sajidur.dev` recommended before launch (user to decide).
3. **Screenshots:** capture InvoicePilot (from running dev app) + LedgerTurf (from deployed demo) during build; existing assets for 3D City / Employee Registry.
4. **CaseVault/InvoicePilot GitHub links:** omit links that would 404 (private `ledgercross-team` repos); keep case-study content. LedgerTurf keeps its public link.
5. **Light theme:** v2 only. ✅
2. **Domain:** register `sajidur.dev` or use a Vercel subdomain for now?
3. **Screenshots:** InvoicePilot + LedgerTurf have none on disk — I'll capture from the running app / deployed demo during build. OK?
4. CaseVault/InvoicePilot GitHub links: repos are under `ledgercross-team` (likely private). Link to the repos anyway (may 404 for visitors) or omit GitHub links and show only a case-study? **Recommend: omit links that 404; keep case study content.**
5. Light theme in v2 only — OK?
