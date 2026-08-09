import { TERMINAL_COMMANDS } from "@/data/terminal";
import { skillGroups } from "@/data/skills";
import { timeline } from "@/data/timeline";
import { projects } from "@/data/projects";

const career = timeline.filter(
  (t) => t.type === "career" || t.type === "education",
);
const firstYear = /20\d\d/.exec(career[career.length - 1].period)?.[0] ?? "—";
const lastYear = /20\d\d/.exec(career[0].period)?.[0] ?? "—";
const skillTotal = skillGroups.reduce((n, g) => n + g.skills.length, 0);

const whoamiLine = "sajid · backend & AI";
const skillsLine = `${skillGroups.length} groups · ${skillTotal} tools`;
const projectsLine = `${projects.length} shipped · ${projects.filter((p) => p.featured).length} featured`;
const timelineLine = `${career.length} stops · ${firstYear} → ${lastYear}`;
const researchLine = "neuronscreen · 95.2% acc";
const helpLine = `${TERMINAL_COMMANDS.length} commands`;

export const TERMINAL_SCRIPT: string[] = [
  "whoami",
  whoamiLine,
  "skills",
  skillsLine,
  "projects",
  projectsLine,
  "timeline",
  timelineLine,
  "research",
  researchLine,
  "help",
  helpLine,
];

export { PROMPT } from "./lib";
