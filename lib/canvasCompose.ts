import chroma from "chroma-js";
import { matchGridWithKDTree } from "./matcher";
import { LabColor, MatchResult } from "./types";

const GRID_SIZE = 200;

// Helper to load an image into an HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Generates the mosaic canvas
async function composeCanvasMosaic(
  matchGrid: MatchResult[][],
  tileSize: number,
  onProgress?: (p: number) => void
): Promise<string> {
  const rows = matchGrid.length;
  const cols = matchGrid[0].length;
  
  const canvas = document.createElement("canvas");
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Fill background white
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imageCache = new Map<string, HTMLImageElement>();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = matchGrid[y][x];
      
      let img = imageCache.get(tile.path);
      if (!img) {
        img = await loadImage(tile.path);
        imageCache.set(tile.path, img);
      }
      
      ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
    }
    
    // Update progress per row
    if (onProgress) {
      onProgress(Math.round(((y + 1) / rows) * 100));
    }
  }

  // Convert canvas to a local blob URL
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob!));
    }, "image/png");
  });
}

// Main Client-Side Orchestrator
export async function generateMosaicClientSide(
  file: File,
  onProgress: (percent: number) => void
): Promise<{ previewUrl: string; finalUrl: string }> {
  
  // 1. Load user image
  const img = await loadImage(URL.createObjectURL(file));

  // 2. Draw to small canvas to extract pixel data
  const smallCanvas = document.createElement("canvas");
  smallCanvas.width = GRID_SIZE;
  smallCanvas.height = GRID_SIZE;
  const ctx = smallCanvas.getContext("2d", { willReadFrequently: true });
  
  if (!ctx) throw new Error("Could not get 2d context");
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Mimic Sharp's default "cover" behavior (center crop to square)
  const minSize = Math.min(img.width, img.height);
  const sx = (img.width - minSize) / 2;
  const sy = (img.height - minSize) / 2;

  ctx.drawImage(img, sx, sy, minSize, minSize, 0, 0, GRID_SIZE, GRID_SIZE);
  const imageData = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE).data;

  // 3. Convert RGBA to LAB Color Grid
  const labGrid: LabColor[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: LabColor[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const idx = (y * GRID_SIZE + x) * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];
      
      const [L, a, bVal] = chroma(r, g, b).lab();
      row.push({ L, a, b: bVal });
    }
    labGrid.push(row);
  }

  // 4. Run the KD-Tree Matcher (happens instantly)
  const matchGrid = matchGridWithKDTree(labGrid);
  onProgress(5); 

  // 5. Generate Preview (Fast)
  const previewUrl = await composeCanvasMosaic(matchGrid, 20);
  onProgress(10); 

  // 6. Generate Final High-Res (Takes a few seconds, reports progress)
  const finalUrl = await composeCanvasMosaic(matchGrid, 81, (p) => {
    // Map the 0-100 progress of this function to the remaining 10-100 overall progress
    onProgress(10 + p * 0.9);
  });

  return { previewUrl, finalUrl };
}