/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AchievementBadge, UserProfile, Habit, FocusSession } from '../types';

export const BADGES_LIST: AchievementBadge[] = [
  {
    id: 'first_steps',
    title: 'Cognitive Initiate',
    description: 'Began the daily neural calibration.',
    requirementDescription: 'Loaded the tracking matrix.',
    type: 'xp_level',
    threshold: 0,
    badgeColor: 'from-cyan-400 to-blue-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]',
    icon: 'Sparkles',
  },
  {
    id: 'badge_first_habit',
    title: 'Architect',
    description: 'Designed your first habit tracking sequence.',
    requirementDescription: 'Synthesize a custom tracking item.',
    type: 'habits_count',
    threshold: 1,
    badgeColor: 'from-teal-400 to-emerald-500 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]',
    icon: 'Plus',
  },
  {
    id: 'badge_polymath',
    title: 'Grand Polymath',
    description: 'Simultaneously run 4 custom habit streams.',
    requirementDescription: 'Have 4 active habits.',
    type: 'habits_count',
    threshold: 4,
    badgeColor: 'from-violet-400 to-[#8000FF] text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    icon: 'Compass',
  },
  {
    id: 'streak_3_days',
    title: 'Hyper-Charged core',
    description: 'Maintained a consecutive habit sequence for 3 days.',
    requirementDescription: 'Reach a 3-day streak on any habit.',
    type: 'streak',
    threshold: 3,
    badgeColor: 'from-amber-400 to-orange-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    icon: 'Flame',
  },
  {
    id: 'streak_10_days',
    title: 'Singularity Streak',
    description: 'Unbroken consecutive performance for 10 days.',
    requirementDescription: 'Reach a 10-day streak on any habit.',
    type: 'streak',
    threshold: 10,
    badgeColor: 'from-pink-500 to-rose-600 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]',
    icon: 'Flame',
  },
  {
    id: 'deep_work_initiate',
    title: 'Adept Focus',
    description: 'Completed a deep research session of any duration.',
    requirementDescription: 'Complete 1 Focus Session.',
    type: 'timer',
    threshold: 1,
    badgeColor: 'from-blue-400 to-indigo-600 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    icon: 'Timer',
  },
  {
    id: 'deep_work_legend',
    title: 'Chronos Override',
    description: 'Completed over 60 minutes of sum focus work.',
    requirementDescription: 'Exceed 60 minutes in cumulative active timers.',
    type: 'timer',
    threshold: 60,
    badgeColor: 'from-fuchsia-400 to-purple-600 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]',
    icon: 'Target',
  },
  {
    id: 'level_5_archon',
    title: 'Apex Archon',
    description: 'Amplified cognitive calibration level to 5.',
    requirementDescription: 'Reach level 5.',
    type: 'xp_level',
    threshold: 5,
    badgeColor: 'from-yellow-400 to-amber-600 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    icon: 'Award',
  }
];

export interface EarnedBadgeResponse {
  updatedProfile: UserProfile;
  newlyUnlockedBadges: AchievementBadge[];
}

/**
 * Checks if user is eligible for badges, unlocks them, updates levels, grants bonuses, and returns changes
 */
export function evaluateGamification(
  profile: UserProfile,
  habits: Habit[],
  sessions: FocusSession[]
): EarnedBadgeResponse {
  const currentAchievements = new Set(profile.achievements || []);
  const newlyUnlockedBadges: AchievementBadge[] = [];
  
  // Calculate XP values and level up
  let totalXp = profile.xp;
  
  // 1. Initial Badge (if somehow missing)
  if (!currentAchievements.has('first_steps')) {
    currentAchievements.add('first_steps');
    newlyUnlockedBadges.push(BADGES_LIST[0]);
    totalXp += 50; // Welcome XP
  }

  // 2. First Habit
  if (habits.length >= 1 && !currentAchievements.has('badge_first_habit')) {
    currentAchievements.add('badge_first_habit');
    const badge = BADGES_LIST.find(b => b.id === 'badge_first_habit');
    if (badge) {
      newlyUnlockedBadges.push(badge);
      totalXp += 100; // Builder bonus
    }
  }

  // 3. Polymath (4 habits)
  if (habits.length >= 4 && !currentAchievements.has('badge_polymath')) {
    currentAchievements.add('badge_polymath');
    const badge = BADGES_LIST.find(b => b.id === 'badge_polymath');
    if (badge) {
      newlyUnlockedBadges.push(badge);
      totalXp += 200;
    }
  }

  // 4. Streak 3 days
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  if (maxStreak >= 3 && !currentAchievements.has('streak_3_days')) {
    currentAchievements.add('streak_3_days');
    const badge = BADGES_LIST.find(b => b.id === 'streak_3_days');
    if (badge) {
      newlyUnlockedBadges.push(badge);
      totalXp += 150;
    }
  }

  // 5. Streak 10 days
  if (maxStreak >= 10 && !currentAchievements.has('streak_10_days')) {
    currentAchievements.add('streak_10_days');
    const badge = BADGES_LIST.find(b => b.id === 'streak_10_days');
    if (badge) {
      newlyUnlockedBadges.push(badge);
      totalXp += 500;
    }
  }

  // 6. Focus Initiated
  if (sessions.length >= 1 && !currentAchievements.has('deep_work_initiate')) {
    currentAchievements.add('deep_work_initiate');
    const badge = BADGES_LIST.find(b => b.id === 'deep_work_initiate');
    if (badge) {
      newlyUnlockedBadges.push(badge);
      totalXp += 100;
    }
  }

  // 7. Focus Legend (Sum minutes >= 60)
  const totalMinutes = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  if (totalMinutes >= 60 && !currentAchievements.has('deep_work_legend')) {
    currentAchievements.add('deep_work_legend');
    const badge = BADGES_LIST.find(b => b.id === 'deep_work_legend');
    if (badge) {
      newlyUnlockedBadges.push(badge);
      totalXp += 300;
    }
  }

  const calculatedLevelBefore = Math.floor(profile.xp / 200) + 1;
  const calculatedLevelAfter = Math.floor(totalXp / 200) + 1;

  // 8. Level 5 Archon
  if (calculatedLevelAfter >= 5 && !currentAchievements.has('level_5_archon')) {
    currentAchievements.add('level_5_archon');
    const badge = BADGES_LIST.find(b => b.id === 'level_5_archon');
    if (badge) {
      newlyUnlockedBadges.push(badge);
      totalXp += 500;
    }
  }

  const finalLevel = Math.floor(totalXp / 200) + 1;

  const updatedProfile: UserProfile = {
    ...profile,
    xp: totalXp,
    level: finalLevel,
    achievements: Array.from(currentAchievements),
    updatedAt: new Date().toISOString(),
  };

  return {
    updatedProfile,
    newlyUnlockedBadges,
  };
}
