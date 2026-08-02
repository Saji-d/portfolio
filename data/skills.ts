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
