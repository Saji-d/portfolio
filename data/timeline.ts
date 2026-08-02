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
    period: "May 2026 — Present",
    title: "Software Developer Trainee",
    org: "LedgerCross",
    location: "Dhaka, Bangladesh",
    type: "career",
    current: true,
    points: [
      "Shipping InvoicePilot — an 11-stage AI invoice pipeline with Redis Streams async workers and a Solidity seal registry (218 passing pytest cases).",
      "Designing CaseVault's GraphRAG phase: Qdrant vector search + Neo4j knowledge graph with community detection.",
      "Driving the SOC 2 readiness suite: security policies, trust center, and row-level-security migrations.",
    ],
  },
  {
    period: "Feb 2026 — Apr 2026",
    title: "Software Engineer Intern",
    org: "Bangladesh Software Solution (BSS)",
    type: "career",
    points: [
      "Built 18 responsive projects across an HTML/CSS learning track, then advanced into Bootstrap, JavaScript, and Figma-driven frontend work.",
      "Shipped 6 assigned tasks including a bento grid gallery, an analog clock, a furniture storefront, and a Doc House Figma build.",
    ],
  },
  {
    period: "Sep 2022 — Apr 2026",
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
    period: "2019 — 2021",
    title: "Higher Secondary Certificate (HSC)",
    org: "BAF Shaheen College",
    type: "education",
    points: ["GPA 5.00 / 5.00 · Science"],
  },
  {
    period: "2017 — 2019",
    title: "Secondary School Certificate (SSC)",
    org: "Kurmitola High School",
    type: "education",
    points: ["GPA 5.00 / 5.00 · Science"],
  },
  {
    period: "2022 — 2025",
    title: "Student Activity Coordinator",
    org: "Space Innovation Camp",
    type: "leadership",
    points: ["Coordinated student activities and camps across three years."],
  },
  {
    period: "2023 — 2024",
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
