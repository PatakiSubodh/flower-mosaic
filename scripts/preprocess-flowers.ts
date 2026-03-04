// run cmd: npx ts-node scripts/preprocess-flowers.ts

import fs from "fs";
import path from "path";
import sharp from "sharp";
import chroma from "chroma-js";

const INPUT_DIR = path.join(process.cwd(), "public/flowers-original");
const OUTPUT_DIR = path.join(process.cwd(), "public/tiles");
const DATA_DIR = path.join(process.cwd(), "data");
const OUTPUT_JSON = path.join(DATA_DIR, "flower-metadata.json");

const TILE_SIZE = 350;

interface FlowerMeta {
  id: number;
  filename: string;
  path: string;
  L: number;
  a: number;
  b: number;
}

async function preprocess() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const files = fs.readdirSync(INPUT_DIR);

  const metadata: FlowerMeta[] = [];

  let id = 1;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

    console.log(`Processing: ${file}`);

    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);

    const image = sharp(inputPath);
    const { width, height } = await image.metadata();

    if (!width || !height) continue;

    const size = Math.min(width, height);
    const left = Math.floor((width - size) / 2);
    const top = Math.floor((height - size) / 2);

    const processed = image
      .extract({ left, top, width: size, height: size })
      .resize(TILE_SIZE, TILE_SIZE);

    await processed.toFile(outputPath);

    const { data, info } = await processed
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0,
      g = 0,
      b = 0;

    for (let i = 0; i < data.length; i += info.channels) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    const pixelCount = info.width * info.height;

    r = r / pixelCount;
    g = g / pixelCount;
    b = b / pixelCount;

    const [L, aVal, bVal] = chroma(r, g, b).lab();

    metadata.push({
      id,
      filename: file,
      path: `/tiles/${file}`,
      L,
      a: aVal,
      b: bVal,
    });

    id++;
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(metadata, null, 2));

  console.log("Preprocessing complete.");
}

preprocess().catch(console.error);