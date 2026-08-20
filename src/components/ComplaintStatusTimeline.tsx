import React from 'react';
import { motion } from 'motion/react';
import { ComplaintStatus, TimelineEvent } from '../types';
import { 
  FileText, UserCheck, Play, CheckCircle2, Lock, 
  XCircle, Clock, AlertCircle, ShieldAlert 
} from 'lucide-react';

interface ComplaintStatusTimelineProps {
  status: ComplaintStatus;
  timeline: TimelineEvent[];
}

export const ComplaintStatusTimeline: React.FC<ComplaintStatusTimelineProps> = ({ status, timeline }) => {
  // Define standard steps for the visual progress tracker
  const steps = [
    {
      key: 'new',
      label: 'Pending',
      sublabel: 'Awaiting Review',
      icon: FileText,
      statuses: ['new'],
    },
    {
      key: 'assigned',
      label: 'Assigned',
      sublabel: 'Dispatch Scheduled',
      icon: UserCheck,
      statuses: ['assigned'],
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      sublabel: 'Repair Underway',
      icon: Play,
      statuses: ['in-progress'],
    },
    {
      key: 'resolved',
      label: 'Resolved',
      sublabel: 'Verification Pending',
      icon: CheckCircle2,
      statuses: ['resolved'],
    },
    {
      key: 'closed',
      label: 'Closed',
      sublabel: 'Issue Concluded',
      icon: Lock,
      statuses: ['closed'],
    },
  ];

  // Helper to determine the index of the current status
  const getStatusIndex = (currentStatus: ComplaintStatus): number => {
    if (currentStatus === 'rejected') return -1;
    switch (currentStatus) {
      case 'new': return 0;
      case 'assigned': return 1;
      case 'in-progress': return 2;
      case 'resolved': return 3;
      case 'closed': return 4;
      default: return 0;
    }
  };

  const currentStepIndex = getStatusIndex(status);

  // Status-specific configuration for headers/banners
  const isRejected = status === 'rejected';

  // Find the timestamp for a step if it exists in the audit timeline
  const getStepDate = (stepStatuses: string[]) => {
    const event = [...timeline]
      .reverse()
      .find(evt => stepStatuses.includes(evt.status));
    if (!event) return null;
    return new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 w-full" id="complaint-status-timeline-container">
      {/* Visual Progress Stepper (Horizontal on Desktop, Vertical on Mobile) */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/40 dark:border-white/5 rounded-2xl p-6 shadow-xs relative overflow-hidden" id="timeline-stepper">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-blue-500/5 blur-[40px] pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
          <div>
            <h4 className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Clock size={16} className="text-blue-500 animate-spin-slow" />
              Real-Time Tracker
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Automated facilities dispatch & resolution timeline</p>
          </div>
          {isRejected ? (
            <div className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
              <XCircle size={12} />
              TICKET REJECTED
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30 text-[10px] font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              LIVE DISPATCH ROUTE
            </div>
          )}
        </div>

        {/* The Stepper Track */}
        {isRejected ? (
          <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-150 dark:border-red-900/20 rounded-xl flex items-start gap-3">
            <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h5 className="text-xs font-bold text-red-800 dark:text-red-300">Complaint Rejected</h5>
              <p className="text-[11px] text-red-600 dark:text-red-400/80 mt-1 leading-relaxed">
                {timeline.find(t => t.status === 'rejected')?.description || 'This complaint has been reviewed and rejected by the administration.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Horizontal Line connector (Desktop only) */}
            <div className="hidden md:block absolute top-[18px] left-[4%] right-[4%] h-[3px] bg-slate-100 dark:bg-slate-800 -z-0">
              <motion.div 
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStepIndex / 4) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative z-10">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                const isUpcoming = idx > currentStepIndex;
                const stepTime = getStepDate(step.statuses);

                return (
                  <div key={step.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2.5">
                    {/* Circle Indicator */}
                    <div className="relative shrink-0">
                      <motion.div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-350 ${
                          isCompleted
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                            : isActive
                            ? 'bg-white dark:bg-[#1E293B] border-blue-500 text-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20'
                            : 'bg-slate-50 dark:bg-[#0F172A]/40 border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                        whileHover={{ scale: isActive || isCompleted ? 1.05 : 1 }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={18} className="stroke-[2.5]" />
                        ) : (
                          <StepIcon size={16} />
                        )}
                      </motion.div>

                      {/* Small Active Pulse Indicator */}
                      {isActive && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="flex-1 md:space-y-0.5 text-left md:text-center">
                      <h5 className={`text-xs font-bold tracking-tight ${isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                        {step.label}
                      </h5>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight block">
                        {step.sublabel}
                      </p>
                      {stepTime && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="inline-block mt-1 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-[8px] font-mono font-medium text-slate-400"
                        >
                          {stepTime}
                        </motion.span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Audit Logs / Activity feed */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/40 dark:border-white/5 rounded-2xl p-6 shadow-xs" id="timeline-audit-logs">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 font-display">System Audit Log</h4>
        
        <div className="relative pl-6 space-y-6">
          {/* Connector Line */}
          <div className="absolute left-2.5 top-1.5 bottom-1.5 w-[1.5px] bg-slate-100 dark:bg-slate-800" />

          {timeline.map((evt, index) => {
            const isLatest = index === timeline.length - 1;
            
            // Icon choosing
            let EventIcon = FileText;
            let iconColorClass = 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
            if (evt.status === 'assigned') {
              EventIcon = UserCheck;
              iconColorClass = 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
            } else if (evt.status === 'in-progress') {
              EventIcon = Play;
              iconColorClass = 'text-purple-500 bg-purple-50 dark:bg-purple-950/20';
            } else if (evt.status === 'resolved') {
              EventIcon = CheckCircle2;
              iconColorClass = 'text-green-500 bg-green-50 dark:bg-green-950/20';
            } else if (evt.status === 'closed') {
              EventIcon = Lock;
              iconColorClass = 'text-slate-500 bg-slate-100 dark:bg-slate-800';
            } else if (evt.status === 'rejected') {
              EventIcon = XCircle;
              iconColorClass = 'text-red-500 bg-red-50 dark:bg-red-950/20';
            }

            return (
              <motion.div 
                key={index} 
                className="relative flex gap-4 items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Visual Icon node */}
                <div className={`absolute -left-[27px] top-0 w-5.5 h-5.5 rounded-full flex items-center justify-center border border-white dark:border-[#1E293B] shadow-xs z-10 ${iconColorClass}`}>
                  <EventIcon size={10} className="stroke-[2.5]" />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className={`text-xs font-bold ${isLatest ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {evt.label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(evt.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      {new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-normal bg-slate-50/50 dark:bg-[#0F172A]/10 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-850">
                    {evt.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
