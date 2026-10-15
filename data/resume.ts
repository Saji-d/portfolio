export const resume = {
  about:
    "Full-Stack Developer and AI engineer building production web, mobile and voice-AI systems for teams across Dhaka and the US. Adept at turning complex architectural problems into reliable, production-ready code.",
  experience: [
    {
      org: "RemoteIntegrity LLC",
      location: "USA · Remote · Contract",
      role: "Full-Stack Developer (Contract)",
      period: "Oct 2026 - Present",
      points: [
        "Build front-end and back-end components, APIs and database integrations for client web applications.",
        "Ship through code review, testing and deployment on agreed timelines.",
      ],
    },
    {
      org: "Ledgercross",
      location: "Dhaka, Bangladesh · On-site",
      role: "Software Developer",
      period: "May 2026 - Sep 2026",
      points: [
        "Built the team's FastAPI OCR and fraud-detection service for InvoicePilot, migrating Mindee to V2.",
        "Delivered FUMAK, a client inventory and POS system, as sole developer (Android + Next.js).",
        "Built the public landing page for a NITOR unit's Convex, React patient system in production use.",
      ],
    },
    {
      org: "Bangladesh Software Solution (BSS)",
      location: "Dhaka, Bangladesh · Hybrid",
      role: "Software Engineer Intern",
      period: "Feb 2026 - Apr 2026",
      points: [
        "Built responsive UIs with HTML5, CSS3, Bootstrap 5 and JavaScript (ES6+), wired to REST APIs.",
      ],
    },
  ],
  projects: [
    {
      name: "VoiceCon",
      link: "https://voicecon.app/",
      stack: "Kotlin, Jetpack Compose, Fastify, Prisma, PostgreSQL, Python, PyTorch, Twilio",
      points: [
        "Built the Kotlin Android app, Fastify billing API and React admin panel for realtime AI voice calling.",
        "Bridged Twilio legs via a Python gateway to a Seed-VC GPU worker; any error ends the call, so no raw audio is sent.",
      ],
    },
    {
      name: "InvoicePilot",
      link: null,
      stack: "Python, FastAPI, Redis Streams, Supabase, Cloudflare R2",
      points: [
        "Built an 11-stage OCR pipeline with duplicate, 9-rule fraud and 19-rule anomaly detection.",
        "Added Redis Streams workers, Supabase (PostgreSQL) storage, Cloudflare R2 files and 246 pytest tests.",
      ],
    },
    {
      name: "FUMAK Inventory & POS",
      link: "https://fumak-inventory.vercel.app/",
      stack: "Kotlin, Jetpack Compose, ML Kit, Next.js, Prisma, PostgreSQL",
      points: [
        "Built a Kotlin, Jetpack Compose app that decodes barcodes on-device with CameraX and ML Kit.",
        "Built the Next.js app on Prisma and Neon PostgreSQL with transactional checkout, receipts and R2 product images.",
      ],
    },
    {
      name: "LedgerTurf",
      link: "https://ledgerturf.vercel.app/",
      stack: "MongoDB, Express, React, Node.js, JWT, Redux Toolkit, Google Maps",
      points: [
        "Built a MERN booking app with JWT, bcrypt auth and player, owner and admin role-based access.",
        "Added slot-overlap validation, GeoJSON venues with a 2dsphere index and Google Maps.",
      ],
    },
    {
      name: "CaseVault",
      link: "https://casevault-bd.vercel.app",
      stack: "Python, FastAPI, SQLAlchemy, Next.js, Tailwind CSS",
      points: [
        "Built a FastAPI, SQLAlchemy REST API (9 endpoints) with paginated, ranked keyword search and filters.",
        "Built the Next.js and Tailwind CSS search UI with advanced filters over 46 legal documents.",
      ],
    },
    {
      name: "Zenji Storefront",
      link: "https://zenji-webstore.vercel.app",
      stack: "React 19, TypeScript, Vite, Vitest, Playwright, axe-core",
      points: [
        "Built an 11-route React 19, TypeScript storefront with a useReducer cart persisted to localStorage.",
        "Wrote 27 Vitest tests and Playwright, axe-core QA at 8 viewports with 0 WCAG 2.1 AA violations.",
      ],
    },
    {
      name: "Mini Kanban Board",
      link: "https://mini-kanban-board-frontend.vercel.app",
      stack: "Next.js, NestJS, Prisma, PostgreSQL, Docker",
      points: [
        "Built a Next.js, NestJS, Prisma, PostgreSQL app with JWT auth and OWNER, EDITOR and VIEWER roles.",
        "Kept drag-and-drop order consistent via midpoint ordering and row-level locking, with 40 unit and e2e tests.",
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
    name: "Neuro-Screen: Hybrid AI Framework for Cognitive Impairment Detection",
    stack: "CatBoost, PyTorch",
    points: [
      "Engineered a dual-path hybrid ensemble fusing gradient boosting classifiers and deep neural networks.",
      "Achieved 95.20% accuracy and 0.982 ROC-AUC on a held-out test set from 2,237 student survey responses.",
      "Identified mental fatigue, stress frequency and sleep quality as top predictors of cognitive-impairment risk.",
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
    { role: "Student Activity Coordinator", org: "Space Innovation Camp", period: "2022 - 2025", detail: "Led robotics and UAV engineering workshops mentoring over 500 students." },
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
