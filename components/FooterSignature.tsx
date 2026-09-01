"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A dot-matrix rendering of the site owner's name, sized to the footer's
 * width, driven by a small velocity-based particle simulation with four
 * selectable interaction modes (repel / magnet / explode / vortex).
 *
 * Letters are sampled from an offscreen text render into a dot grid, not
 * drawn as DOM text - only the sampled dots ever render. Every dot carries a
 * home position (fx, fy) and a velocity (vx, vy). Two forces act on it every
 * frame, always both active rather than switched between "disturbed" and
 * "returning" states: a constant weak spring pulling it toward home, and -
 * only inside the cursor's radius - a mode-specific push/pull/swirl. That
 * additive combination is what makes the reformation after the cursor
 * leaves read as physics rather than a scripted animation.
 *
 * Mouse coordinates and the animation loop live entirely in refs/plain
 * variables outside React state - the only React state updates are the
 * selected mode (on click) and the one-time hint fade (on first
 * interaction), so nothing here triggers a re-render per frame.
 *
 * Physics constants, the per-mode force formulas, the click-and-hold
 * intensity boost, and the cursor glow/ring/dot indicator are all matched
 * to the reference hero particle system this was built from - including
 * running force/radius at the same real strength (checked by driving both
 * sites side by side: the reference tears letters apart with 100px+ of
 * momentum-carried displacement, not a gentle nudge). The reference gets
 * that headroom for free because its canvas is the full viewport, far
 * bigger than the name rendered on it; this canvas is deliberately padded
 * with blank "bleed" space above/below/around the sampled text (see
 * sampleDots' bleed calc) so the same magnitude of displacement has room to
 * be visible instead of being clipped at a tightly-fit canvas edge.
 * Radius/force still scale with the rendered font size rather than copying
 * the reference's fixed pixel values, since this signature spans a much
 * wider size range (30px-192px) than a single viewport-sized hero. The
 * reference's own RADIUS/FORCE sliders are reproduced too - not as a big
 * control panel, but as two small sliders flanking the mode pills, driving
 * refs the tick loop reads directly (no per-drag re-render).
 *
 * Dot color is a fixed left-to-right gradient across a four-stop jewel-tone
 * sweep (cyan -> indigo -> violet -> magenta - see THEME_STOPS), precomputed
 * per dot at sample time rather than recomputed every frame, then blended
 * toward a bright spark color based on that dot's current displacement from
 * home - same "physics drives the color" idea as before, just built on a
 * richer base instead of a flat muted one.
 */

const TEXT = "SAJIDUR RAHMAN SAJID";
const DOT_PITCH = 2.4; // CSS px between grid samples at REFERENCE_FONT_PX - lower = more, smaller dots tracing the letterforms (denser than the original 3px pitch - ~56% more dots for a richer, more substantial signature)
const DOT_SIZE = 1.3;
const REFERENCE_FONT_PX = 90; // the font size DOT_PITCH/DOT_SIZE were tuned at
const MIN_FONT_PX = 30; // below this, wrap to more lines instead of shrinking further
const MAX_FONT_PX = 192; // 12rem ceiling - an editorial signature, not an ultra-wide-monitor curiosity
const MAX_LINES = 3;

// Left-to-right base gradient across the name: a four-stop jewel-tone sweep
// built from the site's own accent tokens (cyan/--accent-3, indigo/--accent,
// violet/--accent-2) plus one extra magenta stop past violet for a richer,
// more premium finish than the site's three-color system alone would give -
// the name is the one place on the page that earns a fourth, more saturated
// stop. sampleDots() below interpolates across however many stops this
// array has, so adding/removing stops here just works.
const THEME_STOPS = [
  [34, 211, 238], // cyan (--accent-3)
  [99, 102, 241], // indigo (--accent)
  [168, 85, 247], // violet (--accent-2)
  [217, 70, 239], // magenta - a premium fourth stop past the site's own three accents
] as const;
const SPARK_COLOR = [236, 242, 255] as const; // bright, slightly cool white - what a dot blends toward as it's displaced, read as a diamond-white spark rather than a warm one
const ACCENT_RGB = "99,102,241"; // --accent, used for the cursor glow/ring

// Simulation constants, matched 1:1 to the reference hero particle system's
// friction/returnSpeed (radius and force stay proportional to font size
// instead of copying the reference's fixed pixel values - its hero canvas
// is viewport-sized while this signature can render anywhere from 30px to
// 192px tall, so a fixed absolute radius/force would be wildly out of scale
// at either end).
const FRICTION = 0.85;
const RETURN_SPEED = 0.065;
// px/frame safety clamp only - friction bounds velocity in practice; the
// reference has no clamp at all. Must clear the worst-case peak force
// across every mode at max font size and max force slider, or the modes
// with the biggest multipliers get silently capped well before repel does,
// which is exactly what "the slider doesn't do anything for some modes"
// looks like - not a bug in the slider itself, a too-low ceiling truncating
// only some modes. Worst case is explode's one-time entry impulse (see
// EXPLODE_IMPULSE_MULT below): ~21 (max baseForce) * 1.3 (tuning) * 2.5
// (max force slider) * 2.0 (impulse mult) =~ 137, so this needs real
// headroom above that - and magnet at full strength (1.5 tuning) held down
// (HOLD_BOOST) at max force isn't far behind: ~21 * 1.5 * 2.5 * 2.5 =~ 197.
const MAX_SPEED = 220;
const HOLD_BOOST = 2.5; // click-and-hold multiplies strength, same as the reference's mouse.down handling
// One-time multiplier applied to `strength` for explode's entry impulse
// (see tick()) - separate from, and larger than, its continuous per-frame
// multiplier (1.1x, inline in the "explode" case) since the impulse is what
// now carries explode's "detonation" character instead of the ongoing field.
const EXPLODE_IMPULSE_MULT = 2.0;

type Mode = "repel" | "magnet" | "explode" | "vortex";

const MODES: { id: Mode; label: string }[] = [
  { id: "repel", label: "Repel" },
  { id: "magnet", label: "Magnet" },
  { id: "explode", label: "Explode" },
  { id: "vortex", label: "Vortex" },
];

// Per-mode multipliers on the shared base radius/force. Magnet gets a wider
// reach but weaker pull (0.6x, pulled the sign the other way in tick()) so
// gathered dots don't collapse onto the cursor into an ugly point. Explode
// gets a tighter radius but a stronger, jittered burst so it reads as
// violent without swallowing the whole signature. Vortex gets a touch more
// reach/force since most of its force is spent tangentially rather than
// displacing dots radially - nudged up a bit further so the swirl actually
// reads as fast at the default 150% force setting instead of a lazy drift.
const MODE_TUNING: Record<Mode, { radius: number; force: number }> = {
  repel: { radius: 1, force: 1 },
  magnet: { radius: 1.25, force: 1.5 },
  explode: { radius: 0.8, force: 1.3 },
  vortex: { radius: 1.1, force: 1.4 },
};

interface Dot {
  fx: number;
  fy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  // Explode-only: a per-dot direction offset assigned once at creation
  // (not re-rolled every frame) so a wide spread reads as a coherent
  // scatter instead of vibration, plus whether this dot was already
  // inside the cursor radius last frame, used to fire a one-time entry
  // impulse instead of a continuous push. See tick()'s "explode" case.
  explodeJitter: number;
  wasInRange: boolean;
}

// Slider ranges, expressed as a percentage of the auto-computed base
// radius/force. 100% is calibrated to match the reference site's own
// default (its radius:120/force:12); max is 250% (2.5x that), matching
// the reference's own slider ceiling (radius:300/force:30 = 2.5x its
// default). The default sits well above the 100% reference-match point,
// at a clear midpoint of the range - strong out of the box, with real
// room left to push further toward the max.
const RADIUS_MIN_PCT = 10;
const RADIUS_MAX_PCT = 250;
const FORCE_MIN_PCT = 10;
const FORCE_MAX_PCT = 250;
const DEFAULT_PCT = 150;

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
  const modeRef = useRef<Mode>("repel");
  const radiusPctRef = useRef(DEFAULT_PCT);
  const forcePctRef = useRef(DEFAULT_PCT);

  const [mode, setMode] = useState<Mode>("repel");
  const [controlsVisible, setControlsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [radiusPct, setRadiusPct] = useState(DEFAULT_PCT);
  const [forcePct, setForcePct] = useState(DEFAULT_PCT);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    radiusPctRef.current = radiusPct;
  }, [radiusPct]);

  useEffect(() => {
    forcePctRef.current = forcePct;
  }, [forcePct]);

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
    setControlsVisible(interactive);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots: Dot[] = [];
    let pointerX = -9999;
    let pointerY = -9999;
    let mouseDown = false;
    let currentRadius = 0; // set by tick() each frame, read by draw() for the cursor ring
    let raf = 0;
    let lastDraw = 0;
    let running = false;
    let visible = false;
    let dotSizePx = DOT_SIZE;
    const FRAME_MS = 16;

    // Base radius/force before the per-mode MODE_TUNING multiplier; both
    // scale linearly with the rendered font size (recomputed in
    // sampleDots), calibrated against the reference's radius:120/force:12
    // at its own rendered letter size so a much larger or smaller
    // signature keeps the same real strength rather than reading as a
    // pinprick against huge letters or a hurricane against small ones.
    let baseRadius = 60;
    let baseForce = 9;
    let colorNorm = 200;

    function sampleDots() {
      const rect = container!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const fontFamily =
        getComputedStyle(document.documentElement).getPropertyValue("--font-display") || "sans-serif";
      const sampleCtx = document.createElement("canvas").getContext("2d")!;
      // Fit text to 88% of the container instead of 98% - the freed-up 6%
      // margin on each side is horizontal bleed room for dots pushed
      // sideways, same purpose as the vertical bleed below.
      const { fontSize, lines } = wrapLines(sampleCtx, TEXT, fontFamily.trim() || "sans-serif", width * 0.88);

      const sizeScale = Math.min(2.3, Math.max(1, fontSize / REFERENCE_FONT_PX));
      dotSizePx = DOT_SIZE * Math.min(1.9, Math.max(1, sizeScale * 0.9));
      baseRadius = Math.max(35, Math.min(150, fontSize * 0.65));
      baseForce = Math.max(4, Math.min(24, fontSize * 0.11));
      // How far a dot has to travel from home before it reads as fully
      // "hot" white (see draw()'s spark blend). This used to be close to
      // baseRadius itself, so almost any real interaction - which routinely
      // pushes dots a good fraction of the (slider-scaled, up to 2.5x)
      // radius - saturated to solid white almost immediately, and the
      // site's whole cyan/indigo/violet/magenta gradient never really
      // showed while dots were moving. Set several times wider than
      // baseRadius instead, so color stays visible through most of the
      // interaction and white is reserved for genuinely extreme
      // displacement (a fast repel/explode fling), not the everyday case.
      colorNorm = Math.max(90, Math.min(420, fontSize * 2.4));

      const lineHeight = fontSize * 1.05;
      const textHeight = lineHeight * lines.length + fontSize * 0.3;
      // Blank vertical bleed above/below the sampled text - without it,
      // dots flung up or down by a strong repel/explode/vortex hit the
      // canvas edge and simply vanish instead of arcing back into view.
      const bleedY = baseRadius * 2;
      height = textHeight + bleedY * 2;

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
        const y = bleedY + fontSize * 0.62 + i * lineHeight;
        octx.fillText(line, width / 2, y);
      });

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      const pitchPx = DOT_PITCH * sizeScale * dpr;
      const next: Dot[] = [];
      let minFx = Infinity;
      let maxFx = -Infinity;
      for (let py = pitchPx / 2; py < off.height; py += pitchPx) {
        for (let px = pitchPx / 2; px < off.width; px += pitchPx) {
          const idx = (Math.floor(py) * off.width + Math.floor(px)) * 4 + 3;
          if (img[idx] > 120) {
            const fx = px / dpr;
            const fy = py / dpr;
            if (fx < minFx) minFx = fx;
            if (fx > maxFx) maxFx = fx;
            next.push({
              fx,
              fy,
              x: fx,
              y: fy,
              vx: 0,
              vy: 0,
              r: 0,
              g: 0,
              b: 0,
              explodeJitter: (Math.random() - 0.5) * (Math.PI * 0.6),
              wasInRange: false,
            });
          }
        }
      }

      // Assign each dot's base color from its position along the actual
      // sampled text span (not the padded canvas), so the THEME_STOPS sweep
      // runs edge-to-edge across the letters themselves. Walks however many
      // stops THEME_STOPS has (currently 4), not hard-coded to a fixed
      // count, so the gradient can grow another stop without touching this.
      const span = Math.max(1, maxFx - minFx);
      const segCount = THEME_STOPS.length - 1;
      for (const d of next) {
        const p = (d.fx - minFx) / span;
        const scaled = Math.min(segCount - 1e-6, Math.max(0, p * segCount));
        const seg = Math.floor(scaled);
        const localT = scaled - seg;
        const from = THEME_STOPS[seg];
        const to = THEME_STOPS[seg + 1];
        d.r = from[0] + (to[0] - from[0]) * localT;
        d.g = from[1] + (to[1] - from[1]) * localT;
        d.b = from[2] + (to[2] - from[2]) * localT;
      }

      dots = next;
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        const distFromHome = Math.hypot(d.x - d.fx, d.y - d.fy);
        const t = Math.min(1, distFromHome / colorNorm);
        // Blend each dot's own gradient color toward a bright spark as it's
        // displaced - idle dots stay in their cyan/indigo/violet lane,
        // disturbed ones light up regardless of which lane they started in.
        const r = d.r + (SPARK_COLOR[0] - d.r) * t;
        const g = d.g + (SPARK_COLOR[1] - d.g) * t;
        const b = d.b + (SPARK_COLOR[2] - d.b) * t;
        // Higher base alpha than a typical idle state - alpha is what
        // actually reads as "rich"/saturated against the near-black
        // background here (a low-alpha fill just looks washed toward
        // grey), so idle dots sit close to full-strength color already,
        // with only a little further to climb once displaced.
        const alpha = Math.min(1, 0.78 + t * 0.3);
        ctx.fillStyle = `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${alpha.toFixed(3)})`;
        ctx.fillRect(d.x - dotSizePx / 2, d.y - dotSizePx / 2, dotSizePx, dotSizePx);
      }

      // Cursor affordance - a soft glow, a ring at the influence radius, and
      // a center dot - drawn only while the pointer is actually over the
      // signature. Mirrors the reference hero's cursor visualization so the
      // interaction radius reads visually, not just through the dots
      // reacting; intensifies on click-and-hold, same trigger as the force
      // boost below.
      if (interactive && pointerX > 0 && pointerX < width && pointerY > 0 && pointerY < height) {
        const glowR = currentRadius * 0.35;
        const glow = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, glowR);
        glow.addColorStop(0, `rgba(${ACCENT_RGB},0.07)`);
        glow.addColorStop(1, `rgba(${ACCENT_RGB},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(${ACCENT_RGB},${mouseDown ? 0.45 : 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, currentRadius * 0.15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(${ACCENT_RGB},0.8)`;
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick() {
      const tuning = MODE_TUNING[modeRef.current];
      const radius = baseRadius * tuning.radius * (radiusPctRef.current / 100);
      // Click-and-hold intensifies the effect 2.5x, same as the reference.
      const strength =
        baseForce * tuning.force * (forcePctRef.current / 100) * (mouseDown ? HOLD_BOOST : 1);
      currentRadius = radius;

      for (const d of dots) {
        let ax = 0;
        let ay = 0;

        if (interactive) {
          const dx = d.x - pointerX;
          const dy = d.y - pointerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const inRange = dist < radius && dist > 0.1;

          // Explode gets a one-time entry impulse on top of the continuous
          // field below - the "detonation" moment repel/magnet/vortex don't
          // have, since they're pure continuous proximity effects with no
          // notion of "just arrived." wasInRange only means anything for
          // explode, so it's reset for every other mode to guarantee a
          // fresh pop the next time explode is selected.
          if (modeRef.current === "explode") {
            if (inRange && !d.wasInRange) {
              const angle = Math.atan2(dy, dx) + d.explodeJitter;
              const kick = strength * EXPLODE_IMPULSE_MULT;
              d.vx += Math.cos(angle) * kick;
              d.vy += Math.sin(angle) * kick;
            }
            d.wasInRange = inRange;
          } else if (d.wasInRange) {
            d.wasInRange = false;
          }

          if (inRange) {
            // Linear falloff to 0 at the radius edge - no hard cutoff pop as
            // dots cross the boundary.
            const f = (1 - dist / radius) * strength;
            const nx = dx / dist;
            const ny = dy / dist;
            switch (modeRef.current) {
              case "repel":
                ax = nx * f;
                ay = ny * f;
                break;
              case "magnet": {
                // A linear falloff to 0 at the radius edge (like every
                // other mode uses via the shared `f` above) meant
                // outer-radius dots never visibly moved - their pull was
                // too small to overcome the home spring within a normal
                // hover, so only the innermost, already-captured dots
                // showed any reaction; the rest looked untouched no matter
                // the force setting. Blend in a floor so every dot inside
                // the radius gets at least a small, immediately visible
                // lean toward the cursor - straining to follow but not
                // able to fully reach - growing smoothly up to the full
                // pull at the pole. The floor and the peak both scale with
                // `strength` (which already includes the force slider), so
                // the whole gradient - lean and cluster alike - still
                // scales with force exactly as before; this only changes
                // the *shape* of the falloff, not whether the slider
                // matters. Same normal, sign flipped (pulls toward cursor)
                // and damped to 0.85x so gathered dots cluster tightly
                // short of the cursor instead of collapsing onto a single
                // point - the always-on return spring is what actually
                // prevents collapse, so this can run close to full
                // strength.
                const proximity = 1 - dist / radius; // 0 at the radius edge, 1 at the cursor
                const MAGNET_FLOOR = 0.18;
                const fm = (MAGNET_FLOOR + (1 - MAGNET_FLOOR) * proximity) * strength;
                ax = -nx * fm * 0.85;
                ay = -ny * fm * 0.85;
                break;
              }
              case "explode": {
                // Light continuous scatter on top of the entry impulse
                // above, using the same stable per-dot jitter so the
                // direction doesn't flicker frame to frame. Most of
                // explode's punch now comes from the one-time kick, not
                // this ongoing field, which is what gives it a sudden
                // peak-then-decay feel instead of repel's steady push.
                const angle = Math.atan2(dy, dx) + d.explodeJitter;
                ax = Math.cos(angle) * f * 1.1;
                ay = Math.sin(angle) * f * 1.1;
                break;
              }
              case "vortex":
                // Mostly tangential (perpendicular to the normal) with a
                // small radial component - pure-tangential force would
                // just orbit forever without ever visibly grabbing dots.
                ax = -ny * f * 0.8 + nx * f * 0.2;
                ay = nx * f * 0.8 + ny * f * 0.2;
                break;
            }
          }
        }

        // Spring-to-home is unconditional every frame, cursor force is
        // added on top when in range - one continuous system rather than a
        // "disturbed" state and a separate "returning" animation.
        d.vx += ax + (d.fx - d.x) * RETURN_SPEED;
        d.vy += ay + (d.fy - d.y) * RETURN_SPEED;
        d.vx *= FRICTION;
        d.vy *= FRICTION;

        const speed = Math.hypot(d.vx, d.vy);
        if (speed > MAX_SPEED) {
          const scale = MAX_SPEED / speed;
          d.vx *= scale;
          d.vy *= scale;
        }

        d.x += d.vx;
        d.y += d.vy;
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

    function markInteracted() {
      setHasInteracted((prev) => (prev ? prev : true));
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      markInteracted();
    }
    function onPointerAway() {
      pointerX = -9999;
      pointerY = -9999;
      mouseDown = false;
    }
    function onPointerDown(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      mouseDown = true;
    }
    function onPointerUp(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      mouseDown = false;
    }

    function onResize() {
      sampleDots();
      if (!running) draw();
    }

    function onReducedMotionChange() {
      interactive = !reducedMotionQuery.matches && finePointerQuery.matches;
      setControlsVisible(interactive);
      if (!interactive) {
        for (const d of dots) {
          d.vx = 0;
          d.vy = 0;
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
      canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
    }

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onWindowResize);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      finePointerQuery.removeEventListener("change", onReducedMotionChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerAway);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div className="w-full select-none">
      <div ref={containerRef} className="pointer-events-none w-full" aria-hidden="true">
        <canvas ref={canvasRef} className="pointer-events-auto mx-auto block" />
      </div>
      <span className="sr-only">Sajidur Rahman Sajid</span>

      {controlsVisible && (
        <div className="mt-4 flex flex-col items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted/60 transition-opacity duration-700 ${
              hasInteracted ? "opacity-0" : "opacity-100"
            }`}
          >
            hover to disturb
          </span>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
            <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">
              Radius
              <input
                type="range"
                min={RADIUS_MIN_PCT}
                max={RADIUS_MAX_PCT}
                step={5}
                value={radiusPct}
                onChange={(e) => setRadiusPct(Number(e.target.value))}
                aria-label="Interaction radius"
                className="h-1 w-16 cursor-pointer sm:w-20"
                style={{ accentColor: "var(--accent)" }}
              />
              <span className="w-8 tabular-nums text-text-muted/70">{radiusPct}%</span>
            </label>

            <div
              role="group"
              aria-label="Particle interaction mode"
              className="inline-flex gap-1 rounded-full border border-line/70 bg-surface/40 p-0.5 backdrop-blur-sm"
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  aria-pressed={mode === m.id}
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-200 ${
                    mode === m.id
                      ? "bg-accent-dim text-accent-hover"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">
              Force
              <input
                type="range"
                min={FORCE_MIN_PCT}
                max={FORCE_MAX_PCT}
                step={5}
                value={forcePct}
                onChange={(e) => setForcePct(Number(e.target.value))}
                aria-label="Interaction force"
                className="h-1 w-16 cursor-pointer sm:w-20"
                style={{ accentColor: "var(--accent-2)" }}
              />
              <span className="w-8 tabular-nums text-text-muted/70">{forcePct}%</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
