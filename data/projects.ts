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
      "Audit-grade invoice processing: extraction, normalization, business and fraud rule checks, human approval, then a cryptographic on-chain seal of the exact uploaded bytes (hash-only), so no invoice data ever lands on-chain.",
    role: "Full-Stack / AI Engineer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/invoicepilot-thumbnail.webp",
    caseStudy: true,
    stack: ["FastAPI", "Fastify", "BullMQ", "PostgreSQL", "Solidity"],
  },
  {
    slug: "fumak-inventory",
    name: "Fumak Inventory Management System",
    tagline: "Production inventory management system for a retail shop: camera-based barcode scanning, stock tracking, sales recording, and revenue analytics in one offline-first workflow.",
    summary:
      "A production inventory management system for FUMAK retail: CameraX + Google ML Kit turn the phone's camera into a barcode scanner for product lookup, stock add/remove/adjust, single-item sales with automatic stock deduction, and revenue analytics — fully offline, with all data local to the device.",
    role: "Android Engineer",
    status: "ACTIVE",
    category: "Professional",
    badges: ["Production"],
    featured: true,
    cover: "/images/thumbnails/fumak-thumbnail.webp",
    caseStudy: true,
    github: "https://github.com/Saji-d/fumak-inventory",
    stack: ["Kotlin", "Jetpack Compose", "Room", "CameraX", "ML Kit"],
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
    featured: true,
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
    name: "FinBERT Financial Sentiment Analysis",
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
    name: "CodingVibes Learning Platform",
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
    name: "3D Procedural City Generator",
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
    name: "SparkPowerhouse Gym Desktop",
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
    name: "SparkPowerhouse Gym Web",
    tagline: "Web-based gym management system with distinct member and admin areas for class bookings, memberships, and billing in one session-driven application.",
    summary:
      "A web gym-management simulation with distinct member and admin areas: class booking, memberships, and billing kept in one session-driven application.",
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
    name: "Online Bookstore Database",
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

// The home "Projects" chapter is deliberately capped at 12 cards while the
// full collection (14) lives on /projects. The two entries below stay in the
// archive but are left out of the primary grid: the database-design study
// (spec-only, weakest visual payoff) and the wedding invitation (personal).
export const primaryProjects: Project[] = projects.filter(
  (p) =>
    p.slug !== "online-bookstore-database-design" &&
    p.slug !== "my-wedding-invitation",
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
