export interface SkillGroup {
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Vite",
      "Redux",
      "TanStack Query",
      "React Router",
      "React Hook Form",
      "Zod",
      "shadcn/ui",
      "Recharts",
      "Framer Motion",
      "dnd-kit",
    ],
  },
  {
    label: "AI / ML",
    skills: [
      "PyTorch",
      "CatBoost",
      "Scikit-learn",
      "Hugging Face",
      "Transformers",
      "OpenCV",
      "Pandas",
      "NumPy",
      "Seed-VC",
      "OCR",
      "NLTK",
      "Matplotlib",
      "Plotly",
      "Streamlit",
      "Jupyter",
      "SHAP / LIME",
    ],
  },
  {
    label: "Backend",
    skills: [
      "FastAPI",
      "Node.js",
      "Express",
      "NestJS",
      "Fastify",
      "ASP.NET Core",
      "Prisma",
      "SQLAlchemy",
      "Alembic",
      "Pydantic",
      "Mongoose",
      "Redis Streams",
      "JWT Auth",
      "Twilio",
      "REST",
      "Docker",
    ],
  },
  {
    label: "Mobile & Desktop",
    skills: ["Jetpack Compose", "Hilt", "Retrofit", "CameraX", "ML Kit", "Java Swing", "WinForms", "OpenGL"],
  },
  {
    label: "Data & Databases",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "SQL Server",
      "Oracle",
      "SQLite",
      "Supabase",
      "Neon",
      "Cloudflare R2",
      "Cloudinary",
    ],
  },
  {
    label: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "Kotlin", "Java", "C++", "C#", "PHP", "SQL"],
  },
  {
    label: "Tooling & Practice",
    skills: ["Git", "GitHub", "pytest", "Jest", "Vitest", "Vercel", "Linux", "Npm Workspaces"],
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
      techs: ["PyTorch", "Hugging Face", "Transformers", "Seed-VC", "OCR"],
    },
    {
      id: "computer-vision",
      label: "Computer Vision",
      techs: ["OpenCV", "LBPH", "EfficientNet-B0", "Transfer Learning"],
    },
    {
      id: "machine-learning",
      label: "Machine Learning",
      techs: ["Scikit-learn", "CatBoost", "PyTorch", "NumPy", "Pandas"],
    },
    {
      id: "databases",
      label: "Databases",
      techs: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Prisma"],
    },
    {
      id: "frontend",
      label: "Frontend",
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"],
    },
    {
      id: "mobile",
      label: "Mobile",
      techs: ["Kotlin", "Jetpack Compose", "Hilt", "Retrofit", "CameraX", "ML Kit"],
    },
    {
      id: "backend",
      label: "Backend",
      techs: ["FastAPI", "Node.js", "Express", "NestJS", "Fastify", "Redis Streams", "Docker"],
    },
    {
      id: "nlp",
      label: "Natural Language Processing",
      techs: ["Transformers", "BERT", "Hugging Face", "TF-IDF"],
    },
  ],
};
