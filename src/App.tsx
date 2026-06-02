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
import AuthGate, { SynapseLogo } from './components/AuthGate';
import AccountInitLoader from './components/AccountInitLoader';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap, Lock, Unlock, ShieldCheck, Key } from 'lucide-react';

function AppContent() {
  const { currentView, loading, userProfile, loginAsGuest } = useApp();
  const [initLoaderDone, setInitLoaderDone] = React.useState(false);
  const [hasSignedOut, setHasSignedOut] = React.useState(false);
  const wasLoggedIn = React.useRef(false);

  // States for 'Sign In Again' via profile lock screen
  const [isReAuthenticating, setIsReAuthenticating] = React.useState(false);
  const [againPassInput, setAgainPassInput] = React.useState('');
  const [againErrorText, setAgainErrorText] = React.useState<string | null>(null);
  const [againSuccessText, setAgainSuccessText] = React.useState<string | null>(null);

  // Screen lock authorization state
  const [isUnlocked, setIsUnlocked] = React.useState(() => {
    const savedLockPass = localStorage.getItem('google_sync_lock_password');
    return !savedLockPass; // If no password is set, it's unlocked immediately
  });
  const [lockPassInput, setLockPassInput] = React.useState('');
  const [lockErrorText, setLockErrorText] = React.useState<string | null>(null);

  // Sync state changes from Google Sync Modal credential changes
  React.useEffect(() => {
    const handleSyncCredentialsUpdated = () => {
      const hasPassword = localStorage.getItem('google_sync_lock_password');
      if (!hasPassword) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    };
    window.addEventListener('google_sync_credentials_updated', handleSyncCredentialsUpdated);
    return () => {
      window.removeEventListener('google_sync_credentials_updated', handleSyncCredentialsUpdated);
    };
  }, []);

  // Auto-reset account initialization loader on signOut and register sign-out action
  React.useEffect(() => {
    if (userProfile) {
      wasLoggedIn.current = true;
    } else {
      if (wasLoggedIn.current) {
        setHasSignedOut(true);
      }
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

  const handleReAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgainErrorText(null);
    setAgainSuccessText(null);

    const savedLockPass = localStorage.getItem('google_sync_lock_password');
    const userEnteredCode = againPassInput.trim();
    
    // Check if entered code matches. If no custom passcode is set, support 'sandbox' or empty bypass
    const isMatched = savedLockPass 
      ? userEnteredCode === savedLockPass.trim()
      : (userEnteredCode === 'sandbox' || userEnteredCode === 'admin' || userEnteredCode === '');

    if (isMatched) {
      setAgainSuccessText("SYNAPSE COHERENT: RESTORING SECURE ACCESS MATRIX...");
      try {
        await loginAsGuest();
        setHasSignedOut(false);
        setIsUnlocked(true);
        setIsReAuthenticating(false);
        setAgainPassInput('');
        setAgainErrorText(null);
        setAgainSuccessText(null);
      } catch (err: any) {
        setAgainErrorText(`SYS-GATEWAY SYSTEM FAULT: ${err.message || 'Authentication error.'}`);
      }
    } else {
      setAgainErrorText("INVALID LOCK SYSPASS DECRYPT KEY: Workspace shield remain blocked.");
      setAgainPassInput('');
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  // If the user has a Google Sync Lock password defined, show the security lock screen first
  if (!isUnlocked) {
    const syncedEmail = localStorage.getItem('google_sync_email') || 'Sync Matrix Profile';
    const syncedName = localStorage.getItem('google_sync_name') || 'Google User';

    const handleUnlockSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const actualPassword = localStorage.getItem('google_sync_lock_password');
      if (lockPassInput === actualPassword) {
        setIsUnlocked(true);
        setLockErrorText(null);
      } else {
        setLockErrorText("INVALID DECRYPT KEY: Workspace shield barrier remains active.");
        setLockPassInput('');
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090E] relative overflow-hidden" id="app-workspace-lock-screen">
        {/* Futuristic abstract glowing grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-violet-600 to-cyan-500 animate-[pulse_3s_infinite]" />
        
        {/* Soft background light blooms */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Lock Screen Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative w-full max-w-md bg-[#0C0F1E] border border-cyan-500/25 rounded-3xl p-8 md:p-10 shadow-[0_15px_60px_rgba(0,240,255,0.15)] mx-4 z-10"
        >
          {/* Cyan pulsing activity indicator dot top-right */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/35">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest leading-none">SYS_SECURE</span>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Elegant Spinning Custom Quantum App Logo */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="mb-6"
            >
              <SynapseLogo className="w-20 h-20 drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]" />
            </motion.div>

            {/* Shield lock header text */}
            <h1 className="text-lg font-display font-bold text-white tracking-widest uppercase mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400 animate-bounce" />
              Portal Access Lock
            </h1>
            <p className="text-[10px] font-mono text-[#6F7694] uppercase tracking-wider mb-6">
              RE-VERIFICATION ENCOUNTERED
            </p>

            {/* Linked account context info badge */}
            <div className="w-full bg-[#05070D]/90 border border-cyan-950/60 rounded-2xl p-3.5 mb-6 text-left space-y-1">
              <span className="text-[8px] font-mono text-[#4E5472] uppercase tracking-widest block font-bold">
                SECURE PROFILE ANCHOR
              </span>
              <div className="text-xs font-mono text-cyan-300 font-bold tracking-tight truncate">
                {syncedName}
              </div>
              <div className="text-[10px] text-[#8C93B2] truncate font-sans">
                {syncedEmail}
              </div>
            </div>

            {/* Lock entry input verification form */}
            <form onSubmit={handleUnlockSubmit} className="w-full space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1">
                  ENTER PORTAL PASSCODE
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cyan-500/60" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={lockPassInput}
                    onChange={(e) => setLockPassInput(e.target.value)}
                    placeholder="Input unlock password..."
                    className="w-full bg-[#05060A]/95 border border-cyan-500/20 focus:border-cyan-500 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] rounded-xl py-3 pl-11 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                  />
                </div>
              </div>

              {/* Error feedback badge */}
              <AnimatePresence>
                {lockErrorText && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-xl text-[10px] font-mono text-red-300 text-left flex items-start gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                    <span>{lockErrorText}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm submit action */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:brightness-105 active:scale-[0.98] text-black text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_15px_rgba(0,240,255,0.2)]"
              >
                <ShieldCheck className="w-4 h-4" />
                DECRYPT & UNLOCK WORKSPACE
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // If user signed out, display ONLY the application logo and its kinetic orbital animations
  if (hasSignedOut) {
    const hasSavedPasscode = !!localStorage.getItem('google_sync_lock_password');
    const savedName = localStorage.getItem('google_sync_name') || 'Futuristic Explorer';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#08090C] relative overflow-hidden" id="signed-out-screen">
        {/* Cyberpunk ambient scanning glow in the background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center max-w-sm px-6 relative z-10">
          {/* Animated custom quantum-kinetic logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.25, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="mb-6"
          >
            <SynapseLogo className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          </motion.div>

          <AnimatePresence mode="wait">
            {!isReAuthenticating ? (
              <motion.div
                key="terminated-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  {/* Core system state text */}
                  <h2 className="text-lg font-display font-medium text-white tracking-widest uppercase mb-1 font-black">
                    Session Terminated
                  </h2>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-4">
                    SYS_LOCK: SECURE DISCONNECT COMPLETE
                  </span>
                  <p className="text-xs text-[#6F7694] leading-relaxed font-sans max-w-[300px] mx-auto">
                    Your local synaptic sequence has been encrypted and committed. Refreshes will re-initialize the matrix.
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={() => setIsReAuthenticating(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-95 text-black text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(0,240,255,0.2)]"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Sign In Again
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasSignedOut(false);
                      setIsUnlocked(true);
                    }}
                    className="w-full py-3 rounded-xl border border-[#222E5C] hover:border-[#354890] text-[#8C93B2] hover:text-white text-xs font-mono font-bold uppercase transition cursor-pointer"
                  >
                    Go Back to Join Screen
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reauth-form-block"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-[#0C1226]/60 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,240,255,0.1)] text-left"
              >
                <div className="mb-4">
                  <span className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase font-bold block mb-1">
                    Secure Re-Authentication Matrix
                  </span>
                  <p className="text-[11px] text-[#8C93B2] font-sans">
                    Restoring profile workspace lock for <strong className="text-cyan-300 font-mono font-normal">[{savedName}]</strong>.
                  </p>
                </div>

                <form onSubmit={handleReAuthSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-0.5 flex justify-between">
                      <span>ENTER SECURE CODE / KEY</span>
                      {hasSavedPasscode ? (
                        <span className="text-violet-400 text-[8px]">CUSTOM SECURE ACCESS ENABLED</span>
                      ) : (
                        <span className="text-cyan-400 text-[8px]">ENTER 'sandbox' TO RESUME ACCESS</span>
                      )}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50" />
                      <input
                        type="password"
                        required
                        autoFocus
                        value={againPassInput}
                        onChange={(e) => setAgainPassInput(e.target.value)}
                        placeholder="Insert security lock code..."
                        className="w-full bg-[#05060A]/95 border border-[#1E233E]/80 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                      />
                    </div>
                  </div>

                  {againErrorText && (
                    <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-xl text-[10px] font-mono text-red-300 flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" />
                      <span>{againErrorText}</span>
                    </div>
                  )}

                  {againSuccessText && (
                    <div className="p-2.5 bg-green-950/30 border border-green-500/20 rounded-xl text-[10px] font-mono text-green-300 animate-pulse">
                      {againSuccessText}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-[#1C213D] justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReAuthenticating(false);
                        setAgainPassInput('');
                        setAgainErrorText(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-[#222E5C] text-[10px] font-mono font-bold text-[#8A91B4] hover:text-white transition cursor-pointer"
                    >
                      ABORT
                    </button>
                    <button
                      type="submit"
                      className="px-4.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-black text-[10px] font-mono font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
                      Decrypt & Enter
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
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
