/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import LucideIcon from './LucideIcon';
import { Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BadgeUnlockModal() {
  const { activeUnlockedBadge, closeBadgeModal } = useApp();

  // Handle escape key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBadgeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeBadgeModal]);

  if (!activeUnlockedBadge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#04060C]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        
        {/* Animated Card Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative max-w-sm w-full bg-[#0B0D18] border border-cyan-500/30 rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
        >
          {/* Neon background grids */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] -z-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-[50px] -z-10 rounded-full"></div>

          {/* Sparkle Icons */}
          <div className="flex justify-center gap-1 mb-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-bounce" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#00F0FF] font-black">ACHIEVEMENT UNLOCKED</span>
            <Sparkles className="w-5 h-5 text-cyan-400 animate-bounce" />
          </div>

          {/* Glowing Badge Visualizer */}
          <div className="my-6 relative py-4 flex justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 blur-xl animate-pulse"></div>
            </div>
            
            <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-b ${activeUnlockedBadge.badgeColor} border border-white/15 flex items-center justify-center p-1.5 transform hover:scale-105 transition-transform duration-300`}>
              <div className="w-full h-full rounded-2xl bg-[#0D0F18]/80 border border-white/5 flex flex-col items-center justify-center">
                <LucideIcon name={activeUnlockedBadge.icon} className="w-10 h-10 mb-1" />
                <Award className="w-4 h-4 text-cyan-400 opacity-60 absolute bottom-3" />
              </div>
            </div>
          </div>

          {/* Badge metadata details */}
          <h3 className="font-display font-bold text-xl text-[#ECEFF4] tracking-tight">
            {activeUnlockedBadge.title}
          </h3>
          <p className="text-xs text-[#00F0FF]/80 font-mono mt-1">
            "{activeUnlockedBadge.description}"
          </p>

          <div className="mt-4 p-3 bg-[#111326] border border-[#1C1F3F] rounded-xl text-left">
            <span className="block text-[10px] uppercase font-mono text-[#545B83]">CRITERIA MET:</span>
            <span className="block text-xs text-[#A1A7C4] font-medium mt-0.5">
              {activeUnlockedBadge.requirementDescription}
            </span>
          </div>

          <p className="text-[10px] text-zinc-500 font-mono mt-3.5 mb-1 text-center">
            SYSTEM BOUNTY UNLOCKED: <strong className="text-cyan-400">+100-500 XP GRANTED</strong>
          </p>

          {/* Action button */}
          <button
            onClick={closeBadgeModal}
            className="w-full py-3 rounded-xl text-xs font-semibold bg-[#00F0FF] hover:bg-cyan-400 text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] mt-3.5"
          >
            Acknowledge Achievement
          </button>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
