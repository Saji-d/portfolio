import type { Project } from "@/data/projects";
import type { ResearchStudy } from "@/data/research";
import { projects } from "@/data/projects";
import { researchPapers } from "@/data/research";

export const CONSOLE_LABEL = "cortex — self-inspection console";
export const CONSOLE_VERSION = "v2.4.1";
export const PROMPT = "sajid@brain:~$";

export interface CommandDef {
  id: string;
  hint: string;
}

export const COMMANDS: CommandDef[] = [
  { id: "whoami", hint: "read identity" },
  { id: "skills", hint: "open the neural map" },
  { id: "projects", hint: "traverse the dependency graph" },
  { id: "journey", hint: "walk the roadmap" },
  { id: "research", hint: "browse the archive" },
  { id: "help", hint: "list commands" },
  { id: "clear", hint: "reset the session" },
  { id: "exit", hint: "end the session" },
];

export const WHOAMI_ROLES: string[] = [
  "software engineer",
  "ai engineer",
  "machine learning",
  "natural language processing",
  "computer vision",
  "research",
  "production software",
];

export const WHOAMI_LINKS = [
  {
    label: "email",
    value: "sajidsajidurrahman99@gmail.com",
    href: "mailto:sajidsajidurrahman99@gmail.com",
  },
  {
    label: "github",
    value: "github.com/Saji-d",
    href: "https://github.com/Saji-d",
  },
  {
    label: "linkedin",
    value: "in/sajidur-rahman-sajid",
    href: "https://www.linkedin.com/in/sajidur-rahman-sajid/",
  },
];

export interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export const SKILL_NODES: SkillNode[] = [
  { id: "research", label: "Research", x: 24, y: 12 },
  { id: "ai", label: "AI Engineering", x: 15, y: 36 },
  { id: "ml", label: "Machine Learning", x: 27, y: 70 },
  { id: "nlp", label: "Natural Language Processing", x: 50, y: 12 },
  { id: "cv", label: "Computer Vision", x: 79, y: 26 },
  { id: "backend", label: "Backend", x: 83, y: 60 },
  { id: "db", label: "Databases", x: 58, y: 86 },
];

export const SKILLS_MOBILE: string[] = [
  "Machine Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Backend",
  "Databases",
  "Research",
  "AI Engineering",
];

export const SKILL_DETAILS: Record<string, string[]> = {
  research: ["CatBoost", "SHAP / LIME", "PyTorch", "Streamlit"],
  ai: ["FastAPI", "React", "PostgreSQL", "Solidity"],
  ml: ["PyTorch", "Hugging Face", "Scikit-learn", "Pandas"],
  nlp: ["Transformers", "BanglaBERT", "NLTK", "TF-IDF"],
  cv: ["OpenCV", "FaceNet", "EfficientNet"],
  backend: ["FastAPI", "Node.js", "Redis Streams", "BullMQ"],
  db: ["PostgreSQL", "MySQL", "MongoDB", "Qdrant"],
};

export interface JourneyStop {
  step: string;
  label: string;
  period: string;
  note: string;
  x: number;
  current?: boolean;
}

export const JOURNEY: JourneyStop[] = [
  {
    step: "01",
    label: "Desktop",
    period: "2022 — 23",
    note: "First programs shipped as windows apps — CodingVibes, gym suites, Swing and WinForms.",
    x: 4,
  },
  {
    step: "02",
    label: "Web",
    period: "2023",
    note: "Full-stack web projects — session-driven apps, responsive interfaces, REST wiring.",
    x: 22,
  },
  {
    step: "03",
    label: "Database",
    period: "2023",
    note: "Relational design — full normalization, ER mapping, query-heavy systems.",
    x: 40,
  },
  {
    step: "04",
    label: "Machine Learning",
    period: "2024",
    note: "Coursework turned models — FinBERT sentiment, classical NLP pipelines.",
    x: 58,
  },
  {
    step: "05",
    label: "Research",
    period: "2025",
    note: "Thesis and papers — NeuroScreen hybrid ensemble, turbidity, BanglaBERT, churn.",
    x: 76,
  },
  {
    step: "06",
    label: "Production AI",
    period: "2026 — now",
    note: "LedgerCross — InvoicePilot and CaseVault. Verified, shipped, live.",
    x: 94,
    current: true,
  },
];

export type FlowTag = "production" | "research" | "project";

export interface FlowItem {
  id: string;
  title: string;
  tag: FlowTag;
  tagline: string;
  href: string;
}

export interface FlowNode extends FlowItem {
  col: number;
  row: number;
}

export interface FlowColumn {
  label: string;
  tone: "accent" | "violet" | "muted";
  items: FlowItem[];
}

const pj = (slug: string): Project => projects.find((p) => p.slug === slug)!;
const rs = (slug: string): ResearchStudy => researchPapers.find((r) => r.slug === slug)!;

export const FLOW_COLUMNS: FlowColumn[] = [
  {
    label: "Professional",
    tone: "accent",
    items: [
      {
        id: "invoicepilot",
        title: "InvoicePilot",
        tag: "production",
        tagline: pj("invoicepilot").summary,
        href: "/projects/invoicepilot",
      },
      {
        id: "casevault",
        title: "CaseVault GraphRAG",
        tag: "production",
        tagline: pj("casevault").summary,
        href: "/projects/casevault",
      },
      {
        id: "ledgerturf",
        title: "LedgerTurf",
        tag: "production",
        tagline: pj("ledgerturf").summary,
        href: "/projects/ledgerturf",
      },
    ],
  },
  {
    label: "Research",
    tone: "violet",
    items: [
      {
        id: "neuronscreen",
        title: "NeuroScreen",
        tag: "research",
        tagline: rs("neuronscreen").oneLiner,
        href: "/research/neuronscreen",
      },
      {
        id: "finbert",
        title: "FinBERT",
        tag: "research",
        tagline: pj("finbert").tagline,
        href: "/projects/finbert",
      },
      {
        id: "twitter-sentiment",
        title: "Twitter Sentiment",
        tag: "research",
        tagline: rs("twitter-sentiment").oneLiner,
        href: "/research/twitter-sentiment",
      },
    ],
  },
  {
    label: "Computer Vision",
    tone: "muted",
    items: [
      {
        id: "face-recognition",
        title: "Face Recognition",
        tag: "project",
        tagline: pj("face-recognition-system").tagline,
        href: "/projects/face-recognition-system",
      },
      {
        id: "water-turbidity",
        title: "Water Turbidity",
        tag: "research",
        tagline: rs("water-turbidity").oneLiner,
        href: "/research/water-turbidity",
      },
      {
        id: "3d-city",
        title: "3D City Generator",
        tag: "project",
        tagline: pj("3d-city-simulation").tagline,
        href: "/projects/3d-city-simulation",
      },
    ],
  },
  {
    label: "Craft",
    tone: "muted",
    items: [
      {
        id: "codingvibes",
        title: "CodingVibes",
        tag: "project",
        tagline: pj("codingvibes-java-gui").tagline,
        href: "/projects/codingvibes-java-gui",
      },
      {
        id: "employee-registry",
        title: "Employee Registry",
        tag: "project",
        tagline: pj("employee-family-registry").tagline,
        href: "/projects/employee-family-registry",
      },
      {
        id: "wedding",
        title: "Wedding Invitation",
        tag: "project",
        tagline: pj("my-wedding-invitation").tagline,
        href: "/projects/my-wedding-invitation",
      },
    ],
  },
];

export const FLOW_NODES: FlowNode[] = FLOW_COLUMNS.flatMap((col, ci) =>
  col.items.map((item, ri) => ({ ...item, col: ci, row: ri })),
);

export const FLOW_EDGES: [string, string][] = FLOW_NODES.slice(0, -1).map((n, i) => [
  n.id,
  FLOW_NODES[i + 1].id,
]);

export interface ResearchLeaf {
  id: string;
  file: string;
  title: string;
  oneLiner: string;
  metrics: { value: string; label: string }[];
  href: string;
}

export interface ResearchFolder {
  name: string;
  leaves: ResearchLeaf[];
}

const leaf = (r: ResearchStudy, ext: string): ResearchLeaf => ({
  id: r.slug,
  file: `${r.slug}.${ext}`,
  title: r.shortTitle,
  oneLiner: r.oneLiner,
  metrics: r.metrics ?? [],
  href: `/research/${r.slug}`,
});

export const RESEARCH_TREE: ResearchFolder[] = [
  { name: "thesis", leaves: [leaf(rs("neuronscreen"), "pdf")] },
  { name: "nlp", leaves: [leaf(rs("twitter-sentiment"), "ipynb"), leaf(rs("banglabert"), "ipynb")] },
  { name: "data-science", leaves: [leaf(rs("early-warning-customer-churn"), "ipynb")] },
  { name: "computer-vision", leaves: [leaf(rs("water-turbidity"), "pdf")] },
];
