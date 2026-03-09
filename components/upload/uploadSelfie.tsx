"use client";

import { useRef, useState, useEffect } from "react";

export default function UploadSelfie() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const startCamera = async (start: boolean = true) => {
        if (!start) {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
            setIsCameraActive(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
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
    };

    const retakePhoto = () => {
        setPhoto(null);
        startCamera(true);
    };

    const submitPhoto = async () => {
        if (!photo) return;
        startCamera(false);

        // Placeholder: Upload to a server (replace with your endpoint)
        try {
            const response = await fetch("/api/upload-selfie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: photo }),
            });
            if (response.ok) {
                console.log("Photo uploaded successfully!");
                setPhoto(null); // Clear photo after successful submit
            } else {
                setError("Upload failed. Please try again.");
            }
        } catch (err) {
            setError("Upload error. Check your connection.");
            console.error(err);
        }
    };

    useEffect(() => {
        return () => {
            startCamera(false); // Cleanup on unmount
        };
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 text-white">
            {error && <p className="text-red-500">{error}</p>}

            {!photo && (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-xl w-80"
                    />

                    {!isCameraActive ? (
                        <button
                            onClick={() => startCamera(true)}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Starting..." : "Start Camera"}
                        </button>
                    ) : (
                        <div className="flex gap-4 w-80 justify-center">
                            <button
                                onClick={takePhoto}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                            >
                                Click
                            </button>

                            <button
                                onClick={() => startCamera(false)}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                            >
                                Stop
                            </button>
                        </div>
                    )}
                </>
            )}

            {photo && (
                <>
                    <img src={photo} alt="selfie" className="rounded-xl w-80 shadow-lg" />
                    <div className="flex gap-4 w-80 justify-center">
                        <button
                            onClick={retakePhoto}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                        >
                            Retake
                        </button>

                        <button
                            onClick={submitPhoto}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                        >
                            Submit
                        </button>
                    </div>
                </>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}