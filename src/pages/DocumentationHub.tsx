import React, { useState } from 'react';
import { 
  BookOpen, FileText, Code, Database, Layers, Cpu, Server, Terminal, 
  Settings, User, Users, ShieldAlert, Copy, Check, Download, Search, 
  ChevronRight, Play, Info, ExternalLink, ArrowRight, Eye, CheckCircle2,
  AlertTriangle, Network, Compass, Shield
} from 'lucide-react';
import { ComplaintWorkflow } from '../components/ComplaintWorkflow';
import { RolesPortfolio } from '../components/RolesPortfolio';

// =========================================================================
// TYPES & INTERFACES FOR DOCUMENTATION HUB
// =========================================================================

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'system' | 'technical' | 'user-guides' | 'operations';
  description: string;
}

export const DocumentationHub: React.FC = () => {
  // Navigation & Category states
  const [activeTab, setActiveTab] = useState<string>('roles-portfolio');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual subtabs
  const [userManualRole, setUserManualRole] = useState<'student' | 'staff'>('student');
  const [adminManualRole, setAdminManualRole] = useState<'college-admin'>('college-admin');

  // Swagger state
  const [swaggerExpanded, setSwaggerExpanded] = useState<Record<string, boolean>>({
    'register': false,
    'login': false,
    'get-complaints': false,
    'submit-complaint': false,
    'update-status': false
  });
  const [swaggerResponse, setSwaggerResponse] = useState<Record<string, any>>({});
  const [swaggerExecuting, setSwaggerExecuting] = useState<Record<string, boolean>>({});

  // DB Schema explorer states
  const [selectedTable, setSelectedTable] = useState<string>('users');

  const docSections: DocSection[] = [
    { id: 'roles-portfolio', title: 'Roles & Permissions Portfolio', icon: <Shield size={16} />, category: 'system', description: 'Institutional matrix displaying distinct capabilities, restrictions, and operational spheres for all 4 roles.' },
    { id: 'complaint-flow', title: 'Complaint Working Flow', icon: <Compass size={16} />, category: 'system', description: 'Interactive visual step-by-step lifecycle of an infrastructure complaint from dispatch to resolution.' },
    { id: 'readme', title: 'System README', icon: <BookOpen size={16} />, category: 'system', description: 'High-level introduction, technical overview, and project specifications.' },
    { id: 'api-doc', title: 'API Documentation', icon: <Code size={16} />, category: 'technical', description: 'Restful JSON endpoint specifications, parameter schemas, and request flow contracts.' },
    { id: 'swagger', title: 'Swagger API Sandbox', icon: <Terminal size={16} />, category: 'technical', description: 'Interactive HTTP client sandbox to test and audit API response payloads.' },
    { id: 'db-design', title: 'Database Schema Design', icon: <Database size={16} />, category: 'technical', description: 'Entity relationship attributes, indexes, and database rules for 17 relational tables.' },
    { id: 'er-diagram', title: 'ER Diagram', icon: <Layers size={16} />, category: 'technical', description: 'Visual mapping of 1-to-many and 1-to-1 relationships across college schemas.' },
    { id: 'architecture', title: 'Architecture Diagram', icon: <Network size={16} />, category: 'technical', description: 'Decoupled hybrid-cloud hosting topology (React Edge, Cloud Run container, Firebase).' },
    { id: 'deployment', title: 'Deployment Guide', icon: <Cpu size={16} />, category: 'operations', description: 'Step-by-step CI/CD compilation and containerized deployment execution.' },
    { id: 'installation', title: 'Installation Guide', icon: <Settings size={16} />, category: 'operations', description: 'Local system bootstrapping, dependency configuration, and seed loading instructions.' },
    { id: 'user-manual', title: 'User Manual', icon: <User size={16} />, category: 'user-guides', description: 'Operational guides for Student reporters and Floor maintenance technicians.' },
    { id: 'admin-manual', title: 'College Authority & System Manual', icon: <Users size={16} />, category: 'user-guides', description: 'Operational workflows for College Authority dispatchers and monitors.' }
  ];

  // Search filter
  const filteredSections = docSections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Code Copy Helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Swagger sandbox trigger
  const executeMockApi = (endpointId: string, method: string, path: string, mockResponse: any) => {
    setSwaggerExecuting(prev => ({ ...prev, [endpointId]: true }));
    setTimeout(() => {
      setSwaggerResponse(prev => ({
        ...prev,
        [endpointId]: {
          status: 200,
          latency: `${Math.floor(Math.random() * 14) + 5}ms`,
          headers: {
            'content-type': 'application/json',
            'x-ratelimit-remaining': '99',
            'server': 'uvicorn-gunicorn-fastapi',
            'x-frame-options': 'DENY'
          },
          body: JSON.stringify(mockResponse, null, 2)
        }
      }));
      setSwaggerExecuting(prev => ({ ...prev, [endpointId]: false }));
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-850 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-850 dark:text-slate-100">
            <BookOpen className="text-emerald-500 fill-emerald-500/10" size={22} />
            Institutional Documentation & Architecture Suite
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Access comprehensive README specifications, entity databases, visual topology diagrams, Swagger API sandboxes, and manuals.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-[#1E293B] border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Grid Layout: Navigation Sidebar + Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Sections Catalog</span>
            <div className="space-y-1">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-all text-left cursor-pointer ${
                    activeTab === section.id 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className={`${activeTab === section.id ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {section.icon}
                  </span>
                  <span className="truncate">{section.title}</span>
                </button>
              ))}
              {filteredSections.length === 0 && (
                <p className="text-[11px] text-slate-400 italic p-2 text-center">No sections found.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
              <Compass size={12} /> Key Project Constants
            </div>
            <div className="space-y-1.5 font-mono text-[9px] text-slate-450">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
                <span>Active Inst:</span>
                <span className="text-slate-700 dark:text-slate-350 font-bold">CampusCare AI</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
                <span>Target Users:</span>
                <span className="text-slate-700 dark:text-slate-350 font-bold">1,000+ Floor/Hostel</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
                <span>Core DB Engine:</span>
                <span className="text-slate-700 dark:text-slate-350 font-bold">PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span>Sync Engine:</span>
                <span className="text-slate-700 dark:text-slate-350 font-bold">Firebase SDK v10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content detail panel */}
        <div className="lg:col-span-9 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs min-h-140 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* =========================================================================
                SYSTEM ROLES & PERMISSIONS PORTFOLIO
                ========================================================================= */}
            {activeTab === 'roles-portfolio' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <Shield className="text-violet-500" size={18} /> System Roles & Permissions Portfolio
                    </h3>
                    <p className="text-xs text-slate-400">Institutional capability boundary matrix outlining Student, Staff, Admin, and Super Admin scopes.</p>
                  </div>
                </div>
                <RolesPortfolio />
              </div>
            )}

            {/* =========================================================================
                0. COMPLAINT WORKING FLOW SECTION
                ========================================================================= */}
            {activeTab === 'complaint-flow' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <Compass className="text-blue-500" size={18} /> Interactive Complaint Lifecycle Flowchart
                    </h3>
                    <p className="text-xs text-slate-400">Complete, audited 22-step workflow from student discovery to final historic archival.</p>
                  </div>
                </div>
                <ComplaintWorkflow />
              </div>
            )}

            {/* =========================================================================
                1. SYSTEM README SECTION
                ========================================================================= */}
            {activeTab === 'readme' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <BookOpen className="text-emerald-500" size={18} /> CampusCare AI System Specification
                    </h3>
                    <p className="text-xs text-slate-400">Core operational mandate and tech stack summary.</p>
                  </div>
                  <button 
                    onClick={() => handleCopy('readme-id', `CampusCare AI - Production-Grade Campus Maintenance & Repair Management System\nDesigned for 1,000+ active users.`)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-450 cursor-pointer transition-all flex items-center gap-1 text-[10px]"
                  >
                    {copiedId === 'readme-id' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    Copy Metadata
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>CampusCare AI</strong> is a high-performance, real-time maintenance and infrastructure operations portal custom-built to service modern residential and technical college campuses. It bridges the gap between campus residents (students, hostel inmates) and the institutional technical maintenance staff, ensuring zero delays in dispatching repairs.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">Performance Engineered</span>
                      <p className="text-[10px] text-slate-400">Maintains sub-10ms DB reads under load using robust indexed connection multiplexing.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">AI Triage Routing</span>
                      <p className="text-[10px] text-slate-400">Leverages intelligent text analysis to instantly categorize and prioritize infrastructure problems.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">Audit Proof Tracking</span>
                      <p className="text-[10px] text-slate-400">Stores atomic action state trails, including pre-repair and post-repair proof snapshots.</p>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mt-4">Selected Tech Stack & Framework Matrix</h4>
                  <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden text-[11px]">
                    <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 font-bold px-3 py-2 text-slate-500">
                      <span>Stack Domain</span>
                      <span>Selected Technology</span>
                      <span>Architectural Justification</span>
                    </div>
                    <div className="divide-y divide-slate-150 dark:divide-slate-850">
                      {[
                        { d: "Frontend Portal", t: "React 18 + Vite + Tailwind", j: "Flicker-free single page navigation, responsive bottom navigation sheet." },
                        { d: "Backend REST API", t: "FastAPI + Pydantic (Python)", j: "Asynchronous multi-threading, self-documenting OpenAPI schemas." },
                        { d: "Relational Storage", t: "PostgreSQL (Supabase Proxy)", j: "Strong structural consistency, campus building -> floor cascades." },
                        { d: "Realtime WebSocket", t: "Firebase SDK Firestore v10", j: "Pushes live status transitions to flooring technicians instantly." },
                        { d: "File Cloud CDN", t: "Cloudinary CDN", j: "On-the-fly compression of high-res student damage upload images." }
                      ].map((row, i) => (
                        <div key={i} className="grid grid-cols-3 px-3 py-2 text-slate-605 dark:text-slate-350">
                          <span className="font-bold">{row.d}</span>
                          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{row.t}</span>
                          <span>{row.j}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                2. API DOCUMENTATION SECTION
                ========================================================================= */}
            {activeTab === 'api-doc' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <Code className="text-emerald-500" size={18} /> RESTful HTTP API Route Specification
                    </h3>
                    <p className="text-xs text-slate-400">Standard router schemas, headers, security contexts, and payload limits.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Info size={12} className="text-blue-500" /> Mandatory API Request Headers
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      All state-modifying REST endpoints require authenticating with a JWT bearer token. Requests lacking an authorization signature reject with a <code>401 Unauthorized</code> block.
                    </p>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 mt-2 font-mono text-[9px] text-slate-300">
                      <p>GET /api/complaints</p>
                      <p className="text-slate-500">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        method: "POST",
                        path: "/api/auth/register",
                        desc: "Register a secure user profile linked with active role permissions.",
                        payload: `{\n  "name": "Alex Rivera",\n  "email": "student@campuscare.ai",\n  "role": "student",\n  "college": "Institute of Technology & Engineering",\n  "department": "Computer Science"\n}`
                      },
                      {
                        method: "POST",
                        path: "/api/complaints",
                        desc: "Submit an active infrastructure complaint with building and room cascading nodes.",
                        payload: `{\n  "title": "Corridor Fluorescent Flickering",\n  "category": "Electrical",\n  "building": "Science Block - Floor 2",\n  "roomNumber": "Lab 204",\n  "priority": "high"\n}`
                      },
                      {
                        method: "PATCH",
                        path: "/api/complaints/{ticket_id}/status",
                        desc: "Progresses a complaint ticket state. Staff-only validation credentials.",
                        payload: `{\n  "status": "resolved",\n  "details": "Replaced ballast and bulb. Checked grid voltage.",\n  "repairProofImage": "https://cdn.vsmsrkit.edu/res-8472.png"\n}`
                      }
                    ].map((endpoint, index) => (
                      <div key={index} className="border border-slate-150 dark:border-slate-850 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-yellow-100 text-yellow-850 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {endpoint.method}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{endpoint.path}</span>
                        </div>
                        <p className="text-[11px] text-slate-450 leading-relaxed">{endpoint.desc}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>Request Payload JSON:</span>
                            <button 
                              onClick={() => handleCopy(`payload-${index}`, endpoint.payload)}
                              className="text-emerald-500 flex items-center gap-0.5 hover:underline cursor-pointer"
                            >
                              {copiedId === `payload-${index}` ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-300 overflow-x-auto">
                            <code>{endpoint.payload}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                3. SWAGGER API SANDBOX
                ========================================================================= */}
            {activeTab === 'swagger' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    <Terminal className="text-emerald-500" size={18} /> Interactive OpenAPI / Swagger Simulator
                  </h3>
                  <p className="text-xs text-slate-400">Expand endpoints to trigger sandboxed live mock requests.</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "register",
                      method: "POST",
                      path: "/api/auth/register",
                      desc: "Generates student / staff profile and authenticates DB schemas.",
                      body: { name: "Alex Rivera", email: "student@campuscare.ai", role: "student" },
                      mockResponse: { success: true, message: "User registered successfully.", userId: "usr_942045812" }
                    },
                    {
                      id: "get-complaints",
                      method: "GET",
                      path: "/api/complaints",
                      desc: "Queries database using active user role filters.",
                      mockResponse: {
                        success: true,
                        count: 2,
                        data: [
                          { id: "CC-102", title: "Leakage in hostel washroom B", category: "Plumbing", status: "In Progress" },
                          { id: "CC-103", title: "Lab projector loose HDMI cord", category: "Maintenance", status: "Pending" }
                        ]
                      }
                    },
                    {
                      id: "update-status",
                      method: "PATCH",
                      path: "/api/complaints/{ticket_id}/status",
                      desc: "Sets ticket resolution and pushes WebSocket update triggers.",
                      body: { status: "resolved", resolvedDetails: "Completed bulb replacements." },
                      mockResponse: { success: true, updatedTicketId: "CC-102", status: "resolved", wsNotified: true }
                    }
                  ].map((route) => {
                    const expanded = swaggerExpanded[route.id];
                    return (
                      <div key={route.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        
                        {/* Header trigger bar */}
                        <button 
                          onClick={() => setSwaggerExpanded(prev => ({ ...prev, [route.id]: !prev[route.id] }))}
                          className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/20 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                              route.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400' :
                              route.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400' :
                              'bg-amber-100 text-amber-850 dark:bg-amber-950/30 dark:text-amber-400'
                            }`}>
                              {route.method}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">{route.path}</span>
                            <span className="text-[11px] text-slate-400 hidden md:inline">— {route.desc}</span>
                          </div>
                          <ChevronRight size={14} className={`text-slate-400 transition-all ${expanded ? 'rotate-90' : ''}`} />
                        </button>

                        {/* Collapsible details body */}
                        {expanded && (
                          <div className="p-4 border-t border-slate-150 dark:border-slate-850 space-y-4 text-xs bg-white dark:bg-[#151F32]">
                            
                            {route.body && (
                              <div className="space-y-1.5">
                                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Parameters / Payload:</span>
                                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-350 overflow-x-auto">
                                  {JSON.stringify(route.body, null, 2)}
                                </pre>
                              </div>
                            )}

                            {/* Execution triggers */}
                            <div className="flex justify-end">
                              <button
                                onClick={() => executeMockApi(route.id, route.method, route.path, route.mockResponse)}
                                disabled={swaggerExecuting[route.id]}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-500 text-white font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              >
                                {swaggerExecuting[route.id] ? 'Executing Request...' : 'Try It Out / Send Sandbox Request'}
                              </button>
                            </div>

                            {/* Response payload viewer */}
                            {swaggerResponse[route.id] && (
                              <div className="border border-emerald-500/10 bg-emerald-500/5 rounded-xl p-3 space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-emerald-500">
                                  <span>Response Captured (HTTP {swaggerResponse[route.id].status} OK)</span>
                                  <span>Latency: {swaggerResponse[route.id].latency}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-1 font-mono text-[9px] text-slate-450">
                                    <span className="font-sans font-bold uppercase tracking-wider block">Headers:</span>
                                    {Object.entries(swaggerResponse[route.id].headers).map(([k, v]) => (
                                      <p key={k} className="truncate"><span className="font-bold text-slate-500">{k}:</span> {v as string}</p>
                                    ))}
                                  </div>
                                  <div className="space-y-1">
                                    <span className="font-sans font-bold text-[9px] text-slate-450 uppercase tracking-wider block">JSON Body:</span>
                                    <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-mono text-[9px] text-slate-300">
                                      {swaggerResponse[route.id].body}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =========================================================================
                4. DATABASE SCHEMA DESIGN SECTION
                ========================================================================= */}
            {activeTab === 'db-design' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <Database className="text-emerald-500" size={18} /> High-Integrity Database Schema Design (17 Tables)
                    </h3>
                    <p className="text-xs text-slate-400">Strict constraints, field sizes, indices, and foreign keys.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                    CampusCare AI organizes its relational datasets using exactly 17 tables, enforcing complete cascades, unique structural indices, and composite triggers for optimized reporting workloads.
                  </p>

                  {/* Table Selection Toggles */}
                  <div className="flex flex-wrap gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
                    {['users', 'complaints', 'roles', 'buildings', 'floors', 'rooms', 'assignments'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTable(t)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedTable === t 
                            ? 'bg-slate-800 border-slate-800 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                            : 'border-slate-200 dark:border-slate-800 text-slate-450 hover:bg-slate-50'
                        }`}
                      >
                        {t}.sql
                      </button>
                    ))}
                  </div>

                  {/* Schema fields table */}
                  <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 font-bold px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      <span>Field Name</span>
                      <span>SQL Type</span>
                      <span>Constraints</span>
                      <span>Referential Link</span>
                    </div>
                    <div className="divide-y divide-slate-150 dark:divide-slate-850 text-xs font-mono">
                      {selectedTable === 'users' && [
                        { f: "id", t: "VARCHAR(64)", c: "PRIMARY KEY", l: "None" },
                        { f: "email", t: "VARCHAR(255)", c: "UNIQUE / NOT NULL", l: "None" },
                        { f: "role_id", t: "VARCHAR(64)", c: "FOREIGN KEY / INDEX", l: "roles.id -> Cascade" },
                        { f: "department_id", t: "VARCHAR(64)", c: "FOREIGN KEY", l: "departments.id -> Nullify" }
                      ].map((col, i) => (
                        <div key={i} className="grid grid-cols-4 px-3 py-2.5 text-slate-605 dark:text-slate-350">
                          <span className="font-bold text-slate-850 dark:text-slate-100">{col.f}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{col.t}</span>
                          <span className="text-slate-400 font-sans">{col.c}</span>
                          <span className="text-slate-400 font-sans">{col.l}</span>
                        </div>
                      ))}

                      {selectedTable === 'complaints' && [
                        { f: "id", t: "VARCHAR(64)", c: "PRIMARY KEY", l: "None" },
                        { f: "title", t: "VARCHAR(255)", c: "NOT NULL", l: "None" },
                        { f: "room_id", t: "VARCHAR(64)", c: "FOREIGN KEY", l: "rooms.id -> Cascade" },
                        { f: "student_id", t: "VARCHAR(64)", c: "FOREIGN KEY", l: "users.id -> Cascade" },
                        { f: "priority", t: "VARCHAR(20)", c: "CHECK ('low','med','high','critical')", l: "None" }
                      ].map((col, i) => (
                        <div key={i} className="grid grid-cols-4 px-3 py-2.5 text-slate-605 dark:text-slate-350">
                          <span className="font-bold text-slate-850 dark:text-slate-100">{col.f}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{col.t}</span>
                          <span className="text-slate-400 font-sans">{col.c}</span>
                          <span className="text-slate-400 font-sans">{col.l}</span>
                        </div>
                      ))}

                      {selectedTable === 'roles' && [
                        { f: "id", t: "VARCHAR(64)", c: "PRIMARY KEY", l: "None" },
                        { f: "name", t: "VARCHAR(30)", c: "UNIQUE / NOT NULL", l: "None" },
                        { f: "permissions", t: "JSONB", c: "DEFAULT '{}'", l: "None" }
                      ].map((col, i) => (
                        <div key={i} className="grid grid-cols-4 px-3 py-2.5 text-slate-605 dark:text-slate-350">
                          <span className="font-bold text-slate-850 dark:text-slate-100">{col.f}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{col.t}</span>
                          <span className="text-slate-400 font-sans">{col.c}</span>
                          <span className="text-slate-400 font-sans">{col.l}</span>
                        </div>
                      ))}

                      {!['users', 'complaints', 'roles'].includes(selectedTable) && [
                        { f: "id", t: "VARCHAR(64)", c: "PRIMARY KEY", l: "None" },
                        { f: "created_at", t: "TIMESTAMPTZ", c: "DEFAULT NOW()", l: "None" },
                        { f: "status", t: "VARCHAR(50)", c: "NOT NULL", l: "None" }
                      ].map((col, i) => (
                        <div key={i} className="grid grid-cols-4 px-3 py-2.5 text-slate-605 dark:text-slate-350">
                          <span className="font-bold text-slate-850 dark:text-slate-100">{col.f}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{col.t}</span>
                          <span className="text-slate-400 font-sans">{col.c}</span>
                          <span className="text-slate-400 font-sans">{col.l}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1 text-[11px] leading-relaxed text-slate-450 font-mono">
                    <p className="font-sans font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-1">
                      <AlertTriangle size={13} className="text-amber-500" /> Index Strategy & Query Optimizers:
                    </p>
                    <p>⚡ composite index on (student_id, created_at DESC) prevents layout flicker on user home loading.</p>
                    <p>⚡ composite index on (building_id, floor_number) optimizes building-specific floor cascades.</p>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                5. ER DIAGRAM SECTION
                ========================================================================= */}
            {activeTab === 'er-diagram' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="text-emerald-500" size={18} /> Entity Relationship Map
                  </h3>
                  <p className="text-xs text-slate-400">Complete physical schema relations mapping user, locations, and actions.</p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-605 dark:text-slate-350 leading-relaxed">
                    Hover over entities to examine relationship constraints. The schema forces cascading constraints preventing orphans.
                  </p>

                  {/* Interactive SVG Diagram mapping tables */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-center items-center overflow-auto h-110 scrollbar-thin">
                    <svg viewBox="0 0 800 500" className="w-full max-w-3xl h-full font-mono">
                      
                      {/* Lines / Relational connectors */}
                      <g stroke="#334155" strokeWidth="2" strokeDasharray="3 3">
                        <line x1="160" y1="120" x2="360" y2="120" />
                        <line x1="460" y1="120" x2="640" y2="120" />
                        <line x1="410" y1="150" x2="410" y2="280" />
                        <line x1="410" y1="340" x2="410" y2="400" />
                        <line x1="160" y1="430" x2="360" y2="430" />
                      </g>

                      {/* Cardinality annotations */}
                      <g fill="#64748B" fontSize="10" fontWeight="bold">
                        <text x="180" y="115">1 : N</text>
                        <text x="590" y="115">1 : 1</text>
                        <text x="420" y="190">1 : N</text>
                        <text x="420" y="375">1 : 1</text>
                        <text x="210" y="425">1 : N</text>
                      </g>

                      {/* roles Table Box */}
                      <g transform="translate(40, 75)" className="cursor-pointer group">
                        <rect width="120" height="90" rx="10" fill="#1E293B" stroke="#0EA5E9" strokeWidth="2" />
                        <rect width="120" height="28" rx="8" fill="#0EA5E9" />
                        <text x="12" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold">roles.sql</text>
                        <text x="12" y="45" fill="#94A3B8" fontSize="9">id [PK]</text>
                        <text x="12" y="60" fill="#E2E8F0" fontSize="9">name [UQ]</text>
                        <text x="12" y="75" fill="#E2E8F0" fontSize="9">permissions</text>
                      </g>

                      {/* users Table Box */}
                      <g transform="translate(320, 75)">
                        <rect width="180" height="100" rx="10" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                        <rect width="180" height="28" rx="8" fill="#10B981" />
                        <text x="15" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold">users (Core PK)</text>
                        <text x="15" y="45" fill="#94A3B8" fontSize="9">id [PK] (UUID)</text>
                        <text x="15" y="60" fill="#E2E8F0" fontSize="9">email [UQ]</text>
                        <text x="15" y="75" fill="#E2E8F0" fontSize="9">role_id [FK]</text>
                        <text x="15" y="90" fill="#E2E8F0" fontSize="9">department_id [FK]</text>
                      </g>

                      {/* settings Table Box */}
                      <g transform="translate(640, 75)">
                        <rect width="120" height="90" rx="10" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />
                        <rect width="120" height="28" rx="8" fill="#8B5CF6" />
                        <text x="12" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold">settings.sql</text>
                        <text x="12" y="45" fill="#94A3B8" fontSize="9">user_id [PK]</text>
                        <text x="12" y="60" fill="#E2E8F0" fontSize="9">dark_mode</text>
                        <text x="12" y="75" fill="#E2E8F0" fontSize="9">notifications</text>
                      </g>

                      {/* complaints Table Box */}
                      <g transform="translate(320, 250)">
                        <rect width="180" height="110" rx="10" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                        <rect width="180" height="28" rx="8" fill="#10B981" />
                        <text x="15" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold">complaints (Core TX)</text>
                        <text x="15" y="45" fill="#94A3B8" fontSize="9">id [PK]</text>
                        <text x="15" y="60" fill="#E2E8F0" fontSize="9">title, desc</text>
                        <text x="15" y="75" fill="#E2E8F0" fontSize="9">student_id [FK]</text>
                        <text x="15" y="90" fill="#E2E8F0" fontSize="9">room_id [FK]</text>
                        <text x="15" y="102" fill="#E2E8F0" fontSize="9">status, SLA</text>
                      </g>

                      {/* maintenance staff Table Box */}
                      <g transform="translate(320, 400)">
                        <rect width="180" height="85" rx="10" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
                        <rect width="180" height="28" rx="8" fill="#EF4444" />
                        <text x="15" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold">staff_technicians</text>
                        <text x="15" y="45" fill="#94A3B8" fontSize="9">id [PK]</text>
                        <text x="15" y="60" fill="#E2E8F0" fontSize="9">user_id [FK]</text>
                        <text x="15" y="75" fill="#E2E8F0" fontSize="9">active_workload</text>
                      </g>

                      {/* locations Map Table Box */}
                      <g transform="translate(40, 385)">
                        <rect width="140" height="100" rx="10" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                        <rect width="140" height="28" rx="8" fill="#F59E0B" />
                        <text x="12" y="18" fill="#FFFFFF" fontSize="10" fontWeight="bold">campus_locations</text>
                        <text x="12" y="45" fill="#94A3B8" fontSize="9">room_id [PK]</text>
                        <text x="12" y="60" fill="#E2E8F0" fontSize="9">floor_id [FK]</text>
                        <text x="12" y="75" fill="#E2E8F0" fontSize="9">building_id [FK]</text>
                        <text x="12" y="90" fill="#E2E8F0" fontSize="9">room_number</text>
                      </g>

                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                6. ARCHITECTURE DIAGRAM SECTION
                ========================================================================= */}
            {activeTab === 'architecture' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    <Network className="text-emerald-500" size={18} /> Decoupled Hybrid-Cloud Systems Architecture
                  </h3>
                  <p className="text-xs text-slate-400">Complete service topology detailing request proxy flows and security borders.</p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-605 dark:text-slate-350 leading-relaxed">
                    This visualization illustrates how the single-page web app serves static assets through edge caches while API workloads are proxied to auto-scalable Docker containers.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-center items-center overflow-auto h-110 scrollbar-thin">
                    <svg viewBox="0 0 800 480" className="w-full max-w-3xl h-full font-mono">
                      
                      {/* Grid background effect */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
                        </pattern>
                      </defs>
                      <rect width="800" height="480" fill="url(#grid)" rx="10" />

                      {/* Connecting Arrows */}
                      <g stroke="#10B981" strokeWidth="2.5" fill="none">
                        {/* Client to Vercel and API Gateway */}
                        <path d="M 170 190 L 260 190" />
                        {/* CDN Link */}
                        <path d="M 330 140 L 330 80 L 530 80" />
                        {/* Vercel Edge Router to App Server Container */}
                        <path d="M 400 190 L 490 190" />
                        {/* App server down to DB branches */}
                        <path d="M 580 230 L 580 320" />
                        <path d="M 580 230 L 420 320" />
                        <path d="M 580 230 L 710 320" />
                      </g>

                      {/* Direction arrow heads */}
                      <g fill="#10B981">
                        <polygon points="260,190 250,185 250,195" />
                        <polygon points="490,190 480,185 480,195" />
                        <polygon points="580,320 575,310 585,310" />
                        <polygon points="420,320 422,310 412,314" />
                        <polygon points="710,320 701,314 711,310" />
                      </g>

                      {/* Node: Users Devices */}
                      <g transform="translate(30, 140)">
                        <rect width="140" height="100" rx="12" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                        <text x="15" y="35" fill="#FFFFFF" fontSize="11" fontWeight="bold">Client Devices</text>
                        <text x="15" y="55" fill="#94A3B8" fontSize="8">Browsers / Phones</text>
                        <text x="15" y="75" fill="#38BDF8" fontSize="9" fontWeight="bold">React 18 Portal</text>
                      </g>

                      {/* Node: Vercel CDN Edge */}
                      <g transform="translate(260, 140)">
                        <rect width="140" height="100" rx="12" fill="#1E293B" stroke="#000000" strokeWidth="2" />
                        <text x="15" y="35" fill="#FFFFFF" fontSize="11" fontWeight="bold">Vercel Edge</text>
                        <text x="15" y="55" fill="#94A3B8" fontSize="8">Static Site Hosting</text>
                        <text x="15" y="75" fill="#A855F7" fontSize="9" fontWeight="bold">Assets delivery</text>
                      </g>

                      {/* Node: GCP Cloud Run FastAPI */}
                      <g transform="translate(490, 140)">
                        <rect width="180" height="100" rx="12" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
                        <text x="15" y="35" fill="#FFFFFF" fontSize="11" fontWeight="bold">Cloud Run App</text>
                        <text x="15" y="55" fill="#94A3B8" fontSize="8">Asynchronous Container</text>
                        <text x="15" y="75" fill="#3B82F6" fontSize="9" fontWeight="bold">FastAPI Backend (Py)</text>
                      </g>

                      {/* Node: Supabase PostgreSQL */}
                      <g transform="translate(495, 320)">
                        <rect width="170" height="100" rx="12" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                        <text x="15" y="35" fill="#FFFFFF" fontSize="11" fontWeight="bold">PostgreSQL DB</text>
                        <text x="15" y="55" fill="#94A3B8" fontSize="8">Relational Core</text>
                        <text x="15" y="75" fill="#10B981" fontSize="9" fontWeight="bold">17 tables schemas</text>
                      </g>

                      {/* Node: Firebase Firestore */}
                      <g transform="translate(310, 320)">
                        <rect width="160" height="100" rx="12" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                        <text x="15" y="35" fill="#FFFFFF" fontSize="11" fontWeight="bold">Firestore DB</text>
                        <text x="15" y="55" fill="#94A3B8" fontSize="8">Realtime Sync</text>
                        <text x="15" y="75" fill="#F59E0B" fontSize="9" fontWeight="bold">Notifications push</text>
                      </g>

                      {/* Node: Cloudinary Storage */}
                      <g transform="translate(650, 320)">
                        <rect width="120" height="100" rx="12" fill="#1E293B" stroke="#EC4899" strokeWidth="2" />
                        <text x="15" y="35" fill="#FFFFFF" fontSize="11" fontWeight="bold">Cloudinary</text>
                        <text x="15" y="55" fill="#94A3B8" fontSize="8">Media Hosting</text>
                        <text x="15" y="75" fill="#EC4899" fontSize="9" fontWeight="bold">Proof Photos</text>
                      </g>

                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                7. DEPLOYMENT GUIDE SECTION
                ========================================================================= */}
            {activeTab === 'deployment' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <Cpu className="text-emerald-500" size={18} /> Production deployment & CI/CD pipeline
                    </h3>
                    <p className="text-xs text-slate-400">Deploying static React SPA and Dockerized FastAPI endpoints.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-605 dark:text-slate-350 leading-relaxed">
                    Deploying static assets to globally distributed CDNs requires compile optimizations. Serverless containers are deployed with automatic CPU scaling enabled.
                  </p>

                  <div className="space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Terminal size={14} className="text-slate-500" /> Shell Deployment Instructions (deploy.sh)
                    </h4>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-slate-300 relative">
                      <button 
                        onClick={() => handleCopy('deploy-script', `#!/bin/bash\necho "🚀 Starting Production Build Pipeline..."\nnpm run build\n\necho "🐋 Building Backend Container image..."\ndocker build -t gcr.io/campuscareai-prod/api:latest -f docker/Dockerfile .\n\necho "📦 Pushing container to artifact registry..."\ndocker push gcr.io/campuscareai-prod/api:latest\n\necho "🚢 Deploying to Google Cloud Run..."\ngcloud run deploy campuscareai-api --image gcr.io/campuscareai-prod/api:latest --platform managed --region asia-east1 --allow-unauthenticated`)}
                        className="absolute right-3 top-3 text-[9px] text-emerald-500 font-bold hover:underline cursor-pointer"
                      >
                        {copiedId === 'deploy-script' ? 'Copied' : 'Copy'}
                      </button>
                      <p className="text-slate-500"># execute deploy pipeline locally or via Github Actions</p>
                      <p>chmod +x scripts/deploy.sh</p>
                      <p>./scripts/deploy.sh</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1.5 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">Required Environment Secret Configuration</span>
                    <p className="text-[10px] text-slate-400">
                      Configure the following parameters in your container platform or edge hosting provider (e.g., Cloud Run / Vercel secrets):
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[9px] mt-2">
                      <div className="p-2 border border-slate-150 bg-white rounded">
                        <span className="text-slate-500 block">POSTGRES_DB_URL</span>
                        <span className="text-slate-800 font-bold font-mono">postgresql://prod:...</span>
                      </div>
                      <div className="p-2 border border-slate-150 bg-white rounded">
                        <span className="text-slate-500 block">JWT_CRYPTO_SECRET</span>
                        <span className="text-slate-800 font-bold font-mono">hs256_strong_key...</span>
                      </div>
                      <div className="p-2 border border-slate-150 bg-white rounded">
                        <span className="text-slate-500 block">CLOUDINARY_URL</span>
                        <span className="text-slate-800 font-bold font-mono">cloudinary://key:...</span>
                      </div>
                      <div className="p-2 border border-slate-150 bg-white rounded">
                        <span className="text-slate-500 block">FIREBASE_APP_CREDENTIALS</span>
                        <span className="text-slate-800 font-bold font-mono">json_payload...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                8. INSTALLATION GUIDE SECTION
                ========================================================================= */}
            {activeTab === 'installation' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <Settings className="text-emerald-500" size={18} /> Local Environment Installation Guide
                    </h3>
                    <p className="text-xs text-slate-400">Setup instructions to run, configure, and seed the local development stack.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-605 dark:text-slate-350 leading-relaxed">
                    Set up your system within minutes using our Dockerized orchestrator stack which automates database schema creation and sample profile pre-seeding.
                  </p>

                  <div className="space-y-3.5 text-xs">
                    {/* Step 1 */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">1. Clone Repository & Setup Environments:</span>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-300 relative">
                        <button 
                          onClick={() => handleCopy('inst-step-1', `git clone https://github.com/vsmsrkit/campuscare-ai.git\ncd campuscare-ai\ncp .env.example .env`)}
                          className="absolute right-3 top-3 text-[9px] text-emerald-500 font-bold hover:underline cursor-pointer"
                        >
                          {copiedId === 'inst-step-1' ? 'Copied' : 'Copy'}
                        </button>
                        <p>git clone https://github.com/vsmsrkit/campuscare-ai.git</p>
                        <p>cd campuscare-ai</p>
                        <p>cp .env.example .env <span className="text-slate-500"># Fill out required database / API credentials</span></p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">2. Fire Up Container Services (Docker Compose):</span>
                      <p className="text-[11px] text-slate-400">Runs PostgreSQL database instance and triggers FastAPI hot-reload servers.</p>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-300 relative">
                        <button 
                          onClick={() => handleCopy('inst-step-2', `docker-compose up -d --build`)}
                          className="absolute right-3 top-3 text-[9px] text-emerald-500 font-bold hover:underline cursor-pointer"
                        >
                          {copiedId === 'inst-step-2' ? 'Copied' : 'Copy'}
                        </button>
                        <p>docker-compose up -d --build</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">3. Install Frontend Dependencies & Run:</span>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-300 relative">
                        <button 
                          onClick={() => handleCopy('inst-step-3', `npm install\nnpm run dev`)}
                          className="absolute right-3 top-3 text-[9px] text-emerald-500 font-bold hover:underline cursor-pointer"
                        >
                          {copiedId === 'inst-step-3' ? 'Copied' : 'Copy'}
                        </button>
                        <p>npm install</p>
                        <p>npm run dev <span className="text-slate-500 font-sans text-[8px]">(serves React layout on port 3000)</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                9. USER MANUAL SECTION
                ========================================================================= */}
            {activeTab === 'user-manual' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <User className="text-emerald-500" size={18} /> Residents & Technicians Operating Manual
                    </h3>
                    <p className="text-xs text-slate-400">Workflows for submitting tickets and updating ongoing floor repairs.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Tab Selector */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUserManualRole('student')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        userManualRole === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-650'
                      }`}
                    >
                      Student Guide
                    </button>
                    <button
                      onClick={() => setUserManualRole('staff')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        userManualRole === 'staff' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-650'
                      }`}
                    >
                      Staff / Technician Guide
                    </button>
                  </div>

                  {userManualRole === 'student' ? (
                    <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Reporting active complaints & monitoring states:</h4>
                      <div className="space-y-3">
                        <div className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold flex justify-center items-center font-mono">1</span>
                          <div>
                            <span className="font-bold text-slate-850 dark:text-slate-100 block">Access Report Complaint Form:</span>
                            <p className="text-[11px] text-slate-400">Navigate to "Report Complaint". Input descriptive titles and pick location variables (e.g. Block C, Room 204).</p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold flex justify-center items-center font-mono">2</span>
                          <div>
                            <span className="font-bold text-slate-850 dark:text-slate-100 block">Attach Media Verification Proof:</span>
                            <p className="text-[11px] text-slate-400">Drag and drop or select images displaying infrastructure faults. Our platform compresses payloads to save bandwidth.</p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold flex justify-center items-center font-mono">3</span>
                          <div>
                            <span className="font-bold text-slate-850 dark:text-slate-100 block">Communicate with AI Assistant:</span>
                            <p className="text-[11px] text-slate-400">Consult the embedded Gemini AI agent to query hostel guides, clarify repair timescales, or receive safety advice.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs text-slate-605 dark:text-slate-350 leading-relaxed">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Managing assigned tasks & closing complaints:</h4>
                      <div className="space-y-3">
                        <div className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold flex justify-center items-center font-mono">1</span>
                          <div>
                            <span className="font-bold text-slate-850 dark:text-slate-100 block">Monitor Active Workloads:</span>
                            <p className="text-[11px] text-slate-400">Open "Assigned Tasks" to inspect assigned repairs ordered by SLA timer urgency.</p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold flex justify-center items-center font-mono">2</span>
                          <div>
                            <span className="font-bold text-slate-850 dark:text-slate-100 block">Update Ticket Resolution:</span>
                            <p className="text-[11px] text-slate-400">Provide logs describing spare replacements or mechanical assemblies checked. Attach post-repair verification pictures.</p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold flex justify-center items-center font-mono">3</span>
                          <div>
                            <span className="font-bold text-slate-850 dark:text-slate-100 block">Submit Work Logs:</span>
                            <p className="text-[11px] text-slate-400">Mark task as "Resolved" to trigger automated notification sync to students' dashboards.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =========================================================================
                10. ADMIN & SYSTEM MANUAL SECTION
                ========================================================================= */}
            {activeTab === 'admin-manual' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                      <Users className="text-indigo-500" size={18} /> College Authority System Controls
                    </h3>
                    <p className="text-xs text-slate-400">Operational manual for complaint assignments, staff workload balancing, and maintenance monitoring.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-600 text-white"
                    >
                      College Authority Workflows
                    </button>
                  </div>

                  {adminManualRole === 'college-admin' ? (
                    <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Administrative tools, dispatch balancing, and QA:</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
                          <span className="font-bold block text-slate-850 dark:text-slate-100">Intelligent Ticket Allocations:</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Access "Staff Management" to review technicians' queues. The dispatch controller highlights staff holding active task backlogs to prevent bottlenecking.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
                          <span className="font-bold block text-slate-850 dark:text-slate-100">Live Testing & QA Operations:</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Deploy "Testing & QA Suite" to trigger browser-side unit assertions, RESTful payload fuzzers, and performance stress bench-testing of database connections.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs text-slate-605 dark:text-slate-350 leading-relaxed">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Database Administration, Multi-Tenant Audits, and Encryption:</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
                          <span className="font-bold block text-slate-850 dark:text-slate-100">Security Threat Monitoring:</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Audit active JWT bearer claims and verify input sanitizer protections against XSS HTML script injections using the Security Hub interface.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
                          <span className="font-bold block text-slate-850 dark:text-slate-100">Backup & DB Management:</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Initiate schema database replication backups under "Database & Backups". Run schema-mapping audits to ensure zero relational integrity losses.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Core Footer Info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-slate-450">
            <span className="flex items-center gap-1 font-mono">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Document references compiled in complete compliance with CampusCare specifications.
            </span>
            <span className="font-mono">Last updated: 2026-07-12 21:10 UTC</span>
          </div>

        </div>

      </div>
    </div>
  );
};
