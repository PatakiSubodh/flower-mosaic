"use client";

import React, { useState } from "react";

const dotPoints = [
  { id: 1, x: 60, y: 60, break: false, label: "if", dx: -5, dy: -15 },
  { id: 2, x: 60, y: 80, break: false },
  { id: 3, x: 60, y: 100, break: false },
  { id: 4, x: 60, y: 120, break: false },
  { id: 5, x: 60, y: 140, break: false },
  { id: 6, x: 60, y: 160, break: false, label: "you", dx: -15, dy: 25 },
  { id: 7, x: 70, y: 160, break: false },
  { id: 8, x: 80, y: 160, break: false },
  { id: 9, x: 90, y: 160, break: false },
  { id: 10, x: 140, y: 160, break: false, label: "connect", dx: 7, dy: 7 },

{ id: 11, x: 132, y: 156, break: false },
{ id: 12, x: 122, y: 148, break: false },
{ id: 13, x: 116, y: 138, break: false },
{ id: 14, x: 114, y: 126, break: false },
{ id: 15, x: 118, y: 114, break: false },
{ id: 16, x: 128, y: 102, break: false },
{ id: 17, x: 145, y: 94, break: false },

{ id: 18, x: 165, y: 90, break: false, label: "the", dx: -10, dy: -15 },

{ id: 19, x: 178, y: 92, break: false },
{ id: 20, x: 195, y: 100, break: false },
{ id: 21, x: 208, y: 114, break: false },
{ id: 22, x: 217, y: 128, break: false },

{ id: 23, x: 220, y: 142, break: false, label: "dots,", dx: 15, dy: 5 },

{ id: 24, x: 218, y: 158, break: false },
{ id: 25, x: 208, y: 172, break: false },
{ id: 26, x: 194, y: 184, break: false },
{ id: 27, x: 178, y: 190, break: false },

{ id: 28, x: 160, y: 190, break: false, label: "you", dx: -35, dy: 5 },
  { id: 29, x: 168, y: 204, break: false },
  { id: 30, x: 176, y: 218, break: false },
  { id: 31, x: 184, y: 232, break: false },
  { id: 32, x: 192, y: 246, break: false },
  { id: 33, x: 200, y: 260, break: false, label: "will", dx: -10, dy: 25 },
  { id: 34, x: 214, y: 242, break: false },
  { id: 35, x: 228, y: 224, break: false },
  { id: 36, x: 242, y: 206, break: false },
  { id: 37, x: 256, y: 188, break: false },
  { id: 38, x: 270, y: 170, break: false, label: "know", dx: -15, dy: -5 },
  { id: 39, x: 285, y: 168, break: false },
  { id: 40, x: 300, y: 166, break: false },
  { id: 41, x: 315, y: 167, break: false },
  { id: 42, x: 330, y: 169, break: false },
  { id: 43, x: 340, y: 170, break: false, label: "how", dx: -5, dy: -15 },
  { id: 44, x: 345, y: 178, break: false },
  { id: 45, x: 348, y: 188, break: false },
  { id: 46, x: 346, y: 198, break: false },
  { id: 47, x: 340, y: 210, break: false, label: "much", dx: 15, dy: 5 },
  { id: 48, x: 325, y: 213, break: false },
  { id: 49, x: 310, y: 215, break: false },
  { id: 50, x: 295, y: 213, break: false },
  { id: 51, x: 280, y: 211, break: false },
  { id: 52, x: 270, y: 210, break: false, label: "i", dx: -45, dy: 5 },
  { id: 53, x: 260, y: 220, break: false },
  { id: 54, x: 255, y: 235, break: false },
  { id: 55, x: 260, y: 250, break: false },
  { id: 56, x: 270, y: 260, break: false },
  { id: 57, x: 280, y: 270, break: false, label: "love", dx: 15, dy: 20 },
  { id: 58, x: 295, y: 272, break: false },
  { id: 59, x: 310, y: 270, break: false },
  { id: 60, x: 325, y: 268, break: false },
  { id: 61, x: 340, y: 264, break: false },
  { id: 62, x: 350, y: 260, break: false, label: "you", dx: 15, dy: 5 },
];

// const dotPoints = [
//   // L
//   { id: 1, x: 60, y: 70, break: false, label: "if", dx: -5, dy: -15 },
//   { id: 2, x: 60, y: 100, break: false },
//   { id: 3, x: 60, y: 130, break: false },
//   { id: 4, x: 60, y: 160, break: false, label: "you", dx: -35, dy: 5 },
//   { id: 5, x: 90, y: 160, break: false },
//   { id: 6, x: 120, y: 160, break: false, label: "connect", dx: 10, dy: 25 },
  
//   // O curve up
//   { id: 7, x: 124, y: 145, break: false },
//   { id: 8, x: 132, y: 125, break: false },
//   { id: 9, x: 144, y: 110, break: false },
//   { id: 10, x: 160, y: 100, break: false, label: "the", dx: -10, dy: -15 },
  
//   // O curve right and down
//   { id: 11, x: 178, y: 104, break: false },
//   { id: 12, x: 192, y: 116, break: false },
//   { id: 13, x: 202, y: 130, break: false },
//   { id: 14, x: 205, y: 145, break: false, label: "dots,", dx: 15, dy: 5 },
  
//   // O curve left and down
//   { id: 15, x: 200, y: 165, break: false },
//   { id: 16, x: 188, y: 180, break: false },
//   { id: 17, x: 173, y: 190, break: false },
//   { id: 18, x: 160, y: 195, break: false, label: "you", dx: -35, dy: 5 },
  
//   // V straight down-right
//   { id: 19, x: 167, y: 210, break: false },
//   { id: 20, x: 175, y: 228, break: false },
//   { id: 21, x: 182, y: 244, break: false },
//   { id: 22, x: 190, y: 260, break: false, label: "will", dx: -10, dy: 25 },
  
//   // V straight up-right to e crossover
//   { id: 23, x: 202, y: 243, break: false },
//   { id: 24, x: 214, y: 226, break: false },
//   { id: 25, x: 227, y: 208, break: false },
//   { id: 26, x: 240, y: 190, break: false, label: "know", dx: 10, dy: 20 },
  
//   // e middle horizontal
//   { id: 27, x: 255, y: 190, break: false },
//   { id: 28, x: 270, y: 190, break: false },
//   { id: 29, x: 285, y: 190, break: false },
//   { id: 30, x: 300, y: 190, break: false, label: "how", dx: 15, dy: 5 },
  
//   // e right side vertical
//   { id: 31, x: 300, y: 175, break: false },
//   { id: 32, x: 300, y: 162, break: false },
//   { id: 33, x: 300, y: 150, break: false, label: "much", dx: 10, dy: -10 },
  
//   // e top side horizontal
//   { id: 34, x: 285, y: 150, break: false },
//   { id: 35, x: 270, y: 150, break: false },
//   { id: 36, x: 250, y: 150, break: false, label: "i", dx: 0, dy: -15 },
  
//   // e diagonal down to crossover
//   { id: 37, x: 246, y: 165, break: false },
//   { id: 38, x: 243, y: 178, break: false },
//   { id: 39, x: 240, y: 190, break: false }, // Invisible dot to route line perfectly through crossover
  
//   // e diagonal down to bottom
//   { id: 40, x: 233, y: 207, break: false },
//   { id: 41, x: 226, y: 223, break: false },
//   { id: 42, x: 220, y: 240, break: false, label: "love", dx: 5, dy: 25 },
  
//   // e bottom horizontal
//   { id: 43, x: 240, y: 240, break: false },
//   { id: 44, x: 260, y: 240, break: false },
//   { id: 45, x: 280, y: 240, break: false, label: "you", dx: 15, dy: 5 },
// ];

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
          <span className="text-4xl mb-4">🌻</span>
          <button
            onClick={reset}
            className="px-6 py-2 border border-gray-600 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            Connect Again
          </button>
        </div>
      )}
    </div>
  );
}