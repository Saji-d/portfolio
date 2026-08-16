"use client";

import { useState } from "react";
import { motion } from "motion/react";

// Three wisps only - restraint reads more premium than a dense plume. Each one
// gets its own rise/curl timing so they never march in lockstep.
const STEAM_WISPS = [
  {
    d: "M41 43 C36.5 35.5 44 31.5 40.5 24.5 C38.5 20.5 41.5 17.5 41 14.5",
    width: 2.1,
    riseDelay: "0s",
    riseDuration: "4.6s",
    curlDuration: "5.2s",
  },
  {
    d: "M50 45 C45.5 36 54 31 50 22.5 C47.5 17 51.5 13 51 9.5",
    width: 2.7,
    riseDelay: "1.1s",
    riseDuration: "5.2s",
    curlDuration: "6.4s",
  },
  {
    d: "M59 43 C63.5 35.5 56 31.5 59.5 25 C61.5 21 58.5 18 59 15",
    width: 1.9,
    riseDelay: "2.4s",
    riseDuration: "4.9s",
    curlDuration: "5.8s",
  },
];

// Liquid rect: bottom edge is pinned to the cup floor (BASE_Y); only the top
// edge (y) rises as the fill animates, so y + height stays constant at
// BASE_Y throughout the animation. FULL_TOP_Y deliberately stops well short of
// the rim - a glass poured to the brim looks like a mistake, not a pour.
const BASE_Y = 89;
const EMPTY_TOP_Y = 87;
const FULL_TOP_Y = 56;
const LIQUID_LEFT = 27;
const LIQUID_RIGHT = 73;
const SURFACE_RX = 21.3;
const SURFACE_RY = 5.4;

const FILL_TRANSITION = {
  duration: 1.9,
  delay: 0.55,
  ease: [0.22, 0.68, 0.32, 1],
} as const;

// Outer silhouette: tapered tumbler, closed across the top by the far rim arc.
const BODY_PATH =
  "M26 46 C26 64 28.6 79.5 31 85.2 Q32.5 88.6 36.8 88.6 L63.2 88.6 Q67.5 88.6 69 85.2 C71.4 79.5 74 64 74 46 A24 6.6 0 0 0 26 46 Z";

// Inner volume the coffee lives in, inset by the glass thickness.
const BOWL_PATH =
  "M28 46 A22 6 0 0 1 72 46 C72 63 69.6 79 67.2 84.4 Q65.9 87.4 62 87.4 L38 87.4 Q34.1 87.4 32.8 84.4 C30.4 79 28 63 28 46 Z";

function CoffeeCup() {
  const [state, setState] = useState<"empty" | "filling" | "full">("empty");
  const steaming = state !== "empty";

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 108"
        className="h-[104px] w-[96px] overflow-visible"
        role="img"
        aria-label="A glass cup of coffee filling up and steaming"
      >
        <defs>
          <linearGradient id="coffee-mug-body" x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0" stopColor="#22223a" />
            <stop offset="0.42" stopColor="#14142333" />
            <stop offset="1" stopColor="#0d0d18" />
          </linearGradient>
          <linearGradient id="coffee-liquid" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#8b5a30" />
            <stop offset="0.55" stopColor="#68411f" />
            <stop offset="1" stopColor="#3f2712" />
          </linearGradient>
          <radialGradient id="coffee-surface" cx="0.36" cy="0.28" r="0.85">
            <stop offset="0" stopColor="#b0743f" />
            <stop offset="0.6" stopColor="#7d4e26" />
            <stop offset="1" stopColor="#5c3819" />
          </radialGradient>
          <linearGradient id="coffee-depth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="1" stopColor="rgba(0, 0, 0, 0.5)" />
          </linearGradient>
          <linearGradient id="coffee-rim" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="rgba(255, 255, 255, 0.34)" />
            <stop offset="0.5" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="1" stopColor="rgba(199, 210, 254, 0.26)" />
          </linearGradient>
          <linearGradient id="coffee-specular" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="0.45" stopColor="rgba(255, 255, 255, 0.13)" />
            <stop offset="1" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <linearGradient id="coffee-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(165, 180, 252, 0)" />
            <stop offset="1" stopColor="rgba(165, 180, 252, 0.18)" />
          </linearGradient>
          <radialGradient id="coffee-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(99, 102, 241, 0.2)" />
            <stop offset="1" stopColor="rgba(99, 102, 241, 0)" />
          </radialGradient>
          <radialGradient id="coffee-warm" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(217, 152, 86, 0.3)" />
            <stop offset="0.55" stopColor="rgba(190, 124, 70, 0.11)" />
            <stop offset="1" stopColor="rgba(190, 124, 70, 0)" />
          </radialGradient>
          {/* Vertical fade so each wisp dissolves at both ends instead of
              stopping on a hard stroke cap. */}
          <linearGradient
            id="coffee-steam-fade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="46"
            x2="0"
            y2="8"
          >
            <stop offset="0" stopColor="#e2cdb6" stopOpacity="0" />
            <stop offset="0.22" stopColor="#dbd3e8" stopOpacity="0.75" />
            <stop offset="0.62" stopColor="#c7d2fe" stopOpacity="0.45" />
            <stop offset="1" stopColor="#a5b4fc" stopOpacity="0" />
          </linearGradient>
          <filter
            id="coffee-steam-soft"
            x="-100%"
            y="-150%"
            width="300%"
            height="400%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="1.15" />
          </filter>
          <clipPath id="coffee-cup-clip">
            <path d={BOWL_PATH} />
          </clipPath>
          <clipPath id="coffee-body-clip">
            <path d={BODY_PATH} />
          </clipPath>
        </defs>

        <ellipse cx="50" cy="62" rx="42" ry="33" fill="url(#coffee-glow)" />

        {steaming && (
          <g filter="url(#coffee-steam-soft)">
            {STEAM_WISPS.map((wisp) => (
              <g
                key={wisp.d}
                className="coffee-steam"
                data-cortex-anim
                style={{
                  animationDelay: wisp.riseDelay,
                  animationDuration: wisp.riseDuration,
                }}
              >
                <g
                  className="coffee-steam-curl"
                  data-cortex-anim
                  style={{
                    animationDelay: wisp.riseDelay,
                    animationDuration: wisp.curlDuration,
                  }}
                >
                  <path
                    d={wisp.d}
                    fill="none"
                    stroke="url(#coffee-steam-fade)"
                    strokeWidth={wisp.width}
                    strokeLinecap="round"
                  />
                </g>
              </g>
            ))}
          </g>
        )}

        <path
          d="M73 57 C87 55.5 87.5 76.5 73 74.5"
          fill="none"
          stroke="#1e1e30"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M73.5 58.6 C84.6 57.6 85 74.6 73.5 73.4"
          fill="none"
          stroke="rgba(199, 210, 254, 0.11)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        <path d={BODY_PATH} fill="url(#coffee-mug-body)" />

        <g clipPath="url(#coffee-cup-clip)">
          <motion.rect
            x={LIQUID_LEFT}
            width={LIQUID_RIGHT - LIQUID_LEFT}
            fill="url(#coffee-liquid)"
            initial={{ y: EMPTY_TOP_Y, height: BASE_Y - EMPTY_TOP_Y }}
            animate={{ y: FULL_TOP_Y, height: BASE_Y - FULL_TOP_Y }}
            transition={FILL_TRANSITION}
            onAnimationStart={() => setState("filling")}
            onAnimationComplete={() => setState("full")}
          />
          <rect
            x={LIQUID_LEFT}
            y="68"
            width={LIQUID_RIGHT - LIQUID_LEFT}
            height="21"
            fill="url(#coffee-depth)"
          />
          <motion.ellipse
            cx="50"
            rx={SURFACE_RX}
            ry={SURFACE_RY}
            fill="url(#coffee-surface)"
            initial={{ cy: EMPTY_TOP_Y }}
            animate={{ cy: FULL_TOP_Y }}
            transition={FILL_TRANSITION}
          />
          {state === "full" && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ellipse
                cx="50"
                cy={FULL_TOP_Y}
                rx={SURFACE_RX}
                ry={SURFACE_RY}
                fill="none"
                stroke="rgba(255, 214, 170, 0.22)"
                strokeWidth="0.8"
              />
              <path
                d="M35 54.4 Q50 51.4 65 54.4"
                fill="none"
                stroke="#ffe9d2"
                strokeWidth="1.1"
                strokeLinecap="round"
                className="coffee-shimmer"
                data-cortex-anim
              />
            </motion.g>
          )}
        </g>

        {state === "full" && (
          <ellipse
            cx="50"
            cy={FULL_TOP_Y}
            rx="27"
            ry="12"
            fill="url(#coffee-warm)"
            className="coffee-warmth"
            data-cortex-anim
          />
        )}

        {/* Glass overlay: highlights sit above the liquid so the coffee reads
            as being behind the wall rather than painted onto it. */}
        <g clipPath="url(#coffee-body-clip)">
          <rect x="26" y="39" width="11" height="52" fill="url(#coffee-specular)" />
          <rect x="63" y="39" width="11" height="52" fill="url(#coffee-edge)" />
        </g>

        <path
          d={BODY_PATH}
          fill="none"
          stroke="rgba(199, 210, 254, 0.11)"
          strokeWidth="1"
        />
        <path
          d="M35 86.4 Q50 89.4 65 86.4"
          fill="none"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <ellipse
          cx="50"
          cy="46"
          rx="24"
          ry="6.6"
          fill="none"
          stroke="url(#coffee-rim)"
          strokeWidth="1.4"
        />
        {/* Single specular glint along the upper-left of the rim. */}
        <ellipse
          cx="50"
          cy="46"
          rx="24"
          ry="6.6"
          fill="none"
          stroke="rgba(255, 255, 255, 0.42)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="24 104"
          strokeDashoffset="-53"
        />
        <ellipse
          cx="50"
          cy="46"
          rx="22"
          ry="6"
          fill="none"
          stroke="rgba(0, 0, 0, 0.35)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}

export default function CoffeeView() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <CoffeeCup />
      </motion.div>
      <p className="max-w-sm text-sm leading-relaxed text-text-muted">
        Two cups in, the bug fixes itself. <br></br>
        Four cups in, I start fixing things that were never broken.
      </p>
    </div>
  );
}
