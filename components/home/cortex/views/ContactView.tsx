"use client";

import { GitBranch, Globe, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/data/site";

const ROWS = [
  { icon: Mail, label: "email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Phone, label: "phone", value: SITE.phone, href: `tel:${SITE.phoneHref}` },
  { icon: Globe, label: "linkedin", value: SITE.linkedin, href: SITE.linkedin },
  { icon: GitBranch, label: "github", value: SITE.github, href: SITE.github },
  { icon: MapPin, label: "location", value: `${SITE.location} · ${SITE.timezone}` },
];

export default function ContactView() {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
        <span className="text-accent-hover">$ contact</span>
        <span className="h-px flex-1 bg-line" />
        <span>{`// contact details`}</span>
      </div>

      <div className="card-surface mt-4 p-4 sm:p-5">
        <ul className="space-y-1">
          {ROWS.map((row) => {
            const Icon = row.icon;
            const content = (
              <>
                <Icon className="h-3.5 w-3.5 shrink-0 text-text-muted transition-colors group-hover:text-accent-hover" />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    {row.label}
                  </span>
                  <span className="block truncate font-mono text-xs text-text-secondary transition-colors group-hover:text-accent-hover">
                    {row.value}
                  </span>
                </span>
              </>
            );
            return (
              <li key={row.label}>
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.href.startsWith("http") ? "_blank" : undefined}
                    rel={row.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-md px-2 py-1.5"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group flex items-center gap-3 rounded-md px-2 py-1.5">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-4 font-mono text-[11px] text-text-muted">
        &gt; usually fastest on email · dhaka, bangladesh (utc+6)
      </p>
    </div>
  );
}
