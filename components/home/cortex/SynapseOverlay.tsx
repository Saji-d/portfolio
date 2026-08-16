"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ACCENT = "99, 102, 241";
const ACCENT_2 = "168, 85, 247";
const ACCENT_3 = "34, 211, 238";
const BLUE = "96, 165, 250";
const PALE = "248, 250, 252";
const FRAME_MS = 33;

// --- Timeline -------------------------------------------------------------
// PHASE 1  0            -> CONSTRUCT_START     network idle, quiet drift.
// PHASE 2  CONSTRUCT_START -> (per letter)      signals depart the field and
//                                                converge on each letter's
//                                                node positions.
// PHASE 3  (per letter)                         nodes land, edges etch in -
//                                                the circuit assembles SAJID
//                                                left to right.
// PHASE 4  CONSTRUCTION_END -> FADE_OUT_START    full identity holds, subtle
//                                                premium glow, subtitle in.
// PHASE 5  (within phase 4 window)               living circuit: occasional
//                                                signal pulses along strokes.
const SYNAPSE_NAME = "SAJID";
const LETTER_ORDER = SYNAPSE_NAME.split("");
const CONSTRUCT_START = 1.0;
const LETTER_STAGGER = 0.5;
const LETTER_WINDOW = 0.6;
const TRAVEL_DUR_BASE = 0.28;
const TRAVEL_DUR_VAR = 0.14;
const EDGE_REVEAL_LAG = 0.05;
const EDGE_REVEAL_DUR = 0.22;
const EDGE_SETTLE_DUR = 0.45;
const EDGE_PEAK_ALPHA = 0.72;
const EDGE_REST_ALPHA = 0.42;
const NODE_FLASH_DUR = 0.3;
const CONSTRUCTION_END =
  CONSTRUCT_START +
  (LETTER_ORDER.length - 1) * LETTER_STAGGER +
  LETTER_WINDOW +
  EDGE_REVEAL_LAG +
  EDGE_REVEAL_DUR;
const SUBTITLE_IN_START = CONSTRUCTION_END - 0.4;
const SUBTITLE_IN_END = SUBTITLE_IN_START + 0.55;
const FADE_OUT_START = 5.7;
const FADE_OUT_END = 6.05;
const TOTAL = 6.3;
const BG_MAX = 0.9;
const BG_IN = 0.7;
const BG_RESTRAIN = 0.4;
const BG_REST = 0.62;
const REDUCED_FADE_START = 0.9;
const REDUCED_FADE_END = 1.15;
const COMPLETE_BOOST_DUR = 0.65;
const COMPLETE_BOOST_RISE = 0.16;

interface SynNode {
  x: number;
  y: number;
  depth: number;
  size: number;
  sub: number;
  /** Ambient drift per node: deeper (higher depth value) nodes sway less,
   *  giving the network a subtle parallax across the full viewport. */
  driftAmp: number;
  driftSpeed: number;
  driftPhaseX: number;
  driftPhaseY: number;
}

interface SynEdge {
  from: number;
  to: number;
  base: number;
  color: string;
  formDelay: number;
  pulseStart: number;
  pulseDur: number;
  cross: boolean;
  pulse: boolean;
  seed: number;
}

interface Star {
  fx: number;
  fy: number;
  size: number;
  alpha: number;
  color: string;
  twPhase: number;
  twSpeed: number;
  driftAmp: number;
  driftSpeed: number;
  phase: number;
}

interface Drifter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

/** A single circuit node that is part of the constructed SAJID glyph. Each
 *  one is "sent" from somewhere out in the network (originX/originY) and
 *  arrives at its final letterform position (x/y) at revealAt. */
interface LetterNode {
  x: number;
  y: number;
  letterIndex: number;
  raster: number;
  revealAt: number;
  travelStart: number;
  travelDur: number;
  originX: number;
  originY: number;
  flicker: number;
}

interface LetterEdge {
  a: number;
  b: number;
  revealAt: number;
  color: string;
}

interface IdlePulse {
  edge: number;
  start: number;
  dur: number;
}

interface LetterScene {
  nodes: LetterNode[];
  edges: LetterEdge[];
  idlePulses: IdlePulse[];
  cellSize: number;
  centerY: number;
  glyphHeight: number;
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

// 5x7 dot-matrix strokes for the identity glyphs. Adjacent "on" cells
// (including diagonals) become circuit nodes joined by trace edges, so the
// bitmap *is* the letter's wiring diagram rather than a decorative overlay.
const GRID_COLS = 5;
const GRID_ROWS = 7;
const LETTER_GAP_COLS = 1;
const LETTER_BITMAPS: Record<string, number[]> = {
  S: [
    0, 1, 1, 1, 1,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 0,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 1, 1, 1, 0,
  ],
  A: [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
  ],
  J: [
    0, 0, 0, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  I: [
    1, 1, 1, 1, 1,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    1, 1, 1, 1, 1,
  ],
  D: [
    1, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 0,
  ],
};
// Forward-only neighbour offsets (right, down, down-right, down-left) walk
// every 8-connected pair exactly once in a single raster pass.
const NEIGHBOR_DIRS: [number, number][] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, 1],
];

const PICK_STAR_COLOR = () => {
  const r = Math.random();
  if (r < 0.03) return ACCENT_3;
  if (r < 0.11) return ACCENT_2;
  if (r < 0.3) return BLUE;
  return ACCENT;
};

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    fx: Math.random(),
    fy: Math.random(),
    size: 0.6 + Math.random() * 1.3,
    alpha: 0.14 + Math.random() * 0.42,
    color: PICK_STAR_COLOR(),
    twPhase: Math.random() * Math.PI * 2,
    twSpeed: 0.4 + Math.random() * 0.9,
    driftAmp: 1 + Math.random() * 3,
    driftSpeed: 0.3 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  }));
}

const DRIFT_AMP: Record<number, number> = {
  0: 2,
  1: 5,
  2: 4,
  3: 3,
  4: 2.2,
  5: 1.6,
};

function buildNetwork(width: number, height: number, mobile: boolean) {
  const cx = width / 2;
  const cy = height / 2;
  const rng = mulberry32(20260809);
  const padX = Math.max(16, width * 0.035);
  const padY = Math.max(16, height * 0.045);
  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

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

  const withDrift = (depth: number) => ({
    driftAmp: DRIFT_AMP[depth] ?? 1.6,
    driftSpeed: 0.3 + rng() * 0.25,
    driftPhaseX: rng() * Math.PI * 2,
    driftPhaseY: rng() * Math.PI * 2,
  });

  const pickEdgeColor = () => {
    const r = rng();
    if (r < 0.05) return ACCENT_2;
    if (r < 0.14) return BLUE;
    return ACCENT;
  };

  // A jittered lattice covers the whole viewport (corners included) so the
  // mesh reads edge to edge instead of as a radial spider web hanging off the
  // centre. The centre hub still anchors it, but the field is everywhere.
  const cell = Math.min(width, height) / (mobile ? 6 : 7);
  const cols = Math.max(2, Math.round((width - padX * 2) / cell));
  const rows = Math.max(2, Math.round((height - padY * 2) / cell));

  // The hub used to render as an oversized standalone dot; it now stays
  // structurally the BFS root (index 0, anchoring hop distances below) but
  // is sized/lit exactly like its depth-1 neighbours, so it reads as part
  // of the mesh rather than a decorative centrepiece.
  const hubSpec = nodeSpec(1);
  const nodes: SynNode[] = [
    { x: cx, y: cy, depth: 1, size: hubSpec.size, sub: hubSpec.sub, ...withDrift(1) },
  ];
  const field: number[] = [];

  const addField = (x: number, y: number, minDepth = 1) => {
    const xc = clamp(x, padX, width - padX);
    const yc = clamp(y, padY, height - padY);
    const d =
      Math.hypot(xc - cx, yc - cy) / Math.hypot(width / 2, height / 2);
    const depth = Math.max(
      minDepth,
      d < 0.28 ? 1 : d < 0.55 ? 2 : d < 0.8 ? 3 : 4,
    );
    const spec = nodeSpec(depth);
    nodes.push({
      x: xc,
      y: yc,
      depth,
      size: spec.size,
      sub: spec.sub,
      ...withDrift(depth),
    });
    field.push(nodes.length - 1);
  };

  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const jx = (rng() - 0.5) * cell * 0.7;
      const jy = (rng() - 0.5) * cell * 0.7;
      addField(
        padX + (c / cols) * (width - padX * 2) + jx,
        padY + (r / rows) * (height - padY * 2) + jy,
      );
    }
  }

  const extras = mobile ? 8 : 14;
  for (let i = 0; i < extras; i++) {
    addField(rng() * width, rng() * height, 2);
  }

  // k-nearest-neighbour links turn the lattice into a continuous synaptic
  // mesh. Pairs are collected first so every connection is counted once,
  // then hop distances (BFS from the hub) drive formation + pulse order.
  const maxEdge = cell * 2.7;
  const maxLinks = mobile ? 2 : 3;
  const pending: [number, number][] = [];
  const seenPairs = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const dist: { j: number; d: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d <= maxEdge) dist.push({ j, d });
    }
    dist.sort((p, q) => p.d - q.d);
    const take = Math.min(maxLinks, dist.length);
    for (let k = 0; k < take; k++) {
      const a = i;
      const b = dist[k].j;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      pending.push([a, b]);
    }
  }

  const adj = Array.from({ length: nodes.length }, () => [] as number[]);
  for (const [a, b] of pending) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const hop = new Array<number>(nodes.length).fill(-1);
  hop[0] = 0;
  const queue = [0];
  for (let qi = 0; qi < queue.length; qi++) {
    const cur = queue[qi];
    for (const nb of adj[cur]) {
      if (hop[nb] === -1) {
        hop[nb] = hop[cur] + 1;
        queue.push(nb);
      }
    }
  }

  const edges: SynEdge[] = [];
  for (const [a, b] of pending) {
    const h = Math.max(hop[a], hop[b]);
    edges.push({
      from: a,
      to: b,
      base: Math.max(0.24, 0.52 - h * 0.05),
      color: pickEdgeColor(),
      cross: h > 1,
      pulse: true,
      seed: rng(),
      formDelay: 0.5 + h * 0.1 + rng() * 0.05,
      pulseStart: 1.4 + h * 0.22 + rng() * 0.06,
      pulseDur: 0.5,
    });
  }

  // A few terminal leaves give the mesh loose ends, reinforcing the organic
  // synapse feel without adding clutter.
  const numLeaves = mobile ? 6 : 10;
  for (let k = 0; k < numLeaves; k++) {
    const parentIdx = field[Math.floor(rng() * field.length)];
    const parent = nodes[parentIdx];
    const ang = rng() * Math.PI * 2;
    const len = (0.14 + rng() * 0.1) * cell * 1.6;
    const x = clamp(parent.x + Math.cos(ang) * len, padX, width - padX);
    const y = clamp(parent.y + Math.sin(ang) * len, padY, height - padY);
    nodes.push({ x, y, depth: 5, size: 1.7, sub: 0.45, ...withDrift(5) });
    const idx = nodes.length - 1;
    edges.push({
      from: parentIdx,
      to: idx,
      base: 0.3,
      color: pickEdgeColor(),
      cross: false,
      pulse: true,
      seed: rng(),
      formDelay: 0.9 + rng() * 0.2,
      pulseStart: 2.0 + rng() * 0.3,
      pulseDur: 0.5,
    });
  }

  const drifters: Drifter[] = Array.from(
    { length: mobile ? 32 : 48 },
    () => ({
      x: rng() * width,
      y: rng() * height,
      vx: (rng() - 0.5) * 0.18,
      vy: (rng() - 0.5) * 0.18,
      r: 0.8 + rng() * 1.2,
      phase: rng() * Math.PI * 2,
    }),
  );

  return { nodes, edges, drifters };
}

/** Builds the SAJID circuit: a node per lit bitmap cell (with a convergence
 *  origin somewhere out in the field) and an edge per adjacent pair, timed
 *  so the whole thing assembles left to right, letter by letter. */
function buildLetters(width: number, height: number, mobile: boolean): LetterScene {
  const rng = mulberry32(0x53414a49);
  const totalCols =
    LETTER_ORDER.length * GRID_COLS + (LETTER_ORDER.length - 1) * LETTER_GAP_COLS;
  const widthFrac = width < 640 ? 0.88 : width < 1024 ? 0.72 : 0.56;
  const heightFrac = 0.42;
  const cellSize = Math.max(
    4,
    Math.min(
      (width * widthFrac) / totalCols,
      (height * heightFrac) / GRID_ROWS,
    ),
  );
  const glyphWidth = cellSize * totalCols;
  const glyphHeight = cellSize * GRID_ROWS;
  const centerY = height * 0.46;
  const originX = width / 2 - glyphWidth / 2;
  const originY = centerY - glyphHeight / 2;
  const convergeRadius = Math.min(width, height) * (mobile ? 0.22 : 0.28);
  const maxRaster = GRID_ROWS * GRID_COLS - 1;

  const nodes: LetterNode[] = [];
  const byCell = new Map<string, number>();

  LETTER_ORDER.forEach((letter, li) => {
    const bitmap = LETTER_BITMAPS[letter];
    const colBase = li * (GRID_COLS + LETTER_GAP_COLS);
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!bitmap[row * GRID_COLS + col]) continue;
        const raster = row * GRID_COLS + col;
        const x = originX + (colBase + col + 0.5) * cellSize;
        const y = originY + (row + 0.5) * cellSize;
        const revealAt =
          CONSTRUCT_START +
          li * LETTER_STAGGER +
          (raster / maxRaster) * LETTER_WINDOW;
        const angle = rng() * Math.PI * 2;
        const radius = convergeRadius * (0.65 + rng() * 0.55);
        const travelDur = TRAVEL_DUR_BASE + rng() * TRAVEL_DUR_VAR;
        nodes.push({
          x,
          y,
          letterIndex: li,
          raster,
          revealAt,
          travelStart: revealAt - travelDur,
          travelDur,
          originX: x + Math.cos(angle) * radius,
          originY: y + Math.sin(angle) * radius,
          flicker: rng() * Math.PI * 2,
        });
        byCell.set(`${li}-${row}-${col}`, nodes.length - 1);
      }
    }
  });

  const edges: LetterEdge[] = [];
  LETTER_ORDER.forEach((letter, li) => {
    const bitmap = LETTER_BITMAPS[letter];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!bitmap[row * GRID_COLS + col]) continue;
        const aIdx = byCell.get(`${li}-${row}-${col}`);
        if (aIdx === undefined) continue;
        for (const [dc, dr] of NEIGHBOR_DIRS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nr >= GRID_ROWS || nc < 0 || nc >= GRID_COLS) continue;
          if (!bitmap[nr * GRID_COLS + nc]) continue;
          const bIdx = byCell.get(`${li}-${nr}-${nc}`);
          if (bIdx === undefined) continue;
          const a = nodes[aIdx];
          const b = nodes[bIdx];
          const r = rng();
          edges.push({
            a: aIdx,
            b: bIdx,
            revealAt: Math.max(a.revealAt, b.revealAt) + EDGE_REVEAL_LAG,
            color: r < 0.15 ? ACCENT_2 : r < 0.26 ? BLUE : ACCENT,
          });
        }
      }
    }
  });

  const idlePulses: IdlePulse[] = [];
  if (edges.length) {
    const idleStart = CONSTRUCTION_END + 0.25;
    const idleEnd = FADE_OUT_START - 0.3;
    const count = mobile ? 5 : 8;
    for (let i = 0; i < count; i++) {
      idlePulses.push({
        edge: Math.floor(rng() * edges.length),
        start: idleStart + rng() * Math.max(0.1, idleEnd - idleStart),
        dur: 0.45 + rng() * 0.25,
      });
    }
    idlePulses.sort((p, q) => p.start - q.start);
  }

  return { nodes, edges, idlePulses, cellSize, centerY, glyphHeight };
}

/** Restrains the background network while SAJID is under construction so
 *  the name stays the clear focal point, then settles to a still-subdued
 *  resting level once it has landed (never back to full strength - the
 *  network stays atmospheric, not competing) - with a brief bloom each time
 *  a new letter's signals depart, as if the field just routed something
 *  toward the centre. */
function bgIntensity(elapsed: number): number {
  let base: number;
  if (elapsed < CONSTRUCT_START) {
    base = 1;
  } else if (elapsed < CONSTRUCT_START + 0.4) {
    base =
      1 - (1 - BG_RESTRAIN) * easeOutCubic((elapsed - CONSTRUCT_START) / 0.4);
  } else if (elapsed < CONSTRUCTION_END) {
    base = BG_RESTRAIN;
  } else if (elapsed < CONSTRUCTION_END + 0.6) {
    base =
      BG_RESTRAIN +
      (BG_REST - BG_RESTRAIN) *
        easeOutCubic((elapsed - CONSTRUCTION_END) / 0.6);
  } else {
    base = BG_REST;
  }

  let bump = 0;
  for (let i = 0; i < LETTER_ORDER.length; i++) {
    const t = CONSTRUCT_START + i * LETTER_STAGGER;
    const d = Math.abs(elapsed - t);
    if (d < 0.35) bump = Math.max(bump, (1 - d / 0.35) * 0.16);
  }
  return Math.min(1, base + bump);
}

/** A single restrained brightness beat across the *completed* SAJID circuit
 *  right as construction finishes - "the system just completed" rather than
 *  a flash. Quick rise, eased decay, back to the calm resting glow. */
function completionBoost(elapsed: number): number {
  const t = elapsed - CONSTRUCTION_END;
  if (t < 0 || t > COMPLETE_BOOST_DUR) return 0;
  const riseEnd = COMPLETE_BOOST_DUR * COMPLETE_BOOST_RISE;
  if (t < riseEnd) return easeOutCubic(t / riseEnd);
  return 1 - easeInCubic(clamp01((t - riseEnd) / (COMPLETE_BOOST_DUR - riseEnd)));
}

function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elapsed: number,
  fade: number,
  bgMul: number,
  reduced: boolean,
  stars: Star[],
  nodes: SynNode[],
  edges: SynEdge[],
  drifters: Drifter[],
  letters: LetterScene,
) {
  ctx.clearRect(0, 0, width, height);

  // Node render positions with per-node ambient drift (depth parallax).
  const rx = new Array<number>(nodes.length);
  const ry = new Array<number>(nodes.length);
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (reduced) {
      rx[i] = n.x;
      ry[i] = n.y;
    } else {
      rx[i] = n.x + n.driftAmp * Math.sin(elapsed * n.driftSpeed + n.driftPhaseX);
      ry[i] = n.y + n.driftAmp * Math.cos(elapsed * n.driftSpeed * 0.8 + n.driftPhaseY);
    }
  }

  // Starry atmosphere: the same round-dot visual language as the site's
  // background field, so the overlay feels like the environment expanded.
  // Left untouched by bgMul - it's ambient dressing, not the "network".
  for (const s of stars) {
    const sx = s.fx * width;
    const sy = s.fy * height;
    let ox = 0;
    let oy = 0;
    if (!reduced) {
      ox = s.driftAmp * Math.sin(elapsed * s.driftSpeed + s.phase);
      oy = s.driftAmp * Math.cos(elapsed * s.driftSpeed * 0.7 + s.phase * 1.3);
    }
    const twinkle = reduced
      ? 1
      : 0.6 + 0.4 * Math.sin(elapsed * s.twSpeed + s.twPhase);
    const a = s.alpha * twinkle * fade;
    if (a < 0.004) continue;
    ctx.fillStyle = `rgba(${s.color}, ${a.toFixed(3)})`;
    ctx.fillRect(sx + ox, sy + oy, s.size, s.size);
  }

  for (const e of edges) {
    const a = rx[e.from];
    const b = rx[e.to];
    const c = ry[e.from];
    const d = ry[e.to];
    let p = 1;
    let flicker = 1;
    if (!reduced) {
      p = easeOutCubic(clamp01((elapsed - e.formDelay) / 0.28));
      if (e.cross) {
        flicker = 0.55 + 0.45 * Math.sin(elapsed * 2.4 + e.seed * 9);
      }
    }
    if (p <= 0) continue;
    const alpha = e.base * p * flicker * fade * bgMul;
    if (alpha < 0.004) continue;
    ctx.strokeStyle = `rgba(${e.color}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a, c);
    ctx.lineTo(b, d);
    ctx.stroke();
  }

  if (!reduced) {
    for (const e of edges) {
      if (!e.pulse) continue;
      const q = (elapsed - e.pulseStart) / e.pulseDur;
      if (q < 0 || q > 1) continue;
      const ax = rx[e.from];
      const ay = ry[e.from];
      const bx = rx[e.to];
      const by = ry[e.to];
      const x = ax + (bx - ax) * q;
      const y = ay + (by - ay) * q;
      const env = 1 - Math.abs(q * 2 - 1);
      const alpha = env * 0.85 * fade * bgMul;
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
      lit = 0.8;
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

    const g = lit * fade * bgMul;
    const s = n.sub;
    ctx.fillStyle = `rgba(${ACCENT_2}, ${0.16 * g * s})`;
    ctx.beginPath();
    ctx.arc(rx[i], ry[i], n.size * 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${ACCENT_2}, ${(0.3 + 0.7 * lit) * fade * bgMul * s})`;
    ctx.beginPath();
    ctx.arc(rx[i], ry[i], n.size, 0, Math.PI * 2);
    ctx.fill();
  }

  const fieldIn = reduced ? 1 : Math.min(1, elapsed / BG_IN);
  for (const pt of drifters) {
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
      fieldIn *
      bgMul;
    ctx.fillStyle = `rgba(${ACCENT_2}, ${a})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- SAJID circuit: signals converging, then landed strokes -------------
  const nodeSize = Math.max(1.7, letters.cellSize * 0.16);
  const { nodes: lNodes, edges: lEdges, idlePulses } = letters;
  const boost = reduced ? 0 : completionBoost(elapsed);
  const boostMul = 1 + boost * 0.35;

  for (let i = 0; i < lNodes.length; i++) {
    const n = lNodes[i];
    const arrived = reduced || elapsed >= n.revealAt;
    if (arrived) {
      const since = reduced ? 1 : elapsed - n.revealAt;
      const flash =
        !reduced && since >= 0 && since < NODE_FLASH_DUR
          ? 1 - since / NODE_FLASH_DUR
          : 0;
      const alpha = fade * boostMul;

      const halo = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        nodeSize * 3.2,
      );
      halo.addColorStop(0, `rgba(${ACCENT_2}, ${0.3 * alpha})`);
      halo.addColorStop(1, `rgba(${ACCENT_2}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(n.x, n.y, nodeSize * 3.2, 0, Math.PI * 2);
      ctx.fill();

      if (flash > 0) {
        ctx.strokeStyle = `rgba(${PALE}, ${flash * 0.55 * alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeSize * (1.3 + (1 - flash) * 2.4), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Calmer once settled: the arrival flash (above) carries the "active"
      // brightness, so the resting breathe is a modest, sophisticated drift
      // rather than a second bright pulse.
      const breathe = reduced
        ? 1
        : 0.56 + 0.22 * Math.sin(elapsed * 1.5 + n.flicker);
      ctx.fillStyle = `rgba(${PALE}, ${Math.min(1, breathe + flash * 0.6) * alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();
    } else if (!reduced && elapsed >= n.travelStart) {
      const p = clamp01((elapsed - n.travelStart) / n.travelDur);
      const eased = easeOutCubic(p);
      const cx = n.originX + (n.x - n.originX) * eased;
      const cy = n.originY + (n.y - n.originY) * eased;
      const alpha = (0.5 + 0.5 * p) * fade;
      ctx.fillStyle = `rgba(${ACCENT}, ${0.2 * alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${PALE}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const e of lEdges) {
    const t = elapsed - e.revealAt;
    if (!reduced && t < 0) continue;
    // Traces glow brighter the instant they connect, then ease down to a
    // calmer resting brightness - "activating" reads as distinct from
    // "settled" rather than a flat fade-in.
    let level: number;
    if (reduced) {
      level = EDGE_REST_ALPHA;
    } else if (t < EDGE_REVEAL_DUR) {
      level = EDGE_PEAK_ALPHA * easeOutCubic(t / EDGE_REVEAL_DUR);
    } else {
      const settle = clamp01((t - EDGE_REVEAL_DUR) / EDGE_SETTLE_DUR);
      level = EDGE_PEAK_ALPHA + (EDGE_REST_ALPHA - EDGE_PEAK_ALPHA) * easeOutCubic(settle);
    }
    const alpha = level * fade * boostMul;
    if (alpha < 0.004) continue;
    const na = lNodes[e.a];
    const nb = lNodes[e.b];
    ctx.strokeStyle = `rgba(${e.color}, ${alpha})`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(na.x, na.y);
    ctx.lineTo(nb.x, nb.y);
    ctx.stroke();
  }

  if (!reduced) {
    for (const ip of idlePulses) {
      const q = (elapsed - ip.start) / ip.dur;
      if (q < 0 || q > 1) continue;
      const e = lEdges[ip.edge];
      if (!e) continue;
      const na = lNodes[e.a];
      const nb = lNodes[e.b];
      const x = na.x + (nb.x - na.x) * q;
      const y = na.y + (nb.y - na.y) * q;
      const env = 1 - Math.abs(q * 2 - 1);
      const alpha = env * fade;
      ctx.fillStyle = `rgba(${ACCENT_3}, ${alpha * 0.22})`;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${PALE}, ${alpha * 0.95})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
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
    let drifters: Drifter[] = [];
    let stars: Star[] = [];
    let letters: LetterScene = {
      nodes: [],
      edges: [],
      idlePulses: [],
      cellSize: 0,
      centerY: 0,
      glyphHeight: 0,
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const mobile = width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const net = buildNetwork(width, height, mobile);
      nodes = net.nodes;
      edges = net.edges;
      drifters = net.drifters;
      stars = makeStars(
        mobile
          ? Math.min(150, Math.floor((width * height) / 3000))
          : Math.min(420, Math.floor((width * height) / 5200)),
      );
      letters = buildLetters(width, height, mobile);
      const gap = width < 640 ? 20 : width < 1024 ? 28 : 36;
      textEl.style.top = `${letters.centerY + letters.glyphHeight / 2 + gap}px`;
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
        start = now - (reduced ? REDUCED_FADE_START : FADE_OUT_START) * 1000;
        skipApplied = true;
      }
      const elapsed = (now - start) / 1000;

      let bgOp: number;
      let subtitleOp: number;
      let subtitleScale: number;
      let fade: number;
      let bgMul: number;

      if (reduced) {
        const f = clamp01(
          (elapsed - REDUCED_FADE_START) /
            (REDUCED_FADE_END - REDUCED_FADE_START),
        );
        bgOp = BG_MAX * (1 - f);
        subtitleOp = 1 - f;
        subtitleScale = 1;
        fade = 1 - f;
        bgMul = 1;
      } else {
        bgOp = BG_MAX * easeOutCubic(clamp01(elapsed / BG_IN));
        const rampIn = easeOutCubic(
          clamp01(
            (elapsed - SUBTITLE_IN_START) /
              (SUBTITLE_IN_END - SUBTITLE_IN_START),
          ),
        );
        const fadeOut =
          1 -
          easeInCubic(
            clamp01((elapsed - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START)),
          );
        subtitleOp = Math.min(rampIn, fadeOut);
        subtitleScale = 0.97 + 0.03 * rampIn;
        fade = fadeOut;
        bgMul = bgIntensity(elapsed);
      }

      bgEl.style.opacity = String(bgOp);
      textEl.style.opacity = String(subtitleOp);
      textEl.style.transform = `translate(-50%, 0) scale(${subtitleScale})`;

      if (now - lastDraw >= FRAME_MS) {
        lastDraw = now;
        draw(
          ctx,
          width,
          height,
          elapsed,
          fade,
          bgMul,
          reduced,
          stars,
          nodes,
          edges,
          drifters,
          letters,
        );
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
      role="dialog"
      aria-modal="true"
      aria-label="Synapse: the network assembling the identity SAJID"
      className="fixed inset-0 z-[80] touch-none overflow-hidden"
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 bg-bg"
        style={{
          opacity: 0,
          backgroundImage: [
            "radial-gradient(60% 60% at 18% 15%, rgba(99,102,241,0.07), transparent 70%)",
            "radial-gradient(55% 55% at 78% 30%, rgba(59,130,246,0.05), transparent 72%)",
            "radial-gradient(65% 65% at 85% 88%, rgba(34,211,238,0.04), transparent 70%)",
          ].join(","),
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <button
        type="button"
        onClick={() => {
          skipRef.current = true;
        }}
        aria-label="Close synapse"
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface/70 text-text-secondary backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent sm:right-5 sm:top-5"
      >
        <X className="h-4 w-4" />
      </button>
      <span className="sr-only">{SYNAPSE_NAME}</span>
      <div
        ref={textRef}
        className="absolute left-1/2 w-[min(88vw,640px)] min-w-[220px] text-center"
        style={{ opacity: 0, transform: "translate(-50%, 0)" }}
      >
        <div
          aria-hidden="true"
          data-cortex-anim
          className="synapse-trace mx-auto"
        />
        <p
          data-cortex-anim
          className="synapse-subtitle-in mt-4 font-mono text-xs tracking-[0.12em] text-text-secondary sm:text-sm"
        >
          AI Engineer &amp; Full-Stack Software Developer
        </p>
        <p
          data-cortex-anim
          className="synapse-esc-in mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted/50"
        >
          esc to exit
        </p>
      </div>
    </div>,
    document.body,
  );
}
