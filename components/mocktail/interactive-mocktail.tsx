"use client";

import React, { useState } from "react";

const dotPoints = [
  { id: 1, x: 60, y: 60, break: false, label: "if", dx: -5, dy: -15 },
  { id: 2, x: 60, y: 160, break: false, label: "you", dx: -15, dy: 25 },
  { id: 3, x: 120, y: 160, break: false, label: "connect", dx: 15, dy: 20 },
  { id: 4, x: 170, y: 100, break: false, label: "the", dx: -10, dy: -15 },
  { id: 5, x: 220, y: 150, break: false, label: "dots,", dx: 15, dy: 5 },
  { id: 6, x: 170, y: 200, break: false, label: "you", dx: -35, dy: 5 },
  { id: 7, x: 200, y: 270, break: false, label: "will", dx: -10, dy: 25 },
  { id: 8, x: 270, y: 170, break: false, label: "i", dx: 15, dy: -5 },
  { id: 9, x: 340, y: 170, break: false, label: "much", dx: -5, dy: -15 },
  { id: 10, x: 340, y: 210, break: false, label: "how", dx: 15, dy: 5 },
  { id: 11, x: 270, y: 210, break: false, label: "know", dx: -45, dy: 5 },
  { id: 12, x: 240, y: 260, break: false, label: "love", dx: 15, dy: 20 },
  { id: 13, x: 340, y: 260, break: false, label: "you", dx: 15, dy: 5 },
];

export default function InteractiveMocktail() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleDotClick = (id: number) => {
    // Only allow clicking the exact next dot in the sequence
    if (id === currentStep + 1) {
      setCurrentStep(id);
    }
  };

  const reset = () => setCurrentStep(0);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-8 bg-black text-white rounded-2xl border border-gray-800">
      
      {/* <p className="text-xl md:text-2xl font-light mb-12 text-center tracking-wide">
        If you connect the dots you will know how much I love you...
      </p> */}

      <div className="relative w-full overflow-x-auto pb-6">
        <svg viewBox="0 0 420 320" className="w-full h-auto min-w-[500px]">
          
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
                style={{ filter: isConnected ? "drop-shadow(0px 0px 4px #ff2a5f)" : "none" }}
                className="transition-all duration-500 ease-in-out"
              />
            );
          })}

          {/* Draw Dots */}
          {dotPoints.map((point) => {
            const isClickable = point.id === currentStep + 1;
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
                  r={isConnected ? "5" : "3"}
                  fill={isConnected ? "white" : "#666"}
                  className={`transition-all duration-300 ${isClickable ? "animate-pulse fill-white" : ""}`}
                />
                
                {/* Word Label */}
                <text
                  x={point.x + (point.dx || 0)}
                  y={point.y + (point.dy || 0)}
                  fill={isConnected ? "white" : "#888"}
                  fontSize="14"
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

      {/* Completion State */}
      {currentStep === dotPoints.length && (
        <div className="mt-8 flex flex-col items-center animate-pulse">
          <span className="text-4xl mb-4">❤️</span>
          <button
            onClick={reset}
            className="px-6 py-2 border border-gray-600 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}