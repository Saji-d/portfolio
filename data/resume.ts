export const resume = {
  about:
    "Software Engineer and AI Developer engineering the bridge between high-throughput backend systems and intelligent machine learning models. Adept at turning complex architectural problems into elegant, production-ready code.",
  experience: [
    {
      org: "Ledgercross",
      location: "Dhaka, Bangladesh",
      role: "Software Developer Trainee",
      period: "May 2026 - Present",
      points: [
        "Built MERN-based business systems and authored 218 automated pytest cases for backend workflows.",
        "Engineered AI invoice processing pipelines using Python, FastAPI, Mindee OCR, PostgreSQL, and Redis Streams.",
        "Developed FUMAK, a client inventory and POS system with Android barcode scanning and stock management.",
      ],
    },
    {
      org: "Bangladesh Software Solution (BSS)",
      location: "Dhaka, Bangladesh",
      role: "Software Engineer Intern",
      period: "Feb 2026 - Apr 2026",
      points: [
        "Developed responsive frontend interfaces utilizing HTML5, CSS3, and modern JavaScript (ES6+).",
        "Integrated frontend layout structures with backend RESTful APIs with robust error handling.",
        "Collaborated in agile development workflows utilizing Git for version control and system deployment.",
      ],
    },
  ],
  projects: [
    {
      name: "InvoicePilot (Ledgercross Product)",
      stack: "Python, FastAPI, Mindee OCR, PostgreSQL, Redis",
      points: [
        "Built an AI invoice processing microservice for OCR extraction and structured data generation.",
        "Implemented invoice normalization, validation, duplicate, fraud, and anomaly detection rules.",
        "Developed an 11-stage pipeline with Redis Streams for synchronous and asynchronous processing.",
      ],
    },
    {
      name: "FUMAK Inventory & POS System (Client Project)",
      stack: "Kotlin, Android, Next.js, PostgreSQL",
      points: [
        "Built an inventory and POS platform with Android barcode scanning and a Next.js web application.",
        "Implemented real-time product lookup, stock management, checkout, and sales analytics.",
        "Integrated ML Kit, Prisma, Neon PostgreSQL, and Cloudflare R2 for core workflows.",
      ],
    },
    {
      name: "LedgerTurf",
      stack: "React, Node.js, Express, MongoDB Atlas, Redux",
      points: [
        "Built a full-stack MERN turf booking ecosystem featuring geo-spatial MongoDB 2dsphere indexing.",
        "Eliminated booking race conditions and scheduling conflicts via atomic database query validations.",
      ],
    },
    {
      name: "FinBERT",
      stack: "PyTorch, Hugging Face, NLP",
      points: [
        "Fine-tuned domain-specific transformer models (FinBERT) to classify sentiment in financial text datasets.",
        "Implemented comprehensive NLP preprocessing pipelines for tokenization and model optimization.",
      ],
    },
    {
      name: "Face Recognition System",
      stack: "Python, OpenCV, LBPH",
      points: [
        "Developed a real-time face recognition system leveraging OpenCV and Local Binary Patterns Histograms (LBPH).",
        "Engineered efficient image processing pipelines for accurate feature extraction and identification.",
      ],
    },
  ],
  education: [
    {
      org: "American International University-Bangladesh (AIUB)",
      degree: "Bachelor of Science in Computer Science and Engineering",
      detail: "CGPA 3.92 / 4.00",
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
      "Achieved state-of-the-art performance with 95.20% accuracy and 0.982 ROC-AUC across 2,237 student records.",
      "Identified mental fatigue, stress frequency, and sleep quality as primary predictive drivers of cognitive decline.",
    ],
  },
  certifications: [
    "IBM Full-Stack JavaScript Developer Professional Certificate (Coursera)",
    "Blockchain, Ethereum & Solidity Development (Udemy)",
  ],
  skills: [
    { group: "AI & Machine Learning", items: "PyTorch, Hugging Face, Scikit-learn, OpenCV, CatBoost" },
    { group: "Programming Languages", items: "Python, Java, C/C++, C# (.NET), SQL, TypeScript, JavaScript, Solidity" },
    { group: "Web Development", items: "React, Next.js, FastAPI, Node.js, Express, HTML5, CSS3" },
    { group: "Backend & Databases", items: "PostgreSQL, MySQL, SQL Server, MongoDB, Redis Streams, Qdrant" },
    { group: "Tools & DevOps", items: "Git, Docker, Celery, BullMQ, Jupyter Notebook, Cloudflare R2" },
  ],
  honors: [
    { name: "5× Dean's Award Recipient & AIUB Merit Scholar", detail: "Awarded 70% tuition waiver for academic excellence alongside 5 consecutive Dean's Award recognitions.", period: "2022 - 2026" },
    { name: "The Duke of Edinburgh's Bronze Award", detail: "Completed rigorous requirements encompassing community service, skill development, and expedition tasks.", period: "2025 - 2026" },
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
