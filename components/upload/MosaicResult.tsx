"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PixelPig from "@/components/walk/PixelPig";
import SunflowerLoader from "../loader/SunflowerLoader";

interface MosaicResultProps {
    loading: boolean;
    msg: string | null;
    preview: string | null;
    progress: number;
    finalUrl: string | null;
    showSpy: boolean;
}

export default function MosaicResult({ loading, msg, preview, progress, finalUrl, showSpy }: MosaicResultProps) {
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
                <div className="p-6 w-full max-w-lg gap-0 space-y-3 rounded-md bg-white flex justify-start flex-col -mt-26">
                    
                    <img
                    src={preview}
                    alt="Mosaic Preview"
                    className="w-full rounded-md"
                    />

                    {finalUrl ? (
                    <div className="pt-2 border-t border-zinc-800 flex gap-2 items-center">
                        <h2 className="font-semibold">{msg}</h2>
                        <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] h-7 px-3 py-1"
                        >
                        <a href={finalUrl} download>
                            Download High Res
                        </a>
                        </Button>
                    </div>
                    ) :
                        <p>Generating high resolution...</p>
                    }

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