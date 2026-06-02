/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Award, 
  Flame, 
  Compass, 
  Timer, 
  Target, 
  Sparkles, 
  Plus, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Info,
  ChevronRight,
  KeyRound,
  Copy,
  ShieldAlert,
  Mail,
  RefreshCw,
  Bell,
  Clock,
  Database,
  Cpu,
  Globe,
  Check,
  X,
  Key
} from 'lucide-react';
import { BADGES_LIST } from '../lib/badges';
import { SynapseLogo } from './AuthGate';

// Map icon string to Lucide React component
const iconMap = {
  Sparkles: Sparkles,
  Plus: Plus,
  Compass: Compass,
  Flame: Flame,
  Timer: Timer,
  Target: Target,
  Award: Award,
};

export default function ProfileView() {
  const { userProfile, updateUserProfileAction, resetPasswordAction, loginUser } = useApp();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // States for Google Account Sync engine
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('last_google_sync_time') || 'Never Synced';
  });

  // States for Google Account Sync Setup Modal Form
  const [showGoogleSyncModal, setShowGoogleSyncModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState(() => {
    return localStorage.getItem('google_sync_email') || userProfile?.email || '';
  });
  const [googleNameInput, setGoogleNameInput] = useState(() => {
    return localStorage.getItem('google_sync_name') || userProfile?.displayName || '';
  });
  const [googlePasswordInput, setGooglePasswordInput] = useState('');
  const [googleLockPassword, setGoogleLockPassword] = useState(() => {
    return localStorage.getItem('google_sync_lock_password') || '';
  });
  const [googleBackupCadence, setGoogleBackupCadence] = useState(() => {
    return localStorage.getItem('google_sync_cadence') || 'hourly';
  });
  const [googleSyncOptions, setGoogleSyncOptions] = useState(() => {
    try {
      const opts = localStorage.getItem('google_sync_options');
      return opts ? JSON.parse(opts) : { habits: true, focus: true, badges: true };
    } catch {
      return { habits: true, focus: true, badges: true };
    }
  });
  const [googleSyncStatusMsg, setGoogleSyncStatusMsg] = useState<string | null>(null);

  // States for Daily Habit Reminder coordination
  const [reminderEnabled, setReminderEnabled] = useState(() => {
    return localStorage.getItem('habit_reminder_enabled') === 'true';
  });
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('habit_reminder_time') || '18:00';
  });

  const updateReminderSettings = (enabledVal: boolean, timeVal: string) => {
    localStorage.setItem('habit_reminder_enabled', String(enabledVal));
    localStorage.setItem('habit_reminder_time', timeVal);
    localStorage.removeItem('habit_reminder_dismissed_date');
    
    setReminderEnabled(enabledVal);
    setReminderTime(timeVal);
    
    window.dispatchEvent(new Event('habit_settings_updated'));
  };

  const simulateReminderAlert = () => {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes() - 1;
    const hours = Math.floor((totalMinutes + 1440) % 1440 / 60);
    const mins = (totalMinutes + 1440) % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    const simulationTime = `${pad(hours)}:${pad(mins)}`;

    localStorage.setItem('habit_reminder_enabled', 'true');
    localStorage.setItem('habit_reminder_time', simulationTime);
    localStorage.removeItem('habit_reminder_dismissed_date');

    setReminderEnabled(true);
    setReminderTime(simulationTime);

    window.dispatchEvent(new Event('habit_settings_updated'));
  };

  // States for Password verification/generation engine
  const [passwordInput, setPasswordInput] = useState('');
  const [strengthScore, setStrengthScore] = useState(0); // 0 (none) to 4 (maximum)
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Analyze password strength whenever user typed pattern changes
  useEffect(() => {
    let score = 0;
    if (!passwordInput) {
      setStrengthScore(0);
      return;
    }
    if (passwordInput.length >= 10) score += 1;
    if (/[A-Z]/.test(passwordInput) && /[a-z]/.test(passwordInput)) score += 1;
    if (/[0-9]/.test(passwordInput)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordInput)) score += 1;
    setStrengthScore(score);
  }, [passwordInput]);

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 font-sans">
        <div className="text-sm font-mono text-cyan-400 capitalize bg-cyan-950/20 border border-cyan-800/40 p-4 rounded-xl leading-relaxed">
          ⚠ SECURE GATEWAY ERROR: Unable to load neural user coordinates.
        </div>
      </div>
    );
  }

  // Calculate level stats
  const nextLevelXpThreshold = 200;
  const currentXpProgress = userProfile.xp % nextLevelXpThreshold;
  const progressPercent = Math.min(Math.round((currentXpProgress / nextLevelXpThreshold) * 100), 100);
  const xpNeeded = nextLevelXpThreshold - currentXpProgress;

  // Sparkle animation triggers when a user's level increases
  const [showSparkles, setShowSparkles] = useState(false);
  const prevLevelRef = useRef<number>(userProfile.level);

  useEffect(() => {
    if (userProfile && userProfile.level > prevLevelRef.current) {
      setShowSparkles(true);
      prevLevelRef.current = userProfile.level;
      const timer = setTimeout(() => setShowSparkles(false), 3500);
      return () => clearTimeout(timer);
    } else if (userProfile && userProfile.level < prevLevelRef.current) {
      prevLevelRef.current = userProfile.level;
    }
  }, [userProfile?.level]);

  const triggerManualSparkleTest = () => {
    setShowSparkles(false);
    setTimeout(() => setShowSparkles(true), 50);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorText("DESIGNATOR PATH REQUIRED: Display Name cannot remain empty.");
      return;
    }

    setUpdating(true);
    setErrorText(null);
    setSuccess(false);

    try {
      // Pass the previous photoURL unchanged as avatar settings modification is disabled.
      await updateUserProfileAction(displayName.trim(), userProfile.photoURL || '');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "COGNITIVE OVERLOAD: Unable to update user endpoints.");
    } finally {
      setUpdating(false);
    }
  };

  // Generate a premium cyber strong password
  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"; 
    const lowercase = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%&*?+-=";
    const allChars = uppercase + lowercase + numbers + symbols;

    let generatedPassword = "";
    // Guarantee at least one of each to start strong
    generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
    generatedPassword += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest up to 16 characters
    for (let i = 0; i < 12; i++) {
      generatedPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Scramble the characters representing the neural matrix key
    const randomizedPassword = generatedPassword.split('').sort(() => 0.5 - Math.random()).join('');
    setPasswordInput(randomizedPassword);
    
    // Highlight generated action success
    setCopied(true);
    navigator.clipboard.writeText(randomizedPassword);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy password text directly to clipboard
  const handleCopyInputText = () => {
    if (!passwordInput) return;
    navigator.clipboard.writeText(passwordInput);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Send firebase real password reset email or log instructions triggers
  const triggerShieldKeyRequest = async () => {
    setResetLoading(true);
    setErrorText(null);
    setResetSuccessMsg(null);
    try {
      await resetPasswordAction(userProfile.email);
      setResetSuccessMsg(`COORDINATES DEPLOYED: A secure keys resetting link has been transmitted successfully to your Google Neural email account alignment: ${userProfile.email}.`);
    } catch (err: any) {
      console.error(err);
      setErrorText(`PROTOCOL FAIL: ${err.message || "Unable to route transmission."}`);
    } finally {
      setResetLoading(false);
    }
  };

  // Google Account Sync sequence
  const handleGoogleSync = async () => {
    setSyncing(true);
    setSyncSuccessMsg(null);
    setErrorText(null);
    try {
      // Trigger login / sync via Google account
      await loginUser();
      
      const nowStr = new Date().toLocaleString();
      localStorage.setItem('last_google_sync_time', nowStr);
      setLastSyncTime(nowStr);
      
      setSyncSuccessMsg(`GOOGLE DATABASE SYNC COMPLETE: Efficient high-fidelity sync established with your Google account cloud database matrix. All checked habits, timer history, and earned badges are fully synchronized.`);
      setTimeout(() => setSyncSuccessMsg(null), 8000);
    } catch (err: any) {
      console.error(err);
      setErrorText(`SYNC FAULT: ${err.message || "Failed to finalize sync coordinates."}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleGoogleSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) {
      setGoogleSyncStatusMsg("ERROR: Google account email address must match active coordinates.");
      return;
    }
    if (!googleNameInput.trim()) {
      setGoogleSyncStatusMsg("ERROR: Google account name matches are mandatory.");
      return;
    }
    if (!googlePasswordInput) {
      setGoogleSyncStatusMsg("ERROR: Account security credential shield-key is mandatory.");
      return;
    }

    setSyncing(true);
    setGoogleSyncStatusMsg("ESTABLISHING SYNAPSE INTERFACE SECURE UPLINK...");
    
    try {
      // Connect / re-verify through Google login
      await loginUser();

      const nowStr = new Date().toLocaleString();
      localStorage.setItem('last_google_sync_time', nowStr);
      setLastSyncTime(nowStr);

      // Save additional preferences to localStorage
      localStorage.setItem('google_sync_email', googleEmailInput.trim());
      localStorage.setItem('google_sync_name', googleNameInput.trim());
      localStorage.setItem('google_sync_lock_password', googleLockPassword.trim());
      localStorage.setItem('google_sync_cadence', googleBackupCadence);
      localStorage.setItem('google_sync_options', JSON.stringify(googleSyncOptions));

      // Trigger custom event so any active listeners like App.tsx update instantly
      window.dispatchEvent(new Event('google_sync_credentials_updated'));

      setSyncSuccessMsg(`GOOGLE DATABASE SYNC COMPLETE: Efficient high-fidelity sync established with Google Account name [${googleNameInput.trim()}] and email (${googleEmailInput.trim()}). Sync Cadence configured to [${googleBackupCadence.toUpperCase()}]. Active syncing categories: ${Object.entries(googleSyncOptions).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(', ')}.`);
      
      setGoogleSyncStatusMsg(null);
      setShowGoogleSyncModal(false);
      setTimeout(() => setSyncSuccessMsg(null), 8000);
    } catch (err: any) {
      console.error(err);
      setGoogleSyncStatusMsg(`SYNC GATEWAY FAULT: ${err.message || "Failed to finalize sync coordinates."}`);
    } finally {
      setSyncing(false);
    }
  };

  // Helper values for password strength visualization
  const getStrengthMeta = () => {
    switch (strengthScore) {
      case 1:
        return { text: "CRITICAL: EASILY COMPROMISED", color: "bg-red-500", textClass: "text-red-400" };
      case 2:
        return { text: "VULNERABLE: BASIC SECURITY MODE", color: "bg-amber-500", textClass: "text-amber-400" };
      case 3:
        return { text: "DEFENSIVE: ENCRYPTION RAMPING", color: "bg-blue-400", textClass: "text-blue-400" };
      case 4:
        return { text: "ULTRA MATHEMATICAL SHIELD LEVEL: SECURED", color: "bg-emerald-500", textClass: "text-[#00F0FF]" };
      default:
        return { text: "NO ENTROPY KEY PROVIDED", color: "bg-zinc-800", textClass: "text-[#5E6482]" };
    }
  };

  const currentStrength = getStrengthMeta();

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans px-2 md:px-4" id="premium-profile-view">
      
      {/* Visual Header Grid banner row */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B0F1C] to-[#0A0B14] border border-[#1E233E]/60 rounded-3xl p-6 md:p-8 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8 z-10">
          
          {/* App Logo Display Frame - completely replacing any avatar option */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-violet-600/20 rounded-2xl blur opacity-30" />
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-[#222E5C] bg-[#05060A] flex flex-col items-center justify-center p-3 select-none">
              <SynapseLogo className="w-16 h-16 drop-shadow-[0_0_12px_rgba(0,240,255,0.45)] group-hover:scale-105 transition duration-300" />
              {/* Static overlay indicating a locked cyber profile sync */}
              <div className="absolute inset-x-0 bottom-0 bg-black/85 py-1 text-center text-[8px] font-mono tracking-widest text-cyan-400 border-t border-cyan-800/25 uppercase font-medium">
                CORE SECURED
              </div>
            </div>
          </div>

          {/* User designations & Stats detail */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight">
                  {userProfile.displayName || "Explorer"}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURE COORDINATE
                </span>
              </div>
              <p className="text-xs font-mono text-[#6F7694]" style={{ wordBreak: 'break-all' }}>
                NEURAL ENDPOINT: {userProfile.email}
              </p>
            </div>

            {/* Level calibration indicator progress bar */}
            <div className="space-y-1.5 max-w-md mx-auto md:mx-0">
              <div className="flex justify-between items-center text-xs font-mono text-[#9FA8C7]">
                <div className="relative flex items-center">
                  <motion.span 
                    animate={showSparkles ? {
                      scale: [1, 1.25, 1],
                      textShadow: [
                        "0 0 0px rgba(0,240,255,0)",
                        "0 0 20px rgba(0,240,255,0.9)",
                        "0 0 0px rgba(0,240,255,0)"
                      ],
                      color: ["#9FA8C7", "#00F0FF", "#9FA8C7"]
                    } : {}}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    onClick={triggerManualSparkleTest}
                    className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-400 select-none relative"
                    title="Click to simulate Level Up Sparkle!"
                  >
                    <Zap className={`w-3.5 h-3.5 text-amber-400 ${showSparkles ? 'animate-bounce' : 'animate-pulse'}`} />
                    LEVEL {userProfile.level} COGNITIVE

                    {/* Sparkle Particles Burst */}
                    <AnimatePresence>
                      {showSparkles && (
                        <>
                          {[
                            { x: -28, y: -22, size: 11, delay: 0 },
                            { x: 32, y: -26, size: 13, delay: 0.1 },
                            { x: -38, y: 16, size: 9, delay: 0.2 },
                            { x: 38, y: 19, size: 11, delay: 0.05 },
                            { x: 5, y: -34, size: 15, delay: 0.15 },
                            { x: -48, y: -6, size: 10, delay: 0.25 },
                            { x: 48, y: -3, size: 9, delay: 0.3 },
                            { x: 0, y: 26, size: 12, delay: 0.12 }
                          ].map((pos, index) => (
                            <motion.div
                              key={index}
                              className="absolute pointer-events-none drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]"
                              initial={{ scale: 0, x: 0, y: 0, opacity: 1, rotate: 0 }}
                              animate={{ 
                                scale: [0, 1.4, 1.1, 0],
                                x: pos.x,
                                y: pos.y,
                                opacity: [0, 1, 1, 0],
                                rotate: [0, 180, 270, 360]
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ 
                                duration: 1.9, 
                                delay: pos.delay,
                                ease: "easeOut"
                              }}
                              style={{ 
                                width: pos.size, 
                                height: pos.size,
                                top: "50%",
                                left: "50%",
                                marginTop: -pos.size / 2,
                                marginLeft: -pos.size / 2
                              }}
                            >
                              <Sparkles className="w-full h-full text-cyan-300 fill-cyan-400/20" />
                            </motion.div>
                          ))}

                          {/* Expansion glow ring effect */}
                          <motion.div 
                            className="absolute rounded-full border border-cyan-400/40 select-none pointer-events-none"
                            initial={{ scale: 0.5, opacity: 1, width: "100%", height: "100%", top: 0, left: 0 }}
                            animate={{ scale: 2.3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                          />
                        </>
                      )}
                    </AnimatePresence>
                  </motion.span>
                </div>
                <span>{userProfile.xp} XP TOTAL</span>
              </div>
              <div className="h-2.5 bg-[#05060A] border border-[#1D223B] rounded-full overflow-hidden p-0.5" id="level-bar-background">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full" 
                />
              </div>
              <p className="text-[10px] font-mono text-[#6F7694] flex items-center gap-1">
                <Info className="w-3 h-3 text-cyan-400" />
                <span>Gain {xpNeeded} more XP to calibrate to level {userProfile.level + 1}.</span>
              </p>
            </div>
          </div>

          {/* Unlocked badges counters */}
          <div className="flex gap-4 p-4 bg-[#0A0C16] border border-[#1A1F36] rounded-2xl shrink-0 min-w-[120px] text-center justify-center group self-stretch md:self-auto flex-row md:flex-col">
            <div className="my-auto">
              <div className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 group-hover:scale-110 transition duration-300">
                {userProfile.achievements?.length || 0}
              </div>
              <div className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase mt-1">
                UNLOCKED CORES
              </div>
            </div>
            <div className="border-l md:border-l-0 md:border-t border-[#1C213D] mx-2 md:mx-0 md:my-2" />
            <div className="my-auto">
              <div className="text-3xl font-mono font-bold text-white group-hover:text-amber-400 transition duration-300">
                {Math.round(userProfile.xp / 100)}
              </div>
              <div className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase mt-1">
                SESSIONS SUM
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Form/Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column - Edit panel Form */}
        <div className="lg:col-span-7 space-y-6">

          {/* New Caret Card with Google Email Integration status */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="p-5 md:p-6 bg-[#0E1325] border border-[#222E5C] rounded-3xl relative overflow-hidden group/gcard cursor-pointer select-none"
            onClick={() => setShowGoogleSyncModal(true)}
            id="google-email-caret-card"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-800/40 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-inner group-hover/gcard:border-cyan-400 transition animate-pulse">
                  <Mail className="w-6 h-6" />
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-900/50 px-2 py-0.5 rounded-full font-bold">
                      Verified Sync
                    </span>
                    <span className="text-[8px] font-mono text-[#5E6482] uppercase ml-1">SYSTEM INSTANCE: LIVE</span>
                  </div>
                  <h3 className="text-sm font-display text-white mt-1.5 truncate pr-2 font-medium">
                    {userProfile.email}
                  </h3>
                  <p className="text-[10px] font-mono text-cyan-400 mt-1 uppercase flex items-center gap-1.5 font-bold">
                    {syncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        Synchronizing state now...
                      </>
                    ) : (
                      <>
                        <span>Click to Sync Google Account</span>
                        <span className="text-[#6F7694] font-normal font-sans tracking-tight">({lastSyncTime === 'Never Synced' ? lastSyncTime : `Synced: ${lastSyncTime}`})</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Secure caret icon indicating clickable link */}
              <div className="w-8 h-8 rounded-lg bg-[#05060A] border border-[#1D223B] flex items-center justify-center text-cyan-400 group-hover/gcard:translate-x-1 group-hover/gcard:bg-cyan-950 group-hover/gcard:border-cyan-800/40 transition shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>

            </div>
          </motion.div>

          <AnimatePresence>
            {syncSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="p-4 bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 font-mono text-xs rounded-2xl flex items-start gap-3 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
              >
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-400 block uppercase mb-0.5">SYNAPSE SECURE SYNCED</span>
                  {syncSuccessMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSaveProfile} className="bg-[#090B12]/80 border border-[#1C203E]/70 rounded-3xl p-6 md:p-8 space-y-5 relative">
            <h2 className="text-lg font-display font-medium text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              COGNIZANT DETAILS EDIT
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-cyan-500/20 to-transparent m-0" />

            <AnimatePresence mode="wait">
              {errorText && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-300 font-mono text-xs leading-relaxed"
                >
                  <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-400 block uppercase">UPDATE CRITICAL FAULT:</span>
                    {errorText}
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-emerald-300 font-mono text-xs leading-relaxed"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-400 block uppercase">DATA SYNCHRONIZATION ACCREDITED:</span>
                    Your neural profile attributes have been secured globally inside the database structure.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inputs - Display Name Only */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1">Explorer Designator (Display Name)</label>
                <input 
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Insert system identifier"
                  required
                  className="w-full bg-[#05060A]/80 border border-[#1E233E]/60 focus:border-cyan-500/50 rounded-xl py-3 px-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <button
              type="submit"
              disabled={updating}
              className="w-full py-3.5 mt-2 rounded-xl text-xs font-mono font-bold uppercase transition bg-gradient-to-r from-cyan-500 via-violet-500 to-[#8A2BE2] text-black shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:opacity-95 transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
            >
              {updating ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  UPLINKING COORDINATES...
                </span>
              ) : (
                <span>COMMIT COORDINATES DATA</span>
              )}
            </button>

          </form>

          {/* Temporal Notification System Settings Card */}
          <div className="bg-[#090B12]/80 border border-[#1C203E]/70 rounded-3xl p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-lg font-display font-medium text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400 animate-pulse" />
                TEMPORAL COORDINATE ALERTS (DAILY REMINDERS)
              </h2>
              <p className="text-xs text-[#6F7694] font-mono mt-1">
                Configure automated alert coordinates to remind you of uncompleted habits after specific milestones.
              </p>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />

            {/* Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Alert Enable Switch */}
              <div className="p-4 bg-[#05060A]/80 border border-[#1A1F36] rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#6F7694] uppercase block">ALERT STATUS</span>
                  <p className="text-[11px] text-[#8C93B2] mt-1 leading-normal">Toggle active monitoring sequence.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">
                    {reminderEnabled ? 'ONLINE' : 'STANDBY'}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateReminderSettings(!reminderEnabled, reminderTime)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 relative focus:outline-none cursor-pointer ${reminderEnabled ? 'bg-cyan-500' : 'bg-zinc-805 bg-zinc-800'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-all duration-300 ${reminderEnabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Reminder targetTime selection input */}
              <div className="p-4 bg-[#05060A]/80 border border-[#1A1F36] rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#6F7694] uppercase block">TARGET TIME</span>
                  <p className="text-[11px] text-[#8C93B2] mt-1 leading-normal">Specify alerts trigger hour.</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input 
                    type="time" 
                    value={reminderTime}
                    onChange={(e) => updateReminderSettings(reminderEnabled, e.target.value)}
                    className="flex-1 bg-[#05060A] border border-[#1E233E]/60 focus:border-cyan-500/50 rounded-lg p-1.5 text-center text-xs font-mono text-white outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Simulation Block */}
            <div className="p-4 bg-cyan-950/15 border border-cyan-800/20 rounded-2xl space-y-3">
              <div className="flex items-start gap-2.5 text-xs">
                <Info className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white font-mono uppercase block">SIMULATOR LINKWAY</span>
                  <p className="text-[11px] text-[#8A91B4] mt-0.5 leading-relaxed">
                    Instantly replicate target milestones. This forces the alert time to 1 minute ago, triggering our high-contrast uncompleted coordinates toast now.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={simulateReminderAlert}
                className="w-full py-2.5 rounded-xl border border-dashed border-cyan-800/50 hover:border-cyan-400 bg-cyan-950/30 text-cyan-400 font-mono text-xs font-bold uppercase transition hover:bg-cyan-950 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                SIMULATE TIME MILESTONE MET NOW
              </button>
            </div>
          </div>

          {/* Robust Cybernetic Strong Password Generation & Check Tool */}
          <div className="bg-[#090B12]/80 border border-[#1C203E]/70 rounded-3xl p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-lg font-display font-medium text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-violet-400 animate-pulse" />
                CYBERNETIC SHIELD KEY (STRONG PASSWORD SETUP)
              </h2>
              <p className="text-xs text-[#6F7694] font-mono mt-1">
                Configure mathematically sound protection matrices to ensure supreme lock security on data-saving services.
              </p>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-violet-500/20 to-transparent" />

            {/* Trigger password reset section */}
            <div className="bg-[#05060A]/80 p-4 border border-[#1A1F36] rounded-2xl space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white font-mono uppercase block">Active Transmission Gate</span>
                  <p className="text-xs text-[#8C93B2] mt-0.5 leading-relaxed">
                    Instantly request a state-grade password replacement trigger to protect database metrics cataloged under your Google account.
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={triggerShieldKeyRequest}
                disabled={resetLoading}
                className="w-full py-2.5 rounded-xl border border-cyan-800/60 bg-cyan-950/20 text-cyan-400 font-mono text-xs font-bold uppercase transition hover:bg-cyan-950 hover:border-cyan-400 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                {resetLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    DISPATCHING SECURE PROTOCOLS...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    SEND SECUREPASSWORD RECOVERY EMAIL
                  </>
                )}
              </button>

              <AnimatePresence>
                {resetSuccessMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl font-mono text-[11px] text-cyan-300 leading-normal"
                  >
                    {resetSuccessMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Checker & Generator Interactive Module */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1 leading-none">
                  <label className="text-[10px] font-mono tracking-widest text-[#6F7694] uppercase block">Test / Generate Safeguard Shield Key</label>
                  {passwordInput && (
                    <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-800/30 rounded px-1.5 py-0.2 uppercase">
                      Checked
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E5472]" />
                  <input 
                    type="text" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter or generate keys..."
                    className="w-full bg-[#05060A]/80 border border-[#1E233E]/60 focus:border-cyan-500/50 rounded-xl py-3 pl-10 pr-20 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                  />
                  {passwordInput && (
                    <button
                      type="button"
                      onClick={handleCopyInputText}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#10142A] hover:bg-[#1B2144] border border-[#222E5C] text-xs font-mono text-cyan-400 font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition cursor-pointer"
                    >
                      {copiedKey ? "COPIED" : "COPY"}
                    </button>
                  )}
                </div>
              </div>

              {/* Entropy progress strength indicator */}
              {passwordInput && (
                <div className="space-y-2 bg-[#05060A]/50 border border-[#161B30] p-3.5 rounded-2xl">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#6F7694]">KEY SHIELD STRENGTH:</span>
                    <span className={`font-bold ${currentStrength.textClass}`}>{currentStrength.text}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => {
                      const active = strengthScore >= step;
                      return (
                        <div 
                          key={step} 
                          className={`h-full rounded-full transition-all duration-300 ${
                            active ? currentStrength.color : 'bg-zinc-800'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Criteria indicator check lists */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-2 border-t border-[#161B30]/60 text-[9px] font-mono text-[#6F7694]">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${passwordInput.length >= 10 ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' : 'border-[#1E233E]'}`}>
                        ✓
                      </div>
                      <span className={passwordInput.length >= 10 ? 'text-[#8C93B2]' : ''}>At Least 10 Chars</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${/[A-Z]/.test(passwordInput) && /[a-z]/.test(passwordInput) ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' : 'border-[#1E233E]'}`}>
                        ✓
                      </div>
                      <span className={/[A-Z]/.test(passwordInput) && /[a-z]/.test(passwordInput) ? 'text-[#8C93B2]' : ''}>Caps & Lower Letters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${/[0-9]/.test(passwordInput) ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' : 'border-[#1E233E]'}`}>
                        ✓
                      </div>
                      <span className={/[0-9]/.test(passwordInput) ? 'text-[#8C93B2]' : ''}>Includes Numbers (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${/[^A-Za-z0-9]/.test(passwordInput) ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' : 'border-[#1E233E]'}`}>
                        ✓
                      </div>
                      <span className={/[^A-Za-z0-9]/.test(passwordInput) ? 'text-[#8C93B2]' : ''}>Includes Special Sym</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Instant strong password generator button */}
              <button
                type="button"
                onClick={generateStrongPassword}
                className="w-full py-3 rounded-xl border border-dashed border-[#222E5C] bg-[#0E1225]/40 text-xs font-mono text-[#9FA8C7] hover:border-cyan-500 hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-violet-400" />
                {copied ? "SECURE PASSWORD COPIED & READY ✓" : "GENERATE SECURE HIGH-ENTROPY PASSWORD"}
              </button>
            </div>
          </div>

        </div>

        {/* Right column - Achievements panel */}
        <div className="lg:col-span-5 bg-[#090B12]/80 border border-[#1C203E]/70 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-display font-medium text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-violet-400" />
            SYNAPSE SECURE BADGES
          </h2>
          <div className="w-full h-px bg-gradient-to-r from-violet-500/20 to-transparent" />

          <p className="text-xs text-[#6F7694] font-mono leading-relaxed">
            These system-earned cores quantify habit completion and timer metrics recorded inside Firestore:
          </p>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1" id="profile-achievements-scroller">
            {BADGES_LIST.map((badge) => {
              const isUnlocked = userProfile.achievements?.includes(badge.id);
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
              
              return (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
                    isUnlocked 
                      ? 'bg-[#0E1225] border-[#222E5C]/50 hover:border-[#354890]/85' 
                      : 'bg-[#05060A]/40 border-[#121626] opacity-60'
                  }`}
                >
                  {/* Badge visual orb */}
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center bg-gradient-to-br ${
                    isUnlocked ? badge.badgeColor : 'from-zinc-850 to-zinc-950 text-[#3C415E]'
                  }`}>
                    {isUnlocked ? (
                      <IconComponent className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#4E5472]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2.5">
                      <span className={`text-xs font-mono font-bold tracking-wide truncate ${
                        isUnlocked ? 'text-white' : 'text-[#5E6482]'
                      }`}>
                        {badge.title}
                      </span>
                      {isUnlocked ? (
                        <span className="text-[8px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 rounded px-1.5 py-0.2">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono text-[#5E6482]">
                          LOCKED
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] ${
                      isUnlocked ? 'text-[#8C93B2]' : 'text-[#4E5472]'
                    } mt-0.5 leading-normal`}>
                      {isUnlocked ? badge.description : `Requirement: ${badge.requirementDescription}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Google Account Connection and Fillup Form Modal */}
      <AnimatePresence>
        {showGoogleSyncModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoogleSyncModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal panel and form */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 22 }}
              className="relative w-full max-w-lg bg-[#090B15] border-2 border-cyan-500/30 rounded-3xl shadow-[0_20px_50px_rgba(0,240,255,0.25)] p-6 md:p-8 shrink-0 font-sans z-10 max-h-[92vh] overflow-y-auto custom-scrollbar my-auto"
              id="google-sync-coordination-modal"
            >
              {/* Top cyber scanline */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500" />

              {/* Header section with icons */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                    <Globe className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-medium text-white tracking-tight flex items-center gap-1.5 leading-none">
                      Connect Google Account Matrix
                    </h2>
                    <span className="text-[9px] font-mono text-[#6F7694] uppercase tracking-wider block mt-1">Setup Cloud Database Alignment</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleSyncModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#05060A] border border-[#1C203E]/80 flex items-center justify-center text-[#6F7694] hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/20 transition cursor-pointer"
                  title="Close Integration Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-cyan-500/20 to-transparent my-5" />

              <form onSubmit={handleGoogleSyncSubmit} className="space-y-5">
                {/* Visual info description */}
                <p className="text-xs text-[#8C93B2] leading-relaxed font-sans">
                  By configuring this coordination form, your workspace establishes continuous secure authorization with Google Cloud database. All tracked habits, local timers, levels, and unlocks survive browser clearing.
                </p>

                {/* Status alert message container */}
                {googleSyncStatusMsg && (
                  <div 
                    className={`p-3 rounded-xl border font-mono text-xs flex items-start gap-2.5 leading-relaxed ${
                      googleSyncStatusMsg.startsWith("ERROR") || googleSyncStatusMsg.includes("FAULT")
                        ? "bg-red-950/40 border-red-500/30 text-red-300" 
                        : "bg-cyan-950/40 border-cyan-800/45 text-cyan-300 animate-pulse"
                    }`}
                  >
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                    <div>{googleSyncStatusMsg}</div>
                  </div>
                )}

                {/* Input fields */}
                <div className="space-y-5">
                  
                  {/* PART 1: Google Account coordinates */}
                  <div className="space-y-3.5 bg-[#05060A]/50 p-4 border border-[#161B33] rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-3.5 bg-cyan-500 rounded-sm" />
                      <span className="text-[10px] font-mono tracking-widest text-[#8C93B2] uppercase font-bold">
                        PART 1: Google Account Identification
                      </span>
                    </div>

                    {/* Google Account Name */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1">
                        Google Account Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E5472]" />
                        <input 
                          type="text"
                          required
                          value={googleNameInput}
                          onChange={(e) => setGoogleNameInput(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-[#05060A]/95 border border-[#1E233E]/80 focus:border-cyan-500/50 rounded-xl py-2.5 pl-11 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                          id="google-sync-name-field"
                        />
                      </div>
                    </div>

                    {/* Google Gmail address */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1">
                        Google Account Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E5472]" />
                        <input 
                          type="email"
                          required
                          value={googleEmailInput}
                          onChange={(e) => setGoogleEmailInput(e.target.value)}
                          placeholder="e.g. yourname@gmail.com"
                          className="w-full bg-[#05060A]/95 border border-[#1E233E]/80 focus:border-cyan-500/50 rounded-xl py-2.5 pl-11 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                          id="google-sync-email-field"
                        />
                      </div>
                    </div>

                    {/* Account authorization credentials */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1 flex items-center justify-between">
                        <span>Sync Credential Key</span>
                        <span className="text-[8px] text-cyan-500/85 font-mono">Security connection key</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E5472]" />
                        <input 
                          type="password"
                          required
                          value={googlePasswordInput}
                          onChange={(e) => setGooglePasswordInput(e.target.value)}
                          placeholder="Insert authorization access key..."
                          className="w-full bg-[#05060A]/95 border border-[#1E233E]/80 focus:border-cyan-500/50 rounded-xl py-2.5 pl-11 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                          id="google-sync-password-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PART 2: Security App Lock Password */}
                  <div className="space-y-3.5 bg-[#05060A]/50 p-4 border border-[#161B33] rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-3.5 bg-violet-500 rounded-sm" />
                      <span className="text-[10px] font-mono tracking-widest text-[#8C93B2] uppercase font-bold">
                        PART 2: Create App Lock Security Password
                      </span>
                    </div>

                    <p className="text-[10px] text-[#6F7694] leading-relaxed mb-2 font-sans">
                      Establish an authorization security lock password. When password protection is set, returning users must input this password before launching the workspace. Leave empty to disable screen lock.
                    </p>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1 flex items-center justify-between">
                        <span>Set Workspace Lock Password</span>
                        <span className="text-[8px] text-violet-400 font-mono">Cyber barrier key</span>
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E5472]" />
                        <input 
                          type="password"
                          value={googleLockPassword}
                          onChange={(e) => setGoogleLockPassword(e.target.value)}
                          placeholder="Enter shield lock password (Optional)..."
                          className="w-full bg-[#05060A]/95 border border-[#1E233E]/80 focus:border-[#7C3AED]/50 rounded-xl py-2.5 pl-11 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                          id="google-sync-lock-password-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Synchronization Cadence selectors */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1">
                      Uplink Sync Cadence
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono col-span-1">
                      {[
                        { id: 'realtime', label: 'REALTIME', desc: 'Sync active' },
                        { id: 'hourly', label: 'HOURLY', desc: 'Every 60 min' },
                        { id: 'daily', label: 'DAILY', desc: 'Every 24 hours' }
                      ].map((cad) => (
                        <button
                          key={cad.id}
                          type="button"
                          onClick={() => setGoogleBackupCadence(cad.id)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer select-none ${
                            googleBackupCadence === cad.id
                              ? "bg-cyan-950/40 border-cyan-500/70 text-cyan-300"
                              : "bg-[#05060A]/80 border-[#1C203D]/60 text-[#6F7694] hover:border-[#1E233E] hover:border-cyan-800/40"
                          }`}
                        >
                          <span className="font-bold text-[10px]">{cad.label}</span>
                          <span className="text-[8px] opacity-70 mt-0.5">{cad.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sync Datatype Selector checkboxes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1">
                      ALIGNMENT CATEGORIES
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      {[
                        { key: 'habits', label: 'Habits', desc: 'Daily logs' },
                        { key: 'focus', label: 'Timer logs', desc: 'Minutes' },
                        { key: 'badges', label: 'Badges', desc: 'Achieve' }
                      ].map((item) => (
                        <div 
                          key={item.key}
                          onClick={() => setGoogleSyncOptions({
                            ...googleSyncOptions,
                            [item.key]: !googleSyncOptions[item.key as keyof typeof googleSyncOptions]
                          })}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center select-none cursor-pointer transition ${
                            googleSyncOptions[item.key as keyof typeof googleSyncOptions]
                              ? "bg-violet-950/20 border-violet-500/40 text-violet-300"
                              : "bg-[#05060A]/50 border-[#1C203D]/60 text-[#4E5472]"
                          }`}
                        >
                          <span className="font-bold text-[10px]">{item.label}</span>
                          <span className="text-[8px] opacity-70 mt-0.5">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#1C213D] justify-end">
                  <button
                    type="button"
                    onClick={() => setShowGoogleSyncModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#222E5C] text-xs font-mono font-bold text-[#8A91B4] hover:text-white hover:border-[#354890] transition cursor-pointer"
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    disabled={syncing}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-95 text-black text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
                    id="confirm-establish-google-sync-btn"
                  >
                    {syncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        SYNCING ENTROPY...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        ESTABLISH INTEGRATION
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
