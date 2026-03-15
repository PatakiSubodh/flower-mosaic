// "use client";

// import { useRouter } from "next/navigation";
// import { Laptop, Camera, Martini } from "lucide-react";
// import SunflowerLoader from "@/components/loader/SunflowerLoader";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <div className="bg-black min-h-screen flex items-center justify-center p-6">
//       {/* <SunflowerLoader /> */}
//       <div className="flex flex-col gap-5 text-center">
//         <button
//           onClick={() => router.push("/upload-local")}
//           className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
//         >
//           <Laptop size={20} />
//           Upload from Device
//         </button>

//         <button
//           onClick={() => router.push("/upload-selfie")}
//           className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
//         >
//           <Camera size={20} />
//           Take Selfie
//         </button>

//         <button
//           onClick={() => router.push("/mocktail")}
//           className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
//         >
//           <Martini size={20} />
//           Mocktail
//         </button>

//         <p className="text-white text-xs">Three little surprises for you.</p>

//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sun } from "lucide-react";

export default function BirthdayGift() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  const handleBoxClick = () => {
    if (clickCount >= 3) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 1) {
      toast("Keep going!", {
        description: <span className="text-black">Click the box 2 more times to open your gift! 🌻</span>,
      });
    } else if (newCount === 2) {
      toast("Almost there!", {
        description: <span className="text-black">Just 1 more click! 🌿</span>,
      });
    } else if (newCount === 3) {
      // toast.success("Happy Birthday!", {
      toast.success("Welcome", {
        description: <span className="text-black">Opening your special gift...</span>,
        icon: <Sun className="text-amber-500" />,
      });
      
      setTimeout(() => {
        router.push("/upload-local");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 overflow-hidden relative">
      
      <div className="absolute top-16 left-16 animate-pulse text-4xl opacity-60 hover:scale-110 transition-transform cursor-default">🌻</div>
      <div className="absolute bottom-24 right-20 animate-[bounce_3s_infinite] text-5xl opacity-60">🪴</div>
      <div className="absolute top-40 right-32 animate-pulse text-4xl opacity-60">🌞</div>
      <div className="absolute bottom-32 left-32 animate-[spin_10s_linear_infinite] text-3xl opacity-50">🌼</div>

      <div className="text-center z-10 mb-10 mt-5">
        <h1 className="text-5xl md:text-[62px] font-extrabold text-amber-700 drop-shadow-sm tracking-tight mb-4">
          Created for you, my surajmukhi!
        </h1>
        <p className="text-amber-900/80 mt-2 text-xl font-medium">Tap the box to see what's inside...</p>
        {/* <p className="text-amber-900/80 mt-2 text-xl font-medium">Jao dekho maje karo...</p>
        <p className="text-amber-900/80 text-md font-medium">Ik main sundar hu...itna pighalne ki koi jarurath nai huh!</p> */}
      </div>

      <div 
        className="relative z-10 cursor-pointer"
        onClick={handleBoxClick}
      >
        <motion.div 
          className="absolute inset-0 bg-yellow-300 rounded-full blur-[60px] top-5"
          animate={{
            opacity: clickCount * 0.3,
            scale: 1 + clickCount * 0.6,
          }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative w-72 h-72 flex flex-col items-center justify-end">
          
          <motion.div
            className="absolute top-20 z-20 w-80 h-16 bg-emerald-600 rounded-xl shadow-xl flex justify-center items-center border-b-4 border-emerald-800"
            animate={{
              y: clickCount === 1 ? -25 : clickCount === 2 ? -50 : clickCount === 3 ? -400 : 0,
              rotateZ: clickCount === 1 ? -3 : clickCount === 2 ? 8 : clickCount === 3 ? 35 : 0,
              opacity: clickCount === 3 ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }}
          >
            <div className="w-14 h-full bg-amber-400 shadow-inner border-x border-amber-500/50" />
            
            <div className="absolute -top-10 flex">
               <div className="w-16 h-10 bg-amber-400 rounded-full border-4 border-amber-500 -mr-4 rounded-br-none transform -rotate-12 shadow-lg" />
               <div className="w-16 h-10 bg-amber-400 rounded-full border-4 border-amber-500 -ml-4 rounded-bl-none transform rotate-12 shadow-lg" />
            </div>
          </motion.div>

          <motion.div
            className="relative w-72 h-44 bg-emerald-500 rounded-b-2xl shadow-2xl flex justify-center overflow-hidden border-t border-emerald-400"
            animate={{
              scale: clickCount === 3 ? 1.08 : 1,
            }}
            transition={{ type: "spring", bounce: 0.6 }}
          >
            <div className="w-14 h-full bg-amber-400 shadow-inner border-x border-amber-500/50" />
            
            <div className="absolute top-0 w-full h-6 bg-emerald-900/40" />
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}