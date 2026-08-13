// Generates cinematic WebP thumbnails for the portfolio project grid.
// Source SVGs are written to ./artwork and rasterized to ./public/images/art.
// Run: node scripts/generate-art.mjs

import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = join(ROOT, "artwork");
const WEBP_DIR = join(ROOT, "public", "images", "art");

const W = 1600;
const H = 1000;

const T = "#D97A4F";
const I = "#A95C3D";
const AMB = "#E8B44B";
const GRN = "#3FB28A";
const RED = "#E05B5B";
const PINK = "#F2A0C0";
const B = "#090909";
const S1 = "#141414";
const S2 = "#191919";
const S3 = "#202020";
const TXT2 = "#A29C93";
const MUT = "#706B64";
const LINE = "rgba(255,255,255,0.10)";
const LINE2 = "rgba(255,255,255,0.20)";

const rr = (x, y, w, h, rx, fill, o = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${o}/>`;
const c = (x, y, rad, fill, o = "") =>
  `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" ${o}/>`;
const ce = (x, y, rad, stroke, o = "") =>
  `<circle cx="${x}" cy="${y}" r="${rad}" fill="none" stroke="${stroke}" ${o}/>`;
const ln = (x1, y1, x2, y2, stroke, w = 2, o = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" ${o}/>`;
const bar = (x, y, w, h, fill, o = "") => rr(x, y, w, h, 5, fill, o);
const pill = (x, y, w, h, fill, o = "") => rr(x, y, w, h, h / 2, fill, o);
const g = (inner, x = 0, y = 0, deg = 0) => {
  const t =
    x || y ? ` transform="translate(${x} ${y})${deg ? ` rotate(${deg})` : ""}"` : "";
  return `<g${t}>${inner}</g>`;
};

const FILTER = `<filter id="sh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="26" stdDeviation="30" flood-color="#000000" flood-opacity="0.5"/></filter>`;

function bg(acc, sec, extra = "") {
  return `
  <defs>
    <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B0B0B"/>
      <stop offset="0.55" stop-color="${B}"/>
      <stop offset="1" stop-color="#12100E"/>
    </linearGradient>
    <radialGradient id="gA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${acc}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${acc}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${sec}" stop-opacity="0.24"/>
      <stop offset="1" stop-color="${sec}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="46" height="46" patternUnits="userSpaceOnUse">
      <circle cx="2.5" cy="2.5" r="1.8" fill="#ffffff" fill-opacity="0.05"/>
    </pattern>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.72">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.45"/>
    </radialGradient>
    ${FILTER}
    ${extra}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bgG)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <ellipse cx="240" cy="170" rx="600" ry="430" fill="url(#gA)"/>
  <ellipse cx="1380" cy="850" rx="620" ry="470" fill="url(#gB)"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  `;
}

function chrome(x, y, w) {
  return `
    ${c(x + 30, y + 26, 7, RED)}
    ${c(x + 54, y + 26, 7, AMB)}
    ${c(x + 78, y + 26, 7, GRN)}
    ${rr(x + 108, y + 14, w - 108 - 60, 24, 12, "#0E0E0E", `stroke="${LINE}"`)}
    <circle cx="${x + w - 34}" cy="${y + 26}" r="7" fill="#2A2A2A"/>
  `;
}

const clip = (id, x, y, w, h) =>
  `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

const arts = {};

// ---------------------------------------------------------------------------
// LedgerTurf — turf booking platform: map + live slots browser mockup
// ---------------------------------------------------------------------------
arts.ledgerturf = svg(
  bg(T, I) +
    clip("c1", 330, 250, 940, 530) +
    g(
      `
      ${rr(330, 200, 940, 580, 22, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${chrome(330, 200, 940)}
      <g clip-path="url(#c1)">
        ${rr(372, 286, 520, 458, 18, "#0E0E0E", `stroke="${LINE}"`)}
        ${g(
          [0, 1, 2, 3, 4, 5].map((i) => ln(372 + i * 104, 286, 372 + i * 104, 744, LINE, 2)).join("")
        )}
        ${g(
          [0, 1, 2, 3, 4].map((i) => ln(372, 286 + i * 92, 892, 286 + i * 92, LINE, 2)).join("")
        )}
        ${rr(428, 392, 404, 256, 14, "#0E352B", `stroke="${GRN}" stroke-opacity="0.5"`)}
        ${rr(428, 392, 404, 42, 14, "#11402F", `opacity="0.7"`)}
        ${rr(428, 476, 404, 42, 14, "#11402F", `opacity="0.5"`)}
        ${rr(428, 560, 404, 42, 14, "#11402F", `opacity="0.7"`)}
        ${rr(428, 644, 404, 4, 2, "#3FB28A", `opacity="0.5"`)}
        <path d="M630 468 c-3 -8 -4 -16 -4 -22 a34 34 0 1 1 68 0 c0 6 -1 14 -4 22 l-12 30 c-2 6 -6 10 -12 10 s-10 -4 -12 -10 z" fill="${T}"/>
        ${c(630, 448, 9, "#090909")}
        ${c(654, 402, 7, T, "opacity='0.5'")}
        ${c(586, 402, 5, T, "opacity='0.4'")}
        ${ce(630, 448, 60, T, `stroke-opacity="0.35"`)}
        ${rr(930, 286, 300, 458, 18, S2, `stroke="${LINE}"`)}
        ${bar(952, 308, 180, 12, MUT)}
        ${pill(952, 340, 256, 42, "rgba(217,122,79,0.10)", `stroke="${T}" stroke-opacity="0.5"`)}
        ${pill(952, 398, 256, 42, T)}
        ${bar(966, 412, 120, 8, "#0B6B5F")}
        ${bar(966, 424, 160, 8, "#0B6B5F")}
        ${pill(952, 456, 256, 42, "rgba(217,122,79,0.10)", `stroke="${T}" stroke-opacity="0.5"`)}
        ${pill(952, 514, 256, 42, "rgba(217,122,79,0.10)", `stroke="${T}" stroke-opacity="0.5"`)}
        ${rr(952, 576, 256, 44, 22, T)}
        ${bar(1004, 592, 152, 10, "#0B6B5F")}
      </g>
      ${c(212, 152, 12, T, "opacity='0.55'")}
      ${c(1520, 236, 9, I, "opacity='0.5'")}
      ${ce(1410, 190, 26, T, "stroke-opacity='0.4'")}
      ${c(120, 820, 14, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// Face Recognition System — viewfinder with detection frame + scan line
// ---------------------------------------------------------------------------
arts["face-recognition-system"] = svg(
  bg(T, I) +
    clip("c2", 350, 220, 900, 560) +
    g(
      `
      ${rr(350, 220, 900, 560, 26, "#0E0E0E", `stroke="${LINE2}" filter="url(#sh)"`)}
      <g clip-path="url(#c2)">
        ${g([0, 1, 2, 3, 4, 5, 6].map((i) => ln(350 + i * 130, 220, 350 + i * 130, 780, LINE, 2)).join(""))}
        ${g([0, 1, 2, 3, 4].map((i) => ln(350, 220 + i * 112, 1250, 220 + i * 112, LINE, 2)).join(""))}
        <path d="M640 310 l-36 0 0 36" stroke="${GRN}" stroke-width="5" fill="none"/>
        <path d="M960 310 l36 0 0 36" stroke="${GRN}" stroke-width="5" fill="none"/>
        <path d="M640 630 l-36 0 0 -36" stroke="${GRN}" stroke-width="5" fill="none"/>
        <path d="M960 630 l36 0 0 -36" stroke="${GRN}" stroke-width="5" fill="none"/>
        ${rr(656, 292, 120, 26, 13, GRN)}
        ${bar(676, 303, 60, 7, "#0B2E21")}
        ${rr(800, 420, 250, 42, 12, "#090909", `stroke="${T}"`)}
        ${bar(820, 437, 90, 8, T)}
        ${c(800, 440, 92, "#1A1A1A", `stroke="${LINE2}"`)}
        ${c(800, 438, 88, "#1C1C1C")}
        ${c(762, 404, 9, T)}
        ${c(838, 404, 9, T)}
        ${ln(748, 452, 788, 448, T, 4)}
        ${ln(812, 448, 852, 452, T, 4)}
        <path d="M760 470 q40 42 80 0" stroke="${T}" stroke-width="4" fill="none"/>
        ${rr(608, 250, 44, 44, 10, S3, `stroke="${LINE}"`)}
        ${c(630, 272, 7, T)}
        ${rr(1048, 560, 44, 44, 10, S3, `stroke="${LINE}"`)}
        ${c(1070, 582, 7, T)}
        <rect x="350" y="500" width="900" height="4" fill="url(#gA)"/>
      </g>
      ${c(240, 250, 10, T, "opacity='0.5'")}
      ${c(1460, 720, 12, I, "opacity='0.5'")}
      ${ce(1380, 260, 22, T, "stroke-opacity='0.4'")}
      `
    )
);

// ---------------------------------------------------------------------------
// FinBERT / NLP — transformer attention graph + sentiment bars
// ---------------------------------------------------------------------------
arts.finbert = svg(
  bg(I, T) +
    clip("c3", 420, 250, 760, 500) +
    g(
      `
      ${rr(420, 250, 760, 500, 26, "#0E0E0E", `stroke="${LINE2}" filter="url(#sh)"`)}
      <g clip-path="url(#c3)">
        ${c(800, 470, 150, "rgba(169,92,61,0.12)")}
        ${ce(800, 470, 150, I, "stroke-opacity='0.5'")}
        ${ce(800, 470, 112, I, "stroke-opacity='0.35'")}
        ${ce(800, 470, 74, T, "stroke-opacity='0.5'")}
        ${c(800, 470, 34, T, "opacity='0.9'")}
        ${c(800, 470, 12, "#090909")}
        ${ce(800, 470, 262, T, "stroke-opacity='0.25'")}
        ${g(
          [
            [560, 300], [1040, 300], [560, 640], [1040, 640], [460, 470], [1140, 470],
          ].map(([x, y], i) => {
            const col = i % 2 ? T : I;
            const c1 = `M${x} ${y} Q ${800} ${470 - 120} ${800} ${470}`;
            return `
              <path d="${c1}" stroke="${col}" stroke-width="2" fill="none" stroke-opacity="0.4"/>
              ${ce(x, y, 30, col, "stroke-opacity='0.6'")}
              ${c(x, y, 16, col)}
            `;
          }).join("")
        )}
      </g>
      ${g(
        `
        ${rr(300, 700, 250, 170, 18, S2, `stroke="${LINE}" filter="url(#sh)"`)}
        ${bar(322, 722, 120, 10, MUT)}
        ${rr(322, 748, 22, 90, 11, GRN)}
        ${rr(356, 748, 22, 70, 11, GRN)}
        ${rr(390, 748, 22, 104, 11, GRN)}
        ${rr(424, 748, 22, 52, 11, RED)}
        ${rr(458, 748, 22, 84, 11, RED)}
        ${rr(492, 748, 22, 118, 11, RED)}
        ${ln(322, 742, 514, 742, LINE, 2)}
        `,
        0, 0, -1
      )}
      ${g(
        `
        ${rr(1060, 700, 250, 170, 18, S2, `stroke="${LINE}" filter="url(#sh)"`)}
        <path d="M1090 830 L1120 790 L1150 812 L1180 760 L1210 782 L1240 730" stroke="${T}" stroke-width="4" fill="none"/>
        ${c(1240, 730, 6, T)}
        <path d="M1246 716 l10 20 -22 -2 z" fill="${T}"/>
        ${bar(1090, 742, 190, 8, MUT)}
        `,
        0, 0, 1
      )}
      ${c(230, 200, 12, T, "opacity='0.5'")}
      ${c(1410, 300, 10, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// Employee & Family Registry — org tree + document export
// ---------------------------------------------------------------------------
arts["employee-family-registry"] = svg(
  bg(T, I) +
    clip("c4", 900, 250, 430, 500) +
    g(
      `
      ${c(540, 380, 52, I, "opacity='0.2'")}
      ${ce(540, 380, 52, I, "stroke-opacity='0.6'")}
      ${c(540, 380, 30, I)}
      ${c(540, 380, 12, "#090909")}
      ${ln(540, 432, 452, 556, LINE2, 3)}
      ${ln(540, 432, 628, 556, LINE2, 3)}
      ${ln(452, 608, 368, 716, LINE2, 2)}
      ${ln(452, 608, 540, 716, LINE2, 2)}
      ${ln(628, 608, 716, 716, LINE2, 2)}
      ${ln(628, 608, 812, 716, LINE2, 2)}
      ${c(452, 592, 40, S3, `stroke="${T}" stroke-opacity="0.5"`)}
      ${c(452, 592, 16, T)}
      ${c(628, 592, 40, S3, `stroke="${T}" stroke-opacity="0.5"`)}
      ${c(628, 592, 16, T)}
      ${c(368, 752, 30, S2, `stroke="${LINE}"`)}
      ${c(368, 752, 11, MUT)}
      ${c(540, 752, 30, S2, `stroke="${LINE}"`)}
      ${c(540, 752, 11, MUT)}
      ${c(716, 752, 30, S2, `stroke="${LINE}"`)}
      ${c(716, 752, 11, MUT)}
      ${c(812, 752, 30, S2, `stroke="${LINE}"`)}
      ${c(812, 752, 11, MUT)}
      ${rr(900, 250, 430, 500, 18, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      <g clip-path="url(#c4)">
        ${bar(926, 278, 150, 12, TXT2)}
        ${c(926, 322, 26, S3, `stroke="${LINE}"`)}
        ${bar(966, 306, 120, 10, TXT2)}
        ${bar(966, 324, 200, 10, MUT)}
        ${ln(926, 372, 1304, 372, LINE, 2)}
        ${bar(926, 398, 90, 9, MUT)}
        ${bar(1026, 398, 90, 9, MUT)}
        ${bar(1126, 398, 90, 9, MUT)}
        ${bar(1226, 398, 60, 9, MUT)}
        ${ln(926, 424, 1304, 424, LINE, 2)}
        ${bar(926, 448, 130, 9, MUT)}
        ${bar(926, 470, 220, 9, MUT)}
        ${bar(926, 492, 180, 9, MUT)}
        ${rr(926, 640, 180, 44, 22, T)}
        ${bar(952, 658, 120, 9, "#0B6B5F")}
        ${c(1146, 662, 24, "rgba(217,122,79,0.12)", `stroke="${T}" stroke-opacity="0.5"`)}
        <path d="M1136 662 l8 8 16 -18" stroke="${T}" stroke-width="4" fill="none"/>
      </g>
      ${c(240, 220, 12, T, "opacity='0.5'")}
      ${c(1480, 180, 10, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// CodingVibes — Java GUI with coffee cup + code editor
// ---------------------------------------------------------------------------
arts["codingvibes-java-gui"] = svg(
  bg(AMB, T) +
    clip("c5", 420, 240, 760, 520) +
    g(
      `
      ${rr(420, 240, 760, 520, 20, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${c(450, 266, 7, RED)}
      ${c(474, 266, 7, AMB)}
      ${c(498, 266, 7, GRN)}
      ${bar(560, 258, 320, 12, MUT)}
      <g clip-path="url(#c5)">
        ${rr(420, 290, 150, 470, 0, "#101010")}
        ${bar(444, 322, 90, 10, MUT)}
        ${bar(444, 350, 70, 10, MUT)}
        ${bar(444, 378, 100, 10, MUT)}
        ${bar(444, 406, 60, 10, MUT)}
        ${ln(420, 440, 570, 440, LINE, 2)}
        ${bar(444, 468, 90, 10, MUT)}
        ${bar(444, 496, 76, 10, MUT)}
        ${bar(444, 524, 98, 10, MUT)}
        ${rr(600, 320, 540, 380, 12, "#121212")}
        ${bar(628, 348, 180, 10, T)}
        ${bar(628, 372, 240, 10, I)}
        ${bar(628, 396, 120, 10, MUT)}
        ${bar(628, 428, 260, 10, AMB)}
        ${bar(628, 452, 200, 10, MUT)}
        ${bar(628, 476, 300, 10, T)}
        ${bar(628, 500, 160, 10, MUT)}
        ${bar(628, 524, 230, 10, I)}
        ${bar(628, 556, 90, 10, AMB)}
        <rect x="628" y="348" width="10" height="10" fill="#090909"/>
        ${rr(760, 470, 200, 140, 18, S2, `stroke="${LINE}" filter="url(#sh)"`)}
        <path d="M812 520 q-18 -6 -24 10 q-4 12 10 12 l40 0 q14 0 10 -12 q-6 -16 -24 -10 l4 -22 q4 -26 26 -22 q-10 12 6 16 q16 4 20 -10" stroke="${AMB}" stroke-width="6" fill="none"/>
        ${ce(940, 512, 18, AMB, "stroke-width='6'")}
        <path d="M806 548 q18 22 44 22 q26 0 44 -22" stroke="${AMB}" stroke-width="6" fill="none"/>
      </g>
      ${c(240, 240, 12, AMB, "opacity='0.5'")}
      ${c(1460, 760, 12, T, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// Spark Powerhouse Gym (C#) — desktop dashboard with barbell
// ---------------------------------------------------------------------------
arts["spark-powerhouse-gym-csharp"] = svg(
  bg(T, I) +
    clip("c6", 400, 220, 800, 560) +
    g(
      `
      ${rr(400, 220, 800, 560, 20, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${c(430, 246, 7, RED)}
      ${c(454, 246, 7, AMB)}
      ${c(478, 246, 7, GRN)}
      ${bar(540, 238, 260, 12, MUT)}
      <g clip-path="url(#c6)">
        ${rr(400, 270, 150, 510, 0, "#101010")}
        ${bar(424, 300, 96, 10, MUT)}
        ${bar(424, 328, 72, 10, MUT)}
        ${bar(424, 356, 102, 10, MUT)}
        ${bar(424, 384, 60, 10, MUT)}
        ${ln(400, 420, 550, 420, LINE, 2)}
        ${bar(424, 448, 96, 10, MUT)}
        ${bar(424, 476, 80, 10, MUT)}
        ${rr(580, 292, 240, 108, 14, S2, `stroke="${LINE}"`)}
        ${bar(600, 312, 90, 12, TXT2)}
        ${bar(600, 338, 140, 10, MUT)}
        ${bar(600, 356, 120, 10, MUT)}
        ${c(770, 346, 30, "rgba(217,122,79,0.14)", `stroke="${T}" stroke-opacity="0.5"`)}
        ${rr(840, 292, 240, 108, 14, S2, `stroke="${LINE}"`)}
        ${bar(860, 312, 90, 12, TXT2)}
        ${bar(860, 338, 140, 10, MUT)}
        ${bar(860, 356, 120, 10, MUT)}
        ${c(1030, 346, 30, "rgba(169,92,61,0.14)", `stroke="${I}" stroke-opacity="0.5"`)}
        ${rr(1100, 292, 70, 108, 14, S2, `stroke="${LINE}"`)}
        ${bar(1116, 312, 38, 12, TXT2)}
        ${bar(1116, 338, 38, 10, MUT)}
        ${rr(580, 420, 590, 240, 16, S2, `stroke="${LINE}"`)}
        ${ln(600, 440, 1150, 440, LINE, 2)}
        ${bar(600, 468, 120, 9, MUT)}
        ${g(
          [0, 1, 2, 3, 4, 5].map((i) => {
            const h = [96, 150, 120, 190, 140, 170][i];
            return rr(606 + i * 92, 640 - h, 56, h, 10, i % 2 ? T : I);
          }).join("")
        )}
        ${rr(596, 400, 28, 28, 8, T)}
        <rect x="596" y="400" width="140" height="12" rx="6" fill="${T}"/>
        ${c(736, 406, 24, T)}
        ${ce(736, 406, 24, T, "stroke-width='4'")}
        ${ce(736, 406, 36, LINE, "stroke-width='3'")}
        ${c(622, 406, 22, I)}
        ${ce(622, 406, 22, I, "stroke-width='4'")}
      </g>
      ${c(250, 240, 12, T, "opacity='0.5'")}
      ${c(1460, 760, 12, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// Spark Powerhouse Gym (Web) — browser hero + feature cards
// ---------------------------------------------------------------------------
arts["spark-powerhouse-gym-web"] = svg(
  bg(T, I) +
    clip("c7", 340, 230, 920, 540) +
    g(
      `
      ${rr(340, 230, 920, 540, 22, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${chrome(340, 230, 920)}
      <g clip-path="url(#c7)">
        ${rr(372, 262, 856, 24, 12, "#0E0E0E", `stroke="${LINE}"`)}
        ${c(392, 274, 5, T)}
        ${bar(404, 270, 420, 8, MUT)}
        ${c(1180, 274, 5, GRN)}
        ${bar(384, 312, 320, 22, TXT2)}
        ${bar(384, 348, 260, 16, MUT)}
        ${bar(384, 372, 300, 16, MUT)}
        ${rr(384, 420, 150, 46, 23, T)}
        ${bar(404, 436, 90, 10, "#0B6B5F")}
        ${rr(548, 420, 150, 46, 23, S2, `stroke="${T}"`)}
        ${bar(570, 436, 90, 10, T)}
        ${rr(760, 300, 500, 300, 18, "#0E0E0E", `stroke="${LINE}"`)}
        ${rr(760, 300, 500, 42, 18, "#171310", `fill-opacity="0.8"`)}
        ${rr(760, 300, 500, 42, 18, T, `fill-opacity="0.14"`)}
        <rect x="860" y="390" width="300" height="16" rx="8" fill="${T}"/>
        ${c(940, 460, 34, I, "opacity='0.9'")}
        ${c(1010, 430, 26, I, "opacity='0.7'")}
        ${c(980, 500, 20, I, "opacity='0.6'")}
        ${rr(384, 660, 262, 84, 14, S2, `stroke="${LINE}"`)}
        ${bar(404, 684, 100, 10, TXT2)}
        ${bar(404, 706, 200, 9, MUT)}
        ${rr(660, 660, 262, 84, 14, S2, `stroke="${LINE}"`)}
        ${bar(680, 684, 100, 10, TXT2)}
        ${bar(680, 706, 200, 9, MUT)}
        ${rr(936, 660, 262, 84, 14, S2, `stroke="${LINE}"`)}
        ${bar(956, 684, 100, 10, TXT2)}
        ${bar(956, 706, 200, 9, MUT)}
      </g>
      ${c(220, 200, 12, T, "opacity='0.5'")}
      ${c(1460, 250, 10, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// Online Bookstore Database — ER diagram with tables + book stack
// ---------------------------------------------------------------------------
arts["online-bookstore-database-design"] = svg(
  bg(I, T) +
    clip("c8", 330, 300, 640, 400) +
    g(
      `
      ${ln(680, 460, 800, 420, LINE2, 3)}
      ${ln(680, 460, 640, 620, LINE2, 3)}
      ${ln(680, 460, 980, 620, LINE2, 3)}
      <path d="M800 418 l12 4 -8 10 z" fill="${T}"/>
      <path d="M640 622 l-12 -4 8 -10 z" fill="${I}"/>
      <path d="M980 622 l-12 -4 8 -10 z" fill="${I}"/>
      ${rr(520, 360, 320, 200, 16, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      ${rr(520, 360, 320, 44, 16, T, `fill-opacity="0.18"`)}
      ${bar(546, 376, 90, 10, T)}
      ${bar(546, 424, 240, 9, MUT)}
      ${bar(546, 446, 210, 9, MUT)}
      ${bar(546, 468, 250, 9, MUT)}
      ${bar(546, 490, 200, 9, MUT)}
      ${rr(460, 600, 340, 200, 16, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      ${rr(460, 600, 340, 44, 16, I, `fill-opacity="0.18"`)}
      ${bar(486, 616, 90, 10, I)}
      ${bar(486, 664, 240, 9, MUT)}
      ${bar(486, 686, 210, 9, MUT)}
      ${bar(486, 708, 250, 9, MUT)}
      ${rr(860, 600, 280, 200, 16, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      ${rr(860, 600, 280, 44, 16, T, `fill-opacity="0.18"`)}
      ${bar(886, 616, 90, 10, T)}
      ${bar(886, 664, 200, 9, MUT)}
      ${bar(886, 686, 180, 9, MUT)}
      ${bar(886, 708, 220, 9, MUT)}
      ${rr(330, 300, 220, 60, 8, "#1C2334", `transform="rotate(-6 440 330)"`)}
      ${rr(330, 340, 220, 60, 8, "#222222", `transform="rotate(2 440 370)"`)}
      ${rr(330, 380, 220, 60, 8, I, `fill-opacity="0.9" transform="rotate(-2 440 410)"`)}
      ${bar(360, 406, 90, 8, "#090909", `opacity="0.6" transform="rotate(-2 440 410)"`)}
      ${rr(1190, 340, 170, 260, 16, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      <path d="M1275 396 q-22 0 -34 14 q-12 -14 -34 -14 q-18 0 -28 12 q16 0 26 10 q10 10 0 26 q-12 20 -30 34 l0 44 l0 0 l66 0 l0 0 l0 -44 q-18 -14 -30 -34 q-10 -16 0 -26 q10 -10 26 -10 z" fill="${T}" opacity="0.9"/>
      <path d="M1275 396 q-22 0 -34 14 q-12 -14 -34 -14 q-18 0 -28 12 q16 0 26 10 q10 10 0 26 q-12 20 -30 34 l0 44 l0 0 l66 0 l0 0 l0 -44 q-18 -14 -30 -34 q-10 -16 0 -26 q10 -10 26 -10 z" fill="none" stroke="${T}" stroke-width="2"/>
      ${c(300, 250, 12, I, "opacity='0.5'")}
      ${c(1420, 820, 12, T, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// My Wedding Invitation — envelope, rings, hearts, sparkles
// ---------------------------------------------------------------------------
arts["my-wedding-invitation"] = svg(
  bg(PINK, AMB) +
    g(
      `
      ${rr(540, 260, 520, 380, 24, "#1C1722", `stroke="${LINE2}" filter="url(#sh)"`)}
      <path d="M540 300 q130 110 260 0 q130 110 260 0 l0 340 q0 26 -26 26 l-468 0 q-26 0 -26 -26 z" fill="#241D2B"/>
      <path d="M540 300 q130 100 260 0 q130 100 260 0 l-260 210 z" fill="#2C2335"/>
      <path d="M800 540 q-10 -20 -34 -34 q-14 -26 4 -44 q-8 -12 4 -14 q-10 -12 -8 -30 q-20 6 -22 28 q-20 10 -10 34 q4 26 30 44 q8 14 24 26 q10 18 26 14 q-6 -20 -14 -24 z" fill="${T}" opacity="0.9"/>
      <path d="M800 540 q-10 -20 -34 -34 q-14 -26 4 -44 q-8 -12 4 -14 q-10 -12 -8 -30 q-20 6 -22 28 q-20 10 -10 34 q4 26 30 44 q8 14 24 26 q10 18 26 14 q-6 -20 -14 -24 z" fill="none" stroke="${T}" stroke-width="2"/>
      ${ce(1010, 250, 40, PINK, "stroke-width='6'")}
      ${ce(1056, 286, 40, AMB, "stroke-width='6'")}
      ${c(1033, 268, 8, "#090909")}
      ${c(1033, 268, 3, PINK)}
      <path d="M280 300 q-6 -12 -20 -20 q-8 -15 2 -26 q-5 -7 2 -8 q-6 -7 -5 -18 q-12 4 -13 17 q-12 6 -6 20 q2 15 18 26 q5 8 14 15 q6 11 15 8 q-4 -12 -8 -14 z" fill="${PINK}" opacity="0.7"/>
      <path d="M1330 650 q-6 -12 -20 -20 q-8 -15 2 -26 q-5 -7 2 -8 q-6 -7 -5 -18 q-12 4 -13 17 q-12 6 -6 20 q2 15 18 26 q5 8 14 15 q6 11 15 8 q-4 -12 -8 -14 z" fill="${AMB}" opacity="0.7"/>
      <path d="M240 760 q-8 -6 -9 -16 q-2 -14 6 -20 q-12 -6 -9 -16 q-10 -2 -12 6 q-12 8 -16 20 q-4 14 4 22 q-6 14 -2 24 q16 2 26 -4 q14 4 22 -4 q2 -14 -8 -14 q-4 -14 -2 -22 z" fill="${PINK}" opacity="0.5"/>
      <path d="M1180 170 q-6 -5 -7 -12 q-2 -11 5 -15 q-9 -5 -7 -12 q-8 -2 -9 5 q-9 6 -12 15 q-3 10 3 16 q-5 10 -2 18 q12 2 19 -3 q11 3 16 -3 q2 -10 -6 -10 q-3 -10 -2 -16 z" fill="${T}" opacity="0.6"/>
      ${g(
        [0, 1, 2].map((i) => {
          const x = 1260 + i * 30;
          const y = 720 + (i % 2) * 16;
          return `<path d="M${x} ${y + 8} q-4 -6 -12 -12 q-5 -9 1 -16 q-3 -4 1 -5 q-4 -4 -3 -11 q-7 2 -8 10 q-7 4 -4 12 q1 9 11 16 q3 5 8 9 q4 7 9 5 q-2 -7 -5 -9 z" fill="${PINK}" opacity="${0.9 - i * 0.25}"/>`;
        }).join("")
      )}
      ${c(330, 460, 6, AMB, "opacity='0.7'")}
      ${c(1290, 480, 6, PINK, "opacity='0.6'")}
      ${c(1180, 620, 5, AMB, "opacity='0.5'")}
      ${ce(1260, 240, 90, LINE, "stroke-opacity='0.35'")}
      ${ce(340, 760, 70, LINE, "stroke-opacity='0.35'")}
      `
    )
);

// ---------------------------------------------------------------------------
// InvoicePilot — pipeline: invoice → AI nodes → seal
// ---------------------------------------------------------------------------
arts.invoicepilot = svg(
  bg(T, I) +
    clip("c9", 300, 280, 420, 440) +
    g(
      `
      ${rr(300, 280, 420, 440, 18, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      <g clip-path="url(#c9)">
        ${bar(330, 310, 140, 12, TXT2)}
        ${bar(330, 340, 200, 8, MUT)}
        ${bar(330, 360, 240, 8, MUT)}
        ${ln(330, 388, 690, 388, LINE, 2)}
        ${bar(330, 412, 160, 8, MUT)}
        ${bar(330, 432, 210, 8, MUT)}
        ${bar(330, 452, 120, 8, MUT)}
        ${ln(330, 480, 690, 480, LINE, 2)}
        ${bar(330, 504, 90, 8, T)}
        ${bar(430, 504, 90, 8, MUT)}
        ${bar(330, 616, 180, 26, T)}
        ${bar(348, 628, 90, 8, "#0B6B5F")}
      </g>
      ${ln(720, 500, 810, 500, T, 4)}
      <path d="M810 494 l16 6 -16 6 z" fill="${T}"/>
      ${c(846, 500, 30, "rgba(169,92,61,0.14)")}
      ${ce(846, 500, 30, I, "stroke-opacity='0.6'")}
      ${c(846, 500, 16, I)}
      <path d="M836 500 l8 8 14 -16" stroke="#090909" stroke-width="4" fill="none"/>
      ${ln(876, 500, 966, 500, T, 4)}
      <path d="M966 494 l16 6 -16 6 z" fill="${T}"/>
      ${c(1002, 500, 30, "rgba(169,92,61,0.14)")}
      ${ce(1002, 500, 30, I, "stroke-opacity='0.6'")}
      ${c(1002, 500, 16, I)}
      <path d="M1002 494 l-8 0 8 12 8 -12 z" fill="#090909" transform="rotate(0 1002 500)"/>
      ${rr(1052, 430, 240, 150, 20, S1, `stroke="${T}" stroke-opacity="0.5" filter="url(#sh)"`)}
      <path d="M1092 472 l0 -34 24 -24 90 0 0 96 0 0 -114 0 z" fill="none" stroke="${T}" stroke-width="4"/>
      <path d="M1116 438 l0 34 24 0" fill="none" stroke="${T}" stroke-width="4"/>
      <path d="M1156 478 l34 0" stroke="${T}" stroke-width="4"/>
      <path d="M1156 494 l48 0" stroke="${T}" stroke-width="4"/>
      <circle cx="1206" cy="516" r="12" fill="none" stroke="${T}" stroke-width="3"/>
      <path d="M1200 516 l5 5 8 -10" stroke="${T}" stroke-width="3" fill="none"/>
      ${rr(1160, 420, 24, 90, 12, S2, `stroke="${LINE}"`)}
      ${rr(1160, 420, 24, 44, 12, T, `fill-opacity="0.35"`)}
      ${rr(1118, 420, 24, 90, 12, S2, `stroke="${LINE}"`)}
      ${rr(1118, 420, 24, 66, 12, I, `fill-opacity="0.35"`)}
      ${c(300, 220, 12, T, "opacity='0.5'")}
      ${c(1420, 780, 12, I, "opacity='0.5'")}
      ${ce(360, 760, 90, LINE, "stroke-opacity='0.35'")}
      `
    )
);

// ---------------------------------------------------------------------------
// CaseVault — vault dial + search over legal documents
// ---------------------------------------------------------------------------
arts.casevault = svg(
  bg(I, T) +
    clip("ca", 300, 300, 460, 440) +
    g(
      `
      ${rr(300, 300, 460, 440, 24, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${c(530, 420, 150, "rgba(169,92,61,0.08)")}
      ${ce(530, 420, 150, I, "stroke-opacity='0.5'")}
      ${ce(530, 420, 108, I, "stroke-opacity='0.4'")}
      ${ce(530, 420, 66, I, "stroke-opacity='0.5'")}
      ${c(530, 420, 34, S3, `stroke="${I}" stroke-opacity="0.6"`)}
      ${c(530, 420, 10, I)}
      ${bar(334, 676, 80, 10, MUT)}
      ${bar(470, 676, 80, 10, MUT)}
      ${rr(800, 280, 200, 30, 10, "#0E0E0E")}
      ${rr(820, 270, 380, 480, 18, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      <g clip-path="url(#ca)">
        ${bar(850, 306, 130, 12, TXT2)}
        ${ln(850, 342, 1150, 342, LINE, 2)}
        ${bar(850, 372, 200, 8, MUT)}
        ${bar(850, 392, 240, 8, MUT)}
        ${bar(850, 412, 170, 8, MUT)}
        ${bar(850, 432, 210, 8, MUT)}
        ${ln(850, 462, 1150, 462, LINE, 2)}
        ${bar(850, 492, 150, 8, MUT)}
        ${bar(850, 512, 230, 8, MUT)}
        ${bar(850, 532, 190, 8, MUT)}
        ${bar(850, 552, 130, 8, T)}
        ${ln(850, 582, 1150, 582, LINE, 2)}
        ${bar(850, 612, 220, 8, MUT)}
        ${bar(850, 632, 160, 8, MUT)}
        ${rr(850, 672, 140, 40, 20, T)}
        ${bar(872, 688, 90, 8, "#0B6B5F")}
      </g>
      ${ce(1200, 320, 62, T, "stroke-width='5'")}
      ${ce(1200, 320, 30, T, "stroke-width='4'")}
      ${ln(1200, 382, 1212, 400, T, 6)}
      ${ce(1350, 660, 52, "rgba(169,92,61,0.12)")}
      ${rr(1310, 620, 34, 28, 8, S3, `stroke="${T}"`)}
      <path d="M1318 620 q0 -18 9 -18 q9 0 9 18" stroke="${T}" stroke-width="4" fill="none"/>
      ${c(1327, 636, 5, T)}
      ${c(280, 220, 12, I, "opacity='0.5'")}
      ${c(1460, 260, 10, T, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// NeuroScreen — brain + EEG waves + accuracy ring
// ---------------------------------------------------------------------------
arts.neuronscreen = svg(
  bg(T, I) +
    g(
      `
      ${rr(320, 260, 700, 500, 26, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${c(670, 510, 130, "rgba(217,122,79,0.08)")}
      <path d="M670 390 q-40 -16 -80 4 q-60 26 -60 116 q0 90 60 116 q40 20 80 4 q40 16 80 -4 q60 -26 60 -116 q0 -90 -60 -116 q-40 -20 -80 -4 z" fill="#1A1A1A" stroke="${I}" stroke-width="3"/>
      <path d="M670 390 q40 34 40 120 q0 86 -40 120" fill="none" stroke="${I}" stroke-width="3"/>
      <path d="M670 394 q-30 40 -30 116 q0 76 30 116" fill="none" stroke="${I}" stroke-width="3"/>
      ${c(638, 470, 6, T)}
      ${c(706, 470, 6, T)}
      ${c(668, 514, 5, T)}
      ${c(650, 556, 6, T)}
      ${c(690, 556, 6, T)}
      ${c(670, 600, 5, T)}
      <path d="M360 250 q40 40 80 0 q40 -40 80 0" stroke="${T}" stroke-width="4" fill="none"/>
      <path d="M360 300 q40 40 80 0 q40 -40 80 0" stroke="${T}" stroke-width="4" fill="none" opacity="0.7"/>
      <path d="M360 350 q40 40 80 0 q40 -40 80 0" stroke="${T}" stroke-width="4" fill="none" opacity="0.45"/>
      <path d="M900 250 q40 40 80 0 q40 -40 80 0" stroke="${I}" stroke-width="4" fill="none"/>
      <path d="M900 300 q40 40 80 0 q40 -40 80 0" stroke="${I}" stroke-width="4" fill="none" opacity="0.7"/>
      <path d="M900 350 q40 40 80 0 q40 -40 80 0" stroke="${I}" stroke-width="4" fill="none" opacity="0.45"/>
      ${rr(1080, 300, 330, 330, 26, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      ${c(1245, 465, 105, "none", "")}
      <path d="M1245 360 a105 105 0 1 1 -99 63" fill="none" stroke="${T}" stroke-width="18" stroke-linecap="round" opacity="0.14"/>
      <path d="M1245 360 a105 105 0 1 1 -99 63" fill="none" stroke="${T}" stroke-width="18" stroke-linecap="round" stroke-dasharray="620" stroke-dashoffset="30"/>
      ${g(
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i * 45 * Math.PI) / 180;
          const x = 1245 + 128 * Math.cos(a);
          const y = 465 + 128 * Math.sin(a);
          return `<line x1="${x - 8}" y1="${y}" x2="${x + 8}" y2="${y}" stroke="${MUT}" stroke-width="4"/>`;
        }).join("")
      )}
      ${c(1245, 465, 22, S3, `stroke="${T}"`)}
      ${c(1245, 465, 8, T)}
      ${rr(1100, 700, 210, 44, 22, S2, `stroke="${LINE}"`)}
      ${rr(1116, 712, 120, 20, 10, T, `fill-opacity="0.25"`)}
      ${c(1258, 722, 6, T)}
      ${c(280, 240, 12, T, "opacity='0.5'")}
      ${c(1500, 260, 10, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// CV & Pattern Recognition — tiles + detection overlay + kernels
// ---------------------------------------------------------------------------
arts["cvpr-collection"] = svg(
  bg(T, I) +
    clip("cv", 300, 280, 1000, 520) +
    g(
      `
      ${rr(300, 280, 480, 250, 18, S2, `stroke="${LINE}"`)}
      ${rr(300, 550, 480, 250, 18, S2, `stroke="${LINE}"`)}
      ${rr(800, 280, 500, 250, 18, S2, `stroke="${LINE}"`)}
      ${rr(800, 550, 500, 250, 18, S2, `stroke="${LINE}"`)}
      <g clip-path="url(#cv)">
        ${c(540, 405, 62, "#1A1A1A", `stroke="${LINE}"`)}
        ${c(540, 403, 58, "#1C1C1C")}
        ${c(514, 376, 7, T)}
        ${c(566, 376, 7, T)}
        ${ln(506, 410, 534, 406, T, 3)}
        ${ln(546, 406, 574, 410, T, 3)}
        <path d="M514 424 q26 28 52 0" stroke="${T}" stroke-width="3" fill="none"/>
        <path d="M420 340 l-24 0 0 24" stroke="${I}" stroke-width="4" fill="none"/>
        <path d="M660 340 l24 0 0 24" stroke="${I}" stroke-width="4" fill="none"/>
        <path d="M420 460 l-24 0 0 -24" stroke="${I}" stroke-width="4" fill="none"/>
        <path d="M660 460 l24 0 0 -24" stroke="${I}" stroke-width="4" fill="none"/>
        ${c(540, 675, 40, "rgba(169,92,61,0.14)")}
        ${ce(540, 675, 40, I, "stroke-opacity='0.6'")}
        ${c(540, 675, 24, I, "opacity='0.9'")}
        ${c(540, 675, 9, "#090909")}
        ${c(522, 666, 3, T)}
        ${c(558, 666, 3, T)}
        <path d="M528 680 q12 10 24 0" stroke="#090909" stroke-width="2" fill="none"/>
        ${ce(540, 675, 74, I, "stroke-opacity='0.3'")}
        ${rr(1050, 330, 160, 60, 14, I, "opacity='0.9'")}
        ${rr(1050, 410, 160, 60, 14, T, "opacity='0.9'")}
        ${rr(1050, 490, 160, 60, 14, AMB, "opacity='0.85'")}
        ${rr(830, 610, 260, 130, 16, S3, `stroke="${LINE}"`)}
        ${ln(900, 610, 900, 740, LINE, 2)}
        ${ln(1020, 610, 1020, 740, LINE, 2)}
        ${ln(830, 650, 1090, 650, LINE, 2)}
        ${rr(840, 620, 52, 20, 6, T, `opacity="0.6"`)}
        ${rr(904, 620, 52, 20, 6, I, `opacity="0.6"`)}
        ${rr(968, 620, 52, 20, 6, MUT, `opacity="0.6"`)}
        ${rr(1032, 620, 52, 20, 6, AMB, `opacity="0.6"`)}
        ${rr(1120, 610, 130, 130, 16, S3, `stroke="${LINE}"`)}
        ${ln(1152, 610, 1152, 740, LINE, 2)}
        ${ln(1184, 610, 1184, 740, LINE, 2)}
        ${rr(1130, 620, 18, 18, 4, T, `opacity="0.8"`)}
        ${rr(1156, 620, 18, 18, 4, I, `opacity="0.8"`)}
        ${rr(1130, 646, 18, 18, 4, MUT, `opacity="0.8"`)}
        ${rr(1156, 646, 18, 18, 4, T, `opacity="0.8"`)}
        <rect x="800" y="640" width="500" height="3" fill="url(#gA)"/>
      </g>
      ${rr(800, 280, 500, 250, 18, "none", `stroke="${GRN}" stroke-opacity="0.7" stroke-dasharray="14 10"`)}
      ${c(240, 240, 12, T, "opacity='0.5'")}
      ${c(1460, 800, 12, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// Natural Language Processing — tokens → vectors
// ---------------------------------------------------------------------------
arts["natural-language-processing"] = svg(
  bg(T, I) +
    clip("nl", 320, 260, 500, 480) +
    g(
      `
      ${rr(320, 260, 500, 480, 20, S2, `stroke="${LINE}" filter="url(#sh)"`)}
      <g clip-path="url(#nl)">
        ${bar(352, 296, 130, 12, TXT2)}
        ${pill(352, 332, 70, 34, "rgba(217,122,79,0.14)", `stroke="${T}" stroke-opacity="0.5"`)}
        ${pill(434, 332, 84, 34, "rgba(169,92,61,0.14)", `stroke="${I}" stroke-opacity="0.5"`)}
        ${pill(530, 332, 66, 34, S3, `stroke="${LINE}"`)}
        ${pill(352, 380, 92, 34, "rgba(169,92,61,0.14)", `stroke="${I}" stroke-opacity="0.5"`)}
        ${pill(456, 380, 76, 34, S3, `stroke="${LINE}"`)}
        ${pill(544, 380, 100, 34, "rgba(217,122,79,0.14)", `stroke="${T}" stroke-opacity="0.5"`)}
        ${pill(352, 428, 84, 34, S3, `stroke="${LINE}"`)}
        ${pill(448, 428, 72, 34, "rgba(217,122,79,0.14)", `stroke="${T}" stroke-opacity="0.5"`)}
        ${pill(532, 428, 94, 34, "rgba(169,92,61,0.14)", `stroke="${I}" stroke-opacity="0.5"`)}
        ${rr(352, 500, 436, 3, 1, LINE2)}
        ${bar(352, 560, 240, 9, MUT)}
        ${bar(352, 582, 300, 9, MUT)}
        ${bar(352, 604, 200, 9, MUT)}
        ${bar(352, 626, 260, 9, MUT)}
      </g>
      ${ln(820, 500, 900, 500, T, 4)}
      <path d="M900 494 l16 6 -16 6 z" fill="${T}"/>
      ${rr(930, 280, 380, 440, 20, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${g(
        [0, 1, 2, 3, 4].map((i) => {
          const y = 320 + i * 40;
          return g(
            [0, 1, 2, 3, 4, 5, 6].map((j) => {
              const f = (i + j) % 3 === 0 ? T : i % 2 ? I : "#2B2B2B";
              return `<rect x="${952 + j * 46}" y="${y}" width="34" height="26" rx="6" fill="${f}" opacity="${(i + j) % 3 === 0 ? 0.95 : 0.55}"/>`;
            }).join("")
          );
        }).join("")
      )}
      ${rr(930, 560, 380, 120, 16, "#121212", `stroke="${LINE}"`)}
      <path d="M956 640 L1016 612 L1076 634 L1136 590 L1196 616 L1256 578" stroke="${T}" stroke-width="5" fill="none"/>
      ${c(1256, 578, 7, T)}
      <path d="M1266 562 l12 22 -26 -3 z" fill="${T}"/>
      ${bar(956, 668, 320, 8, MUT)}
      ${c(280, 240, 12, T, "opacity='0.5'")}
      ${c(1460, 760, 12, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------
// Portfolio — code editor + terminal
// ---------------------------------------------------------------------------
arts.portfolio = svg(
  bg(T, I) +
    clip("pf", 380, 240, 840, 520) +
    g(
      `
      ${rr(380, 240, 840, 520, 20, S1, `stroke="${LINE}" filter="url(#sh)"`)}
      ${c(410, 266, 7, RED)}
      ${c(434, 266, 7, AMB)}
      ${c(458, 266, 7, GRN)}
      ${bar(520, 258, 260, 12, MUT)}
      ${g(
        [0, 1, 2, 3, 4, 5, 6].map((i) => {
          const w = [110, 90, 130, 70, 120, 60, 100][i];
          return `${bar(408, 316 + i * 60, w, 10, i % 2 ? MUT : TXT2)}`;
        }).join("")
      )}
      <g clip-path="url(#pf)">
        ${ln(380, 300, 1220, 300, LINE, 2)}
        ${bar(432, 316, 200, 12, T)}
        ${bar(432, 342, 260, 10, I)}
        ${bar(432, 368, 150, 10, MUT)}
        ${bar(432, 402, 280, 10, AMB)}
        ${bar(432, 428, 220, 10, MUT)}
        ${bar(432, 454, 310, 10, T)}
        ${bar(432, 480, 180, 10, I)}
        ${bar(432, 506, 240, 10, MUT)}
        ${bar(432, 540, 120, 10, AMB)}
        ${bar(432, 566, 270, 10, T)}
        <rect x="432" y="316" width="12" height="12" fill="#090909"/>
        ${rr(432, 620, 460, 96, 12, "#0C0C0C", `stroke="${LINE}"`)}
        ${c(458, 668, 6, GRN)}
        <path d="M472 652 l16 16 -16 16" stroke="${TXT2}" stroke-width="4" fill="none"/>
        <rect x="500" y="654" width="11" height="22" fill="${T}"/>
        ${rr(936, 620, 260, 96, 12, "#0C0C0C", `stroke="${LINE}"`)}
        ${g(
          [0, 1, 2, 3].map((i) => `${bar(958, 638 + i * 22, 200 - i * 18, 9, i % 2 ? GRN : T)}`).join("")
        )}
      </g>
      ${c(280, 240, 12, T, "opacity='0.5'")}
      ${c(1460, 760, 12, I, "opacity='0.5'")}
      ${ce(1430, 260, 22, T, "stroke-opacity='0.4'")}
      ${c(200, 800, 10, I, "opacity='0.5'")}
      `
    )
);

// ---------------------------------------------------------------------------

const order = [
  "ledgerturf",
  "face-recognition-system",
  "finbert",
  "employee-family-registry",
  "codingvibes-java-gui",
  "spark-powerhouse-gym-csharp",
  "spark-powerhouse-gym-web",
  "online-bookstore-database-design",
  "my-wedding-invitation",
  "invoicepilot",
  "casevault",
  "neuronscreen",
  "cvpr-collection",
  "natural-language-processing",
  "portfolio",
];

mkdirSync(SVG_DIR, { recursive: true });
mkdirSync(WEBP_DIR, { recursive: true });

for (const slug of order) {
  const body = arts[slug];
  if (!body) {
    console.error(`missing art: ${slug}`);
    process.exit(1);
  }
  writeFileSync(join(SVG_DIR, `${slug}.svg`), body);
}

console.log(`wrote ${order.length} SVG sources to ${SVG_DIR}`);

await Promise.all(
  order.map(async (slug) => {
    const webp = join(WEBP_DIR, `${slug}.webp`);
    await sharp(join(SVG_DIR, `${slug}.svg`), { density: 144 })
      .resize(W, H)
      .webp({ quality: 86 })
      .toFile(webp);
    console.log(`rendered ${slug}.webp`);
  })
);

console.log("done");
