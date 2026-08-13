"use client";

import { useEffect, useRef } from "react";

interface HeroCoreProps {
  className?: string;
}

interface RingConfig {
  /** Ring radius as a fraction of min(width, height) / 2. */
  fraction: number;
  /** How much rx/ry diverge from a perfect circle. */
  eccentricity: number;
  color: readonly [number, number, number];
  /** Seconds per full revolution. */
  period: number;
  /** Base stroke alpha. */
  alpha: number;
  /** Starting phase angle (radians) for each traveling node on this ring. */
  nodeAngles: number[];
}

interface Particle {
  sx: number;
  sy: number;
  ctrlX: number;
  ctrlY: number;
  ex: number;
  ey: number;
  t: number;
  /** Seconds to complete the arc. */
  duration: number;
}

interface Mote {
  /** Position as a fraction of canvas width/height, so it re-lands
      correctly after a resize without needing to be regenerated. */
  fx: number;
  fy: number;
  size: number;
  phase: number;
  speed: number;
  color: readonly [number, number, number];
}

const MOTE_COUNT = 46;

// Reused from NetworkBackground.tsx so the core's palette matches the rest
// of the page exactly. Cool indigo-gray reads as the neutral field; the
// indigo accent is reserved for the middle ring, the core's outer fade, and
// a scattering of motes — the one place the Hero leans into the signature.
const ACCENT = [140, 143, 189] as const;
const ACCENT_2 = [99, 102, 241] as const;

const FRAME_MS = 33;
const BREATHE_PERIOD = 7; // seconds, gentle ambient breathing
const MAX_PARTICLES = 5;
const TRAIL_COUNT = 5;
const TRAIL_STEP_SEC = 0.1;
const NODE_RADIUS = 2.6;
const NODE_ALPHA = 0.85;

const RINGS: RingConfig[] = [
  { fraction: 0.55, eccentricity: 0.06, color: ACCENT, period: 19, alpha: 0.2, nodeAngles: [0.4] },
  { fraction: 0.72, eccentricity: 0.1, color: ACCENT_2, period: 34, alpha: 0.17, nodeAngles: [1.2, 4.1] },
  { fraction: 0.92, eccentricity: 0.14, color: ACCENT, period: 52, alpha: 0.13, nodeAngles: [2.6] },
];

function ringRadii(halfMin: number, ring: RingConfig): [number, number] {
  const r = halfMin * ring.fraction;
  return [r * (1 + ring.eccentricity), r * (1 - ring.eccentricity)];
}

export default function HeroCore({ className }: HeroCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = reducedMotion.matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    let pageHidden = false;
    let lastDraw = 0;

    let elapsedSec = 0;
    let focus = 0; // 0..1, eases toward 1 when the pointer rests near the core
    let pointerX = -9999;
    let pointerY = -9999;

    let particles: Particle[] = [];
    let spawnCooldown = 1.5 + Math.random() * 1.5;

    // A quiet field of drifting motes across the whole box — distant
    // "data dust" that gives the core atmospheric depth without adding
    // more foreground motion. Positions are stored as fractions so they
    // stay correctly distributed after a resize.
    const motes: Mote[] = Array.from({ length: MOTE_COUNT }, () => ({
      fx: Math.random(),
      fy: Math.random(),
      size: 0.5 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.25,
      color: Math.random() < 0.7 ? ACCENT : ACCENT_2,
    }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnParticle() {
      if (particles.length >= MAX_PARTICLES) return;
      const cx = width / 2;
      const cy = height / 2;
      const halfMin = Math.min(width, height) / 2;

      const startAngle = Math.random() * Math.PI * 2;
      const startR = halfMin * (0.08 + Math.random() * 0.1);
      const sx = cx + Math.cos(startAngle) * startR;
      const sy = cy + Math.sin(startAngle) * startR;

      // Land near one of the canvas edges, pulled in slightly so the fade
      // finishes just before the particle would touch the boundary.
      const edge = Math.floor(Math.random() * 4);
      let ex: number;
      let ey: number;
      if (edge === 0) {
        ex = Math.random() * width;
        ey = 0;
      } else if (edge === 1) {
        ex = width;
        ey = Math.random() * height;
      } else if (edge === 2) {
        ex = Math.random() * width;
        ey = height;
      } else {
        ex = 0;
        ey = Math.random() * height;
      }
      ex = cx + (ex - cx) * 0.92;
      ey = cy + (ey - cy) * 0.92;

      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2;
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.hypot(dx, dy) || 1;
      const bend = (Math.random() - 0.5) * 0.6 * len;
      const ctrlX = mx + (-dy / len) * bend;
      const ctrlY = my + (dx / len) * bend;

      particles.push({
        sx,
        sy,
        ctrlX,
        ctrlY,
        ex,
        ey,
        t: 0,
        duration: 1.5 + Math.random() * 1,
      });
    }

    function drawCoreGlow(cx: number, cy: number, halfMin: number) {
      const breathe = Math.sin((elapsedSec / BREATHE_PERIOD) * Math.PI * 2);
      const radius = halfMin * 0.42 * (1 + 0.035 * breathe);
      const alphaMul = (1 + 0.22 * focus) * (1 + 0.05 * breathe);

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      // Dim inner core (leaves room for the portrait layered on top by CSS),
      // rising to a bright ring around mid-radius, fading to indigo at the edge.
      gradient.addColorStop(0, `rgba(${ACCENT.join(",")}, ${(0.05 * alphaMul).toFixed(3)})`);
      gradient.addColorStop(0.15, `rgba(${ACCENT.join(",")}, ${(0.07 * alphaMul).toFixed(3)})`);
      gradient.addColorStop(0.45, `rgba(${ACCENT.join(",")}, ${(0.3 * alphaMul).toFixed(3)})`);
      gradient.addColorStop(0.72, `rgba(${ACCENT_2.join(",")}, ${(0.16 * alphaMul).toFixed(3)})`);
      gradient.addColorStop(1, `rgba(${ACCENT_2.join(",")}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawRing(ring: RingConfig, cx: number, cy: number, halfMin: number) {
      const [rx, ry] = ringRadii(halfMin, ring);
      const focusMul = 1 + 0.25 * focus;

      ctx.strokeStyle = `rgba(${ring.color.join(",")}, ${(ring.alpha * focusMul).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      const angularSpeed = (Math.PI * 2) / ring.period;
      for (const startAngle of ring.nodeAngles) {
        const angle = startAngle + elapsedSec * angularSpeed;
        for (let k = 0; k < TRAIL_COUNT; k++) {
          const a = angle - k * angularSpeed * TRAIL_STEP_SEC;
          const x = cx + rx * Math.cos(a);
          const y = cy + ry * Math.sin(a);
          const fade = 1 - k / TRAIL_COUNT;
          ctx.fillStyle = `rgba(${ring.color.join(",")}, ${(NODE_ALPHA * fade * focusMul).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, NODE_RADIUS * (1 - 0.35 * (k / TRAIL_COUNT)), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawMotes() {
      // Kept out of the exact center (where the portrait sits) so they
      // never compete with it — only visible in the ring/edge region.
      const cx = width / 2;
      const cy = height / 2;
      const innerGuard = Math.min(width, height) * 0.2;
      for (const m of motes) {
        const x = m.fx * width;
        const y = m.fy * height;
        if ((x - cx) ** 2 + (y - cy) ** 2 < innerGuard * innerGuard) continue;
        const twinkle = 0.5 + 0.5 * Math.sin(elapsedSec * m.speed + m.phase);
        const alpha = 0.08 + 0.14 * twinkle;
        ctx.beginPath();
        ctx.arc(x, y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.color.join(",")}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    function drawParticles() {
      for (const p of particles) {
        const t = p.t;
        const it = 1 - t;
        const x = it * it * p.sx + 2 * it * t * p.ctrlX + t * t * p.ex;
        const y = it * it * p.sy + 2 * it * t * p.ctrlY + t * t * p.ey;
        const fade = t < 0.15 ? t / 0.15 : Math.max(0, 1 - (t - 0.15) / 0.85);

        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT.join(",")}, ${(0.75 * fade).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT.join(",")}, ${(0.18 * fade).toFixed(3)})`;
        ctx.fill();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const halfMin = Math.min(width, height) / 2;

      drawMotes();
      drawCoreGlow(cx, cy, halfMin);
      for (const ring of RINGS) {
        drawRing(ring, cx, cy, halfMin);
      }
      drawParticles();
    }

    function tick(dtMs: number) {
      const dt = dtMs / 1000;
      elapsedSec += dt;

      const cx = width / 2;
      const cy = height / 2;
      const halfDiagonal = Math.hypot(width / 2, height / 2);
      const focusThreshold = halfDiagonal * 0.55;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const near = finePointer && dx * dx + dy * dy < focusThreshold * focusThreshold;
      focus += ((near ? 1 : 0) - focus) * 0.08;

      for (const p of particles) {
        p.t += dt / p.duration;
      }
      particles = particles.filter((p) => p.t < 1);

      spawnCooldown -= dt;
      if (spawnCooldown <= 0) {
        spawnParticle();
        spawnCooldown = 1.5 + Math.random() * 1.5;
      }
    }

    function start() {
      if (running || prefersReduced || !visible || pageHidden) return;
      running = true;
      lastDraw = 0;
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    }

    function sync() {
      if (prefersReduced) {
        stop();
        draw();
      } else {
        stop();
        start();
      }
    }

    function loop(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - lastDraw < FRAME_MS) return;
      const dt = lastDraw ? now - lastDraw : FRAME_MS;
      lastDraw = now;
      tick(dt);
      draw();
    }

    function onVisibility() {
      pageHidden = document.hidden;
      sync();
    }

    function onResize() {
      resize();
      if (prefersReduced) draw();
    }

    function onMotionChange(event: MediaQueryListEvent) {
      prefersReduced = event.matches;
      sync();
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    }

    function onPointerLeave() {
      pointerX = -9999;
      pointerY = -9999;
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0 }
    );

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (prefersReduced) draw();
    });

    resize();
    intersectionObserver.observe(canvasEl);
    resizeObserver.observe(canvasEl);

    // No idle-timeout pause here (unlike NetworkBackground's full-page
    // field): this canvas is small and only ever mounted inside the Hero,
    // so the IntersectionObserver + visibilitychange checks already stop
    // the loop whenever it can't be seen. An extra idle timer would just
    // add complexity without a meaningful CPU/battery win.
    if (prefersReduced) {
      draw();
    } else {
      start();
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionChange);
    if (finePointer) {
      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    return () => {
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
      if (finePointer) {
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-auto block h-full w-full ${className ?? ""}`}
    />
  );
}
