"use client";

import { useRouter } from "next/navigation";
import UploadLocal from "@/components/upload/uploadLocal";

export default function UploadLocalPage() {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        
        <button
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 px-4 py-1 text-sm rounded-md border border-orange-400 text-orange-800 font-medium transition-colors hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed hover:cursor-pointer shadow-sm bg-white/50 backdrop-blur-sm"
        >
            Back
        </button>

        <UploadLocal />
        </div>
    );
}