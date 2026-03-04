import sharp from "sharp";
import path from "path";

interface ComposeOptions {
  tileSize: number;
  outputPath: string;
  onProgress?: (percent: number) => void;
}

export async function composeMosaicRowByRow(
  matchGrid: any[][],
  options: ComposeOptions
) {
  const { tileSize, outputPath, onProgress } = options;

  const rows: Buffer[] = [];
  const totalRows = matchGrid.length;

  for (let y = 0; y < totalRows; y++) {
    const row = matchGrid[y];

    const rowWidth = row.length * tileSize;
    const rowHeight = tileSize;

    const compositeInputs = await Promise.all(
    row.map(async (tile: any, x: number) => {
        const resized = await sharp(
        path.join(process.cwd(), "public", tile.path)
        )
        .resize(tileSize, tileSize)
        .toBuffer();

        return {
        input: resized,
        left: x * tileSize,
        top: 0,
        };
    })
    );
    
    const rowImage = await sharp({
      create: {
        width: rowWidth,
        height: rowHeight,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .composite(compositeInputs)
      .png()
      .toBuffer();

    rows.push(rowImage);

    if (onProgress) {
      const percent = Math.round(((y + 1) / totalRows) * 100);
      onProgress(percent);
    }
  }

  const finalHeight = totalRows * tileSize;
  const finalWidth = matchGrid[0].length * tileSize;

  const verticalComposite = rows.map((rowBuffer, index) => ({
    input: rowBuffer,
    top: index * tileSize,
    left: 0,
  }));

  await sharp({
    create: {
      width: finalWidth,
      height: finalHeight,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(verticalComposite)
    .png()
    .toFile(outputPath);
}