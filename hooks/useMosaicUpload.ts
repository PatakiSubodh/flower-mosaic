import { useState } from "react";
import { generateMosaicClientSide } from "@/lib/canvasCompose";

export function useMosaicUpload() {
    const [preview, setPreview] = useState<string | null>(null);
    const [finalUrl, setFinalUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showSpy, setShowSpy] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({});

    const handleUploadClick = () => {
        if (clickCount < 5) { 
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
        setProgress(0); // Reset progress on new attempt
        return true;
    };

    const processUploadLocal = async (file: File) => {
        try {
            // Process entirely in the browser
            const { previewUrl, finalUrl } = await generateMosaicClientSide(file, (percent) => {
                setProgress(Math.floor(percent));
            });
            
            setPreview(previewUrl);
            setFinalUrl(finalUrl);
        } catch (error) {
            console.error("Local generation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        preview,
        finalUrl,
        progress,
        loading,
        showSpy,
        setShowSpy,
        clickCount,
        btnStyle,
        handleUploadClick,
        processUploadLocal,
    };
}