"use client";

import { useRouter } from "next/navigation";
import { Laptop, Camera, Martini } from "lucide-react";
import SunflowerLoader from "@/components/loader/SunflowerLoader";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      {/* <SunflowerLoader /> */}
      <div className="flex flex-col gap-5 text-center">
        <button
          onClick={() => router.push("/upload-local")}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
        >
          <Laptop size={20} />
          Upload from Device
        </button>

        <button
          onClick={() => router.push("/upload-selfie")}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
        >
          <Camera size={20} />
          Take Selfie
        </button>

        <button
          onClick={() => router.push("/mocktail")}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
        >
          <Martini size={20} />
          Mocktail
        </button>

        <p className="text-white text-xs">Three little surprises for you.</p>

      </div>
    </div>
  );
}