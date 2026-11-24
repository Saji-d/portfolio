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
  /** Real company logo under /public. Omit to fall back to a monogram. */
  logo?: { src: string; alt: string; width: number; height: number; onLight?: boolean };
}

export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    id: "lumifi",
    logo: { src: "/images/logos/lumifi.svg", alt: "Lumifi Solutions logo", width: 64, height: 64 },
    org: "Lumifi Solutions",
    role: "Full-Stack Developer",
    period: "Nov 2026 - Present",
    location: "Sydney, Australia · Remote",
    resumeLocation: "Sydney, Australia · Remote",
    current: true,
    tag: "Current",
    detail:
      "Building Lumifi SMS, a multi-tenant student and learning platform for Australian training colleges, and World Bridge's two-market staffing site, from database design to the interface, on Australian hours.",
    timelinePoints: [
      "Building Lumifi SMS, a multi-tenant student and learning platform for Australian training colleges, and owning its Applications and Enrolments module from schema and migrations to server logic and UI.",
      "Building World Bridge, a staffing site with separate Australian-employer and Bangladeshi-candidate experiences on one domain, with geolocation-based routing in progress.",
      "Writing integration and concurrency tests alongside the code, and running accessibility and responsive checks before work is handed over.",
      "Applying least-privilege database access and strict per-tenant data isolation, and keeping documentation and changelogs current with every change.",
      "Working remotely on Australian hours, planning each day's work and reporting progress clearly.",
    ],
    resumePoints: [
      "Building Lumifi SMS, a multi-tenant student and learning platform for Australian RTOs.",
      "Building World Bridge's two-market staffing site on one domain with geolocation routing.",
    ],
  },
  {
    id: "remoteintegrity",
    logo: { src: "/images/logos/remoteintegrity.png", alt: "RemoteIntegrity logo", width: 192, height: 192, onLight: true },
    org: "RemoteIntegrity LLC",
    shortOrg: "RemoteIntegrity",
    role: "Full-Stack Developer",
    period: "Oct 2026 - Present",
    location: "Clearwater, Florida, USA · Remote",
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
      "Building an external ERP for partners, linking quotes to invoices and purchase orders to receipts.",
    ],
  },
  {
    id: "ledgercross",
    logo: { src: "/images/logos/ledgercross.svg", alt: "Ledgercross logo", width: 2048, height: 2048 },
    org: "Ledgercross",
    role: "Software Developer",
    period: "May 2026 - Sep 2026",
    location: "Dhaka, Bangladesh · On-site",
    resumeLocation: "Dhaka, Bangladesh · On-site",
    current: false,
    tag: "Complete",
    detail:
      "Built the FastAPI OCR and fraud-detection service for InvoicePilot, delivered the FUMAK inventory and POS system as sole developer, and worked on the frontend and Convex backend of a NITOR trauma-unit patient system.",
    timelinePoints: [
      "Built the team's FastAPI OCR and fraud-detection service for InvoicePilot, migrating Mindee to V2.",
      "Delivered FUMAK, an Android and Next.js inventory and POS system with a stock and sales dashboard, as sole developer.",
      "Built the frontend and contributed Convex backend logic for a NITOR trauma unit's patient management and bed occupancy system.",
    ],
    resumePoints: [
      "Built the team's FastAPI OCR and fraud-detection service for InvoicePilot, migrating Mindee to V2.",
      "Delivered FUMAK, an Android + Next.js inventory and POS system, as sole developer.",
    ],
  },
  {
    id: "bss",
    logo: { src: "/images/logos/bss.webp", alt: "Bangladesh Software Solution logo", width: 192, height: 192, onLight: true },
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
