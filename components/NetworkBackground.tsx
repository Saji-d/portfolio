"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
}

const ACCENT = "79, 209, 197";
const ACCENT_2 = "124, 125, 255";
const FRAME_MS = 33;

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

    let nodes: Node[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let pageHidden = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastDraw = 0;
    let range = 150;
    let rangeSq = range * range;

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
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < rangeSq) {
            const alpha = (1 - Math.sqrt(distSq) / range) * 0.14;
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
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
        const glow = 0.35 + 0.3 * Math.sin(n.pulse);
        ctx.fillStyle = `rgba(${ACCENT_2}, ${glow * 0.8})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
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

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0 }
    );

    resize();
    observer.observe(canvasEl);
    if (prefersReduced) {
      draw();
    } else {
      start();
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  );
}
