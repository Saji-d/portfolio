"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ACCENT = "79, 209, 197";
const ACCENT_2 = "124, 125, 255";
const PALE = "208, 246, 240";
const FRAME_MS = 33;
const TOTAL = 5.05;
const BG_MAX = 0.85;
const BG_IN = 0.7;
const BG_OUT_START = 4.5;
const BG_OUT_END = 4.95;
const TEXT_IN_START = 0.9;
const TEXT_IN_END = 1.2;
const TEXT_OUT_START = 4.4;
const TEXT_OUT_END = 4.7;
const REDUCED_FADE_START = 0.9;
const REDUCED_FADE_END = 1.15;

interface SynNode {
  x: number;
  y: number;
  depth: number;
  size: number;
  sub: number;
}

interface SynEdge {
  from: number;
  to: number;
  base: number;
  formDelay: number;
  pulseStart: number;
  pulseDur: number;
  cross: boolean;
  pulse: boolean;
  seed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3);
const easeInCubic = (v: number) => v * v * v;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const rng = mulberry32(20260809);
  const padX = Math.max(24, width * 0.045);
  const padY = Math.max(24, height * 0.05);
  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  const distToEdge = (angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    let t = Infinity;
    if (Math.abs(cos) > 1e-4) {
      const tx = cos > 0 ? (width - padX - cx) / cos : (padX - cx) / cos;
      if (tx > 0) t = Math.min(t, tx);
    }
    if (Math.abs(sin) > 1e-4) {
      const ty = sin > 0 ? (height - padY - cy) / sin : (padY - cy) / sin;
      if (ty > 0) t = Math.min(t, ty);
    }
    return t === Infinity ? Math.min(width, height) : t;
  };

  const nodeSpec = (depth: number): { size: number; sub: number } => {
    switch (depth) {
      case 1:
        return { size: 3.1, sub: 0.9 };
      case 2:
        return { size: 2.6, sub: 0.78 };
      case 3:
        return { size: 2.2, sub: 0.66 };
      case 4:
        return { size: 1.8, sub: 0.52 };
      default:
        return { size: 1.6, sub: 0.42 };
    }
  };

  const chainBase = (depth: number) =>
    depth === 1 ? 0.5 : depth === 2 ? 0.4 : depth === 3 ? 0.32 : 0.24;

  const nodes: SynNode[] = [{ x: cx, y: cy, depth: 0, size: 13, sub: 1 }];
  const edges: SynEdge[] = [];
  const branches: number[][] = [];

  const branchCount = 9;
  let angle = rng() * Math.PI * 2;
  const branchAngles: number[] = [];
  for (let i = 0; i < branchCount; i++) {
    branchAngles.push(angle);
    angle += (Math.PI * 2) / branchCount + (rng() - 0.5) * 0.55;
  }

  for (const baseAng of branchAngles) {
    const maxR = distToEdge(baseAng) * (0.9 + rng() * 0.12);
    const depthCount = 3 + Math.floor(rng() * 2);
    const chain: number[] = [];
    let prevIdx = 0;
    for (let d = 1; d <= depthCount; d++) {
      const frac = 0.1 + (0.88 * d) / depthCount + (rng() - 0.5) * 0.08;
      const rr = maxR * clamp(frac, 0.05, 0.97);
      const angJ = baseAng + (rng() - 0.5) * 0.34;
      const x = clamp(cx + Math.cos(angJ) * rr, padX, width - padX);
      const y = clamp(cy + Math.sin(angJ) * rr, padY, height - padY);
      const spec = nodeSpec(d);
      nodes.push({ x, y, depth: d, size: spec.size, sub: spec.sub });
      const idx = nodes.length - 1;
      chain.push(idx);
      edges.push({
        from: prevIdx,
        to: idx,
        base: chainBase(d),
        cross: false,
        pulse: true,
        seed: rng(),
        formDelay: 0.7 + (d - 1) * 0.14 + rng() * 0.05,
        pulseStart: 1.75 + (d - 1) * 0.3 + rng() * 0.06,
        pulseDur: 0.5,
      });
      prevIdx = idx;
    }
    branches.push(chain);

    if (depthCount >= 3 && rng() < 0.6) {
      const last = nodes[prevIdx];
      const tAng = baseAng + (rng() - 0.5) * 0.5;
      const tR = (0.1 + rng() * 0.08) * maxR;
      const x = clamp(last.x + Math.cos(tAng) * tR, padX, width - padX);
      const y = clamp(last.y + Math.sin(tAng) * tR, padY, height - padY);
      nodes.push({ x, y, depth: depthCount + 1, size: 1.6, sub: 0.4 });
      const idx = nodes.length - 1;
      edges.push({
        from: prevIdx,
        to: idx,
        base: 0.22,
        cross: false,
        pulse: true,
        seed: rng(),
        formDelay: 1.0 + rng() * 0.15,
        pulseStart: 2.05 + rng() * 0.2,
        pulseDur: 0.5,
      });
    }
  }

  for (let i = 0; i < branches.length; i++) {
    const a = branches[i];
    const b = branches[(i + 1) % branches.length];
    for (const d of [2, 3]) {
      if (a.length < d || b.length < d) continue;
      edges.push({
        from: a[d - 1],
        to: b[d - 1],
        base: 0.16,
        cross: true,
        pulse: (i + d) % 2 === 0,
        seed: rng(),
        formDelay: 1.05 + d * 0.14 + rng() * 0.08,
        pulseStart: 2.3 + d * 0.18 + rng() * 0.06,
        pulseDur: 0.55,
      });
    }
  }

  const offCandidates: number[] = [];
  for (const chain of branches) {
    if (chain.length >= 2) offCandidates.push(chain[1]);
  }
  const numOff = Math.min(7, offCandidates.length);
  for (let k = 0; k < numOff; k++) {
    const parentIdx = offCandidates[k];
    const parent = nodes[parentIdx];
    const toParent = Math.atan2(parent.y - cy, parent.x - cx);
    const offAng = toParent + (rng() - 0.5) * 1.6;
    const len = (0.12 + rng() * 0.12) * Math.min(width, height);
    const x = clamp(parent.x + Math.cos(offAng) * len, padX, width - padX);
    const y = clamp(parent.y + Math.sin(offAng) * len, padY, height - padY);
    nodes.push({ x, y, depth: 5, size: 1.7, sub: 0.45 });
    const idx = nodes.length - 1;
    edges.push({
      from: parentIdx,
      to: idx,
      base: 0.3,
      cross: false,
      pulse: true,
      seed: rng(),
      formDelay: 0.95 + rng() * 0.2,
      pulseStart: 2.05 + rng() * 0.25,
      pulseDur: 0.5,
    });
  }

  const particles: Particle[] = Array.from({ length: 26 }, () => ({
    x: rng() * width,
    y: rng() * height,
    vx: (rng() - 0.5) * 0.18,
    vy: (rng() - 0.5) * 0.18,
    r: 0.8 + rng() * 1.1,
    phase: rng() * Math.PI * 2,
  }));

  return { nodes, edges, particles };
}

function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elapsed: number,
  fade: number,
  reduced: boolean,
  nodes: SynNode[],
  edges: SynEdge[],
  particles: Particle[],
) {
  ctx.clearRect(0, 0, width, height);

  for (const e of edges) {
    const a = nodes[e.from];
    const b = nodes[e.to];
    let p = 1;
    let flicker = 1;
    if (!reduced) {
      p = easeOutCubic(clamp01((elapsed - e.formDelay) / 0.28));
      if (e.cross) {
        flicker = 0.55 + 0.45 * Math.sin(elapsed * 2.4 + e.seed * 9);
      }
    }
    if (p <= 0) continue;
    const alpha = e.base * p * flicker * fade;
    if (alpha < 0.004) continue;
    ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  if (!reduced) {
    for (const e of edges) {
      if (!e.pulse) continue;
      const q = (elapsed - e.pulseStart) / e.pulseDur;
      if (q < 0 || q > 1) continue;
      const a = nodes[e.from];
      const b = nodes[e.to];
      const x = a.x + (b.x - a.x) * q;
      const y = a.y + (b.y - a.y) * q;
      const env = 1 - Math.abs(q * 2 - 1);
      const alpha = env * 0.85 * fade;
      ctx.fillStyle = `rgba(${ACCENT}, ${alpha * 0.15})`;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${PALE}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    let lit = 0;
    if (reduced) {
      lit = n.depth === 0 ? 1 : 0.8;
    } else if (n.depth === 0) {
      lit = easeOutCubic(clamp01(elapsed / BG_IN));
    } else {
      for (const e of edges) {
        if (e.to !== i || !e.pulse) continue;
        const arrive = e.pulseStart + e.pulseDur;
        const since = elapsed - arrive;
        if (since >= 0) {
          lit = Math.max(lit, since < 0.35 ? 1 - since / 0.35 : 0.5);
        }
      }
    }
    if (lit <= 0.003) continue;

    const g = lit * fade;
    const size =
      n.depth === 0
        ? n.size * (1 + 0.05 * Math.sin(elapsed * 2.4))
        : n.size;

    if (n.depth === 0) {
      const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 4.2);
      halo.addColorStop(0, `rgba(${ACCENT}, ${0.34 * g})`);
      halo.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size * 4.2, 0, Math.PI * 2);
      ctx.fill();

      if (!reduced) {
        const ringR = size * 1.6 + ((elapsed * 34) % (size * 3.4));
        const ringA =
          Math.max(0, 1 - (ringR - size * 1.6) / (size * 3.4)) * 0.16 * fade;
        ctx.strokeStyle = `rgba(${ACCENT}, ${ringA})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(${PALE}, ${Math.min(1, 0.9 * g + 0.1)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const s = n.sub;
      ctx.fillStyle = `rgba(${ACCENT_2}, ${0.16 * g * s})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${ACCENT_2}, ${(0.3 + 0.7 * lit) * fade * s})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const fieldIn = reduced ? 1 : Math.min(1, elapsed / BG_IN);
  for (const pt of particles) {
    if (!reduced) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.x < -8) pt.x = width + 8;
      else if (pt.x > width + 8) pt.x = -8;
      if (pt.y < -8) pt.y = height + 8;
      else if (pt.y > height + 8) pt.y = -8;
    }
    const a =
      (0.06 + 0.07 * (0.5 + 0.5 * Math.sin(elapsed * 1.3 + pt.phase))) *
      fade *
      fieldIn;
    ctx.fillStyle = `rgba(${ACCENT_2}, ${a})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function SynapseOverlay({ onDone }: { onDone: () => void }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);
  const skipRef = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bgEl = bgRef.current;
    const textEl = textRef.current;
    if (!canvas || !bgEl || !textEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let nodes: SynNode[] = [];
    let edges: SynEdge[] = [];
    let particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const net = buildNetwork(width, height);
      nodes = net.nodes;
      edges = net.edges;
      particles = net.particles;
    };
    resize();

    let raf = 0;
    let finished = false;
    let lastDraw = 0;
    let start = performance.now();
    let skipApplied = false;
    const doneAt = reduced ? REDUCED_FADE_END : TOTAL;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipRef.current = true;
    };
    const onWheel = (e: WheelEvent) => e.preventDefault();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });

    const frame = (now: number) => {
      if (finished) return;
      if (skipRef.current && !skipApplied) {
        start = now - (reduced ? REDUCED_FADE_START : BG_OUT_START) * 1000;
        skipApplied = true;
      }
      const elapsed = (now - start) / 1000;

      let bgOp: number;
      let textOp: number;
      let textScale: number;
      let fade: number;

      if (reduced) {
        const f = clamp01(
          (elapsed - REDUCED_FADE_START) /
            (REDUCED_FADE_END - REDUCED_FADE_START),
        );
        bgOp = BG_MAX * (1 - f);
        textOp = 1 - f;
        textScale = 1;
        fade = 1 - f;
      } else {
        bgOp = BG_MAX * easeOutCubic(clamp01(elapsed / BG_IN));
        const rampIn = easeOutCubic(
          clamp01((elapsed - TEXT_IN_START) / (TEXT_IN_END - TEXT_IN_START)),
        );
        const fadeOut = 1 - easeInCubic(
          clamp01((elapsed - TEXT_OUT_START) / (TEXT_OUT_END - TEXT_OUT_START)),
        );
        textOp = Math.min(rampIn, fadeOut);
        textScale = 0.97 + 0.03 * rampIn;
        fade =
          1 -
          easeInCubic(
            clamp01((elapsed - BG_OUT_START) / (BG_OUT_END - BG_OUT_START)),
          );
      }

      bgEl.style.opacity = String(bgOp);
      textEl.style.opacity = String(textOp);
      textEl.style.transform = `translate(-50%, -50%) scale(${textScale})`;

      if (now - lastDraw >= FRAME_MS) {
        lastDraw = now;
        draw(ctx, width, height, elapsed, fade, reduced, nodes, edges, particles);
      }

      if (elapsed >= doneAt) {
        finished = true;
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("wheel", onWheel);
        onDoneRef.current();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", resize, { passive: true });

    return () => {
      finished = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="status"
      aria-label="sajid signal propagated"
      className="fixed inset-0 z-[80] touch-none overflow-hidden"
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#0B0E14]"
        style={{
          opacity: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(62% 52% at 50% 46%, rgba(79,209,197,0.08), transparent 70%)",
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <div
        ref={textRef}
        className="absolute left-1/2 top-1/2 text-center"
        style={{ opacity: 0, transform: "translate(-50%, -50%)" }}
      >
        <h3 className="font-display text-4xl font-semibold tracking-tight text-neon sm:text-5xl">
          SAJID
        </h3>
        <div aria-hidden="true" className="mx-auto mt-4 h-px w-16 bg-accent/40" />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
          signal propagated
        </p>
      </div>
    </div>,
    document.body,
  );
}
