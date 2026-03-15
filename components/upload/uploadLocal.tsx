"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MosaicResult from "@/components/upload/MosaicResult";
import { useMosaicUpload } from "@/hooks/useMosaicUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadLocal() {
    const {
        preview, finalUrl, wallpaperUrl, progress, loading, showSpy, setShowSpy,
        clickCount, btnStyle, handleUploadClick, processUploadResponse
    } = useMosaicUpload();
    const router = useRouter();
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    const buttonLabels = [
        "Jadoo dekhni hai kay...",
        "Pakka yahi photo? 🤨",
        "Socch lo ek aur baar 🤔",
        "Sahi mein yahi wali naa? 🤦‍♂️",
        "Aakhri mauka...dekhlo bhai 🥱",
        "Aapki baat maani padgegi na! 😂"
    ];

    const cornerImages = [
        "/sticky/finger.jpg",
        "/sticky/camera-final-download-high-res.jpg",
        "/sticky/gaay.jpg",
        "/sticky/hbd.jpg",
        "/sticky/no-click-3.jpg",
        "/sticky/please-dabba.jpg",
    ];

    const currentImage =
        cornerImages[Math.min(clickCount, cornerImages.length - 1)];

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
        <>
            {!loading && !preview && clickCount > 0 && (
                <img
                    src={currentImage}
                    className="fixed top-0 right-0 w-40 pointer-events-none z-50 transition-all duration-300"
                    alt="corner spy"
                />
            )}

            {!preview && !finalUrl && (
            <Card className="relative p-8 sm:p-10 w-full max-w-md rounded-md bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-orange-900/10 flex flex-col items-center text-center gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center justify-center p-2 bg-orange-100/50 rounded-md mb-2">
                        <span className="text-2xl">🫣✨</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-orange-950 tracking-tight">
                        koi acchi si photu dena aapki 🫣
                    </h1>
                    <p className="text-sm font-medium text-orange-700/70">
                        Cringe wali bhi chalega 😂
                    </p>
                </div>

                <form
                    onSubmit={handleUpload}
                    className="flex flex-col w-full gap-4"
                >
                    <div className="relative group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-200 rounded-md bg-white/40 hover:bg-white/80 hover:border-orange-400 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md overflow-hidden">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            required
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            onChange={(e) => {
                                setShowSpy(true);
                                if (e.target.files && e.target.files[0]) {
                                    setLocalPreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }}
                        />
                        {localPreview ? (
                            <div className="absolute inset-0 w-full h-full z-10 bg-orange-50/80 p-2 flex items-center justify-center">
                                <img src={localPreview} alt="Selected" className="max-w-full max-h-full object-contain rounded shadow-sm" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 transform group-hover:-translate-y-1 transition-transform duration-300 z-10">
                                <div className="p-4 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                                    <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-orange-900">Chalo abhi chup chap ek chuniye</span>
                                <span className="text-xs text-orange-600/60">koi bhi chalega</span>
                            </div>
                        )}
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        style={btnStyle}
                        aria-label="Submit photo"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 text-md font-semibold hover:cursor-pointer shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {loading
                            ? "Sabr karo thoda ⏳..."
                            : buttonLabels[Math.min(clickCount, buttonLabels.length - 1)]}
                    </Button>
                </form>
            </Card>
            )}
            <MosaicResult
                loading={loading}
                // msg={"Pro Tip: yeh wallpaper rakh sakti ho"}
                msg={"Download"}
                preview={preview}
                progress={progress}
                finalUrl={finalUrl}
                wallpaperUrl={wallpaperUrl}
                showSpy={showSpy}
            />
            
            {preview && (
            <div className="absolute bottom-5 right-5">
                <div className="flex flex-col items-center w-40">

                <span className="text-6xl mb-1">🌻</span>

                <button
                    onClick={() => finalUrl && router.push("/upload-selfie")}
                    disabled={!finalUrl}
                    className="relative overflow-hidden px-4 py-1 rounded-md border-2 border-orange-400 text-orange-800 font-medium transition-colors hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed w-full hover:cursor-pointer shadow-sm bg-white/50 backdrop-blur-sm"
                >
                    {/* progress fill */}
                    {!finalUrl && (
                    <span
                        className="absolute left-0 top-0 h-full bg-orange-300/50 transition-all duration-300"
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