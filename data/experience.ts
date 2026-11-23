// Single source of truth for work experience. The home timeline cards, the
// /about timeline, the resume page, the Cortex console views and the globe
// all derive from this list. Newest first.

export interface ExperienceEntry {
  id: string;
  org: string;
  /** Shorter org name for tight UI. */
  shortOrg?: string;
  role: string;
  period: string;
  /** Location line used on the home cards and the about timeline. */
  location: string;
  /** Location line used on the resume page. */
  resumeLocation: string;
  current: boolean;
  /** Badge on the home card. */
  tag: "Contract" | "Current" | "Complete";
  /** One-paragraph description for the home card. */
  detail: string;
  /** Bullets for the about timeline. */
  timelinePoints: string[];
  /** Bullets for the resume page. */
  resumePoints: string[];
}

export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    id: "lumifi",
    org: "Lumifi Solutions",
    role: "Full-Stack Developer",
    period: "Nov 2026 - Present",
    location: "Sydney, Australia · Remote · Australian hours",
    resumeLocation: "Sydney, Australia · Remote",
    current: true,
    tag: "Current",
    detail:
      "Owning full-stack features end to end for an Australian software company, from database design to the interface, with tested, secure and accessible code, clear documentation and steady daily delivery on Australian hours.",
    timelinePoints: [
      "Owning features end to end across the stack, from schema and migrations to server logic and UI, using Next.js, TypeScript and PostgreSQL.",
      "Writing integration and concurrency tests alongside the code, and running accessibility and responsive checks before work is handed over.",
      "Applying least-privilege database access and strict per-tenant data isolation, and keeping documentation and changelogs current with every change.",
      "Working remotely on Australian hours, planning each day's work and reporting progress clearly.",
    ],
    resumePoints: [
      "Own full-stack features end to end for an Australian software company: schema design and migrations, server logic and UI (Next.js, TypeScript, PostgreSQL).",
      "Write integration and concurrency tests with the code and run accessibility, contrast and responsive audits before handover.",
      "Apply least-privilege database access and per-tenant data isolation; keep documentation and changelogs updated with every change.",
    ],
  },
  {
    id: "remoteintegrity",
    org: "RemoteIntegrity LLC",
    shortOrg: "RemoteIntegrity",
    role: "Full-Stack Developer",
    period: "Oct 2026 - Present",
    location: "Clearwater, Florida, USA · Contract · Flexible hours",
    resumeLocation: "USA · Remote · Contract",
    current: true,
    tag: "Contract",
    detail:
      "Maintaining and extending the company's existing ERP system while designing and building a separate external ERP for partner organisations, balancing day-to-day fixes with new development on a flexible, time-zone-spanning schedule.",
    timelinePoints: [
      "Maintaining and extending the company's existing ERP system, fixing issues and adding features as the business needs them.",
      "Designing and building a separate external ERP system for partner organisations.",
      "Coordinating remotely with a US-based team across time zones on a flexible contract schedule.",
    ],
    resumePoints: [
      "Maintain and extend the company's existing ERP system, fixing issues and adding features.",
      "Design and build a separate external ERP system for partner organisations.",
      "Coordinate remotely with a US-based team across time zones.",
    ],
  },
  {
    id: "ledgercross",
    org: "Ledgercross",
    role: "Software Developer",
    period: "May 2026 - Sep 2026",
    location: "Dhaka, Bangladesh · On-site",
    resumeLocation: "Dhaka, Bangladesh · On-site",
    current: false,
    tag: "Complete",
    detail:
      "Engineered production software across the stack for enterprise finance, working with APIs, asynchronous processing, data layers, automated testing, cloud infrastructure and system reliability.",
    timelinePoints: [
      "Engineering production software across the stack for enterprise finance using Python, FastAPI, PostgreSQL, Redis and cloud infrastructure.",
      "Designing and implementing REST APIs, asynchronous and distributed processing and automated testing suites.",
      "Collaborating with the engineering team to build scalable services, optimize system reliability and maintain operational security standards.",
    ],
    resumePoints: [
      "Built the team's FastAPI OCR and fraud-detection service for InvoicePilot, migrating Mindee to V2.",
      "Delivered FUMAK, a client inventory and POS system, as sole developer (Android + Next.js).",
      "Built the public landing page for a NITOR unit's Convex, React patient system in production use.",
    ],
  },
  {
    id: "bss",
    org: "Bangladesh Software Solution (BSS)",
    shortOrg: "Bangladesh Software Solution",
    role: "Software Engineer Intern",
    period: "Feb 2026 - Apr 2026",
    location: "Dhaka, Bangladesh · Hybrid",
    resumeLocation: "Dhaka, Bangladesh · Hybrid",
    current: false,
    tag: "Complete",
    detail:
      "Developed responsive frontend interfaces with HTML5, CSS3 and modern JavaScript (ES6+), integrated them with backend RESTful APIs with robust error handling and worked in agile, Git-based workflows.",
    timelinePoints: [
      "Developed responsive frontend interfaces utilizing HTML5, CSS3 and modern JavaScript (ES6+).",
      "Integrated frontend layout structures with backend RESTful APIs with robust error handling.",
      "Collaborated in agile development workflows utilizing Git for version control and system deployment.",
    ],
    resumePoints: [
      "Built responsive UIs with HTML5, CSS3, Bootstrap 5 and JavaScript (ES6+), wired to REST APIs.",
    ],
  },
];

export const CURRENT_ROLES = EXPERIENCE.filter((e) => e.current);

/** e.g. "Lumifi Solutions + RemoteIntegrity" */
export const CURRENT_ORGS_LABEL = CURRENT_ROLES.map((e) => e.shortOrg ?? e.org).join(" + ");
