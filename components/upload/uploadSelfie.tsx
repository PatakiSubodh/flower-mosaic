"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PixelPig from "@/components/walk/PixelPig";

export default function UploadSelfie() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [finalUrl, setFinalUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showSpy, setShowSpy] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({});
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start as loading

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const startCamera = async (start: boolean = true) => {
        if (!start) {
            stopStream();
            setIsCameraActive(false);
            setError(null);
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Camera access not supported in this browser.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            stopStream(); // Ensure any existing stream is stopped

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            if (!videoRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
        } catch (err) {
            setError("Failed to access camera. Please check permissions.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/png");
        setPhoto(imageData);
        startCamera(false); // Stop stream after capture
        setShowSpy(true);
    };

    const retakePhoto = () => {
        setPhoto(null);
        startCamera(true);
    };

    async function handleUpload() {
        if (clickCount < 5) {
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

        try {
            // Convert base64 to Blob for efficient upload
            if (!photo) return;
            const byteString = atob(photo.split(",")[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: "image/png" });

            const formData = new FormData();
            formData.append("image", blob, "selfie.png");

            const res = await fetch("/api/generate", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            setPreview(data.previewUrl);

            pollStatus(data.jobId);
        } catch (err) {
            setError("Upload error. Check your connection.");
            console.error(err);
            setLoading(false);
        }
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

    const stopCamera = () => {
        startCamera(false);
        router.push("/"); // Navigate back to base page
    };

    useEffect(() => {
        startCamera(true);

        return () => {
            stopStream();
        };
    }, []);

    return (
        <>
        <Card className="p-6 w-full max-w-lg gap-0 space-y-3">
            <h1 className="text-xl font-bold m-0 p-0">Flower Mosaic Builder</h1>

            {error && <p className="text-red-500">{error}</p>}

            {!photo && (
                <>
                    {isLoading && <p>Starting camera...</p>}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-xl w-80"
                    />

                    {isCameraActive && (
                        <div className="flex gap-4 w-80 justify-center">
                            <Button
                                onClick={takePhoto}
                                aria-label="Take photo"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                            >
                                Click
                            </Button>

                            <Button
                                onClick={stopCamera}
                                aria-label="Stop camera and go back"
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                            >
                                Stop
                            </Button>
                        </div>
                    )}

                    {!isCameraActive && !isLoading && (
                        <Button
                            onClick={() => router.push("/")}
                            aria-label="Go back"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                        >
                            Go Back
                        </Button>
                    )}
                </>
            )}

            {photo && !preview && (
                <>
                    <img src={photo} alt="Captured selfie" className="rounded-xl w-80 shadow-lg" />
                    <div className="flex gap-4 w-80 justify-center">
                        <Button
                            onClick={retakePhoto}
                            aria-label="Retake photo"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                        >
                            Retake
                        </Button>

                        <Button
                            onClick={handleUpload}
                            disabled={loading}
                            style={btnStyle}
                            aria-label="Submit photo"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1 disabled:opacity-50"
                        >
                            {loading ? "Generating..." : ["Generate Mosaic", "Are you sure?", "Really sure?", "Positive?", "Last chance!", "Confirm?"][clickCount]}
                        </Button>
                    </div>
                </>
            )}

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

            <canvas ref={canvasRef} className="hidden" />
        </Card>

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