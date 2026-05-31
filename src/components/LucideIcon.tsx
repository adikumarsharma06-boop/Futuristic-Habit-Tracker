/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AVAILABLE_HABIT_ICONS = [
  { name: 'Brain', label: 'Mind & Focus' },
  { name: 'Dumbbell', label: 'Exercise & Core' },
  { name: 'Code2', label: 'Programming & Work' },
  { name: 'Heart', label: 'Health & Vitals' },
  { name: 'Smile', label: 'Mental Wellness' },
  { name: 'Compass', label: 'Exploration' },
  { name: 'BookOpen', label: 'Reading & Study' },
  { name: 'Sparkles', label: 'Creation' },
  { name: 'Droplet', label: 'Hydration' },
  { name: 'Apple', label: 'Nutrition' },
  { name: 'Users', label: 'Social Bond' },
  { name: 'Target', label: 'Weekly Goals' },
  { name: 'Briefcase', label: 'Business & Tasks' },
  { name: 'Calendar', label: 'Schedule' },
  { name: 'Flame', label: 'Streak Power' },
  { name: 'Award', label: 'Achievements' },
  { name: 'Timer', label: 'Focus Timer' },
  { name: 'Book', label: 'Journaling' },
];

export default function LucideIcon({ name, className = '', size = 20 }: LucideIconProps) {
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a default target icon as fallback icon
    return <Icons.Target className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
