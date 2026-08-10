"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { NAV_LINKS, RESUME_LINK, SITE } from "@/data/site";
import { useCommandPalette } from "@/components/command-palette-context";

interface PillRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<PillRect | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.section)
    ).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    section: string
  ) => {
    setOpen(false);
    if (pathname !== "/") return;
    e.preventDefault();
    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `/#${section}`);
  };

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const link = nav.querySelector<HTMLAnchorElement>(
        'a[aria-current]:not([data-resume])'
      );
      if (!link) {
        setPill(null);
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      setPill({
        left: rect.left - navRect.left,
        top: rect.top - navRect.top,
        width: rect.width,
        height: rect.height,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [pathname, activeSection]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled((prev) => {
          const next = window.scrollY > 16;
          return prev === next ? prev : next;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4 sm:top-4">
      <div
        className={`pointer-events-auto w-full max-w-5xl rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
          scrolled || open
            ? "border-white/15 bg-bg/85 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.65)]"
            : "border-white/10 bg-bg/55 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-2 pl-4 pr-2">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-surface font-mono text-sm font-bold text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors group-hover:border-accent/50">
              S
            </span>
            <span className="hidden font-display text-sm font-medium tracking-tight text-text-primary md:block">
              Sajidur Rahman Sajid
            </span>
          </Link>

          <nav
            ref={navRef}
            className="relative hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {pill && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full border border-accent/30 bg-accent-dim transition-[left,top,width,height] duration-500 ease-[cubic-bezier(0.34,1.2,0.4,1)]"
                style={{
                  left: pill.left,
                  top: pill.top,
                  width: pill.width,
                  height: pill.height,
                }}
              />
            )}
            {NAV_LINKS.map((link) => {
              const active = pathname === "/" && activeSection === link.section;
              return (
                <Link
                  key={link.section}
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.section)}
                  aria-current={active ? "true" : undefined}
                  className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
            <Link
              href={RESUME_LINK.href}
              data-resume
              aria-current={pathname === "/resume" ? "page" : undefined}
              className="relative ml-1 inline-flex items-center gap-1 rounded-full px-3 py-2 font-mono text-xs font-medium text-text-secondary transition-colors hover:text-accent"
            >
              <span className="relative z-10">{RESUME_LINK.label}</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              title="Search (Ctrl+K)"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-surface/60 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Command className="h-4 w-4" />
            </button>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 bg-surface/60 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent sm:grid"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 bg-surface/60 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent md:grid"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <Link
              href="/#contact"
              onClick={(e) => handleSectionClick(e, "contact")}
              className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[#0B0E14] transition-all hover:bg-accent/90 hover:shadow-[0_0_24px_rgba(79,209,197,0.35)] md:block"
            >
              Get in touch
            </Link>
            <button
              ref={menuToggleRef}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-surface/60 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div
          ref={menuRef}
          id="mobile-menu"
          aria-hidden={!open}
          inert={!open}
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <nav className="flex flex-col gap-1 px-3 pb-3 pt-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => {
                const active = pathname === "/" && activeSection === link.section;
                return (
                  <Link
                    key={link.section}
                    href={link.href}
                    onClick={(e) => handleSectionClick(e, link.section)}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent-dim text-accent"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href={RESUME_LINK.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === "/resume" ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  pathname === "/resume"
                    ? "bg-accent-dim text-accent"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                {RESUME_LINK.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
