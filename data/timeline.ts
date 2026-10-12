export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  location?: string;
  type: "career" | "education" | "honor" | "leadership";
  points: string[];
  current?: boolean;
}

export const timeline: TimelineEntry[] = [
  {
    period: "Oct 2026 - Present",
    title: "Full-Stack Developer",
    org: "RemoteIntegrity LLC",
    location: "Clearwater, Florida, USA · Contract · Flexible hours",
    type: "career",
    current: true,
    points: [
      "Building front-end and back-end components of web applications, including server-side logic, APIs and database integrations.",
      "Working through testing, code review, version control and deployment to keep applications performant, secure and reliable.",
    ],
  },
  {
    period: "Oct 2026 - Present",
    title: "Full-Stack Developer",
    org: "2BitSoft",
    location: "Dubai, UAE · Remote",
    type: "career",
    current: true,
    points: [
      "Developing full-stack web applications for software, automation and digital transformation projects.",
    ],
  },
  {
    period: "May 2026 - Sep 2026",
    title: "Software Developer",
    org: "Ledgercross",
    location: "Dhaka, Bangladesh · On-site",
    type: "career",
    points: [
      "Engineering production software across the stack for enterprise finance using Python, FastAPI, PostgreSQL, Redis and cloud infrastructure.",
      "Designing and implementing REST APIs, asynchronous and distributed processing and automated testing suites.",
      "Collaborating with the engineering team to build scalable services, optimize system reliability and maintain operational security standards.",
    ],
  },
  {
    period: "Feb 2026 - Apr 2026",
    title: "Software Engineer Intern",
    org: "Bangladesh Software Solution (BSS)",
    location: "Dhaka, Bangladesh · Hybrid",
    type: "career",
    points: [
      "Developed responsive frontend interfaces utilizing HTML5, CSS3 and modern JavaScript (ES6+).",
      "Integrated frontend layout structures with backend RESTful APIs with robust error handling.",
      "Collaborated in agile development workflows utilizing Git for version control and system deployment.",
    ],
  },
  {
    period: "Sep 2022 - Apr 2026",
    title: "BSc in Computer Science & Engineering",
    org: "American International University-Bangladesh (AIUB)",
    location: "Dhaka, Bangladesh",
    type: "education",
    points: [
      "CGPA 3.91 / 4.00",
      "Thesis: NeuroScreen hybrid ensemble (95.20% accuracy, 0.982 ROC-AUC)",
      "5× Dean's Award + AIUB Merit Scholar (70% tuition waiver)",
    ],
  },
  {
    period: "2019 - 2021",
    title: "Higher Secondary Certificate (HSC)",
    org: "BAF Shaheen College",
    type: "education",
    points: ["GPA 5.00 / 5.00 · Science"],
  },
  {
    period: "2017 - 2019",
    title: "Secondary School Certificate (SSC)",
    org: "Kurmitola High School",
    type: "education",
    points: ["GPA 5.00 / 5.00 · Science"],
  },
  {
    period: "2022 - 2025",
    title: "Student Activity Coordinator",
    org: "Space Innovation Camp",
    type: "leadership",
    points: ["Coordinated student activities and camps across three years."],
  },
  {
    period: "2023 - 2024",
    title: "Public Relations Representative",
    org: "WRO Bangladesh",
    type: "leadership",
    points: ["Represented the national robotics competition organizer publicly."],
  },
  {
    period: "2026",
    title: "Duke of Edinburgh's Award",
    org: "Bronze",
    type: "honor",
    points: ["Achieved Bronze level of the international award program."],
  },
];
