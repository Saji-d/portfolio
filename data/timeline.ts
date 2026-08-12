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
    period: "May 2026 - Present",
    title: "Software Developer Trainee",
    org: "Ledgercross",
    location: "Dhaka, Bangladesh",
    type: "career",
    current: true,
    points: [
      "Engineering production software across the stack for enterprise finance using Python, FastAPI, PostgreSQL, Redis, and cloud infrastructure.",
      "Designing and implementing REST APIs, asynchronous and distributed processing, multi-tenant data layers, and automated testing suites.",
      "Collaborating with the engineering team to build scalable services, optimize system reliability, and maintain operational security standards.",
    ],
  },
  {
    period: "Feb 2026 - Apr 2026",
    title: "Software Engineer Intern",
    org: "Bangladesh Software Solution (BSS)",
    type: "career",
    points: [
      "Developed and delivered responsive web applications, working across frontend and backend development.",
      "Implemented production-ready features, fixed software issues, and collaborated with the engineering team to complete client deliverables on schedule.",
    ],
  },
  {
    period: "Sep 2022 - Apr 2026",
    title: "BSc in Computer Science & Engineering",
    org: "American International University-Bangladesh (AIUB)",
    location: "Dhaka, Bangladesh",
    type: "education",
    points: [
      "CGPA 3.92 / 4.00",
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
