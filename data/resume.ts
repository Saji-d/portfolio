export const resume = {
  about:
    "Full-stack Software Engineer and AI/ML Developer building production software across frontend, backend, and intelligent machine-learning systems. Adept at turning complex architectural problems into elegant, production-ready code.",
  experience: [
    {
      org: "Ledgercross",
      location: "Dhaka, Bangladesh",
      role: "Software Developer Trainee",
      period: "May 2026 - Present",
      points: [
        "Developing production software systems using Python (FastAPI), PostgreSQL, Redis, and cloud infrastructure.",
        "Designing and implementing REST APIs, asynchronous and distributed processing, multi-tenant data layers, and automated testing suites.",
        "Collaborating with the engineering team to build scalable services, ensure system reliability, and maintain code quality.",
      ],
    },
    {
      org: "Bangladesh Software Solution (BSS)",
      location: "Dhaka, Bangladesh",
      role: "Software Engineer Intern",
      period: "Feb 2026 - Apr 2026",
      points: [
        "Developed and delivered responsive web applications using modern web technologies and frontend frameworks.",
        "Integrated frontend interfaces with RESTful APIs, implemented production-ready UI components, and resolved technical issues.",
        "Collaborated in agile team workflows, utilizing Git for version control and participating in code reviews.",
      ],
    },
  ],
  projects: [
    {
      name: "InvoicePilot (Ledgercross product)",
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
      name: "FinBERT",
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
    { name: "5× Dean's Award Recipient & AIUB Merit Scholar", detail: "70% tuition waiver for academic excellence alongside 5 consecutive Dean's Award recognitions.", period: "2022 - 2026" },
    { name: "The Duke of Edinburgh's Bronze Award", detail: "Community service, skill development, and expedition tasks.", period: "2025 - 2026" },
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
