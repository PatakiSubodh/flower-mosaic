"use client";

import { useRouter } from "next/navigation";
import UploadSelfie from "@/components/upload/uploadSelfie";

export default function UploadSelfiePage() {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 overflow-hidden min-h-screen flex flex-col items-center justify-center p-6 gap-6">
        
        <button
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 text-white border px-4 py-1 rounded-md text-sm hover:bg-white hover:text-black hover:cursor-pointer transition-colors"
        >
            Back
        </button>

        <UploadSelfie />
        </div>
    );
}