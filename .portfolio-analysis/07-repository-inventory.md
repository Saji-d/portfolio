# 07 — Repository Inventory

## Git Repositories Found (with remotes, branches, commit counts)

| Repo | Path | Remote | Branch | Commits | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| invoice-pilot (monorepo) | X:\invoice-pilot | github.com/ledgercross-team/invoice-pilot.git | main | 70 | Full monorepo: backend/api, backend/worker, backend/shared-types, frontend, contracts, invoice-ai-service (lean copy), docs, CI |
| invoice-pilot (standalone) | X:\InvoicePilot | github.com/ledgercross-team/invoice-pilot.git | Sajid | 23 | Advanced invoice-ai-service v2.0 (worker, fraud, anomaly, repositories, R2) + roadmap |
| CaseVault | X:\CaseVault | github.com/ledgercross-team/casevault.git | Sajid | 1 (+ nested frontend repo: "Initial commit from Create Next App") | Phase-1 MVP; uncommitted backend changes |
| CustomerPulse AI | X:\CustomerPulse AI | github.com/ledgercross-team/customer-pulse.git | main | 1 | Private; MVP bootstrap + untracked deck |
| LedgerTurf | X:\LedgerTurf | github.com/Saji-d/ledgerturf.git | main | 37 | Clean tree; deployed |
| dr-stone | X:\dr-stone | github.com/ledgercross-team/dr-stone.git | Sajid | 26 | Uncommitted WIP (wards/beds/search/migrations) |
| Course-Projects | X:\Course-Projects | remote `ledgerturf` → github.com/Saji-d/ledgerturf.git | Sajid | 75 | Course repo; also contains IBM/Blockchain learning journeys |
| employee-family-registry | E:\AIUB\My PROJECTS\employee-family-registry | github.com/Saji-d/employee-family-registry.git | main | 1 | Initial commit |
| bss-internship-tasks | E:\AIUB\Internship-BSS\Tasks | github.com/Saji-d/bss-internship-tasks.git | main | 3 | 6 frontend tasks |
| html-css-learning-journey | E:\AIUB\Internship-BSS\html-css-learning-journey | github.com/Saji-d/html-css-learning-journey.git | main | 36 | 18 numbered projects |
| bootstrap-learning-journey | E:\AIUB\Internship-BSS\bootstrap-learning-journey | (no .git found) | — | — | Local folder only |
| javascript-learning-journey | E:\AIUB\Internship-BSS\javascript-learning-journey | (no .git found) | — | — | Local folder only |
| CG Project | E:\AIUB\My PROJECTS\CG Project | (no .git found) | — | — | Contains src/main.cpp |
| CodingVibes Project | E:\AIUB\My PROJECTS\CodingVibes Project | (no .git found) | — | — | Java Swing app |
| Web Tech Project | E:\AIUB\My PROJECTS\Web Tech Project | (no .git found) | — | — | SparkPowerhouseGym.zip |

## Public GitHub Profile (Saji-d)
- **URL:** https://github.com/Saji-d
- **Stats:** 20 repositories, 2 followers, 1 following, 0 stars, 0 projects, Pro badge
- **Pinned repos:** natural-language-processing, online-bookstore-database-design, computer-vision-and-pattern-recognition, spark-powerhouse-gym-csharp, ledgerturf
- **README profile:** "👋 Hi, I'm Sajidur Rahman Sajid — CSE undergraduate, aspiring AI/ML Engineer." Focus areas: NLP, ML/DL, CV, data-driven evaluation. Goal line: "Seeking an AI/ML internship..." — **OUTDATED** (he's now a working trainee at LedgerCross; profile still says student/aspiring + seeking internship).
- **Repo names referenced in CV/MASTER_PROFILE that should exist:** natural-language-processing, computer-vision-and-pattern-recognition, rfm-based-customer-segmentation-and-early-risk-prediction, financial-sentiment-analysis-bert (CV references financial-sentiment-analysis-bert; MASTER_PROFILE references natural-language-processing — verify), face-recognition-system, 3d-city-simulation-opengl, ibm-fullstack-javascript-learning-journey, blockchain-ethereum-solidity-learning-journey, ledgerturf, employee-family-registry, bss-internship-tasks, html-css-learning-journey, online-bookstore-database-design, spark-powerhouse-gym-csharp.

## Observations / Risks
1. **LedgerCross org vs personal:** His most impressive work (InvoicePilot, CaseVault, CustomerPulse, dr-stone) lives under **ledgercross-team/** — likely private/org repos. His personal public GitHub is dominated by academic/course work. For a personal portfolio, he needs either (a) permission to highlight org work, (b) public mirrors with sanitized code, or (c) strong case studies written from the code.
2. **Low follower/star counts** — normal for a junior, but means the profile must be actively curated (pinned flagship repos, README refresh).
3. **Profile README is stale** — says "seeking internship" and "aspiring" while he holds a trainee role. Refresh needed.
4. **Course-Projects has a weird remote** (remotes to ledgerturf) — likely misconfiguration; clean up.
5. **Only single commits** for CaseVault and CustomerPulse — history doesn't show work depth; if making public, consider squashing/rewriting cleanly or documenting design docs instead.
6. **Nested git repo in CaseVault** frontend — messy for collaborators.
