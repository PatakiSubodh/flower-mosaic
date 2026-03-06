"use client";

import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col gap-6 text-center">
        
        <button
          onClick={() => router.push("/upload-local")}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200"
        >
          <Upload size={20} />
          Upload from Device
        </button>

        <button
          onClick={() => router.push("/upload-selfie")}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200"
        >
          <Upload size={20} />
          Take Selfie
        </button>

      </div>
    </div>
  );
}