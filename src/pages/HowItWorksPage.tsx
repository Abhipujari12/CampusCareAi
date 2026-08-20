import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, CheckCircle2, Camera, FileText, ShieldCheck, Users, 
  Clock, ArrowRight, Cpu, Database, Star, Upload, 
  Layers, Activity, Bell, Zap, UserCheck, Wrench, Shield, Crown,
  GraduationCap, CheckSquare, Eye, RefreshCw
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setPage, currentUser, login } = useApp();
  const [activeTab, setActiveTab] = useState<'student' | 'staff' | 'admin'>('student');

  // Role switcher and page launcher requiring authentic sign in
  const handleRoleAccess = async (role: 'student' | 'staff' | 'admin', targetPage: string) => {
    if (currentUser) {
      setPage(targetPage);
    } else {
      // Direct unauthenticated users to the login screen
      setPage('login');
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn text-slate-800 dark:text-slate-100 max-w-7xl mx-auto">
      
      {/* 1. HERO HEADER */}
      <div className="relative rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
            <span>CampusCare AI Role Execution Guide</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-display">
            How CampusCare AI Works
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            CampusCare AI is an intelligent, full-stack campus maintenance and complaint management platform. 
            Select any role below to explore detailed step-by-step operating guidelines or jump directly into the live workspace.
          </p>

          {/* Quick Portal Jump Buttons */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={() => handleRoleAccess('student', 'report-complaint')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              🎓 Student Portal <ArrowRight size={14} />
            </button>

            <button
              onClick={() => handleRoleAccess('staff', 'staff-dashboard')}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              🛠️ Staff Board <ArrowRight size={14} />
            </button>

            <button
              onClick={() => handleRoleAccess('admin', 'admin-dashboard')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              🏛️ College Authority Suite <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ROLE-BASED WORKFLOW EXPLORER */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Users size={20} className="text-blue-500" />
              Role Operating Guidelines & Steps
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a role tab to view detailed execution steps and objectives for Students, Maintenance Staff, and College Authorities.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-800 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center sm:text-left ${
                activeTab === 'student' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              🎓 Student (Report)
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center sm:text-left ${
                activeTab === 'admin' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              🏛️ College Authority (Assign & Monitor)
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center sm:text-left ${
                activeTab === 'staff' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              🛠️ Staff (Resolve)
            </button>
          </div>
        </div>

        {/* Tab Content 1: STUDENT ROLE STEPS */}
        {activeTab === 'student' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <span className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
                  <GraduationCap size={22} />
                </span>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-blue-900 dark:text-blue-200 text-base">🎓 Student — Report</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      Submit & Track
                    </span>
                  </div>
                  <p className="text-blue-800/90 dark:text-blue-300/90 font-medium">
                    <strong className="font-bold text-blue-950 dark:text-blue-100">Protocol:</strong> Submit complaints/issues, add description and photo, and track status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRoleAccess('student', 'report-complaint')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
              >
                Go to Report Complaint <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-blue-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-blue-500" /> Submit Complaint
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Log in with Google/Email and initiate a complaint for classrooms, labs, hostels, or common campus grounds.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-blue-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Camera size={15} className="text-indigo-500" /> Add Description & Photo
                </h4>
                <ul className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1 list-disc pl-3.5">
                  <li>Specify detailed description, building, and room.</li>
                  <li>Upload or snap photo proof of the maintenance issue.</li>
                  <li>Gemini AI analyzes urgency, priority, and hazard levels.</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-blue-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 3</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock size={15} className="text-amber-500" /> Track Live Status
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Monitor the real-time lifecycle tracker: <strong>Submitted → Assigned → In Progress → Resolved</strong> with technician notes.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-blue-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 4</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Star size={15} className="text-amber-400" /> Verify & Rate
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Review resolution notes and photos, submit a 1–5 star rating with feedback, and conclude the ticket lifecycle.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Sparkles size={16} className="text-blue-500" />
                <span>Ready to log a test issue as a student?</span>
              </div>
              <button
                onClick={() => handleRoleAccess('student', 'report-complaint')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                🎓 Access Student Portal
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 2: MAINTENANCE STAFF ROLE STEPS */}
        {activeTab === 'staff' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
                  <Wrench size={22} />
                </span>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-emerald-950 dark:text-emerald-200 text-base">🛠️ Staff — Resolve</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-300">
                      Work & Resolve
                    </span>
                  </div>
                  <p className="text-emerald-900/90 dark:text-emerald-300/90 font-medium">
                    <strong className="font-bold text-emerald-950 dark:text-emerald-100">Protocol:</strong> Receive assigned complaints, work on the issue, and update the status to Resolved.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRoleAccess('staff', 'staff-dashboard')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
              >
                Go to Staff Board <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-emerald-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Bell size={15} className="text-emerald-500" /> Receive Assigned Complaints
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Access incoming work orders assigned to you by College Authority, with student descriptions and photo attachments.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-emerald-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Zap size={15} className="text-blue-500" /> Work on the Issue
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Arrive on-site, click <strong>Start Work</strong> to set status to <span className="font-bold text-blue-600 dark:text-blue-400">In Progress</span>, and perform repairs.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-emerald-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 3</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Upload size={15} className="text-emerald-500" /> Log Repair Details
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Document the actions taken (e.g. replaced valve, repaired switchboard) and optionally attach completed repair proof.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-emerald-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 4</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" /> Update to Resolved
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Click <strong>Mark Resolved</strong> to instantly transition the ticket and notify the reporting student and authority.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Wrench size={16} className="text-emerald-500" />
                <span>Ready to process maintenance work orders?</span>
              </div>
              <button
                onClick={() => handleRoleAccess('staff', 'staff-dashboard')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                🛠️ Access Staff Board
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 3: COLLEGE AUTHORITY ROLE STEPS */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/40 flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                  <Shield size={22} />
                </span>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-indigo-950 dark:text-indigo-200 text-base">🏛️ College Authority — Assign & Monitor</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-300">
                      Operations Management
                    </span>
                  </div>
                  <p className="text-indigo-900/90 dark:text-indigo-300/90 font-medium">
                    <strong className="font-bold text-indigo-950 dark:text-indigo-100">Protocol:</strong> Receive, assign, and monitor complaints.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRoleAccess('admin', 'admin-dashboard')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
              >
                Go to College Authority Suite <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-indigo-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Shield size={15} className="text-indigo-500" /> Receive Complaints
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Receive live submissions from students across all academic blocks, hostels, and sports complexes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-indigo-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <UserCheck size={15} className="text-blue-500" /> Assign to Staff
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Assign complaints to qualified technicians (Electrician, Plumber, IT, Carpenter) based on availability and proximity.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-indigo-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 3</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Activity size={15} className="text-indigo-500" /> Monitor Complaints
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track real-time resolution pipelines, monitor SLAs, detect critical delays, and balance staff workloads.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111625] space-y-2.5 relative group hover:border-indigo-500/60 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 4</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <FileText size={15} className="text-amber-500" /> Export Audit Reports
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generate Excel & PDF compliance reports for NAAC accreditation, campus facility reviews, and administrative audits.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Shield size={16} className="text-indigo-500" />
                <span>Need to oversee campus operations, assign complaints, and monitor resolution?</span>
              </div>
              <button
                onClick={() => handleRoleAccess('admin', 'admin-dashboard')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                🏛️ Access College Authority Suite
              </button>
            </div>
          </div>
        )}

        {/* End of Role Steps */}
      </div>

      {/* 3. FULL ALL-IN-ONE SUMMARY REFERENCE TABLE */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <Layers size={20} className="text-blue-500" />
          <div>
            <h2 className="text-base font-bold font-display">Complete Role Matrix Overview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Side-by-side summary of operational goals, access entry points, and primary actions across all 3 roles.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-3 rounded-l-lg">Role</th>
                <th className="p-3">Primary Objective</th>
                <th className="p-3">Portal Access Point</th>
                <th className="p-3">Core Workflow Actions</th>
                <th className="p-3 rounded-r-lg text-right">Quick Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* Student Row */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <span>🎓</span> Student
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300">
                  Report an issue, track its progress, and verify the completed repair.
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono text-[11px] border border-blue-200 dark:border-blue-900/50">
                    Report Complaint / 🎓 Student Portal
                  </span>
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  Submit photo, Gemini AI triage, view live status, verify & rate 1–5 stars.
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleRoleAccess('student', 'report-complaint')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 cursor-pointer transition-all"
                  >
                    Open
                  </button>
                </td>
              </tr>

              {/* Staff Row */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span>🛠️</span> Maintenance Staff
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300">
                  Accept assigned repair tickets, update status, and upload repair proof photos.
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-mono text-[11px] border border-amber-200 dark:border-amber-900/50">
                    Staff Dashboard / 🛠️ Staff Board
                  </span>
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  Review domain tasks, click Start Work (<span style={{ color: '#3b82f6', fontWeight: 'bold' }}>In Progress</span>), attach proof photo, Mark Resolved.
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleRoleAccess('staff', 'staff-dashboard')}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-500 cursor-pointer transition-all"
                  >
                    Open
                  </button>
                </td>
              </tr>

              {/* College Authority Row */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span>🏛️</span> College Authority
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300">
                  Receive, assign, and monitor complaints across campus, and export audit reports.
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] border border-indigo-200 dark:border-indigo-900/50">
                    Authority Dashboard / 🏛️ Authority Suite
                  </span>
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  Receive submissions, dispatch staff, monitor live SLAs, export NAAC Excel/PDF compliance reports.
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleRoleAccess('admin', 'admin-dashboard')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-500 cursor-pointer transition-all"
                  >
                    Open
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer Information Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">Institutional Maintenance Platform</p>
          <h3 className="text-lg font-black tracking-tight text-white">CampusCare AI Engine</h3>
          <p className="text-xs text-slate-300 font-semibold">Automated Campus Dispatch & Ticket Resolution System</p>
          <p className="text-[11px] text-slate-400">Engineered for Universities, Colleges & Campus Facilities</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold shrink-0">
          CampusCare AI v2.5
        </div>
      </div>

    </div>
  );
};
