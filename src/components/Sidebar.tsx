/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Timer, BarChart3, Award, Info, Activity, User } from 'lucide-react';

export default function Sidebar() {
  const { currentView, setCurrentView, habits } = useApp();

  const navigationItems = [
    {
      id: 'dashboard' as const,
      label: 'Main Dashboard',
      subtitle: 'Habit Streams',
      icon: LayoutDashboard,
      color: 'text-cyan-400 group-hover:text-cyan-300',
    },
    {
      id: 'focus' as const,
      label: 'Focus Timer',
      subtitle: 'Deep Work Session',
      icon: Timer,
      color: 'text-violet-400 group-hover:text-violet-300',
    },
    {
      id: 'analytics' as const,
      label: 'System Analytics',
      subtitle: 'Streaks & Heatmap',
      icon: BarChart3,
      color: 'text-pink-400 group-hover:text-pink-300',
    },
    {
      id: 'badges' as const,
      label: 'Achievements',
      subtitle: 'Unlocked Badges',
      icon: Award,
      color: 'text-amber-400 group-hover:text-amber-300',
    },
    {
      id: 'profile' as const,
      label: 'My Secure Profile',
      subtitle: 'Neural Coordinator',
      icon: User,
      color: 'text-emerald-400 group-hover:text-emerald-300',
    },
  ];

  return (
    <>
      {/* DESKTOP/TABLET SIDE PANEL */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#0A0C14] border-r border-[#15192C] h-[calc(100vh-130px)] sticky top-[130px] p-4 justify-between" id="app-sidebar">
        <div className="flex flex-col gap-1.5">
          <div className="px-3.5 py-2 font-mono text-[10px] text-[#4E5472] uppercase tracking-widest font-bold">
            System Subsystems
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`group flex items-center justify-between w-full p-3.5 rounded-xl transition-all duration-300 text-left cursor-pointer border ${
                  isActive
                    ? 'bg-[#12162B] border-[#00F0FF]/25 text-[#ECEFF4] shadow-[0_0_12px_rgba(0,240,255,0.06)]'
                    : 'bg-transparent border-transparent text-[#6F7694] hover:bg-[#0D0F1B] hover:text-[#ECEFF4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-cyan-950/30' : 'bg-transparent'}`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold tracking-tight">{item.label}</span>
                    <span className="block text-[10px] font-mono text-[#4E5472] mt-0.5 group-hover:text-[#6F7694] transition-colors">{item.subtitle}</span>
                  </div>
                </div>
                {item.id === 'dashboard' && habits.length > 0 && (
                  <span className="bg-[#1A1F36] text-[10px] font-bold px-2 py-0.5 rounded-full text-[#6F7694] group-hover:bg-[#232A4B] transition-colors">
                    {habits.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Console info info section */}
        <div className="p-3 bg-gradient-to-b from-[#0B0D16] to-[#0E101D] border border-cyan-950/20 rounded-xl font-mono text-[10px] text-[#4E5472]">
          <div className="flex items-center gap-1.5 text-cyan-400 mb-1 font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            VITAL TELEMETRY
          </div>
          <div className="flex justify-between mt-1">
            <span>Core Host:</span>
            <span>Cloud Run</span>
          </div>
          <div className="flex justify-between">
            <span>Platform:</span>
            <span>AI Studio</span>
          </div>
          <div className="flex justify-between">
            <span>Buffer Sync:</span>
            <span className="text-emerald-500 font-bold">ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION TRACK */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#13172B] bg-[#07090F]/95 backdrop-blur-lg z-50 flex justify-around p-2" id="mobile-navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 p-2 min-h-[50px] flex-1 cursor-pointer transition-colors ${
                isActive ? 'text-[#00F0FF]' : 'text-[#6F7694]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium font-display tracking-tight leading-none mb-1">
                {item.label.split(' ')[0]} {/* shortened */}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#00F0FF] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
