/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SynapseLogo } from './AuthGate';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Cpu, CheckCircle, Database, Network } from 'lucide-react';
import { UserProfile } from '../types';

interface AccountInitLoaderProps {
  userProfile: UserProfile | null;
  onComplete: () => void;
  isSignUpMode?: boolean;
}

const SYNC_MESSAGES = [
  "INITIALIZING APEX ACCOUNT ENVELOPE...",
  "GENERATING NEURAL SEED VECTORS...",
  "ESTABLISHING FIREBASE CLOUD DIRECTORIES...",
  "SYNCING CRYPTOGRAPHIC ACCESS CHANNELS...",
  "REGISTERING GAMIFICATION XP ENGINES...",
  "CALIBRATING SYNAPSE INTERFACE DRIVERS...",
  "SECURE KINETIC HANDSHAKE COMPLETED.",
  "DECRYPTING PROFILE METADATA: MAINBOARD OPENING..."
];

export default function AccountInitLoader({ userProfile, onComplete, isSignUpMode = false }: AccountInitLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // 1. Slow, realistic step simulation for futuristic feel
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < SYNC_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 450);

    // 2. Linear and random variable intervals for standard progress bar acceleration
    const progressInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          // Wait briefly at 100% for full comprehension before transitioning
          const timeout = setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        
        // Dynamic increments to make the bar speed feel natural
        let increment = Math.floor(Math.random() * 8) + 4;
        if (prev > 40 && prev < 70) {
          increment = Math.floor(Math.random() * 4) + 2; // slow block
        } else if (prev >= 85) {
          increment = Math.floor(Math.random() * 5) + 6; // final sprint
        }
        
        return Math.min(100, prev + increment);
      });
    }, 120);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#040508] text-white flex flex-col items-center justify-center font-mono text-xs gap-9 relative select-none overflow-hidden" id="account-init-mainframe">
      {/* 3D Kinetic grid background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          transform: 'perspective(450px) rotateX(60deg) translateY(-30px)',
          transformOrigin: 'top center'
        }} 
      />

      {/* Cross-hair overlay lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />
      </div>

      {/* Cybernetic ambient boundary rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-[400px] h-[400px] rounded-full border border-violet-500/10 border-dashed"
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="w-[280px] h-[280px] rounded-full border border-cyan-500/10 border-dotted absolute"
        />
      </div>

      {/* Central Brand Pulsar Asset Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Ring scanner segment */}
        <svg className="absolute w-36 h-36 text-cyan-400 opacity-80" viewBox="0 0 100 100">
          <motion.circle 
            cx="50" 
            cy="50" 
            r="44" 
            stroke="currentColor" 
            strokeWidth="1.25" 
            fill="none"
            strokeDasharray="280"
            initial={{ strokeDashoffset: 280 }}
            animate={{ strokeDashoffset: 280 - (280 * percent) / 100 }}
            transition={{ ease: "easeOut" }}
          />
        </svg>

        {/* Dynamic solar burst wrapper */}
        <AnimatePresence>
          {percent >= 98 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.55 }}
              exit={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-violet-500 blur-2xl rounded-full"
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={{ scale: [0.98, 1.05, 0.98] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 p-4"
        >
          <SynapseLogo className="w-24 h-24 drop-shadow-[0_0_18px_rgba(0,240,255,0.5)]" />
        </motion.div>
      </div>

      {/* Interactive HUD Loading Panels */}
      <div className="space-y-5 text-center w-full max-w-sm px-8 relative z-10">
        
        {/* Tech Header Display */}
        <div className="space-y-1">
          <span className="block font-sans font-black text-[#ECEFF4] tracking-[0.25em] text-md">
            {isSignUpMode ? "INITIALIZING NEW ACCOUNT" : "AUTHENTICATING ACCOUNT"}
          </span>
          <div className="flex items-center justify-center gap-2 text-[9px] text-[#545B83] font-bold tracking-widest uppercase">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>PROFILE INTEGRATION SECURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
        </div>

        {/* Premium multi-staged load progress bar matrix */}
        <div className="space-y-2 bg-[#080B13]/60 border border-[#141829] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-[10px] text-[#ECEFF4] font-bold mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Network className="w-3.5 h-3.5 animate-spin" />
              <span>SYNC_STX: ONLINE</span>
            </span>
            <span className="text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">{percent}%</span>
          </div>

          <div className="w-full h-2 bg-[#04060B] border border-[#1E233E]/60 rounded-full p-[1.5px] overflow-hidden">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
              initial={{ width: '0%' }}
              animate={{ width: `${percent}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] text-[#4E5472] pt-1">
            <span className="truncate max-w-[150px]">ID: {userProfile?.email || "GUEST_COGNIZANCE"}</span>
            <span>SECURE ENCRYPTED LOCK</span>
          </div>
        </div>

        {/* Telemetry Log Stream */}
        <div className="h-9 bg-[#06080E]/90 border border-[#161B2E] rounded-xl flex items-center px-4 justify-between font-mono max-w-xs mx-auto shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#00F0FF] animate-pulse font-black font-sans">❯</span>
            <motion.span 
              key={currentStep}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[9px] text-[#868EA5] uppercase tracking-wide truncate font-bold"
            >
              {SYNC_MESSAGES[currentStep]}
            </motion.span>
          </div>
          <span className="text-[8.5px] font-mono text-emerald-400 shrink-0 font-extrabold flex items-center gap-0.5 ml-2">
            <Database className="w-2.5 h-2.5" />
            [OK]
          </span>
        </div>

      </div>

      {/* Retro Sci-fi viewport bracket points */}
      <div className="absolute top-6 left-6 border-t-2 border-l-2 border-[#00F0FF]/30 w-6 h-6 rounded-tl-md pointer-events-none" />
      <div className="absolute top-6 right-6 border-t-2 border-r-2 border-[#00F0FF]/30 w-6 h-6 rounded-tr-md pointer-events-none" />
      <div className="absolute bottom-6 left-6 border-b-2 border-l-2 border-[#00F0FF]/30 w-6 h-6 rounded-bl-md pointer-events-none" />
      <div className="absolute bottom-6 right-6 border-b-2 border-r-2 border-[#00F0FF]/30 w-6 h-6 rounded-br-md pointer-events-none" />

      {/* Subtext info info */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-[#333956] text-[8.5px] tracking-[0.2em] font-mono select-none px-6 uppercase">
        CONNECTED VECTOR PATHWAY — SYSTEM LEVEL VERIFIED
      </div>
    </div>
  );
}
