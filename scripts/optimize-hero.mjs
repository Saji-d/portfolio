import sharp from "sharp";
import path from "node:path";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(root, "public", "images", "hero.jpeg");
const DST = path.join(root, "public", "images", "hero.webp");

const meta = await sharp(SRC).metadata();
console.log("source:", meta.width + "x" + meta.height, meta.format, "orientation:", meta.orientation);

await sharp(SRC).webp({ lossless: true, effort: 6 }).toFile(DST);

const out = await sharp(DST).metadata();
console.log("webp:", out.width + "x" + out.height, "bytes:", statSync(DST).size, "format:", out.format);
