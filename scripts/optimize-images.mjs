// Optimizes raster images (PNG/JPG/JPEG) to WebP with kebab-case names.
// Run: node scripts/optimize-images.mjs

import sharp from "sharp";
import { existsSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const QUALITY = 86;

const JOBS = [
  { from: "public/images/thumbnails/invoicepilot_thumbnail.png", to: "public/images/thumbnails/invoicepilot-thumbnail.webp" },
  { from: "public/images/thumbnails/ledgerturf_thumbnail.png", to: "public/images/thumbnails/ledgerturf-thumbnail.webp" },
  { from: "public/images/thumbnails/casevault_thumbnail.png", to: "public/images/thumbnails/casevault-thumbnail.webp" },
  { from: "public/images/thumbnails/codingvibes_thumbnail.png", to: "public/images/thumbnails/codingvibes-thumbnail.webp" },
  { from: "public/images/thumbnails/database_thumbnail.png", to: "public/images/thumbnails/database-thumbnail.webp" },
  { from: "public/images/thumbnails/face_recognition_thumbnail.png", to: "public/images/thumbnails/face-recognition-thumbnail.webp" },
  { from: "public/images/thumbnails/finbert_thumbnail.png", to: "public/images/thumbnails/finbert-thumbnail.webp" },
  { from: "public/images/thumbnails/sparkpowerhouse_gym_desktop_thumbnail.png", to: "public/images/thumbnails/sparkpowerhouse-gym-desktop-thumbnail.webp" },
  { from: "public/images/thumbnails/sparkpowerhouse_gym_web_thumbnail.png", to: "public/images/thumbnails/sparkpowerhouse-gym-web-thumbnail.webp" },
  { from: "public/images/thumbnails/registry_thumbnail.png", to: "public/images/thumbnails/employee-registry-thumbnail.webp" },
  { from: "public/images/thumbnails/wedding_thumbnail.png", to: "public/images/thumbnails/wedding-thumbnail.webp" },
  { from: "public/images/thumbnails/3d_city_thumbnail.jpg", to: "public/images/thumbnails/three-d-city-thumbnail.webp" },
  { from: "public/og-image.png", to: "public/og-image.webp" },
];

async function main() {
  const results = [];
  let oldTotal = 0;
  let newTotal = 0;

  for (const job of JOBS) {
    const src = join(ROOT, job.from);
    const dst = join(ROOT, job.to);
    if (!existsSync(src)) {
      console.error(`MISSING SOURCE: ${job.from}`);
      process.exit(1);
    }
    const oldBytes = statSync(src).size;
    const meta = await sharp(src).metadata();
    const out = await sharp(src)
      .webp({ quality: QUALITY, effort: 6, lossless: false })
      .toBuffer({ resolveWithObject: true });
    await sharp(out.data).toFile(dst);
    const newBytes = statSync(dst).size;
    oldTotal += oldBytes;
    newTotal += newBytes;
    const pct = ((1 - newBytes / oldBytes) * 100).toFixed(1);
    results.push({
      from: job.from,
      to: job.to,
      dims: `${meta.width}x${meta.height}`,
      oldBytes,
      newBytes,
      pct,
    });
  }

  writeFileSync(join(ROOT, ".image-report.json"), JSON.stringify({ results, oldTotal, newTotal }, null, 2));
  console.table(results.map((r) => ({ from: r.from, to: r.to, dims: r.dims, oldKB: (r.oldBytes / 1024).toFixed(1), newKB: (r.newBytes / 1024).toFixed(1), reduction: r.pct + "%" })));
  console.log(`OLD total: ${(oldTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`NEW total: ${(newTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`OVERALL: ${((1 - newTotal / oldTotal) * 100).toFixed(1)}% reduction`);
}

main();
