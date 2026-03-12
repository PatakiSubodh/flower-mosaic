import { jobs } from "@/lib/jobStore";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import chroma from "chroma-js";
import { randomUUID } from "crypto";

import { matchGridWithKDTree } from "@/lib/matcher";
import { composeMosaicRowByRow } from "@/lib/compose";
import { LabColor } from "@/lib/types";

export const runtime = "nodejs";

const GRID_SIZE = 150;

async function generateLabGrid(buffer: Buffer): Promise<LabColor[][]> {
  const { data, info } = await sharp(buffer)
    .resize(GRID_SIZE, GRID_SIZE)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const grid: LabColor[][] = [];

  for (let y = 0; y < info.height; y++) {
    const row: LabColor[] = [];

    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const [L, a, bVal] = chroma(r, g, b).lab();
      row.push({ L, a, b: bVal });
    }

    grid.push(row);
  }

  return grid;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const labGrid = await generateLabGrid(buffer);
    const matchGrid = matchGridWithKDTree(labGrid);

    const id = randomUUID();
    const previewFilename = `preview-${id}.png`;
    const finalFilename = `final-${id}.png`;

    const outputDir = path.join(process.cwd(), "public", "generated");
    await fs.mkdir(outputDir, { recursive: true });

    const previewPath = path.join(outputDir, previewFilename);
    const finalPath = path.join(outputDir, finalFilename);

    // 🔹 Generate preview (fast)
    await composeMosaicRowByRow(matchGrid, {
      tileSize: 20,
      outputPath: previewPath,
    });

    // 🔹 Create job
    jobs[id] = {
      progress: 0,
      done: false,
    };

    // 🔹 Generate final in background with progress
    (async () => {
      await composeMosaicRowByRow(matchGrid, {
        tileSize: 108,
        outputPath: finalPath,
        onProgress: (percent) => {
          jobs[id].progress = percent;
        },
      });

      jobs[id].done = true;
      jobs[id].finalUrl = `/generated/${finalFilename}`;
    })();

    return NextResponse.json({
      previewUrl: `/generated/${previewFilename}`,
      jobId: id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}