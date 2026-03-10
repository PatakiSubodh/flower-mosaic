"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MosaicResult from "@/components/upload/MosaicResult";
import { useMosaicUpload } from "@/hooks/useMosaicUpload";

export default function UploadLocal() {
    const {
        preview, finalUrl, progress, loading, showSpy, setShowSpy,
        clickCount, btnStyle, handleUploadClick, processUploadResponse
    } = useMosaicUpload();

    const buttonLabels = ["Generate Mosaic", "Are you sure?", "Really sure?", "Positive?", "Last chance!", "Confirm?"];

    async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        if (!handleUploadClick()) return;

        try {
            const formData = new FormData(e.currentTarget);
            const res = await fetch("/api/generate", {
                method: "POST",
                body: formData,
            });
            await processUploadResponse(res);
        } catch (error) {
            console.error("Upload error", error);
        }
    }

    return (
        <Card className="p-6 w-full max-w-lg gap-0 space-y-3">
            <h1 className="text-xl font-bold m-0 p-0">Flower Mosaic Builder</h1>
            
            <form onSubmit={handleUpload} className="flex justify-left align-left flex-col gap-2">
                <input type="file" name="image" required className="border px-1 m-0 rounded h-full" onChange={() => setShowSpy(true)} />
                <Button type="submit" disabled={loading} style={btnStyle}>
                    {loading ? "Generating..." : buttonLabels[Math.min(clickCount, buttonLabels.length - 1)]}
                </Button>
            </form>

            <MosaicResult 
                loading={loading} 
                preview={preview} 
                progress={progress} 
                finalUrl={finalUrl} 
                showSpy={showSpy} 
            />
        </Card>
    );
}