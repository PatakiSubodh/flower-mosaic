"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PixelPig from "@/components/walk/PixelPig";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSpy, setShowSpy] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({});

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (clickCount < 0) {           // later change it to as many you want
      setClickCount((prev) => prev + 1);
      setBtnStyle({
        position: "fixed",
        top: `${Math.random() * 80 + 10}vh`,
        right: `${Math.random() * 80 + 10}vw`,
        zIndex: 100,
      });
      return;
    }
    setBtnStyle({});
    setLoading(true);
    setShowSpy(false);

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
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <Card className="p-6 w-full max-w-lg gap-0 space-y-3">
        {/* <h1 className="text-xl font-bold m-0 p-0">
          {loading ? "I !hate you" : "Yeh kya chutiyp hai ab"}
        </h1>
        <form onSubmit={handleUpload} className="flex justify-left align-left flex-col gap-2" >
          <input type="file" name="image" required className="border px-1 m-0 rounded h-full " onChange={() => setShowSpy(true)} />
          <Button type="submit" disabled={loading}>
            {loading ? "Mera sunnti kyu nai kabhi 😒" : "Kya karna hai janna ke 😂"}
          </Button>
        </form> */}
          <h1 className="text-xl font-bold m-0 p-0">Flower Mosaic Builder</h1>
          <form onSubmit={handleUpload} className="flex justify-left align-left flex-col gap-2" >
            <input type="file" name="image" required className="border px-1 m-0 rounded h-full " onChange={() => setShowSpy(true)} />
            <Button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Generating..." : ["Generate Mosaic", "Are you sure?", "Really sure?", "Positive?", "Last chance!", "Confirm?"][clickCount]}
            </Button>
          </form>

        {loading && !preview && <PixelPig />}

        {preview && (
          <div className="space-y-2 mt-4">
            <h2 className="font-semibold">Preview</h2>
            <img src={preview} alt="Mosaic Preview" className="w-full rounded border border-zinc-800" />

            {!finalUrl && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <p>Generating high resolution...</p>
                  <p>{Math.round(progress)}%</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {finalUrl && (
          <div className="space-y-3 mt-6 pt-4 border-t border-zinc-800">
            <h2 className="font-semibold text-green-700">Generation Complete!</h2>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <a href={finalUrl} download>
                Download High Resolution
              </a>
            </Button>
          </div>
        )}

        {/* <Dialog
          open={preview !== null}
          onOpenChange={(open) => {
            if (!open && !loading) {
              setPreview(null);
              setFinalUrl(null);
              setProgress(0);
            }
          }}
        >
          <DialogContent
            className="max-w-xl"
            onInteractOutside={(e) => {
              if (loading) e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              if (loading) e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {finalUrl ? "High Resolution Mosaic" : "Preview"}
              </DialogTitle>
            </DialogHeader>

            {preview && (
              <>
                <img src={preview} className="w-full rounded-md" />

                {!finalUrl && (
                  <>
                    <p className="text-sm mt-3">Generating high resolution...</p>
                    <Progress value={progress} />
                  </>
                )}
              </>
            )}

            {finalUrl && (
              <a
                href={finalUrl}
                download
                className="text-blue-500 underline mt-4 block"
              >
                Download High Resolution
              </a>
            )}
          </DialogContent>
        </Dialog> */}
      </Card>

      <img
        src="/img/pato.png"
        alt="spy"
        className={`fixed z-50 -bottom-3 right-0 w-40 transition-transform duration-700 ease-in-out ${
          showSpy ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-0"
        }`}
      />
    </div>
  );
}