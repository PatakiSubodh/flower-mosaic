"use client";

import { useRouter } from "next/navigation";
import UploadLocal from "@/components/upload/uploadLocal";

export default function UploadLocalPage() {
    const router = useRouter();

    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6 gap-6">
        
        <button
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 text-white border px-4 py-2 rounded-lg hover:bg-white hover:text-black"
        >
            Back
        </button>

        <UploadLocal />
        </div>
    );
}