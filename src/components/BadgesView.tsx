/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BADGES_LIST } from '../lib/badges';
import LucideIcon from './LucideIcon';
import { Award, Lock, Zap, Check, Trophy } from 'lucide-react';

export default function BadgesView() {
  const { userProfile } = useApp();

  const achievementsEarned = new Set(userProfile?.achievements || []);
  const level = userProfile?.level || 1;
  const xp = userProfile?.xp || 0;

  // Progress metrics
  const nextLvlTargetXp = level * 200;
  const currentLvlStartXp = (level - 1) * 200;
  const xpInCurrentLevel = xp - currentLvlStartXp;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 200) * 100));

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-6" id="badges-container">
      
      {/* Upper header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-[#ECEFF4] tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Achievement Matrix & Badges
        </h2>
        <p className="text-xs text-[#6F7694] mt-1 font-mono uppercase tracking-wider">
          Review unlocked status cores and expand your experience profiles
        </p>
      </div>

      {/* Row showing current level card */}
      <div className="bg-gradient-to-r from-[#120F24] via-[#0C0F19] to-[#0A0C14] border border-cyan-500/10 rounded-2xl p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 blur-xl animate-pulse"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-cyan-500 to-[#8A2BE2] p-1 shadow-[0_0_20px_rgba(0,128,255,0.25)]">
            <div className="w-full h-full rounded-xl bg-[#08090C] flex flex-col items-center justify-center">
              <span className="block text-[10px] uppercase font-mono text-[#6F7694] tracking-wider leading-none">LEVEL</span>
              <span className="block text-3xl font-mono font-bold text-white mt-1 leading-none">{level}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <h3 className="font-display font-bold text-lg text-[#ECEFF4]">
            Neural Overlord Matrix Evolution
          </h3>
          <p className="text-xs text-[#A0A6C0] max-w-xl">
            You hold <strong className="text-[#00F0FF] font-mono">{achievementsEarned.size} / {BADGES_LIST.length} unlocked</strong> system badges. Gain standard daily check-in loops (+15 XP) and Pomodoro Focus cycles to elevate.
          </p>

          <div className="pt-2 max-w-md mx-auto md:mx-0">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#6F7694] mb-1">
              <span>PROGRESS TO LVL {level + 1}</span>
              <span>{xpInCurrentLevel}/200 XP</span>
            </div>
            {/* Range Progress */}
            <div className="w-full h-1.5 bg-[#14172B] rounded-full overflow-hidden border border-[#1E233E]/40">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 transition-all duration-700 shadow-[0_0_5px_rgba(0,240,255,0.4)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges interactive grids */}
      <h3 className="px-1.5 py-2 font-mono text-xs uppercase font-black text-[#545B83] tracking-widest mb-3.5">
        CORE MODULE INVENTORY SYSTEM
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGES_LIST.map((badge) => {
          const isUnlocked = achievementsEarned.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`rounded-2xl border p-4.5 flex gap-4 transition-all duration-300 relative overflow-hidden ${
                isUnlocked
                  ? 'bg-[#0E0F1D] border-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.03)]'
                  : 'bg-[#0B0C15]/60 border-[#1E233E]/50 opacity-60'
              }`}
            >
              
              {/* Unlock glow accent */}
              {isUnlocked && (
                <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr ${badge.badgeColor} blur-2xl opacity-15`}></div>
              )}

              {/* Icon Visual Frame */}
              <div className={`shrink-0 w-13 h-13 rounded-xl border flex items-center justify-center transition ${
                isUnlocked 
                  ? `bg-gradient-to-b ${badge.badgeColor} border-white/10 shadow-[0_0_8px_rgba(255,255,255,0.02)]`
                  : 'bg-[#151726] border-[#23284B] text-[#4E5472]'
              }`}>
                {isUnlocked ? (
                  <div className="w-full h-full rounded-lg bg-[#0D0F18]/70 flex items-center justify-center text-white">
                    <LucideIcon name={badge.icon} size={18} />
                  </div>
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>

              {/* Text Specs */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-semibold tracking-tight ${isUnlocked ? 'text-[#ECEFF4]' : 'text-[#6F7694]'}`}>
                    {badge.title}
                  </h4>
                  {isUnlocked && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/30 text-cyan-400 border border-cyan-800/40 flex items-center gap-0.5 select-none font-bold">
                      <Check className="w-2.5 h-2.5" /> UNLOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6F7694] pr-2">
                  {badge.description}
                </p>
                <div className="pt-1.5 font-mono text-[10px] text-[#4E5472] uppercase">
                  REQS: <span className={isUnlocked ? 'text-cyan-400 font-bold' : 'text-[#6F7694]'}>{badge.requirementDescription}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
