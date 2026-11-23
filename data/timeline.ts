import { EXPERIENCE } from "./experience";

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
  ...EXPERIENCE.map(
    (e): TimelineEntry => ({
      period: e.period,
      title: e.role,
      org: e.org,
      location: e.location,
      type: "career",
      current: e.current || undefined,
      points: [...e.timelinePoints],
    }),
  ),
  {
    period: "Sep 2022 - Apr 2026",
    title: "BSc in Computer Science & Engineering",
    org: "American International University-Bangladesh (AIUB)",
    location: "Dhaka, Bangladesh",
    type: "education",
    points: [
      "CGPA 3.91 / 4.00",
      "Group research project: Neuro-Screen, a leakage-controlled, nested-cross-validated evaluation of a stacked ensemble",
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
    period: "2025 - 2026",
    title: "Duke of Edinburgh's Award",
    org: "Bronze",
    type: "honor",
    points: ["Achieved Bronze level of the international award program."],
  },
];
