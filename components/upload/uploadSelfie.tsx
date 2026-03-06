"use client";

import { useRef, useState } from "react";

export default function UploadSelfie() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const startCamera = async (start: boolean = true) => {
        if (!start) {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
            setIsCameraActive(false);
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
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
    };

    const retakePhoto = () => {
        setPhoto(null);
        startCamera(true);
    };

    const submitPhoto = () => {
        startCamera(false);
    };

    const stopCamera = () => {
        startCamera(false);
    }

    return (
        <div className="flex flex-col items-center gap-4 text-white">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                    Start Camera
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
                        onClick={stopCamera}
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