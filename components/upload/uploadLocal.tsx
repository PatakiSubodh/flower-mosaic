"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MosaicResult from "@/components/upload/MosaicResult";
import { useMosaicUpload } from "@/hooks/useMosaicUpload";
import { useRouter } from "next/navigation";

export default function UploadLocal() {
    const {
        preview, finalUrl, wallpaperUrl, progress, loading, showSpy, setShowSpy,
        clickCount, btnStyle, handleUploadClick, processUploadResponse
    } = useMosaicUpload();
    const router = useRouter();

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
            {!loading && !preview && clickCount > 0 && (
                <img
                    src={currentImage}
                    className="fixed top-0 right-0 w-40 pointer-events-none z-50 transition-all duration-300"
                    alt="corner spy"
                />
            )}

            {!preview && !finalUrl && (
            <Card className="p-6 w-full max-w-lg gap-0 space-y-3 rounded-md">
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

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        style={btnStyle}
                        aria-label="Submit photo"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-colors flex-1 disabled:opacity-50"
                    >
                        {loading
                            ? "Generating..."
                            : buttonLabels[Math.min(clickCount, buttonLabels.length - 1)]}
                    </Button>
                </form>

            </Card>
            )}
            <MosaicResult
                loading={loading}
                msg={"Pro Tip: yeh wallpaper rakh sakti ho"}
                // msg={"Download"}
                preview={preview}
                progress={progress}
                finalUrl={finalUrl}
                wallpaperUrl={wallpaperUrl}
                showSpy={showSpy}
            />
            
            {finalUrl && (
            <div className="absolute bottom-5 right-5">
                <div className="flex flex-col items-center w-40">

                <span className="text-6xl mb-1">🌻</span>

                <button
                    onClick={() => finalUrl && router.push("/upload-selfie")}
                    disabled={!finalUrl}
                    className="relative overflow-hidden px-4 py-1 rounded-md border border-gray-600 text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed w-full hover:cursor-pointer"
                >
                    {/* progress fill */}
                    {!finalUrl && (
                    <span
                        className="absolute left-0 top-0 h-full bg-white/40 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                    )}

                    {/* text */}
                    <span className="relative z-10">
                    {finalUrl ? "Next surprise 👉" : `${Math.round(progress)}%`}
                    </span>

                </button>

                </div>
            </div>
            )}
        </>
    );
}