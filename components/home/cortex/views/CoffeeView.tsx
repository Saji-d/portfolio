"use client";

import { useState } from "react";
import { motion } from "motion/react";

const STEAM_DELAYS = ["0s", "0.55s", "1.1s", "1.65s", "2.2s"];

const STEAM_PATHS = [
  "M38 50 C35 40 44 38 40 26",
  "M46 50 C44 37 53 35 49 18",
  "M54 50 C56 40 48 38 53 27",
  "M41 50 C40 44 47 43 44 33",
  "M58 50 C60 44 52 43 56 33",
];

// Liquid rect: bottom edge is pinned to the cup floor (BASE_Y); only the top
// edge (y) rises as the fill animates, so y + height stays constant at
// BASE_Y throughout the animation.
const BASE_Y = 89;
const EMPTY_TOP_Y = 87;
const FULL_TOP_Y = 47;
const LIQUID_LEFT = 29;
const LIQUID_RIGHT = 71;

function SteamPath({ d }: { d: string }) {
  return (
    <path d={d} fill="none" stroke="#c7d2fe" strokeWidth="2.6" strokeLinecap="round" />
  );
}

function CoffeeCup() {
  const [state, setState] = useState<"empty" | "filling" | "full">("empty");
  const steaming = state !== "empty";

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 108"
        className="h-[104px] w-[96px] overflow-visible"
        role="img"
        aria-label="A cup of coffee filling up and steaming"
      >
        <defs>
          <linearGradient id="coffee-mug-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#26263e" />
            <stop offset="0.5" stopColor="#18182b" />
            <stop offset="1" stopColor="#12121f" />
          </linearGradient>
          <linearGradient id="coffee-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c4f2d" />
            <stop offset="1" stopColor="#56391f" />
          </linearGradient>
          <radialGradient id="coffee-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(99, 102, 241, 0.18)" />
            <stop offset="1" stopColor="rgba(99, 102, 241, 0)" />
          </radialGradient>
          <clipPath id="coffee-cup-clip">
            <path d="M29 40 L29 78 Q29 89 40 89 L60 89 Q71 89 71 78 L71 40 Z" />
          </clipPath>
        </defs>

        <ellipse cx="50" cy="66" rx="40" ry="30" fill="url(#coffee-glow)" />

        {steaming && (
          <g>
            {STEAM_PATHS.map((d, i) => (
              <g
                key={d}
                className="coffee-steam"
                style={{ animationDelay: STEAM_DELAYS[i] }}
              >
                <g className="coffee-steam-sway">
                  <SteamPath d={d} />
                </g>
              </g>
            ))}
          </g>
        )}

        <path
          d="M74 58 Q90 55 90 66 Q90 79 74 74"
          fill="none"
          stroke="#2c2c46"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        <path
          d="M26 52 L26 78 Q26 92 40 92 L60 92 Q74 92 74 78 L74 52 Z"
          fill="url(#coffee-mug-body)"
          stroke="rgba(255, 255, 255, 0.07)"
        />

        <g clipPath="url(#coffee-cup-clip)">
          <motion.rect
            x={LIQUID_LEFT}
            width={LIQUID_RIGHT - LIQUID_LEFT}
            fill="url(#coffee-liquid)"
            initial={{ y: EMPTY_TOP_Y, height: BASE_Y - EMPTY_TOP_Y }}
            animate={{ y: FULL_TOP_Y, height: BASE_Y - FULL_TOP_Y }}
            transition={{ duration: 1.9, delay: 0.55, ease: [0.22, 0.68, 0.32, 1] }}
            onAnimationStart={() => setState("filling")}
            onAnimationComplete={() => setState("full")}
          />
        </g>

        <ellipse
          cx="50"
          cy="47"
          rx="24"
          ry="6.5"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
        />

        {state === "full" && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.ellipse
              cx="50"
              cy="47"
              rx="21.5"
              fill="url(#coffee-liquid)"
              stroke="rgba(255, 255, 255, 0.12)"
              initial={{ ry: 5.4 }}
              animate={{ ry: [5.4, 5.9, 5.4] }}
              transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
            />
            <path
              d="M31 46 Q50 42.5 69 46"
              fill="none"
              stroke="#fff"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="coffee-shimmer"
            />
          </motion.g>
        )}

        <path
          d="M33 58 L33 76"
          fill="none"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth="3"
          strokeLinecap="round"
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
        Caffeine is a build dependency here, not a dev dependency. Skip it and the
        whole pipeline stalls.
      </p>
    </div>
  );
}
