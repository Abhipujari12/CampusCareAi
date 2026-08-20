import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';
import { ComplaintStatus, PriorityLevel } from '../types';
import { ComplaintStatusTimeline } from '../components/ComplaintStatusTimeline';
import { 
  MapPin, Star, Send, Calendar, User, Clock, 
  MessageSquare, ChevronLeft, ShieldCheck, Flame, 
  Info, AlertTriangle, FileText, Download, Trash2
} from 'lucide-react';

interface DetailsProps {
  id: string | null;
}

export const ComplaintDetailsPage: React.FC<DetailsProps> = ({ id }) => {
  const { complaints, addComment, submitFeedback, deleteComplaint, setPage, currentUser } = useApp();
  const [commentText, setCommentText] = useState('');
  
  // Rating states
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const c = complaints.find(item => item.id === id);
  
  if (!c) {
    return (
      <div className="text-center py-12" id="complaint-not-found-container">
        <p className="text-sm text-slate-400">Complaint not found.</p>
        <button 
          onClick={() => {
            if (currentUser?.role === 'admin') setPage('admin-dashboard');
            else if (currentUser?.role === 'staff') setPage('staff-dashboard');
            else setPage('home');
          }} 
          className="text-blue-600 dark:text-blue-450 underline font-bold mt-2 cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(c.id, commentText);
    setCommentText('');
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(c.id, rating, feedbackComment);
    setIsFeedbackOpen(false);
  };

  const handleExportSinglePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(`CampusCare AI™ - Ticket ${c.id} Report`, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Title: ${c.title}`, 14, 28);
    doc.text(`Location: ${c.building} (${c.roomNumber})`, 14, 34);
    doc.text(`Category: ${c.category}  |  Priority: ${c.priority.toUpperCase()}  |  Status: ${c.status.toUpperCase()}`, 14, 40);
    doc.text(`Student Reporter: ${c.studentName}`, 14, 46);
    doc.text(`Assigned Technician: ${c.assignedStaffName || 'Unassigned'}`, 14, 52);

    doc.setLineWidth(0.4);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 58, 196, 58);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Description:", 14, 68);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(c.description || 'N/A', 180);
    doc.text(splitDesc, 14, 76);

    let y = 76 + (splitDesc.length * 6) + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Timeline Events:", 14, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    (c.timeline || []).forEach(item => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`• [${item.status.toUpperCase()}] ${new Date(item.date).toLocaleString()} - ${item.label}`, 14, y);
      y += 5;
      doc.text(`   ${item.description}`, 14, y);
      y += 7;
    });

    doc.save(`Ticket_${c.id}_Report.pdf`);
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      case 'medium': return 'bg-amber-50 text-amber-850 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'high': return 'bg-orange-50 text-orange-850 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30';
      case 'critical': return 'bg-red-50 text-red-950 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40 animate-pulse';
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'assigned': return 'bg-amber-500';
      case 'in-progress': return 'bg-purple-600';
      case 'resolved': return 'bg-green-600';
      case 'closed': return 'bg-slate-500';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-slate-400';
    }
  };

  const handleBack = () => {
    if (currentUser?.role === 'admin') {
      setPage('admin-complaints');
    } else if (currentUser?.role === 'staff') {
      setPage('staff-dashboard');
    } else {
      setPage('my-complaints');
    }
  };

  return (
    <div className="space-y-6" id={`complaint-details-view-${c.id}`}>
      {/* Upper Navigation & Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={handleBack}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer mb-2"
          >
            <ChevronLeft size={14} /> Back to List
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 font-display">
              Ticket {c.id} Details
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold capitalize ${getStatusColor(c.status)}`}>
              {c.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Submitted on {new Date(c.createdDate).toLocaleString()}</p>
        </div>
        
        {/* Actions & Reporter info badge */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExportSinglePDF}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Download size={13} /> Download Ticket PDF
          </button>
          
          {(currentUser?.role === 'admin' || currentUser?.name === c.studentName) && (
            <button 
              onClick={async () => {
                if (window.confirm(`Are you sure you want to permanently delete complaint ${c.id}?`)) {
                  await deleteComplaint(c.id);
                  handleBack();
                }
              }}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/40 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Trash2 size={13} /> Delete Ticket
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/30">
            <User size={13} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-350">Reporter: {c.studentName}</span>
          </div>
        </div>
      </div>

      {/* Prominent Visual Stepper & Status timeline */}
      <ComplaintStatusTimeline status={c.status} timeline={c.timeline} />

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Ticket details & Case discussions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/40 dark:border-white/5 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{c.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-red-500" /> {c.building} ({c.roomNumber})</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-350">{c.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2.5 py-1 border text-[10px] font-bold rounded-lg capitalize ${getPriorityBadge(c.priority)}`}>
                  {c.priority} Priority
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description of Issue</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-[#0F172A]/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 whitespace-pre-wrap">
                {c.description}
              </p>
            </div>

            {/* Uploaded Images */}
            {c.images && c.images.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Student Attachment</p>
                <div className="flex flex-wrap gap-3">
                  {c.images.map((img, idx) => (
                    <div key={idx} className="group relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                      <img src={img} alt="attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CampusCare AI Visual Audit results */}
            {c.aiVerification && (
              <div className="mt-4 p-4 border border-blue-100/40 dark:border-blue-900/30 rounded-2xl bg-blue-50/15 dark:bg-blue-950/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-tight text-slate-800 dark:text-slate-100 font-display flex items-center gap-1">
                      <ShieldCheck className="text-blue-500" size={16} /> CampusCare AI™ Visual Audit Proof
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                      c.aiVerification.isGenuine 
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'
                    }`}>
                      {c.aiVerification.isGenuine ? '✓ Genuine Defect' : '⚠️ Unverified'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-400">
                    Confidence: {(c.aiVerification.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Label: {c.aiVerification.label}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    {c.aiVerification.details}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">AI Category: {c.aiVerification.suggestedCategory}</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md capitalize">AI Severity: {c.aiVerification.severity}</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono">Audited: {new Date(c.aiVerification.checkedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Repair Images */}
            {c.repairImages && c.repairImages.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resolution Proof (Staff Photo)</p>
                <div className="flex flex-wrap gap-3">
                  {c.repairImages.map((img, idx) => (
                    <div key={idx} className="group relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                      <img src={img} alt="repair resolution proof" className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved Call-to-Action for closing with feedback (Student only) */}
            {c.status === 'resolved' && currentUser?.role === 'student' && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-150 dark:border-green-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse">
                <div>
                  <p className="text-xs font-bold text-green-800 dark:text-green-300">Repair Concluded!</p>
                  <p className="text-[11px] text-green-600 dark:text-green-400">Please review the repair quality and close the complaint.</p>
                </div>
                <button 
                  onClick={() => setIsFeedbackOpen(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Rate & Close Ticket
                </button>
              </div>
            )}
          </div>

          {/* Comments Panel */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/40 dark:border-white/5 rounded-2xl p-6 space-y-4 shadow-xs">
            <h4 className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-500" />
              Case Discussion / Comments
            </h4>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 divide-y divide-slate-100 dark:divide-slate-800">
              {c.comments.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">No discussion notes yet on this case.</p>
              ) : (
                c.comments.map((comm, idx) => (
                  <div key={comm.id} className={`pt-3 ${idx === 0 ? 'pt-0' : ''} flex items-start gap-3`}>
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs uppercase shrink-0">
                      {comm.authorName[0]}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{comm.authorName}</span>
                          <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                            comm.authorRole === 'admin' 
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/20' 
                              : comm.authorRole === 'staff'
                              ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                          }`}>
                            {comm.authorRole}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(comm.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{comm.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Post comment input */}
            <form onSubmit={handlePostComment} className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <input 
                type="text" 
                placeholder="Write a message, request update, or add notes..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500 transition-all text-slate-800 dark:text-slate-200"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-all shrink-0 flex items-center justify-center"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Dispatch Officer & SLA details */}
        <div className="space-y-6">
          
          {/* Assigned Staff Block */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/40 dark:border-white/5 rounded-2xl p-6 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 font-display">Technical Dispatch</h4>
            
            {c.assignedStaffName ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 dark:border-blue-900/30">
                    {c.assignedStaffName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{c.assignedStaffName}</p>
                    <p className="text-[10px] text-slate-400">On-Site Dispatch Specialist</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assignment Date:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-350">
                      {new Date(c.timeline.find(t => t.status === 'assigned')?.date || c.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected SLA:</span>
                    <span className="font-bold text-green-500">24 Hours Target</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-[#0F172A]/20 border border-slate-200/50 dark:border-slate-800 rounded-xl text-center">
                <AlertTriangle size={18} className="text-amber-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Technician Unassigned</p>
                <p className="text-[10px] text-slate-400 mt-1">Awaiting College Authority allocation.</p>
              </div>
            )}
          </div>

          {/* Ticket Information Panel */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/40 dark:border-white/5 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">Ticket & Authority Details</h4>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-slate-400">Complaint ID:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{c.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-slate-400">Maintenance Area:</span>
                <span className="font-semibold">{c.building}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-slate-400">Room Coordinates:</span>
                <span className="font-semibold">{c.roomNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-slate-400">Core Category:</span>
                <span className="font-semibold">{c.category}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Priority Level:</span>
                <span className="capitalize font-bold text-red-500">{c.priority}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK MODAL DIALOG */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base">Rate Maintenance Repair</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Your ratings help us evaluate contractor and staff SLA response qualities.</p>
              </div>
              <button 
                onClick={() => setIsFeedbackOpen(false)} 
                className="p-1 px-2 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              {/* Star Selectors */}
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-bold text-slate-500">Quality score</label>
                <div className="flex justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-amber-400 transition-transform hover:scale-115 cursor-pointer"
                    >
                      <Star size={28} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Brief Comment / Notes</label>
                <textarea 
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="e.g. Excellent service, arrived quickly and cleaned up after repairs."
                  className="w-full px-4 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500 text-slate-800 dark:text-slate-250"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Submit Feedback & Close Complaint
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
