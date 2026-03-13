"use client";

import React, { useState } from "react";

const dotPoints = [
  { id: 1, x: 70, y: 40, break: false, label: "If", dx: -17, dy: -3 },
  { id: 2, x: 70, y: 140, break: false, label: "you", dx: -25, dy: 15 },
  { id: 3, x: 122, y: 140, break: false, label: "connect", dx: -15, dy: 15 },
  { id: 4, x: 130, y: 120, break: false },
  { id: 5, x: 142, y: 108, break: false },
  { id: 6, x: 156, y: 98, break: false },
  { id: 7, x: 170, y: 92, break: false, label: "the", dx: -10, dy: -10 },
  { id: 8, x: 185, y: 98, break: false },
  { id: 9, x: 198, y: 108, break: false },
  { id: 10, x: 208, y: 122, break: false },
  { id: 11, x: 218, y: 140, break: false, label: "dots", dx: 5, dy: 10 },
  { id: 12, x: 208, y: 158, break: false },
  { id: 13, x: 198, y: 172, break: false },
  { id: 14, x: 185, y: 182, break: false },
  { id: 15, x: 170, y: 188, break: false, label: "you", dx: -27, dy: 10 },
  { id: 16, x: 225, y: 270, break: false, label: "will", dx: -8, dy: 17 },
  { id: 17, x: 280, y: 185, break: false, label: "know", dx: -10, dy: -9 },
  { id: 18, x: 350, y: 185, break: false, label: "how", dx: 10, dy: 9 },
  { id: 19, x: 360, y: 170, break: false },
  { id: 20, x: 360, y: 155, break: false },
  { id: 21, x: 350, y: 140, break: false, label: "much", dx: 6, dy: -7 },
  { id: 22, x: 275, y: 140, break: false, label: "I", dx: 5, dy: -10 },
  { id: 23, x: 268, y: 150, break: false },
  { id: 24, x: 260, y: 162, break: false },
  { id: 25, x: 253, y: 174, break: false },
  { id: 26, x: 250, y: 185, break: false },
  { id: 27, x: 253, y: 198, break: false },
  { id: 28, x: 260, y: 210, break: false },
  { id: 29, x: 268, y: 220, break: false },
  { id: 30, x: 280, y: 230, break: false, label: "like", dx: -7, dy: 19 },
  { id: 31, x: 345, y: 230, break: false, label: "you", dx: -7, dy: 19 },
];

export default function InteractiveMocktail() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleDotClick = (id: number) => {
    const nextLabeled = dotPoints.find((p) => p.id > currentStep && p.label);
    if (nextLabeled && id === nextLabeled.id) {
      setCurrentStep(id);
    }
  };

  const reset = () => setCurrentStep(0);

  return (
    <>
  <div className="relative w-full flex justify-center items-center gap-2">
    <div className="flex items-center justify-center w-full max-w-3xl bg-black text-white">
      <div className="relative w-full overflow-x-auto pb-6">
        <svg viewBox="0 0 420 320" className="w-full h-auto min-w-130">
          
          {/* Draw Lines */}
          {dotPoints.map((point, index) => {
            if (index === 0 || point.break) return null;
            const prevPoint = dotPoints[index - 1];
            const isConnected = currentStep >= point.id;

            return (
              <line
                key={`line-${point.id}`}
                x1={prevPoint.x}
                y1={prevPoint.y}
                x2={point.x}
                y2={point.y}
                stroke={isConnected ? "#ff2a5f" : "transparent"}
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: isConnected ? "drop-shadow(0px 0px 5px #ff2a5f)" : "none" }}
                className="transition-all duration-500 ease-in-out"
              />
            );
          })}

          {/* Draw Dots */}
          {dotPoints.map((point) => {
            if (!point.label) return null;

            const nextLabeled = dotPoints.find((p) => p.id > currentStep && p.label);
            const isClickable = nextLabeled && point.id === nextLabeled.id;
            const isConnected = currentStep >= point.id;

            return (
              <g 
                key={`dot-${point.id}`} 
                onClick={() => handleDotClick(point.id)} 
                className={isClickable ? "cursor-pointer" : "cursor-default"}
              >
                {/* Invisible Click Target (Makes clicking easier on mobile) */}
                <circle cx={point.x} cy={point.y} r="15" fill="transparent" />
                
                {/* Visible Dot */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isConnected ? "4" : "3"}
                  fill={isConnected ? "white" : "#666"}
                  className={`transition-all duration-300 ${isClickable ? "animate-pulse fill-white" : ""}`}
                />
                
                {/* Word Label */}
                <text
                  x={point.x + (point.dx || 0)}
                  y={point.y + (point.dy || 0)}
                  fill={isConnected ? "white" : "#888"}
                  fontSize="11"
                  fontWeight="bold"
                  className="select-none pointer-events-none"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>

  </div>
    {/* Bottom Right Button */}
    <div className="absolute bottom-5 right-5">
      {currentStep === dotPoints[dotPoints.length - 1].id && (
        <div className="flex flex-col items-center">
          <span className="text-6xl mb-0.5">🌻</span>
          <button
            onClick={reset}
            className="px-4 py-1 rounded-md text-md text-md border border-gray-600 hover:bg-white hover:text-black text-white hover:cursor-pointer transition-colors"
          >
            Connect Again
          </button>
        </div>
      )}
    </div>
    </>
  );
}