import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintDetailsPage } from './ComplaintDetailsPage';
import { AIFeaturesHub } from './AIFeaturesHub';
import { NotificationSettings } from '../components/NotificationSettings';
import { Complaint, ComplaintStatus, PriorityLevel, User, Role } from '../types';
import { BUILDINGS, CATEGORIES } from '../data/mockData';
import { 
  BarChart2, Users, FileText, ShieldAlert, CheckCircle2, 
  MapPin, Clock, ArrowRight, UserCheck, Plus, Search, Mail, 
  Settings, Save, Eye, Check, X, Shield, Activity, Calendar, Sparkles,
  ChevronRight, Download, TrendingUp, AlertTriangle, Play, ThumbsUp,
  Trash2, Phone, Briefcase, Star, Camera
} from 'lucide-react';
import { SecurityHub } from './SecurityHub';
import { TestingHub } from './TestingHub';
import { DocumentationHub } from './DocumentationHub';
import { DeploymentHub } from './DeploymentHub';
import { FutureExpansionHub } from './FutureExpansionHub';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';


export const AdminDashboard: React.FC = () => {
  const { currentPage, selectedComplaintId } = useApp();

  switch (currentPage) {
    case 'admin-dashboard':
      return <AdminHome />;
    case 'admin-complaints':
      return <AdminComplaintsPage />;
    case 'complaint-details':
      return <ComplaintDetailsPage id={selectedComplaintId} />;
    case 'admin-staff':
      return <AdminStaffPage />;
    case 'admin-students':
      return <AdminStudentsPage />;
    case 'admin-analytics':
      return <AdminAnalyticsPage />;
    case 'admin-ai-features':
      return <AIFeaturesHub />;
    case 'admin-security':
      return <SecurityHub />;
    case 'admin-testing':
      return <TestingHub />;
    case 'admin-docs':
      return <DocumentationHub />;
    case 'admin-deployment':
      return <DeploymentHub />;
    case 'admin-expansion':
      return <FutureExpansionHub />;
    case 'admin-settings':
      return <AdminSettingsPage />;
    default:
      return <AdminHome />;
  }
};

// ==========================================
// 1. ADMIN SYSTEM HOME VIEW (OVERVIEW)
// ==========================================
const AdminHome: React.FC = () => {
  const { complaints, users, assignComplaint, setPage, setSelectedComplaintId } = useApp();
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const staffList = users.filter(u => u.role === 'staff');

  const total = complaints.length;
  const pendingReview = complaints.filter(c => c.status === 'new').length;
  const inProgress = complaints.filter(c => c.status === 'assigned' || c.status === 'in-progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
  const critical = complaints.filter(c => c.priority === 'critical' && c.status !== 'closed').length;

  const filteredComplaints = complaints.filter(c => {
    const q = searchTerm.toLowerCase();
    return c.id.toLowerCase().includes(q) ||
           c.title.toLowerCase().includes(q) ||
           c.studentName.toLowerCase().includes(q) ||
           c.description.toLowerCase().includes(q) ||
           c.building.toLowerCase().includes(q) ||
           c.roomNumber.toLowerCase().includes(q);
  });

  const handleTrack = (id: string) => {
    setSelectedComplaintId(id);
    setPage('complaint-details');
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'critical': return 'bg-red-150 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse';
    }
  };

  const getStatusBadge = (s: ComplaintStatus) => {
    switch (s) {
      case 'new': return 'bg-blue-100 text-blue-850 dark:bg-blue-900/30 dark:text-blue-300';
      case 'assigned': return 'bg-amber-100 text-amber-850 dark:bg-amber-900/30 dark:text-amber-300';
      case 'in-progress': return 'bg-purple-100 text-purple-850 dark:bg-purple-900/30 dark:text-purple-300';
      case 'resolved': return 'bg-green-100 text-green-855 dark:bg-green-900/30 dark:text-green-300';
      case 'closed': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-red-100 text-red-850';
    }
  };

  return (
    <div className="space-y-6">
      {/* College Authority Protocol Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white p-5 rounded-2xl border border-indigo-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider">
            <Shield size={12} />
            <span>College Authority Protocol — Assign & Monitor</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight font-display">Campus Facilities Operations Control</h2>
          <p className="text-xs text-indigo-200/80">Receive incoming complaints, assign maintenance staff, and monitor resolution timelines.</p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setPage('admin-complaints')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <UserCheck size={14} /> Assign Complaints
          </button>
          <button
            onClick={() => setPage('admin-analytics')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer"
          >
            <Activity size={14} /> Monitor Live SLAs
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-display">All Complaints</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black font-display">{total}</p>
            <span className="text-[10px] text-green-500 font-bold">+12% wk</span>
          </div>
        </div>

        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-blue-600 font-display">Unassigned (New)</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-blue-600 font-display">{pendingReview}</p>
            <span className="text-[10px] text-blue-500 font-semibold">Needs Action</span>
          </div>
        </div>

        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-amber-500 font-display">Active Repair</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-amber-500 font-display">{inProgress}</p>
            <span className="text-[10px] text-slate-400">In Progress</span>
          </div>
        </div>

        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-green-500 font-display">Resolved Cases</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-green-500 font-display">{resolved}</p>
            <span className="text-[10px] text-green-500 font-bold">98.2% SLA</span>
          </div>
        </div>

        <div className="glass-card border border-red-200 dark:border-red-950/30 rounded-xl p-4 flex flex-col justify-between col-span-2 lg:col-span-1">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-red-500 font-display">Critical Issues</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-red-500 font-display animate-pulse">{critical}</p>
            <span className="text-[9px] bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded-md font-bold font-display">CRITICAL</span>
          </div>
        </div>
      </div>

      {/* Analytics Mini-Dashboard (Visual CSS Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Category Distribution */}
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-xs">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Category Allocations</h4>
            <p className="text-[10px] text-slate-400">Total volume split by specialty teams</p>
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Plumbing Maintenance</span>
                <span>38% (12 Cases)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '38%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Electrical & Wiring</span>
                <span>28% (9 Cases)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>HVAC & Air Cooling</span>
                <span>20% (6 Cases)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Carpentry / Furniture</span>
                <span>14% (4 Cases)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Resolution trends */}
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-xs">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">Resolution Trends (Weekly)</h4>
            <p className="text-[10px] text-slate-400">Completed tasks vs incoming queue</p>
          </div>
          <div className="h-32 flex items-end justify-between pt-4 gap-2">
            {[
              { label: 'Mon', in: 4, out: 3 },
              { label: 'Tue', in: 6, out: 5 },
              { label: 'Wed', in: 8, out: 8 },
              { label: 'Thu', in: 5, out: 6 },
              { label: 'Fri', in: 7, out: 8 },
              { label: 'Sat', in: 3, out: 4 },
              { label: 'Sun', in: 2, out: 3 },
            ].map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-0.5 h-24">
                  {/* incoming */}
                  <div className="w-2.5 bg-blue-50/20 dark:bg-blue-500/10 rounded-t-sm" style={{ height: `${(d.in/10)*100}%` }} title={`Incoming: ${d.in}`} />
                  {/* resolved */}
                  <div className="w-2.5 bg-blue-600 rounded-t-sm" style={{ height: `${(d.out/10)*100}%` }} title={`Resolved: ${d.out}`} />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Department Performance */}
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-xs">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">Technician Response SLA</h4>
            <p className="text-[10px] text-slate-400">Average response times by team</p>
          </div>
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-white/5 pb-1.5">
              <span className="font-semibold">Plumbing Crew</span>
              <span className="text-green-500 font-bold">1.2 hrs avg</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-white/5 pb-1.5">
              <span className="font-semibold">Electrical Crew</span>
              <span className="text-green-500 font-bold">2.4 hrs avg</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-white/5 pb-1.5">
              <span className="font-semibold">HVAC Crew</span>
              <span className="text-amber-500 font-bold">6.8 hrs avg</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Carpentry Crew</span>
              <span className="text-green-500 font-bold">4.1 hrs avg</span>
            </div>
          </div>
        </div>

      </div>

      {/* Admin Task Management Table */}
      <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm font-display">Active Incident Response Board</h3>
            <p className="text-xs text-slate-400 mt-0.5">Assign technicians or track live resolution steps</p>
          </div>
          
          <div className="relative w-full md:w-60">
            <span className="absolute left-3 top-2.5 text-slate-400"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search incidents or ticket IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-xs outline-hidden focus:border-blue-500 transition-all text-slate-850 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="p-4">Incident ID</th>
                <th className="p-4">Student Reporter</th>
                <th className="p-4">Incident Details</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Dispatch</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                    No incidents match "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredComplaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{c.id}</td>
                    <td className="p-4 font-semibold text-slate-850 dark:text-slate-200">{c.studentName}</td>
                    <td className="p-4 max-w-[200px]">
                      <p className="font-semibold truncate">{c.title}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5"><MapPin size={10} /> {c.building} ({c.roomNumber})</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 border text-[10px] font-bold rounded-lg capitalize ${getPriorityBadge(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {c.assignedStaffName ? (
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <UserCheck size={13} className="text-green-500" /> {c.assignedStaffName}
                        </span>
                      ) : (
                        <div className="relative">
                          {assigningId === c.id ? (
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignComplaint(c.id, e.target.value);
                                  setAssigningId(null);
                                }
                              }}
                              className="text-[10px] font-bold border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-[#1E293B] p-1 cursor-pointer outline-hidden focus:border-blue-500"
                              defaultValue=""
                            >
                              <option value="" disabled>Select Staff</option>
                              {staffList.map(st => (
                                <option key={st.id} value={st.id}>{st.name} ({st.department})</option>
                              ))}
                            </select>
                          ) : (
                            <button 
                              onClick={() => setAssigningId(c.id)}
                              className="px-2 py-1 text-[10px] font-bold rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Plus size={10} /> Assign Dispatch
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleTrack(c.id)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Eye size={12} /> Audit Log
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ADMIN COMPLAINTS MANAGEMENT PAGE (DETAILED FILTER/SEARCH)
// ==========================================
const AdminComplaintsPage: React.FC = () => {
  const { complaints, updateComplaintStatus, assignComplaint, deleteComplaint, clearCompletedComplaints, users, setPage, setSelectedComplaintId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const completedCount = complaints.filter(c => ['closed', 'resolved', 'rejected'].includes(c.status)).length;
  const staffList = users.filter(u => u.role === 'staff');

  const filtered = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'critical': return 'bg-red-150 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse';
    }
  };

  const getStatusBadge = (s: ComplaintStatus) => {
    switch (s) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'assigned': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'closed': return 'bg-slate-100 text-slate-800 dark:bg-slate-850 dark:text-slate-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const handleTrack = (id: string) => {
    setSelectedComplaintId(id);
    // Render the Student component's details page which works perfectly for Admins too!
    setPage('complaint-details');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Facilities Incident History</h2>
        <p className="text-xs text-slate-400 mt-0.5">Filter the full database of reported incidents, audits, and SLA timings.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Status Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#1E293B] rounded-xl self-start overflow-x-auto max-w-full">
          {(['all', 'new', 'assigned', 'in-progress', 'resolved', 'closed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize whitespace-nowrap transition-all ${
                statusFilter === st 
                  ? 'bg-white text-slate-900 shadow-smScale dark:bg-[#0F172A] dark:text-white' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-slate-400"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search by student, ID, text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-xs outline-hidden focus:border-blue-500 transition-all"
            />
          </div>

          {completedCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Auto-delete ${completedCount} completed/closed/resolved complaint tickets from the database?`)) {
                  clearCompletedComplaints();
                }
              }}
              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/40 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              title="Auto-delete resolved and closed complaints"
            >
              <Trash2 size={13} /> Clear Completed ({completedCount})
            </button>
          )}
        </div>
      </div>

      {/* Grid List view */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl">
          No complaints registered matching these criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-500 transition-all flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{c.id}</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2.5 py-0.5 border text-[9px] font-bold rounded-full capitalize ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete complaint ${c.id}?`)) {
                          deleteComplaint(c.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                      title="Delete Complaint"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{c.title}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Reporter: {c.studentName}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap justify-between items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {c.building} ({c.roomNumber})
                </span>
                
                <div className="flex items-center gap-2">
                  {c.assignedStaffName ? (
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 px-2 py-0.5 rounded-md">
                      Dispatched: {c.assignedStaffName}
                    </span>
                  ) : (
                    <button 
                      onClick={() => setAssigningId(c.id)}
                      className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 rounded text-[9px] font-bold"
                    >
                      Assign Dispatch
                    </button>
                  )}
                  <button 
                    onClick={() => handleTrack(c.id)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Details <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {assigningId === c.id && (
                <div className="p-3 bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Select Technician Specialist</p>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          assignComplaint(c.id, e.target.value);
                          setAssigningId(null);
                        }
                      }}
                      className="text-xs p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-[#1E293B] flex-1 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Choose Dispatch Staff...</option>
                      {staffList.map(st => (
                        <option key={st.id} value={st.id}>{st.name} ({st.department})</option>
                      ))}
                    </select>
                    <button onClick={() => setAssigningId(null)} className="px-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 rounded text-xs font-bold">X</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. ADMIN STAFF MANAGEMENT PAGE
// ==========================================
const AdminStaffPage: React.FC = () => {
  const { 
    users, 
    addUser, 
    updateUserDepartment, 
    removeUser, 
    complaints, 
    setSelectedComplaintId, 
    setPage 
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Water Leakage');
  const [phone, setPhone] = useState('');
  const [staffId, setStaffId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStaffForTasks, setSelectedStaffForTasks] = useState<User | null>(null);

  const staffList = users.filter(u => u.role === 'staff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Register a new contractor with custom Employee ID and phone details
    addUser(
      name, 
      email, 
      'staff', 
      'Engineering College East', 
      department, 
      staffId || `EMP-${Math.floor(10000 + Math.random() * 90000)}`, 
      phone || '+91 98802 17631'
    );

    setName('');
    setEmail('');
    setPhone('');
    setStaffId('');
    setIsOpen(false);
  };

  const handleDepartmentChange = async (userId: string, newDept: string) => {
    try {
      await updateUserDepartment(userId, newDept);
    } catch (err) {
      console.error("Failed to update staff department:", err);
    }
  };

  const handleDeauthorize = async (userId: string, staffName: string) => {
    const confirm = window.confirm(`Are you sure you want to deauthorize ${staffName}? They will be removed from the technician database directory and unassigned from active cases.`);
    if (confirm) {
      try {
        await removeUser(userId);
      } catch (err) {
        console.error("Failed to remove staff:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="text-blue-500" size={22} />
            On-Site Tech Contractor Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Audit live active dispatch volumes, adjust task trade specialties, and inspect contractor workload queues.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer transition-all"
        >
          <Plus size={15} /> Register New Contractor
        </button>
      </div>

      {/* Staff Grid Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffList.map(st => {
          // Calculate dynamic live workload and metrics for this contractor
          const contractorActiveTasks = complaints.filter(
            c => c.assignedStaffId === st.id && !['resolved', 'closed', 'rejected'].includes(c.status)
          );
          const contractorCompletedTasks = complaints.filter(
            c => c.assignedStaffId === st.id && ['resolved', 'closed'].includes(c.status)
          );
          const ratings = contractorCompletedTasks.map(c => c.feedback?.rating).filter(Boolean) as number[];
          const avgRating = ratings.length > 0 
            ? (ratings.reduce((acc, r) => acc + r, 0) / ratings.length).toFixed(1) 
            : 'N/A';

          return (
            <div key={st.id} className="bg-white dark:bg-[#111625] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
              
              {/* Header and Core Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={st.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                      alt={st.name} 
                      className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{st.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono font-medium">{st.studentId || 'ID: EMP-90321'}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeauthorize(st.id, st.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                    title="Deauthorize Contractor"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Live Specialty Dropdown Assignment */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Assigned Specialty Trade</label>
                  <select
                    value={st.department || 'Others'}
                    onChange={(e) => handleDepartmentChange(st.id, e.target.value)}
                    className="text-xs bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 outline-hidden focus:border-blue-500 text-slate-700 dark:text-slate-200 cursor-pointer w-full font-medium"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tech Info Details */}
                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/50">
                  <p className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {st.email}</p>
                  <p className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {st.phone || '+91 98802 17631'}</p>
                </div>
              </div>

              {/* Performance Indicator Cards */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50/50 dark:bg-[#0B0F19]/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Active Queue</p>
                  <p className={`text-sm font-black font-mono mt-0.5 ${contractorActiveTasks.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {contractorActiveTasks.length}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
                  <p className="text-sm font-black font-mono mt-0.5 text-blue-500">
                    {contractorCompletedTasks.length}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Rating</p>
                  <p className="text-sm font-black font-mono mt-0.5 text-amber-500 flex items-center justify-center gap-0.5">
                    <Star size={10} className="fill-amber-500 text-amber-500 inline" />
                    {avgRating}
                  </p>
                </div>
              </div>

              {/* View Queue Trigger */}
              <button
                type="button"
                onClick={() => setSelectedStaffForTasks(st)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200/40 dark:border-white/5"
              >
                <FileText size={13} /> View Active Work Queue ({contractorActiveTasks.length})
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD CONTRACTOR MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Register Technical Contractor</h3>
                <p className="text-xs text-slate-400 mt-0.5">Onboard a specialized field technician with customized credentials.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Contractor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Plumber"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/30 focus:bg-white dark:focus:bg-[#0B0F19] rounded-xl outline-hidden focus:border-blue-500 text-slate-800 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">College Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/30 focus:bg-white dark:focus:bg-[#0B0F19] rounded-xl outline-hidden focus:border-blue-500 text-slate-800 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Employee ID</label>
                  <input
                    type="text"
                    placeholder="EMP-90321"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/30 focus:bg-white dark:focus:bg-[#0B0F19] rounded-xl outline-hidden focus:border-blue-500 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Phone Contact</label>
                  <input
                    type="text"
                    placeholder="+91 98802 17631"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/30 focus:bg-white dark:focus:bg-[#0B0F19] rounded-xl outline-hidden focus:border-blue-500 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Initial Specialty category</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/30 focus:bg-white dark:focus:bg-[#0B0F19] rounded-xl outline-hidden focus:border-blue-500 text-slate-800 dark:text-slate-100 transition-all cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Submit & Onboard Technician
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED WORK QUEUE DRILLDOWN MODAL */}
      {selectedStaffForTasks && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-xl w-full space-y-4 shadow-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Active Dispatch Work Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Currently assigned tickets on-site for <span className="font-bold text-blue-500">{selectedStaffForTasks.name}</span> ({selectedStaffForTasks.department || 'General'})
                </p>
              </div>
              <button 
                onClick={() => setSelectedStaffForTasks(null)} 
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
              {complaints.filter(c => c.assignedStaffId === selectedStaffForTasks.id && !['resolved', 'closed', 'rejected'].includes(c.status)).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  This technician has no active outstanding tickets. All dispatches resolved!
                </div>
              ) : (
                complaints
                  .filter(c => c.assignedStaffId === selectedStaffForTasks.id && !['resolved', 'closed', 'rejected'].includes(c.status))
                  .map(c => (
                    <div key={c.id} className="border border-slate-150 dark:border-slate-800/80 rounded-xl p-4 space-y-2 bg-slate-50/30 dark:bg-[#0B0F19]/20 hover:border-blue-500/50 transition-all flex flex-col justify-between sm:flex-row sm:items-center sm:gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{c.id}</span>
                          <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase ${
                            c.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            c.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            c.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {c.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium">{c.category}</span>
                        </div>
                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 leading-snug">{c.title}</h5>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin size={10} className="text-red-500" /> {c.building} ({c.roomNumber})
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedComplaintId(c.id);
                          setPage('complaint-details');
                          setSelectedStaffForTasks(null);
                        }}
                        className="self-end sm:self-auto px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 hover:text-blue-700 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-blue-100/30 dark:border-blue-900/30"
                      >
                        Inspect Case <ChevronRight size={12} />
                      </button>
                    </div>
                  ))
              )}
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-end shrink-0">
              <button 
                type="button" 
                onClick={() => setSelectedStaffForTasks(null)}
                className="px-4 py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200"
              >
                Close Queue View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. ADMIN STUDENT DIRECTORY PAGE
// ==========================================
const AdminStudentsPage: React.FC = () => {
  const { users } = useApp();
  const students = users.filter(u => u.role === 'student');

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Student Member Directory</h2>
        <p className="text-xs text-slate-400 mt-0.5 font-sans font-medium">Verify active student enrollment cards registered to the facility portal</p>
      </div>

      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="p-4">Student Card ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">University Campus</th>
                <th className="p-4">Department / Major</th>
                <th className="p-4">Email Address</th>
                <th className="p-4 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                  <td className="p-4 font-mono font-bold text-slate-500">{s.studentId || `STU-${s.id}`}</td>
                  <td className="p-4 font-semibold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    <img src={s.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <span>{s.name}</span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{s.college || 'Engineering College East'}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{s.department || 'Computer Science & Engineering'}</td>
                  <td className="p-4 text-slate-400 font-medium">{s.email}</td>
                  <td className="p-4 text-right text-slate-450 font-bold font-mono">{s.phone || '+1 (555) 019-2834'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. ADVANCED ANALYTICS VIEW
// ==========================================
const AdminAnalyticsPage: React.FC = () => {
  const { complaints, users } = useApp();
  const [activeTab, setActiveTab] = useState<'building' | 'department' | 'time' | 'staff' | 'resolution'>('building');
  const [timeGrouping, setTimeGrouping] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [buildingFilter, setBuildingFilter] = useState<'all' | string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | string>('all');

  // Map category to operational department helper
  const getDepartmentFromCategory = (category: string): string => {
    const c = category.toLowerCase();
    if (c.includes('wi-fi') || c.includes('internet') || c.includes('computer') || c.includes('projector') || c.includes('laboratory equipment')) {
      return 'IT Support & Labs';
    }
    if (c.includes('electricity') || c.includes('fan') || c.includes('light')) {
      return 'Electrical Maintenance';
    }
    if (c.includes('leakage') || c.includes('water') || c.includes('washroom') || c.includes('plumbing')) {
      return 'Plumbing & Water Systems';
    }
    if (c.includes('furniture') || c.includes('bench') || c.includes('desk') || c.includes('carpentry')) {
      return 'Carpentry & Furniture';
    }
    if (c.includes('clean') || c.includes('housekeeping') || c.includes('cleaning')) {
      return 'Housekeeping & Janitorial';
    }
    if (c.includes('library')) {
      return 'Central Library Support';
    }
    if (c.includes('hostel')) {
      return 'Residential Life / Hostel';
    }
    if (c.includes('parking') || c.includes('security')) {
      return 'Security & Parking';
    }
    if (c.includes('sports') || c.includes('garden') || c.includes('road') || c.includes('canteen')) {
      return 'Facilities & Grounds';
    }
    return 'General Operations';
  };

  // Helper: Resolution Hours calculator
  const getResolutionHrs = (c: Complaint): number => {
    const created = new Date(c.createdDate).getTime();
    
    // Find resolved timeline event
    const resolvedEvent = c.timeline?.find(t => t.status === 'resolved' || t.status === 'closed');
    if (resolvedEvent) {
      const resolvedTime = new Date(resolvedEvent.date).getTime();
      return Math.max(0.5, (resolvedTime - created) / (1000 * 60 * 60));
    }
    
    if (c.feedback?.date) {
      const feedbackTime = new Date(c.feedback.date).getTime();
      return Math.max(0.5, (feedbackTime - created) / (1000 * 60 * 60));
    }
    
    // Default fallback mock hours
    const seed = c.id.charCodeAt(c.id.length - 1) % 12;
    return Math.max(1, seed * 3.5 + 2);
  };

  // Pre-filter database for metrics based on selection
  const filteredComplaints = complaints.filter(c => {
    const isPending = ['new', 'assigned', 'in-progress'].includes(c.status);
    const isResolved = ['resolved', 'closed'].includes(c.status);
    
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'pending' ? isPending :
      isResolved;
      
    const matchesBuilding = buildingFilter === 'all' || c.building === buildingFilter;
    const matchesDepartment = departmentFilter === 'all' || getDepartmentFromCategory(c.category) === departmentFilter;
    
    return matchesStatus && matchesBuilding && matchesDepartment;
  });

  const totalCount = filteredComplaints.length;
  const pendingCount = filteredComplaints.filter(c => ['new', 'assigned', 'in-progress'].includes(c.status)).length;
  const resolvedCount = filteredComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;

  // Real-time SLA compliance check
  const resolvedWithTime = filteredComplaints.filter(c => ['resolved', 'closed'].includes(c.status));
  const slaMetCount = resolvedWithTime.filter(c => {
    const hrs = getResolutionHrs(c);
    if (['high', 'critical'].includes(c.priority)) {
      return hrs <= 24; // Critical/High SLA 24 hours
    }
    return hrs <= 48; // Normal SLA 48 hours
  }).length;

  const slaMetPercent = resolvedWithTime.length > 0
    ? (slaMetCount / resolvedWithTime.length) * 100
    : 92.5; // default high standard if no resolves in filter

  const avgResolutionHours = resolvedWithTime.length > 0
    ? resolvedWithTime.reduce((acc, c) => acc + getResolutionHrs(c), 0) / resolvedWithTime.length
    : 16.8; // default benchmark

  // 🏢 Group by Building
  const buildingGroups = BUILDINGS.map(bldg => {
    const bldgComplaints = filteredComplaints.filter(c => c.building === bldg);
    const total = bldgComplaints.length;
    const pending = bldgComplaints.filter(c => ['new', 'assigned', 'in-progress'].includes(c.status)).length;
    const resolved = bldgComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;
    
    const resolvedSet = bldgComplaints.filter(c => ['resolved', 'closed'].includes(c.status));
    const avgTime = resolvedSet.length > 0
      ? resolvedSet.reduce((acc, c) => acc + getResolutionHrs(c), 0) / resolvedSet.length
      : 12.0 + (bldg.charCodeAt(0) % 8);
      
    return { name: bldg, total, pending, resolved, avgTime };
  }).filter(g => g.total > 0 || buildingFilter === 'all');

  // 🗂️ Group by Department
  const DEPARTMENTS = Array.from(new Set(CATEGORIES.map(getDepartmentFromCategory)));
  const departmentGroups = DEPARTMENTS.map(dept => {
    const deptComplaints = filteredComplaints.filter(c => getDepartmentFromCategory(c.category) === dept);
    const total = deptComplaints.length;
    const pending = deptComplaints.filter(c => ['new', 'assigned', 'in-progress'].includes(c.status)).length;
    const resolved = deptComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;
    
    const resolvedSet = deptComplaints.filter(c => ['resolved', 'closed'].includes(c.status));
    const avgTime = resolvedSet.length > 0
      ? resolvedSet.reduce((acc, c) => acc + getResolutionHrs(c), 0) / resolvedSet.length
      : 10.5 + (dept.charCodeAt(0) % 10);
      
    return { name: dept, total, pending, resolved, avgTime };
  }).filter(g => g.total > 0 || departmentFilter === 'all');

  // 📅 Chronological Grouping
  const getPeriodKey = (c: Complaint) => {
    const date = new Date(c.createdDate);
    if (timeGrouping === 'yearly') {
      return String(date.getFullYear());
    } else if (timeGrouping === 'monthly') {
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    } else {
      // Weekly: start Monday
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const mon = new Date(date.setDate(diff));
      return "Wk of " + mon.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  const periodMap: { [key: string]: { total: number; pending: number; resolved: number } } = {};
  filteredComplaints.forEach(c => {
    const key = getPeriodKey(c);
    if (!periodMap[key]) {
      periodMap[key] = { total: 0, pending: 0, resolved: 0 };
    }
    periodMap[key].total += 1;
    if (['new', 'assigned', 'in-progress'].includes(c.status)) {
      periodMap[key].pending += 1;
    } else {
      periodMap[key].resolved += 1;
    }
  });

  const periodGroups = Object.keys(periodMap).map(key => ({
    name: key,
    total: periodMap[key].total,
    pending: periodMap[key].pending,
    resolved: periodMap[key].resolved
  })).sort((a, b) => {
    // Sort chronological helper
    if (a.name.includes('Wk') && b.name.includes('Wk')) {
      return a.name.localeCompare(b.name);
    }
    return new Date(a.name).getTime() - new Date(b.name).getTime();
  });

  // 👷 Staff Performance
  const staffMembers = users.filter(u => u.role === 'staff');
  const staffPerformance = staffMembers.map(st => {
    const assignedComplaints = complaints.filter(c => c.assignedStaffId === st.id);
    const totalAssigned = assignedComplaints.length;
    const resolvedSet = assignedComplaints.filter(c => ['resolved', 'closed'].includes(c.status));
    const totalResolved = resolvedSet.length;
    const pending = totalAssigned - totalResolved;
    
    const avgSpeed = totalResolved > 0
      ? resolvedSet.reduce((acc, c) => acc + getResolutionHrs(c), 0) / totalResolved
      : 8.4 + (st.name.charCodeAt(0) % 5);
      
    const ratingFeedback = resolvedSet.filter(c => c.feedback?.rating);
    const avgRating = ratingFeedback.length > 0
      ? ratingFeedback.reduce((acc, c) => acc + (c.feedback?.rating || 0), 0) / ratingFeedback.length
      : 4.5 + (st.name.charCodeAt(st.name.length - 1) % 6) * 0.1;

    return {
      name: st.name,
      department: st.department || 'Specialist Operations',
      assigned: totalAssigned,
      resolved: totalResolved,
      pending,
      avgSpeed,
      avgRating
    };
  });

  // ⏱️ Resolution Speed Priorities
  const priorities: PriorityLevel[] = ['low', 'medium', 'high', 'critical'];
  const priorityMetrics = priorities.map(pr => {
    const prComplaints = complaints.filter(c => c.priority === pr);
    const total = prComplaints.length;
    const resolvedSet = prComplaints.filter(c => ['resolved', 'closed'].includes(c.status));
    const resolvedCountVal = resolvedSet.length;
    const avgSpeed = resolvedCountVal > 0
      ? resolvedSet.reduce((acc, c) => acc + getResolutionHrs(c), 0) / resolvedCountVal
      : pr === 'critical' ? 2.5 : pr === 'high' ? 6.2 : pr === 'medium' ? 14.5 : 28.0;

    const targetHrs = pr === 'critical' ? 4 : pr === 'high' ? 12 : pr === 'medium' ? 24 : 48;
    const metSla = resolvedSet.filter(c => getResolutionHrs(c) <= targetHrs).length;
    const slaCompliance = resolvedCountVal > 0 ? (metSla / resolvedCountVal) * 100 : 100;

    return { name: pr, total, resolved: resolvedCountVal, avgSpeed, targetHrs, slaCompliance };
  });

  // Export PDF Report Generator
  const handleExportPDF = () => {
    let reportTitle = "";
    let headers: string[] = [];
    let rows: any[][] = [];

    if (activeTab === 'building') {
      reportTitle = "Building Wise Incidents SLA Report";
      headers = ["Building Location", "Total Reported", "Active Pending", "Resolved Tickets", "Avg SLA Time (Hrs)"];
      rows = buildingGroups.map(g => [g.name, g.total, g.pending, g.resolved, g.avgTime.toFixed(1)]);
    } else if (activeTab === 'department') {
      reportTitle = "Department Wise Operations SLA Report";
      headers = ["Specialist Department", "Total Reported", "Active Pending", "Resolved Tickets", "Avg SLA Time (Hrs)"];
      rows = departmentGroups.map(g => [g.name, g.total, g.pending, g.resolved, g.avgTime.toFixed(1)]);
    } else if (activeTab === 'time') {
      reportTitle = `Incident Timeline Trend Report (${timeGrouping.toUpperCase()})`;
      headers = ["Date Period", "Total Logged", "Active Pending", "Completed Resolved"];
      rows = periodGroups.map(g => [g.name, g.total, g.pending, g.resolved]);
    } else if (activeTab === 'staff') {
      reportTitle = "Technician Staff SLA Performance Review";
      headers = ["Technician Name", "Specialty Dept", "Assigned Works", "Resolved Works", "Pending Backlog", "Avg SLA Speed (Hrs)", "Rating"];
      rows = staffPerformance.map(s => [s.name, s.department, s.assigned, s.resolved, s.pending, s.avgSpeed.toFixed(1), s.avgRating.toFixed(1)]);
    } else if (activeTab === 'resolution') {
      reportTitle = "SLA Resolution Speed Priority Matrix";
      headers = ["Urgency Priority", "Logged Tickets", "Resolved Tickets", "Avg Speed (Hrs)", "SLA Target (Hrs)", "Compliance %"];
      rows = priorityMetrics.map(p => [p.name.toUpperCase(), p.total, p.resolved, p.avgSpeed.toFixed(1), p.targetHrs, `${p.slaCompliance.toFixed(0)}%`]);
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("CampusCare AI™ SLA Analytics & Audit System", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-400
    doc.text(`Core Segment: ${reportTitle}`, 14, 28);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 14, 34);
    doc.text(`Total Audited Incidents: ${totalCount} (Pending backlog: ${pendingCount}, Completed: ${resolvedCount})`, 14, 40);

    doc.setLineWidth(0.4);
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(14, 44, 282, 44);

    let y = 54;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);

    const colWidths = headers.map(() => 268 / headers.length);
    let currentX = 14;
    headers.forEach((h, i) => {
      doc.text(h, currentX, y);
      currentX += colWidths[i];
    });

    y += 4;
    doc.line(14, y, 282, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    rows.forEach((row) => {
      if (y > 185) {
        doc.addPage('landscape');
        y = 20;
        doc.setFont("helvetica", "bold");
        currentX = 14;
        headers.forEach((h, i) => {
          doc.text(h, currentX, y);
          currentX += colWidths[i];
        });
        y += 4;
        doc.line(14, y, 282, y);
        y += 8;
        doc.setFont("helvetica", "normal");
      }

      currentX = 14;
      row.forEach((cell, i) => {
        doc.text(String(cell), currentX, y);
        currentX += colWidths[i];
      });
      y += 8;
    });

    const filename = `${reportTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_audit_report.pdf`;
    doc.save(filename);
  };

  // Export Excel Report Generator
  const handleExportExcel = async () => {
    let reportTitle = "";
    let headers: string[] = [];
    let rows: any[][] = [];

    if (activeTab === 'building') {
      reportTitle = "Building Wise Incidents";
      headers = ["Building Location", "Total Logged", "Pending Count", "Resolved Count", "Avg Resolution Time (Hours)"];
      rows = buildingGroups.map(g => [g.name, g.total, g.pending, g.resolved, Number(g.avgTime.toFixed(1))]);
    } else if (activeTab === 'department') {
      reportTitle = "Department Wise Incidents";
      headers = ["Specialty Department", "Total Logged", "Pending Count", "Resolved Count", "Avg Resolution Time (Hours)"];
      rows = departmentGroups.map(g => [g.name, g.total, g.pending, g.resolved, Number(g.avgTime.toFixed(1))]);
    } else if (activeTab === 'time') {
      reportTitle = `Chronological SLA Trends (${timeGrouping})`;
      headers = ["Reporting Period", "Total Registered", "Pending Backlog", "Resolved Successfully"];
      rows = periodGroups.map(g => [g.name, g.total, g.pending, g.resolved]);
    } else if (activeTab === 'staff') {
      reportTitle = "Staff SLA Performance metrics";
      headers = ["Staff Name", "Specialty Department", "Assigned Worklists", "Resolved Tickets", "Pending Backlog", "Avg SLA Time (Hours)", "Customer Rating (1-5)"];
      rows = staffPerformance.map(s => [s.name, s.department, s.assigned, s.resolved, s.pending, Number(s.avgSpeed.toFixed(1)), Number(s.avgRating.toFixed(1))]);
    } else if (activeTab === 'resolution') {
      reportTitle = "Priority Response SLA Speed Matrix";
      headers = ["Severity Priority", "Total Logged", "Resolved Count", "Avg Speed (Hours)", "SLA Target Speed (Hours)", "Compliance Rate %"];
      rows = priorityMetrics.map(p => [p.name, p.total, p.resolved, Number(p.avgSpeed.toFixed(1)), p.targetHrs, `${p.slaCompliance.toFixed(1)}%`]);
    }

    const worksheetData = [
      ["CAMPUSCARE AI™ SYSTEMS ENTERPRISE COMPLIANCE REPORT"],
      [`Scope of Study: ${reportTitle}`],
      [`Generated On: ${new Date().toLocaleString()}`],
      [`Metrics context: Total filtered is ${totalCount} (Pending: ${pendingCount}, Resolved: ${resolvedCount})`],
      [], // separator
      headers,
      ...rows
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SLA Summary Data");

    // Add all rows from worksheetData
    worksheetData.forEach(row => {
      worksheet.addRow(row);
    });

    // Config column sizes
    const colWidths = headers.map((h, colIdx) => {
      let maxLen = h.length;
      rows.forEach(r => {
        const strVal = String(r[colIdx] || "");
        if (strVal.length > maxLen) maxLen = strVal.length;
      });
      return { width: Math.min(36, maxLen + 3) };
    });
    worksheet.columns = colWidths;

    const filename = `${reportTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_spreadsheet.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render horizontal bar chart helper (for Building/Dept)
  const renderHorizontalBars = (data: { name: string; total: number; pending: number; resolved: number }[]) => {
    const maxVal = Math.max(...data.map(d => d.total), 1);
    return (
      <div className="space-y-4">
        {data.map((item, idx) => {
          const percent = (item.total / maxVal) * 100;
          const resolvedPercent = item.total > 0 ? (item.resolved / item.total) * 100 : 0;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-650 dark:text-slate-300">
                <span className="truncate max-w-[200px]">{item.name}</span>
                <span>
                  {item.total} logged ({item.resolved} resolved, {item.pending} pending)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-green-500 h-full transition-all duration-550" 
                  style={{ width: `${percent * (resolvedPercent / 100)}%` }} 
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-550" 
                  style={{ width: `${percent * ((100 - resolvedPercent) / 100)}%` }} 
                />
              </div>
            </div>
          );
        })}
        <div className="flex items-center gap-4 pt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Resolved Tasks
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending Backlog
          </div>
        </div>
      </div>
    );
  };

  // Render SVG Trend line helper
  const renderTrendSVG = () => {
    if (periodGroups.length === 0) {
      return (
        <div className="h-[200px] flex items-center justify-center text-xs text-slate-400">
          Not enough historical sequence data in filter scope.
        </div>
      );
    }

    const maxValue = Math.max(...periodGroups.map(g => g.total), 4);
    const width = 500;
    const height = 200;
    const padding = 35;
    
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    const points = periodGroups.map((g, idx) => {
      const x = padding + (idx / Math.max(1, periodGroups.length - 1)) * chartW;
      const y = height - padding - (g.total / maxValue) * chartH;
      return { x, y, ...g };
    });

    const pathD = points.length > 0 ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` : '';
    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z` 
      : '';

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-600">
          <defs>
            <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const y = height - padding - r * chartH;
            return (
              <g key={i}>
                <line 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="currentColor" 
                  strokeOpacity="0.08" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={padding - 8} 
                  y={y + 3} 
                  className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] font-bold text-right"
                  textAnchor="end"
                >
                  {Math.round(r * maxValue)}
                </text>
              </g>
            );
          })}

          {/* Paths */}
          {points.length > 0 && (
            <>
              <path d={areaD} fill="url(#trendAreaGradient)" />
              <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="4.5" 
                fill="#3B82F6" 
                stroke="#FFFFFF" 
                strokeWidth="1.5"
                className="transition-all duration-150 hover:r-[6.5]" 
              />
              <text 
                x={p.x} 
                y={height - padding + 15} 
                className="fill-slate-400 dark:fill-slate-500 font-mono text-[8px] font-bold"
                textAnchor="middle"
              >
                {p.name}
              </text>
              <title>{`${p.name}: ${p.total} tickets`}</title>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upper header section */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">SLA Compliance & Operations Intelligence</h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter real-time university infrastructure metrics, view technician response logs, and export certified compliance audits.</p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportPDF}
            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/35 border border-red-200/50 dark:border-red-900/30 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText size={14} /> PDF Report
          </button>
          <button 
            onClick={handleExportExcel}
            className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400 dark:hover:bg-green-950/35 border border-green-200/50 dark:border-green-900/30 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={14} /> Excel Spreadsheet
          </button>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#1E293B] rounded-xl self-start max-w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab('building')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'building' 
              ? 'bg-white text-slate-900 shadow-smScale dark:bg-[#0F172A] dark:text-white' 
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          🏢 Location Wise
        </button>
        <button
          onClick={() => setActiveTab('department')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'department' 
              ? 'bg-white text-slate-900 shadow-smScale dark:bg-[#0F172A] dark:text-white' 
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          🗂️ Department Wise
        </button>
        <button
          onClick={() => setActiveTab('time')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'time' 
              ? 'bg-white text-slate-900 shadow-smScale dark:bg-[#0F172A] dark:text-white' 
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          📅 Chronological trends
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'staff' 
              ? 'bg-white text-slate-900 shadow-smScale dark:bg-[#0F172A] dark:text-white' 
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          👷 Staff Performance
        </button>
        <button
          onClick={() => setActiveTab('resolution')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'resolution' 
              ? 'bg-white text-slate-900 shadow-smScale dark:bg-[#0F172A] dark:text-white' 
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          ⏱️ Speed Resolution Priorities
        </button>
      </div>

      {/* Filter and configuration bar */}
      <div className="p-4 bg-slate-50 dark:bg-[#1E293B]/45 border border-slate-200/60 dark:border-slate-800 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Scope</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] rounded-lg outline-hidden min-w-[120px] cursor-pointer"
            >
              <option value="all">🔍 Show All Statuses</option>
              <option value="pending">⚠️ Pending Issues Only</option>
              <option value="resolved">✓ Resolved / Closed Only</option>
            </select>
          </div>

          {/* Building Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facility Building</span>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="text-xs p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] rounded-lg outline-hidden min-w-[150px] max-w-[200px] cursor-pointer"
            >
              <option value="all">🏢 All Campus Buildings</option>
              {BUILDINGS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Specialty</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] rounded-lg outline-hidden min-w-[150px] cursor-pointer"
            >
              <option value="all">🗂️ All Specialty Teams</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chronological sub-toggles */}
        {activeTab === 'time' && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Group Trend By</span>
            <div className="flex gap-1 p-0.5 bg-slate-200 dark:bg-slate-800 rounded-lg">
              {(['weekly', 'monthly', 'yearly'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setTimeGrouping(g)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md capitalize transition-all cursor-pointer ${
                    timeGrouping === g 
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-[#0F172A] dark:text-white' 
                      : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-250'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards KPI Display */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scope Incidents</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">{totalCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Logged Tickets</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-amber-550 dark:text-amber-450 uppercase tracking-wider">Pending Backlog</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-450">{pendingCount}</span>
            <span className="text-xs text-slate-400 font-semibold">
              ({totalCount > 0 ? ((pendingCount / totalCount) * 100).toFixed(0) : 0}%) Active
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-green-600 dark:text-green-450 uppercase tracking-wider">Resolved Tickets</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600 dark:text-green-400">{resolvedCount}</span>
            <span className="text-xs text-slate-400 font-semibold">
              ({totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(0) : 0}%) Handled
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-450 uppercase tracking-wider">SLA Met Compliance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {slaMetPercent.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-0.5">
              <ThumbsUp size={11} className="text-blue-500" /> Avg {avgResolutionHours.toFixed(1)} hrs
            </span>
          </div>
        </div>
      </div>

      {/* Main analytical layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Table Report */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs overflow-hidden">
          <h3 className="font-bold text-sm mb-3 font-display tracking-tight flex items-center gap-1.5">
            <Activity size={16} className="text-blue-500" /> Audit Ledger Registry
          </h3>
          
          <div className="overflow-x-auto">
            {activeTab === 'building' && (
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-2.5">Building Location</th>
                    <th className="pb-2.5 text-center">Total</th>
                    <th className="pb-2.5 text-center text-amber-500">Pending</th>
                    <th className="pb-2.5 text-center text-green-500">Resolved</th>
                    <th className="pb-2.5 text-right">Avg SLA Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {buildingGroups.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">{g.name}</td>
                      <td className="py-2.5 text-center">{g.total}</td>
                      <td className="py-2.5 text-center text-amber-500">{g.pending}</td>
                      <td className="py-2.5 text-center text-green-500">{g.resolved}</td>
                      <td className="py-2.5 text-right font-mono text-[10px] font-bold">{g.avgTime.toFixed(1)} Hrs</td>
                    </tr>
                  ))}
                  {buildingGroups.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">No matching building logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'department' && (
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-2.5">Operational Department</th>
                    <th className="pb-2.5 text-center">Total</th>
                    <th className="pb-2.5 text-center text-amber-500">Pending</th>
                    <th className="pb-2.5 text-center text-green-500">Resolved</th>
                    <th className="pb-2.5 text-right">Avg SLA Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {departmentGroups.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">{g.name}</td>
                      <td className="py-2.5 text-center">{g.total}</td>
                      <td className="py-2.5 text-center text-amber-500">{g.pending}</td>
                      <td className="py-2.5 text-center text-green-500">{g.resolved}</td>
                      <td className="py-2.5 text-right font-mono text-[10px] font-bold">{g.avgTime.toFixed(1)} Hrs</td>
                    </tr>
                  ))}
                  {departmentGroups.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">No matching department logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'time' && (
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-2.5">Date Period</th>
                    <th className="pb-2.5 text-center">Total Tickets</th>
                    <th className="pb-2.5 text-center text-amber-500">Active Pending</th>
                    <th className="pb-2.5 text-right text-green-500">Resolved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {periodGroups.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">{g.name}</td>
                      <td className="py-2.5 text-center">{g.total}</td>
                      <td className="py-2.5 text-center text-amber-500">{g.pending}</td>
                      <td className="py-2.5 text-right text-green-500">{g.resolved}</td>
                    </tr>
                  ))}
                  {periodGroups.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">No historical period sequences available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'staff' && (
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-2.5">Technician Specialist</th>
                    <th className="pb-2.5">Department Specialty</th>
                    <th className="pb-2.5 text-center">Assigned</th>
                    <th className="pb-2.5 text-center text-green-500">Resolved</th>
                    <th className="pb-2.5 text-center text-amber-500">Pending</th>
                    <th className="pb-2.5 text-center">Avg SLA Speed</th>
                    <th className="pb-2.5 text-right text-amber-500">SLA Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {staffPerformance.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">{s.name}</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">{s.department}</td>
                      <td className="py-2.5 text-center">{s.assigned}</td>
                      <td className="py-2.5 text-center text-green-500">{s.resolved}</td>
                      <td className="py-2.5 text-center text-amber-550">{s.pending}</td>
                      <td className="py-2.5 text-center font-mono text-[10px]">{s.avgSpeed.toFixed(1)} Hrs</td>
                      <td className="py-2.5 text-right text-amber-500 font-bold">★ {s.avgRating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'resolution' && (
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-2.5">Severity Priority</th>
                    <th className="pb-2.5 text-center">Total Logged</th>
                    <th className="pb-2.5 text-center">Resolved</th>
                    <th className="pb-2.5 text-center text-blue-500">Avg Speed (hrs)</th>
                    <th className="pb-2.5 text-center">SLA Target (hrs)</th>
                    <th className="pb-2.5 text-right text-green-500">SLA Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {priorityMetrics.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="py-3 font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">{p.name}</td>
                      <td className="py-3 text-center">{p.total}</td>
                      <td className="py-3 text-center">{p.resolved}</td>
                      <td className="py-3 text-center font-mono text-[10px] text-blue-500 font-bold">{p.avgSpeed.toFixed(1)} Hrs</td>
                      <td className="py-3 text-center font-mono text-[10px] text-slate-400">{p.targetHrs} Hrs</td>
                      <td className="py-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold font-mono ${
                          p.slaCompliance >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400' :
                          p.slaCompliance >= 75 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400' :
                          'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400'
                        }`}>
                          {p.slaCompliance.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Interactive custom SVG chart */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm font-display tracking-tight flex items-center gap-1.5">
            <TrendingUp size={16} className="text-blue-500" /> Interactive visual audit
          </h3>

          <div className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl bg-slate-50/30 dark:bg-[#0F172A]/10 min-h-[220px] flex flex-col justify-center">
            {activeTab === 'building' && (
              buildingGroups.length > 0 
                ? renderHorizontalBars(buildingGroups) 
                : <p className="text-xs text-slate-400 text-center font-medium">Select a broader filter to view locations heatmap.</p>
            )}

            {activeTab === 'department' && (
              departmentGroups.length > 0 
                ? renderHorizontalBars(departmentGroups) 
                : <p className="text-xs text-slate-400 text-center font-medium">Select a broader filter to view department analytics.</p>
            )}

            {activeTab === 'time' && renderTrendSVG()}

            {activeTab === 'staff' && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Workload distribution & user feedback scores</p>
                <div className="grid grid-cols-1 gap-3">
                  {staffPerformance.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{s.name}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">{s.department}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-500">{s.assigned} tasks assigned</span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold font-mono text-[10px]">
                          ★ {s.avgRating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resolution' && (
              <div className="space-y-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-center">Actual SLA Speed vs Priority Target Hour limits</p>
                <div className="space-y-3">
                  {priorityMetrics.map((p, idx) => {
                    const ratio = Math.min(100, (p.avgSpeed / Math.max(1, p.targetHrs)) * 100);
                    return (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="capitalize">{p.name} Urgency</span>
                          <span className="font-mono text-[10px]">
                            {p.avgSpeed.toFixed(1)} Hrs (SLA Target: {p.targetHrs}h)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-550 ${
                              p.avgSpeed <= p.targetHrs ? 'bg-green-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${ratio}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 6. ADMIN PORTAL SETTINGS PAGE
// ==========================================
const AdminSettingsPage: React.FC = () => {
  const { currentUser, updateUserAvatar, toggleDarkMode, isDarkMode } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoMsg, setPhotoMsg] = useState('');

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Admin')}&background=2563eb&color=fff&size=200`;

  const adminAvatarPresets = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader.result) {
        await updateUserAvatar(reader.result as string);
        setPhotoMsg('Profile photo updated successfully!');
        setTimeout(() => setPhotoMsg(''), 4000);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (url: string) => {
    setUploading(true);
    await updateUserAvatar(url);
    setPhotoMsg('Profile photo updated successfully!');
    setTimeout(() => setPhotoMsg(''), 4000);
    setUploading(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Portal Configuration</h2>
        <p className="text-xs text-slate-400 mt-0.5">Customize notification webhooks, personal profiles, and theme preferences.</p>
      </div>

      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* Profile Photo Section */}
        <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 className="font-bold text-sm">Profile Picture & Credential Photo</h3>
          {photoMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={14} /> {photoMsg}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <img 
                src={currentUser?.avatar || fallbackAvatar} 
                alt={currentUser?.name || 'Admin'} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-800"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
                }}
              />
              <label 
                htmlFor="admin-avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md cursor-pointer transition-all hover:scale-105"
                title="Upload new profile photo"
              >
                <Camera size={14} />
              </label>
              <input 
                type="file" 
                id="admin-avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400">College Authority • {currentUser?.college || 'Institution Node'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1.5">Or Choose a Preset Avatar</p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {adminAvatarPresets.map((presetUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(presetUrl)}
                      className="w-7 h-7 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                      title={`Avatar option ${idx + 1}`}
                    >
                      <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="font-bold text-sm">Personal Profile</h3>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">College Authority Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Primary Contact Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          {saved && (
            <p className="text-xs text-green-500 font-bold">Profile parameters successfully persisted!</p>
          )}

          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md transition-all cursor-pointer"
          >
            <Save size={14} /> Persist Profile
          </button>
        </form>

        {/* Theme Settings */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <h3 className="font-bold text-sm">Visual Environment</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">Toggle Portal Dark Mode</p>
              <p className="text-[10px] text-slate-400">Reduce eye fatigue during late system monitoring rounds.</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-all relative ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

      </div>

      <div className="mt-6">
        <NotificationSettings />
      </div>
    </div>
  );
};
