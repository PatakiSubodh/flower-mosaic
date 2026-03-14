import { useState } from "react";

export function useMosaicUpload() {
    const [preview, setPreview] = useState<string | null>(null);
    const [finalUrl, setFinalUrl] = useState<string | null>(null);
    const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showSpy, setShowSpy] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({});

    const handleUploadClick = () => {
        if (clickCount < 0) { 
            setClickCount((prev) => prev + 1);
            setBtnStyle({
                position: "fixed",
                top: `${Math.random() * 80 + 10}vh`,
                right: `${Math.random() * 80 + 10}vw`,
                zIndex: 100,
            });
            return false;
        }
        setBtnStyle({});
        setLoading(true);
        setShowSpy(false);
        return true;
    };

    const processUploadResponse = async (res: Response) => {
        const data = await res.json();
        setPreview(data.previewUrl);
        pollStatus(data.jobId);
    };

    const pollStatus = async (jobId: string) => {
        const interval = setInterval(async () => {
            const res = await fetch(`/api/status?jobId=${jobId}`);
            const data = await res.json();
            setProgress(data.progress);
            if (data.done) {
                clearInterval(interval);
                setFinalUrl(data.finalUrl);
                setWallpaperUrl(data.wallpaperUrl);
                setLoading(false);
            }
        }, 1000);
    };

    return {
        preview,
        finalUrl,
        wallpaperUrl,
        progress,
        loading,
        showSpy,
        setShowSpy,
        clickCount,
        btnStyle,
        handleUploadClick,
        processUploadResponse,
    };
}