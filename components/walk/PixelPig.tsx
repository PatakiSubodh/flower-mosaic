// components/PixelPig.tsx
'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group } from 'three';

const WALK_DURATION = 15;
const STOP_START = 0.25;
const STOP_END = 0.35;

// Leg component with top-anchored rotation
function Leg({ position, offset }: { position: [number, number, number], offset: number }) {
  const legRef = useRef<Group>(null);

  useFrame((state) => {
    if (legRef.current) {
      const t = state.clock.elapsedTime % 15;
      if (t > 3.75 && t < 5.25) {
        legRef.current.rotation.z = 0;
      } else {
        legRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8 + offset) * 0.6;
      }
    }
  });

  return (
    <group position={position} ref={legRef}>
      <group position={[0, -0.25, 0]}>
        {/* Main Leg */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        {/* Hoof */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.2]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </group>
  );
}

function PigModel() {
  const bodyRef = useRef<Group>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      const t = state.clock.elapsedTime % 15;
      if (t > 3.75 && t < 5.25) {
        bodyRef.current.rotation.set(-0.1, Math.PI * -0.6, 0);
        bodyRef.current.position.y = 0;
      } else {
        bodyRef.current.rotation.set(0, Math.PI * -0.8, 0);
        bodyRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.1;
      }
    }
  });

  return (
    // Rotated to face left and slightly towards the screen
    <group ref={bodyRef} rotation={[0, Math.PI * -0.8, 0]} scale={1.5}>
      
      {/* --- BODY --- */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.9, 1.0]} />
        <meshStandardMaterial color="#fbcfe8" />
      </mesh>
      {/* Body Spots / Details */}
      <mesh position={[-0.3, 0.96, 0.2]}>
        <boxGeometry args={[0.4, 0.02, 0.3]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>
      <mesh position={[0.2, 0.5, 0.51]}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>

      {/* --- HEAD --- */}
      <mesh position={[0.7, 0.7, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#fbcfe8" />
      </mesh>

      {/* --- SNOUT & NOSTRILS --- */}
      <group position={[1.1, 0.6, 0]}>
        {/* Snout Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.4]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        {/* Left Nostril */}
        <mesh position={[0.11, 0.05, 0.1]}>
          <boxGeometry args={[0.02, 0.1, 0.1]} />
          <meshStandardMaterial color="#be185d" />
        </mesh>
        {/* Right Nostril */}
        <mesh position={[0.11, 0.05, -0.1]}>
          <boxGeometry args={[0.02, 0.1, 0.1]} />
          <meshStandardMaterial color="#be185d" />
        </mesh>
      </group>

      {/* --- EARS --- */}
      {/* Left Ear */}
      <group position={[0.6, 1.1, 0.35]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        {/* Inner Ear */}
        <mesh position={[0.02, 0, 0.06]}>
          <boxGeometry args={[0.1, 0.2, 0.02]} />
          <meshStandardMaterial color="#be185d" />
        </mesh>
      </group>
      {/* Right Ear */}
      <group position={[0.6, 1.1, -0.35]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        <mesh position={[0.02, 0, -0.06]}>
          <boxGeometry args={[0.1, 0.2, 0.02]} />
          <meshStandardMaterial color="#be185d" />
        </mesh>
      </group>

      {/* --- EYES --- */}
      {/* Left Eye */}
      <group position={[0.95, 0.8, 0.3]}>
        {/* Eye White */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.15, 0.15]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pupil */}
        <mesh position={[0.02, 0, 0.03]}>
          <boxGeometry args={[0.1, 0.08, 0.08]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
      {/* Right Eye */}
      <group position={[0.95, 0.8, -0.3]}>
        {/* Eye White */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.15, 0.15]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pupil */}
        <mesh position={[0.02, 0, -0.03]}>
          <boxGeometry args={[0.1, 0.08, 0.08]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* --- CURLY TAIL --- */}
      <group position={[-0.65, 0.6, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        <mesh position={[-0.1, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        <mesh position={[-0.1, 0.2, 0.1]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
      </group>

      {/* --- LEGS --- */}
      <Leg position={[0.4, 0.25, 0.35]} offset={0} />
      <Leg position={[0.4, 0.25, -0.35]} offset={Math.PI} />
      <Leg position={[-0.4, 0.25, 0.35]} offset={Math.PI} />
      <Leg position={[-0.4, 0.25, -0.35]} offset={0} />
    </group>
  );
}

export default function PixelPig({progress} : {progress : number}) {
  return (
    <div className="fixed bottom-4 left-0 w-60 h-60 pointer-events-none z-50 origin-top" style={{ animation: 'walkLeft 15s linear infinite' }}>
      {/* Global CSS for the horizontal movement across the screen */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes walkLeft {
          0% { transform: translateX(100vw); }
          25% { transform: translateX(calc(60vw - 50px)); }
          35% { transform: translateX(calc(60vw - 50px)); }
          100% { transform: translateX(-200px); }
        }
      `}} />

      {/* dont remove this msg section */}
      {/* <div className="mb-2 text-white text-xs sm:text-sm font-mono px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        leave me alone idiot
      </div> */}
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2, 5.6], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[50, 15, 2]} intensity={1} />
        <PigModel />
      </Canvas>
    </div>
  );
}