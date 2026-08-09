export interface SkillGroup {
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Backend",
    skills: [
      "Python",
      "FastAPI",
      "Node.js",
      "Express",
      "NestJS",
      "PostgreSQL",
      "SQLAlchemy",
      "Redis Streams",
      "BullMQ",
      "Docker",
      "REST",
    ],
  },
  {
    label: "AI / ML",
    skills: [
      "PyTorch",
      "CatBoost",
      "Scikit-learn",
      "Hugging Face",
      "Pandas",
      "NumPy",
      "Transformers",
      "OpenCV",
      "SHAP / LIME",
    ],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Redux", "Framer Motion"],
  },
  {
    label: "Data & Databases",
    skills: ["MongoDB", "SQLite", "Supabase", "Cloudflare R2", "Qdrant", "Neo4j"],
  },
  {
    label: "Web3",
    skills: ["Solidity", "Foundry", "OpenZeppelin", "Viem", "Turnkey KMS"],
  },
  {
    label: "Tooling & Practice",
    skills: ["Git", "pytest", "CI / CD", "Vercel", "Linux", "Npm Workspaces"],
  },
];

export interface SkillNetworkNode {
  id: string;
  label: string;
  techs: string[];
}

export const SKILL_NETWORK: {
  center: string;
  disciplines: SkillNetworkNode[];
} = {
  center: "THE ENGINEER",
  disciplines: [
    {
      id: "research",
      label: "Research",
      techs: ["CatBoost", "Scikit-learn", "SHAP / LIME", "Pandas"],
    },
    {
      id: "ai-engineering",
      label: "AI Engineering",
      techs: ["PyTorch", "Hugging Face", "Transformers", "LLMs"],
    },
    {
      id: "computer-vision",
      label: "Computer Vision",
      techs: ["OpenCV", "FaceNet", "EfficientNet-B0", "Transfer Learning"],
    },
    {
      id: "machine-learning",
      label: "Machine Learning",
      techs: ["Scikit-learn", "CatBoost", "PyTorch", "NumPy", "Pandas"],
    },
    {
      id: "databases",
      label: "Databases",
      techs: ["PostgreSQL", "MongoDB", "MySQL", "Qdrant", "Neo4j"],
    },
    {
      id: "backend",
      label: "Backend",
      techs: ["FastAPI", "Node.js", "Express", "Redis Streams", "BullMQ", "Docker"],
    },
    {
      id: "nlp",
      label: "Natural Language Processing",
      techs: ["Transformers", "BERT", "Hugging Face", "TF-IDF"],
    },
  ],
};
