/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import FocusTimerView from './components/FocusTimerView';
import AnalyticsView from './components/AnalyticsView';
import BadgesView from './components/BadgesView';
import ProfileView from './components/ProfileView';
import BadgeUnlockModal from './components/BadgeUnlockModal';
import DailyReminderTracker from './components/DailyReminderTracker';
import AppLoader from './components/AppLoader';
import AuthGate from './components/AuthGate';
import AccountInitLoader from './components/AccountInitLoader';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap } from 'lucide-react';

function AppContent() {
  const { currentView, loading, userProfile } = useApp();
  const [initLoaderDone, setInitLoaderDone] = React.useState(false);

  // Auto-reset account initialization loader on signOut
  React.useEffect(() => {
    if (!userProfile) {
      setInitLoaderDone(false);
    }
  }, [userProfile]);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'focus':
        return <FocusTimerView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'badges':
        return <BadgesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  // If user profile is not authenticated, protect workspace container
  if (!userProfile) {
    return <AuthGate />;
  }

  // When authenticated, run the beautiful Account Sync/Preparation loading bar animation first
  if (!initLoaderDone) {
    return (
      <AccountInitLoader 
        userProfile={userProfile} 
        onComplete={() => setInitLoaderDone(true)} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] pb-20 md:pb-0" id="app-root-container">
      {/* Header bar */}
      <Header />

      {/* Main Core section */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto relative">
        {/* Navigation Sidebar Drawer */}
        <Sidebar />

        {/* Dynamic content pane */}
        <main className="flex-1 overflow-x-hidden relative" id="main-content-pane">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* High-tech achievement notifications popup */}
      <BadgeUnlockModal />

      {/* Cybernetic Temporal Notification System */}
      <DailyReminderTracker />
    </div>
  );
}

export default function HabitTrackerApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
