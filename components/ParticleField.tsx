"use client";

import { useEffect, useRef } from "react";

/**
 * The single background system for the whole site: a barely-perceptible
 * two-tone color wash, a static technical grid, and a sparse "neural
 * field" of tiny data points at three depth tiers, which gently repel
 * from the cursor and ease back once it moves on, plus an almost
 * imperceptible organic idle drift (no autonomous "look at this"
 * animation). No connecting lines, no glow blobs — the atmosphere comes
 * entirely from these three restrained layers. Fixed to the viewport
 * (not the document), so it renders once behind all page content and
 * never varies by scroll position or section — one continuous field for
 * the whole portfolio, reused rather than duplicated per-section.
 */

type Depth = "far" | "mid" | "near";

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
  /** Only mid/near violet or cyan particles get a soft halo — never the indigo majority, and
   *  never the distant tier (a halo on a tiny "far" point would fight the depth cue). */
  glow: boolean;
  phase: number;
  twinkleSpeed: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeed: number;
}

const INDIGO = [129, 140, 248] as const;
const VIOLET = [168, 85, 247] as const;
const CYAN = [34, 211, 238] as const;

const FRAME_MS = 33;
const REPEL_RADIUS = 90;
const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS;
const REPEL_STRENGTH = 24;
const EASE = 0.06;
/** Idle motion amplitude in px — deliberately tiny: "is something moving?", not an animation. */
const DRIFT_AMPLITUDE = 1.4;
/** A single slow shared cycle nudges every particle together by a fraction of a pixel, giving
 *  the field a faint sense of coherence without any particle visibly "drifting". */
const GLOBAL_DRIFT_PERIOD = 240;
const GLOBAL_DRIFT_AMPLITUDE = 0.6;

/** Two overlapping grids at different cell sizes and opacities — the beat between them, and the
 *  fact that only half the lines are at full strength, reads as an atmospheric technical texture
 *  rather than a flat, mechanically uniform blueprint. */
const GRID_STYLE = {
  backgroundImage: [
    "linear-gradient(to right, rgba(99,102,241,0.06) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(99,102,241,0.06) 1px, transparent 1px)",
    "linear-gradient(to right, rgba(99,102,241,0.032) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(99,102,241,0.032) 1px, transparent 1px)",
  ].join(","),
  backgroundSize: "64px 64px, 64px 64px, 88px 88px, 88px 88px",
};

/** A barely-perceptible two-tone color field — indigo toward one corner, cyan toward the
 *  opposite one — so the canvas reads as "there is color in this environment" rather than flat
 *  black, without ever resolving into a visible circle or a glow blob. Huge radius, very low
 *  alpha, no blur filter, no animation. */
const ATMOSPHERE_STYLE = {
  backgroundImage: [
    "radial-gradient(60% 60% at 18% 15%, rgba(99,102,241,0.05), transparent 70%)",
    "radial-gradient(65% 65% at 85% 85%, rgba(34,211,238,0.03), transparent 70%)",
  ].join(","),
};

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function pickColor(): readonly [number, number, number] {
  const r = Math.random();
  if (r < 0.09) return CYAN;
  if (r < 0.22) return VIOLET;
  return INDIGO;
}

function pickDepth(): Depth {
  const r = Math.random();
  if (r < 0.55) return "far";
  if (r < 0.85) return "mid";
  return "near";
}

function makeParticles(count: number): Particle[] {
  // Mostly uniform placement, with a minority of particles pulled softly
  // toward a few loose cluster centers so density reads as faintly organic
  // rather than perfectly even — never an obvious network shape.
  const clusters = Array.from({ length: 4 }, () => ({
    x: Math.random(),
    y: Math.random(),
  }));

  return Array.from({ length: count }, () => {
    const color = pickColor();
    const depth = pickDepth();
    const isColored = color !== INDIGO;
    const glow = isColored && depth !== "far";

    let size: number;
    let baseAlpha: number;
    if (depth === "near") {
      size = 1.5 + Math.random() * 0.4;
      baseAlpha = 0.5 + Math.random() * 0.3;
    } else if (depth === "mid") {
      size = 1.1 + Math.random() * 0.35;
      baseAlpha = 0.35 + Math.random() * 0.2;
    } else {
      size = 0.8 + Math.random() * 0.3;
      baseAlpha = 0.25 + Math.random() * 0.16;
    }

    let fx = Math.random();
    let fy = Math.random();
    if (Math.random() < 0.35) {
      const c = clusters[Math.floor(Math.random() * clusters.length)];
      fx = clamp01(fx * 0.4 + c.x * 0.6 + (Math.random() - 0.5) * 0.12);
      fy = clamp01(fy * 0.4 + c.y * 0.6 + (Math.random() - 0.5) * 0.12);
    }

    return {
      fx,
      fy,
      x: 0,
      y: 0,
      size,
      baseAlpha,
      color,
      glow,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.15 + Math.random() * 0.2,
      driftPhaseX: Math.random() * Math.PI * 2,
      driftPhaseY: Math.random() * Math.PI * 2,
      driftSpeed: 0.02 + Math.random() * 0.015,
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
        ? Math.min(40, Math.max(20, Math.floor((width * height) / 20000)))
        : Math.min(150, Math.max(90, Math.floor((width * height) / 13000)));

      particles = makeParticles(target);
      for (const p of particles) {
        p.x = p.fx * width;
        p.y = p.fy * height;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      ctx.shadowBlur = 0;
      for (const p of particles) {
        if (p.glow) continue;
        const twinkle = prefersReduced
          ? 1
          : 0.7 + 0.3 * Math.sin(elapsed * p.twinkleSpeed + p.phase);
        ctx.fillStyle = `rgba(${p.color.join(",")}, ${(p.baseAlpha * twinkle).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      ctx.shadowBlur = 4;
      for (const p of particles) {
        if (!p.glow) continue;
        const twinkle = prefersReduced
          ? 1
          : 0.7 + 0.3 * Math.sin(elapsed * p.twinkleSpeed + p.phase);
        const alpha = (p.baseAlpha * twinkle).toFixed(3);
        ctx.shadowColor = `rgba(${p.color.join(",")}, ${alpha})`;
        ctx.fillStyle = `rgba(${p.color.join(",")}, ${alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.shadowBlur = 0;
    }

    function tick() {
      elapsed += FRAME_MS / 1000;

      const globalAngle = (elapsed / GLOBAL_DRIFT_PERIOD) * Math.PI * 2;
      const globalDX = Math.cos(globalAngle) * GLOBAL_DRIFT_AMPLITUDE;
      const globalDY = Math.sin(globalAngle) * GLOBAL_DRIFT_AMPLITUDE;

      for (const p of particles) {
        const homeX =
          p.fx * width + globalDX + Math.sin(elapsed * p.driftSpeed + p.driftPhaseX) * DRIFT_AMPLITUDE;
        const homeY =
          p.fy * height +
          globalDY +
          Math.cos(elapsed * p.driftSpeed * 0.85 + p.driftPhaseY) * DRIFT_AMPLITUDE;
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
      <div className="absolute inset-0" style={ATMOSPHERE_STYLE} />
      <div className="absolute inset-0" style={GRID_STYLE} />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
