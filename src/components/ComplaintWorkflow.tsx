import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Users, Sparkles, Database, ShieldAlert, Play, Pause, 
  RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, 
  FileText, Upload, Brain, Mail, Send, Check, AlertCircle, RefreshCw, Star
} from 'lucide-react';

// =========================================================================
// INTERFACES & DEFINITIONS FOR COMPLAINT WORKFLOW
// =========================================================================

export interface WorkflowStep {
  id: number;
  label: string;
  role: 'student' | 'admin' | 'staff' | 'ai' | 'system';
  roleLabel: string;
  phase: 'submission' | 'triage' | 'allocation' | 'repair' | 'verification';
  description: string;
  systemConsequence: string;
  codeSnippet?: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  // Phase 1: Submission
  {
    id: 1,
    label: "Student Notices an Issue",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "submission",
    description: "A resident encounters an active facilities fault (e.g. flickering light, water leakage, broken desk) in classrooms or hostels.",
    systemConsequence: "No system state recorded yet. The user prepares to open the CampusCare AI platform.",
    codeSnippet: `// Resident observation\nconst issue = {\n  location: "Hostel Block C - Room 302",\n  type: "Plumbing",\n  gravity: "Water dripping onto power hub"\n};`
  },
  {
    id: 2,
    label: "Login (Email/Google)",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "submission",
    description: "Student authenticates securely using their college credentials or Google Sign-In with popup OAuth.",
    systemConsequence: "Authentication token (JWT) is issued. Session claims are verified against student databases.",
    codeSnippet: `// Firebase Authentication login\ntry {\n  const userCredential = await signInWithEmailAndPassword(auth, email, password);\n  const token = await userCredential.user.getIdToken();\n  // JWT checks active student claims\n} catch (error) {\n  console.error("Auth rejection: ", error);\n}`
  },
  {
    id: 3,
    label: "Click 'Report Complaint'",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "submission",
    description: "Initiates the complaint wizard. The system serves building, category, and department lists dynamically.",
    systemConsequence: "Renders the submission viewport, fetching active location configuration records.",
    codeSnippet: `// Route change\nconst handleInitiateReport = () => {\n  setPage('report-complaint');\n  analytics.logEvent('start_report_funnel');\n};`
  },
  {
    id: 4,
    label: "Fill Complaint Form",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "submission",
    description: "Enters descriptive issue context, selecting cascading variables (e.g., Block -> Floor -> Room).",
    systemConsequence: "Draft state populated. Validates character lengths, input sanitize blocks, and required locations.",
    codeSnippet: `// Cascading State Handler\nconst [selectedBuilding, setSelectedBuilding] = useState('');\nconst floors = BUILDINGS.find(b => b.name === selectedBuilding)?.floors || [];`
  },
  {
    id: 5,
    label: "Upload Photo (Optional)",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "submission",
    description: "Attaches a snapshot of the mechanical or electrical issue for immediate visual proof.",
    systemConsequence: "Client-side image compression triggers. Uploads directly to Cloudinary CDN returning secure CDN URLs.",
    codeSnippet: `// Direct CDN upload proxy\nconst uploadData = new FormData();\nuploadData.append("file", compressedFile);\nuploadData.append("upload_preset", "campuscare_assets");\nconst res = await fetch("https://api.cloudinary.com/v1_1/cc/image/upload", {\n  method: "POST",\n  body: uploadData\n});\nconst { secure_url } = await res.json();`
  },
  // Phase 2: AI Triage
  {
    id: 6,
    label: "AI Categorizes & Prioritizes",
    role: "ai",
    roleLabel: "Gemini AI Core",
    phase: "triage",
    description: "Gemini NLP analyzes text gravity to determine category, route urgency, and critical hazard thresholds.",
    systemConsequence: "Computes priority score (low, medium, high, critical) and tags ticket with routing meta tags.",
    codeSnippet: `// Server-side Gemini API Triage\nconst response = await ai.models.generateContent({\n  model: 'gemini-2.5-flash',\n  contents: \`Analyze: "\${description}". Categorize [Plumbing, Electrical, Structural, IT] and assign gravity [low, medium, high, critical]\`\n});\nconst triage = JSON.parse(response.text);`
  },
  {
    id: 7,
    label: "Saved to Database",
    role: "system",
    roleLabel: "PostgreSQL Database",
    phase: "triage",
    description: "The complaint is written permanently to the relational and synchronized cloud data layers.",
    systemConsequence: "Atomic write in Firestore and Postgres. Enforces foreign key constraints and cascades.",
    codeSnippet: `// Atomic Database Write\nconst ticket = await db.insert(complaints).values({\n  title: form.title,\n  category: triage.category,\n  priority: triage.priority,\n  status: 'new',\n  studentId: currentUser.id,\n  createdAt: new Date()\n}).returning();`
  },
  {
    id: 8,
    label: "Complaint ID Generated",
    role: "system",
    roleLabel: "System Engine",
    phase: "triage",
    description: "Generates a human-friendly unique serial ticket code (e.g. CC-101) for search and tracking referencing.",
    systemConsequence: "Serial counter auto-increments. The ticket is sealed with a unique timestamp.",
    codeSnippet: `// Incremental ticket ID naming\nconst ticketId = \`CC-\${lastSerial + 1}\`;\n// Indexed in db for O(1) retrieval\ncreateIndex("idx_complaint_serial_id").on(complaints.serialId);`
  },
  {
    id: 9,
    label: "Student Receives Confirmation",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "triage",
    description: "Platform displays immediate visual success screen, highlighting generated ID and predicted SLA resolution times.",
    systemConsequence: "Local notifications state is updated. Triggers email receipt confirmation dispatch.",
    codeSnippet: `// Success View Trigger\nsetIsSubmitted(true);\naddNotification({\n  type: 'success',\n  message: \`Ticket \${ticketId} submitted successfully.\`,\n  userId: currentUser.id\n});`
  },
  // Phase 3: Allocation
  {
    id: 10,
    label: "College Authority Notification",
    role: "admin",
    roleLabel: "College Authority",
    phase: "allocation",
    description: "Authority dashboard receives real-time alert about the incoming ticket via reactive Firebase streams.",
    systemConsequence: "Triggers counter badges increments in Authority views. Enforces push updates to live maps.",
    codeSnippet: `// Firebase Firestore reactive subscription\nonSnapshot(collection(db, "complaints"), (snapshot) => {\n  const activeTickets = snapshot.docs.map(doc => doc.data());\n  updateAdminUnreadBadge(activeTickets.filter(t => t.status === 'new').length);\n});`
  },
  {
    id: 11,
    label: "College Authority Reviews Complaint",
    role: "admin",
    roleLabel: "College Authority",
    phase: "allocation",
    description: "College maintenance coordinator inspects descriptions, photos, and AI priority assessments on the triage grid.",
    systemConsequence: "Authority accepts ticket or updates priority overrides. Marks state as ready for scheduling.",
    codeSnippet: `// Ticket Validation\nconst approveTicket = async (ticketId, overridePriority) => {\n  await updateDoc(doc(db, "complaints", ticketId), {\n    reviewedBy: adminUser.id,\n    priority: overridePriority || currentPriority\n  });\n};`
  },
  {
    id: 12,
    label: "Assign Maintenance Staff",
    role: "admin",
    roleLabel: "College Authority",
    phase: "allocation",
    description: "College Authority selects an available specialist technician (e.g., plumbing lead, electrical expert) from the staff table.",
    systemConsequence: "Writes row into assignments table. Sets complaint status to assigned.",
    codeSnippet: `// Assign staff technician & mutate status\nconst assignTechnician = async (ticketId, staffId) => {\n  await db.insert(assignments).values({\n    complaintId: ticketId,\n    staffId: staffId,\n    assignedAt: new Date()\n  });\n  await db.update(complaints).set({ status: 'assigned' }).where(eq(complaints.id, ticketId));\n};`
  },
  // Phase 4: Repair
  {
    id: 13,
    label: "Staff Receives Notification",
    role: "staff",
    roleLabel: "Maintenance Staff",
    phase: "repair",
    description: "The assigned technician receives instant, sound-enabled SMS or workstation push alert showing building details.",
    systemConsequence: "Technician task queue is updated locally via Firebase stream listener.",
    codeSnippet: `// Technician service worker push listener\nself.addEventListener('push', (event) => {\n  const payload = event.data.json();\n  self.registration.showNotification('CampusCare Alert: New Task', {\n    body: \`Room \${payload.room} requires immediate \${payload.category} dispatch\`\n  });\n});`
  },
  {
    id: 14,
    label: "Staff Accepts Complaint",
    role: "staff",
    roleLabel: "Maintenance Staff",
    phase: "repair",
    description: "Technician opens task view and clicks 'Accept Task', acknowledging dispatch and scheduling repair visit.",
    systemConsequence: "Assigned technician's database workload counter increments. Logs dispatcher hand-off timestamp.",
    codeSnippet: `// Accept ticket\nconst acceptTask = async (taskId) => {\n  await updateDoc(doc(db, "assignments", taskId), {\n    acceptedAt: new Date(),\n    acknowledged: true\n  });\n};`
  },
  {
    id: 15,
    label: "Status → In Progress",
    role: "system",
    roleLabel: "System Engine",
    phase: "repair",
    description: "Platform updates state dynamically, updating resident's tracker with status: 'In Progress'.",
    systemConsequence: "Audit trail log is automatically generated and appended to the complaint timeline.",
    codeSnippet: `// Status Mutation Event\nconst setStatusInProgress = async (ticketId) => {\n  await updateComplaintStatus(ticketId, 'in-progress');\n  await logTimelineEvent(ticketId, 'in-progress', 'Technician is en-route to location.');\n};`
  },
  {
    id: 16,
    label: "Staff Repairs the Issue",
    role: "staff",
    roleLabel: "Maintenance Staff",
    phase: "repair",
    description: "Technician completes physical repair (e.g., replaces water valve, rewires power hubs, cleans filter blockages).",
    systemConsequence: "Offline logs cached in local browser state if campus connectivity is temporarily unstable.",
    codeSnippet: `// Physical Work Complete\nconst workDetails = {\n  partsReplaced: ["Angle valve 1/2 inch", "Teflon tape"],\n  laborHours: 0.75,\n  systemStatusCheck: "Ok"\n};`
  },
  {
    id: 17,
    label: "Upload After-Repair Photo",
    role: "staff",
    roleLabel: "Maintenance Staff",
    phase: "repair",
    description: "Technician captures and uploads a picture of the fixed fixture as verifiable proof of repair.",
    systemConsequence: "Secures resolution validation trail. Prevents early ticket closures without quality checks.",
    codeSnippet: `// Resolution validation payload\nconst submitResolution = async (ticketId, notes, afterPhotoUrl) => {\n  await updateDoc(doc(db, "complaints", ticketId), {\n    resolutionNotes: notes,\n    afterPhoto: afterPhotoUrl,\n    resolvedAt: new Date()\n  });\n};`
  },
  {
    id: 18,
    label: "Status → Resolved",
    role: "system",
    roleLabel: "System Engine",
    phase: "repair",
    description: "Updates state permanently to 'Resolved'. System registers final technical duration metric (SLA performance).",
    systemConsequence: "Calculates total minutes between creation and resolution for performance analytics charts.",
    codeSnippet: `// Set Resolved & Record SLA duration\nconst durationMinutes = (resolvedAt - createdAt) / (1000 * 60);\nawait db.update(complaints).set({\n  status: 'resolved',\n  slaDurationMinutes: durationMinutes\n}).where(eq(complaints.id, ticketId));`
  },
  // Phase 5: Verification
  {
    id: 19,
    label: "Student Receives Notification",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "verification",
    description: "Resident receives a workspace ping/notification informing them the issue is marked fixed with a before/after proof view.",
    systemConsequence: "Opens verification feedback screen on student portal next time student signs in.",
    codeSnippet: `// Push resident review screen\nif (complaint.status === 'resolved' && !complaint.studentVerified) {\n  openVerificationModal(complaint.id);\n}`
  },
  {
    id: 20,
    label: "Student Verifies the Fix",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "verification",
    description: "The student visits the room, checks the repair quality, and inputs feedback regarding satisfaction levels.",
    systemConsequence: "Student chooses to either 'Close' the ticket (Satisfied) or 'Reopen' the ticket (Not Fixed).",
    codeSnippet: `// Verification toggle\nconst [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);\nconst [feedback, setFeedback] = useState('');`
  },
  {
    id: 21,
    label: "Satisfied? Yes → Closed",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "verification",
    description: "Student is satisfied. Clicking 'Yes' sets status to 'Closed', leaving ratings, and archiving the ticket.",
    systemConsequence: "Mutates status to 'closed'. Stores performance score. Locks ticket files against future edits.",
    codeSnippet: `// Final Ticket Closure\nconst closeTicket = async (ticketId, rating, comment) => {\n  await updateComplaintInDb(ticketId, {\n    status: 'closed',\n    rating: rating, \n    ratingComment: comment,\n    closedAt: new Date()\n  });\n  triggerConfettiAnimation();\n};`
  },
  {
    id: 22,
    label: "Not Fixed? Reopen → Admin",
    role: "student",
    roleLabel: "Student Reporter",
    phase: "verification",
    description: "Student is unsatisfied (e.g. faucet still drips). Clicking 'No' reopens ticket, routing it directly back to Admin for priority reassignment.",
    systemConsequence: "Mutates status back to 'new' or 'reopened' with elevated priority, logging rejection comments.",
    codeSnippet: `// Reopen Ticket Escalation\nconst reopenTicket = async (ticketId, studentComment) => {\n  await updateComplaintInDb(ticketId, {\n    status: 'new', // returns to triage queue\n    priority: 'critical', // automatically escalated to high priority!\n    reopenComments: studentComment,\n    reopenedAt: new Date()\n  });\n  notifyAdminEscalation(ticketId);\n};`
  }
];

export const ComplaintWorkflow: React.FC = () => {
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [simulationBranch, setSimulationBranch] = useState<'satisfied' | 'unsatisfied'>('satisfied');

  // Auto player controller
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepId((prev) => {
          // branch routing logic
          if (prev === 20) {
            return simulationBranch === 'satisfied' ? 21 : 22;
          }
          if (prev === 21 || prev === 22) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, simulationBranch]);

  const activeStep = WORKFLOW_STEPS.find(s => s.id === currentStepId) || WORKFLOW_STEPS[0];

  const handleNext = () => {
    if (currentStepId === 20) {
      setCurrentStepId(simulationBranch === 'satisfied' ? 21 : 22);
    } else if (currentStepId === 21 || currentStepId === 22) {
      // end
    } else {
      setCurrentStepId(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepId === 21 || currentStepId === 22) {
      setCurrentStepId(20);
    } else if (currentStepId > 1) {
      setCurrentStepId(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepId(1);
    setIsPlaying(false);
  };

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-150 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'admin': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'staff': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'ai': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-500/20';
      case 'system': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'submission': return 'bg-blue-500';
      case 'triage': return 'bg-purple-500';
      case 'allocation': return 'bg-emerald-500';
      case 'repair': return 'bg-amber-500';
      case 'verification': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  // Group steps by Phase for the left column layout
  const phases = [
    { key: 'submission', label: 'Phase 1: Resident Submission', steps: WORKFLOW_STEPS.filter(s => s.phase === 'submission') },
    { key: 'triage', label: 'Phase 2: Intelligent AI Triage', steps: WORKFLOW_STEPS.filter(s => s.phase === 'triage') },
    { key: 'allocation', label: 'Phase 3: Administrative Allocation', steps: WORKFLOW_STEPS.filter(s => s.phase === 'allocation') },
    { key: 'repair', label: 'Phase 4: Technical Dispatch & Repair', steps: WORKFLOW_STEPS.filter(s => s.phase === 'repair') },
    { key: 'verification', label: 'Phase 5: Verification & History Archival', steps: WORKFLOW_STEPS.filter(s => s.phase === 'verification') },
  ];

  return (
    <div className="space-y-6" id="complaint-workflow-visualizer-suite">
      
      {/* Title & Top Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/40 dark:border-white/5">
        <div className="space-y-1">
          <h4 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Brain size={16} className="text-purple-500" />
            Interactive Complaint Working Flow Engine
          </h4>
          <p className="text-[10px] text-slate-400">
            Click any operational node below or run the automatic walkthrough simulator to trace the complete step-by-step life of a complaint ticket.
          </p>
        </div>

        {/* Simulator controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
            <button
              onClick={() => { setSimulationBranch('satisfied'); if(currentStepId === 22) setCurrentStepId(21); }}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all ${simulationBranch === 'satisfied' ? 'bg-green-100 text-green-850 dark:bg-green-950/20 dark:text-green-400' : 'text-slate-400'}`}
            >
              Satisfied path (Closed)
            </button>
            <button
              onClick={() => { setSimulationBranch('unsatisfied'); if(currentStepId === 21) setCurrentStepId(22); }}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all ${simulationBranch === 'unsatisfied' ? 'bg-red-150 text-red-800 dark:bg-red-950/20 dark:text-red-400' : 'text-slate-400'}`}
            >
              Not Fixed path (Reopen)
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 flex items-center justify-center cursor-pointer"
              title={isPlaying ? 'Pause Simulation' : 'Play Walkthrough'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-450 cursor-pointer"
              title="Reset Flow"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Split Grid: Left 22 Step Node Tree, Right Detail Inspector Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Stepper Tree */}
        <div className="lg:col-span-7 space-y-4 max-h-160 overflow-y-auto pr-1 scrollbar-thin">
          {phases.map((phase) => (
            <div key={phase.key} className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono pl-2">
                {phase.label}
              </span>
              
              <div className="space-y-1.5 pl-3 border-l-2 border-slate-100 dark:border-slate-850/60 ml-2">
                {phase.steps.map((step) => {
                  const isActive = currentStepId === step.id;
                  const isCompleted = currentStepId > step.id && !(currentStepId === 22 && step.id === 21) && !(currentStepId === 21 && step.id === 22);
                  const isSlaBranchMissed = currentStepId === 22 && step.id === 21;
                  const isSlaBranchSelected = currentStepId === 21 && step.id === 22;

                  if ((step.id === 21 && simulationBranch === 'unsatisfied' && !isActive) || 
                      (step.id === 22 && simulationBranch === 'satisfied' && !isActive)) {
                    // skip inactive alternative branch path visually to avoid clutter
                    return null;
                  }

                  return (
                    <button
                      key={step.id}
                      onClick={() => { setCurrentStepId(step.id); setIsPlaying(false); }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 shadow-sm'
                          : isCompleted
                          ? 'bg-white border-slate-200/60 text-slate-700 hover:border-slate-300 dark:bg-slate-900/10 dark:border-slate-800/30 dark:text-slate-300 dark:hover:border-slate-850'
                          : 'bg-slate-50/50 border-slate-150 text-slate-400 dark:bg-slate-900/5 dark:border-slate-900/10 dark:text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center font-mono ${
                          isActive 
                            ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white' 
                            : isCompleted 
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' 
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-850'
                        }`}>
                          {step.id}
                        </div>
                        <span className="text-xs font-semibold tracking-tight truncate">{step.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md font-mono ${
                          isActive ? 'bg-white/10 text-white dark:bg-slate-950/5' : getRoleBadgeColor(step.role)
                        }`}>
                          {step.roleLabel}
                        </span>
                        <ChevronRight size={12} className={`opacity-40 ${isActive ? 'rotate-90' : ''}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Node Inspector Details */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-850">
            <div>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Currently Auditing Node {activeStep.id} / 22</span>
              <h5 className="font-bold text-sm tracking-tight text-slate-850 dark:text-slate-100 mt-0.5">
                {activeStep.label}
              </h5>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold capitalize ${getRoleBadgeColor(activeStep.role)}`}>
              {activeStep.roleLabel}
            </span>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Process Description</span>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-[#0F172A]/10 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
              {activeStep.description}
            </p>
          </div>

          {/* System Consequence / Database impact */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono flex items-center gap-1">
              <Database size={11} className="text-emerald-500" />
              Relational Database Consequence
            </span>
            <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-500/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeStep.systemConsequence}
            </div>
          </div>

          {/* Code Implementation Snippet */}
          {activeStep.codeSnippet && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                <span>Code implementation contract</span>
                <button 
                  onClick={() => handleCopySnippet(activeStep.codeSnippet!)}
                  className="text-emerald-500 flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  {copied ? <Check size={10} /> : 'Copy Code'}
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-300 overflow-x-auto">
                <code>{activeStep.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Interactive Player Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepId === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={12} />
              Previous Node
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepId === 21 || currentStepId === 22}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              Advance Step
              <ArrowRight size={12} />
            </button>
          </div>

        </div>

      </div>

      {/* Stored in History & Reports Mock View */}
      <AnimatePresence>
        {(currentStepId === 21 || currentStepId === 22) && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-900 dark:border-white/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Workflow Instance Concluded
              </h5>
              <span className="text-[10px] text-slate-400 font-mono">Archive Reference Code: TX-0947264-SLA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] font-mono block">Archival Target</span>
                <p className="font-bold">Permanent historical collections & audit logs</p>
              </div>
              <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] font-mono block">SLA Metrics Logged</span>
                <p className="font-bold text-emerald-400">Total duration: 1 hour 14 minutes (Passes 100% SLA limit)</p>
              </div>
              <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] font-mono block">Final Result State</span>
                <p className={`font-bold ${currentStepId === 21 ? 'text-green-400' : 'text-red-400'}`}>
                  {currentStepId === 21 ? 'Verified & Closed Satisfied' : 'Escalated & Reopened'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 bg-white text-slate-950 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer transition-all"
              >
                Restart Interactive Workflow Audit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
