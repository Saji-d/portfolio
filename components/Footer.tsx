import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import BackToTop from "@/components/ui/BackToTop";
import { NAV_LINKS, SITE } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div className="container-site flex flex-col gap-8 py-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface font-mono text-sm font-bold text-accent">
              S
            </span>
            <span className="font-display font-medium tracking-tight">
              {SITE.name}
            </span>
          </div>
          <p className="mt-4 body-copy text-text-secondary">
            {SITE.tagline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="eyebrow mb-3">Navigate</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Connect</p>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
              </li>
              <li>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  <GithubIcon className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-4 sm:flex-row sm:gap-3">
          <p className="card-meta">
            {`© ${new Date().getFullYear()} ${SITE.name} · built with Next.js, Tailwind CSS & Motion`}
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
