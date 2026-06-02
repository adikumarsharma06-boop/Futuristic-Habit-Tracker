/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Habit, HabitCategory } from '../types';
import { useApp } from '../context/AppContext';
import LucideIcon from './LucideIcon';
import { Check, Flame, Award, Calendar, ChevronDown, ChevronUp, Trash2, Edit, Edit3, MessageSquarePlus, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
  key?: any;
}

const CATEGORY_STYLES: Record<HabitCategory, { bg: string, text: string, border: string, glow: string }> = {
  health: {
    bg: 'bg-emerald-950/20',
    text: 'text-emerald-400',
    border: 'border-emerald-800/40',
    glow: 'rgba(16,185,129,0.15)'
  },
  fitness: {
    bg: 'bg-rose-950/20',
    text: 'text-rose-400',
    border: 'border-rose-800/40',
    glow: 'rgba(244,63,94,0.15)'
  },
  mind: {
    bg: 'bg-cyan-950/20',
    text: 'text-cyan-400',
    border: 'border-cyan-800/40',
    glow: 'rgba(6,182,212,0.15)'
  },
  work: {
    bg: 'bg-violet-950/20',
    text: 'text-violet-400',
    border: 'border-violet-800/40',
    glow: 'rgba(139,92,246,0.15)'
  },
  creative: {
    bg: 'bg-pink-950/20',
    text: 'text-pink-400',
    border: 'border-pink-800/40',
    glow: 'rgba(236,72,153,0.15)'
  },
  social: {
    bg: 'bg-amber-950/20',
    text: 'text-amber-400',
    border: 'border-amber-800/40',
    glow: 'rgba(245,158,11,0.15)'
  }
};

export default function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const { toggleHabitCheck, deleteHabit, editHabit, habits } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [showMilestoneNotification, setShowMilestoneNotification] = useState(false);
  const [clickPing, setClickPing] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [quickLogText, setQuickLogText] = useState('');

  useEffect(() => {
    if (clickPing) {
      const t = setTimeout(() => setClickPing(false), 300);
      return () => clearTimeout(t);
    }
  }, [clickPing]);

  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(todayStr);
  const style = CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.mind;

  const getCompletionsThisWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now.getTime() - daysSinceMonday * 24 * 60 * 60 * 1000);
    monday.setHours(0, 0, 0, 0);

    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      if (habit.completedDates.includes(d)) {
        count++;
      }
    }
    return count;
  };

  const weeklyCompletionCount = getCompletionsThisWeek();
  const weeklyGoal = habit.weeklyGoal || 5;
  const isGoalMet = weeklyCompletionCount >= weeklyGoal;
  const currentPercent = Math.min(100, Math.round((weeklyCompletionCount / weeklyGoal) * 100));

  const [prevPercent, setPrevPercent] = useState<number>(currentPercent);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [showPercentChange, setShowPercentChange] = useState(false);

  // States to animate the Quota bar when hitting the weekly goal for the first time
  const [shouldCelebrate, setShouldCelebrate] = useState(false);
  const [prevCompletions, setPrevCompletions] = useState<number>(weeklyCompletionCount);

  useEffect(() => {
    if (prevPercent !== currentPercent) {
      const delta = currentPercent - prevPercent;
      setPercentChange(delta);
      setShowPercentChange(true);
      setPrevPercent(currentPercent);
      const timer = setTimeout(() => {
        setShowPercentChange(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentPercent, prevPercent]);

  useEffect(() => {
    if (weeklyCompletionCount !== prevCompletions) {
      if (weeklyCompletionCount >= weeklyGoal && prevCompletions < weeklyGoal) {
        setShouldCelebrate(true);
        const timer = setTimeout(() => {
          setShouldCelebrate(false);
        }, 1200);
        return () => clearTimeout(timer);
      }
      setPrevCompletions(weeklyCompletionCount);
    }
  }, [weeklyCompletionCount, prevCompletions, weeklyGoal]);

  const isMilestoneStreak = habit.streak > 0 && habit.streak % 5 === 0;

  useEffect(() => {
    // Show milestone notification if completed today and streak is multiple of 5 (e.g. 5, 10, etc.)
    if (isCompletedToday && isMilestoneStreak) {
      setShowMilestoneNotification(true);
      const timer = setTimeout(() => {
        setShowMilestoneNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowMilestoneNotification(false);
    }
  }, [isCompletedToday, habit.streak, isMilestoneStreak]);

  // Render a visual tracker grid (last 10 days)
  const renderMiniHistory = () => {
    const dots = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const completed = habit.completedDates.includes(d);
      dots.push(
        <div 
          key={d} 
          title={`${d}: ${completed ? 'Completed' : 'Skipped'}`}
          className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
            completed 
              ? `${style.text} ${style.bg} border-current text-[8px] font-bold` 
              : 'bg-[#151726]/40 border-[#23284B]/40'
          }`}
        >
          {completed && <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
        </div>
      );
    }
    return dots;
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const freshNoteObj = {
      id: 'note_' + Math.random().toString(36).substr(2, 9),
      date: todayStr,
      text: noteText.trim()
    };

    const updatedNotes = [...habit.notes, freshNoteObj];
    const updatedHabit = {
      ...habit,
      notes: updatedNotes,
      updatedAt: new Date().toISOString()
    };

    await editHabit(updatedHabit);
    setNoteText('');
    setAddingNote(false);
  };

  const handleQuickLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogText.trim()) return;

    const freshNoteObj = {
      id: 'note_' + Math.random().toString(36).substr(2, 9),
      date: todayStr,
      text: quickLogText.trim()
    };

    const updatedNotes = [...habit.notes, freshNoteObj];
    const updatedHabit = {
      ...habit,
      notes: updatedNotes,
      updatedAt: new Date().toISOString()
    };

    await editHabit(updatedHabit);
    setQuickLogText('');
    setShowQuickLog(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = habit.notes.filter(n => n.id !== noteId);
    const updatedHabit = {
      ...habit,
      notes: updatedNotes,
      updatedAt: new Date().toISOString()
    };
    await editHabit(updatedHabit);
  };

  return (
    <motion.div 
      key={habit.id}
      animate={{
        scale: clickPing 
          ? (isCompletedToday ? [1, 0.95, 1.03, 0.99, 1] : [1, 0.96, 1.015, 0.99, 1])
          : 1,
        y: clickPing 
          ? (isCompletedToday ? [0, -3, 1, -0.5, 0] : [0, -2, 0.5, 0])
          : 0,
        boxShadow: isMilestoneStreak 
          ? "0 0 20px rgba(234, 179, 8, 0.4), inset 0 0 10px rgba(234, 179, 8, 0.15)"
          : isCompletedToday 
            ? clickPing
              ? [
                  "0 0 8px rgba(0, 240, 255, 0.1), inset 0 0 4px rgba(0, 240, 255, 0.05)",
                  "0 0 32px rgba(0, 240, 255, 0.7), inset 0 0 16px rgba(0, 240, 255, 0.35)",
                  "0 0 18px rgba(0, 240, 255, 0.25), inset 0 0 10px rgba(0, 240, 255, 0.1)"
                ]
              : "0 0 18px rgba(0, 240, 255, 0.25), inset 0 0 10px rgba(0, 240, 255, 0.1)"
            : "0 0 0px rgba(0, 0, 0, 0), inset 0 0 0px rgba(0, 0, 0, 0)",
        borderColor: isMilestoneStreak 
          ? "rgba(234, 179, 8, 0.5)" 
          : isCompletedToday 
            ? clickPing
              ? [
                  "rgba(30, 35, 62, 0.6)",
                  "rgba(0, 240, 255, 0.95)",
                  "rgba(0, 240, 255, 0.5)"
                ]
              : "rgba(0, 240, 255, 0.5)" 
            : "rgba(30, 35, 62, 0.6)",
        backgroundColor: isMilestoneStreak 
          ? "rgba(12, 15, 26, 0.85)" 
          : isCompletedToday 
            ? clickPing
              ? [
                  "rgba(12, 15, 26, 0.85)",
                  "rgba(0, 240, 255, 0.15)",
                  "rgba(5, 19, 32, 0.95)"
                ]
              : "rgba(5, 19, 32, 0.95)" 
            : "rgba(12, 15, 26, 0.85)"
      }}
      whileHover={{
        scale: 1.012,
        y: -2,
        boxShadow: isMilestoneStreak 
          ? "0 0 28px rgba(234, 179, 8, 0.65), inset 0 0 14px rgba(234, 179, 8, 0.25)"
          : isCompletedToday 
            ? "0 0 26px rgba(0, 240, 255, 0.45), inset 0 0 14px rgba(0, 240, 255, 0.18)"
            : "0 0 12px rgba(0, 240, 255, 0.15), inset 0 0 6px rgba(0, 240, 255, 0.05)",
        borderColor: isMilestoneStreak 
          ? "rgba(234, 179, 8, 0.75)" 
          : isCompletedToday 
            ? "rgba(0, 240, 255, 0.8)" 
            : "rgba(0, 240, 255, 0.35)",
        backgroundColor: isMilestoneStreak 
          ? "rgba(15, 19, 32, 0.9)" 
          : isCompletedToday 
            ? "rgba(8, 25, 42, 0.98)" 
            : "rgba(15, 19, 32, 0.9)"
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 450, damping: 18, mass: 0.8 },
        y: { type: "spring", stiffness: 450, damping: 18, mass: 0.8 },
        boxShadow: { duration: 0.22, ease: "easeOut" },
        borderColor: { duration: 0.22, ease: "easeOut" },
        backgroundColor: { duration: 0.22, ease: "easeOut" }
      }}
      className="relative rounded-2xl border overflow-hidden p-4 flex flex-col gap-3 cyber-panel-glow"
      id={`habit-card-${habit.id}`}
    >
      {/* Milestone Streak Celebration Overlay */}
      <AnimatePresence>
        {showMilestoneNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setShowMilestoneNotification(false)}
            className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 z-40 text-center cursor-pointer select-none"
          >
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full animate-pulse" />
                <div className="relative p-2.5 rounded-full bg-amber-950/40 border border-amber-500/50 text-amber-400 font-mono">
                  <Flame className="w-6 h-6 animate-pulse fill-amber-500/20" />
                </div>
              </div>
              
              <div className="mt-1 space-y-0.5">
                <span className="inline-block text-[9px] tracking-[0.15em] font-mono font-bold text-[#00F0FF] bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/40">
                  MILESTONE REACHED!
                </span>
                <h4 className="text-lg font-display font-medium text-white tracking-tight pt-1">
                  🔥 {habit.streak}-Day Streak
                </h4>
                <p className="text-[11px] text-[#A0A6C0] font-sans max-w-[190px] leading-relaxed mx-auto">
                  Neural synapses aligned. Streak integrity verified!
                </p>
                <span className="block text-[9px] text-[#4E5472] font-mono pt-1">(Click anywhere to dismiss)</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upper content - metadata, categories */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border} font-bold`}>
          {habit.category}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(habit)}
            className="p-1.5 hover:bg-[#1E233E] rounded-md text-[#6F7694] hover:text-cyan-400 transition"
            title="Edit Parameter Sync"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button 
            id={`purge-btn-${habit.id}`}
            onClick={() => {
              if (onDelete) {
                onDelete(habit);
              } else {
                deleteHabit(habit.id);
              }
            }}
            className="p-1.5 hover:bg-rose-950/25 rounded-md text-[#6F7694] hover:text-rose-400 transition"
            title="Purge Stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Core click action */}
      <div className="flex gap-4.5 items-start justify-between">
        <div className="flex gap-3 items-start">
          <div className={`p-3 rounded-xl border ${style.bg} ${style.text} ${style.border} shadow-[0_0_10px_rgba(255,255,255,0.01)] shrink-0`}>
            <LucideIcon name={habit.icon} size={22} />
          </div>
          <div>
            <h4 className="font-display font-medium text-base text-[#ECEFF4] leading-snug tracking-tight">
              {habit.name}
            </h4>
            <p className="text-xs text-[#6F7694] mt-1 pr-4 line-clamp-2">
              {habit.description || 'No instruction notes provided'}
            </p>
          </div>
        </div>

        {/* Dynamic check-in trigger button */}
        <motion.button
          id={`check-btn-${habit.id}`}
          onClick={() => {
            toggleHabitCheck(habit.id);
            setClickPing(true);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.90, rotate: isCompletedToday ? -15 : 15 }}
          animate={{
            scale: isCompletedToday ? [1, 1.15, 1] : 1,
            rotate: isCompletedToday ? [0, 360] : 0,
          }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
            isCompletedToday 
              ? 'bg-[#00F0FF] border-[#00F0FF] text-[#08090C] shadow-[0_0_15px_rgba(0,240,255,0.45)]'
              : 'bg-[#151726]/80 border-[#23284B] text-[#4E5472] hover:border-[#00F0FF]/80 hover:bg-[#00F0FF]/10 hover:text-[#00F0FF]'
          }`}
          title={isCompletedToday ? "Mark Incomplete" : "Check in Habit"}
        >
          {isCompletedToday ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              <Check className="w-5 h-5 stroke-[3]" />
            </motion.div>
          ) : (
            <motion.div 
              className="w-3 h-3 rounded-full bg-current" 
              whileHover={{ scale: 1.25 }}
            />
          )}
        </motion.button>
      </div>

      {/* Daily Goal Progress Indicator */}
      <div className="bg-[#121425]/40 border border-[#23284B]/35 rounded-xl p-3.5 space-y-2 mt-1 shadow-inner relative overflow-hidden" id={`daily-goal-${habit.id}`}>
        {/* Subtle accent back glow */}
        <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-[40px] opacity-15 pointer-events-none transition ${isCompletedToday ? style.bg : 'bg-transparent'}`} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-3.5 h-3.5 transition-all duration-300 ${isCompletedToday ? `${style.text} drop-shadow-[0_0_5.5px_rgba(0,240,255,0.5)]` : 'text-[#4E5472]'}`} />
            <span className="text-[10px] font-mono tracking-widest text-[#8C93B2] uppercase font-bold">
              Daily Goal Progress
            </span>
          </div>
          <span className={`text-[10px] font-mono font-bold transition-all duration-300 ${isCompletedToday ? style.text : 'text-[#6F7694]'}`}>
            {isCompletedToday ? '100% (Complete)' : '0% (Pending)'}
          </span>
        </div>

        {/* Outer bar */}
        <div className="relative w-full h-2 bg-[#090A14] rounded-full overflow-hidden border border-[#23284B]/60">
          {/* Animated gradient fill for the daily indicator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isCompletedToday ? '100%' : '0%' }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className={`h-full rounded-full transition-all duration-300 ${
              isCompletedToday
                ? `bg-gradient-to-r from-cyan-500 via-[#00F0FF] to-violet-500 shadow-[0_0_8px_rgba(0,240,255,0.4)]`
                : 'bg-transparent'
            }`}
          />
        </div>
        
        {/* Overall daily habits routine progress */}
        {habits && habits.length > 0 && (
          <div className="flex items-center justify-between text-[8px] font-mono text-[#545B83] uppercase">
            <span>Overall Daily Routine</span>
            <span className="font-semibold text-[#8C93B2]">
              {habits.filter(h => h.completedDates?.includes(todayStr)).length} of {habits.length} done ({
                Math.round((habits.filter(h => h.completedDates?.includes(todayStr)).length / habits.length) * 100)
              }%)
            </span>
          </div>
        )}
      </div>

      {/* Streak indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#1C1F37]/30 pt-2.5 gap-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-w-0">
          
          {/* Current Streak Flame */}
          <div className="flex items-center gap-1">
            <Flame className={`w-3.5 h-3.5 ${isMilestoneStreak ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.85)] animate-pulse' : habit.streak > 0 ? 'text-amber-500 animate-pulse fill-amber-500' : 'text-[#4E5472]'}`} />
            <div>
              <span className="block text-[8px] sm:text-[9px] text-[#4E5472] uppercase font-mono font-bold leading-none">STREAK</span>
              <motion.span 
                key={habit.streak}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
                className="block text-[11px] sm:text-xs font-mono font-bold text-[#A0A6C0] origin-left leading-none mt-0.5"
              >
                {habit.streak}d
              </motion.span>
            </div>
          </div>

          {/* Longest Streak Medal */}
          <div className="flex items-center gap-1">
            <Award className={`w-3.5 h-3.5 ${habit.longestStreak > 0 ? 'text-amber-400 fill-amber-400/10' : 'text-[#4E5472]'}`} />
            <div>
              <span className="block text-[8px] sm:text-[9px] text-[#4E5472] uppercase font-mono font-bold leading-none">MAX</span>
              <span className="block text-[11px] sm:text-xs font-mono font-bold text-[#A0A6C0] leading-none mt-0.5">{habit.longestStreak}d</span>
            </div>
          </div>

          {/* Weekly Quota tracking bar */}
          <motion.div 
            className="flex items-center gap-1 border-l border-[#1C1F37]/30 pl-2 sm:pl-3 relative" 
            id={`weekly-quota-${habit.id}`}
            animate={shouldCelebrate ? {
              scale: [1, 0.92, 1.2, 1.2, 1.2, 1.2, 1.05, 1],
              rotate: [0, -5, 5, -5, 5, -5, 3, 0],
              x: [0, -3, 3, -3, 3, -2, 2, 0],
              filter: [
                "drop-shadow(0 0 0px rgba(52,211,153,0))",
                "drop-shadow(0 0 8px rgba(52,211,153,0.45))",
                "drop-shadow(0 0 18px rgba(52,211,153,0.8))",
                "drop-shadow(0 0 22px rgba(52,211,153,0.9))",
                "drop-shadow(0 0 12px rgba(52,211,153,0.5))",
                "drop-shadow(0 0 0px rgba(52,211,153,0))"
              ]
            } : {}}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <div>
              <span className="block text-[8px] sm:text-[9px] text-[#4E5472] uppercase font-mono font-bold leading-none">QUOTA</span>
              <div className="flex items-center gap-1.5 mt-0.5 relative">
                <div className="w-10 sm:w-12 h-1.5 bg-[#121425] rounded-full overflow-hidden border border-[#23284B] shrink-0 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentPercent}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className={`h-full rounded-full ${
                      isGoalMet ? 'bg-emerald-400 shadow-[0_0_8.5px_rgba(52,211,153,0.55)]' : 'bg-[#00F0FF] shadow-[0_0_8.5px_rgba(0,240,255,0.55)]'
                    }`}
                  />
                </div>
                <span className={`text-[9px] sm:text-[10px] font-mono font-bold leading-none ${isGoalMet ? 'text-emerald-400 font-bold' : 'text-[#6F7694]'}`}>
                  {weeklyCompletionCount}/{weeklyGoal}
                </span>
                <span className={`text-[8px] font-mono leading-none font-bold p-0.5 rounded ${isGoalMet ? 'text-emerald-400/90 bg-emerald-950/20' : 'text-[#9FA8C7] bg-[#151726]/40'}`}>
                  {currentPercent}%
                </span>
                {isGoalMet && (
                  <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                )}

                {/* Floating percentage increment indicator */}
                <AnimatePresence>
                  {showPercentChange && percentChange !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -20, scale: 1.15 }}
                      exit={{ opacity: 0, y: -28, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 320, damping: 15 }}
                      className={`absolute left-0 bottom-full font-mono font-extrabold text-[9px] px-1.5 py-0.5 rounded border shadow-[0_2px_10px_rgba(0,0,0,0.6)] pointer-events-none z-30 leading-none ${
                        percentChange > 0 
                          ? 'bg-emerald-950/95 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20' 
                          : 'bg-rose-950/95 text-rose-400 border-rose-500/40 shadow-rose-500/20'
                      }`}
                    >
                      {percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Expander and Quick Log Actions */}
        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          {/* Quick Log Shortcut Button */}
          <button
            id={`quick-log-btn-${habit.id}`}
            onClick={() => setShowQuickLog(!showQuickLog)}
            className={`p-1.5 rounded-lg border text-[9px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
              showQuickLog 
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.15)]' 
                : 'bg-[#121425]/70 border-transparent text-[#6F7694] hover:text-[#ECEFF4] hover:border-[#1C1F3A]'
            }`}
            title="Quick Synaptic Log"
          >
            <MessageSquarePlus className="w-3 h-3" />
            <span>Quick Log</span>
          </button>

          {/* Expander Arrow */}
          <button
            id={`expander-btn-${habit.id}`}
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 bg-[#121425]/70 hover:bg-[#1C1F3A]/60 rounded-lg text-[#6F7694] hover:text-[#ECEFF4] transition flex items-center gap-1 text-[9px] font-mono cursor-pointer"
          >
            {expanded ? (
              <>
                Hide <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Open <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Log Instant Text Entry (Without needing to expand the card) */}
      <AnimatePresence>
        {showQuickLog && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 4 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden border-t border-[#1C1F37]/30 pt-3 flex flex-col gap-2"
          >
            <span className="block text-[10px] text-[#4E5472] uppercase font-mono font-bold flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#00F0FF]" />
              QUICK TELEMETRY JOURNAL LOG
            </span>
            <form onSubmit={handleQuickLogSubmit} className="flex gap-2">
              <input
                id={`quick-log-input-${habit.id}`}
                type="text"
                placeholder="Type daily journal entry..."
                value={quickLogText}
                onChange={e => setQuickLogText(e.target.value)}
                className="flex-1 text-xs py-2 px-3 rounded-xl bg-[#0F1122]/90 border border-[#23284B] focus:border-cyan-400 focus:outline-none text-[#ECEFF4] cyber-panel-glow"
                autoFocus
              />
              <button
                id={`quick-log-save-btn-${habit.id}`}
                type="submit"
                className="px-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold cursor-pointer hover:bg-cyan-900 transition-all flex items-center gap-1"
              >
                <span>Save</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded view - Calendar grids, notes log */}
      {expanded && (
        <div className="mt-2 border-t border-[#191D33] pt-3 flex flex-col gap-4.5">
          
          {/* Calendar dots */}
          <div>
            <span className="block text-[10px] text-[#4E5472] uppercase font-mono font-bold mb-2 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              SYNAPSE GRID SEQUENCE (LAST 10 DAYS COMPLETIONS)
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {renderMiniHistory()}
            </div>
          </div>

          {/* Habit notes journaling */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-[#4E5472] uppercase font-mono font-bold flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                Dailies notes & Log journals
              </span>
              <button
                onClick={() => setAddingNote(!addingNote)}
                className="text-[10px] font-mono text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" /> Add Log
              </button>
            </div>

            {/* Note form */}
            {addingNote && (
              <form onSubmit={handleCreateNote} className="mb-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Record today's log notes..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  className="flex-1 text-xs py-2 px-3 rounded-xl bg-[#0F1122]/90 border border-[#23284B] focus:border-cyan-400 focus:outline-none text-[#ECEFF4]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold cursor-pointer hover:bg-cyan-900"
                >
                  Save
                </button>
              </form>
            )}

            {/* Notes list */}
            {habit.notes && habit.notes.length > 0 ? (
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                {habit.notes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-xl bg-[#111326] border border-[#1E233E]/50 flex justify-between items-start gap-3">
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-mono text-[#545B83]">{note.date}</span>
                      <p className="text-xs text-[#A0A6C0] font-sans pr-1 leading-normal">{note.text}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[#4E5472] hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[#4E5472] font-mono py-2 text-center border border-dashed border-[#23284B]/30 rounded-xl">
                No telemetry notes written for this cycle. Keep sync log on.
              </p>
            )}
          </div>
        </div>
      )}

    </motion.div>
  );
}
