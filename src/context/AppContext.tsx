/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Habit, UserProfile, FocusSession, Quote, HabitCategory, HabitNote, AchievementBadge } from '../types';
import { dbService, auth, isOfflineMode, signOutFromApp, handleFirestoreError, signInWithGoogle, registerWithEmail, signInWithEmail, resetPassword } from '../lib/firebase';
import { evaluateGamification } from '../lib/badges';
import { onAuthStateChanged } from 'firebase/auth';

interface AppContextProps {
  userProfile: UserProfile | null;
  habits: Habit[];
  focusSessions: FocusSession[];
  currentView: 'dashboard' | 'focus' | 'analytics' | 'badges' | 'profile';
  loading: boolean;
  quote: Quote | null;
  fetchingQuote: boolean;
  activeUnlockedBadge: AchievementBadge | null;
  closeBadgeModal: () => void;
  setCurrentView: (view: 'dashboard' | 'focus' | 'analytics' | 'badges' | 'profile') => void;
  refreshQuote: () => Promise<void>;
  toggleHabitCheck: (habitId: string) => Promise<void>;
  createHabit: (name: string, description: string, category: HabitCategory, icon: string, weeklyGoal?: number) => Promise<void>;
  editHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  completeTimerSession: (duration: number, category: string) => Promise<void>;
  loginUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  registerWithEmailAction: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmailAction: (email: string, password: string) => Promise<void>;
  resetPasswordAction: (email: string) => Promise<void>;
  updateUserProfileAction: (displayName: string, photoURL: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  isOffline: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'focus' | 'analytics' | 'badges' | 'profile'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [activeUnlockedBadge, setActiveUnlockedBadge] = useState<AchievementBadge | null>(null);
  const [isOffline, setIsOffline] = useState(isOfflineMode);

  // Load quote from server api
  const refreshQuote = useCallback(async (force = false) => {
    setFetchingQuote(true);
    try {
      const resp = await fetch(force ? '/api/gemini/quote?force=true' : '/api/gemini/quote');
      if (resp.ok) {
        const data = await resp.json();
        setQuote(data);
      } else {
        throw new Error("API call failed");
      }
    } catch (e) {
      console.warn("Failed to retrieve quote, loading fallback", e);
      setQuote({
        text: "Your daily actions are the building blocks of structural integrity. Log your streak to strengthen the machine.",
        author: "Apex Mainframe"
      });
    } finally {
      setFetchingQuote(false);
    }
  }, []);

  // Sync state data
  const loadStateData = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      if (!uid) {
        setUserProfile(null);
        setHabits([]);
        setFocusSessions([]);
        return;
      }
      const profile = await dbService.getUserProfile(uid);
      const userHabits = await dbService.getHabits(uid);
      const userFocus = await dbService.getFocusSessions(uid);

      if (profile) {
        setUserProfile(profile);
      } else if (uid === 'sandbox-user-id') {
        // Build fallback
        const mockProfile: UserProfile = {
          uid: 'sandbox-user-id',
          email: 'sandbox@example.com',
          displayName: 'Futuristic Explorer',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
          xp: 150,
          level: 1,
          achievements: ['first_steps'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setUserProfile(mockProfile);
        await dbService.saveUserProfile(mockProfile);
      } else {
        setUserProfile(null);
      }

      setHabits(userHabits);
      setFocusSessions(userFocus);
    } catch (err) {
      console.error("Error reading initial tracker datasets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mon Auth status
  useEffect(() => {
    setIsOffline(isOfflineMode);
    
    // If not in offline/mock mode, subscribe to auth transitions
    if (!isOfflineMode && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user: any | null) => {
        if (user) {
          await loadStateData(user.uid);
        } else {
          // Check if there is an active mock session
          const mockProfileStr = localStorage.getItem('futuristic_profile');
          if (mockProfileStr) {
            try {
              const mockProfile = JSON.parse(mockProfileStr);
              await loadStateData(mockProfile.uid);
            } catch (e) {
              await loadStateData('');
            }
          } else {
            await loadStateData('');
          }
        }
      });
      return () => unsubscribe();
    } else {
      // Offline fallback: check if we have a signed in mock profile
      const mockProfileStr = localStorage.getItem('futuristic_profile');
      if (mockProfileStr) {
        try {
          const mockProfile = JSON.parse(mockProfileStr);
          loadStateData(mockProfile.uid);
        } catch (e) {
          setLoading(false);
          setUserProfile(null);
        }
      } else {
        setLoading(false);
        setUserProfile(null);
      }
    }
  }, [loadStateData]);

  // Handle live storage callbacks during sandbox simulations
  useEffect(() => {
    const handleSync = () => {
      const uid = userProfile?.uid || '';
      if (uid) {
        loadStateData(uid);
      }
    };
    window.addEventListener('storage_profile_updated', handleSync);
    window.addEventListener('storage_habits_updated', handleSync);
    window.addEventListener('storage_focus_updated', handleSync);
    return () => {
      window.removeEventListener('storage_profile_updated', handleSync);
      window.removeEventListener('storage_habits_updated', handleSync);
      window.removeEventListener('storage_focus_updated', handleSync);
    };
  }, [userProfile?.uid, loadStateData]);

  // Load first quote on boot
  useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  // LOGIN ACTIONS
  const loginUser = async () => {
    setLoading(true);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        await loadStateData(profile.uid);
      }
    } catch (e) {
      console.error("Popup trigger error:", e);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmailAction = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const profile = await registerWithEmail(email, password, displayName);
      if (profile) {
        await loadStateData(profile.uid);
      }
    } catch (e) {
      console.error("Email registration error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailAction = async (email: string, password: string) => {
    setLoading(true);
    try {
      const profile = await signInWithEmail(email, password);
      if (profile) {
        await loadStateData(profile.uid);
      }
    } catch (e) {
      console.error("Email sign-in error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordAction = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (e) {
      console.error("Context reset password error:", e);
      throw e;
    }
  };

  const updateUserProfileAction = async (displayName: string, photoURL: string) => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const updatedProfile: UserProfile = {
        ...userProfile,
        displayName,
        photoURL,
        updatedAt: new Date().toISOString()
      };
      
      // Save it to firebase
      await dbService.saveUserProfile(updatedProfile);
      
      // Update local state react-side
      setUserProfile(updatedProfile);
    } catch (e) {
      console.error("Context profile update error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setLoading(true);
    try {
      const mockProfile: UserProfile = {
        uid: 'sandbox-user-id',
        email: 'sandbox@example.com',
        displayName: 'Futuristic Explorer',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
        xp: 150,
        level: 1,
        achievements: ['first_steps'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('futuristic_profile', JSON.stringify(mockProfile));
      await loadStateData('sandbox-user-id');
    } catch (e) {
      console.error("Guest login error:", e);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOutFromApp();
      setUserProfile(null);
      setHabits([]);
      setFocusSessions([]);
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setLoading(false);
    }
  };

  // Toggle habit check-in for 'Today'
  const toggleHabitCheck = async (habitId: string) => {
    if (!userProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    let updatedDates = [...habit.completedDates];
    const isCompletedToday = updatedDates.includes(todayStr);

    let xpGained = 0;

    if (isCompletedToday) {
      // Uncheck
      updatedDates = updatedDates.filter(d => d !== todayStr);
      xpGained = -10; // reduce XP
    } else {
      // Check
      updatedDates.push(todayStr);
      xpGained = 15; // check-in reward!
    }

    // --- RE-CALCULATE STREAKS ---
    // Sort completion dates descending
    const sortedDates = [...new Set(updatedDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let currentStreak = 0;
    let keepCounting = true;
    let daysDiff = 0;

    // Helper to format Date
    const getDaysDiff = (d1: string, d2: string) => {
      const timeDiff = Math.abs(new Date(d1).getTime() - new Date(d2).getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    if (sortedDates.includes(todayStr)) {
      currentStreak = 1;
      let checkDate = todayStr;
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        if (date === todayStr) continue;
        
        const diff = getDaysDiff(checkDate, date);
        if (diff === 1) {
          currentStreak++;
          checkDate = date;
        } else if (diff > 1) {
          break; // break sequence
        }
      }
    } else {
      // Today isn't completed, check if yesterday was completed to keep streak alive
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (sortedDates.includes(yesterdayStr)) {
        currentStreak = 1;
        let checkDate = yesterdayStr;
        
        for (let i = 0; i < sortedDates.length; i++) {
          const date = sortedDates[i];
          if (date === yesterdayStr || date === todayStr) continue;
          
          const diff = getDaysDiff(checkDate, date);
          if (diff === 1) {
            currentStreak++;
            checkDate = date;
          } else if (diff > 1) {
            break;
          }
        }
      } else {
        currentStreak = 0;
      }
    }

    const longestStreak = Math.max(habit.longestStreak, currentStreak);

    const updatedHabit: Habit = {
      ...habit,
      completedDates: updatedDates,
      streak: currentStreak,
      longestStreak,
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update habits list
    const updatedHabitsList = habits.map(h => h.id === habitId ? updatedHabit : h);
    setHabits(updatedHabitsList);

    // Save habit
    await dbService.updateHabit(userProfile.uid, updatedHabit);

    // Award XP and evaluate badges
    let nextXp = Math.max(0, userProfile.xp + xpGained);
    const mockProfileForEvaluation: UserProfile = {
      ...userProfile,
      xp: nextXp,
      updatedAt: new Date().toISOString(),
    };

    const { updatedProfile, newlyUnlockedBadges } = evaluateGamification(
      mockProfileForEvaluation,
      updatedHabitsList,
      focusSessions
    );

    setUserProfile(updatedProfile);
    await dbService.saveUserProfile(updatedProfile);

    if (newlyUnlockedBadges.length > 0) {
      // Trigger floating overlay of the highest threshold badge unlocked
      setActiveUnlockedBadge(newlyUnlockedBadges[0]);
    }
  };

  // Create Habit
  const createHabit = async (name: string, description: string, category: HabitCategory, icon: string, weeklyGoal: number = 5) => {
    if (!userProfile) return;
    const newHabit = await dbService.addHabit(userProfile.uid, {
      name,
      description,
      category,
      icon,
      completedDates: [],
      notes: [],
      streak: 0,
      longestStreak: 0,
      weeklyGoal,
    });

    const activeHabits = [...habits, newHabit];
    setHabits(activeHabits);

    // Gamify check
    let nextXp = userProfile.xp + 50; // Habit Architect XP bonus
    const updatedProfileBase = {
      ...userProfile,
      xp: nextXp,
      updatedAt: new Date().toISOString(),
    };

    const { updatedProfile, newlyUnlockedBadges } = evaluateGamification(
      updatedProfileBase,
      activeHabits,
      focusSessions
    );

    setUserProfile(updatedProfile);
    await dbService.saveUserProfile(updatedProfile);

    if (newlyUnlockedBadges.length > 0) {
      setActiveUnlockedBadge(newlyUnlockedBadges[0]);
    }
  };

  // Update Habit
  const editHabit = async (updatedHabit: Habit) => {
    if (!userProfile) return;
    const modified = habits.map(h => h.id === updatedHabit.id ? updatedHabit : h);
    setHabits(modified);
    await dbService.updateHabit(userProfile.uid, updatedHabit);
  };

  // Delete Habit
  const deleteHabit = async (habitId: string) => {
    if (!userProfile) return;
    setHabits(habits.filter(h => h.id !== habitId));
    await dbService.deleteHabit(userProfile.uid, habitId);
  };

  // Complete Pomodorotimer Focus Session
  const completeTimerSession = async (duration: number, category: string) => {
    if (!userProfile) return;
    const newSession = await dbService.addFocusSession(userProfile.uid, duration, category);
    const updatedSessions = [...focusSessions, newSession];
    setFocusSessions(updatedSessions);

    // Focus Reward Core: Award XP based on duration! +1 XP per minute, plus 10 focus completing bonus!
    const focusXpReward = duration + 15;
    let nextXp = userProfile.xp + focusXpReward;

    const mockProfileEvaluation = {
      ...userProfile,
      xp: nextXp,
      updatedAt: new Date().toISOString(),
    };

    const { updatedProfile, newlyUnlockedBadges } = evaluateGamification(
      mockProfileEvaluation,
      habits,
      updatedSessions
    );

    setUserProfile(updatedProfile);
    await dbService.saveUserProfile(updatedProfile);

    if (newlyUnlockedBadges.length > 0) {
      setActiveUnlockedBadge(newlyUnlockedBadges[0]);
    }
  };

  const closeBadgeModal = () => {
    setActiveUnlockedBadge(null);
  };

  return (
    <AppContext.Provider value={{
      userProfile,
      habits,
      focusSessions,
      currentView,
      loading,
      quote,
      fetchingQuote,
      activeUnlockedBadge,
      closeBadgeModal,
      setCurrentView,
      refreshQuote,
      toggleHabitCheck,
      createHabit,
      editHabit,
      deleteHabit,
      completeTimerSession,
      loginUser,
      logoutUser,
      registerWithEmailAction,
      signInWithEmailAction,
      resetPasswordAction,
      updateUserProfileAction,
      loginAsGuest,
      isOffline,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be inside an AppProvider context hierarchy.');
  }
  return context;
}
