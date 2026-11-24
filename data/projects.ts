export type ProjectRepoAccess = "public" | "private" | "unavailable";

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
  | "Creative"
  | "Mini Project";

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
  preserveCoverFrame?: boolean;
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
    stack: ["Kotlin", "Jetpack Compose", "Fastify", "Prisma", "PostgreSQL", "Twilio", "Python", "PyTorch", "Seed-VC", "React", "Vite", "Hilt", "Retrofit"],
    featuredTagline: "Android-first AI voice calling: live speech is converted on a GPU into an authorized voice and delivered over a normal phone call, ending the call rather than forwarding raw audio.",
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
    featuredTagline: "A student and learning platform for Australian colleges, designed to take a learner from application to certificate.",
    cover: "/images/thumbnails/lumifi-sms-admissions.webp",
    preserveCoverFrame: true,
    caseStudy: true,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle ORM", "Better Auth", "Tailwind CSS", "Vitest"],
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
    featuredTagline: "Cross-border hiring for Australian businesses, with a talent network across eight job segments in Bangladesh.",
    cover: "/images/thumbnails/world-bridge-thumbnail.webp",
    caseStudy: true,
    stack: ["Next.js", "React", "TypeScript", "GSAP", "CSS"],
    plannedStack: ["PostgreSQL", "Prisma", "Cloudflare R2", "Auth.js", "Resend", "Vercel"],
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
    featuredTagline: "Cloud ERP for service businesses, with quote-to-invoice, purchasing, stock and finance in one workspace.",
    cover: "/images/thumbnails/aria-erp-warm-ink.webp",
    preserveCoverFrame: true,
    caseStudy: true,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Better Auth", "Tailwind CSS", "Vitest", "Vercel"],
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
  },
  {
    slug: "zenji-storefront",
    name: "ZENJI Storefront",
    tagline: "Anime streetwear storefront with quick view, a cart drawer with shipping meter, a saved wishlist and a campaign-style homepage.",
    summary:
      "A limited-drop shopping experience on React 19, strict TypeScript and Vite: ten designs with quick view and size picking, a cart drawer and page with a free-shipping meter, a persisted wishlist and a Vitest suite plus axe-core accessibility scans. Built as a frontend technical assessment.",
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
    slug: "bytespace-learn",
    name: "ByteSpace",
    tagline: "Pixel-faithful recreation of a course-platform landing page from Figma, with live course search and login pages.",
    summary:
      "A responsive Next.js recreation of an online-learning landing page: hero with live course search, topic-chip filtering driven by shareable URL params, course and category grids, testimonials and bonus login and register pages, statically prerendered with Tailwind CSS v4 design tokens. Built as a frontend technical assessment from a Figma design.",
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
    slug: "spark-powerhouse-gym-web",
    name: "Spark Powerhouse Web",
    tagline: "Gym management web app in PHP and MySQL with session-based login, profile uploads and personal dashboards.",
    summary:
      "A PHP and MySQL gym-management web app built on a clean MVC structure: registration, session-based login, profile management with image uploads and personal dashboards.",
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
    tagline: "Employee registry with spouse and children records, fast search and one-click PDF exports from an ASP.NET Core API.",
    summary:
      "An employee registry with spouse and children records, case-insensitive search across name, NID and department and QuestPDF-generated CV and list exports, one ASP.NET Core API serving a React workspace. Built as a technical assessment.",
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

// The home "Projects" chapter: three featured builds, then a nine-card
// archive of the strongest remaining work, best first. Everything else
// (course, desktop and frontend-only projects) lives on the full /projects list.
const HOME_SLUGS = [
  "lumifi-sms",
  "world-bridge",
  "aria-erp",
  "voicecon",
  "invoicepilot",
  "fumak-inventory",
  "nitor-patient-management",
  "ledgerturf",
  "casevault",
  "zenji-storefront",
  "doctor-tracker",
  "neuro-screen",
];
export const primaryProjects: Project[] = HOME_SLUGS.map(
  (slug) => projects.find((p) => p.slug === slug)!,
);

const homeSlugs = new Set(HOME_SLUGS);
export const allProjects = [
  ...primaryProjects,
  ...projects.filter((project) => !homeSlugs.has(project.slug)),
];

/** Badge text for a project's delivery stage: ongoing professional builds are "In development", not "Production". */
export function stageLabel(p: Pick<Project, "status" | "category">): string {
  if (p.category === "Professional") return p.status === "ACTIVE" ? "In development" : "Production";
  return p.category;
}

/** University (AIUB) projects, shown in their own group at the bottom of the unfiltered Projects page. */
export const UNIVERSITY_WORK = new Set<string>([
  "finbert",
  "face-recognition-system",
  "3d-city-simulation",
  "codingvibes-java-gui",
  "spark-powerhouse-gym-csharp",
  "spark-powerhouse-gym-web",
  "employee-family-registry",
  "online-bookstore-database-design",
]);

/** Who did the work, shown at the top of each case study. Unlisted projects show no ownership label. */
export const OWNERSHIP: Record<string, string> = {
  voicecon: "Solo build",
  "fumak-inventory": "Solo build",
  casevault: "Solo build",
  ledgerturf: "Solo build",
  "zenji-storefront": "Solo build",
  "mini-kanban-board": "Solo build",
  "doctor-tracker": "Solo build",
  "bytespace-learn": "Solo build",
  invoicepilot: "Team project · four engineers",
  "nitor-patient-management": "Team project · two engineers",
};

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
  "Mini Project",
];
