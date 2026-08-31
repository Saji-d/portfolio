"use client";

import { useEffect, useRef } from "react";
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
// track "current"). will-change-transform primes the marble-dodge physics
// below for the transform writes it does every frame while active.
const footerLink =
  "group/link relative inline-flex w-fit items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 will-change-transform";

// Marble-dodge physics for the Navigate/Connect links: as the cursor nears
// a link it's pushed radially away (quadratic falloff, so the push fades
// in gently rather than snapping on at the radius edge), then eased back
// to rest with an underdamped spring - it overshoots slightly past 0 and
// swings back before settling, reading as the marble dropping back into
// place from the side rather than snapping straight home. Everything runs
// per-frame in rAF (not a CSS transition) so the push tracks the pointer
// continuously and the return keeps the same spring character throughout.
// Desktop fine-pointer only, and skipped entirely under
// prefers-reduced-motion.
const RADIUS = 64;
const MAX_PUSH = 12;
const STIFFNESS = 0.14;
const DAMPING = 0.8;
const ROTATION_PER_VELOCITY = 1.6;
const MAX_ROTATION = 8;

interface SpringState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function useMarbleLinks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    if (reducedMotionQuery.matches || !finePointerQuery.matches) return;

    const container = containerRef.current;
    if (!container) return;

    const states = new Map<HTMLElement, SpringState>();
    let pointerX = -9999;
    let pointerY = -9999;
    let raf = 0;
    let running = false;

    function ensureState(el: HTMLElement) {
      let s = states.get(el);
      if (!s) {
        s = { x: 0, y: 0, vx: 0, vy: 0 };
        states.set(el, s);
      }
      return s;
    }

    function tick() {
      let anyActive = false;
      itemsRef.current.forEach((el) => {
        const s = ensureState(el);
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - pointerX;
        const dy = cy - pointerY;
        const dist = Math.hypot(dx, dy);

        let tx = 0;
        let ty = 0;
        if (dist < RADIUS && dist > 0.01) {
          const falloff = 1 - dist / RADIUS;
          const push = falloff * falloff * MAX_PUSH;
          tx = (dx / dist) * push;
          ty = (dy / dist) * push;
        }

        s.vx = (s.vx + (tx - s.x) * STIFFNESS) * DAMPING;
        s.vy = (s.vy + (ty - s.y) * STIFFNESS) * DAMPING;
        s.x += s.vx;
        s.y += s.vy;

        const resting =
          tx === 0 &&
          ty === 0 &&
          Math.abs(s.x) < 0.05 &&
          Math.abs(s.y) < 0.05 &&
          Math.abs(s.vx) < 0.02 &&
          Math.abs(s.vy) < 0.02;

        if (resting) {
          s.x = 0;
          s.y = 0;
          s.vx = 0;
          s.vy = 0;
          el.style.transform = "";
        } else {
          anyActive = true;
          const rotation = Math.max(
            -MAX_ROTATION,
            Math.min(MAX_ROTATION, s.vx * ROTATION_PER_VELOCITY)
          );
          el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg)`;
        }
      });

      if (anyActive) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      start();
    }

    function onPointerLeave() {
      pointerX = -9999;
      pointerY = -9999;
      start();
    }

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  function register(key: string) {
    return (el: HTMLElement | null) => {
      if (el) itemsRef.current.set(key, el);
      else itemsRef.current.delete(key);
    };
  }

  return { containerRef, register };
}

export default function Footer() {
  const { containerRef, register } = useMarbleLinks();

  return (
    <footer id="site-footer" className="relative z-10">
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

          <div
            ref={containerRef}
            className="grid grid-cols-2 gap-10 sm:grid-cols-3"
          >
            <div>
              <p className="eyebrow mb-3">Navigate</p>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      ref={register(`nav-${link.href}`)}
                      className={footerLink}
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
                    ref={register("email")}
                    className={footerLink}
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" /> Email
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={register("github")}
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
                    ref={register("linkedin")}
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

      {/* Deliberately NOT container-site: the signature is sized in JS off
          its own container's width (FooterSignature.tsx), so giving it the
          full viewport width (minus a small edge gutter) rather than the
          76rem content column is what lets it scale up to an editorial,
          oversized closing statement on wide viewports instead of being
          capped at the same width as the page copy above it. */}
      <div className="px-2 pb-8 pt-2 sm:px-4 sm:pb-10">
        <FooterSignature />
      </div>
    </footer>
  );
}
