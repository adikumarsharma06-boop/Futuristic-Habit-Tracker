/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signInWithGoogle } from '../lib/firebase';
import { Award, Zap, ShieldAlert, LogOut, User, RefreshCw } from 'lucide-react';
import { SynapseLogo } from './AuthGate';

export default function Header() {
  const { userProfile, loginUser, logoutUser, isOffline, quote, fetchingQuote, refreshQuote, setCurrentView } = useApp();
  const [authLoading, setAuthLoading] = useState(false);

  // Level stats calculations
  const xp = userProfile?.xp || 0;
  const level = userProfile?.level || 1;
  const xpInCurrentLevel = xp % 200;
  const xpProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 200) * 100));
  const xpToNextLevel = 200 - xpInCurrentLevel;

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <header className="border-b border-[#1A1F36] bg-[#0A0C14]/90 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 sticky top-0 z-40" id="app-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-2.5 md:gap-4 items-stretch md:items-center justify-between">
        
        {/* Profile info / Welcome */}
        <div 
          onClick={() => setCurrentView('profile')}
          className="flex items-center gap-3 text-xs cursor-pointer select-none group/hdr"
          id="header-profile-toggle"
        >
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative">
              <SynapseLogo className="w-10 h-10 hover:scale-110 transition duration-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.45)] group-hover/hdr:scale-110" />
              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-gradient-to-r from-cyan-400 to-[#8A2BE2] text-[9px] font-bold font-mono text-black flex items-center justify-center rounded-md border border-[#08090C]">
                {level}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 leading-none">
              <h1 className="font-display font-medium text-sm sm:text-base tracking-tight text-[#ECEFF4] font-black leading-tight group-hover/hdr:text-cyan-400 transition">
                {userProfile?.displayName || 'Explorer'}
              </h1>
              {isOffline ? (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 flex items-center gap-1 inline-block shrink-0 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  Sandbox Mode
                </span>
              ) : (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center gap-1 inline-block shrink-0 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#4E5472] mt-0.5 font-mono uppercase font-bold tracking-wide">
              Rank: Core System calibrator
            </p>
          </div>
        </div>

        {/* Gamification Progress */}
        <div className="flex-1 max-w-md mx-0 md:mx-4 bg-[#0E101D] border border-[#1A1F36] rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono mb-1">
              <span className="text-[#6F7694] flex items-center gap-1 truncate font-bold">
                <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                <span>LOGS: <strong className="text-[#00F0FF]">{xp} XP</strong></span>
              </span>
              <span className="text-[#A0A6C0] font-bold shrink-0">{xpInCurrentLevel}/200 XP</span>
            </div>
            
            {/* Real Progress Bar */}
            <div className="w-full h-1.5 bg-[#14172B] rounded-full overflow-hidden border border-[#23284B]/30">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 transition-all duration-700 ease-out shadow-[0_0_6px_rgba(0,240,255,0.3)]"
                style={{ width: `${xpProgressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[8.5px] sm:text-[9.5px] text-[#4E5472] mt-0.5 font-mono leading-none font-bold">
              <span>LVL {level}</span>
              <span className="truncate ml-1">{xpToNextLevel} XP TO LEVEL {level + 1}</span>
            </div>
          </div>
        </div>

        {/* Account Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={logoutUser}
            className="px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-bold border border-[#1E233E]/60 bg-[#101221] hover:bg-rose-950/20 text-[#A0A6C0] hover:text-rose-400 hover:border-rose-900/40 transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            <LogOut className="w-3 h-3 text-rose-500/70" />
            SIGN OUT
          </button>
        </div>

      </div>
      
      {/* Dynamic Cyber Quote Bar */}
      {quote && (
        <div className="max-w-7xl mx-auto mt-2 bg-gradient-to-r from-[#0C0F19] to-[#120F1D] border border-cyan-950/20 rounded-lg px-2.5 py-1 flex items-center justify-between gap-2 text-[10px] sm:text-xs text-cyan-200/90 font-mono">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-[#00F0FF] animate-pulse shrink-0">⚡</span>
            <span className="truncate italic">"{quote.text}"</span>
            <span className="text-[#6F7694] font-medium hidden lg:inline">— {quote.author}</span>
          </div>
          <button 
            onClick={() => refreshQuote(true)}
            disabled={fetchingQuote}
            className="text-cyan-400 hover:text-white transition duration-200 p-0.5 cursor-pointer flex items-center gap-0.5 shrink-0"
            title="Calibrate Synaptic Guide"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${fetchingQuote ? 'animate-spin' : ''}`} />
            <span className="text-[8.5px] font-bold hidden sm:inline">Calibrate</span>
          </button>
        </div>
      )}
    </header>
  );
}
