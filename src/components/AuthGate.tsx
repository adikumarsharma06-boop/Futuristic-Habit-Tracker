/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Mail, Lock, User, Eye, EyeOff, Bot, Sparkles, Shield, AlertTriangle, Globe, Key, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Unique Custom Cyberpunk Animated Quantum Logo
export function SynapseLogo({ className = "w-24 h-24" }: { className?: string }) {
  // Let's design a beautifully complex futuristic orbital logo using Framer Motion
  return (
    <div className={`relative flex items-center justify-center ${className}`} id="quantum-kinetic-logo">
      {/* Futuristic dimensional backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-violet-500/10 blur-xl rounded-full scale-110 pointer-events-none" />
      
      {/* Orbit Track 1: Outer tilted elliptic ring (Clockwise rotation) */}
      <motion.div
        className="absolute w-full h-full text-cyan-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          {/* Ellipse tilted at 30 degrees */}
          <ellipse 
            cx="50" 
            cy="50" 
            rx="45" 
            ry="18" 
            stroke="currentColor" 
            strokeWidth="0.75" 
            transform="rotate(30 50 50)" 
            strokeDasharray="4 4" 
          />
          {/* Kinetic tracker dot traveling along the orbit */}
          <motion.circle
            cx="50"
            cy="50"
            r="1.5"
            className="fill-cyan-400 shadow-[0_0_8px_#00F0FF]"
            animate={{
              cx: [50 + 45 * Math.cos(0), 50 + 45 * Math.cos(Math.PI * 2)],
              cy: [50 + 18 * Math.sin(0), 50 + 18 * Math.sin(Math.PI * 2)]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            transform="rotate(30 50 50)"
          />
        </svg>
      </motion.div>

      {/* Orbit Track 2: Tilted elliptic ring (Counter-clockwise rotation) */}
      <motion.div
        className="absolute w-full h-full text-violet-400/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          {/* Inverse elliptic path */}
          <ellipse 
            cx="50" 
            cy="50" 
            rx="45" 
            ry="18" 
            stroke="currentColor" 
            strokeWidth="0.75" 
            transform="rotate(-30 50 50)" 
            strokeDasharray="6 2" 
          />
          {/* Floating node on inverse orbit */}
          <motion.circle
            cx="50"
            cy="50"
            r="2"
            className="fill-violet-400"
            animate={{
              cx: [50 + 45 * Math.cos(0), 50 + 45 * Math.cos(Math.PI * 2)],
              cy: [50 + 18 * Math.sin(0), 50 + 18 * Math.sin(Math.PI * 2)]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            transform="rotate(-30 50 50)"
          />
        </svg>
      </motion.div>

      {/* Orbit Track 3: Horizontal ring with multi-dot cluster */}
      <motion.div
        className="absolute w-[85%] h-[85%] text-pink-500/20"
        animate={{ rotate: 180 }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" />
        </svg>
      </motion.div>

      {/* Central Core: High-Tech Kinetic Nucleus */}
      <div className="relative w-[50%] h-[50%] flex items-center justify-center">
        {/* Pulsating core nebula */}
        <motion.div
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 bg-radial from-cyan-400/25 via-violet-500/10 to-transparent blur-md rounded-full"
        />

        {/* Floating geometric core rings */}
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" fill="none">
          {/* Hexagonal Core Shield */}
          <motion.polygon 
            points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" 
            stroke="url(#coreGradient)" 
            strokeWidth="2.5" 
            className="drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {/* Core pulsing dot cluster */}
          <circle cx="50" cy="50" r="10" className="fill-[#08090C] stroke-violet-500/60" strokeWidth="1.5" />
          
          <motion.circle 
            cx="50" 
            cy="50" 
            r="5" 
            className="fill-cyan-400"
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ type: "tween", duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.circle 
            cx="50" 
            cy="50" 
            r="8" 
            className="stroke-cyan-300 fill-none" 
            strokeWidth="0.75"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
            transition={{ type: "tween", duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Gradients Definitions */}
          <defs>
            <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#FF007F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default function AuthGate() {
  const { registerWithEmailAction, signInWithEmailAction, loginUser, loginAsGuest, isOffline, resetPasswordAction } = useApp();
  
  const [isOnboarding, setIsOnboarding] = useState(() => {
    // Show beautiful automated secure profile alignment on first launch
    return !localStorage.getItem('google_sync_email');
  });

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Onboarding parameters
  const [onboardName, setOnboardName] = useState('');
  const [onboardEmail, setOnboardEmail] = useState('');
  const [onboardPassword, setOnboardPassword] = useState('');
  const [onboardLockPassword, setOnboardLockPassword] = useState('');
  const [onboardCadence, setOnboardCadence] = useState('realtime');
  const [onboardSyncOptions, setOnboardSyncOptions] = useState({ habits: true, focus: true, badges: true });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (!onboardName.trim()) {
      setErrorText("Google Account Name coordinates are mandatory.");
      return;
    }
    if (!onboardEmail.trim()) {
      setErrorText("Google Account Email is mandatory.");
      return;
    }
    if (!onboardPassword || onboardPassword.length < 6) {
      setErrorText("Access key must contain at least 6 characters.");
      return;
    }

    const cleanEmail = onboardEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorText("ACCESS BLOCKED: INVALID NEURAL ADDRESS FORMAT.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create a core profile using email registration
      await registerWithEmailAction(cleanEmail, onboardPassword, onboardName.trim());

      // 2. Setup Google sync parameters in localStorage for real-time sync alignment
      localStorage.setItem('google_sync_email', cleanEmail);
      localStorage.setItem('google_sync_name', onboardName.trim());
      localStorage.setItem('google_sync_lock_password', onboardLockPassword.trim());
      localStorage.setItem('google_sync_cadence', onboardCadence);
      localStorage.setItem('google_sync_options', JSON.stringify(onboardSyncOptions));

      const nowStr = new Date().toLocaleString();
      localStorage.setItem('last_google_sync_time', nowStr);

      // Fire a sync coordinate update event
      window.dispatchEvent(new Event('google_sync_credentials_updated'));

      setSuccessText("SECURE NEURAL PROFILE PROVISIONED SUCCESSFULLY! LAUNCHING INTERFACE...");
    } catch (err: any) {
      console.error("Onboarding register error:", err);
      if (err.message && (err.message.includes("offline") || err.message.includes("network") || err.message.includes("internet") || String(err).includes("Firebase"))) {
        // Fallback to beautiful local guest sandbox database so the user is never stuck
        setErrorText("NETWORK DETACHED: Launching local secure guest workspace instead...");
        localStorage.setItem('google_sync_email', cleanEmail);
        localStorage.setItem('google_sync_name', onboardName.trim());
        localStorage.setItem('google_sync_lock_password', onboardLockPassword.trim());
        localStorage.setItem('google_sync_cadence', onboardCadence);
        localStorage.setItem('google_sync_options', JSON.stringify(onboardSyncOptions));
        
        window.dispatchEvent(new Event('google_sync_credentials_updated'));
        await loginAsGuest();
      } else {
        setErrorText(`REGISTRATION INTEGRITY REFUSED: ${err.message || "Failed to finalize auth credentials."}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOnboardingGuestSubmit = async () => {
    setErrorText(null);
    setSuccessText(null);

    const cleanEmail = onboardEmail.trim().toLowerCase() || 'sandbox@example.com';
    const cleanName = onboardName.trim() || 'Futuristic Explorer';

    setSubmitting(true);
    try {
      localStorage.setItem('google_sync_email', cleanEmail);
      localStorage.setItem('google_sync_name', cleanName);
      localStorage.setItem('google_sync_lock_password', onboardLockPassword.trim());
      localStorage.setItem('google_sync_cadence', onboardCadence);
      localStorage.setItem('google_sync_options', JSON.stringify(onboardSyncOptions));

      const nowStr = new Date().toLocaleString();
      localStorage.setItem('last_google_sync_time', nowStr);

      window.dispatchEvent(new Event('google_sync_credentials_updated'));
      await loginAsGuest();
    } catch (err: any) {
      setErrorText(`FAULT INITIALIZING SANDBOX: ${err.message || 'Verification Error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOnboardingGoogleSubmit = async () => {
    setErrorText(null);
    setSuccessText(null);
    setSubmitting(true);
    try {
      await loginUser();
      if (onboardLockPassword.trim()) {
        localStorage.setItem('google_sync_lock_password', onboardLockPassword.trim());
        window.dispatchEvent(new Event('google_sync_credentials_updated'));
      }
    } catch (err: any) {
      setErrorText(`GOOGLE PROVIDER MATRIX REFUSED: ${err.message || 'Handshake failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (isForgot) {
      if (!email) {
        setErrorText("AUTHENTICATION CRITERIA MISSING: EMAIL MANDATORY FOR RESET");
        return;
      }
      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setErrorText("ACCESS BLOCKED: INVALID NEURAL ADDRESS FORMAT.");
        return;
      }
      
      setSubmitting(true);
      try {
        await resetPasswordAction(cleanEmail);
        setSuccessText("PASSWORD RESET KEY CONVEYED. CHECK YOUR NEURAL INBOX FOR CODES.");
      } catch (err: any) {
        console.error(err);
        const code = err.code || err.message;
        if (code === 'auth/user-not-found') {
          setErrorText("INTEGRITY FAULT: NO REGISTERED PROFILE RECOGNIZED FOR THIS ADDRESS.");
        } else {
          setErrorText(`TRANSMISSION PROTOCOL FAILURE: ${err.message || "TIMEOUT"}`);
        }
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!email || !password) {
      setErrorText("AUTHENTICATION CRITERIA MISSING: EMAIL/KEY MANDATORY");
      return;
    }

    // Standard email validation check
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorText("ACCESS BLOCKED: INVALID NEURAL ADDRESS FORMAT. PLEASE PROVIDE A CORRECT EMAIL.");
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        await registerWithEmailAction(email, password, displayName);
        setSuccessText("SYNAPSE COGNIZANCE CREATED! BOOTING INTERFACE...");
      } else {
        await signInWithEmailAction(email, password);
        setSuccessText("SHIELD PROTOCOL ACCEPTED. INITIALIZING CHANNELS...");
      }
    } catch (err: any) {
      console.error(err);
      const code = err.code || err.message;
      if (code === 'auth/email-already-in-use') {
        setErrorText("REGISTRATION SHIELD ENCOUNTERED: EMAIL ADDRESS CURRENTLY ASSIGNED.");
      } else if (code === 'auth/weak-password') {
        setErrorText("KEY DEFICIENCY: PASSWORD MUST EXCEED 6 CHARACTERS.");
      } else if (code === 'auth/invalid-email') {
        setErrorText("STRUCTURE REFUSED: EMAIL COORDINATES ARE INVALID.");
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorText("SECURITY THREAT: VERIFICATION PASSWORD CODE MISMATCH.");
      } else if (code === 'auth/user-not-found') {
        setErrorText("INTEGRITY FAULT: NO REGISTERED USER PROFILE CONFORMED.");
      } else {
        setErrorText(`UNEXPECTED RETRIEVAL FAULT: ${err.message || "TIMEOUT PROTOCOL"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-[#04060A] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans select-none" id="onboarding-gate-wrapper">
        {/* Sleek abstract space background */}
        <div className="absolute inset-0 bg-[radial-gradient(#141a2f_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-violet-600 to-cyan-500 animate-[pulse_3s_infinite]" />
        
        {/* Soft background glow hubs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Dynamic scanline overlay representing the pristine 'blank screen' core */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.01)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />

        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 my-auto items-center">
          {/* Left panel: Interactive cyber welcome alignment */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
          >
            <div className="flex flex-col items-center lg:items-start gap-3">
              <SynapseLogo className="w-20 h-20 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
              <h1 className="text-3xl font-display font-medium text-white tracking-widest uppercase mt-2">
                SYNAPSE CORE
              </h1>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.3em] font-bold">
                PERSISTENT ARCHITECTURE
              </span>
            </div>

            <div className="h-px w-24 bg-gradient-to-r from-cyan-500 via-violet-500 to-transparent" />

            <div className="space-y-4">
              <p className="text-sm text-[#8C93B2] leading-relaxed font-sans font-medium">
                Welcome to the modern, cyberpunk habit tracker app. To initialize your encrypted telemetry core, construct and align your <span className="text-[#00F0FF] font-semibold">Secure Profile Google Account Sync</span> below.
              </p>

              {/* Informative bullet point lists */}
              <div className="space-y-3.5 text-xs font-mono text-[#6F7694]">
                <div className="flex items-start gap-2 text-[#8C93B2]">
                  <span className="text-[#00F0FF] font-bold">●</span>
                  <span><strong>Automatic Database Sync</strong>: All checked habits, timer histories, XP levels, and rewards are continuously saved.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">●</span>
                  <span><strong>Workspace Shield Lock Option</strong>: Establish a bios lock passcode to protect your dashboard from local physical breaches.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">●</span>
                  <span><strong>Cross-Device Portability</strong>: Restore your habits perfectly on any modern gadget using your credentials.</span>
                </div>
              </div>
            </div>

            {/* Already configured toggle link */}
            <div className="pt-4 w-full">
              <button
                type="button"
                onClick={() => setIsOnboarding(false)}
                className="text-xs text-cyan-400 font-mono tracking-wider hover:text-cyan-300 font-bold uppercase transition flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none"
              >
                Already have a Synapse Node? Sign In →
              </button>
            </div>
          </motion.div>

          {/* Right panel: Full Google secure account sync form interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#090B13]/90 border border-[#1E233E]/70 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_15px_60px_rgba(0,240,255,0.15)] flex flex-col relative"
            id="google-onboarding-coordination-panel"
          >
            {/* Upper Cyber scanline */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 rounded-t-3xl" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h2 className="text-base font-display font-medium text-white tracking-tight leading-none uppercase">
                  Secure Profile Alignment Form
                </h2>
                <span className="text-[10px] font-mono text-[#6F7694] uppercase tracking-wider block mt-1">First-Time Google Cloud Synapse Provisioning</span>
              </div>
            </div>

            {/* Error alignment badges */}
            {errorText && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-300 font-mono text-xs leading-relaxed animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-red-400 block uppercase">INITIALIZATION ALERT:</span>
                  {errorText}
                </div>
              </div>
            )}

            {successText && (
              <div className="mb-4 p-3 bg-[#0d2e29]/40 border border-[#00f576]/20 rounded-xl flex items-start gap-2 text-[#00f576] font-mono text-xs leading-relaxed animate-pulse">
                <Shield className="w-4 h-4 text-[#00f576] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#00f576] block uppercase">SYNAPSE DETECTED:</span>
                  {successText}
                </div>
              </div>
            )}

            {/* The multi-step alignment form */}
            <form onSubmit={handleOnboardingSubmit} className="space-y-3.5">
              
              {/* Profile setup section */}
              <div className="space-y-3 bg-[#05060A]/80 p-3.5 border border-[#161B30] rounded-2xl">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1.5 h-3.5 bg-cyan-500 rounded-sm" />
                  <span className="text-[10px] font-mono tracking-widest text-[#8C93B2] uppercase font-bold">
                    STEP 1: Google Account coordinates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Account Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-0.5">
                      Secure Profile Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5472]" />
                      <input 
                        type="text"
                        required
                        value={onboardName}
                        onChange={(e) => setOnboardName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-[#05060A]/95 border border-[#1E233E]/90 focus:border-cyan-500 rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-150"
                      />
                    </div>
                  </div>

                  {/* Google Account Email */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-0.5">
                      Gmail Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5472]" />
                      <input 
                        type="email"
                        required
                        value={onboardEmail}
                        onChange={(e) => setOnboardEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-[#05060A]/95 border border-[#1E233E]/90 focus:border-cyan-500 rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-150"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Password */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-0.5">
                    Secure Account password code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5472]" />
                    <input 
                      type="password"
                      required
                      value={onboardPassword}
                      onChange={(e) => setOnboardPassword(e.target.value)}
                      placeholder="Insert credentials passcode (minimum 6 characters)..."
                      className="w-full bg-[#05060A]/95 border border-[#1E233E]/90 focus:border-cyan-500 rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Secure lock password section */}
              <div className="space-y-3 bg-[#05060A]/80 p-3.5 border border-[#161B30] rounded-2xl">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1.5 h-3.5 bg-violet-500 rounded-sm" />
                  <span className="text-[10px] font-mono tracking-widest text-[#8C93B2] uppercase font-bold">
                    STEP 2: Cyber Shield Portal Lock (Optional)
                  </span>
                </div>
                <p className="text-[9px] text-[#6F7694] leading-relaxed font-sans block">
                  Assign an entering passcode key to shield your wellness metrics from other physical screen users. Leaving this empty lets you entry the dashboard instantly.
                </p>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-0.5">
                    Workspace Lock password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5472]" />
                    <input 
                      type="password"
                      value={onboardLockPassword}
                      onChange={(e) => setOnboardLockPassword(e.target.value)}
                      placeholder="Enter custom unlock passcode..."
                      className="w-full bg-[#05060A]/95 border border-[#1E233E]/90 focus:border-[#7C3AED] rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Cadence choice and Alignment modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-0.5">
                    Sync uplink Cadence
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono font-bold">
                    {[
                      { id: 'realtime', label: 'REALTIME' },
                      { id: 'hourly', label: 'HOURLY' },
                      { id: 'daily', label: 'DAILY' },
                    ].map((cad) => (
                      <button
                        key={cad.id}
                        type="button"
                        onClick={() => setOnboardCadence(cad.id)}
                        className={`p-1.5 rounded-lg border text-center transition cursor-pointer bg-transparent ${
                          onboardCadence === cad.id
                            ? "bg-cyan-950/55 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.1)]"
                            : "bg-[#05060A]/70 border-[#222E5C]/60 text-[#6F7694]"
                        }`}
                      >
                        {cad.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-0.5">
                    Categories alignment
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono font-bold text-center">
                    {[
                      { key: 'habits', label: 'Habits' },
                      { key: 'focus', label: 'Timers' },
                      { key: 'badges', label: 'Badges' },
                    ].map((item) => {
                      const isActive = onboardSyncOptions[item.key as keyof typeof onboardSyncOptions];
                      return (
                        <div
                          key={item.key}
                          onClick={() => setOnboardSyncOptions({
                            ...onboardSyncOptions,
                            [item.key]: !isActive
                          })}
                          className={`p-1.5 rounded-lg border text-center transition cursor-pointer select-none ${
                            isActive
                              ? "bg-violet-950/40 border-violet-500 text-violet-300"
                              : "bg-[#05060A]/70 border-[#222E5C]/60 text-[#4E5472]"
                          }`}
                        >
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2.5 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 via-violet-500 to-[#8A2BE2] hover:opacity-95 text-black font-mono font-bold text-[11px] uppercase rounded-xl shadow-[0_4px_12px_rgba(0,240,255,0.25)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {submitting ? 'Constructing Node Sync...' : 'INITIALIZE PERSISTENT ACCOUNT & START'}
                </button>

                <button
                  type="button"
                  onClick={handleOnboardingGuestSubmit}
                  disabled={submitting}
                  className="px-4 py-3 bg-transparent border border-dashed border-[#1D223B] hover:border-[#354890] text-[#9FA8C7] hover:text-white font-mono font-bold text-[11px] uppercase rounded-xl transition cursor-pointer disabled:opacity-50 bg-[#05060A]/20"
                  title="Onboard instantly as a local sandbox user"
                >
                  Skip as Offline Guest
                </button>
              </div>
            </form>

            {/* Quick Google setup */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#1C2037]/75" />
              <span className="flex-shrink mx-3 text-[8px] font-mono text-[#4E5472] uppercase tracking-[0.2em] font-bold">OR DIRECT HANDSHAKE</span>
              <div className="flex-grow border-t border-[#1C2037]/75" />
            </div>

            <button
              type="button"
              onClick={handleOnboardingGoogleSubmit}
              disabled={submitting}
              className="w-full py-2.5 bg-[#0E101D] border border-[#1D223B] hover:border-cyan-500/50 rounded-xl text-xs text-[#ECEFF4] font-mono tracking-wider transition duration-150 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>AUTOMATIC SETUP VIA GOOGLE ACCOUNT IDENTITY</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070A] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans select-none" id="auth-gate-wrapper">
      {/* Matrix nodes backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#141a2f_1px,transparent_1px)] [background-size:16px_16px] opacity-35 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Primary login terminal */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#090B12]/90 border border-[#1E233E]/60 rounded-3xl p-6 md:p-8 relative backdrop-blur-xl shadow-[0_0_40px_rgba(0,240,255,0.1)] z-10 cyber-panel-glow"
        style={{ borderImage: "linear-gradient(to bottom, rgba(0,240,255,0.3), rgba(138,43,226,0.1)) 1" }}
      >
        
        {/* Terminal Header & Brand Logo */}
        <div className="flex flex-col items-center text-center pb-6">
          <SynapseLogo />
          
          <h2 className="text-2xl font-display font-medium tracking-tight text-white mt-4 bg-gradient-to-r from-white via-cyan-100 to-violet-300 bg-clip-text text-transparent">
            {isForgot ? "RESET SHIELD KEY" : "APEX SYNAPSE"}
          </h2>
          <p className="text-[10px] font-mono tracking-[0.25em] text-[#00F0FF] uppercase mt-1">
            {isForgot ? "NEURAL ACCESS RESTORATION PROTOCOL" : "NEURAL HABIT MODULE INTEGRITY"}
          </p>
          <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-500 to-violet-500 mt-2.5 rounded-full" />
        </div>

        {/* Connection Mode Selection Tabs */}
        {!isForgot && (
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#05060A]/85 border border-[#161B30] rounded-2xl" id="auth-mode-tabs">
            <button
              type="button"
              id="tab-sign-in"
              onClick={() => {
                setIsSignUp(false);
                setErrorText(null);
                setSuccessText(null);
              }}
              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer text-center uppercase tracking-wider ${
                !isSignUp
                  ? 'bg-[#1E233E]/70 text-[#00F0FF] border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'text-[#6F7694] hover:text-[#ECEFF4]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              id="tab-sign-up"
              onClick={() => {
                setIsSignUp(true);
                setErrorText(null);
                setSuccessText(null);
              }}
              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer text-center uppercase tracking-wider ${
                isSignUp
                  ? 'bg-[#1E233E]/70 text-[#00F0FF] border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'text-[#6F7694] hover:text-[#ECEFF4]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Dynamic Alerts inside terminal */}
        <AnimatePresence mode="wait">
          {errorText && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-300 font-mono text-[11px] leading-relaxed"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-400 block uppercase">SYSTEM ERR ALERT:</span>
                {errorText}
              </div>
            </motion.div>
          )}

          {successText && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-emerald-300 font-mono text-[11px] leading-relaxed animate-pulse"
            >
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-400 block uppercase">SECURE OK:</span>
                {successText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isForgot && isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block ml-1">Explorer Designator (Full Name)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5472]" />
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Neo Spector"
                  required
                  className="w-full bg-[#05060A]/80 border border-[#161B30] focus:border-cyan-500/50 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between ml-1 leading-none">
              <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block">System Neural Address (Email)</label>
              <span className="text-[8px] font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 rounded px-1 uppercase py-0.5 scale-90 origin-right font-black">Authorized</span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5472]" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="designator@domain.com"
                required
                className="w-full bg-[#05060A]/80 border border-[#161B30] focus:border-cyan-500/50 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
              />
            </div>
            {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
              <p className="text-[9px] font-mono text-rose-400 font-bold tracking-wide mt-1 pl-1 flex items-center gap-1 animate-pulse leading-none">
                <span>⚠ AUTHORIZATION EXCLUSION: Invalid email coordinates</span>
              </p>
            )}
          </div>

          {!isForgot && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1 leading-none mr-1.5">
                <label className="text-[9px] font-mono tracking-widest text-[#6F7694] uppercase block">Synaptic Shield Key (Password)</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgot(true);
                    setErrorText(null);
                    setSuccessText(null);
                  }}
                  className="text-[9px] font-mono text-[#00F0FF] hover:text-cyan-300 font-bold uppercase transition hover:underline cursor-pointer"
                >
                  Forgot Shield Key?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5472]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="⚙⚙⚙⚙⚙⚙⚙⚙"
                  required
                  className="w-full bg-[#05060A]/80 border border-[#161B30] focus:border-cyan-500/50 rounded-xl py-2.5 pl-10 pr-10 text-xs font-mono text-[#ECEFF4] placeholder-[#4E5472] outline-none transition duration-200"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#4E5472] hover:text-cyan-400 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 mt-2 rounded-xl text-xs font-mono font-bold uppercase transition bg-gradient-to-r from-cyan-500 via-violet-500 to-[#8A2BE2] text-black shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:opacity-90 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                DETERMINING SYSTEM SYNC...
              </span>
            ) : (
              <span>{isForgot ? "SEND RESET COORDINATES" : isSignUp ? "CREATE SECURE ACCOUNT & START" : "ESTABLISH CONNECTION & LOG IN"}</span>
            )}
          </button>
        </form>

        {!isForgot && (
          <>
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-[#1C2037]" />
              <span className="flex-shrink mx-4 text-[9px] font-mono text-[#4E5472] uppercase tracking-[0.15em]">Direct Gateway</span>
              <div className="flex-grow border-t border-[#1C2037]" />
            </div>

            {/* Third Party Google Login & Guest Demo */}
            <div className="flex flex-col gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "rgba(0, 240, 255, 0.75)", boxShadow: "0 0 15px rgba(0, 240, 255, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={loginUser}
                className="w-full py-2.5 bg-[#0E101D] border border-[#1D223B] rounded-xl text-xs text-[#ECEFF4] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 font-mono group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-bold tracking-wider">
                  {isSignUp ? "CREATE NEW ACCOUNT WITH GOOGLE ID" : "SIGN IN WITH GOOGLE ID"}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "rgba(0, 240, 255, 0.05)", borderColor: "rgba(0, 240, 255, 0.4)" }}
                whileTap={{ scale: 0.99 }}
                onClick={loginAsGuest}
                className="w-full py-2 bg-transparent border border-dashed border-[#1E233E]/80 rounded-xl text-xs text-[#9FA8C7] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 font-mono"
              >
                <Bot className="w-4 h-4 text-cyan-400 group-hover:animate-pulse" />
                GUEST ACCESS (SANDBOX PROTOCOL)
              </motion.button>
            </div>
          </>
        )}

        {/* Toggle between Login, Signup and Forgot Password back-linking */}
        <div className="mt-5 text-center">
          {isForgot ? (
            <button
              onClick={() => {
                setIsForgot(false);
                setErrorText(null);
                setSuccessText(null);
              }}
              className="text-xs text-cyan-400 hover:underline hover:text-cyan-300 font-mono uppercase tracking-wider font-bold bg-transparent border-0 cursor-pointer"
            >
              ← RETURN TO CONNECT GATEWAY
            </button>
          ) : (
            <p className="text-xs text-[#6F7694] font-mono">
              {isSignUp ? "Already got an active profile?" : "Need a new standard profile?"}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorText(null);
                  setSuccessText(null);
                }}
                className="text-[#00F0FF] hover:underline hover:text-cyan-300 ml-1.5 font-bold cursor-pointer bg-transparent border-0"
              >
                {isSignUp ? "Log In" : "Create standard account now"}
              </button>
            </p>
          )}
        </div>

        {/* Informative Config Note */}
        {isOffline && (
          <div className="mt-4 pt-3.5 border-t border-[#1C2037]/50 text-center font-mono space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-yellow-950/25 border border-yellow-800/40 text-yellow-500 text-[9px] px-2 py-0.5 rounded uppercase font-bold">
              ⚡ Local Offline Sandbox Active
            </span>
            <p className="text-[9px] text-[#4E5472] leading-normal max-w-xs mx-auto">
              Ready to verify credential logic completely in sandbox storage! To connect real Firestore/Oauth endpoints, activate online key in your AI Studio console.
            </p>
          </div>
        )}

      </motion.div>
    </div>
  );
}
