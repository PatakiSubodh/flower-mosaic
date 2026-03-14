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
            {loading && !preview && (
                <SunflowerLoader />
            )}
            {preview && !finalUrl && (
                <div className="absolute text-white font-mono top-5 right-5">
                    <p>{Math.round(progress)}%</p>
                </div>
            )}
            
            {preview && (
                <div className="p-2 w-full max-w-100 gap-0 space-y-3 rounded-md bg-white flex justify-start flex-col -mt-24">
                    
                    <img
                    src={preview}
                    alt="Mosaic Preview"
                    className="w-full rounded-md"
                    />

                    {!finalUrl && (
                        <p className="text-sm">Generating high resolution...</p>
                    )}

                </div>
            )}

            <img
                src="/img/pato.png"
                alt="spy"
                className={`fixed z-50 -bottom-3 right-0 w-40 transition-transform duration-700 ease-in-out ${
                    showSpy ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-0"
                }`}
            />
        </>
    );
}