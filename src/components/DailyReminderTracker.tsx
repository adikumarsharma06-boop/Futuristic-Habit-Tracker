/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellRing, Clock, X, Check, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function DailyReminderTracker() {
  const { habits, toggleHabitCheck } = useApp();
  const [enabled, setEnabled] = useState(false);
  const [targetTime, setTargetTime] = useState('18:00');
  const [dismissedDate, setDismissedDate] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [incompleteList, setIncompleteList] = useState<any[]>([]);

  // Periodically reload preferences of localStorage to keep synced with Profile settings
  const loadPreferences = () => {
    const isEnabled = localStorage.getItem('habit_reminder_enabled') === 'true';
    const savedTime = localStorage.getItem('habit_reminder_time') || '18:00';
    const savedDismissed = localStorage.getItem('habit_reminder_dismissed_date') || '';
    
    setEnabled(isEnabled);
    setTargetTime(savedTime);
    setDismissedDate(savedDismissed);
  };

  useEffect(() => {
    loadPreferences();

    // Set up a listener for custom storage update events triggered by ProfileView edits
    const handleSettingsUpdate = () => {
      loadPreferences();
    };

    window.addEventListener('habit_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('habit_settings_updated', handleSettingsUpdate);
    };
  }, []);

  // Periodic checker to compare current time against Target time and search incomplete habits
  useEffect(() => {
    if (!enabled) {
      setShowNotification(false);
      return;
    }

    const checkInterval = setInterval(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // If user already dismissed it today, do not show
      if (dismissedDate === todayStr) {
        setShowNotification(false);
        return;
      }

      // Check if current time is equal to or after the target reminder time
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const [targetHoursStr, targetMinutesStr] = targetTime.split(':');
      const targetHours = parseInt(targetHoursStr || '18', 10);
      const targetMinutes = parseInt(targetMinutesStr || '00', 10);

      const nowInMinutes = currentHours * 60 + currentMinutes;
      const targetInMinutes = targetHours * 60 + targetMinutes;

      if (nowInMinutes >= targetInMinutes) {
        // Evaluate if they have any incomplete habits for today
        const todaysIncomplete = habits.filter(habit => !habit.completedDates.includes(todayStr));
        setIncompleteList(todaysIncomplete);

        if (todaysIncomplete.length > 0) {
          setShowNotification(true);
        } else {
          setShowNotification(false);
        }
      } else {
        setShowNotification(false);
      }
    }, 5000); // Check every 5 seconds for responsive feedback during testing

    return () => clearInterval(checkInterval);
  }, [enabled, targetTime, dismissedDate, habits]);

  // Handler to mark habit completed directly from the banner checklist
  const handleToggleHabit = async (habitId: string) => {
    try {
      await toggleHabitCheck(habitId);
      // Let the list update reactively
    } catch (e) {
      console.error("Failed to complete habit from reminder banner:", e);
    }
  };

  // Handler to dismiss notification for today only
  const handleDismissForeverToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('habit_reminder_dismissed_date', todayStr);
    setDismissedDate(todayStr);
    setShowNotification(false);
  };

  return (
    <AnimatePresence>
      {showNotification && incompleteList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0B0E1B] border-2 border-red-500/50 rounded-2xl p-5 shadow-[0_10px_35px_rgba(239,68,68,0.25)] relative overflow-hidden font-sans"
          id="daily-reminder-active-toast"
        >
          {/* Subtle Cyber scanlines overlay */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-amber-500 animate-pulse" />
          
          <div className="flex gap-3.5">
            {/* Pulsing Alert Orb icon */}
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 relative">
              <span className="absolute inset-0 bg-red-500/10 rounded-xl animate-ping opacity-60" />
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between leading-none mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold flex items-center gap-1.5 bg-red-950/20 px-2 py-0.5 rounded-full border border-red-900/30">
                  <AlertTriangle className="w-3 h-3 text-red-400" /> TEMPORAL ALERT
                </span>
                <span className="text-[9px] font-mono text-[#5E6482]">SCHEDULED {targetTime}</span>
              </div>

              <h4 className="text-sm font-display font-medium text-white tracking-tight">
                Incomplete Coordinates Detected
              </h4>
              <p className="text-[11px] text-[#8A91B4] font-mono mt-1 leading-normal">
                You have <strong className="text-red-400 font-black">{incompleteList.length} habit{incompleteList.length > 1 ? 's' : ''}</strong> lagging behind schedule for today.
              </p>

              {/* Incomplete checklist interactive area */}
              <div className="mt-3.5 space-y-2 max-h-[160px] overflow-y-auto pr-1" id="reminder-checklist-container">
                {incompleteList.map((habit) => (
                  <div 
                    key={habit.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#05060A]/90 border border-[#161B30] text-xs font-mono group hover:border-cyan-500/40 transition duration-200"
                  >
                    <span className="text-white truncate pr-2 font-medium">
                      {habit.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleHabit(habit.id)}
                      className="px-2 py-1 rounded bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-800/40 hover:border-cyan-400 text-[10px] font-bold text-cyan-400 transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Check className="w-3 h-3" /> Check In
                    </button>
                  </div>
                ))}
              </div>

              {/* Button controllers row */}
              <div className="flex gap-2.5 mt-4 pt-3.5 border-t border-[#1C213D] justify-end">
                <button
                  type="button"
                  onClick={handleDismissForeverToday}
                  className="px-3 py-1.5 rounded-xl border border-[#222E5C] hover:border-red-500/40 hover:text-red-300 text-[10px] font-mono font-bold text-[#8A91B4] transition cursor-pointer"
                >
                  DISMISS TODAY
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
