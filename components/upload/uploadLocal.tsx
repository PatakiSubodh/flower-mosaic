"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MosaicResult from "@/components/upload/MosaicResult";
import { useMosaicUpload } from "@/hooks/useMosaicUpload";

export default function UploadLocal() {
    const {
        preview, finalUrl, progress, loading, showSpy, setShowSpy,
        clickCount, btnStyle, handleUploadClick, processUploadLocal
    } = useMosaicUpload();

    const buttonLabels = [
        "Generate Mosaic",
        "Are you sure?",
        "Really sure?",
        "Positive?",
        "Last chance!",
        "Confirm?"
    ];

    const cornerImages = [
        "/sticky/finger.jpg",
        "/sticky/camera-final-download-high-res.jpg",
        "/sticky/gaay.jpg",
        "/sticky/hbd.jpg",
        "/sticky/no-click-3.jpg",
        "/sticky/please-dabba.jpg",
    ];

    const currentImage = cornerImages[Math.min(clickCount, cornerImages.length - 1)];

    async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!handleUploadClick()) return;

        const fileInput = e.currentTarget.elements.namedItem("image") as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (file) {
            await processUploadLocal(file);
        }
    }

    return (
        <>
            {!loading && clickCount > 0 && (
                <img
                    src={currentImage}
                    className="fixed top-0 right-0 w-40 pointer-events-none z-50 transition-all duration-300"
                    alt="corner spy"
                />
            )}

            <Card className="p-6 w-full max-w-lg gap-0 space-y-3">
                <h1 className="text-xl font-bold m-0 p-0">
                    Flower Mosaic Builder
                </h1>

                <form
                    onSubmit={handleUpload}
                    className="flex justify-left align-left flex-col gap-2"
                >
                    <input
                        type="file"
                        name="image"
                        required
                        className="border px-1 m-0 rounded h-full"
                        onChange={() => setShowSpy(true)}
                    />

                    <Button type="submit" disabled={loading} style={btnStyle}>
                        {loading
                            ? "Generating..."
                            : buttonLabels[Math.min(clickCount, buttonLabels.length - 1)]}
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
        </>
    );
}