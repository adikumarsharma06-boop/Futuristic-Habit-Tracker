/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HabitCategory = 'health' | 'fitness' | 'mind' | 'work' | 'creative' | 'social';

export interface HabitNote {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: HabitCategory;
  icon: string; // Lucide icon name
  streak: number;
  longestStreak: number;
  completedDates: string[]; // List of 'YYYY-MM-DD' strings
  notes: HabitNote[];
  weeklyGoal?: number; // How many times a week a habit should be completed
  createdAt: string; // ISO string or timestamp string
  updatedAt: string; // ISO string
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  xp: number;
  level: number;
  achievements: string[]; // Badge ID keys
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  category: string;
  completedAt: string; // ISO String
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirementDescription: string;
  type: 'streak' | 'habits_count' | 'timer' | 'xp_level';
  threshold: number;
  badgeColor: string; // Tailwind class
}

export interface Quote {
  text: string;
  author: string;
}
