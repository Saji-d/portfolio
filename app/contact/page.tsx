import type { Metadata } from "next";
import { Mail, Phone, MapPin, ArrowUpRight, Clock } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.name}: email, phone, LinkedIn, and GitHub.`,
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: SITE.phone,
    href: `tel:${SITE.phoneHref}`,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "in/sajidur-rahman-sajid",
    href: SITE.linkedin,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: SITE.githubHandle,
    href: SITE.github,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 08 ] · Contact"
        title="Say hello. I answer quickly."
        lede="Whether it's a role, a collaboration, or a hard technical problem, the fastest path is email."
      />

      <section className="container-site pb-28 pt-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.04}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="card-surface group flex h-full items-start justify-between gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-text-muted">{c.label}</p>
                    <p className="mt-1 font-mono text-sm text-text-primary break-all">
                      {c.value}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="mt-2 h-4 w-4 shrink-0 text-text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">
          <div className="card-surface grid gap-6 p-8 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-xs text-text-muted">Location</p>
                <p className="mt-1 text-sm text-text-primary">{SITE.location}</p>
                <p className="mt-0.5 font-mono text-xs text-text-muted">
                  {SITE.timezone} · remote-friendly
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-xs text-text-muted">Availability</p>
                <p className="mt-1 text-sm leading-relaxed text-text-primary">
                  {SITE.availability}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <div className="card-surface flex flex-wrap items-center justify-between gap-6 p-8">
            <div>
              <h2 className="font-display text-xl font-medium tracking-tight text-gradient">
                Prefer a quick call?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                I&apos;m usually available on {SITE.timezone} business hours. Emails
                get a reply within a day.
              </p>
            </div>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/90"
            >
              <Mail className="h-4 w-4" /> Email me
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
