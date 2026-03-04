"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl p-6">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-bold text-center">
            Upload Image for Mosaic Analysis
          </h1>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? "Processing..." : "Analyze Image"}
          </Button>

          {/* {result && result.success && (
            <div className="text-sm text-muted-foreground text-center">
              Grid size: {result.gridSize} × {result.gridSize}
              <br />
              LAB grid generated successfully.
            </div>
          )} */}

          {result && result.success && (
            <div className="space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                Grid size: {result.gridSize} × {result.gridSize}
                </div>

                <div className="grid grid-cols-10 gap-1 max-h-64 overflow-auto border p-2">
                {result.labGrid.slice(0, 10).map((row: any, rowIndex: number) =>
                    row.slice(0, 10).map((cell: any, colIndex: number) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className="text-[10px] border p-1 text-center"
                    >
                        {Math.round(cell.L)}
                    </div>
                    ))
                )}
                </div>
            </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}