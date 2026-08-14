import type { Project } from "@/data/projects";
import type { ResearchStudy } from "@/data/research";
import { projects } from "@/data/projects";
import { researchPapers } from "@/data/research";
import {
  TERMINAL_COMMANDS,
  type TerminalCommand,
} from "@/data/terminal";

export const CONSOLE_LABEL = "cortex // self-inspection console";
export const CONSOLE_VERSION = "v2.4.1";
export const PROMPT = "sajid@brain:~$";

export type CommandDef = TerminalCommand;

export { TERMINAL_COMMANDS };

export const COMMANDS: CommandDef[] = TERMINAL_COMMANDS.filter(
  (c) => !/\s/.test(c.id),
);

export const WHOAMI_ROLES: string[] = [
  "full-stack software engineer",
  "ai engineer",
  "builds production-ready systems",
  "works across ml, cv & nlp",
  "research-driven problem solver",
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

export type FlowTag = "production" | "research" | "project";

export interface FlowItem {
  id: string;
  title: string;
  tag: FlowTag;
  card: string;
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
        card: "AI invoice extraction, normalization, validation and fraud detection.",
        tagline: pj("invoicepilot").summary,
        href: "/projects/invoicepilot",
      },
      {
        id: "casevault",
        title: "CaseVault",
        tag: "production",
        card: "Privacy-first legal research with GraphRAG retrieval and cited AI summaries.",
        tagline: pj("casevault").summary,
        href: "/projects/casevault",
      },
      {
        id: "ledgerturf",
        title: "LedgerTurf",
        tag: "production",
        card: "Real-time turf booking with map discovery and slot conflict protection.",
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
        card: "CatBoost + ANN ensemble for cognitive-impairment detection.",
        tagline: rs("neuronscreen").oneLiner,
        href: "/research/neuronscreen",
      },
      {
        id: "finbert",
        title: "FinBERT",
        tag: "research",
        card: "Fine-tuned FinBERT vs BERT on financial sentiment in one notebook.",
        tagline: pj("finbert").tagline,
        href: "/projects/finbert",
      },
      {
        id: "twitter-sentiment",
        title: "Twitter Sentiment",
        tag: "research",
        card: "TF-IDF + Multinomial Naïve Bayes on 200k balanced tweets.",
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
        card: "Real-time face detection and recognition pipeline.",
        tagline: pj("face-recognition-system").tagline,
        href: "/projects/face-recognition-system",
      },
      {
        id: "water-turbidity",
        title: "Water Turbidity",
        tag: "research",
        card: "EfficientNet-B0 turbidity classification on 300+ real-world images.",
        tagline: rs("water-turbidity").oneLiner,
        href: "/research/water-turbidity",
      },
      {
        id: "3d-city",
        title: "3D City Generator",
        tag: "project",
        card: "Procedural city with day-night lighting, rain, snow and traffic logic.",
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
        card: "Interactive Java learning platform with courses, quizzes, and progress.",
        tagline: pj("codingvibes-java-gui").tagline,
        href: "/projects/codingvibes-java-gui",
      },
      {
        id: "employee-registry",
        title: "Employee Registry",
        tag: "project",
        card: "Employee registry with family trees, full-text search, and PDF exports.",
        tagline: pj("employee-family-registry").tagline,
        href: "/projects/employee-family-registry",
      },
      {
        id: "wedding",
        title: "Wedding Invitation",
        tag: "project",
        card: "Cinematic digital invitation with RSVP, countdown, and gallery.",
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
