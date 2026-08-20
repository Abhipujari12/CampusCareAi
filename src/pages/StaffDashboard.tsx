import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintDetailsPage } from './ComplaintDetailsPage';
import { NotificationSettings } from '../components/NotificationSettings';
import { Complaint, ComplaintStatus, PriorityLevel } from '../types';
import { 
  Home, FileText, CheckCircle2, Clock, MapPin, Sparkles, 
  AlertTriangle, Play, Check, Camera, Send, User, Phone, 
  Briefcase, Mail, ChevronRight, Eye, Search, Wrench
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { currentPage, selectedComplaintId } = useApp();

  switch (currentPage) {
    case 'staff-dashboard':
      return <StaffHome />;
    case 'staff-complaints':
      return <StaffComplaintsPage />;
    case 'complaint-details':
      return <ComplaintDetailsPage id={selectedComplaintId} />;
    case 'staff-completed':
      return <StaffCompletedPage />;
    case 'staff-profile':
      return <StaffProfilePage />;
    default:
      return <StaffHome />;
  }
};

// ==========================================
// 1. STAFF HOME DASHBOARD
// ==========================================
const StaffHome: React.FC = () => {
  const { complaints, currentUser, updateComplaintStatus, setPage, setSelectedComplaintId } = useApp();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get complaints assigned to this staff member (or all active campus complaints)
  const staffComplaints = complaints.filter(c => 
    c.assignedStaffId === currentUser?.id || 
    !c.assignedStaffId || 
    c.assignedStaffName === currentUser?.name ||
    currentUser?.role === 'staff'
  );
  
  const assigned = staffComplaints.filter(c => c.status === 'assigned').length;
  const inProgress = staffComplaints.filter(c => c.status === 'in-progress').length;
  const completed = staffComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;

  const activeDispatches = staffComplaints.filter(c => c.status !== 'closed' && c.status !== 'resolved');

  const filteredDispatches = activeDispatches.filter(c => {
    const q = searchTerm.toLowerCase();
    return c.id.toLowerCase().includes(q) ||
           c.title.toLowerCase().includes(q) ||
           c.description.toLowerCase().includes(q) ||
           c.building.toLowerCase().includes(q) ||
           c.roomNumber.toLowerCase().includes(q);
  });

  const handleStartWork = (id: string) => {
    updateComplaintStatus(id, 'in-progress', 'Technician arrived on site and initiated diagnostics.');
  };

  const handleResolveWork = (id: string) => {
    setSelectedComplaintId(id);
    setPage('staff-complaints');
  };

  const getPriorityClass = (p: PriorityLevel) => {
    switch (p) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-350';
      case 'medium': return 'bg-amber-50 text-amber-800 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400';
      case 'high': return 'bg-orange-50 text-orange-800 border-orange-250 dark:bg-orange-950/20 dark:text-orange-400';
      case 'critical': return 'bg-red-50 text-red-800 border-red-250 dark:bg-red-950/20 dark:text-red-400 animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      {/* Staff Protocol Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
            <Wrench size={12} />
            <span>Staff Protocol — Resolve</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight font-display">On-Site Dispatch & Resolution Center</h2>
          <p className="text-xs text-emerald-200/80">Receive assigned complaints, inspect on-site coordinates, work on the issue, and update status to Resolved.</p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setPage('staff-complaints')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 size={14} /> My Assigned Tasks
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-display">Assigned Tasks</p>
            <p className="text-2xl font-black mt-1 text-blue-600 font-display">{assigned}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Clock size={18} />
          </div>
        </div>

        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-display">In Active Repair</p>
            <p className="text-2xl font-black mt-1 text-purple-600 font-display">{inProgress}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <Play size={18} />
          </div>
        </div>

        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-display">Resolved Repairs</p>
            <p className="text-2xl font-black mt-1 text-green-600 font-display">{completed}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Active Work Board */}
      <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm font-display">Active Field Dispatches</h3>
            <p className="text-xs text-slate-400 mt-0.5">Please update status on-arrival to avoid SLA lead-time alerts</p>
          </div>
          
          <div className="relative w-full md:w-60">
            <span className="absolute left-3 top-2.5 text-slate-400"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search by ID, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-xs outline-hidden focus:border-blue-500 transition-all text-slate-850 dark:text-slate-100"
            />
          </div>
        </div>

        {activeDispatches.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No active dispatches on your roster currently. Excellent work!
          </div>
        ) : filteredDispatches.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            No dispatches match "{searchTerm}".
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDispatches.map(c => (
              <div key={c.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getPriorityClass(c.priority)}`}>
                      {c.priority} Priority
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{c.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{c.title}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2">{c.description}</p>
                  <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <MapPin size={12} className="text-red-500" /> {c.building} ({c.roomNumber})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      setSelectedComplaintId(c.id);
                      setPage('complaint-details');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-250 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <Eye size={12} /> View Tracker
                  </button>

                  {c.status === 'assigned' ? (
                    <button 
                      onClick={() => handleStartWork(c.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 transition-all"
                    >
                      <Play size={12} /> Start Diagnostics
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleResolveWork(c.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-green-500/10 transition-all"
                    >
                      <Check size={12} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. ASSIGNED COMPLAINTS (RESOLVE WITH PROOF)
// ==========================================
const StaffComplaintsPage: React.FC = () => {
  const { complaints, currentUser, updateComplaintStatus, setPage, setSelectedComplaintId } = useApp();
  
  // Update state
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [repairLogs, setRepairLogs] = useState('');
  const [mockProofUploaded, setMockProofUploaded] = useState(false);

  const staffComplaints = complaints.filter(c => 
    c.assignedStaffId === currentUser?.id || 
    !c.assignedStaffId || 
    c.assignedStaffName === currentUser?.name ||
    currentUser?.role === 'staff'
  );

  const handleResolveSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!repairLogs) return;

    const proofImg = mockProofUploaded 
      ? 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80' 
      : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';

    updateComplaintStatus(id, 'resolved', repairLogs, [proofImg]);
    setResolvingId(null);
    setRepairLogs('');
    setMockProofUploaded(false);
  };

  const getPriorityClass = (p: PriorityLevel) => {
    switch (p) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800 animate-pulse';
    }
  };

  const handleAuditPage = (id: string) => {
    setSelectedComplaintId(id);
    setPage('complaint-details');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Active Dispatches & Resolution Logs</h2>
        <p className="text-xs text-slate-400 mt-0.5 font-sans">Fill diagnostic logs and upload resolved photo proofs here.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {staffComplaints.filter(c => c.status !== 'closed' && c.status !== 'resolved').length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl">
            No active repair cases on your roster currently.
          </div>
        ) : (
          staffComplaints.filter(c => c.status !== 'closed' && c.status !== 'resolved').map(c => (
            <div key={c.id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{c.id}</span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <MapPin size={11} className="text-red-500" /> {c.building} ({c.roomNumber})
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityClass(c.priority)}`}>
                  {c.priority} Priority
                </span>
              </div>

              {/* Desc */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#0F172A]/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                {c.description}
              </p>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-xs">
                <button 
                  onClick={() => handleAuditPage(c.id)}
                  className="font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={14} /> Audit Full Case Timeline
                </button>

                {resolvingId !== c.id && (
                  <button 
                    onClick={() => {
                      setResolvingId(c.id);
                      if (c.status === 'assigned') {
                        updateComplaintStatus(c.id, 'in-progress', 'On-site diagnostics initiated by staff.');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={14} /> Log Work & Resolve
                  </button>
                )}
              </div>

              {/* Inline Resolve Form */}
              {resolvingId === c.id && (
                <form onSubmit={(e) => handleResolveSubmit(e, c.id)} className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Technical Diagnostic & Repair Log *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Replaced worn-out washers inside faucet assembly. Re-pressurized valve water system; checked and verified dry ceiling."
                      value={repairLogs}
                      onChange={(e) => setRepairLogs(e.target.value)}
                      className="w-full px-4 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500"
                    />
                  </div>

                  {/* Photo proof mock upload */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Upload Resolution Photo Proof *</label>
                    <div 
                      onClick={() => setMockProofUploaded(true)}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50/40 rounded-xl p-4 text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <Camera size={16} className="text-slate-400" />
                      {mockProofUploaded ? (
                        <span className="text-green-500 font-bold">✅ Mock Repair Proof Loaded!</span>
                      ) : (
                        <span className="font-bold text-slate-600">Click to upload resolved on-site photo</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex-1"
                    >
                      Publish Resolution & Dispatch Closed Ticket
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setResolvingId(null)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. COMPLETED REPAIRS HISTORY
// ==========================================
const StaffCompletedPage: React.FC = () => {
  const { complaints, currentUser } = useApp();

  const completed = complaints.filter(c => ['resolved', 'closed'].includes(c.status));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Technical Resolution History</h2>
        <p className="text-xs text-slate-400 mt-0.5 font-sans">SLA audited track record of your completed repairs on campus.</p>
      </div>

      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {completed.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No resolved cases registered on your roster history yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4">Incident ID</th>
                  <th className="p-4">Location Block</th>
                  <th className="p-4">Incident Title</th>
                  <th className="p-4">Service Category</th>
                  <th className="p-4">Completed Date</th>
                  <th className="p-4 text-right">Student Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {completed.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    <td className="p-4 font-mono font-bold text-slate-500">{c.id}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-1.5">
                      <MapPin size={12} className="text-red-500" /> {c.building} ({c.roomNumber})
                    </td>
                    <td className="p-4 font-semibold max-w-[180px] truncate">{c.title}</td>
                    <td className="p-4 text-slate-400 font-medium">{c.category}</td>
                    <td className="p-4 text-slate-400 font-medium">
                      {new Date(c.createdDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right font-bold text-amber-500 font-mono">
                      {c.feedback?.rating ? `★ ${c.feedback.rating}.0` : 'Pending Verification'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. STAFF PROFILE PAGE
// ==========================================
const StaffProfilePage: React.FC = () => {
  const { currentUser, updateUserAvatar } = useApp();
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Staff')}&background=2563eb&color=fff&size=200`;

  const staffAvatarPresets = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&auto=format&fit=crop&q=80'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader.result) {
        await updateUserAvatar(reader.result as string);
        setSuccessMsg('Profile photo updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (url: string) => {
    setUploading(true);
    await updateUserAvatar(url);
    setSuccessMsg('Profile photo updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Technical Contractor ID</h2>
        <p className="text-xs text-slate-400 mt-0.5">Campus Care AI authorized technical credential card.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check size={14} /> {successMsg}
        </div>
      )}

      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
        
        {/* Photo panel */}
        <div className="bg-slate-50/50 dark:bg-slate-800/40 p-6 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800 text-center shrink-0 w-full md:w-52">
          <div className="relative group mb-3">
            <img 
              src={currentUser?.avatar || fallbackAvatar} 
              alt={currentUser?.name || 'Staff'} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-800"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
              }}
            />
            <label 
              htmlFor="staff-avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md cursor-pointer transition-all hover:scale-105"
              title="Upload new profile photo"
            >
              <Camera size={14} />
            </label>
            <input 
              type="file" 
              id="staff-avatar-upload" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{currentUser?.name}</h4>
          <span className="inline-flex px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded text-[9px] font-bold uppercase mt-1.5 tracking-wider">
            {currentUser?.department || 'Contractor'}
          </span>

          {/* Quick preset pickers */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 w-full">
            <p className="text-[10px] font-bold text-slate-400 mb-2">Preset Avatars</p>
            <div className="flex items-center justify-center gap-1.5">
              {staffAvatarPresets.map((presetUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(presetUrl)}
                  className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                  title={`Avatar option ${idx + 1}`}
                >
                  <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed panel */}
        <div className="p-6 flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">Technical Team Block</p>
              <p className="font-semibold text-slate-850 dark:text-slate-100">{currentUser?.department || 'General Maintenance'}</p>
            </div>
            
            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">Dispatch Email</p>
              <p className="font-semibold text-slate-850 dark:text-slate-100 truncate">{currentUser?.email}</p>
            </div>

            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">Phone Contact</p>
              <p className="font-semibold text-slate-850 dark:text-slate-100">{currentUser?.phone || 'N/A'}</p>
            </div>

            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">Language preference</p>
              <p className="font-semibold text-slate-850 dark:text-slate-100">English (United States)</p>
            </div>

            <div className="space-y-0.5 col-span-2 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="font-bold text-slate-400">Active Campus Authorization</p>
              <p className="font-semibold text-green-500">✓ Fully Certified (Engineering College East)</p>
            </div>
          </div>
        </div>

      </div>

      <NotificationSettings />
    </div>
  );
};
