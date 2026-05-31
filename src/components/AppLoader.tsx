/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SynapseLogo } from './AuthGate';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_LOGS = [
  "LAUNCHING KINETIC CORELINK...",
  "ESTABLISHING NEURAL DECRYPTION PROTOCOLS...",
  "CALIBRATING SYNAPSTIC WEIGHT SHIELD...",
  "SYNCHRONIZING HABIT STREAM BUFFERS...",
  "MAPPING TEMPORAL PATTERN HISTOGRAMS...",
  "STRUCTURING XP REWARD LEVEL MATRIX...",
  "SECURING SANDBOX SIMULATION MATRIX...",
  "SYSTEM DEPLOYED. APEX OS V3.0 ONLINE."
];

export default function AppLoader() {
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showPortalGlow, setShowPortalGlow] = useState(false);

  useEffect(() => {
    // Staggered log outputs
    const logInterval = setInterval(() => {
      setCurrentLogIndex((prev) => (prev < BOOT_LOGS.length - 1 ? prev + 1 : prev));
    }, 380);

    // Easing percentage stepper
    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 7) + 5; // smooth increments
        return Math.min(100, prev + delta);
      });
    }, 130);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Sync occasional portal flashburst on milestones
  useEffect(() => {
    if (progressPercent > 0 && progressPercent % 25 === 0) {
      setShowPortalGlow(true);
      const t = setTimeout(() => setShowPortalGlow(false), 250);
      return () => clearTimeout(t);
    }
  }, [progressPercent]);

  return (
    <div className="min-h-screen bg-[#040508] text-white flex flex-col items-center justify-center font-mono text-xs gap-8 relative select-none overflow-hidden" id="mainframe-boot-screen">
      
      {/* 3D Kinetic grid background drifting away to give deep futuristic perspective */}
      <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        transform: 'perspective(500px) rotateX(60deg) translateY(-20px)',
        transformOrigin: 'top center'
      }} />

      {/* Cross-hair overlay lines of a holographic scanner */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-violet-500/10 to-transparent" />
      </div>

      {/* Cybernetic ambient boundary rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-[450px] h-[450px] rounded-full border border-cyan-500/5 border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-[300px] h-[300px] rounded-full border border-violet-500/5 border-dotted absolute"
        />
      </div>

      {/* Central Brand Pulsar Asset Container */}
      <div className="relative z-10 flex flex-col items-center justify-center scale-105">
        
        {/* Ring scanner segment */}
        <svg className="absolute w-36 h-36 text-cyan-400 opacity-60" viewBox="0 0 100 100">
          <motion.circle 
            cx="50" 
            cy="50" 
            r="44" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
            strokeDasharray="280"
            initial={{ strokeDashoffset: 280 }}
            animate={{ strokeDashoffset: 280 - (280 * progressPercent) / 100 }}
            transition={{ ease: "easeOut" }}
          />
        </svg>

        {/* Milestone dynamic solar burst */}
        <AnimatePresence>
          {(showPortalGlow || progressPercent === 100) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 0.4 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 bg-cyan-400 blur-xl rounded-full"
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: [0.96, 1.04, 0.96], opacity: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative z-10 p-4"
        >
          <SynapseLogo className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.45)]" />
        </motion.div>
      </div>

      {/* Interactive HUD Loading Panels */}
      <div className="space-y-4.5 text-center w-full max-w-sm px-8 relative z-10">
        
        {/* Tech Header Display */}
        <div className="space-y-1">
          <span className="block font-sans font-black text-[#ECEFF4] tracking-[0.25em] text-md">
            APEX SYNAPSE OS
          </span>
          <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#545B83] font-bold tracking-widest uppercase">
            <span>CORE NODE CALIBRATION</span>
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></span>
            <span>SECURE GATEWAY</span>
          </div>
        </div>

        {/* Premium multi-staged load progress bar matrix */}
        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-[#0A0C14] border border-[#1E233E]/50 rounded-lg p-[1px] overflow-hidden">
            <motion.div 
              className="h-full rounded-md bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 shadow-[0_0_8px_rgba(0,240,255,0.5)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] text-[#4E5472] px-1 font-bold">
            <span>ADDR: 0x8F9A27F11C</span>
            <span className="text-[#00F0FF] animate-pulse">BOOT METRICS: {progressPercent}%</span>
          </div>
        </div>

        {/* Console Telemetry Activity Stream */}
        <div className="h-7 bg-[#06080E]/70 border border-[#161B2E] rounded-xl flex items-center px-4 justify-between font-mono max-w-xs mx-auto shadow-inner">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[#00F0FF] animate-pulse font-bold">❯</span>
            <motion.span 
              key={currentLogIndex}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              className="text-[9px] text-[#868EA5] uppercase tracking-wide truncate font-medium"
            >
              {BOOT_LOGS[currentLogIndex]}
            </motion.span>
          </div>
          <span className="text-[8px] font-mono text-[#00F0FF] shrink-0 font-bold ml-2">
            [OK]
          </span>
        </div>

      </div>

      {/* Retro Sci-fi viewport bracket points */}
      <div className="absolute top-6 left-6 border-t-2 border-l-2 border-[#00F0FF]/20 w-5 h-5 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-6 right-6 border-t-2 border-r-2 border-[#00F0FF]/20 w-5 h-5 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-6 left-6 border-b-2 border-l-2 border-[#00F0FF]/25 w-5 h-5 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-6 right-6 border-b-2 border-r-2 border-[#00F0FF]/25 w-5 h-5 rounded-br-sm pointer-events-none" />

      {/* Subtle coordinate markers in margins */}
      <div className="absolute top-6 left-16 text-[8px] text-[#333956] font-mono font-bold tracking-widest hidden sm:block">GRID_COORD_X72.091</div>
      <div className="absolute bottom-6 right-16 text-[8px] text-[#333956] font-mono font-bold tracking-widest hidden sm:block">NODE_INDEX: 404_APX</div>
    </div>
  );
}

