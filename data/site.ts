export const SITE = {
  name: "Sajidur Rahman Sajid",
  firstName: "Sajid",
  role: "Software Engineer | Backend & AI Systems.",
  tagline:
    "I build high-throughput backend systems and production ML pipelines — engineered to be fast, reliable, and worth trusting.",
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
    "Open to software engineering roles in backend, platform, and applied ML — plus select freelance and product collaborations.",
} as const;

export interface NavSectionLink {
  label: string;
  section: string;
  href: string;
}

export const NAV_LINKS: readonly NavSectionLink[] = [
  { label: "Home", section: "home", href: "/#home" },
  { label: "Projects", section: "projects", href: "/#projects" },
  { label: "Research", section: "research", href: "/#research" },
  { label: "Experience", section: "experience", href: "/#experience" },
  { label: "Education", section: "education", href: "/#education" },
  { label: "Capabilities", section: "capabilities", href: "/#capabilities" },
  { label: "Contact", section: "contact", href: "/#contact" },
] as const;

export const RESUME_LINK = {
  label: "Resume",
  href: "/resume",
} as const;
