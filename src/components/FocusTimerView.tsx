/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, Zap, Timer, Brain, Dumbbell, Code2, Heart, Lightbulb, Bell, CheckCircle2 } from 'lucide-react';

const TIMER_PRESETS = [
  { label: 'Micro Cycle', minutes: 15, xpReward: 25 },
  { label: 'Standard Focus', minutes: 25, xpReward: 40 },
  { label: 'Deep Work Alpha', minutes: 45, xpReward: 65 },
  { label: 'System Continuum', minutes: 60, xpReward: 85 },
];

const SESSION_CATEGORIES = [
  { id: 'mind', label: 'Mind Calm', icon: Brain, color: 'text-cyan-400 border-cyan-950/40 bg-cyan-950/10' },
  { id: 'work', label: 'Refactoring & Code', icon: Code2, color: 'text-violet-400 border-violet-950/40 bg-violet-950/10' },
  { id: 'fitness', label: 'Cardio Core', icon: Dumbbell, color: 'text-rose-400 border-rose-950/40 bg-rose-950/10' },
  { id: 'creative', label: 'Idea Generation', icon: Lightbulb, color: 'text-pink-400 border-pink-950/40 bg-pink-950/10' },
];

export default function FocusTimerView() {
  const { completeTimerSession, userProfile } = useApp();
  
  const [selectedDuration, setSelectedDuration] = useState(25); // 25 Min default
  const [selectedCategory, setSelectedCategory] = useState('mind');
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentProgressPercent, setCurrentProgressPercent] = useState(100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDurationSeconds = selectedDuration * 60;

  // Sync timer when preset or duration changes
  useEffect(() => {
    setTimeRemaining(selectedDuration * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [selectedDuration]);

  // Handle timer countdown ticks
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedDuration]);

  // Calculate percentage progress for the ring
  useEffect(() => {
    const total = selectedDuration * 60;
    const elapsed = total - timeRemaining;
    const percent = Math.max(0, Math.min(100, (timeRemaining / total) * 100));
    setCurrentProgressPercent(percent);
  }, [timeRemaining, selectedDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setIsCompleted(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDuration * 60);
    setIsCompleted(false);
  };

  const handleSessionCompleted = async () => {
    setIsCompleted(true);
    // Play mock alarm notify
    try {
      // Small synthesized ping
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log("Audio API not allowed in sandbox frame.");
    }

    // Grant XP and log session
    await completeTimerSession(selectedDuration, selectedCategory);
  };

  // Format Helper
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-6" id="focus-timer-container">
      
      {/* Upper header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-[#ECEFF4] tracking-tight flex items-center gap-2">
          <Timer className="w-6 h-6 text-violet-400 animate-pulse" />
          Neural Focus Synchronizer
        </h2>
        <p className="text-xs text-[#6F7694] mt-1 font-mono uppercase tracking-wider">
          CALIBRATE WORK INTEGRITY WITH DEEP SESSIONS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Config settings & Category linking */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          
          {/* Preset Panel */}
          <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-4.5">
            <h3 className="text-xs font-mono uppercase text-[#4E5472] tracking-wider mb-3 flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              1. PRESET DURATION
            </h3>
            <div className="flex flex-col gap-2">
              {TIMER_PRESETS.map((p) => (
                <button
                  key={p.minutes}
                  onClick={() => setSelectedDuration(p.minutes)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    selectedDuration === p.minutes
                      ? 'bg-[#15122B] border-violet-500/40 text-violet-400 shadow-[0_0_12px_rgba(138,43,226,0.1)]'
                      : 'bg-transparent border-[#1E233E]/50 text-[#6F7694] hover:bg-[#0D0F1B] hover:text-[#ECEFF4]'
                  }`}
                >
                  <div>
                    <span className="block text-xs font-semibold leading-none">{p.label}</span>
                    <span className="block text-[10px] text-[#4E5472] font-mono mt-1">{p.minutes} minutes session</span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#111326] px-2 py-1 rounded-md text-cyan-400 font-bold">
                    +{p.xpReward} XP
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Categories */}
          <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-4.5">
            <h3 className="text-xs font-mono uppercase text-[#4E5472] tracking-wider mb-3 flex items-center gap-1.5 font-bold">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              2. SELECT TOPIC MATRIX
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SESSION_CATEGORIES.map((c) => {
                const Icon = c.icon;
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all ${
                      isSelected
                        ? `${c.color} border-current shadow-[0_0_10px_rgba(255,255,255,0.02)] scale-[1.02]`
                        : 'bg-transparent border-[#1E233E]/50 text-[#6F7694] hover:bg-[#0D0F1B]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-mono leading-none font-bold select-none">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Column 2 & 3: Circular graphics container & Toggles */}
        <div className="lg:col-span-2 bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          
          {/* Subtle neon accents */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/5 blur-[80px] -z-10 animate-pulse"></div>

          {isCompleted ? (
            <div className="text-center p-6 flex flex-col items-center justify-center animate-bounce-short">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-display font-medium text-xl text-[#ECEFF4] tracking-tight">Focus Block Completed</h3>
              <p className="text-xs text-[#6F7694] font-mono mt-1 uppercase">
                SYSTEM CALIBRATION SYNC SUCCESSFUL
              </p>
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl mt-4 font-mono text-[11px] text-emerald-400 text-center max-w-xs">
                Earned +{selectedDuration} XP Base + 15 Focus Completion bonus! Checked into user level matrix.
              </div>
              <button
                onClick={resetTimer}
                className="mt-6 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white cursor-pointer transition"
              >
                Launch New Cycle
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              
              {/* Circular Ring Timer */}
              <div className="relative w-56 h-56 flex items-center justify-center mb-6">
                
                {/* SVG Progress Arc Loader */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle 
                    cx="112" 
                    cy="112" 
                    r="98" 
                    className="stroke-[#13172E] stroke-[6] fill-transparent"
                  />
                  <circle 
                    cx="112" 
                    cy="112" 
                    r="98" 
                    className="stroke-violet-500/90 stroke-[6] fill-transparent transition-all duration-300"
                    strokeDasharray={2 * Math.PI * 98}
                    strokeDashoffset={2 * Math.PI * 98 * (1 - currentProgressPercent / 100)}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgb(139, 92, 246))' }}
                  />
                </svg>

                {/* Internal numbers */}
                <div className="text-center">
                  <span className="block font-mono text-4xl font-bold tracking-tight text-[#ECEFF4]">
                    {formatTime(timeRemaining)}
                  </span>
                  <span className="block font-mono text-[9px] uppercase text-violet-400/80 mt-1 flex items-center justify-center gap-1 font-bold">
                    {isRunning ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                        SYNAPSE RUNNING
                      </>
                    ) : (
                      'STATE: SUSPENDED'
                    )}
                  </span>
                </div>

              </div>

              {/* Control triggers */}
              <div className="flex items-center gap-4">
                <button
                  onClick={resetTimer}
                  className="w-11 h-11 rounded-full bg-[#121425] border border-[#1E233E]/75 hover:border-[#6F7694] text-[#6F7694] hover:text-[#ECEFF4] flex items-center justify-center cursor-pointer transition"
                  title="Reset Sync Count"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                
                <button
                  onClick={toggleTimer}
                  className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all border ${
                    isRunning 
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105'
                  }`}
                  title={isRunning ? "Pause Session" : "Initiate Focus"}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>

                <div className="w-11"></div> {/* balanced spacing */}
              </div>

              {/* Context notification */}
              <div className="mt-6 flex items-center gap-1.5 font-mono text-[10px] text-[#4E5472]">
                <Bell className="w-3.5 h-3.5 text-[#4E5472]" />
                AUDIBLE SOUND SIGNAL TRIGGERED AT END OF BLOCK
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
