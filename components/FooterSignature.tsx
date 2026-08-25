"use client";

import { useEffect, useRef } from "react";

/**
 * A dot-matrix rendering of the site owner's name, sized to the footer's
 * width. Same physics family as ParticleField.tsx (spring-eased cursor
 * displacement with continuous exponential falloff, never a hard radius
 * cutoff) reused deliberately so the interaction feels like the same hand
 * built both, rather than a one-off bolted onto the footer. Letters are
 * sampled from an offscreen text render into a dot grid, not drawn as DOM
 * text - only the sampled dots ever render.
 */

const TEXT = "SAJIDUR RAHMAN SAJID";
const DOT_PITCH = 4.4; // CSS px between grid samples at REFERENCE_FONT_PX - scales up with the actual rendered size so the halftone stays a dot texture instead of filling in solid at large sizes
const DOT_SIZE = 1.6;
const REFERENCE_FONT_PX = 90; // the font size DOT_PITCH/DOT_SIZE were tuned at
const MIN_FONT_PX = 30; // below this, wrap to more lines instead of shrinking further
const MAX_FONT_PX = 192; // 12rem ceiling - an editorial signature, not an ultra-wide-monitor curiosity
const MAX_LINES = 3;

const BASE_COLOR = [148, 163, 210] as const; // muted indigo-grey, matches --text-muted's hue family
const NEAR_COLOR_A = [96, 165, 250] as const; // accent (electric blue)
const NEAR_COLOR_B = [168, 85, 247] as const; // accent-2 (violet)

interface Dot {
  fx: number;
  fy: number;
  x: number;
  y: number;
  dispX: number;
  dispY: number;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, fontFamily: string, maxWidth: number) {
  // Picks the largest font size (down to MIN_FONT_PX) that fits the full
  // string on one line; if even MIN_FONT_PX doesn't fit, greedily wraps
  // words across up to MAX_LINES instead of shrinking type past legibility.
  const measure = (str: string, size: number) => {
    ctx.font = `700 ${size}px ${fontFamily}`;
    return ctx.measureText(str).width;
  };

  let fontSize = MAX_FONT_PX;
  while (fontSize > MIN_FONT_PX && measure(text, fontSize) > maxWidth) fontSize -= 2;

  if (measure(text, fontSize) <= maxWidth) {
    return { fontSize, lines: [text] };
  }

  fontSize = 96;
  for (; fontSize > MIN_FONT_PX; fontSize -= 2) {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const trial = current ? `${current} ${word}` : word;
      if (measure(trial, fontSize) <= maxWidth) {
        current = trial;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    if (lines.length <= MAX_LINES && lines.every((l) => measure(l, fontSize) <= maxWidth)) {
      return { fontSize, lines };
    }
  }
  // Fall back to the smallest attempted size even if still tight - never
  // throw content away.
  const words = text.split(" ");
  return { fontSize: MIN_FONT_PX, lines: [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] };
}

export default function FooterSignature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!container || !canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    let interactive = !reducedMotionQuery.matches && finePointerQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots: Dot[] = [];
    let pointerX = -9999;
    let pointerY = -9999;
    let raf = 0;
    let lastDraw = 0;
    let running = false;
    let visible = false;
    let dotSizePx = DOT_SIZE;
    const FRAME_MS = 16;

    // Falloff/return physics: identical shape to ParticleField's cursor
    // field (exp(-dist/decayRadius) push, spring-eased toward target) so
    // this reads as the same interaction language as the background. Both
    // scale up with the rendered font size (recomputed in sampleDots) so
    // the interaction stays proportionate on a much larger signature
    // instead of reading as a pinprick against huge letters.
    let decayRadius = 70;
    let maxPush = 30;
    const SPRING_EASE = 0.12;

    function sampleDots() {
      const rect = container!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const fontFamily =
        getComputedStyle(document.documentElement).getPropertyValue("--font-display") || "sans-serif";
      const sampleCtx = document.createElement("canvas").getContext("2d")!;
      const { fontSize, lines } = wrapLines(sampleCtx, TEXT, fontFamily.trim() || "sans-serif", width * 0.98);

      // Dot pitch/size and the cursor-push radius all scale with the
      // rendered font size (relative to the size these were originally
      // tuned at) so a huge signature keeps the same halftone character
      // and a proportionate, still-legible-as-dots interaction instead of
      // either filling in solid or feeling like a pinprick.
      const sizeScale = Math.min(2.3, Math.max(1, fontSize / REFERENCE_FONT_PX));
      dotSizePx = DOT_SIZE * Math.min(1.9, Math.max(1, sizeScale * 0.9));
      decayRadius = Math.min(150, 70 * sizeScale);
      maxPush = Math.min(60, 30 * sizeScale);

      const lineHeight = fontSize * 1.05;
      height = lineHeight * lines.length + fontSize * 0.3;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d")!;
      octx.scale(dpr, dpr);
      octx.font = `700 ${fontSize}px ${fontFamily.trim() || "sans-serif"}`;
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      lines.forEach((line, i) => {
        const y = fontSize * 0.62 + i * lineHeight;
        octx.fillText(line, width / 2, y);
      });

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      const pitchPx = DOT_PITCH * sizeScale * dpr;
      const next: Dot[] = [];
      for (let py = pitchPx / 2; py < off.height; py += pitchPx) {
        for (let px = pitchPx / 2; px < off.width; px += pitchPx) {
          const idx = (Math.floor(py) * off.width + Math.floor(px)) * 4 + 3;
          if (img[idx] > 120) {
            const fx = px / dpr;
            const fy = py / dpr;
            next.push({ fx, fy, x: fx, y: fy, dispX: 0, dispY: 0 });
          }
        }
      }
      dots = next;
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        const distFromHome = Math.hypot(d.dispX, d.dispY);
        const t = Math.min(1, distFromHome / maxPush);
        const r = BASE_COLOR[0] + (NEAR_COLOR_A[0] - BASE_COLOR[0]) * t * 0.6 + (NEAR_COLOR_B[0] - BASE_COLOR[0]) * t * 0.2;
        const g = BASE_COLOR[1] + (NEAR_COLOR_A[1] - BASE_COLOR[1]) * t * 0.6 + (NEAR_COLOR_B[1] - BASE_COLOR[1]) * t * 0.2;
        const b = BASE_COLOR[2] + (NEAR_COLOR_A[2] - BASE_COLOR[2]) * t * 0.6 + (NEAR_COLOR_B[2] - BASE_COLOR[2]) * t * 0.2;
        const alpha = 0.34 + t * 0.5;
        ctx.fillStyle = `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${alpha.toFixed(3)})`;
        ctx.fillRect(d.x - dotSizePx / 2, d.y - dotSizePx / 2, dotSizePx, dotSizePx);
      }
    }

    function tick() {
      for (const d of dots) {
        let targetDispX = 0;
        let targetDispY = 0;
        if (interactive) {
          const dx = d.fx - pointerX;
          const dy = d.fy - pointerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0.5) {
            const push = Math.exp(-dist / decayRadius) * maxPush;
            targetDispX = (dx / dist) * push;
            targetDispY = (dy / dist) * push;
          }
        }
        d.dispX += (targetDispX - d.dispX) * SPRING_EASE;
        d.dispY += (targetDispY - d.dispY) * SPRING_EASE;
        d.x = d.fx + d.dispX;
        d.y = d.fy + d.dispY;
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
      if (running || !visible) return;
      running = true;
      lastDraw = 0;
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    }
    function onPointerAway() {
      pointerX = -9999;
      pointerY = -9999;
    }

    function onResize() {
      sampleDots();
      if (!running) draw();
    }

    function onReducedMotionChange() {
      interactive = !reducedMotionQuery.matches && finePointerQuery.matches;
      if (!interactive) {
        for (const d of dots) {
          d.dispX = 0;
          d.dispY = 0;
          d.x = d.fx;
          d.y = d.fy;
        }
        draw();
      }
    }

    sampleDots();
    draw();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "80px 0px 80px 0px", threshold: 0.01 }
    );
    io.observe(container);

    let resizeRaf = 0;
    const onWindowResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        onResize();
      });
    };

    window.addEventListener("resize", onWindowResize, { passive: true });
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    finePointerQuery.addEventListener("change", onReducedMotionChange);
    if (interactive) {
      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerAway, { passive: true });
    }

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onWindowResize);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      finePointerQuery.removeEventListener("change", onReducedMotionChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerAway);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none w-full select-none" aria-hidden="true">
      <canvas ref={canvasRef} className="pointer-events-auto mx-auto block" />
      <span className="sr-only">Sajidur Rahman Sajid</span>
    </div>
  );
}