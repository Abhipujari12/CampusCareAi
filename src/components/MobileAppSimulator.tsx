import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, Shield, User, Users, Landmark, Zap, 
  Sparkles, Power, Wifi, Battery, Volume2, HelpCircle, 
  QrCode, ArrowRightLeft, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileAppSimulatorProps {
  children: React.ReactNode;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({ children }) => {
  const { 
    login, 
    logout, 
    currentUser, 
    currentRole, 
    isDarkMode, 
    toggleDarkMode,
    setPage
  } = useApp();

  // Dynamic Live Time for the Phone Status Bar
  const [currentTime, setCurrentTime] = useState('');
  const [isAsleep, setIsAsleep] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(98);
  const [volumeLevel, setVolumeLevel] = useState(80);
  const [showVolumeHUD, setShowVolumeHUD] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate dynamic battery drain/charge very slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev <= 15) return 100; // Charge back up
        return prev - 1;
      });
    }, 90000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoLogin = (role: 'student' | 'admin' | 'staff') => {
    setIsAsleep(false); // Wake up if asleep
    if (role === 'student') login('student@campuscare.ai', 'student');
    else if (role === 'admin') login('admin@campuscare.ai', 'admin');
    else if (role === 'staff') login('staff@campuscare.ai', 'staff');
  };

  const handleVolumeClick = (dir: 'up' | 'down') => {
    setVolumeLevel(prev => {
      const next = dir === 'up' ? Math.min(prev + 10, 100) : Math.max(prev - 10, 0);
      return next;
    });
    setShowVolumeHUD(true);
    const timer = setTimeout(() => setShowVolumeHUD(false), 1500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="min-h-screen bg-[#090D1A] text-slate-100 flex flex-col md:flex-row items-stretch overflow-hidden font-sans select-none" id="mobile-app-simulator-root">
      
      {/* 1. LEFT SIDE PANEL: Administrative/Demo Control Console (Only visible on Medium screens & larger) */}
      <div className="hidden lg:flex w-[460px] shrink-0 border-r border-slate-800 bg-[#0F172A]/70 backdrop-blur-xl p-8 flex-col justify-between overflow-y-auto relative" id="control-console-left">
        {/* Glow Decorator */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono uppercase tracking-widest">
              <Sparkles size={11} className="animate-pulse" /> CAMPUS MOBILE MODE
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-display">CampusCare AI</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Complaints & Maintenance Dispatch Engine engineered for institutional campus operations.
            </p>
          </div>

          {/* Core Interactive Sandbox Guide */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
              <ArrowRightLeft size={13} className="text-blue-400" />
              Role Synchronization Sandbox
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              CampusCare synchronizes dispatches across roles instantly. For the ultimate evaluation, follow this simple route:
            </p>
            <div className="space-y-2 text-[11px] text-slate-300 pl-1">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                <span>Log in as <strong>Alex (Student)</strong> & file a broken classroom fan/projector ticket.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                <span>Switch to <strong>Sarah (College Authority)</strong> to assign that ticket to technical maintenance staff.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                <span>Switch to <strong>Marcus (Staff)</strong> to accept the dispatch, upload proof, and resolve it!</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">4</span>
                <span>Log back as <strong>Alex</strong> to view the real-time tracker, rate the resolution, and close it.</span>
              </div>
            </div>
          </div>

          {/* Quick Switching Buttons with real avatars */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Simulate User Accounts</p>
            
            {/* Student */}
            <button 
              onClick={() => handleDemoLogin('student')}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                currentRole === 'student' 
                  ? 'bg-blue-600/10 border-blue-500 text-blue-300 shadow-md shadow-blue-500/5' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Alex (Student)</p>
                  <p className="text-[10px] text-slate-500 mt-1">Submit tickets, view live SLA trackers</p>
                </div>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            {/* College Authority */}
            <button 
              onClick={() => handleDemoLogin('admin')}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                currentRole === 'admin' 
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/5' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  AN
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Ananya (College Authority)</p>
                  <p className="text-[10px] text-slate-500 mt-1">Receive, assign & monitor maintenance complaints</p>
                </div>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            {/* Maintenance Technician */}
            <button 
              onClick={() => handleDemoLogin('staff')}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                currentRole === 'staff' 
                  ? 'bg-amber-600/10 border-amber-500 text-amber-300 shadow-md shadow-amber-500/5' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  JR
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">James R. (Staff Lead)</p>
                  <p className="text-[10px] text-slate-500 mt-1">Accept dispatches, submit repair proof</p>
                </div>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>
        </div>

        {/* Footer controls */}
        <div className="space-y-4 pt-6 border-t border-slate-800 text-[11px] text-slate-500 relative z-10">
          {currentUser && (
            <button 
              onClick={logout}
              className="w-full py-2.5 rounded-xl border border-red-900/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-bold transition-all cursor-pointer text-center"
            >
              Log Out Current Session
            </button>
          )}
          <div className="flex justify-between items-center text-[10px]">
            <span>VSMSRKIT Nipani Maintenance v1.4</span>
            <span className="font-mono text-[9px] text-blue-500">REAL-TIME ONLINE</span>
          </div>
        </div>
      </div>

      {/* 2. THE MAIN MOBILE VIEWPORT FRAME */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-[#0B0F19] to-[#05070D] relative overflow-hidden" id="simulator-workspace-center">
        {/* Dynamic decorative background lights */}
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

        {/* Outer Phone Wrapper (Visible on Desktop screens only, responsive on smaller screens) */}
        <div className="relative w-full max-w-[400px] h-full max-h-[850px] aspect-[9/19.5] md:aspect-[9/19] flex items-stretch md:my-auto" id="simulator-phone-wrapper">
          
          {/* Dynamic volume / power keys mockups on side of physical bezel (Desktop only) */}
          <div className="hidden md:block absolute -left-2.5 top-36 w-1 h-12 bg-slate-800 rounded-l-lg border-y border-l border-slate-700/50 cursor-pointer" onClick={() => handleVolumeClick('up')} title="Volume Up" />
          <div className="hidden md:block absolute -left-2.5 top-52 w-1 h-12 bg-slate-800 rounded-l-lg border-y border-l border-slate-700/50 cursor-pointer" onClick={() => handleVolumeClick('down')} title="Volume Down" />
          <div className="hidden md:block absolute -right-2.5 top-44 w-1 h-16 bg-slate-800 rounded-r-lg border-y border-r border-slate-700/50 cursor-pointer" onClick={() => setIsAsleep(!isAsleep)} title="Power / Sleep Mode" />

          {/* Interactive Volume HUD Overlay */}
          <AnimatePresence>
            {showVolumeHUD && (
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="absolute left-4 top-40 bg-slate-900/90 border border-slate-800 px-2 py-3 rounded-2xl z-50 flex flex-col items-center gap-2 text-slate-300"
              >
                <Volume2 size={14} className="text-blue-400" />
                <div className="w-1.5 h-16 bg-slate-800 rounded-full relative overflow-hidden flex items-end">
                  <div className="w-full bg-blue-500 rounded-full" style={{ height: `${volumeLevel}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main phone chassis container */}
          <div className="w-full h-full bg-white dark:bg-[#070A13] md:border-[10px] md:border-slate-900/90 md:dark:border-slate-850/90 rounded-none md:rounded-[44px] shadow-2xl relative overflow-hidden flex flex-col z-20 transition-all duration-300">
            
            {/* SCREEN BLACKOUT SLEEP/OFF OVERLAY */}
            <AnimatePresence>
              {isAsleep && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 bg-[#03050A] z-[100] flex flex-col items-center justify-center p-8 select-none"
                  onClick={() => setIsAsleep(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <p className="text-3xl font-extrabold tracking-widest text-slate-250 font-mono opacity-80">{currentTime}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Screen Sleep Mode Active</p>
                    <button 
                      onClick={() => setIsAsleep(false)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 hover:text-white transition-all mx-auto flex items-center gap-1.5 cursor-pointer mt-4"
                    >
                      <Power size={11} className="text-green-500" /> Wake Screen
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* A. SMARTPHONE TOP STATUS BAR (Dynamic island flanked bar - Desktop only/Always elegant) */}
            <div className="h-11 shrink-0 bg-white dark:bg-[#070A13] border-b border-slate-150/40 dark:border-white/2 px-5 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 z-45 relative select-none" id="phone-status-bar">
              {/* Left Clock */}
              <span className="font-mono tracking-tight font-bold">{currentTime}</span>

              {/* Center Camera Notch/Dynamic Island */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-5.5 bg-black rounded-full z-50 flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full absolute right-3 border border-slate-850/40" />
              </div>

              {/* Right System Indicators */}
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                {/* Simulated Signal */}
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-1 bg-slate-400 dark:bg-slate-350 rounded-xs" />
                  <span className="w-0.5 h-1.5 bg-slate-400 dark:bg-slate-350 rounded-xs" />
                  <span className="w-0.5 h-2 bg-slate-400 dark:bg-slate-350 rounded-xs" />
                  <span className="w-0.5 h-2.5 bg-slate-500 dark:bg-blue-400 rounded-xs" />
                </div>
                {/* Wifi icon */}
                <Wifi size={11} className="text-slate-500 dark:text-blue-400" />
                {/* Battery percentage */}
                <span className="text-[9px] font-mono font-medium">{batteryLevel}%</span>
                <Battery size={13} className="text-slate-500 dark:text-blue-400" />
              </div>
            </div>

            {/* B. MAIN INTERACTIVE PHONE VIEWPORT PORT (Dynamic height to hold internal page routers) */}
            <div className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-[#070A13] scrollbar-thin" id="phone-app-inner-viewport">
              {children}
            </div>

            {/* C. BOTTOM HOME STICKY INDICATOR BAR */}
            <div className="h-4 bg-white dark:bg-[#070A13] relative z-40 select-none shrink-0" id="phone-home-indicator">
              <div className="w-28 h-1 bg-slate-350 dark:bg-slate-800 rounded-full mx-auto absolute bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Small helpers for mobile testing beneath the phone device simulator */}
        <div className="mt-4 text-center space-y-1 block lg:hidden relative z-10" id="mobile-viewport-help-banner">
          <p className="text-xs text-slate-400 font-bold">CampusCare AI Mobile Web App</p>
          <p className="text-[10px] text-slate-500">Perfectly responsive fullscreen experience on phone viewports.</p>
        </div>
      </div>
    </div>
  );
};
