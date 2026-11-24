import { EXPERIENCE } from "./experience";

export const resume = {
  about:
    "Full-Stack Developer and AI engineer building production web, mobile and voice-AI systems for teams in Australia and the US from Dhaka. Currently a Full-Stack Developer at Lumifi Solutions, with an ongoing contract at RemoteIntegrity.",
  experience: EXPERIENCE.map((e) => ({
    org: e.org,
    location: e.resumeLocation,
    role: e.tag === "Contract" ? `${e.role} (Contract)` : e.role,
    period: e.period,
    points: e.resumePoints,
  })),
  projects: [
    {
      name: "Lumifi SMS",
      link: null,
      stack: "Next.js, TypeScript, PostgreSQL, Drizzle ORM, Better Auth, Vitest",
      points: [
        "Building a multi-tenant SMS + LMS for Australian RTOs, from applications to certification.",
      ],
    },
    {
      name: "Aria ERP",
      link: null,
      stack: "Next.js, TypeScript, PostgreSQL, Prisma, Better Auth, Vitest",
      points: [
        "Building a full-stack ERP for a BPO team, designed to unite quote-to-invoice and purchase-to-receipt flows.",
      ],
    },
    {
      name: "World Bridge",
      link: null,
      stack: "Next.js, React, TypeScript, GSAP; planned: PostgreSQL, Prisma, Cloudflare R2",
      points: [
        "Building a staffing website and résumé bank for Australian employers and Bangladeshi candidates.",
      ],
    },
    {
      name: "InvoicePilot",
      link: null,
      stack: "Python, FastAPI, Redis Streams, Supabase, Cloudflare R2",
      points: [
        "Built an 11-stage OCR pipeline with fraud detection, Redis Streams workers and 246 pytest tests.",
      ],
    },
    {
      name: "VoiceCon",
      link: "https://voicecon.app/",
      stack: "Kotlin, Jetpack Compose, Fastify, Prisma, PostgreSQL, Python, PyTorch, Twilio",
      points: [
        "Built the Kotlin app, billing API and admin panel, bridging Twilio to a GPU voice-conversion worker.",
      ],
    },
    {
      name: "FUMAK Inventory",
      link: "https://fumak-inventory.vercel.app/",
      stack: "Kotlin, Jetpack Compose, ML Kit, Next.js, Prisma, PostgreSQL",
      points: [
        "Built a stock and sales dashboard with low-stock alerts, profit tracking and Android barcode-scan checkout.",
      ],
    },
    {
      name: "NITOR Patient Management",
      link: "https://dr-stone.vercel.app/",
      stack: "React 18, TypeScript, Vite, Framer Motion, Convex",
      points: [
        "Built the React frontend and contributed Convex backend logic for patient management and bed occupancy at NITOR.",
      ],
    },
    {
      name: "CaseVault",
      link: "https://casevault-bd.vercel.app",
      stack: "Python, FastAPI, SQLAlchemy, Next.js, Tailwind CSS",
      points: [
        "Built a FastAPI and Next.js app (9 API endpoints) for ranked search over 46 legal documents.",
      ],
    },
    {
      name: "LedgerTurf",
      link: "https://ledgerturf.vercel.app/",
      stack: "MongoDB, Express, React, Node.js, JWT, Redux Toolkit, Google Maps",
      points: [
        "Built a MERN turf-booking app with JWT auth, role-based access, slot-overlap checks and Google Maps.",
      ],
    },
    {
      name: "Neuro-Screen (Thesis)",
      link: "https://neuro-screen.streamlit.app/",
      stack: "Python, CatBoost, PyTorch, SHAP, scikit-learn, Streamlit",
      points: [
        "Built a leakage-controlled stacked ensemble with nested cross-validation on 2,236 survey responses.",
      ],
    },
  ],
  education: [
    {
      org: "American International University-Bangladesh (AIUB)",
      degree: "Bachelor of Science in Computer Science and Engineering",
      detail: "CGPA 3.91 / 4.00",
      period: "Sep 2022 - Apr 2026",
    },
    {
      org: "BAF Shaheen College Dhaka",
      degree: "Higher Secondary Certificate (HSC), Science",
      detail: "GPA 5.00 / 5.00",
      period: "Jun 2019 - Dec 2021",
    },
    {
      org: "Kurmitola High School & College",
      degree: "Secondary School Certificate (SSC), Science",
      detail: "GPA 5.00 / 5.00",
      period: "Jan 2017 - Feb 2019",
    },
  ],
  thesis: {
    name: "Neuro-Screen: Evaluating Stacked Ensemble for Predicting Cognitive Symptoms in University Students at Sleep Risk",
    stack: "CatBoost, XGBoost, LightGBM, PyTorch, Streamlit",
    points: [
      "Group research project at AIUB: built the Streamlit app and ran the re-analysis of 2,236 student survey responses.",
      "Leakage-controlled design: excluded all nine outcome-defining items and evaluated a four-model stack with 5x3 nested cross-validation.",
      "Reported metrics against a majority baseline (accuracy 0.621 vs 0.621; ROC-AUC 0.480); paper forthcoming.",
    ],
  },
  certifications: [
    "IBM Full-Stack JavaScript Developer Professional Certificate (Coursera)",
    "Blockchain, Ethereum & Solidity Development (Udemy)",
  ],
  skills: [
    { group: "Programming Languages", items: "Python, TypeScript, JavaScript, SQL, Kotlin, Java, C#, C++" },
    { group: "Backend & Databases", items: "FastAPI, Node.js, Express, NestJS, REST APIs, PostgreSQL, MongoDB, Redis, Prisma" },
    { group: "Frontend & Mobile", items: "React, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3, Android, Jetpack Compose" },
    { group: "Testing & Tools", items: "pytest, Jest, Vitest, Playwright, Supertest, Git, Docker Compose, Vercel, Render" },
    { group: "AI / ML", items: "Machine Learning, Deep Learning, NLP, OCR, PyTorch, Hugging Face, scikit-learn, CatBoost, OpenCV" },
  ],
  honors: [
    { name: "5× Dean's Award Recipient & AIUB Merit Scholar", detail: "Awarded 70% tuition waiver for academic excellence alongside 5 consecutive Dean's Award recognitions.", period: "2022 - 2026" },
    { name: "The Duke of Edinburgh's Bronze Award", detail: "Completed rigorous requirements encompassing community service, skill development and expedition tasks.", period: "2025 - 2026" },
  ],
  leadership: [
    { role: "Student Activity Coordinator", org: "Space Innovation Camp", period: "2022 - 2025", detail: "Coordinated student activities and robotics and UAV workshops across three years." },
    { role: "Public Relations Representative", org: "WRO Bangladesh", period: "2023 - 2024", detail: "Coordinated media communications and logistics for national robotics competitions." },
  ],
  references: [
    {
      name: "Md. Nazmul Hossain",
      role: "Assistant Professor, Dept. of CSE, AIUB",
      extra: "PhD Candidate & Casual Academic Staff, ACU, Australia",
      email: "mdnazmul.hossain@myacu.edu.au",
    },
    {
      name: "Tawhid Hasan",
      role: "Senior Software Engineer",
      org: "Bangladesh Software Solution (BSS)",
      email: "tawhidhasan44@gmail.com",
    },
  ],
} as const;
