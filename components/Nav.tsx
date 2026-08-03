"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, TerminalSquare, Command } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { NAV_LINKS, SITE } from "@/data/site";
import { useTerminal } from "@/components/terminal-context";
import { useCommandPalette } from "@/components/command-palette-context";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { toggle } = useTerminal();
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{
                        type: "spring",
                        bounce: 0.18,
                        duration: 0.55,
                      }}
                      className="absolute inset-0 rounded-full border border-accent/30 bg-accent-dim"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
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
            <button
              onClick={toggle}
              aria-label="Toggle terminal mode"
              title="Terminal mode (`)"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-surface/60 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
            >
              <TerminalSquare className="h-4 w-4" />
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
              href="/contact"
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

        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              ref={menuRef}
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <nav
                className="flex flex-col gap-1 px-3 pb-3 pt-1"
                aria-label="Mobile"
              >
                {NAV_LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
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
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
