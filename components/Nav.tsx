"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, SquareTerminal, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { ABOUT_LINK, ALL_SECTION_LINKS, CORTEX_LINK, NAV_LINKS, RESUME_LINK, SITE } from "@/data/site";
import { useCommandPalette } from "@/components/command-palette-context";

// One shared active-indicator bar that slides beneath nav items when the
// active section changes (shared layout animation, spring-eased at ~200-280ms).
const NAV_INDICATOR_TRANSITION = {
  type: "spring" as const,
  stiffness: 440,
  damping: 34,
  mass: 0.9,
};

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // On a hard load / refresh with a #section in the URL, Next's App Router
  // does not reliably perform the browser's native hash-scroll - the page
  // silently lands at the top with the hash still in the address bar. Worse,
  // a single early correction isn't enough either: web-font swap, the hero
  // image, and the lazily-loaded Cortex console (which boots with its own
  // typing animation) can all still be changing the height of content above
  // the target well after mount, silently carrying the scroll position away
  // from where it was correctly placed. Re-assert the position at several
  // checkpoints - immediately, once fonts finish loading, once the window
  // "load" event fires, and a few trailing timers to cover the dynamic
  // import + boot-animation window - rather than trust one timing.
  //
  // This also has to run for hash changes that are NOT a fresh document
  // load: browser back/forward across hash history entries (and manual
  // address-bar edits) fire a native `hashchange` event without reloading
  // the page, so a mount-only effect would miss them entirely.
  useEffect(() => {
    if (pathname !== "/") return;

    // The browser's own scroll-restoration is a silent competitor here: on
    // repeat visits/back-forward within the same session, Chrome tries to
    // restore whatever scroll position it last saw for this history entry,
    // and that restoration can land *after* the corrections below, quietly
    // overwriting them back to a stale position (typically 0). Taking
    // manual control is the standard fix for a page that already owns its
    // own scroll-restoration logic.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let cancelTimers: (() => void) | null = null;

    const correctTo = (hash: string) => {
      cancelTimers?.();
      if (!hash || !document.getElementById(hash)) return;

      let cancelled = false;
      const scrollToHash = () => {
        if (cancelled) return;
        document.getElementById(hash)?.scrollIntoView({ behavior: "instant", block: "start" });
      };

      scrollToHash();
      setActiveSection(hash);

      document.fonts?.ready.then(scrollToHash);
      window.addEventListener("load", scrollToHash);
      const timers = [300, 700, 1400, 2200].map((ms) => window.setTimeout(scrollToHash, ms));

      // Stop re-asserting the position the moment the visitor takes control
      // - this is a landing correction, not a scroll lock.
      const onUserScroll = () => {
        cancelled = true;
      };
      window.addEventListener("wheel", onUserScroll, { passive: true, once: true });
      window.addEventListener("touchmove", onUserScroll, { passive: true, once: true });

      cancelTimers = () => {
        cancelled = true;
        window.removeEventListener("load", scrollToHash);
        window.removeEventListener("wheel", onUserScroll);
        window.removeEventListener("touchmove", onUserScroll);
        timers.forEach((t) => window.clearTimeout(t));
      };
    };

    correctTo(window.location.hash.slice(1));

    const onHashChange = () => correctTo(window.location.hash.slice(1));
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelTimers?.();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  // Scroll-position-driven active section - deterministic, not dependent on
  // IntersectionObserver callback timing (which browsers throttle heavily on
  // hidden/background tabs). A section becomes active once its top edge has
  // scrolled up past the fixed navbar's actual measured height.
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = ALL_SECTION_LINKS.map((link) =>
      document.getElementById(link.section)
    ).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    // A short setTimeout throttle rather than requestAnimationFrame: rAF is
    // fully suspended (not just throttled) on hidden/background tabs, which
    // would leave the active section stale after an alt-tab-and-back. A
    // timer still fires there, just at a capped rate, which is all this
    // needs - it isn't a per-frame visual update.
    let pending = 0;
    const update = () => {
      pending = 0;
      const navBottom = headerRef.current?.getBoundingClientRect().bottom ?? 88;
      // Chapters land with their top edge at the viewport top (scroll-margin
      // is 0), so any section whose top has risen to the navbar line - or
      // above - counts as reached; the last one in document order wins.
      const offset = navBottom + 56;
      let current: string | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= offset) {
          current = el.id;
        }
      }
      setActiveSection((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!pending) pending = window.setTimeout(update, 50);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (pending) window.clearTimeout(pending);
    };
  }, [pathname]);

  // Cheap one-way signal for the background system to read - no
  // subscription/context needed for a purely decorative tone shift. Kept in
  // its own effect (rather than written inline from the scroll handler or
  // click handlers) so the DOM mutation always happens through React's
  // effect system.
  useEffect(() => {
    document.documentElement.dataset.section = activeSection ?? "";
  }, [activeSection]);

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    section: string
  ) => {
    setOpen(false);
    if (pathname !== "/") return;
    e.preventDefault();
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `/#${section}`);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname !== "/") return;
    e.preventDefault();
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
  };

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

  const aboutActive = pathname === "/" && activeSection === ABOUT_LINK.section;
  const cortexActive = pathname === "/" && activeSection === CORTEX_LINK.section;

  return (
    <>
      <Link
        href="/"
        onClick={handleLogoClick}
        aria-label="Scroll to top"
        className="nav-enter group fixed top-6 z-50 s-button-left sm:top-7"
      >
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-surface font-mono text-sm font-bold text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-colors group-hover:border-accent/50">
          S
          <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px_rgba(63,178,138,0.8)]" />
        </span>
      </Link>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4 sm:top-4"
      >
        <div
          style={{ animationDelay: "0.08s" }}
          className={`nav-enter pointer-events-auto w-full max-w-4xl rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
            scrolled || open
              ? "border-line-strong bg-bg/85 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.65)]"
              : "border-line bg-bg/55 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
          }`}
        >
        <div className="flex h-14 items-center gap-1.5 pl-4 pr-2">
          <nav
            className="relative hidden items-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            <MotionConfig reducedMotion="user">
              <Link
                href={ABOUT_LINK.href}
                onClick={(e) => handleSectionClick(e, ABOUT_LINK.section)}
                aria-current={aboutActive ? "true" : undefined}
                className={`relative flex shrink-0 items-center px-2 py-2 text-sm transition-all duration-200 ${
                  aboutActive
                    ? "font-semibold text-accent"
                    : "font-medium text-text-secondary hover:-translate-y-px hover:text-text-primary"
                }`}
              >
                <span className="relative z-10">{ABOUT_LINK.label}</span>
                {aboutActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 bottom-0.5 h-[2px] rounded-full bg-accent"
                    transition={NAV_INDICATOR_TRANSITION}
                  />
                )}
              </Link>
              <Link
                href={CORTEX_LINK.href}
                data-cortex
                onClick={(e) => handleSectionClick(e, CORTEX_LINK.section)}
                aria-current={cortexActive ? "true" : undefined}
                title="Enter Cortex, the console behind this site"
                className={`relative flex shrink-0 items-center px-2 py-2 text-sm transition-all duration-200 ${
                  cortexActive
                    ? "font-semibold text-accent"
                    : "font-medium text-text-secondary hover:-translate-y-px hover:text-text-primary"
                }`}
              >
                <span className="relative z-10">{CORTEX_LINK.label}</span>
                {cortexActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 bottom-0.5 h-[2px] rounded-full bg-accent"
                    transition={NAV_INDICATOR_TRANSITION}
                  />
                )}
              </Link>
              {NAV_LINKS.map((link) => {
                const active = pathname === "/" && activeSection === link.section;
                return (
                  <Link
                    key={link.section}
                    href={link.href}
                    onClick={(e) => handleSectionClick(e, link.section)}
                    aria-current={active ? "true" : undefined}
                    className={`relative flex shrink-0 items-center px-2 py-2 text-sm transition-all duration-200 ${
                      active
                        ? "font-semibold text-accent"
                        : "font-medium text-text-secondary hover:-translate-y-px hover:text-text-primary"
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-2 bottom-0.5 h-[2px] rounded-full bg-accent"
                        transition={NAV_INDICATOR_TRANSITION}
                      />
                    )}
                  </Link>
                );
              })}
            </MotionConfig>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-line bg-surface/60">
              <button
                onClick={() => setPaletteOpen(true)}
                aria-label="Open Cortex, command console"
                title="Search · ⌘K"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-l-lg text-text-secondary transition-colors hover:text-accent"
              >
                <SquareTerminal className="h-4 w-4" />
              </button>
              <span
                aria-hidden="true"
                className="hidden h-5 w-px shrink-0 bg-line sm:block"
              />
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hidden h-9 w-9 shrink-0 place-items-center text-text-secondary transition-colors hover:text-accent sm:grid"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <span
                aria-hidden="true"
                className="hidden h-5 w-px shrink-0 bg-line md:block"
              />
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hidden h-9 w-9 shrink-0 place-items-center rounded-r-lg text-text-secondary transition-colors hover:text-accent md:grid"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
            <Link
              href={RESUME_LINK.href}
              data-resume
              aria-current={pathname === "/resume" ? "page" : undefined}
              className="hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 font-mono text-xs font-medium text-text-secondary transition-colors hover:text-accent md:inline-flex"
            >
              <span className="relative z-10">{RESUME_LINK.label}</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <button
              ref={menuToggleRef}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface/60 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent lg:hidden"
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
              <Link
                href={ABOUT_LINK.href}
                onClick={(e) => handleSectionClick(e, ABOUT_LINK.section)}
                aria-current={aboutActive ? "true" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  aboutActive
                    ? "bg-accent-dim text-accent"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 shrink-0 rounded-full bg-accent transition-opacity duration-200 ${
                    aboutActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                {ABOUT_LINK.label}
              </Link>
              <Link
                href={CORTEX_LINK.href}
                onClick={(e) => handleSectionClick(e, CORTEX_LINK.section)}
                aria-current={cortexActive ? "true" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  cortexActive
                    ? "bg-accent-dim text-accent"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 shrink-0 rounded-full bg-accent transition-opacity duration-200 ${
                    cortexActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                {CORTEX_LINK.label}
              </Link>
              {NAV_LINKS.map((link) => {
                const active = pathname === "/" && activeSection === link.section;
                return (
                  <Link
                    key={link.section}
                    href={link.href}
                    onClick={(e) => handleSectionClick(e, link.section)}
                    aria-current={active ? "true" : undefined}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent-dim text-accent"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1 w-1 shrink-0 rounded-full bg-accent transition-opacity duration-200 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
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
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary sm:hidden"
              >
                GitHub
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary md:hidden"
              >
                LinkedIn
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
          </nav>
          </div>
        </div>
        </div>
      </header>
    </>
  );
}
