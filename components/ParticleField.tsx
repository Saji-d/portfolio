"use client";

import { useEffect, useRef } from "react";

/**
 * The single background system for the whole site: a barely-perceptible
 * two-tone color wash beneath a dense field of round dot particles at
 * three depth tiers - no star glyphs or sparkle shapes, only dots. Every
 * particle's rendered position is always the sum of two independent
 * layers - its own continuous ambient drift (unique speed/phase/amplitude
 * per particle, never synchronized, never paused) and a spring-eased
 * displacement pushed by the cursor. Ambient drift is itself a sum of a
 * slow organic sweep plus a faster small-amplitude wobble. A single sine
 * (or even independent sines per axis) has a near-zero derivative near its
 * peak, so a particle can sit within a hair of its extremum for a couple of
 * seconds and *look* frozen even though it's technically moving - that's
 * not hypothetical, it's the exact failure mode measured in the corners of
 * an earlier version. The wobble is deliberately a true circular orbit
 * (the same angle driving both cos and sin), which has *mathematically
 * constant* speed at every instant - there is no phase where it can stall,
 * so combined with the sweep every particle has a guaranteed floor on how
 * fast it's moving at all times, which is what the human eye actually
 * judges "alive" by, not the underlying math. Cursor influence uses smooth
 * distance falloff rather than a hard radius cutoff, so every particle is
 * technically reachable - tiny ones just barely, near ones strongly - and
 * only the cursor displacement (never the ambient drift)
 * relaxes back to zero once the cursor moves away. No grid, no connecting
 * lines, no glow around the cursor itself - the atmosphere comes entirely
 * from the particles. Fixed to the viewport (not the document), so it
 * renders once behind all page content and never varies by scroll
 * position or section - one continuous field for the whole portfolio,
 * reused rather than duplicated per-section.
 */

type Depth = "tiny" | "medium" | "near";

interface Particle {
  /** Home position as a fraction of the canvas, so it re-lands correctly after a resize. */
  fx: number;
  fy: number;
  /** Final rendered position: home + ambient drift + cursor spring displacement. */
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  color: readonly [number, number, number];
  depth: Depth;
  /** Only colored medium/near particles get a soft halo - never the indigo majority, and never
   *  the tiny tier (a halo on a 1px point would fight the depth cue). */
  glow: boolean;
  twinklePhase: number;
  twinkleSpeed: number;
  twinkleAmount: number;
  /** Ambient drift, independent per particle: a slow two-harmonic sweep (the organic loop) plus a
   *  fast constant-speed circular wobble (one angle drives both axes, so its speed can never dip
   *  near zero the way any sine-based term can - see the header comment). */
  ambAmpX: number;
  ambAmpY: number;
  ambSpeedX: number;
  ambSpeedY: number;
  ambPhaseX: number;
  ambPhaseY: number;
  wobbleAmp: number;
  wobbleSpeed: number;
  wobblePhase: number;
  /** Cursor-driven displacement, carried frame to frame and eased toward its target - the only
   *  part of the position that reacts to the cursor, and the only part that ever returns to zero. */
  dispX: number;
  dispY: number;
  /** Depth governs how far the cursor's field reaches and how strongly/briskly it pushes - tiny
   *  barely notices it, near responds most readily, giving the field a subtle 3D parallax. */
  decayRadius: number;
  maxPush: number;
  springEase: number;
}

const INDIGO = [129, 140, 248] as const;
const ELECTRIC_BLUE = [96, 165, 250] as const;
const CYAN = [34, 211, 238] as const;
const VIOLET = [168, 85, 247] as const;

/** Floors applied after per-particle jitter so nothing can roll a near-zero amplitude or speed -
 *  every particle keeps a guaranteed minimum of both the slow sweep and the fast wobble. */
const MIN_SWEEP_AMP = 1.6;
const MIN_SWEEP_SPEED = 0.22;
/** The wobble's speed is an angular rate (rad/s) around a circle of radius wobbleAmp, so its floor
 *  linear speed is MIN_WOBBLE_AMP * MIN_WOBBLE_SPEED px/s - never zero, unlike a sine's peak. */
const MIN_WOBBLE_AMP = 0.65;
const MIN_WOBBLE_SPEED = 4.2;

/** Per-depth ambient drift (always-on, independent of the cursor) and cursor spring physics
 *  (distance falloff is continuous - every particle is reachable, this just scales how far the
 *  field reaches and how hard it pushes). Ranges get jittered per-particle in makeParticles(). */
const DEPTH_CONFIG: Record<
  Depth,
  {
    sweepAmp: number;
    sweepSpeed: number;
    wobbleAmp: number;
    wobbleSpeed: number;
    decayRadius: number;
    maxPush: number;
    springEase: number;
  }
> = {
  tiny: { sweepAmp: 2.6, sweepSpeed: 0.34, wobbleAmp: 0.8, wobbleSpeed: 5.0, decayRadius: 90, maxPush: 9, springEase: 0.055 },
  medium: { sweepAmp: 4.6, sweepSpeed: 0.48, wobbleAmp: 1.1, wobbleSpeed: 5.6, decayRadius: 150, maxPush: 26, springEase: 0.1 },
  near: { sweepAmp: 7.2, sweepSpeed: 0.66, wobbleAmp: 1.4, wobbleSpeed: 6.2, decayRadius: 220, maxPush: 55, springEase: 0.15 },
};

const FRAME_MS = 16;

/** A barely-perceptible multi-tone color field - indigo and electric blue pooling toward a
 *  couple of corners - so the canvas reads as "there is color in this environment" rather than
 *  flat black, without ever resolving into a visible circle or a glow blob. Huge radius, very low
 *  alpha, no blur filter, no animation. */
const ATMOSPHERE_STYLE = {
  backgroundImage: [
    "radial-gradient(60% 60% at 18% 15%, rgba(99,102,241,0.055), transparent 70%)",
    "radial-gradient(55% 55% at 78% 30%, rgba(59,130,246,0.035), transparent 72%)",
    "radial-gradient(65% 65% at 85% 88%, rgba(34,211,238,0.03), transparent 70%)",
  ].join(","),
};

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function pickColor(): readonly [number, number, number] {
  const r = Math.random();
  if (r < 0.02) return VIOLET;
  if (r < 0.08) return CYAN;
  if (r < 0.28) return ELECTRIC_BLUE;
  return INDIGO;
}

/** ~75% tiny dots, ~18% medium dots, ~7% brighter dots - all plain round particles. */
function pickDepth(): Depth {
  const r = Math.random();
  if (r < 0.75) return "tiny";
  if (r < 0.93) return "medium";
  return "near";
}

function makeParticles(count: number): Particle[] {
  // Mostly uniform placement, with a minority of particles pulled softly
  // toward a few loose cluster centers so density reads as faintly organic
  // rather than perfectly even - never an obvious network shape. The
  // clusters are jittered across the whole unit square (including corners),
  // so no region of the viewport is systematically emptier than another.
  const clusters = Array.from({ length: 6 }, () => ({
    x: Math.random(),
    y: Math.random(),
  }));

  return Array.from({ length: count }, () => {
    const color = pickColor();
    const depth = pickDepth();
    const isColored = color !== INDIGO;
    const glow = isColored && depth !== "tiny";

    let size: number;
    let baseAlpha: number;
    let twinkleAmount: number;
    if (depth === "near") {
      size = 1.4 + Math.random() * 0.5;
      baseAlpha = 0.5 + Math.random() * 0.28;
      twinkleAmount = 0.32;
    } else if (depth === "medium") {
      size = 1.0 + Math.random() * 0.3;
      baseAlpha = 0.3 + Math.random() * 0.18;
      twinkleAmount = 0.3;
    } else {
      size = 0.6 + Math.random() * 0.3;
      baseAlpha = 0.16 + Math.random() * 0.16;
      twinkleAmount = 0.3;
    }

    let fx = Math.random();
    let fy = Math.random();
    if (Math.random() < 0.3) {
      const c = clusters[Math.floor(Math.random() * clusters.length)];
      fx = clamp01(fx * 0.45 + c.x * 0.55 + (Math.random() - 0.5) * 0.14);
      fy = clamp01(fy * 0.45 + c.y * 0.55 + (Math.random() - 0.5) * 0.14);
    }

    const cfg = DEPTH_CONFIG[depth];
    const jitterSweepAmp = () => Math.max(MIN_SWEEP_AMP, cfg.sweepAmp * (0.75 + Math.random() * 0.55));
    const jitterSweepSpeed = () => Math.max(MIN_SWEEP_SPEED, cfg.sweepSpeed * (0.75 + Math.random() * 0.55));
    const jitterWobbleAmp = () => Math.max(MIN_WOBBLE_AMP, cfg.wobbleAmp * (0.7 + Math.random() * 0.7));
    // Randomize spin direction too, so neighboring particles don't all orbit the same way.
    const jitterWobbleSpeed = () =>
      (Math.random() < 0.5 ? 1 : -1) * Math.max(MIN_WOBBLE_SPEED, cfg.wobbleSpeed * (0.75 + Math.random() * 0.6));

    return {
      fx,
      fy,
      x: 0,
      y: 0,
      size,
      baseAlpha,
      color,
      depth,
      glow,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.12 + Math.random() * 0.18,
      twinkleAmount,
      ambAmpX: jitterSweepAmp(),
      ambAmpY: jitterSweepAmp(),
      ambSpeedX: jitterSweepSpeed(),
      ambSpeedY: jitterSweepSpeed(),
      ambPhaseX: Math.random() * Math.PI * 2,
      ambPhaseY: Math.random() * Math.PI * 2,
      wobbleAmp: jitterWobbleAmp(),
      wobbleSpeed: jitterWobbleSpeed(),
      wobblePhase: Math.random() * Math.PI * 2,
      dispX: 0,
      dispY: 0,
      decayRadius: cfg.decayRadius,
      maxPush: cfg.maxPush,
      springEase: cfg.springEase,
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
    let prefersReduced = reducedMotionQuery.matches;

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

      // Density scales gently with viewport area but stays capped - this is
      // atmosphere, not a simulation, and mobile gets a sparser field.
      const target = mobile
        ? Math.min(700, Math.max(420, Math.floor((width * height) / 900)))
        : Math.min(2200, Math.max(1600, Math.floor((width * height) / 1100)));

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
          : 1 - p.twinkleAmount + p.twinkleAmount * (0.5 + 0.5 * Math.sin(elapsed * p.twinkleSpeed + p.twinklePhase));
        ctx.fillStyle = `rgba(${p.color.join(",")}, ${(p.baseAlpha * twinkle).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      ctx.shadowBlur = 4;
      for (const p of particles) {
        if (!p.glow) continue;
        const twinkle = prefersReduced
          ? 1
          : 1 - p.twinkleAmount + p.twinkleAmount * (0.5 + 0.5 * Math.sin(elapsed * p.twinkleSpeed + p.twinklePhase));
        const alpha = (p.baseAlpha * twinkle).toFixed(3);
        ctx.shadowColor = `rgba(${p.color.join(",")}, ${alpha})`;
        ctx.fillStyle = `rgba(${p.color.join(",")}, ${alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.shadowBlur = 0;
    }

    function tick() {
      elapsed += FRAME_MS / 1000;

      for (const p of particles) {
        // 1. Base position (fixed home fraction of the canvas).
        const baseX = p.fx * width;
        const baseY = p.fy * height;

        // 2. Ambient offset: a slow two-harmonic sweep (the organic loop) plus a
        //    fast constant-speed circular wobble layered on top. The wobble is a
        //    true orbit - one angle driving both cos and sin - so its speed is
        //    mathematically constant at every instant and can never dip near zero
        //    the way a sine-based term can at its peak. Every particle keeps
        //    visibly moving on every glance, unconditionally, regardless of the
        //    cursor or page state.
        const sweepX =
          (p.ambAmpX *
            (Math.sin(elapsed * p.ambSpeedX + p.ambPhaseX) +
              0.4 * Math.sin(elapsed * p.ambSpeedX * 2.1 + p.ambPhaseX * 1.3))) /
          1.4;
        const sweepY =
          (p.ambAmpY *
            (Math.cos(elapsed * p.ambSpeedY + p.ambPhaseY) +
              0.4 * Math.cos(elapsed * p.ambSpeedY * 2.1 + p.ambPhaseY * 1.3))) /
          1.4;
        const wobbleAngle = elapsed * p.wobbleSpeed + p.wobblePhase;
        const wobbleX = p.wobbleAmp * Math.cos(wobbleAngle);
        const wobbleY = p.wobbleAmp * Math.sin(wobbleAngle);

        const posX = baseX + sweepX + wobbleX;
        const posY = baseY + sweepY + wobbleY;

        // 3. Cursor displacement: continuous exponential falloff (no hard radius
        //    cutoff, so every particle is technically reachable), eased toward its
        //    target with its own spring - this is the only layer the cursor ever
        //    touches, and the only one that relaxes back to zero once it leaves.
        let targetDispX = 0;
        let targetDispY = 0;
        const dx = posX - pointerX;
        const dy = posY - pointerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.5) {
          const push = Math.exp(-dist / p.decayRadius) * p.maxPush;
          targetDispX = (dx / dist) * push;
          targetDispY = (dy / dist) * push;
        }
        p.dispX += (targetDispX - p.dispX) * p.springEase;
        p.dispY += (targetDispY - p.dispY) * p.springEase;

        p.x = posX + p.dispX;
        p.y = posY + p.dispY;
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

    // Pointer Events unify mouse, touch and pen on one path, but the magnetic
    // cursor-follow only makes sense for a real hovering pointer (mouse).
    // Touch has no meaningful "cursor" - a finger tap isn't hovering, it's a
    // press-and-release - so touch/pen input is ignored entirely here and the
    // field falls back to its always-on ambient drift alone. Mouse keeps its
    // continuous hover: position updates on every move, and only resets when
    // the cursor actually leaves the viewport (pointerleave). Every listener
    // here is passive and none of them touch touch-action, so page scrolling
    // is never intercepted.
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
    }

    function onPointerAway() {
      pointerX = -9999;
      pointerY = -9999;
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerType !== "mouse") onPointerAway();
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
          p.dispX = 0;
          p.dispY = 0;
          p.x = p.fx * width;
          p.y = p.fy * height;
        }
        draw();
      } else {
        start();
      }
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
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerAway, { passive: true });
    window.addEventListener("pointerleave", onPointerAway, { passive: true });

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerAway);
      window.removeEventListener("pointerleave", onPointerAway);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={ATMOSPHERE_STYLE} />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
