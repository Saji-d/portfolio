import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import BackToTop from "@/components/ui/BackToTop";
import Reveal from "@/components/ui/Reveal";
import FooterSignature from "@/components/FooterSignature";
import { NAV_LINKS, SITE } from "@/data/site";

// Shared by every footer link: an underline that grows in from the left
// rather than simply appearing, echoing the nav's sliding active-indicator
// without borrowing its shared-layout machinery (these links never need to
// track "current").
const footerLink =
  "group/link relative inline-flex w-fit items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

export default function Footer() {
  return (
    <footer className="relative z-10">
      <Reveal>
        <div className="container-site flex flex-col gap-6 py-6 md:flex-row md:items-start md:justify-between">
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
                    <Link href={link.href} className={footerLink}>
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
                  <a href={`mailto:${SITE.email}`} className={footerLink}>
                    <Mail className="h-3.5 w-3.5 shrink-0" /> Email
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLink}
                  >
                    <GithubIcon className="h-3.5 w-3.5 shrink-0" /> GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLink}
                  >
                    <LinkedinIcon className="h-3.5 w-3.5 shrink-0" /> LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="border-t border-line">
        {/* Deliberately not wrapped in Reveal: as the very last element on
            the page, its rect can never scroll deep enough into Reveal's
            shrunk-from-bottom trigger band (the document runs out of
            scroll room first) - it would sit at opacity:0 forever. The
            block above it already carries the reveal-on-scroll moment. */}
        <div className="container-site flex flex-col items-center justify-between gap-3 py-3 sm:flex-row">
          <p className="card-meta">
            {`© ${new Date().getFullYear()} ${SITE.name} · All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success/70" />
              systems nominal
            </span>
            <span aria-hidden="true" className="h-3 w-px bg-line" />
            <BackToTop />
          </div>
        </div>
      </div>

      <div className="container-site pb-8 pt-2 sm:pb-10">
        <FooterSignature />
      </div>
    </footer>
  );
}
