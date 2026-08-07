export const resume = {
  about:
    "Software Engineer and AI Developer engineering the bridge between high-throughput backend systems and intelligent machine learning models. Adept at turning complex architectural problems into elegant, production-ready code.",
  experience: [
    {
      org: "LedgerCross",
      location: "Dhaka, Bangladesh",
      role: "Software Developer Trainee",
      period: "May 2026 — Present",
      points: [
        "Engineered an AI invoice processing microservice using Python (FastAPI), PostgreSQL, and Cloudflare R2.",
        "Implemented an asynchronous distributed processing engine utilizing Redis Streams and BullMQ.",
        "Authored 218 automated pytest test cases covering API endpoints, queue workers, and multi-tenant RLS.",
      ],
    },
    {
      org: "Bangladesh Software Solution (BSS)",
      location: "Dhaka, Bangladesh",
      role: "Software Engineer Intern",
      period: "Feb 2026 — Apr 2026",
      points: [
        "Developed responsive frontend interfaces utilizing HTML5, CSS3, and modern JavaScript (ES6+).",
        "Integrated frontend layout structures with backend RESTful APIs with robust error handling.",
        "Collaborated in agile development workflows utilizing Git for version control and system deployment.",
      ],
    },
  ],
  projects: [
    {
      name: "InvoicePilot (LedgerCross product)",
      stack: "Python, FastAPI, React 19, PostgreSQL, Redis",
      points: [
        "Designed an 11-stage processing pipeline for automated Mindee OCR extraction and fraud detection.",
        "Authored a Web3 cryptographic seal kernel in Solidity to record tamper-evident verification hashes.",
        "Configured dead-letter queues and exponential backoff retries for fault-tolerant background jobs.",
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
      name: "FinBERT Financial Sentiment Analysis",
      stack: "PyTorch, Hugging Face, NLP",
      points: [
        "Fine-tuned domain-specific transformer models (FinBERT) to classify sentiment in financial text datasets.",
        "Implemented comprehensive NLP preprocessing pipelines for tokenization and model optimization.",
      ],
    },
    {
      name: "3D City Simulator",
      stack: "C++, OpenGL, Computer Graphics",
      points: [
        "Built a 3D simulated city featuring dynamic day/night cycles, weather effects, and traffic light logic.",
        "Implemented real-time graphics rendering pipelines and interactive keyboard controls.",
      ],
    },
  ],
  education: [
    {
      org: "American International University-Bangladesh (AIUB)",
      degree: "BSc in Computer Science & Engineering",
      detail: "CGPA 3.92 / 4.00",
      period: "Sep 2022 — Apr 2026",
    },
    {
      org: "BAF Shaheen College Dhaka",
      degree: "Higher Secondary Certificate (HSC), Science",
      detail: "GPA 5.00 / 5.00",
      period: "Jun 2019 — Dec 2021",
    },
    {
      org: "Kurmitola High School & College",
      degree: "Secondary School Certificate (SSC), Science",
      detail: "GPA 5.00 / 5.00",
      period: "Jan 2017 — Feb 2019",
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
    "IBM Full-Stack JavaScript Developer Professional Certificate — Coursera",
    "Blockchain, Ethereum & Solidity Development — Udemy",
  ],
  skills: [
    { group: "AI & Machine Learning", items: "PyTorch, Hugging Face, Scikit-learn, OpenCV, CatBoost" },
    { group: "Programming Languages", items: "Python, Java, C/C++, C# (.NET), SQL, TypeScript, JavaScript, Solidity" },
    { group: "Web Development", items: "React, Next.js, FastAPI, Node.js, Express, HTML5, CSS3" },
    { group: "Backend & Databases", items: "PostgreSQL, MySQL, SQL Server, MongoDB, Redis Streams, Qdrant" },
    { group: "Tools & DevOps", items: "Git, Docker, Celery, BullMQ, Jupyter Notebook, Cloudflare R2" },
  ],
  honors: [
    { name: "5× Dean's Award Recipient & AIUB Merit Scholar", detail: "70% tuition waiver for academic excellence alongside 5 consecutive Dean's Award recognitions.", period: "2022 — 2026" },
    { name: "The Duke of Edinburgh's Bronze Award", detail: "Community service, skill development, and expedition tasks.", period: "2025 — 2026" },
  ],
  leadership: [
    { role: "Student Activity Coordinator", org: "Space Innovation Camp", period: "2022 — 2025", detail: "Led robotics and UAV engineering workshops mentoring over 500 students." },
    { role: "Public Relations Representative", org: "WRO Bangladesh", period: "2023 — 2024", detail: "Coordinated media communications and logistics for national robotics competitions." },
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
