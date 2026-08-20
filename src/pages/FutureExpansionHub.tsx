import React, { useState } from 'react';
import { 
  TrendingUp, Landmark, Users, Building2, Briefcase, FileText, 
  BarChart2, HelpCircle, Network, ArrowRight, ShieldCheck, Zap, 
  Activity, CheckCircle2, Play, Search, Plus, Trash2, Sliders, 
  GitBranch, GraduationCap, ArrowDown, ChevronRight, PieChart, FileSpreadsheet
} from 'lucide-react';

// =========================================================================
// MULTI-TENANT CONFIGURATION MODELS & DATASETS
// =========================================================================

interface TenantStudent {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'suspended';
}

interface TenantStaff {
  id: string;
  name: string;
  specialty: string;
  workload: number; // Active tickets
  status: 'on-duty' | 'off-duty';
}

interface TenantBuilding {
  id: string;
  name: string;
  floors: number;
  rooms: number;
  criticalSystems: string[];
}

interface TenantComplaint {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'assigned' | 'in-progress' | 'resolved';
  category: string;
}

interface CollegeTenant {
  id: string;
  name: string;
  shortCode: string;
  status: 'active' | 'pending' | 'draft' | 'planned';
  students: TenantStudent[];
  staff: TenantStaff[];
  buildings: TenantBuilding[];
  departments: string[];
  complaints: TenantComplaint[];
  stats: {
    mttr: string; // Mean time to resolution
    slaCompliance: string;
    satisfaction: string;
  };
}

// Initial mock tenants
const INITIAL_TENANTS: CollegeTenant[] = [
  {
    id: 'inst-01',
    name: "Institute of Technology & Engineering",
    shortCode: "INST (E207)",
    status: 'active',
    students: [
      { id: "S-101", name: "Alex Rivera", email: "alex.rivera@campuscare.ai", department: "Computer Science", status: "active" },
      { id: "S-102", name: "Rohan Deshmukh", email: "rohan.d@vsmsrkit.edu.in", department: "Information Science", status: "active" },
      { id: "S-103", name: "Aishwarya Patil", email: "aish.patil@vsmsrkit.edu.in", department: "Electronics & Communication", status: "active" },
      { id: "S-104", name: "Ketan Kulkarni", email: "ketan.k@vsmsrkit.edu.in", department: "Mechanical Engineering", status: "active" }
    ],
    staff: [
      { id: "ST-201", name: "Ramesh Kumar", specialty: "Electrical", workload: 2, status: "on-duty" },
      { id: "ST-202", name: "Srinivasan Rao", specialty: "Plumbing", workload: 1, status: "on-duty" },
      { id: "ST-203", name: "Latha M.", specialty: "IT & Infrastructure", workload: 0, status: "on-duty" },
      { id: "ST-204", name: "Anand Joshi", specialty: "HVAC / General", workload: 3, status: "off-duty" }
    ],
    buildings: [
      { id: "B-01", name: "Main Administrative Block", floors: 4, rooms: 48, criticalSystems: ["Main Server Rack", "Elevator UPS", "UPS Battery Bank"] },
      { id: "B-02", name: "Sir M. Visvesvaraya Engineering Lab Block", floors: 3, rooms: 32, criticalSystems: ["Pneumatic Compressors", "High Voltage CS Lab"] },
      { id: "B-03", name: "Aryabhata Library & PG Center", floors: 5, rooms: 24, criticalSystems: ["Biometric Gate Controller", "E-resource Rack"] },
      { id: "B-04", name: "Subhas Chandra Bose Boys Hostel", floors: 6, rooms: 120, criticalSystems: ["Solar Water Grid", "RO Filtration Block"] }
    ],
    departments: [
      "Computer Science & Engineering",
      "Electronics & Communication Engineering",
      "Information Science & Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Basic Sciences & Humanities"
    ],
    complaints: [
      { id: "CC-101", title: "Water cooler leak science wing", priority: "high", status: "assigned", category: "Plumbing" },
      { id: "CC-102", title: "Projector color band damage Lab 3", priority: "medium", status: "new", category: "Audio-Visual" },
      { id: "CC-103", title: "Server rack secondary UPS beeping", priority: "critical", status: "in-progress", category: "Electrical / IT" },
      { id: "CC-104", title: "Broken window lock room 204", priority: "low", status: "resolved", category: "Carpentry" }
    ],
    stats: {
      mttr: "2.4 hours",
      slaCompliance: "98.8%",
      satisfaction: "4.7 / 5.0"
    }
  },
  {
    id: 'sgbit',
    name: "S. G. Balekundri Institute of Technology",
    shortCode: "SGBIT (Belagavi)",
    status: 'pending',
    students: [
      { id: "S-201", name: "Darshan Naik", email: "darshan.n@sgbit.edu.in", department: "Computer Science", status: "active" },
      { id: "S-202", name: "Pooja Hegde", email: "pooja.h@sgbit.edu.in", department: "Electrical Engineering", status: "active" }
    ],
    staff: [
      { id: "ST-301", name: "Basavaraj S.", specialty: "Electrical", workload: 0, status: "on-duty" },
      { id: "ST-302", name: "Vijay G.", specialty: "Carpentry", workload: 0, status: "on-duty" }
    ],
    buildings: [
      { id: "B-201", name: "Vishweshwaraiah Academic Block", floors: 4, rooms: 40, criticalSystems: ["Generator Set Grid", "Elevator"] },
      { id: "B-202", name: "SGB Hostel Cluster", floors: 5, rooms: 90, criticalSystems: ["RO Purifier Grid"] }
    ],
    departments: [
      "Computer Science & Engineering",
      "Electrical & Electronics Engineering",
      "Mechanical Engineering",
      "Civil Engineering"
    ],
    complaints: [
      { id: "CC-201", title: "Fluorescent lamp flickering in Lab 1", priority: "low", status: "new", category: "Electrical" }
    ],
    stats: {
      mttr: "No active history",
      slaCompliance: "Pending initialization",
      satisfaction: "N/A"
    }
  },
  {
    id: 'mmec',
    name: "Maratha Mandal Engineering College",
    shortCode: "MMEC (MM-1)",
    status: 'draft',
    students: [
      { id: "S-301", name: "Sourabh Patil", email: "sourabh.p@mmec.edu.in", department: "Electronics", status: "active" }
    ],
    staff: [
      { id: "ST-401", name: "Gopal Shinde", specialty: "General Maintenance", workload: 0, status: "on-duty" }
    ],
    buildings: [
      { id: "B-301", name: "MMEC Centennial Block", floors: 3, rooms: 30, criticalSystems: ["Main Power Line Transformer"] }
    ],
    departments: [
      "Electronics & Communication Engineering",
      "Mechanical Engineering",
      "Computer Science Engineering"
    ],
    complaints: [],
    stats: {
      mttr: "Unconfigured",
      slaCompliance: "Unconfigured",
      satisfaction: "N/A"
    }
  },
  {
    id: 'kletech',
    name: "KLE Technological University Hub",
    shortCode: "KLETECH (Hubballi)",
    status: 'planned',
    students: [],
    staff: [],
    buildings: [
      { id: "B-401", name: "Planned Tech Innovation Center", floors: 8, rooms: 80, criticalSystems: ["Dual Grid UPS Power", "Server Hub Cluster"] }
    ],
    departments: [
      "School of Computer Science & Engineering",
      "School of Electronics Engineering",
      "School of Business & Enterprise"
    ],
    complaints: [],
    stats: {
      mttr: "System Pipeline",
      slaCompliance: "System Pipeline",
      satisfaction: "N/A"
    }
  }
];

export const FutureExpansionHub: React.FC = () => {
  const [tenants, setTenants] = useState<CollegeTenant[]>(INITIAL_TENANTS);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('vsmsrkit');
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'staff' | 'buildings' | 'departments' | 'complaints' | 'reports'>('students');

  // Search filter inside tenant details
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation state values
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "CampusCare AI multi-college expansion model online.",
    "Ready to partition institutional namespaces..."
  ]);

  const activeTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  // Helper log generator
  const logEvent = (msg: string) => {
    setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 12)]);
  };

  // Simulate registering a student in the selected college
  const handleSimulateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    const newStudent: TenantStudent = {
      id: `S-${Math.floor(Math.random() * 899) + 100}`,
      name: newStudentName,
      email: newStudentEmail,
      department: newStudentDept,
      status: 'active'
    };

    setTenants(prevTenants => 
      prevTenants.map(tenant => {
        if (tenant.id === selectedTenantId) {
          return {
            ...tenant,
            students: [...tenant.students, newStudent]
          };
        }
        return tenant;
      })
    );

    logEvent(`✓ Partition allocation successful: Student "${newStudent.name}" deployed to "${activeTenant.name}" (${activeTenant.shortCode}) isolation pool.`);
    setNewStudentName('');
    setNewStudentEmail('');
  };

  // Simulate activating a pending node
  const handleActivateNode = (tenantId: string) => {
    setTenants(prevTenants => 
      prevTenants.map(t => {
        if (t.id === tenantId) {
          logEvent(`⚡ System Node Activated: "${t.name}" status updated to "active". Sub-domains allocated. SLA controller online.`);
          return { ...t, status: 'active' };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-850 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-850 dark:text-slate-100">
            <TrendingUp className="text-blue-500 animate-pulse" size={22} />
            Multi-College Future Expansion & Architecture Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize the decoupled multi-tenant scalability of CampusCare AI as it expands from VSMSRKIT across state universities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full">
            <Network size={12} className="animate-spin text-blue-400" />
            Active Decoupled Tenants: {tenants.filter(t => t.status === 'active').length}
          </span>
        </div>
      </div>

      {/* Core Concept Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-850 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-[-50%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-blue-300">
            <GitBranch size={10} /> Dynamic Partition Architecture
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <h3 className="text-lg font-bold">The Scalability Paradigm: Isolation & Shared Infrastructure</h3>
              <p className="text-xs text-slate-350 leading-relaxed">
                CampusCare AI is designed on a **Decoupled Multi-Tenant model**. While the core engine (dynamic AI dispatcher, Cloudinary CDN pool, Resend transaction servers, and database schemas) remains unified, each college has an **isolated sandbox data partition**. There is absolutely zero overlap of student records, technician pools, physical buildings, or maintenance pipelines.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-blue-300 flex items-center gap-1">
                <ShieldCheck size={14} /> Structural Boundary Rule:
              </h4>
              <p className="text-[11px] text-slate-300">
                Each college acts as a distinct tenant with exclusive bindings for students, staff, buildings, departments, complaints, and reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left column is the interactive Node Tree. Right is the selected node sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* =========================================================================
            LEFT COLUMN: INTERACTIVE EXPANSION TREE
            ========================================================================= */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CampusCare AI Node Tree</h3>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded font-bold">
                ENTERPRISE
              </span>
            </div>

            {/* Tree Nodes List */}
            <div className="flex flex-col space-y-2 relative pl-2 border-l-2 border-slate-200/50 dark:border-slate-800/60 ml-3">
              
              {/* Root node */}
              <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/10 z-10" />
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl mb-4 ml-3 relative">
                <span className="text-[9px] font-bold text-blue-500 uppercase font-mono tracking-widest block">Root Orchestrator</span>
                <span className="text-xs font-black text-slate-800 dark:text-white">CampusCare AI Core Engine</span>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Shared API Clusters, CDN, & SMTP</p>
              </div>

              {/* Child Nodes representing Colleges */}
              {tenants.map((node, idx) => {
                const isActive = selectedTenantId === node.id;
                return (
                  <div key={node.id} className="relative pl-3">
                    {/* Anchor line dot */}
                    <div className={`absolute -left-[16px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-10 transition-colors ${
                      isActive 
                        ? 'bg-blue-600 ring-4 ring-blue-500/20' 
                        : node.status === 'active' 
                          ? 'bg-emerald-500' 
                          : node.status === 'pending'
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-slate-300 dark:bg-slate-700'
                    }`} />
                    
                    {/* Node Card */}
                    <button
                      onClick={() => {
                        setSelectedTenantId(node.id);
                        logEvent(`Inspecting college tenant node namespace: "${node.name}" (${node.shortCode})`);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                        isActive
                          ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                          : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 pr-2 truncate">
                        <span className="text-[8px] font-bold uppercase tracking-widest font-mono text-slate-400">Node Namespace</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{node.name}</h4>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                          <span>{node.shortCode}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[8px] px-2 py-0.5 font-bold uppercase rounded font-mono ${
                          node.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : node.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : node.status === 'draft'
                                ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-500'
                        }`}>
                          {node.status}
                        </span>
                        {node.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivateNode(node.id);
                            }}
                            className="text-[9px] font-extrabold text-blue-500 hover:underline cursor-pointer"
                          >
                            Activate Now
                          </button>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* End Node indicator */}
              <div className="absolute -left-[7px] bottom-0 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800 z-10" />
              <div className="p-2 ml-3 text-[10px] text-slate-400 italic font-mono flex items-center gap-1 mt-3">
                <GitBranch size={12} className="text-slate-450" /> End of State-wide University Loop
              </div>

            </div>
          </div>

          {/* Real-time simulation event output terminal */}
          <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden shadow-md">
            <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900 border-b border-slate-850">
              <span className="text-[10px] font-mono text-slate-450 uppercase font-bold tracking-wider">
                Scalability Router Event Logs
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="p-3.5 font-mono text-[9px] text-slate-300 space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {simulationLogs.map((log, idx) => (
                <div key={idx} className="leading-snug">
                  <span className="text-slate-500">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DYNAMIC TENANT CONTAINER & WORKLOAD INSIGHTS
            ========================================================================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            
            {/* Selected Tenant Headline */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Landmark className="text-blue-500" size={18} />
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-150 dark:border-slate-850">
                    Active Partition ID: {activeTenant.id.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100 leading-tight">
                  {activeTenant.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold font-mono px-3 py-1 border rounded-full uppercase tracking-wider ${
                  activeTenant.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-slate-100 text-slate-400 border-slate-250 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-750'
                }`}>
                  {activeTenant.status === 'active' ? 'Cluster Active' : 'Deactivated'}
                </span>
              </div>
            </div>

            {/* Config Sub-Tabs Menu */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
              {[
                { id: 'students', label: 'Students', icon: <Users size={12} /> },
                { id: 'staff', label: 'Staff Technicians', icon: <Briefcase size={12} /> },
                { id: 'buildings', label: 'Buildings', icon: <Building2 size={12} /> },
                { id: 'departments', label: 'Departments', icon: <GraduationCap size={12} /> },
                { id: 'complaints', label: 'Complaints', icon: <FileText size={12} /> },
                { id: 'reports', label: 'Reports & Telemetry', icon: <BarChart2 size={12} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeSubTab === tab.id
                      ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/50 dark:border-slate-800'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT: STUDENTS */}
            {activeSubTab === 'students' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Student Namespace Directory ({activeTenant.students.length} active)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Isolated student record nodes assigned exclusively to the "{activeTenant.id}" domain hash.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                </div>

                {/* Students list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeTenant.students
                    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((student) => (
                      <div key={student.id} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{student.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 block">{student.email}</span>
                          <span className="text-[9px] font-bold text-slate-450 block font-mono">Dept: {student.department}</span>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full uppercase font-mono">
                          {student.id}
                        </span>
                      </div>
                    ))}
                  {activeTenant.students.length === 0 && (
                    <div className="col-span-2 text-center py-6 text-slate-400 text-xs italic">
                      No student nodes found inside this tenant's dataset.
                    </div>
                  )}
                </div>

                {/* Simulate Student Addition Form */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-850 space-y-3">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                    <Plus size={14} className="text-blue-500" /> Simulate Student Registration
                  </h5>
                  <form onSubmit={handleSimulateStudent} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Student Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Deshpande"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Institutional Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul.d@college.edu"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1 transition-all h-[32px]"
                    >
                      <Play size={11} fill="currentColor" /> Provision Node
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STAFF */}
            {activeSubTab === 'staff' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Assigned Technician & Dispatch Pool ({activeTenant.staff.length} active)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Campus-specific electrician, plumbing, and carpentry technicians mapped to localize ticket dispatches.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTenant.staff.map((member) => (
                    <div key={member.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{member.name}</h5>
                          <span className="text-[10px] font-bold text-blue-500 font-mono">{member.specialty} Specialist</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                          member.status === 'on-duty' ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {member.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-200/40">
                        <span className="text-slate-400">Current Workload:</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {member.workload} active tickets
                        </span>
                      </div>
                    </div>
                  ))}
                  {activeTenant.staff.length === 0 && (
                    <div className="col-span-2 text-center py-6 text-slate-400 text-xs italic">
                      No staff configurations registered inside this tenant.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: BUILDINGS */}
            {activeSubTab === 'buildings' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Campus Physical Structures & Asset Map ({activeTenant.buildings.length} mapped)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Campus-specific structures containing academic labs, classrooms, and electrical system grids.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTenant.buildings.map((building) => (
                    <div key={building.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                          <Building2 size={16} />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{building.name}</h5>
                          <span className="font-mono text-[10px] text-slate-400">UID: {building.id} • {building.floors} Floors • {building.rooms} Rooms</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Critical Monitored Infrastructure:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {building.criticalSystems.map((sys, idx) => (
                            <span key={idx} className="text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-750 rounded font-mono">
                              {sys}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: DEPARTMENTS */}
            {activeSubTab === 'departments' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Institutional Departments Whitelist ({activeTenant.departments.length} departments)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Whitelisted educational branches authorized to route academic ticket priorities dynamically.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeTenant.departments.map((dept, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-850 flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="font-bold text-slate-750 dark:text-slate-200">{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: COMPLAINTS */}
            {activeSubTab === 'complaints' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Local Incident & Helpdesk Ticket Log ({activeTenant.complaints.length} tickets)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Incidents isolated under the tenant namespace partition with live priority dispatch telemetry.
                  </p>
                </div>

                <div className="space-y-2">
                  {activeTenant.complaints.map((comp) => (
                    <div key={comp.id} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs gap-4">
                      <div className="space-y-1 truncate pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-blue-500">{comp.id}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{comp.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                          <span>Category: {comp.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          comp.priority === 'critical' ? 'bg-red-500/10 text-red-500' :
                          comp.priority === 'high' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {comp.priority}
                        </span>
                        
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          comp.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                          comp.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {activeTenant.complaints.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No tickets currently registered under this tenant.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: REPORTS */}
            {activeSubTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    SLA Compliance & MTTR Resolution Analytics
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Real-time visual reports compiling metrics for performance and response levels.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1 text-center">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Mean Resolution Speed</span>
                    <span className="text-xl font-extrabold text-blue-500 font-mono block">{activeTenant.stats.mttr}</span>
                    <span className="text-[9px] text-slate-400 block">From issue ticket to close</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1 text-center">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">SLA compliance</span>
                    <span className="text-xl font-extrabold text-emerald-500 font-mono block">{activeTenant.stats.slaCompliance}</span>
                    <span className="text-[9px] text-slate-400 block">Within 4-hour target</span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1 text-center">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">User Rating Average</span>
                    <span className="text-xl font-extrabold text-amber-500 font-mono block">{activeTenant.stats.satisfaction}</span>
                    <span className="text-[9px] text-slate-400 block">Based on feedback surveys</span>
                  </div>
                </div>

                {/* Conceptual chart preview of resolution efficiency */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-4 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <PieChart size={13} /> Incident Distribution Report
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span>Plumbing (Leaks / Gutter blocks)</span>
                        <span className="font-bold">45%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-1.5" style={{ width: '45%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span>Electrical / IT Hardware dispatches</span>
                        <span className="font-bold">35%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#111625] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-1.5" style={{ width: '35%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span>Carpentry / Locksmith updates</span>
                        <span className="font-bold">20%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#111625] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-1.5" style={{ width: '20%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
