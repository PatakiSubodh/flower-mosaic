// import UploadPage from "./api/upload/page";

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-background p-8">
//       {/* <h1 className="text-4xl font-bold">Flower Mosaic Builder</h1>
//       <p>375</p> */}
//       <UploadPage />
//     </main>
//   )
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setPreview(data.previewUrl);

    pollStatus(data.jobId);
  }

  async function pollStatus(jobId: string) {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/status?jobId=${jobId}`);
      const data = await res.json();

      setProgress(data.progress);

      if (data.done) {
        clearInterval(interval);
        setFinalUrl(data.finalUrl);
        setLoading(false);
      }
    }, 1000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-6 w-full max-w-lg space-y-4">
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" name="image" required />
          <Button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Mosaic"}
          </Button>
        </form>

        {preview && (
          <>
            <h2 className="font-semibold">Preview</h2>
            <img src={preview} className="w-full" />

            {!finalUrl && (
              <>
                <p className="text-sm mt-2">Generating high resolution...</p>
                <Progress value={progress} />
              </>
            )}
          </>
        )}

        {finalUrl && (
          <>
            <h2 className="font-semibold mt-4">High Resolution</h2>
            {/* <img src={finalUrl} className="w-full" /> */}
            <a
              href={finalUrl}
              download
              className="text-blue-500 underline"
            >
              Download
            </a>
          </>
        )}
      </Card>
    </div>
  );
}