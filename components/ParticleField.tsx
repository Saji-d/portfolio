"use client";

import { useEffect, useRef } from "react";

/**
 * The single background system for the whole site: a deep-space starfield
 * that the viewer appears to be flying through.
 *
 * One viewport-fixed canvas sits at z-0 behind all page content and never
 * varies by scroll position or section, so the stars read as a single
 * continuous universe behind the whole portfolio rather than one that
 * restarts per-section.
 *
 * Star population is layered by depth and pushed along ONE coherent drift
 * vector (right / slightly upward, like the craft is ascending through
 * space). Every star keeps its own random size, brightness, tint, twinkle
 * and speed, but the speed is scaled by depth so the field gets a real
 * parallax feel: distant stars crawl, foreground stars stream past. When a
 * star exits an edge it is recycled from the opposite edge, so the field
 * never ends and never bounces.
 *
 * Rare shooting stars occasionally streak diagonally on top of the field
 * (roughly one every 8-20s, randomized), drawn as a glowing gradient head
 * with a blurred, fading tail so they read as meteor streaks - not CSS lines.
 * Only one is ever active at a time.
 *
 * There is no cursor/pointer interaction anywhere in this file - every star
 * moves purely on its own simulated trajectory.
 *
 * The existing nebula/atmosphere wash (rendered as a sibling layer above the
 * canvas) stays the dominant atmospheric element; the stars only add depth
 * and motion around it. No grid, no connectors, no UI-particle glow.
 *
 * Performance: everything is drawn as fillRect calls on one canvas (no React
 * elements per star), RAF is gated to ~60fps and to the page-hidden state,
 * the draw is throttled by FRAME_MS, reduced-motion renders one static
 * frame with zero motion, and mobile gets a sparser, lower-DPI field.
 */

type Depth = "distant" | "mid" | "near" | "bright" | "giant";

interface Star {
  /** Home position as a fraction of the canvas, so it re-lands after a resize. */
  fx: number;
  fy: number;
  size: number;
  baseAlpha: number;
  color: readonly [number, number, number];
  depth: Depth;
  glow: boolean;
  twPhase: number;
  twSpeed: number;
  twAmount: number;
  /** Per-star forward speed in px/s - scaled by depth, jittered per star. */
  speed: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  dur: number;
  age: number;
}

const WHITE = [226, 232, 240] as const;
const BONE = [203, 213, 225] as const;
const INDIGO = [129, 140, 248] as const;
const ELECTRIC_BLUE = [96, 165, 250] as const;
const CYAN = [34, 211, 238] as const;
const VIOLET = [168, 85, 247] as const;

/** The one coherent drift direction (normalized). Mostly to the right, gently
 *  upward - the viewer feels like they are ascending through space. Every star
 *  shares this direction; only magnitude (speed) differs by depth. */
const DRIFT = { x: 0.94, y: -0.34 };

/** Target speed (px/s) per depth, plus size / alpha / parallax ranges that get
 *  jittered per star in makeStars(). */
const DEPTH: Record<
  Depth,
  { speed: number; speedJitter: number; sizeMin: number; sizeMax: number; alphaMin: number; alphaMax: number }
> = {
  distant: { speed: 4, speedJitter: 2.5, sizeMin: 0.5, sizeMax: 0.9, alphaMin: 0.1, alphaMax: 0.28 },
  mid: { speed: 9, speedJitter: 4, sizeMin: 0.85, sizeMax: 1.3, alphaMin: 0.25, alphaMax: 0.5 },
  near: { speed: 16, speedJitter: 7, sizeMin: 1.2, sizeMax: 1.8, alphaMin: 0.4, alphaMax: 0.72 },
  bright: { speed: 24, speedJitter: 9, sizeMin: 1.6, sizeMax: 2.3, alphaMin: 0.55, alphaMax: 0.85 },
  giant: { speed: 34, speedJitter: 12, sizeMin: 2.2, sizeMax: 3.2, alphaMin: 0.6, alphaMax: 0.95 },
};

/** Rough natural distribution: most stars tiny/dim in the far field, fewer as
 *  we get brighter/foreground, and only a handful of large foreground stars. */
function pickDepth(): Depth {
  const r = Math.random();
  if (r < 0.62) return "distant";
  if (r < 0.84) return "mid";
  if (r < 0.94) return "near";
  if (r < 0.99) return "bright";
  return "giant";
}

/** Mostly warm-white with a light blue cast (natural starlight), with a small
 *  minority pulled toward the site's accent tints (indigo / electric blue /
 *  cyan / violet) so the field echoes the nebula without shouting. */
function pickColor(): readonly [number, number, number] {
  const r = Math.random();
  if (r < 0.015) return VIOLET;
  if (r < 0.05) return CYAN;
  if (r < 0.14) return ELECTRIC_BLUE;
  if (r < 0.3) return INDIGO;
  if (r < 0.6) return BONE;
  return WHITE;
}

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => {
    const depth = pickDepth();
    const color = pickColor();
    const cfg = DEPTH[depth];
    const isTinted = color === CYAN || color === VIOLET || color === ELECTRIC_BLUE || color === INDIGO;
    // Glow only on the brighter/foreground tiers and on tinted stars (a halo
    // on every dim background dot would flatten the depth cue). Kept to a
    // small subset so the shadowBlur pass stays cheap.
    const glow = depth === "bright" || depth === "giant" || depth === "near" || (isTinted && depth !== "distant");

    return {
      fx: Math.random(),
      fy: Math.random(),
      size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
      baseAlpha: cfg.alphaMin + Math.random() * (cfg.alphaMax - cfg.alphaMin),
      color,
      depth,
      glow,
      twPhase: Math.random() * Math.PI * 2,
      twSpeed: 0.5 + Math.random() * 1.6,
      twAmount: 0.25 + Math.random() * 0.4,
      speed: Math.max(0.5, cfg.speed + (Math.random() - 0.5) * cfg.speedJitter),
    };
  });
}

const FRAME_MS = 16;

/** A multi-tone color wash - indigo / electric blue / cyan pooling toward a
 *  few corners, plus a soft violet dust patch - so the canvas reads as a
 *  living nebula behind the stars. Every stop stays extremely low-alpha on
 *  purpose: this is meant to read as atmosphere, not a literal galaxy photo.
 *  Rendered as a sibling div above the canvas so it stays the dominant
 *  atmospheric element regardless of what's drawn beneath it. */
const ATMOSPHERE_STYLE = {
  backgroundImage: [
    "radial-gradient(60% 60% at 18% 15%, rgba(99,102,241,0.055), transparent 70%)",
    "radial-gradient(55% 55% at 78% 30%, rgba(59,130,246,0.035), transparent 72%)",
    "radial-gradient(65% 65% at 85% 88%, rgba(34,211,238,0.03), transparent 70%)",
    "radial-gradient(70% 70% at 40% 75%, rgba(139,92,246,0.03), transparent 74%)",
  ].join(","),
};

/** Shooting-star cadence (ms) between the end of one meteor and the next. */
const METEOR_MIN_DELAY = 8000;
const METEOR_MAX_DELAY = 20000;
const METEOR_SPEED_MIN = 850;
const METEOR_SPEED_MAX = 1300;
const METEOR_ANGLE = (38 * Math.PI) / 180; // travel down-right, moderately steep

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
    let stars: Star[] = [];
    let elapsed = 0;
    let raf = 0;
    let lastDraw = 0;
    let running = false;
    let pageHidden = false;

    // Shooting stars.
    let meteor: Meteor | null = null;
    let meteorArmed = true;
    let nextMeteorAt = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      mobile = width < 768;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Noticeably denser than the old field. Scales with area but stays
      // capped; mobile gets a sparser, cheaper field.
      const target = mobile
        ? Math.min(720, Math.max(460, Math.floor((width * height) / 500)))
        : Math.min(3600, Math.max(2100, Math.floor((width * height) / 620)));

      stars = makeStars(target);
    }

    function starAlpha(s: Star, staticFrame: boolean): number {
      if (staticFrame) return s.baseAlpha;
      const twinkle = 1 - s.twAmount + s.twAmount * (0.5 + 0.5 * Math.sin(elapsed * s.twSpeed + s.twPhase));
      return s.baseAlpha * twinkle;
    }

    function drawStars(staticFrame: boolean) {
      ctx.shadowBlur = 0;
      for (const s of stars) {
        if (s.glow) continue;
        const a = starAlpha(s, staticFrame).toFixed(3);
        ctx.fillStyle = `rgba(${s.color.join(",")}, ${a})`;
        ctx.fillRect(s.fx * width, s.fy * height, s.size, s.size);
      }
      ctx.shadowBlur = 4;
      for (const s of stars) {
        if (!s.glow) continue;
        const a = starAlpha(s, staticFrame).toFixed(3);
        ctx.shadowColor = `rgba(${s.color.join(",")}, ${a})`;
        ctx.fillStyle = `rgba(${s.color.join(",")}, ${a})`;
        ctx.fillRect(s.fx * width, s.fy * height, s.size, s.size);
      }
      ctx.shadowBlur = 0;
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      drawStars(true);
    }

    function stepStars(dt: number) {
      const vx = DRIFT.x;
      const vy = DRIFT.y;
      for (const s of stars) {
        // Advance by per-star speed in the shared drift direction, then recycle
        // from the opposite edge so the field never ends / never bounces.
        s.fx += (vx * s.speed * dt) / width;
        s.fy += (vy * s.speed * dt) / height;
        if (s.fx < 0) s.fx += 1;
        else if (s.fx >= 1) s.fx -= 1;
        if (s.fy < 0) s.fy += 1;
        else if (s.fy >= 1) s.fy -= 1;
      }
    }

    function earlyMeteor() {
      meteor = null;
      meteorArmed = true;
      // Randomized wait before the next meteor can appear (8-20s).
      nextMeteorAt = elapsed + (METEOR_MIN_DELAY + Math.random() * (METEOR_MAX_DELAY - METEOR_MIN_DELAY)) / 1000;
    }

    function spawnMeteor() {
      if (!meteorArmed) return;
      // Random side and vertical start so meteors come from varied skies.
      const fromLeft = Math.random() < 0.5;
      const speed = METEOR_SPEED_MIN + Math.random() * (METEOR_SPEED_MAX - METEOR_SPEED_MIN);
      const vx = (fromLeft ? 1 : -1) * speed * Math.cos(METEOR_ANGLE);
      const vy = (fromLeft ? 1 : -1) * speed * Math.sin(METEOR_ANGLE);
      const enterX = fromLeft ? -80 : width + 80;
      const enterY = Math.random() * height * 0.55;
      // Crossing time: full diagonal (viewport plus exit margins) so it visibly
      // clears the screen before the next meteor is scheduled.
      const crossing = width + 320;
      const dist = crossing / Math.cos(METEOR_ANGLE);
      meteor = {
        x: enterX,
        y: enterY,
        vx,
        vy,
        len: 90 + Math.random() * 70,
        dur: Math.max(0.8, dist / speed),
        age: 0,
      };
      meteorArmed = false;
    }

    function drawMeteor(m: Meteor) {
      const fadeIn = Math.min(1, m.age / 0.12);
      const fadeOut = Math.min(1, (m.dur - m.age) / 0.25);
      const alpha = Math.max(0, Math.min(fadeIn, fadeOut));

      // Tail extends opposite the travel direction.
      const tx = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.len;
      const ty = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.len;

      const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
      grad.addColorStop(0, `rgba(148, 197, 255, 0)`);
      grad.addColorStop(0.55, `rgba(190, 227, 255, ${0.28 * alpha})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${0.85 * alpha})`);

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      // Luminous head.
      ctx.shadowColor = `rgba(210, 235, 255, ${0.9 * alpha})`;
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick(dt: number) {
      elapsed += dt;
      stepStars(dt);

      if (meteor) {
        meteor.age += dt;
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        if (meteor.age >= meteor.dur) earlyMeteor();
      } else if (meteorArmed && elapsed >= nextMeteorAt) {
        spawnMeteor();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      drawStars(false);
      // Shooting stars render on top of the field.
      if (meteor) drawMeteor(meteor);
    }

    function loop(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - lastDraw < FRAME_MS) return;
      const dt = (now - lastDraw) / 1000;
      lastDraw = now;
      tick(Math.min(dt, 0.1));
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
      if (prefersReduced) drawStatic();
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
        meteor = null;
        drawStatic();
      } else {
        elapsed = 0;
        nextMeteorAt = 0.5;
        meteorArmed = true;
        if (!pageHidden) start();
      }
    }

    resize();
    if (prefersReduced) {
      drawStatic();
    } else {
      nextMeteorAt = 0.5; // first meteor comes reasonably soon after load
      start();
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={ATMOSPHERE_STYLE} />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
