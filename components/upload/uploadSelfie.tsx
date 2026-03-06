"use client";

import { useRef, useState } from "react";

export default function UploadSelfie() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
        });

        if (videoRef.current) {
        videoRef.current.srcObject = stream;
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
    };

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

            <button
                onClick={startCamera}
                className="bg-white text-black px-4 py-2 rounded-lg"
            >
                Start Camera
            </button>

            <button
                onClick={takePhoto}
                className="bg-white text-black px-4 py-2 rounded-lg"
            >
                Take Photo
            </button>
            </>
        )}

        {photo && (
            <>
            <img src={photo} alt="selfie" className="rounded-xl w-80" />
            <button
                onClick={() => setPhoto(null)}
                className="bg-white text-black px-4 py-2 rounded-lg"
            >
                Retake
            </button>
            </>
        )}

        <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}