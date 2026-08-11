"use client";

import type { ComponentType } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import Eyebrow from "@/components/ui/Eyebrow";
import { SITE } from "@/data/site";

interface Channel {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}

const channels: Channel[] = [
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phoneHref}` },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "in/sajidur-rahman-sajid",
    href: SITE.linkedin,
  },
  { icon: GithubIcon, label: "GitHub", value: SITE.githubHandle, href: SITE.github },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative scroll-mt-0 pb-10 pt-[calc(var(--nav-offset)_+_2.5rem)] sm:pb-12"
    >
      <div className="container-site">
        <MotionConfig reducedMotion="user">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
          >
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-start justify-between gap-4"
            >
              <div className="max-w-2xl">
                <Eyebrow index="07">Contact</Eyebrow>
                <h2 className="section-title">
                  Got a problem worth engineering?
                </h2>
              </div>
              <span className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 font-mono text-xs font-medium text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Open to opportunities
              </span>
            </motion.div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {channels.map((c) => {
                const external = c.href.startsWith("http");
                return (
                  <motion.a
                    key={c.label}
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    href={c.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="card-surface group relative flex h-full items-center gap-3 overflow-hidden px-4 py-3.5 transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-[0_12px_32px_-20px_rgba(79,209,197,0.45)]"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[250%] skew-x-12 bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%]"
                    />
                    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent transition-transform duration-300 group-hover:scale-105">
                      <c.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block mono-label text-text-muted">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-sm text-text-primary transition-colors group-hover:text-accent">
                        {c.value}
                      </span>
                    </span>
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <motion.div variants={fadeUp} whileHover={{ y: -3 }}>
                <div className="card-surface flex h-full items-center gap-3 px-4 py-3.5 transition-colors duration-300 hover:border-accent/40">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent transition-transform duration-300 group-hover:scale-105">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="mono-label text-text-muted">
                      Location
                    </p>
                    <p className="mt-0.5 text-sm text-text-primary">{SITE.location}</p>
                    <p className="mt-0.5 card-meta">
                      {SITE.timezone} · remote-friendly
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} whileHover={{ y: -3 }}>
                <div className="card-surface flex h-full items-center gap-3 px-4 py-3.5 transition-colors duration-300 hover:border-accent/40">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent transition-transform duration-300 group-hover:scale-105">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="mono-label text-text-muted">
                      Availability
                    </p>
                    <p className="mt-0.5 body-copy text-text-primary">
                      {SITE.availability}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </MotionConfig>
      </div>
    </section>
  );
}
