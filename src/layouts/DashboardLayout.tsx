import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { 
  Home, FileText, PlusCircle, Bell, MessageSquare, User, LogOut, 
  Menu, X, Sun, Moon, ShieldAlert, Users, Settings, BarChart2, 
  CheckCircle, RefreshCw, Layers, Database, ChevronRight, Activity, Landmark, Sparkles, Lock, Beaker, BookOpen, Cloud, TrendingUp, Info
} from 'lucide-react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  page: string;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentUser, 
    currentRole, 
    currentPage, 
    setPage, 
    logout, 
    isDarkMode, 
    toggleDarkMode, 
    notifications,
    markNotificationRead,
    isOfflineFallback,
    setIsOfflineFallback
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const unreadNotifs = notifications.filter(n => !n.read);

  // Configure Sidebar Items based on Role
  const getSidebarItems = (): SidebarItem[] => {
    switch (currentRole) {
      case 'student':
        return [
          { icon: <Home size={20} />, label: 'Home Dashboard', page: 'home' },
          { icon: <PlusCircle size={20} />, label: 'Report Complaint', page: 'report-complaint' },
          { icon: <FileText size={20} />, label: 'My Complaints', page: 'my-complaints' },
          { icon: <Bell size={20} />, label: 'Notifications', page: 'notifications' },
          { icon: <MessageSquare size={20} />, label: 'AI Campus Assistant', page: 'ai-assistant' },
          { icon: <Info size={20} />, label: 'How It Works', page: 'how-it-works' },
          { icon: <User size={20} />, label: 'My Profile', page: 'profile' },
        ];
      case 'admin':
        return [
          { icon: <BarChart2 size={20} />, label: 'System Overview', page: 'admin-dashboard' },
          { icon: <FileText size={20} />, label: 'Manage Complaints', page: 'admin-complaints' },
          { icon: <Users size={20} />, label: 'Staff Management', page: 'admin-staff' },
          { icon: <Users size={20} />, label: 'Student Management', page: 'admin-students' },
          { icon: <Sparkles size={20} />, label: 'AI Features Suite', page: 'admin-ai-features' },
          { icon: <Info size={20} />, label: 'How It Works', page: 'how-it-works' },
          { icon: <BarChart2 size={20} />, label: 'Advanced Analytics', page: 'admin-analytics' },
          { icon: <Lock size={20} />, label: 'Security Hub', page: 'admin-security' },
          { icon: <Beaker size={20} />, label: 'Testing & QA Suite', page: 'admin-testing' },
          { icon: <BookOpen size={20} />, label: 'System Documentation', page: 'admin-docs' },
          { icon: <Cloud size={20} />, label: 'Cloud Deployment', page: 'admin-deployment' },
          { icon: <TrendingUp size={20} />, label: 'Future Expansion', page: 'admin-expansion' },
          { icon: <Settings size={20} />, label: 'Portal Settings', page: 'admin-settings' },
        ];
      case 'staff':
        return [
          { icon: <Home size={20} />, label: 'Staff Overview', page: 'staff-dashboard' },
          { icon: <FileText size={20} />, label: 'Assigned Tasks', page: 'staff-complaints' },
          { icon: <CheckCircle size={20} />, label: 'Completed Work', page: 'staff-completed' },
          { icon: <Info size={20} />, label: 'How It Works', page: 'how-it-works' },
          { icon: <User size={20} />, label: 'Technical Profile', page: 'staff-profile' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getSidebarItems();

  const handlePageClick = (page: string) => {
    setPage(page);
    setIsSidebarOpen(false);
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'admin': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'staff': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: Role) => {
    switch (role) {
      case 'student': return 'Student';
      case 'admin': return 'College Authority';
      case 'staff': return 'Maintenance Staff';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800 dark:bg-[#060811] dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Navbar Header */}
      <header id="main-navbar" className="h-16 border-b border-slate-200/50 bg-white/70 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 dark:bg-[#0B0F19]/70 dark:border-slate-800/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] shrink-0">
        <div className="flex items-center gap-3">
          <button 
            id="mobile-sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageClick('landing')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-blue-500/20">
              C
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              CampusCare AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Light/Dark Toggle */}
          <button 
            id="theme-toggle"
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Panel Trigger */}
          <div className="relative">
            <button 
              id="header-notification-bell"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors relative"
            >
              <Bell size={18} />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div id="notification-dropdown" className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => notifications.forEach(n => markNotificationRead(n.id))}>
                      Mark all as read
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                      No notifications available
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          markNotificationRead(n.id);
                          setIsNotifOpen(false);
                          if (currentRole === 'student') {
                            setPage('my-complaints');
                          } else if (currentRole === 'admin') {
                            setPage('admin-complaints');
                          } else if (currentRole === 'staff') {
                            setPage('staff-complaints');
                          }
                        }}
                        className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="font-medium text-xs text-slate-800 dark:text-slate-200">{n.title}</p>
                          <span className="text-[9px] text-slate-400 whitespace-nowrap ml-2">
                            {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.description}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
                  <button 
                    onClick={() => {
                      setIsNotifOpen(false);
                      handlePageClick(currentRole === 'student' ? 'notifications' : 'admin-settings');
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Trigger */}
          <div className="relative">
            <button 
              id="header-user-avatar-trigger"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
            >
              <img 
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff&size=80`} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff&size=80`;
                }}
              />
              <div className="hidden md:block">
                <p className="text-xs font-semibold leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{getRoleDisplayName(currentRole)}</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div id="profile-dropdown" className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">{currentUser.email}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(currentUser.role)}`}>
                    {getRoleDisplayName(currentUser.role)}
                  </span>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (currentRole === 'student') handlePageClick('profile');
                      else if (currentRole === 'admin') handlePageClick('admin-settings');
                      else handlePageClick('staff-profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <User size={15} /> My Profile Settings
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame (Mobile-only experience) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar - Collapsible Menu Drawer (Available on all screens inside phone) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsSidebarOpen(false)} />
            
            {/* Menu Container */}
            <div className="relative flex flex-col w-72 max-w-xs h-full bg-white dark:bg-[#1E293B] py-4 shadow-2xl">
              <div className="flex justify-between items-center px-4 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                  CampusCare AI Menu
                </span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 px-3">
                <div className="px-3 mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Role: {getRoleDisplayName(currentRole)}
                  </p>
                </div>
                {menuItems.map((item, idx) => {
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePageClick(item.page)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40 text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Campus Operations System</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">CampusCare AI</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Smart Maintenance & Dispatch Engine</p>
                </div>

                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content viewport - Optimized scrolling and padding for mobile bottom bar */}
        <main id="main-content-scroll" className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-none flex flex-col justify-between">
          <div>
            {children}
          </div>
          <footer className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-[10px] text-slate-400 dark:text-slate-500">
            <p>CampusCare AI • Smart Institutional Infrastructure & Maintenance Operations</p>
          </footer>
        </main>
      </div>

      {/* Dynamic Role-Specific Bottom Navigation Bar */}
      {currentUser && (
        <nav id="mobile-bottom-navigation" className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-around z-30 shadow-lg px-2">
          {(() => {
            const getTabs = () => {
              switch (currentRole) {
                case 'student':
                  return [
                    { icon: <Home size={18} />, label: 'Home', page: 'home' },
                    { icon: <PlusCircle size={18} />, label: 'Report', page: 'report-complaint' },
                    { icon: <FileText size={18} />, label: 'My Tickets', page: 'my-complaints' },
                    { icon: <User size={18} />, label: 'Profile', page: 'profile' },
                  ];
                case 'admin':
                  return [
                    { icon: <BarChart2 size={18} />, label: 'Overview', page: 'admin-dashboard' },
                    { icon: <FileText size={18} />, label: 'Tickets', page: 'admin-complaints' },
                    { icon: <Users size={18} />, label: 'Staff', page: 'admin-staff' },
                    { icon: <Settings size={18} />, label: 'System', page: 'admin-settings' },
                  ];
                case 'staff':
                  return [
                    { icon: <Home size={18} />, label: 'Overview', page: 'staff-dashboard' },
                    { icon: <FileText size={18} />, label: 'Tasks', page: 'staff-complaints' },
                    { icon: <CheckCircle size={18} />, label: 'Completed', page: 'staff-completed' },
                    { icon: <User size={18} />, label: 'Technical', page: 'staff-profile' },
                  ];
                default:
                  return [];
              }
            };
            return getTabs().map((tab, i) => {
              const isTabActive = currentPage === tab.page || 
                (tab.page === 'my-complaints' && currentPage === 'report-complaint') ||
                (tab.page === 'admin-complaints' && currentPage === 'complaint-details') ||
                (tab.page === 'staff-complaints' && currentPage === 'complaint-details');
              
              return (
                <button 
                  key={i}
                  onClick={() => handlePageClick(tab.page)}
                  className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all ${isTabActive ? 'text-blue-600 dark:text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-500 dark:text-slate-500'}`}
                >
                  {tab.icon}
                  <span className="text-[9px] font-semibold mt-1 tracking-tight">{tab.label}</span>
                </button>
              );
            });
          })()}
        </nav>
      )}
    </div>
  );
};
