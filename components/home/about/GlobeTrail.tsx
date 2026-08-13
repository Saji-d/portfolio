"use client";

import { useEffect, useRef, type RefObject } from "react";

interface Point {
  x: number;
  y: number;
  t: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const MAX_POINTS = 42;
const MAX_SPARKS = 14;
const POINT_AGE_MS = 420;
const SPARK_LIFE = 450;

function hexToRgb(hex: string): Rgb | null {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  return null;
}

/**
 * Subtle cursor trail layered over the interactive globe. Canvas-only, fully
 * pointer-events-none, one rAF loop that shuts down the moment the pointer
 * leaves and the trail has drained. Uses the themed --accent token so it
 * adapts to dark/light without any hardcoded colors. Only ever mounts an
 * active loop on fine-pointer devices without reduced motion.
 */
export default function GlobeTrail({
  targetRef,
  overGlobeRef,
  anchorOffsetY = 0,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  /** True while the pointer is over the interactive globe — trail is suppressed there. */
  overGlobeRef: RefObject<boolean>;
  /** Shifts the tracked point down so the glow anchors at the rocket cursor's engine, not its nose. */
  anchorOffsetY?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const targetEl = targetRef.current;
    if (!canvasEl || !targetEl) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;

    const canvas = canvasEl;
    const target = targetEl;
    const ctx = ctxEl;

    let raf = 0;
    let pointerIn = false;
    let points: Point[] = [];
    const sparks: Spark[] = [];
    let alpha = 0;
    let lightTheme =
      document.documentElement.getAttribute("data-theme") === "light";

    const readAccent = (): Rgb => {
      const cs = getComputedStyle(document.documentElement);
      return hexToRgb(cs.getPropertyValue("--accent").trim()) ?? { r: 79, g: 209, b: 197 };
    };
    let accent = readAccent();

    const themeObserver = new MutationObserver(() => {
      accent = readAccent();
      lightTheme =
        document.documentElement.getAttribute("data-theme") === "light";
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = target.clientWidth;
      const h = target.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(target);

    function onEnter() {
      pointerIn = true;
      start();
    }

    function onLeave() {
      pointerIn = false;
    }

    function onMove(e: PointerEvent) {
      const rect = target.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), target.clientWidth);
      const y =
        Math.min(Math.max(e.clientY - rect.top, 0), target.clientHeight) +
        anchorOffsetY;
      if (!overGlobeRef.current) {
        const now = performance.now();
        points.push({ x, y, t: now });
        if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);
      }
      start();
    }

    function stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function frame() {
      raf = 0;
      const now = performance.now();
      // "Active" excludes hovering the globe itself, even while still
      // physically inside the card — no exhaust glow lingers there.
      const active = pointerIn && !overGlobeRef.current;
      const targetAlpha = active ? (lightTheme ? 0.42 : 0.55) : 0;
      alpha += (targetAlpha - alpha) * 0.12;

      if (active) {
        points = points.filter((p) => now - p.t < POINT_AGE_MS);
      } else if (points.length) {
        points.shift();
      }

      ctx.clearRect(0, 0, target.clientWidth, target.clientHeight);

      if (points.length >= 2 && alpha > 0.02) {
        // The rocket cursor itself is painted natively (zero latency); this
        // canvas only knows where the pointer was as of the last recorded
        // sample, which by the time this frame paints is already stale by
        // roughly one frame. Extrapolate the flame's tip along its recent
        // velocity to close that gap instead of visibly trailing behind it.
        const rawHead = points[points.length - 1];
        const prev = points[points.length - 2];
        const dt = Math.max(1, rawHead.t - prev.t);
        const vx = (rawHead.x - prev.x) / dt;
        const vy = (rawHead.y - prev.y) / dt;
        const lookahead = Math.min(now - rawHead.t, 48);
        const head = {
          x: rawHead.x + vx * lookahead,
          y: rawHead.y + vy * lookahead,
        };
        const tail = points[0];
        const a = alpha;

        const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        grad.addColorStop(0, `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0)`);
        grad.addColorStop(1, `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${0.5 * a})`);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const mx = (points[i].x + points[i + 1].x) / 2;
          const my = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
        }
        ctx.lineTo(head.x, head.y);
        ctx.stroke();

        const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 18);
        glow.addColorStop(0, `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${0.32 * a})`);
        glow.addColorStop(1, `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${0.7 * a})`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        if (sparks.length < MAX_SPARKS && Math.random() < 0.22) {
          sparks.push({
            x: head.x,
            y: head.y,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.3,
            life: 0,
            max: SPARK_LIFE + Math.random() * 350,
          });
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 16;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        if (s.life >= s.max) {
          sparks.splice(i, 1);
          continue;
        }
        const p = 1 - s.life / s.max;
        ctx.fillStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${0.26 * p * alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.1 * p + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      const drained = !active && points.length === 0 && sparks.length === 0;
      if ((drained || alpha < 0.01) && !active) {
        ctx.clearRect(0, 0, target.clientWidth, target.clientHeight);
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);

    return () => {
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      themeObserver.disconnect();
      stop();
    };
  }, [targetRef, overGlobeRef, anchorOffsetY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}
