"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
  // Small, eased pointer-repel displacement layered on top of the node's
  // natural drift position (see tick()). Stays at 0,0 whenever the pointer
  // is far away or on touch devices.
  ox: number;
  oy: number;
}

interface FarNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
}

interface Signal {
  from: number;
  to: number;
  t: number;
  speed: number;
}

const ACCENT = [79, 209, 197] as const;
const ACCENT_2 = [124, 125, 255] as const;
const FRAME_MS = 33;
const FOCUS_RADIUS = 170;
const FOCUS_RADIUS_SQ = FOCUS_RADIUS * FOCUS_RADIUS;
const MAX_SIGNALS = 4;
// Reuses FOCUS_RADIUS so the same neighborhood that glows brighter near the
// pointer also gets the gentle repel nudge, one coherent "focus" concept
// instead of a second tunable radius. Displacement is capped tiny on
// purpose, this should read as a quiet reaction, not a force field.
const MAX_POINTER_OFFSET = 6;
const POINTER_OFFSET_EASE = 0.04;

// Sections lean the node glow color toward teal (0) or violet (1) — a
// deliberately subtle "the system's telemetry shifts with context" cue,
// not a theme change. 0.5 is the neutral/default mix.
const SECTION_MIX: Record<string, number> = {
  research: 0.72,
  experience: 0.3,
  contact: 0.22,
};

function mixColor(mix: number): string {
  const r = Math.round(ACCENT[0] + (ACCENT_2[0] - ACCENT[0]) * mix);
  const g = Math.round(ACCENT[1] + (ACCENT_2[1] - ACCENT[1]) * mix);
  const b = Math.round(ACCENT[2] + (ACCENT_2[2] - ACCENT[2]) * mix);
  return `${r}, ${g}, ${b}`;
}

export default function NetworkBackground() {
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

    let nodes: Node[] = [];
    let farNodes: FarNode[] = [];
    let signals: Signal[] = [];
    let scrollY = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let pageHidden = false;
    let idleTimer = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastDraw = 0;
    let range = 150;
    let rangeSq = range * range;
    let pointerX = -9999;
    let pointerY = -9999;
    let mix = 0.5;
    let signalCooldown = 0;

    function resize() {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const mobile = nextWidth < 768;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      range = mobile ? 120 : 150;
      rangeSq = range * range;
      const target = Math.min(64, Math.max(26, Math.floor((width * height) / 40000)));
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        pulse: Math.random() * 100,
        ox: 0,
        oy: 0,
      }));
      signals = [];

      // A second, sparser population — bigger, dimmer, far slower, no
      // connecting lines — read as sitting further back than the main
      // field. Combined with a scroll-linked offset below, this is what
      // actually gives the background depth rather than one flat layer.
      const farTarget = mobile ? 6 : Math.min(16, Math.max(9, Math.floor(target / 4)));
      farNodes = Array.from({ length: farTarget }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        r: 2 + Math.random() * 2.5,
        pulse: Math.random() * 100,
      }));
    }

    function targetMix(): number {
      const section = document.documentElement.dataset.section;
      const mix = section ? SECTION_MIX[section] : undefined;
      return mix ?? 0.5;
    }

    function spawnSignal() {
      if (signals.length >= MAX_SIGNALS || nodes.length < 2) return;
      // Pick a node and one of its currently-close neighbors so the pulse
      // always travels along a line that's actually being drawn.
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const from = nodes[fromIdx];
      let closest = -1;
      let closestDist = rangeSq;
      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIdx) continue;
        const dx = nodes[i].x - from.x;
        const dy = nodes[i].y - from.y;
        const d = dx * dx + dy * dy;
        if (d < closestDist) {
          closestDist = d;
          closest = i;
        }
      }
      if (closest === -1) return;
      signals.push({ from: fromIdx, to: closest, t: 0, speed: 0.012 + Math.random() * 0.01 });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const color = mixColor(mix);

      // Far layer first, so the near field draws on top of it. The parallax
      // offset is small and wraps modulo the viewport height, so it reads as
      // gentle drift rather than the layer ever visibly resetting.
      const parallax = scrollY * 0.03;
      for (const n of farNodes) {
        const y = ((n.y - parallax) % height + height) % height;
        n.pulse += 0.012;
        const glow = 0.25 + 0.2 * Math.sin(n.pulse);
        ctx.fillStyle = `rgba(${color}, ${(glow * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, y, n.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${color}, ${(glow * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < rangeSq) {
            let alpha = (1 - Math.sqrt(distSq) / range) * 0.14;
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const pdx = midX - pointerX;
            const pdy = midY - pointerY;
            if (pdx * pdx + pdy * pdy < FOCUS_RADIUS_SQ) {
              alpha *= 1.9;
            }
            ctx.strokeStyle = `rgba(${ACCENT.join(",")}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        n.pulse += 0.03;
        let glow = 0.35 + 0.3 * Math.sin(n.pulse);
        const pdx = n.x - pointerX;
        const pdy = n.y - pointerY;
        const near = pdx * pdx + pdy * pdy < FOCUS_RADIUS_SQ;
        if (near) glow = Math.min(1, glow + 0.55);
        ctx.fillStyle = `rgba(${color}, ${glow * 0.8})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.1 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of signals) {
        const from = nodes[s.from];
        const to = nodes[s.to];
        if (!from || !to) continue;
        const x = from.x + (to.x - from.x) * s.t;
        const y = from.y + (to.y - from.y) * s.t;
        const fade = Math.sin(Math.PI * s.t);
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${0.7 * fade})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${0.18 * fade})`;
        ctx.fill();
      }
    }

    function tick() {
      for (const n of nodes) {
        if (finePointer) {
          // Undo last frame's pointer nudge first so wall-bounce and drift
          // below act on the node's natural wandering position, not the
          // displaced one. The nudge itself is re-applied after.
          n.x -= n.ox;
          n.y -= n.oy;
        }

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (finePointer) {
          let targetOx = 0;
          let targetOy = 0;
          const dx = n.x - pointerX;
          const dy = n.y - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < FOCUS_RADIUS_SQ && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const strength = (1 - dist / FOCUS_RADIUS) * MAX_POINTER_OFFSET;
            targetOx = (dx / dist) * strength;
            targetOy = (dy / dist) * strength;
          }
          // Ease toward the target displacement (or back to 0,0 once the
          // pointer moves away) instead of snapping, so the reaction reads
          // as a soft settle rather than a jump.
          n.ox += (targetOx - n.ox) * POINTER_OFFSET_EASE;
          n.oy += (targetOy - n.oy) * POINTER_OFFSET_EASE;
          n.x += n.ox;
          n.y += n.oy;
        }
      }
      for (const n of farNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      signals = signals.filter((s) => {
        s.t += s.speed;
        return s.t < 1;
      });
      signalCooldown -= 1;
      if (signalCooldown <= 0) {
        spawnSignal();
        signalCooldown = 40 + Math.floor(Math.random() * 40);
      }
      mix += (targetMix() - mix) * 0.02;
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
      lastDraw = now;
      tick();
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

    function onActivity() {
      scrollY = window.scrollY;
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        stop();
        draw();
      }, 4000);
      start();
    }

    function onPointerMove(e: PointerEvent) {
      if (finePointer) {
        pointerX = e.clientX;
        pointerY = e.clientY;
      }
      onActivity();
    }

    function onPointerLeave() {
      pointerX = -9999;
      pointerY = -9999;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0 }
    );

    resize();
    scrollY = window.scrollY;
    observer.observe(canvasEl);
    if (prefersReduced) {
      draw();
    } else {
      start();
    }
    idleTimer = window.setTimeout(() => {
      stop();
      draw();
    }, 4000);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onActivity, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("keydown", onActivity, { passive: true });
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      clearTimeout(idleTimer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("keydown", onActivity);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="network-canvas pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  );
}
