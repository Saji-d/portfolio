export type ProjectStatus = "ACTIVE" | "COMPLETE" | "CONCEPT";

export type ProjectBadge = "Professional" | "Production" | "Research" | "Featured";

export type ProjectCategory =
  | "Professional"
  | "NLP"
  | "CVPR"
  | "Mobile"
  | "Desktop"
  | "Web"
  | "Graphics"
  | "Database"
  | "Research"
  | "Creative";

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
  category: ProjectCategory;
  badges: ProjectBadge[];
  featured: boolean;
  cover: string;
  caseStudy?: boolean;
  github?: string;
  demo?: string;
  thesis?: string;
  stack: string[];
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
  },
  {
    slug: "fumak-inventory",
    name: "FUMAK Inventory",
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
    slug: "spark-powerhouse-gym-web",
    name: "Spark Powerhouse Web",
    tagline: "Academic web simulation of a gym management system with session-based auth, profile management, and a PHP/MySQL MVC backend.",
    summary:
      "A PHP and MySQL gym-management simulation built to demonstrate clean MVC structure: registration, session-based login, profile management with image uploads, and personal dashboards, no real payments or external APIs.",
    role: "Web Developer",
    status: "COMPLETE",
    category: "Web",
    badges: [],
    featured: false,
    cover: "/images/thumbnails/sparkpowerhouse-gym-web-thumbnail.webp",
    github: "https://github.com/Saji-d/spark-powerhouse-gym-web",
    stack: ["PHP", "MySQL", "JavaScript"],
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

// The home "Projects" chapter shows every project except the wedding
// invitation (personal) and the Spark Powerhouse web variant, which stay
// archived under the full /projects list.
const HOME_EXCLUDED_SLUGS = new Set([
  "my-wedding-invitation",
  "spark-powerhouse-gym-web",
]);
export const primaryProjects: Project[] = projects.filter(
  (p) => !HOME_EXCLUDED_SLUGS.has(p.slug),
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getCaseStudyProjects(): Project[] {
  return projects.filter((p) => p.caseStudy);
}

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "Professional",
  "NLP",
  "CVPR",
  "Mobile",
  "Desktop",
  "Web",
  "Graphics",
  "Database",
  "Research",
  "Creative",
];
