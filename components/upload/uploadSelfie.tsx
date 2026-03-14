"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MosaicResult from "@/components/upload/MosaicResult";
import { useMosaicUpload } from "@/hooks/useMosaicUpload";

export default function UploadSelfie() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingCamera, setIsLoadingCamera] = useState(true);

    const {
        preview, finalUrl, progress, loading, showSpy, setShowSpy,
        clickCount, btnStyle, handleUploadClick, processUploadResponse
    } = useMosaicUpload();

    const buttonLabels = ["Generate Mosaic", "Are you sure?", "Really sure?", "Positive?", "Last chance!", "Confirm?"];

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
            setIsLoadingCamera(false);
            return;
        }

        setIsLoadingCamera(true);
        setError(null);
        try {
            stopStream();

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
            setIsLoadingCamera(false);
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
        startCamera(false);
        setShowSpy(true);
    };

    const retakePhoto = () => {
        setPhoto(null);
        setShowSpy(false);
        startCamera(true);
    };

    async function handleUpload() {
        if (!handleUploadClick()) return;

        try {
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
            await processUploadResponse(res);
        } catch (err) {
            setError("Upload error. Check your connection.");
            console.error(err);
            // Reset loading state on error so user can try again
        }
    }

    const stopCamera = () => {
        startCamera(false);
        router.push("/");
    };

    useEffect(() => {
        startCamera(true);
        return () => {
            stopStream();
        };
    }, []);

    return (
        <Card className="p-6 w-full max-w-lg gap-0 space-y-3 rounded-md">
            <h1 className="text-xl font-bold m-0 p-0">Flower Mosaic Builder</h1>

            {error && <p className="text-red-500">{error}</p>}

            {!photo && (
                <>
                    {isLoadingCamera && <p>Starting camera...</p>}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-md w-full"
                    />

                    {isCameraActive && (
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={takePhoto}
                                aria-label="Take photo"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition-colors flex-1"
                            >
                                Click
                            </Button>
                            <Button
                                onClick={stopCamera}
                                aria-label="Stop camera and go back"
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition-colors flex-1"
                            >
                                Stop
                            </Button>
                        </div>
                    )}

                    {!isCameraActive && !isLoadingCamera && (
                        <Button
                            onClick={() => router.push("/")}
                            aria-label="Go back"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-md transition-colors w-full"
                        >
                            Back
                        </Button>
                    )}
                </>
            )}

            {photo && !preview && (
                <>
                    <img src={photo} alt="Captured selfie" className="rounded-md w-full shadow-lg" />
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={retakePhoto}
                            aria-label="Retake photo"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-md transition-colors flex-1"
                        >
                            Retake
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={loading}
                            style={btnStyle}
                            aria-label="Submit photo"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-colors flex-1 disabled:opacity-50"
                        >
                            {loading ? "Generating..." : buttonLabels[Math.min(clickCount, buttonLabels.length - 1)]}
                        </Button>
                    </div>
                </>
            )}

            <MosaicResult 
                loading={loading} 
                msg={"yeh mujhe bhej sakti ho, bas bata raha hu!"}
                preview={preview} 
                progress={progress} 
                finalUrl={finalUrl} 
                showSpy={showSpy} 
            />

            <canvas ref={canvasRef} className="hidden" />
        </Card>
    );
}