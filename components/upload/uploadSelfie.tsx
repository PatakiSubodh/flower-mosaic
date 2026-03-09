"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadSelfie() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start as loading
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    };

    const retakePhoto = () => {
        setPhoto(null);
        startCamera(true);
    };

    const submitPhoto = async () => {
        if (!photo || isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        startCamera(false);

        try {
            // Convert base64 to Blob for efficient upload
            const byteString = atob(photo.split(",")[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: "image/png" });

            const formData = new FormData();
            formData.append("image", blob, "selfie.png");

            const response = await fetch("/api/upload-selfie", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Photo uploaded successfully!");
                // Optional: Show success toast/message here
                router.push("/"); // Navigate back after success
            } else {
                setError("Upload failed. Please try again.");
            }
        } catch (err) {
            setError("Upload error. Check your connection.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

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
        <div className="flex flex-col items-center gap-4 text-white">
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
                            <button
                                onClick={takePhoto}
                                aria-label="Take photo"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                            >
                                Click
                            </button>

                            <button
                                onClick={stopCamera}
                                aria-label="Stop camera and go back"
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                            >
                                Stop
                            </button>
                        </div>
                    )}

                    {!isCameraActive && !isLoading && (
                        <button
                            onClick={() => router.push("/")}
                            aria-label="Go back"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    )}
                </>
            )}

            {photo && (
                <>
                    <img src={photo} alt="Captured selfie" className="rounded-xl w-80 shadow-lg" />
                    <div className="flex gap-4 w-80 justify-center">
                        <button
                            onClick={retakePhoto}
                            aria-label="Retake photo"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1"
                        >
                            Retake
                        </button>

                        <button
                            onClick={submitPhoto}
                            disabled={isSubmitting}
                            aria-label="Submit photo"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex-1 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}