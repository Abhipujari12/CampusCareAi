import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardLayout } from './layouts/DashboardLayout';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { VSMSRKITProfile } from './pages/VSMSRKITProfile';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentUser,
    currentRole,
    currentPage,
    setPage,
    isLoading
  } = useApp();

  const isAuthenticated = currentUser !== null;
  const isAuthView = ['login', 'register', 'forgot-password'].includes(currentPage);

  // Loading Screen for Firebase Active Sync
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="relative flex flex-col items-center space-y-4">
          {/* Pulsing glow behind the spinner */}
          <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
          <div className="space-y-1 text-center relative z-10">
            <h3 className="text-sm font-bold tracking-wider uppercase text-blue-450 font-mono">CampusCare AI</h3>
            <p className="text-xs text-slate-400">Synchronizing production database...</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper to render role-specific dashboards
  const renderDashboard = () => {
    if (currentPage === 'how-it-works') {
      return <HowItWorksPage />;
    }
    if (currentPage === 'vsmsrkit-info') {
      return <VSMSRKITProfile />;
    }
    switch (currentRole) {
      case 'student':
        return <StudentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'staff':
        return <StaffDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  // Render Inner App Content in Full Responsive Viewport
  if (!isAuthenticated && !isAuthView && currentPage !== 'how-it-works') {
    return <LandingPage />;
  }

  if (!isAuthenticated && isAuthView) {
    return <AuthPages />;
  }

  if (!isAuthenticated && currentPage === 'how-it-works') {
    return (
      <div className="min-h-screen bg-[#FAFBFD] dark:bg-[#060811] text-slate-800 dark:text-slate-100 flex flex-col">
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/70 dark:bg-[#060811]/70 backdrop-blur-md dark:border-slate-800/40 transition-all">
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
                onClick={() => setPage('landing')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
              >
                ← Home
              </button>
              <button 
                onClick={() => setPage('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button 
                onClick={() => setPage('register')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Register Portal
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
          <HowItWorksPage />
        </main>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#060811] dark:text-slate-100 transition-colors">
        <AppContent />
      </div>
    </AppProvider>
  );
}
