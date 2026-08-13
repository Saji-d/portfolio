"use client";

import { useEffect, useRef } from "react";

/**
 * The single background decorative system for the whole site: a sparse
 * field of tiny static "data points" that gently repel away from the
 * cursor and ease back once it moves on. No connecting lines, no
 * autonomous drifting — particles only move in direct response to the
 * pointer, which keeps the effect calm and legible rather than a busy
 * animated backdrop. Renders once, behind all page content (main is
 * z-10), reused for every section rather than duplicated per-section.
 */

interface Particle {
  /** Home position as a fraction of the canvas, so it re-lands correctly after a resize. */
  fx: number;
  fy: number;
  /** Current rendered position — eases toward home + any repulsion offset each frame. */
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  color: readonly [number, number, number];
  phase: number;
  twinkleSpeed: number;
}

const INDIGO = [129, 140, 248] as const;
const VIOLET = [168, 85, 247] as const;
const CYAN = [34, 211, 238] as const;

const FRAME_MS = 33;
const REPEL_RADIUS = 90;
const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS;
const REPEL_STRENGTH = 24;
const EASE = 0.08;

function pickColor(): readonly [number, number, number] {
  const r = Math.random();
  if (r < 0.06) return CYAN;
  if (r < 0.16) return VIOLET;
  return INDIGO;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const big = Math.random() < 0.18;
    return {
      fx: Math.random(),
      fy: Math.random(),
      x: 0,
      y: 0,
      size: big ? 1.6 : 1,
      baseAlpha: big ? 0.35 + Math.random() * 0.25 : 0.15 + Math.random() * 0.2,
      color: pickColor(),
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.15 + Math.random() * 0.2,
    };
  });
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    let prefersReduced = reducedMotionQuery.matches;
    let finePointer = finePointerQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let mobile = false;
    let particles: Particle[] = [];
    let pointerX = -9999;
    let pointerY = -9999;
    let elapsed = 0;
    let raf = 0;
    let lastDraw = 0;
    let running = false;
    let pageHidden = false;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      mobile = width < 768;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales gently with viewport area but stays capped — this is
      // atmosphere, not a simulation, and mobile gets a much sparser field.
      const target = mobile
        ? Math.min(36, Math.max(20, Math.floor((width * height) / 22000)))
        : Math.min(150, Math.max(90, Math.floor((width * height) / 13000)));

      particles = makeParticles(target);
      for (const p of particles) {
        p.x = p.fx * width;
        p.y = p.fy * height;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const twinkle = prefersReduced
          ? 1
          : 0.7 + 0.3 * Math.sin(elapsed * p.twinkleSpeed + p.phase);
        ctx.fillStyle = `rgba(${p.color.join(",")}, ${(p.baseAlpha * twinkle).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }

    function tick() {
      elapsed += FRAME_MS / 1000;
      for (const p of particles) {
        const homeX = p.fx * width;
        const homeY = p.fy * height;
        let targetX = homeX;
        let targetY = homeY;

        if (finePointer) {
          const dx = homeX - pointerX;
          const dy = homeY - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < REPEL_RADIUS_SQ && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - dist / REPEL_RADIUS;
            const push = falloff * falloff * REPEL_STRENGTH;
            targetX = homeX + (dx / dist) * push;
            targetY = homeY + (dy / dist) * push;
          }
        }

        p.x += (targetX - p.x) * EASE;
        p.y += (targetY - p.y) * EASE;
      }
    }

    function loop(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - lastDraw < FRAME_MS) return;
      lastDraw = now;
      tick();
      draw();
    }

    function start() {
      if (running || prefersReduced || pageHidden) return;
      running = true;
      lastDraw = 0;
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    }

    function onResize() {
      resize();
      if (prefersReduced) draw();
    }

    function onPointerMove(e: PointerEvent) {
      pointerX = e.clientX;
      pointerY = e.clientY;
    }

    function onPointerLeave() {
      pointerX = -9999;
      pointerY = -9999;
    }

    function onVisibility() {
      pageHidden = document.hidden;
      if (pageHidden) stop();
      else start();
    }

    function onReducedMotionChange(e: MediaQueryListEvent) {
      prefersReduced = e.matches;
      if (prefersReduced) {
        stop();
        // Snap particles home and render one calm static frame.
        for (const p of particles) {
          p.x = p.fx * width;
          p.y = p.fy * height;
        }
        draw();
      } else {
        start();
      }
    }

    function onPointerTypeChange(e: MediaQueryListEvent) {
      finePointer = e.matches;
      if (!finePointer) onPointerLeave();
    }

    resize();
    if (prefersReduced) {
      draw();
    } else {
      start();
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    finePointerQuery.addEventListener("change", onPointerTypeChange);
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      finePointerQuery.removeEventListener("change", onPointerTypeChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* The one intentional ambient wash for the whole page — large, soft,
          slow, positioned once rather than scattered per-section. */}
      <div className="animate-ambient-drift absolute -top-1/3 left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow-primary),transparent)] opacity-50 blur-3xl" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
