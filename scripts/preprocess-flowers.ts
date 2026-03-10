// run cmd: npx ts-node scripts/preprocess-flowers.ts

import fs from "fs";
import path from "path";
import sharp from "sharp";
import chroma from "chroma-js";

const INPUT_DIR = path.join(process.cwd(), "public/flowers-original");
const OUTPUT_DIR = path.join(process.cwd(), "public/tiles");
const DATA_DIR = path.join(process.cwd(), "data");
const OUTPUT_JSON = path.join(DATA_DIR, "flower-metadata.json");

const TILE_SIZE = 600;
const CONCURRENCY = 10;

sharp.concurrency(0);
sharp.cache(false);

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

  const allItems = fs.readdirSync(INPUT_DIR);

  const allFiles = allItems.filter((item) =>
    fs.statSync(path.join(INPUT_DIR, item)).isFile()
  );

  const files = allFiles.filter((f) =>
    [".jpg", ".jpeg", ".png", ".webp"].includes(path.extname(f).toLowerCase())
  );

  const total = files.length;

  console.log("Total images:", total);

  const metadata: FlowerMeta[] = [];
  let id = 1;

  async function processFile(file: string) {
    const currentId = id++;

    console.log(`Processing [${currentId}/${total}]: ${file}`);

    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);

    const image = sharp(inputPath);
    const { width, height } = await image.metadata();

    if (!width || !height) return;

    const size = Math.min(width, height);
    const left = Math.floor((width - size) / 2);
    const top = Math.floor((height - size) / 2);

    const processed = image.extract({
      left,
      top,
      width: size,
      height: size,
    });

    await processed.toFile(outputPath);

    const { data, info } = await processed
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < data.length; i += info.channels) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    const pixelCount = info.width * info.height;

    r /= pixelCount;
    g /= pixelCount;
    b /= pixelCount;

    const [L, aVal, bVal] = chroma(r, g, b).lab();

    metadata.push({
      id: currentId,
      filename: file,
      path: `/tiles/${file}`,
      L,
      a: aVal,
      b: bVal,
    });
  }

  const queue = [...files];

  const workers = Array(CONCURRENCY)
    .fill(null)
    .map(async () => {
      while (queue.length) {
        const file = queue.shift();
        if (!file) return;
        await processFile(file);
      }
    });

  await Promise.all(workers);

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(metadata, null, 2));

  console.log("Preprocessing complete.");
}

preprocess().catch(console.error);