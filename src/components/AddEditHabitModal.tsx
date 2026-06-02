/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Habit, HabitCategory } from '../types';
import { AVAILABLE_HABIT_ICONS } from './LucideIcon';
import LucideIcon from './LucideIcon';
import { X, Sparkles, LayoutGrid, Award } from 'lucide-react';

interface AddEditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit: Habit | null;
}

const CATEGORIES: { id: HabitCategory; label: string }[] = [
  { id: 'mind', label: 'Mind & Calmness' },
  { id: 'work', label: 'Programming & Work' },
  { id: 'fitness', label: 'Exercise & Core' },
  { id: 'health', label: 'Nutrition & Health' },
  { id: 'creative', label: 'Idea Creation' },
  { id: 'social', label: 'Social & Bonds' },
];

const CATEGORY_DETAILS: Record<HabitCategory, {
  label: string;
  defaultIcon: string;
  colorName: string;
  borderClass: string;
  textClass: string;
  bgClass: string;
  glowColor: string;
}> = {
  mind: {
    label: 'Mind & Calmness',
    defaultIcon: 'Brain',
    colorName: 'Cyan',
    borderClass: 'border-cyan-500/30',
    textClass: 'text-cyan-400',
    bgClass: 'bg-cyan-950/20',
    glowColor: 'rgba(6,182,212,0.15)',
  },
  work: {
    label: 'Programming & Work',
    defaultIcon: 'Code2',
    colorName: 'Violet',
    borderClass: 'border-violet-500/30',
    textClass: 'text-violet-400',
    bgClass: 'bg-violet-950/20',
    glowColor: 'rgba(139,92,246,0.15)',
  },
  fitness: {
    label: 'Exercise & Core',
    defaultIcon: 'Dumbbell',
    colorName: 'Rose',
    borderClass: 'border-rose-500/30',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-950/20',
    glowColor: 'rgba(244,63,94,0.15)',
  },
  health: {
    label: 'Nutrition & Health',
    defaultIcon: 'Heart',
    colorName: 'Emerald',
    borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-950/20',
    glowColor: 'rgba(16,185,129,0.15)',
  },
  creative: {
    label: 'Idea Creation',
    defaultIcon: 'Sparkles',
    colorName: 'Pink',
    borderClass: 'border-pink-500/30',
    textClass: 'text-pink-400',
    bgClass: 'bg-pink-950/20',
    glowColor: 'rgba(236,72,153,0.15)',
  },
  social: {
    label: 'Social & Bonds',
    defaultIcon: 'Users',
    colorName: 'Amber',
    borderClass: 'border-amber-500/30',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-950/20',
    glowColor: 'rgba(245,158,11,0.15)',
  },
};

export default function AddEditHabitModal({ isOpen, onClose, habitToEdit }: AddEditHabitModalProps) {
  const { createHabit, editHabit } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('mind');
  const [selectedIcon, setSelectedIcon] = useState('Brain');
  const [weeklyGoal, setWeeklyGoal] = useState<number>(5);

  // Sync state if edit form loaded
  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setDescription(habitToEdit.description);
      setCategory(habitToEdit.category);
      setSelectedIcon(habitToEdit.icon);
      setWeeklyGoal(habitToEdit.weeklyGoal || 5);
    } else {
      setName('');
      setDescription('');
      setCategory('mind');
      setSelectedIcon('Brain');
      setWeeklyGoal(5);
    }
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (habitToEdit) {
      // Edit mode
      const updated: Habit = {
        ...habitToEdit,
        name: name.trim(),
        description: description.trim(),
        category,
        icon: selectedIcon,
        weeklyGoal,
        updatedAt: new Date().toISOString(),
      };
      await editHabit(updated);
    } else {
      // Add mode
      await createHabit(name.trim(), description.trim(), category, selectedIcon, weeklyGoal);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#04060C]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="relative max-w-lg w-full bg-[#0B0D18] border border-cyan-500/20 rounded-3xl p-5 md:p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)] my-auto max-h-[92vh] overflow-y-auto custom-scrollbar"
        id="add-edit-habit-modal"
      >
        {/* Glow visual line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-[#8A2BE2]"></div>

        {/* Header bar and close */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-lg text-[#ECEFF4] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {habitToEdit ? 'Calibrate Tracker Stream' : 'Deploy new Habit stream'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#1C1F3A] rounded-lg text-[#6F7694] hover:text-[#ECEFF4] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-[10px] uppercase font-mono text-[#545B83] font-bold mb-1.5">HABIT NAME</label>
            <input
              type="text"
              required
              placeholder="e.g. Diaphragmatic Deep Breathing"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-sm py-2 px-3 rounded-xl bg-[#0F1122] border border-[#23284B] focus:border-cyan-400 focus:outline-none text-[#ECEFF4]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-[#545B83] font-bold mb-1.5 font-bold">CONTEXT DETAILS (INSTRUCTION)</label>
            <textarea
              placeholder="Provide a clear, brief daily goal description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full text-sm py-2 px-3 rounded-xl bg-[#0F1122] border border-[#23284B] focus:border-cyan-400 focus:outline-none text-[#ECEFF4]"
            />
          </div>

          {/* Interactive Weekly Goal selection */}
          <div className="space-y-1.5" id="weekly-quota-component">
            <div className="flex justify-between items-center font-mono">
              <label id="weekly-goal-label" className="text-[10px] uppercase text-[#545B83] font-bold">
                WEEKLY TARGET QUOTA (GOAL)
              </label>
              <span id="weekly-goal-value" className="text-[9px] text-[#00F0FF] uppercase tracking-wider font-bold">
                {weeklyGoal} {weeklyGoal === 1 ? 'day' : 'days'} / week target
              </span>
            </div>
            <div className="flex gap-2" id="weekly-goal-buttons-container">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = weeklyGoal === num;
                return (
                  <button
                    key={num}
                    type="button"
                    id={`weekly-goal-${num}x`}
                    onClick={() => setWeeklyGoal(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition duration-150 border cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                        : 'bg-[#0F1122]/70 border-[#23284B] text-[#6F7694] hover:border-[#3a4170] hover:text-[#ECEFF4]'
                    }`}
                  >
                    {num}d
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Category Selection Grid */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] uppercase font-mono text-[#545B83] font-bold">
                QUICK CATEGORY GRID SELECTION
              </label>
              <span className="text-[9px] font-mono text-[#00F0FF] uppercase tracking-wider">
                Sync / Toggle Colors & Icons
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {Object.entries(CATEGORY_DETAILS).map(([catId, catDetails]) => {
                const isSelectedCat = category === catId;
                const isSelectedIcon = selectedIcon === catDetails.defaultIcon;
                
                return (
                  <div
                    key={catId}
                    style={{
                      borderColor: isSelectedCat ? catDetails.textClass.replace('text-', '') : undefined,
                      boxShadow: isSelectedCat ? `0 0 10px ${catDetails.glowColor}` : 'none'
                    }}
                    className={`relative rounded-xl border p-2 flex flex-col justify-between transition-all duration-200 overflow-hidden ${
                      isSelectedCat 
                        ? `${catDetails.bgClass} border-current` 
                        : 'bg-[#0F1122]/70 border-[#23284B] hover:border-[#3a4170]'
                    }`}
                  >
                    {/* Top indicator bar */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[8px] font-mono tracking-wider font-bold uppercase transition ${isSelectedCat ? catDetails.textClass : 'text-[#6F7694]'}`}>
                        {catId}
                      </span>
                      <div className="flex gap-1">
                        {isSelectedCat && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelectedCat ? catDetails.textClass.replace('text-', 'bg-') : 'bg-[#545B83]'} animate-pulse`} />
                        )}
                        {isSelectedIcon && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </div>
                    </div>

                    {/* Central Button: Sync both */}
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(catId as HabitCategory);
                        setSelectedIcon(catDetails.defaultIcon);
                      }}
                      className="text-left py-1 hover:opacity-90 transition-all focus:outline-none cursor-pointer w-full"
                      title="Sync both category color and matching icon"
                    >
                      <p className="text-[11px] font-bold text-[#ECEFF4] line-clamp-1 truncate">
                        {catDetails.label}
                      </p>
                    </button>

                    {/* Quick Toggles below */}
                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[#1C1F37]/50 gap-1 select-none">
                      {/* Set category color only */}
                      <button
                        type="button"
                        onClick={() => setCategory(catId as HabitCategory)}
                        className={`text-[9px] font-mono px-1 py-0.5 rounded hover:bg-[#121427] transition cursor-pointer flex items-center gap-1 ${
                          isSelectedCat ? catDetails.textClass : 'text-[#9FA8C7] hover:text-[#ECEFF4]'
                        }`}
                        title={`Select color: ${catDetails.colorName}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelectedCat ? catDetails.textClass.replace('text-', 'bg-') : 'bg-[#545B83]'}`} />
                        Color
                      </button>

                      {/* Set icon only */}
                      <button
                        type="button"
                        onClick={() => setSelectedIcon(catDetails.defaultIcon)}
                        className={`text-[9px] font-mono px-1 py-0.5 rounded hover:bg-[#121427] transition cursor-pointer flex items-center gap-1 ${
                          isSelectedIcon ? 'text-cyan-400' : 'text-[#6F7694] hover:text-[#ECEFF4]'
                        }`}
                        title={`Select default icon: ${catDetails.defaultIcon}`}
                      >
                        <LucideIcon name={catDetails.defaultIcon} size={10} className={isSelectedIcon ? 'text-cyan-400' : 'text-[#6F7694]'} />
                        Icon
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Fallback Selector for precision or manual tweaks */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-[#545B83] font-bold mb-1.5">MANUAL TYPE OVERRIDE</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as HabitCategory)}
                className="w-full text-xs py-2 px-3 rounded-xl bg-[#0F1122] border border-[#23284B] text-[#ECEFF4] focus:outline-none focus:border-cyan-400"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0B0D18] text-[#ECEFF4] capitalize">{c.label}</option>
                ))}
              </select>
            </div>

            {/* Current Active Preview */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-[#545B83] font-bold mb-1.5">CURRENT SELECTION STYLE</label>
              <div className={`flex items-center gap-3 p-2 border rounded-xl h-[38px] transition bg-[#121427]/60 ${
                CATEGORY_DETAILS[category]?.borderClass || 'border-[#23284B]'
              }`}>
                <div className={`p-1.5 rounded-lg ${CATEGORY_DETAILS[category]?.textClass || 'text-cyan-400'} ${CATEGORY_DETAILS[category]?.bgClass || 'bg-cyan-950/40'}`}>
                  <LucideIcon name={selectedIcon} size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-[#A0A6C0] leading-tight">
                    {selectedIcon} <span className="text-[8px] uppercase tracking-wider text-[#6F7694]">({category})</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive grid of available icons */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-[#545B83] font-bold mb-1.5 flex items-center gap-1">
              <LayoutGrid className="w-3.5 h-3.5" />
              SELECT CORE AVATAR/ICON
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-1.5 bg-[#0F1122] border border-[#23284B] rounded-2xl max-h-[140px] overflow-y-auto pr-1">
              {AVAILABLE_HABIT_ICONS.map((ico) => {
                const isActive = selectedIcon === ico.name;
                return (
                  <button
                    key={ico.name}
                    type="button"
                    title={ico.label}
                    onClick={() => setSelectedIcon(ico.name)}
                    className={`aspect-square rounded-xl border flex items-center justify-center transition cursor-pointer hover:bg-cyan-950/20 ${
                      isActive
                        ? 'bg-[#15122B] border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.2)] scale-[1.05]'
                        : 'bg-transparent border-[#1E233E] text-[#6F7694]'
                    }`}
                  >
                    <LucideIcon name={ico.name} size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-[#4E5472] font-mono text-center">
            {habitToEdit ? 'UPDATING SEQUENCE INTEGRITY' : 'GRANTS +50 XP ARCHITECT BONUS'}
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#23284B] hover:border-[#6F7694] text-xs font-semibold text-[#A0A6C0] cursor-pointer hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-xs font-semibold bg-[#00F0FF] hover:bg-cyan-400 text-black cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:shadow-[0_0_18px_rgba(0,240,255,0.4)] transition"
            >
              {habitToEdit ? 'Save Parameter' : 'Deploy Stream'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
