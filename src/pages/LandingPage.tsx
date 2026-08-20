import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, ShieldCheck, Zap, Activity, Smartphone, Bell, 
  ArrowRight, Landmark, CheckCircle, Flame, Sparkles, BarChart2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setPage, currentUser } = useApp();

  const handleRoleNavigation = (role: 'student' | 'admin' | 'staff') => {
    if (currentUser) {
      if (role === 'student') setPage('report-complaint');
      else if (role === 'admin') setPage('admin-dashboard');
      else if (role === 'staff') setPage('staff-dashboard');
    } else {
      // Direct user to Sign In page so they authenticate with their real account
      setPage('login');
    }
  };

  return (
    <div className="bg-[#FAFBFD] text-slate-800 dark:bg-[#060811] dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Ambience Globs (Linear-inspired design) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[150px] pointer-events-none" />
      
      {/* Translucent Header Navbar */}
      <nav id="landing-navbar" className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/60 dark:bg-[#060811]/60 backdrop-blur-md dark:border-slate-800/40 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setPage('landing')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 font-black text-base shadow-sm">
              C
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              CampusCare AI
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setPage('how-it-works')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => setPage('login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={() => setPage('register')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-850 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white shadow-sm transition-all cursor-pointer"
            >
              Register Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 md:py-28 flex flex-col items-center justify-center text-center gap-12 relative z-10">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] font-display">
            The intelligent campus <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
              maintenance engine.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Submit classroom maintenance requests, report lab equipment issues, and track active facility visits across the entire campus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => setPage('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
            >
              Report an Issue <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button 
              onClick={() => setPage('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center cursor-pointer"
            >
              Enter User Portal
            </button>
          </div>
        </div>
      </section>

      {/* 3-TIER OPERATIONAL PROTOCOL SECTION */}
      <section className="border-t border-slate-200/40 bg-white/70 dark:bg-[#0c101d]/70 py-16 px-6 relative z-10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Standard Campus Operations Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              End-to-End Maintenance Protocol
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              CampusCare AI enforces a transparent three-stage protocol uniting students, administrators, and field technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. STUDENT — REPORT */}
            <div className="glass-card p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/20">
                    1
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    Step 1: Student
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                    Student — Report
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Submit complaints/issues, add description and photo, and track status in real time.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-blue-500 shrink-0" />
                    <span>Submit classroom, lab, or hostel faults</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-blue-500 shrink-0" />
                    <span>Attach visual photos via upload or camera</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-blue-500 shrink-0" />
                    <span>Live status tracking with milestone updates</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleRoleNavigation('student')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Report as Student</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* 2. COLLEGE AUTHORITY — ASSIGN & MONITOR */}
            <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/20">
                    2
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                    Step 2: Authority
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                    College Authority — Assign & Monitor
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Receive, assign, and monitor complaints across all departments and campus facilities.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-indigo-500 shrink-0" />
                    <span>Receive incoming ticket feeds in real time</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-indigo-500 shrink-0" />
                    <span>Assign tasks to specialized maintenance staff</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-indigo-500 shrink-0" />
                    <span>Monitor resolution progress, SLAs, and queues</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleRoleNavigation('admin')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Assign & Monitor Suite</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* 3. STAFF — RESOLVE */}
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-emerald-500/20">
                    3
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    Step 3: Staff
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                    Staff — Resolve
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Receive assigned complaints, work on the issue, and update the status to Resolved.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                    <span>Receive assigned maintenance dispatches</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                    <span>Execute work on-site and mark in progress</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                    <span>Update status to Resolved with repair logs</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleRoleNavigation('staff')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Staff Resolve Portal</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section className="border-t border-slate-200/30 bg-[#FAFBFD]/50 py-16 dark:bg-[#070911]/50 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Built like a modern startup product.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Engineered with modern, beautiful interfaces to solve real problems across campus infrastructure instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Sparkles size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">Intelligent Diagnostics</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Automatically analyzes descriptions using AI models to detect emergency indicators, classify departments, and route assignments.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Activity size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">Real-time SLAs</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Ensures critical issues are resolved within defined response hours, alerting administrators if tickets exceed threshold timelines.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <BarChart2 size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">Advanced Analytics</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Get full charts of maintenance volume, resolution rates, and department response times inside elegant visual analytics dashboards.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">Role-Based Gateways</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Dedicated dashboards customized for Students, Maintenance Staff, and College Authorities.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                <Smartphone size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">Quick Location QR Scan</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Scan visual location codes on campus structures to auto-fill building data, floor plans, and previous local work orders.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Bell size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">Transactional Alerts</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Keeps users updated with custom instant notifications during technician dispatch, work updates, and completion ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/40 bg-[#FAFBFD]/80 dark:bg-[#060811]/80 dark:border-white/5 py-8 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-sm bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              CampusCare AI
            </span>
            <span className="text-[11px] text-slate-500">• Smart Institutional Maintenance & Operations Engine</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px]">
            <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">SLA POLICY</a>
            <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">DOCUMENTATION</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
