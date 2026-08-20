import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Wrench, Briefcase, Crown, Check, X, Shield, 
  Users, Activity, Lock, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight
} from 'lucide-react';

export interface RoleDetail {
  id: 'student' | 'staff' | 'admin';
  name: string;
  emoji: string;
  icon: React.ReactNode;
  badgeColor: string;
  textColor: string;
  ringColor: string;
  who: string;
  examples?: string[];
  can: string[];
  cannot: string[];
  operationalScope: string;
}

const ROLES_DATA: RoleDetail[] = [
  {
    id: 'student',
    name: 'Student',
    emoji: '👨‍🎓',
    icon: <GraduationCap size={24} />,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    ringColor: 'ring-blue-500/25',
    who: 'Any active student or campus resident residing in college hostels or utilizing campus classrooms and facilities.',
    can: [
      'Secure login via College Credentials or Google Sign-In',
      'Report infrastructure/facilities complaints (Block, Floor, Room, Details)',
      'Upload real before-repair photos for immediate validation',
      'Track real-time complaint progress status and timeline events',
      'Receive instant in-app alerts and SMS/Push notifications',
      'Verify resolved repairs (Provide feedback rating, close ticket, or reopen)',
      'View personal historical complaint submission reports'
    ],
    cannot: [
      'Assign complaints to specific technical maintenance staff',
      'Manage or view other users and system user registers',
      'View, browse, or query other students\' submitted complaints (Enforces GDPR data privacy limits)'
    ],
    operationalScope: 'Personal Residence & Immediate Academic Workspaces'
  },
  {
    id: 'staff',
    name: 'Staff',
    emoji: '👷',
    icon: <Wrench size={24} />,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    ringColor: 'ring-amber-500/25',
    who: 'The professional campus technical services and emergency response dispatch unit.',
    examples: [
      'IT Support Specialists',
      'Electricians',
      'Plumbers & Drainage Leads',
      'Carpenters & Joiners',
      'Housekeeping & Sanitation',
      'Campus Security Wardens',
      'Civil Maintenance Technicians'
    ],
    can: [
      'View, inspect, and filter personally assigned maintenance complaints',
      'Accept or reject administrative dispatch tickets with valid notes',
      'Update progress statuses dynamically (Mark en-route, In-Progress, etc.)',
      'Upload detailed after-repair verification photos as structural proof',
      'Add repair inventory material logs and labor hour calculations',
      'Mark assignments completed to trigger automatic student review alerts'
    ],
    cannot: [
      'Assign complaints to other staff members or create self-assignments',
      'Delete or archive complaints from the system database permanently',
      'Access the user directory or update role permissions'
    ],
    operationalScope: 'Assigned Workstations & Physical Technical Inspections'
  },
  {
    id: 'admin',
    name: 'College Authority',
    emoji: '🏛️',
    icon: <Briefcase size={24} />,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    ringColor: 'ring-indigo-500/25',
    who: 'The centralized Maintenance Office, Hostel Wardens, and Institutional Facilities Coordinators.',
    can: [
      'View, search, and audit all submitted campus-wide complaints',
      'Review pending tickets, adjust severity weights, and override priorities',
      'Assign and reassign technical tickets to matching available staff technicians',
      'Monitor live maintenance task-queues and track technician workloads',
      'Review and verify completed repairs, ensuring quality standard checks',
      'Manage staff rosters, technician categories, and work shift details',
      'Generate CSV/PDF analytics reports on SLA performance metrics',
      'Send announcements and high-priority notices to selected cohorts'
    ],
    cannot: [
      'Change core system configurations, API configurations, or schema controls',
      'Manage multiple distinct college campuses (unless explicitly permitted)'
    ],
    operationalScope: 'Campus-wide Operational Workflows & Personnel Allocations'
  }
];

export const RolesPortfolio: React.FC = () => {
  const [activeRoleId, setActiveRoleId] = useState<'student' | 'staff' | 'admin'>('student');
  const [viewMode, setViewMode] = useState<'interactive' | 'matrix'>('interactive');

  const selectedRole = ROLES_DATA.find(r => r.id === activeRoleId)!;

  return (
    <div className="space-y-6" id="system-roles-permissions-suite">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/40 dark:border-white/5">
        <div className="space-y-1">
          <h4 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Shield size={16} className="text-blue-500" />
            Roles, Capabilities & Boundaries Portfolio
          </h4>
          <p className="text-[10px] text-slate-400">
            Comprehensive operational specification listing exactly who can, who cannot, and what spheres each role commands.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${viewMode === 'interactive' ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Interactive Hub
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${viewMode === 'matrix' ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Full Matrix Grid
          </button>
        </div>
      </div>

      {viewMode === 'interactive' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side role triggers */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 font-mono">Select Campus Role</span>
            <div className="space-y-1.5">
              {ROLES_DATA.map((role) => {
                const isActive = activeRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRoleId(role.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 shadow-md ring-2 ring-offset-2 dark:ring-offset-slate-950 ' + role.ringColor
                        : 'bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900/10 dark:border-slate-800/30 dark:text-slate-300 dark:hover:bg-slate-850/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-white/10 text-white dark:bg-slate-100 dark:text-slate-950' : 'bg-slate-50 dark:bg-slate-850 ' + role.textColor}`}>
                        {role.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          {role.name}
                          <span>{role.emoji}</span>
                        </div>
                        <span className={`text-[9px] font-mono opacity-80 block ${isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>
                          {role.operationalScope}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} className={`opacity-45 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side detailed cards */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                {/* Badge Row */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{selectedRole.emoji}</span>
                    <div>
                      <h4 className="text-base font-bold tracking-tight text-slate-850 dark:text-slate-100">
                        {selectedRole.name} Workstation Portfolio
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">Scope: {selectedRole.operationalScope}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${selectedRole.badgeColor}`}>
                    Role {selectedRole.id.toUpperCase()}
                  </span>
                </div>

                {/* Who Section */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Profile Designation</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850/40">
                    {selectedRole.who}
                  </p>
                </div>

                {/* Examples Sub-Badge Row (for Staff specifically) */}
                {selectedRole.examples && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Represented Service Sub-Units</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRole.examples.map((example, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Split: Can / Cannot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* CAN checklist */}
                  <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-4 space-y-3">
                    <h5 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-emerald-500/10 pb-2">
                      <CheckCircle2 size={13} />
                      Capabilities (CAN)
                    </h5>
                    <ul className="space-y-2.5">
                      {selectedRole.can.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0 mt-0.5">
                            <Check size={10} />
                          </span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CANNOT checklist */}
                  <div className="bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl p-4 space-y-3">
                    <h5 className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-rose-500/10 pb-2">
                      <AlertOctagon size={13} />
                      System Boundaries (CANNOT)
                    </h5>
                    {selectedRole.cannot.length > 0 ? (
                      <ul className="space-y-2.5">
                        {selectedRole.cannot.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <span className="p-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 shrink-0 mt-0.5">
                              <X size={10} />
                            </span>
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                        <span className="text-xl">🛡️</span>
                        <p className="text-[10px] font-semibold text-slate-400">Omnipresent authorization rights assigned inside the platform scope.</p>
                      </div>
                    )}
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      ) : (
        /* Grid comparative matrix table view */
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px] font-mono">
                  <th className="p-4 w-48">Role Profile</th>
                  <th className="p-4">Designated Sphere</th>
                  <th className="p-4">Operational Capabilities (CAN)</th>
                  <th className="p-4">Definitive Limitations (CANNOT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {ROLES_DATA.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 font-bold align-top">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{role.emoji}</span>
                        <div>
                          <span className="block text-xs font-bold text-slate-850 dark:text-slate-100">{role.name}</span>
                          <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-md border ${role.badgeColor}`}>
                            {role.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <p className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 leading-snug">{role.who}</p>
                      {role.examples && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {role.examples.map((ex, i) => (
                            <span key={i} className="text-[8px] px-1 py-0.2 bg-slate-100 text-slate-500 rounded dark:bg-slate-850 dark:text-slate-400">
                              {ex}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                        {role.can.map((item, idx) => (
                          <li key={idx}><span className="text-slate-600 dark:text-slate-350">{item}</span></li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 align-top">
                      {role.cannot.length > 0 ? (
                        <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                          {role.cannot.map((item, idx) => (
                            <li key={idx}><span className="text-slate-500 dark:text-slate-400">{item}</span></li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-[10px] italic text-emerald-500 font-semibold font-mono">No structural constraints.</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
