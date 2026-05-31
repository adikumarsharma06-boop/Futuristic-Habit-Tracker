/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import HabitCard from './HabitCard';
import AddEditHabitModal from './AddEditHabitModal';
import LucideIcon from './LucideIcon';
import { Habit, HabitCategory } from '../types';
import { Plus, Download, BarChart3, ListFilter, SlidersHorizontal, Briefcase, PlusCircle, LayoutGrid, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FILTER_CATEGORIES: { id: HabitCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Vectors' },
  { id: 'mind', label: 'Mind' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'health', label: 'Health' },
  { id: 'work', label: 'Work' },
  { id: 'creative', label: 'Creative' },
  { id: 'social', label: 'Social' },
];

const STARTER_HABITS = [
  {
    name: 'Mind Sync (Meditation)',
    description: '10 minutes of daily mindfulness calibration and breath synchronization.',
    category: 'mind' as HabitCategory,
    icon: 'Brain',
    colorText: 'text-cyan-400',
    colorBg: 'bg-cyan-950/20',
    colorBorder: 'border-cyan-800/40'
  },
  {
    name: 'Iron Core (Exercise)',
    description: 'High intensity stretch, aerobic or core weight training.',
    category: 'fitness' as HabitCategory,
    icon: 'Dumbbell',
    colorText: 'text-rose-400',
    colorBg: 'bg-rose-950/20',
    colorBorder: 'border-rose-800/40'
  },
  {
    name: 'Deep Focus Sprint',
    description: 'Unhindered focus block for programming or writing tech vectors.',
    category: 'work' as HabitCategory,
    icon: 'Code2',
    colorText: 'text-violet-400',
    colorBg: 'bg-violet-950/20',
    colorBorder: 'border-violet-800/40'
  }
];

export default function DashboardView() {
  const { habits, userProfile, focusSessions, isOffline, deleteHabit, createHabit } = useApp();
  
  const [activeFilter, setActiveFilter] = useState<HabitCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabitData, setEditHabitData] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteConfirmsLoss, setDeleteConfirmsLoss] = useState(false);

  useEffect(() => {
    if (!habitToDelete) {
      setDeleteConfirmText('');
      setDeleteConfirmsLoss(false);
    }
  }, [habitToDelete]);

  const todayStr = new Date().toISOString().split('T')[0];
  
  const handleConfirmDelete = async () => {
    if (habitToDelete) {
      const hasStreak = habitToDelete.streak > 0;
      const hasLongStreak = habitToDelete.streak >= 3;
      
      if (hasStreak && !deleteConfirmsLoss) return;
      if (hasLongStreak && deleteConfirmText !== habitToDelete.name) return;

      await deleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  };
  const activeHabits = habits;

  // Calcul completions
  const completedTodayList = activeHabits.filter(h => h.completedDates?.includes(todayStr));
  const completedTodayPct = activeHabits.length > 0
    ? Math.round((completedTodayList.length / activeHabits.length) * 100)
    : 0;

  // Weekly Goal quota tracking calculations
  const calculateWeeklyGoalPerformance = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now.getTime() - daysSinceMonday * 24 * 60 * 60 * 1000);
    monday.setHours(0, 0, 0, 0);

    let totalGoalsMet = 0;
    let totalWeeklyCompletions = 0;
    let totalWeeklyQuotaNeeded = 0;

    activeHabits.forEach(habit => {
      const goal = habit.weeklyGoal || 5;
      totalWeeklyQuotaNeeded += goal;

      let completionsThisWeek = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        if (habit.completedDates?.includes(d)) {
          completionsThisWeek++;
        }
      }
      totalWeeklyCompletions += completionsThisWeek;
      if (completionsThisWeek >= goal) {
        totalGoalsMet++;
      }
    });

    return {
      totalGoalsMet,
      totalWeeklyCompletions,
      totalWeeklyQuotaNeeded,
      overallMetPct: totalWeeklyQuotaNeeded > 0 ? Math.round((totalWeeklyCompletions / totalWeeklyQuotaNeeded) * 100) : 0
    };
  };

  const weeklyPerf = calculateWeeklyGoalPerformance();

  // Filter habits list
  const filteredHabits = activeFilter === 'all'
    ? activeHabits
    : activeHabits.filter(h => h.category === activeFilter);

  const handleOpenAdd = () => {
    setEditHabitData(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditHabitData(habit);
    setModalOpen(true);
  };

  // Data Export Feature dump to JSON
  const handleExportData = () => {
    const fullDump = {
      profile: userProfile,
      habits: habits,
      focusSessions: focusSessions,
      exportedAt: new Date().toISOString(),
      platform: "Futuristic Habit Tracker Console"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDump, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", `telemetry_matrix_${userProfile?.uid || 'sandbox_user'}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6" id="dashboard-view-container">
      
      {/* 1. Daily Progress Ring card */}
      <div className="bg-gradient-to-r from-[#0B0D19] via-[#0E1122] to-[#0A0C14] border border-[#1E233E]/70 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">Today Vector Progress</h3>
          <p className="text-[11px] sm:text-xs text-[#6F7694] mt-1 pr-0 sm:pr-6 max-w-lg leading-normal">
            Calibrate all systems concurrently. Complete active neural habits to increase daily synchronization.
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4 items-center">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-[#A0A6C0]">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-cyan-400 rounded-md shadow-[0_0_5px_rgba(0,240,255,0.4)]"></span>
              COMPLETED: <strong>{completedTodayList.length}</strong>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-[#A0A6C0]">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#14172B] rounded-md border border-[#23284B]"></span>
              PENDING: <strong>{activeHabits.length - completedTodayList.length}</strong>
            </div>
            {activeHabits.length > 0 && (
              <div 
                id="weekly-progress-summary-badge" 
                className="flex items-center gap-1.5 text-[9.5px] sm:text-[11px] font-mono text-emerald-400 border border-emerald-950/40 bg-emerald-950/15 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl"
                title="Consolidated Weekly Goals Completion Status"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>WEEKLY QUOTA: <strong className="text-white">{weeklyPerf.totalWeeklyCompletions}/{weeklyPerf.totalWeeklyQuotaNeeded}</strong> ({weeklyPerf.overallMetPct}%)</span>
              </div>
            )}
            <button
              onClick={handleExportData}
              className="text-[10px] sm:text-xs font-semibold px-2 px-2.5 py-1.5 rounded-lg sm:rounded-xl border border-[#23284B] hover:border-cyan-400/50 hover:text-cyan-400 text-[#6F7694] bg-[#0E1020] transition duration-200 cursor-pointer flex items-center gap-1"
              title="Dump Local JSON data"
            >
              <Download className="w-3.5 h-3.5" />
              Backup Core Logs (Export)
            </button>
          </div>
        </div>

        {/* Big visual progress circle */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0" id="progress-circle-wrapper">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle 
              cx="56" 
              cy="56" 
              r="48" 
              className="stroke-[#13172E] stroke-[5] fill-transparent"
            />
            <motion.circle 
              cx="56" 
              cy="56" 
              r="48" 
              className="stroke-cyan-400 stroke-[5] fill-transparent"
              initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - completedTodayPct / 100) }}
              transition={{ type: "spring", stiffness: 85, damping: 16 }}
              strokeDasharray={2 * Math.PI * 48}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.5))' }}
            />
          </svg>
          
          {/* Spark particles when at 100% */}
          {completedTodayPct === 100 && activeHabits.length > 0 && (
            <div className="absolute inset-0 pointer-events-none" id="progress-100-percent-sparks">
              {[...Array(6)].map((_, i) => {
                const angle = (i * 360) / 6;
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 58;
                const y = Math.sin(radian) * 58;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x, y, scale: [0, 1.25, 0], opacity: [1, 1, 0] }}
                    transition={{
                      type: "tween",
                      duration: 1.4,
                      repeat: Infinity,
                      repeatDelay: 0.3,
                      delay: i * 0.12,
                      ease: "easeOut"
                    }}
                    className="absolute left-1/2 top-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.9)]"
                  />
                );
              })}
              {/* Extra central visual pulse wave */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-cyan-400/30"
              />
            </div>
          )}

          <motion.div 
            key={completedTodayPct}
            initial={{ scale: 0.85, opacity: 0.8 }}
            animate={{ scale: completedTodayPct === 100 ? [1, 1.2, 1] : 1, opacity: 1 }}
            transition={completedTodayPct === 100 
              ? { type: "tween", duration: 0.6, ease: "easeInOut" } 
              : { type: "spring", stiffness: 350, damping: 12 }
            }
            className="text-center font-mono z-10"
            id="progress-percent-display"
          >
            <span className="text-xl font-bold block text-white">{completedTodayPct}%</span>
            <span className="text-[8px] uppercase text-[#4E5472] tracking-wider leading-none block">SYNC COMPL</span>
          </motion.div>
        </div>
      </div>

      {/* 2. Horizontal filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 border-b border-[#23284B]/20 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
          {FILTER_CATEGORIES.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-tight cursor-pointer font-bold border transition ${
                activeFilter === f.id
                  ? 'bg-cyan-950/40 text-cyan-400 border-cyan-800 shadow-[0_0_8px_rgba(0,240,255,0.06)] scale-[1.03]'
                  : 'bg-transparent border-transparent text-[#6F7694] hover:text-[#ECEFF4] hover:bg-[#101223]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#00F0FF] hover:bg-cyan-400 text-black text-xs font-semibold rounded-xl select-none flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:shadow-[0_0_18px_rgba(0,240,255,0.4)] transition cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Synthesize Habit
        </button>
      </div>

      {/* 3. Habits visual list grid */}
      {filteredHabits.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredHabits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9, 
                  y: -10,
                  transition: { duration: 0.2, ease: 'easeInOut' }
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 450, 
                  damping: 35,
                  layout: { duration: 0.25, type: 'spring', stiffness: 450, damping: 38 }
                }}
              >
                <HabitCard 
                  habit={habit} 
                  onEdit={handleOpenEdit} 
                  onDelete={(h) => setHabitToDelete(h)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="py-16 text-center rounded-3xl border border-dashed border-[#1E233E]/60 bg-[#0A0C14]/40 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0B0D19]/40 to-[#0A0C14]/40 select-none max-w-2xl mx-auto w-full">
          <div className="w-13 h-13 rounded-2xl bg-cyan-950/20 text-[#00F0FF] border border-cyan-950/40 flex items-center justify-center mb-4.5">
            <LayoutGrid className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="font-display font-medium text-lg text-[#ECEFF4]">Vectors Inactive</h4>
          <p className="text-xs text-[#6F7694] mt-1 max-w-sm mx-auto leading-normal">
            No habits detected under the <strong>"{activeFilter}"</strong> filter matrix. Click down below or select a suggested starter stream.
          </p>
          
          <button
            onClick={handleOpenAdd}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900 transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Initialize Custom Stream
          </button>

          {/* Suggested Starter Streams */}
          <div className="mt-8 w-full">
            <span className="block text-[9px] uppercase tracking-wider font-mono text-[#545B83] font-bold mb-3.5">
              OR INITIALIZE SUGGESTED NEURAL PRESETS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STARTER_HABITS.map((starter) => (
                <button
                  key={starter.name}
                  onClick={() => createHabit(starter.name, starter.description, starter.category, starter.icon)}
                  className="p-3 text-left rounded-xl bg-[#0F1122]/80 border border-[#23284B] hover:border-cyan-400/50 transition duration-200 group flex flex-col gap-1.5 cursor-pointer hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] w-full"
                  id={`starter-btn-${starter.icon.toLowerCase()}`}
                  title={`Acquire preset: ${starter.name}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-1.5 rounded-lg ${starter.colorBg} ${starter.colorText} border ${starter.colorBorder}`}>
                      <LucideIcon name={starter.icon} size={14} />
                    </div>
                    <span className="text-[8px] font-mono tracking-wider text-[#545B83] uppercase group-hover:text-cyan-400 transition-colors">
                      + INSTANT
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="text-[11px] font-bold text-[#ECEFF4] group-hover:text-cyan-400 transition">
                      {starter.name}
                    </p>
                    <p className="text-[9px] text-[#6F7694] leading-snug font-normal line-clamp-2 mt-0.5 group-hover:text-[#A0A6C0] transition">
                      {starter.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) on mobile */}
      <div className="md:hidden fixed bottom-20 right-5 z-40">
        <button
          onClick={handleOpenAdd}
          className="w-13 h-13 bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.45)] rounded-full flex items-center justify-center p-3 select-none cursor-pointer transform hover:scale-105 transition active:scale-95"
          title="Create custom Habit stream"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Deploy popup settings dialog */}
      <AddEditHabitModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        habitToEdit={editHabitData} 
      />

      {/* Stream Deletion / Habit Reset Confirmation Overlay */}
      <AnimatePresence>
        {habitToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop panel with dark blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHabitToDelete(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md animate-fade-in"
              id="confirm-delete-backdrop"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/30 bg-[#0A0C16] p-6 shadow-[0_0_40px_rgba(244,63,94,0.15)] z-10"
              id="confirm-delete-modal"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-950/20 border border-rose-500/30 text-rose-400 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1">
                  <span className="block text-[10px] text-rose-400 uppercase font-mono font-bold tracking-widest mb-1">
                    STREAM DELETION DETECTED
                  </span>
                  <h3 className="font-display font-black text-lg text-white leading-tight">
                    Purge Neural Habit Stream?
                  </h3>
                  <p className="text-xs text-[#6F7694] mt-2 leading-relaxed">
                    You are trying to terminate <span className="text-rose-400 font-semibold">"{habitToDelete.name}"</span>. This will destroy all associated journal entries, status values, and historic logging streams irreversibly.
                  </p>
                </div>
              </div>

              {/* Warnings stats panel context */}
              <div className="mt-5 p-3.5 bg-[#0F1122]/80 border border-[#23284B] rounded-xl flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#545B83] uppercase">Current Streak:</span>
                  <span className={`font-bold ${habitToDelete.streak >= 3 ? 'text-red-400 font-black animate-pulse' : 'text-amber-400'}`}>{habitToDelete.streak} days</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#545B83] uppercase">Journal Records:</span>
                  <span className="text-cyan-400 font-bold">{habitToDelete.notes?.length || 0} entries</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#545B83] uppercase">Sync Level:</span>
                  <span className="text-emerald-400 font-bold capitalize">{habitToDelete.category} vector</span>
                </div>

                {habitToDelete.streak > 0 && (
                  <div className="border-t border-[#1C1F37] pt-2.5 mt-1 space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        id="loss-checkbox"
                        checked={deleteConfirmsLoss} 
                        onChange={(e) => setDeleteConfirmsLoss(e.target.checked)}
                        className="mt-0.5 rounded border-[#23284B] bg-[#0A0C16] text-rose-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-rose-400 leading-tight">
                        I UNDERSTAND DELETION DESTROYS MY ACTIVE <strong className="text-amber-400 font-extrabold">{habitToDelete.streak}-DAY</strong> STREAK INSTANTLY.
                      </span>
                    </label>
                  </div>
                )}

                {habitToDelete.streak >= 3 && (
                  <div className="border-t border-[#1C1F37] pt-2.5 space-y-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-red-400 uppercase block font-black">
                      ⚠️ STREAK GUARD ENGAGED ({habitToDelete.streak} Days)
                    </label>
                    <p className="text-[10px] text-[#6F7694] leading-normal font-mono">
                      Type exact habit name <strong className="text-white">"{habitToDelete.name}"</strong> to bypass destruction lock:
                    </p>
                    <input
                      type="text"
                      id="streak-guard-input"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type habit name here..."
                      className="w-full bg-[#05060A]/80 border border-[#1E233E] focus:border-rose-500/50 rounded-lg py-1.5 px-2.5 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  id="confirm-delete-cancel-btn"
                  type="button"
                  onClick={() => setHabitToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#23284B] hover:border-[#3a4170] hover:bg-[#121425] text-xs font-mono font-bold text-[#A0A6C0] cursor-pointer transition-all uppercase"
                >
                  ABORT DELETION
                </button>
                <button
                  id="confirm-delete-action-btn"
                  type="button"
                  disabled={(habitToDelete.streak > 0 && !deleteConfirmsLoss) || (habitToDelete.streak >= 3 && deleteConfirmText !== habitToDelete.name)}
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all uppercase disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-rose-950/10 disabled:text-rose-500/40 disabled:border-[#1F171A] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]"
                >
                  CONFIRM PURGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
