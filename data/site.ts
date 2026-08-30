export const SITE = {
  name: "Sajidur Rahman Sajid",
  firstName: "Sajid",
  role: "Full-Stack Software Engineer | AI/ML.",
  tagline:
    "I build full-stack software and production AI/ML pipelines that are fast, reliable, and worth trusting.",
  email: "sajidsajidurrahman99@gmail.com",
  phone: "+8801954832959",
  phoneHref: "+8801954832959",
  location: "Dhaka, Bangladesh",
  timezone: "UTC+6",
  linkedin: "https://www.linkedin.com/in/sajidur-rahman-sajid/",
  github: "https://github.com/Saji-d",
  githubHandle: "Saji-d",
  url: "https://sajidur-rahman-sajid.vercel.app",
  availability:
    "I'm open to software engineering roles across full-stack, platform, and applied ML, plus select freelance and product work if it's interesting.",
} as const;

export interface NavSectionLink {
  label: string;
  section: string;
  href: string;
  title?: string;
}

export const NAV_LINKS: readonly NavSectionLink[] = [
  { label: "Experience", section: "experience", href: "/#experience" },
  { label: "Projects", section: "projects", href: "/#projects" },
  { label: "Skills", section: "capabilities", href: "/#capabilities" },
  { label: "Education", section: "education", href: "/#education" },
  { label: "Research", section: "research", href: "/#research" },
  {
    label: "Cortex",
    section: "cortex",
    href: "/#cortex",
    title: "Enter Cortex, the console behind this site",
  },
  { label: "Contact", section: "contact", href: "/#contact" },
] as const;

export const ABOUT_LINK: NavSectionLink = {
  label: "About",
  section: "about",
  href: "/#about",
} as const;

// Every in-page scroll destination the nav needs to track for active-state
// and hash-on-load handling, in document order (About sits right after the
// hero, then everything else follows the page's chapter order).
export const ALL_SECTION_LINKS: readonly NavSectionLink[] = [
  ABOUT_LINK,
  ...NAV_LINKS,
] as const;

export const RESUME_LINK = {
  label: "Resume",
  href: "/resume",
} as const;
