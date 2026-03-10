"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PixelPig from "@/components/walk/PixelPig";

interface MosaicResultProps {
    loading: boolean;
    preview: string | null;
    progress: number;
    finalUrl: string | null;
    showSpy: boolean;
}

export default function MosaicResult({ loading, preview, progress, finalUrl, showSpy }: MosaicResultProps) {
    return (
        <>
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