"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useTransform, useMotionValue, animate } from "framer-motion";

export default function SunflowerLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useMotionValue(0);
  const containerHeight = useMotionValue(0);
  const [clicks, setClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const mouseAngle = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = window.innerHeight - e.clientY;
      const angle = Math.atan2(x, y) * (180 / Math.PI);
      mouseAngle.set(Math.max(-45, Math.min(45, angle)));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerWidth.set(containerRef.current.offsetWidth);
      containerHeight.set(containerRef.current.offsetHeight);
    }
  }, []);

  const sunProgress = useMotionValue(0);

  useEffect(() => {
    sunProgress.set(0.1);
    const animation = animate(sunProgress, 0.9, {
      duration: 15,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    });
    return animation.stop;
  }, []);

  const sunX = useTransform(sunProgress, [0, 1], ["-20%", "120%"]);

  const sunY = useTransform(
    sunProgress,
    [0.1, 0.5, 0.9],
    ["80%", "15%", "80%"]
  );

  const skyColor = useTransform(
    sunProgress,
    [0.1, 0.2, 0.5, 0.8, 0.9],
    ["#0f172a", "#334155", "#7dd3fc", "#334155", "#0f172a"]
  );

  const petals = [
    { cx: 100, cy: 45 }, { cx: 138.8, cy: 61.2 }, { cx: 155, cy: 100 }, { cx: 138.8, cy: 138.8 },
    { cx: 100, cy: 155 }, { cx: 61.2, cy: 138.8 }, { cx: 45, cy: 100 }, { cx: 61.2, cy: 61.2 },
  ];

  const petalColors = ["#FFD62B", "#FFC414", "#FFD62B", "#FFC414", "#FFD62B", "#FFC414", "#FFD62B", "#FFC414"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-orange-50/40 backdrop-blur-xs">
      <motion.div
        ref={containerRef}
        style={{ backgroundColor: skyColor }}
        className="relative w-[60vw] h-[40vh] flex flex-col justify-end overflow-hidden rounded-md shadow-2xl"
      >
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-amber-400 opacity-90 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]"
          style={{
            left: sunX,
            top: sunY,
            marginTop: "-2rem",
            marginLeft: "-2rem",
          }}
        />

        <div className="absolute bottom-0 w-full h-6 bg-slate-800 border-t border-slate-700" />

        <div className="absolute bottom-4 left-1/2 flex flex-col items-center -translate-x-1/2">

          <motion.div
            className="w-20 h-20 z-20 drop-shadow-xl cursor-pointer"
            onClick={() => {
              setClicks(c => c + 1);
              setShowSecret(true);
            }}
            style={{
              rotate: mouseAngle,
              transformOrigin: "50% 50%",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
              {petals.map((petal, index) => (
                <circle key={index} cx={petal.cx} cy={petal.cy} r="38" fill={petalColors[index]} />
              ))}

              {showSecret ? (
                <g>
                  <circle cx="100" cy="100" r="46" fill="#7A4238" />
                  <circle cx="97" cy="97" r="46" fill="#94564C" />

                  {clicks >= 2 ? (
                    <path d="M 75 88 L 85 92 L 75 96" stroke="#FFD62B" strokeWidth="4" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M 75 90 Q 85 75 95 90" stroke="#FFD62B" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                  )}

                  <path d="M 105 90 Q 115 75 125 90" stroke="#FFD62B" strokeWidth="4" fill="transparent" strokeLinecap="round" />

                  <path d="M 85 110 Q 100 125 115 110" stroke="#FFD62B" strokeWidth="4" fill="transparent" strokeLinecap="round" />

                  <circle cx="70" cy="105" r="8" fill={clicks >= 2 ? "#F43F5E" : "#D68A7E"} opacity={clicks >= 2 ? "0.9" : "0.8"} />
                  <circle cx="130" cy="105" r="8" fill={clicks >= 2 ? "#F43F5E" : "#D68A7E"} opacity={clicks >= 2 ? "0.9" : "0.8"} />
                </g>
              ) : (
                <g>
                  <circle cx="100" cy="100" r="46" fill="#7A4238" />
                  <circle cx="97" cy="97" r="46" fill="#94564C" />
                  <rect x="65" y="65" width="24" height="10" rx="5" transform="rotate(-42 77 70)" fill="#D68A7E" opacity="0.8" />
                  <circle cx="62" cy="85" r="5" fill="#D68A7E" opacity="0.8" />
                </g>
              )}
            </svg>
          </motion.div>

          <div className="relative flex flex-col items-center z-10 -mt-8">
            <div className="w-1.5 h-16 bg-emerald-600 rounded-full" />
            {/* <svg
              className="absolute top-6 right-1 w-8 h-8 text-emerald-600 drop-shadow-sm"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ transform: "rotate(-102deg)" }}
            >
              <path d="M21 3C21 3 20 5.5 17.5 8C15 10.5 10 12 10 12C10 12 11.5 7 14 4.5C16.5 2 19 3 19 3H21ZM10 12L3 19V21H5L12 14C12 14 10 12 10 12Z" />
            </svg> */}
            <svg
              className="absolute top-5 left-0.5 w-8 h-8 text-emerald-600 drop-shadow-sm"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ transform: "rotate(15deg)" }}
            >
              <path d="M21 3C21 3 20 5.5 17.5 8C15 10.5 10 12 10 12C10 12 11.5 7 14 4.5C16.5 2 19 3 19 3H21ZM10 12L3 19V21H5L12 14C12 14 10 12 10 12Z" />
            </svg>
          </div>

        </div>
      </motion.div>
    </div>
  );
}