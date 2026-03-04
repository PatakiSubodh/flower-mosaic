export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import chroma from "chroma-js";

const GRID_SIZE = 70; // 70x70 grid

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Resize image to grid size
    const resized = await sharp(buffer)
      .resize(GRID_SIZE, GRID_SIZE, {
        fit: "fill",
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = resized;

    const labGrid: { L: number; a: number; b: number }[][] = [];

    for (let y = 0; y < info.height; y++) {
      const row = [];

      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * info.channels;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const [L, aVal, bVal] = chroma(r, g, b).lab();

        row.push({ L, a: aVal, b: bVal });
      }

      labGrid.push(row);
    }

    return NextResponse.json({
      success: true,
      gridSize: GRID_SIZE,
      labGrid,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}