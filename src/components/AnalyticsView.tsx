/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, Calendar, Zap, Flame, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { HabitCategory } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#080B13]/95 border border-[#1E233E]/80 rounded-xl p-3 shadow-xl backdrop-blur-md font-mono text-[10px] space-y-1.5 z-50">
        <p className="text-[#ECEFF4] font-bold tracking-wider uppercase">{label}</p>
        <div className="space-y-1">
          <p className="text-[#00F0FF] flex justify-between gap-4">
            <span>Completions:</span>
            <span className="font-bold">{payload[0].value} checks</span>
          </p>
          {payload[1] && (
            <p className="text-pink-500 flex justify-between gap-4">
              <span>Consistency Rate:</span>
              <span className="font-bold">{payload[1].value}%</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const chartContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const barItemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 14
    }
  }
};

const heatmapContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.012
    }
  }
};

const heatmapCellVariants = {
  hidden: { scale: 0.3, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 12
    }
  }
};

export default function AnalyticsView() {
  const { habits, focusSessions } = useApp();

  const totalHabits = habits.length;

  // 1. CALCULATE CORE STATS
  const totalCompletions = habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
  
  // Max Streak
  const maxStreak = totalHabits > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  
  // Total Focus Minutes
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + (s.duration || 0), 0);

  // Today progress
  const todayStr = new Date().toISOString().split('T')[0];
  const completedTodayCount = habits.filter(h => h.completedDates?.includes(todayStr)).length;
  const todayCompletionPct = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  // Productivity Score: Today's percentage blended with streak modifiers
  const streakPct = Math.min(40, maxStreak * 4); // capping streak contribution to 40%
  const productivityScore = Math.min(100, Math.round((todayCompletionPct * 0.6) + streakPct));

  // 1b. CALCULATE LAST 4 WEEKS TREND DATA FOR RECHARTS
  const last4WeeksData = Array.from({ length: 4 }).map((_, weekIdx) => {
    const weeksAgo = 3 - weekIdx; // 3 matches oldest, 0 matches current week
    const startOffset = weeksAgo * 7 + 6;
    const endOffset = weeksAgo * 7;

    // Get all date strings for this specific 7-day window
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (endOffset + i));
      const dateStr = d.toISOString().split('T')[0];
      weekDates.push(dateStr);
    }

    // Comps
    let completions = 0;
    habits.forEach(h => {
      if (h.completedDates) {
        completions += h.completedDates.filter(d => weekDates.includes(d)).length;
      }
    });

    const maxPossible = totalHabits * 7;
    const rate = maxPossible > 0 ? Math.round((completions / maxPossible) * 100) : 0;

    let label = '';
    if (weeksAgo === 3) label = '3 Wks Ago';
    else if (weeksAgo === 2) label = '2 Wks Ago';
    else if (weeksAgo === 1) label = '1 Wk Ago';
    else label = 'Current Wk';

    return {
      name: label,
      completions,
      rate,
    };
  });

  // 2. BUILD WEEKLY COMPLETION STATISTICS (Monday to Sunday)
  const getDayNameShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., 'Mon'
  };

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  // Completions count per last 7 days
  const weeklyData = last7Days.map((dateStr) => {
    const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    const count = habits.filter(h => h.completedDates?.includes(dateStr)).length;
    return { dateStr, dayName, count };
  });

  const maxWeeklyCount = Math.max(1, ...weeklyData.map(d => d.count));

  // 3. GRAPH 30-DAY CHRONOS GRID MATRIX (Github-style Heatmap)
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const getHeatmapColor = (completionsForDay: number) => {
    if (completionsForDay === 0) return 'bg-[#151726]/40 border-[#23284B]/20 text-[#30364D]';
    if (completionsForDay === 1) return 'bg-[#002f35] border-cyan-950/40 text-cyan-500 shadow-[0_0_5px_rgba(0,47,53,0.3)]';
    if (completionsForDay === 2) return 'bg-[#005e6b] border-cyan-800/40 text-cyan-400 shadow-[0_0_8px_rgba(0,94,107,0.3)]';
    return 'bg-[#00F0FF] border-cyan-300/40 text-[#08090C] font-black shadow-[0_0_12px_rgba(0,240,255,0.4)]';
  };

  // 4. CATEGORY DISTRIBUTION
  const categoriesList: HabitCategory[] = ['mind', 'fitness', 'health', 'work', 'creative', 'social'];
  const categoryStats = categoriesList.map((cat) => {
    const habitsInCat = habits.filter(h => h.category === cat);
    const completionsInCat = habitsInCat.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);
    return {
      category: cat,
      count: habitsInCat.length,
      completions: completionsInCat
    };
  }).filter(c => c.count > 0);

  const totalCatCompletions = Math.max(1, categoryStats.reduce((sum, c) => sum + c.completions, 0));

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-6" id="analytics-container">
      
      {/* Upper header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-[#ECEFF4] tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-pink-500" />
          Neural telemetry Overview
        </h2>
        <p className="text-xs text-[#6F7694] mt-1 font-mono uppercase tracking-wider">
          Performance matrix analytics & habit consistency splits
        </p>
      </div>

      {/* Grid structure of metrics overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-4 text-center">
          <span className="block text-[10px] text-[#4E5472] uppercase font-mono font-bold">TOTAL COMPLETIONS</span>
          <span className="block text-2xl font-mono font-bold text-[#00F0FF] mt-1.5">{totalCompletions}</span>
          <span className="block text-[9px] text-[#6F7694] mt-0.5">Across all dynamic habits</span>
        </div>

        <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-4 text-center">
          <span className="block text-[10px] text-[#4E5472] uppercase font-mono font-bold">CURRENT MAX STREAK</span>
          <span className="block text-2xl font-mono font-bold text-amber-500 mt-1.5 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-amber-500" />
            {maxStreak}d
          </span>
          <span className="block text-[9px] text-[#6F7694] mt-0.5">Unbroken sequence records</span>
        </div>

        <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-4 text-center">
          <span className="block text-[10px] text-[#4E5472] uppercase font-mono font-bold">DEEP FOCUS MINUTES</span>
          <span className="block text-2xl font-mono font-bold text-violet-400 mt-1.5">{totalFocusMinutes}m</span>
          <span className="block text-[9px] text-[#6F7694] mt-0.5">Summed pomodoro sessions</span>
        </div>

        <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-4 text-center">
          <span className="block text-[10px] text-[#4E5472] uppercase font-mono font-bold">CALIBRATION GAIN</span>
          <span className="block text-2xl font-mono font-bold text-pink-500 mt-1.5">{productivityScore}%</span>
          <span className="block text-[9px] text-[#6F7694] mt-0.5">Integrated productivity index</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Completion distribution and general statistics */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Weekly Bar Chart */}
          <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-5">
            <h3 className="text-xs font-mono uppercase text-[#4E5472] tracking-wider mb-5 flex items-center gap-1.5 font-bold">
              <TrendingUp className="w-4 h-4 text-[#00F0FF]" />
              7-day performance calibration (Completions)
            </h3>

            {/* Bars container */}
            <motion.div 
              variants={chartContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex h-44 items-end justify-between px-3 pt-4 border-b border-[#1E233E]/50"
            >
              {weeklyData.map((d) => {
                const heightPct = (d.count / maxWeeklyCount) * 100;
                const isToday = d.dateStr === todayStr;
                return (
                  <motion.div 
                    key={d.dateStr} 
                    variants={barItemVariants}
                    className="flex flex-col items-center flex-1 group"
                  >
                    <span className="text-[10px] text-cyan-400 font-mono mb-1 bg-[#101323] px-1.5 py-0.5 rounded border border-[#1E233E] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.count} checked
                    </span>
                    <div className="w-6.5 bg-[#14172B] rounded-t-lg overflow-hidden h-32 relative font-sans">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                        className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${
                          isToday 
                            ? 'bg-gradient-to-t from-cyan-400 to-[#8A2BE2] shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                            : 'bg-gradient-to-t from-pink-500 to-violet-500'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-mono mt-2 font-bold ${isToday ? 'text-[#00F0FF]' : 'text-[#6F7694]'}`}>
                      {d.dayName}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Recharts Monthly Weekly Activity Trend Area Chart */}
          <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-5" id="monthly-trend-recharts-card">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-mono uppercase text-[#4E5472] tracking-wider flex items-center gap-1.5 font-bold">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                4-Week consistency trend (Last Month)
              </h3>
              <div className="flex gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-450 bg-[#00F0FF]"></span>Checks</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>Success Rate</span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-44 w-full mt-2" id="monthly-trend-recharts-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={last4WeeksData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F243E" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#4E5472" 
                    fontSize={10} 
                    fontFamily="ui-monospace, monospace"
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />
                  <YAxis 
                    stroke="#4E5472" 
                    fontSize={10} 
                    fontFamily="ui-monospace, monospace"
                    tickLine={false}
                    axisLine={false}
                    dx={-6}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#23284B', strokeWidth: 1 }} />
                  <Area 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#00F0FF" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCompletions)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    fillOpacity={0.3} 
                    fill="url(#colorRate)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 30-Day Chronos Git Heatmap Grid */}
          <div className="bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-5">
            <h3 className="text-xs font-mono uppercase text-[#4E5472] tracking-wider mb-4 flex items-center gap-1.5 font-bold">
              <Calendar className="w-4 h-4 text-pink-500" />
              INTEGRATED CONSISTENCY MATRIX (30-DAY HEATMAP)
            </h3>

            {/* Boxes grid */}
            <motion.div 
              variants={heatmapContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-10 gap-2 p-1 bg-[#090A11]/60 border border-[#16192C]/50 rounded-xl max-w-lg mx-auto md:mx-0"
            >
              {last30Days.map((dateStr) => {
                const completionsForDay = habits.filter(h => h.completedDates?.includes(dateStr)).length;
                const dateLabel = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <motion.div
                    key={dateStr}
                    variants={heatmapCellVariants}
                    title={`${dateLabel}: ${completionsForDay} check-ins`}
                    whileHover={{ scale: 1.15 }}
                    className={`aspect-square rounded-md border flex items-center justify-center text-[10px] font-mono font-bold cursor-help transition-all transform ${getHeatmapColor(completionsForDay)}`}
                  >
                    {new Date(dateStr).getDate()}
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="flex gap-4 items-center text-[10px] text-[#4E5472] font-mono mt-4 justify-end">
              <span>FADE</span>
              <div className="w-3 h-3 rounded bg-[#151726]/40 border border-[#23284B]/20"></div>
              <div className="w-3 h-3 rounded bg-[#002f35]"></div>
              <div className="w-3 h-3 rounded bg-[#005e6b]"></div>
              <div className="w-3 h-3 rounded bg-[#00F0FF] shadow-[0_0_5px_rgba(0,240,255,0.3)]"></div>
              <span>FULL POWER</span>
            </div>
          </div>

        </div>

        {/* Column 3: Category splits */}
        <div className="lg:col-span-1 bg-[#0B0C15] border border-[#1A1F36] rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase text-[#4E5472] tracking-wider flex items-center gap-1.5 font-bold">
            <Award className="w-4 h-4 text-violet-400" />
            Category Subsystem split
          </h3>

          {categoryStats.length > 0 ? (
            <div className="flex flex-col gap-4.5 mt-2">
              {categoryStats.map((stat) => {
                const pct = Math.round((stat.completions / totalCatCompletions) * 100);
                return (
                  <div key={stat.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="capitalize text-[#ECEFF4] font-medium">{stat.category}</span>
                      <span className="text-[#6F7694]" id={`cat-stats-${stat.category}`}>{stat.completions} checks ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#14172B] rounded-full overflow-hidden border border-[#1E233E]">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-[#8A2BE2] transition-all duration-700 ease-out" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-[#4E5472] border border-dashed border-[#1E233E]/50 rounded-xl font-mono text-xs flex flex-col items-center justify-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              <span>No habit telemetry tracked yet. Create habits & check in to populate splits.</span>
            </div>
          )}

          {/* Productivity insight prompt */}
          <div className="mt-auto p-3 bg-cyan-950/15 border border-cyan-900/40 rounded-xl">
            <span className="block text-[10px] font-mono text-cyan-400 uppercase font-black">AI HYPER-CORE INSIGHT:</span>
            <p className="text-xs text-[#A0A6C0] font-sans mt-1 leading-normal">
              {maxStreak > 4 
                ? "Your consistency thresholds are highly calibrated. Strengthen your Mind and Work vectors recursively to maintain elite mainframe status."
                : "Initiate daily minor checked items to establish steady synaptic bridges. Consistency outweights heavy micro bursts."}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
