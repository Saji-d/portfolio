"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, TerminalSquare, Command } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { NAV_LINKS, SITE } from "@/data/site";
import { useTerminal } from "@/components/terminal-context";
import { useCommandPalette } from "@/components/command-palette-context";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { toggle } = useTerminal();
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface font-mono text-sm font-bold text-accent transition-colors group-hover:border-accent/50">
            S
          </span>
          <span className="font-display text-sm font-medium tracking-tight text-text-primary">
            Sajidur Rahman Sajid
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-2 text-sm transition-colors ${
                  active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaletteOpen(true)}
            aria-label="Open command palette"
            title="Search (Ctrl+K)"
            className="hidden h-10 w-10 place-items-center rounded-md border border-line text-text-secondary transition-colors hover:border-accent/50 hover:text-accent sm:grid"
          >
            <Command className="h-4 w-4" />
          </button>
          <button
            onClick={toggle}
            aria-label="Toggle terminal mode"
            title="Terminal mode (`)"
            className="grid h-10 w-10 place-items-center rounded-md border border-line text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
          >
            <TerminalSquare className="h-4 w-4" />
          </button>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden h-10 w-10 place-items-center rounded-md border border-line text-text-secondary transition-colors hover:border-accent/50 hover:text-accent sm:grid"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hidden h-10 w-10 place-items-center rounded-md border border-line text-text-secondary transition-colors hover:border-accent/50 hover:text-accent sm:grid"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <Link
            href="/contact"
            className="hidden rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#0B0E14] transition-all hover:bg-accent/90 md:block"
          >
            Get in touch
          </Link>
          <button
            ref={menuToggleRef}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-md border border-line text-text-secondary lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="border-t border-line bg-bg/95 backdrop-blur-md lg:hidden"
        >
          <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="rounded-md px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
