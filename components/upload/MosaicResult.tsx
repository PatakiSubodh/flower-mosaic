"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PixelPig from "@/components/walk/PixelPig";
import SunflowerLoader from "../loader/SunflowerLoader";
import { useEffect } from "react";
import { toast } from "sonner";

interface MosaicResultProps {
    loading: boolean;
    msg: string | null;
    preview: string | null;
    progress: number;
    finalUrl: string | null;
    wallpaperUrl: string | null;
    showSpy: boolean;
}

export default function MosaicResult({ loading, msg, preview, progress, finalUrl, wallpaperUrl, showSpy }: MosaicResultProps) {

    useEffect(() => {
        if (finalUrl && wallpaperUrl) {

            const download = (url: string) => {
            const a = document.createElement("a");
            a.href = url;
            a.download = "";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            };

            download(finalUrl);

            setTimeout(() => {
            download(wallpaperUrl);

            toast.info(msg || "Downloads started 📂");

            }, 7000);

        }
    }, [finalUrl, wallpaperUrl]);

    return (
        <>
            {preview && !finalUrl && <PixelPig />}
            {/* {loading && !preview && ( */}
            {(
                <SunflowerLoader />
            )}
            {/* {preview && !finalUrl && (
                <div className="absolute text-black font-mono top-5 right-5">
                    <p>{Math.round(progress)}%</p>
                </div>
            )} */}
            
            {preview && (
                <div className="relative p-4 sm:p-6 w-full max-w-md gap-4 rounded-md bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-orange-900/10 flex flex-col items-center text-center">
                    
                    <img
                    src={preview}
                    alt="Mosaic Preview"
                    className="w-full rounded-md"
                    />

                    {!finalUrl && (
                        <p className="text-sm font-semibold text-orange-800 animate-pulse">
                            Ruko jara...sabar karo <span className="inline-block animate-spin">⏳</span>
                        </p>
                    )}

                </div>
            )}

            <img
                src="/img/pato.png"
                alt="spy"
                className={`fixed z-50 -bottom-3 right-0 w-40 transition-transform duration-700 ease-in-out drop-shadow-[0_4px_10px_rgba(154,52,18,0.5)] ${ 
                    showSpy ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-0"
                }`}
            />
        </>
    );
}