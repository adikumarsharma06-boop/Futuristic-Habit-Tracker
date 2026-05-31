/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Mail, Lock, User, Eye, EyeOff, Bot, Sparkles, Shield, AlertTriangle } from 'lucide-react';
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
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

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
