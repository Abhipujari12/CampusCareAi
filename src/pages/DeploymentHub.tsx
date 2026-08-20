import React, { useState, useEffect } from 'react';
import { 
  Cloud, Server, Database, Image, Mail, Globe, Cpu, ArrowUpRight, 
  CheckCircle2, AlertTriangle, RefreshCw, Play, Terminal, Lock, 
  Sliders, Search, ArrowRight, ExternalLink, Activity, Network, ShieldCheck, 
  Hourglass, Check, FileText, Send, Eye, Copy, Zap, BarChart2
} from 'lucide-react';

// =========================================================================
// TYPES & STRUCTURES FOR CLOUD INFRASTRUCTURE
// =========================================================================

interface DNSConfig {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  host: string;
  value: string;
  ttl: string;
  status: 'active' | 'propagating' | 'failed';
}

interface EnvVarDef {
  key: string;
  value: string;
  service: 'Frontend' | 'Backend' | 'Both';
  encrypted: boolean;
}

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: 'delivered' | 'bounced' | 'suppressed';
  template: 'SLA_BREACH' | 'TICKET_ASSIGNED' | 'RESOLUTION_POSTED';
}

export const DeploymentHub: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'frontend' | 'backend' | 'database' | 'storage' | 'email' | 'domain'>('overview');
  
  // Interaction and Simulation States
  const [isDeployingFrontend, setIsDeployingFrontend] = useState(false);
  const [frontendDeployLogs, setFrontendDeployLogs] = useState<string[]>([
    "Ready to initiate custom branch deployment..."
  ]);
  const [isDeployingBackend, setIsDeployingBackend] = useState(false);
  const [backendDeployLogs, setBackendDeployLogs] = useState<string[]>([
    "Ready to dispatch build webhook to Render..."
  ]);
  
  // Custom states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [emailSearch, setEmailSearch] = useState('');
  const [emailFilter, setEmailFilter] = useState<'all' | 'delivered' | 'bounced'>('all');
  const [showSecrets, setShowSecrets] = useState(false);
  
  // DNS Diagnostic tests
  const [dnsTesting, setDnsTesting] = useState(false);
  const [dnsResults, setDnsResults] = useState<Record<string, { resolved: boolean; latency: string; status: string }>>({});

  // DB Playground States
  const [dbQuery, setDbQuery] = useState('SELECT * FROM complaints WHERE priority = \'high\' LIMIT 3;');
  const [queryExecuting, setQueryExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Cloudinary Sandbox States
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [cloudinaryResponse, setCloudinaryResponse] = useState<any | null>(null);

  // Email Template Sandbox
  const [testEmailRecipient, setTestEmailRecipient] = useState('student@campuscare.ai');
  const [testEmailTemplate, setTestEmailTemplate] = useState<'TICKET_ASSIGNED' | 'SLA_BREACH' | 'RESOLUTION_POSTED'>('TICKET_ASSIGNED');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailSentResult, setTestEmailSentResult] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Run DNS Diagnostics
  const runDnsDiagnostics = () => {
    setDnsTesting(true);
    setDnsResults({});
    const endpoints = ['Virginia (US-East)', 'Singapore (SG-1)', 'London (UK-West)', 'Tokyo (JP-East)'];
    
    endpoints.forEach((endpoint, idx) => {
      setTimeout(() => {
        setDnsResults(prev => ({
          ...prev,
          [endpoint]: {
            resolved: true,
            latency: `${Math.floor(Math.random() * 25) + 8}ms`,
            status: 'FULLY_PROPAGATED_SECURE'
          }
        }));
        if (idx === endpoints.length - 1) {
          setDnsTesting(false);
        }
      }, (idx + 1) * 450);
    });
  };

  // Trigger Mock Frontend Build
  const triggerFrontendBuild = () => {
    setIsDeployingFrontend(true);
    setFrontendDeployLogs(["[Vercel CI/CD] Starting build pipeline for production v2.8.4..."]);
    
    const logs = [
      "Fetching code repository references from github:vsmsrkit/campuscare-ai (main)...",
      "Analyzing framework files: Found Vite + React 18 configuration.",
      "Executing dynamic dependency compiler: npm run build",
      "Vite v5.2.0 compiling assets for production mode...",
      "✓ 214 modules transformed and compressed.",
      "dist/index.html                     0.84 kB │ gzip:  0.42 kB",
      "dist/assets/index-D8g9F241.css     412.18 kB │ gzip: 52.41 kB",
      "dist/assets/index-Bp8v7R_2.js      812.45 kB │ gzip: 245.18 kB",
      "✓ Assets compiled successfully in 3.42 seconds.",
      "Uploading files to Edge Caches (41 global data-centers)...",
      "Assigning production alias: campuscare.vsmsrkit.edu.in",
      "✓ Deployment successful! SLA status changed to ACTIVE."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setFrontendDeployLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsDeployingFrontend(false);
        }
      }, (index + 1) * 400);
    });
  };

  // Trigger Mock Backend Build
  const triggerBackendBuild = () => {
    setIsDeployingBackend(true);
    setBackendDeployLogs(["[Render Deployer] Polling repository commit hashes..."]);

    const logs = [
      "Latest commit detected: 'feat: connect neon cluster connections pool'",
      "Allocating isolated Docker container virtualizer: 512MB RAM / 0.5 CPU",
      "Spawning secure Node.js execution environment...",
      "npm install --production in progress...",
      "Added 428 packages in 4.12s.",
      "Executing custom TypeScript build compiler: npm run build",
      "esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs succeeded.",
      "Running database check: Testing connection on Neon Serverless cluster...",
      "✓ Connection established. Active connection pool count: 2/20.",
      "Server listening on port 3000 at address 0.0.0.0",
      "Pinging healthy server heartbeat endpoints...",
      "✓ Live check completed. Backend is online."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setBackendDeployLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsDeployingBackend(false);
        }
      }, (index + 1) * 350);
    });
  };

  // Run database query sandbox
  const runDbQuery = () => {
    setQueryExecuting(true);
    setQueryResult(null);
    setQueryError(null);

    setTimeout(() => {
      const q = dbQuery.trim().toLowerCase();
      if (!q.includes('select')) {
        setQueryError("Error: Sandbox mode only supports read-only operations (SELECT queries).");
        setQueryExecuting(false);
        return;
      }

      if (q.includes('complaints')) {
        setQueryResult([
          { id: "CC-101", title: "Water cooler leak science wing", priority: "high", status: "assigned", student_id: "usr_902" },
          { id: "CC-104", title: "Projector color band damage Lab 3", priority: "high", status: "resolved", student_id: "usr_114" },
          { id: "CC-109", title: "Server rack secondary UPS beeping", priority: "high", status: "pending", student_id: "usr_201" }
        ]);
      } else if (q.includes('users') || q.includes('staff')) {
        setQueryResult([
          { id: "usr_501", name: "Ramesh Kumar", email: "ramesh.electrician@vsmsrkit.edu.in", role: "staff", specialty: "Electrical" },
          { id: "usr_502", name: "Srinivasan Rao", email: "srini.plumbing@vsmsrkit.edu.in", role: "staff", specialty: "Plumbing" },
          { id: "usr_503", name: "Latha M.", email: "latha.maintenance@vsmsrkit.edu.in", role: "staff", specialty: "General Maintenance" }
        ]);
      } else {
        setQueryResult([
          { schema_table: "users", active_tuples: 1042, indices: 4 },
          { schema_table: "complaints", active_tuples: 284, indices: 6 },
          { schema_table: "assignments", active_tuples: 198, indices: 2 }
        ]);
      }
      setQueryExecuting(false);
    }, 550);
  };

  // Simulate Cloudinary uploader
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setUploadingMedia(true);
      setCloudinaryResponse(null);

      setTimeout(() => {
        setCloudinaryResponse({
          asset_id: `cl_as_${Math.floor(Math.random() * 89999) + 10000}`,
          public_id: `campuscare/complaints/proof_${Date.now()}`,
          version: 1720821590,
          signature: "d751fb4372986420184bfe4e92bca7e8348",
          width: 1200,
          height: 900,
          format: "jpg",
          resource_type: "image",
          bytes: file.size,
          secure_url: `https://res.cloudinary.com/vsmsrkit/image/upload/v1720821590/campuscare/complaints/proof_${Date.now()}.jpg`,
          etag: "f1a238b725b82c7f4229b47e2"
        });
        setUploadingMedia(false);
      }, 900);
    }
  };

  // Simulate Resend Email Dispatcher
  const handleSendTestEmail = () => {
    setSendingTestEmail(true);
    setTestEmailSentResult(null);

    setTimeout(() => {
      setTestEmailSentResult(`id_resend_tx_${Math.floor(Math.random() * 899999) + 100000}`);
      setSendingTestEmail(false);
    }, 700);
  };

  // Constants Setup
  const dnsRecords: DNSConfig[] = [
    { type: 'CNAME', host: 'campuscare.vsmsrkit.edu.in', value: 'cname.vercel-dns.com', ttl: '600', status: 'active' },
    { type: 'A', host: 'api.campuscare.vsmsrkit.edu.in', value: '216.24.57.1', ttl: '3600', status: 'active' },
    { type: 'TXT', host: 'campuscare.vsmsrkit.edu.in', value: 'v=spf1 include:mailgun.org include:sendgrid.net include:amazonses.com include:resend.com ~all', ttl: '3600', status: 'active' },
    { type: 'MX', host: 'campuscare.vsmsrkit.edu.in', value: '10 feedback-smtp.us-east-1.amazonses.com', ttl: '14400', status: 'active' },
    { type: 'TXT', host: 'resend._domainkey.campuscare.vsmsrkit.edu.in', value: 'p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0y6...', ttl: '3600', status: 'active' }
  ];

  const envVariables: EnvVarDef[] = [
    { key: 'DATABASE_URL', value: 'postgres://campuscare_owner:neondb_proj_98@ep-slate-cloud-842.ap-southeast-1.neon.tech/campuscare', service: 'Backend', encrypted: true },
    { key: 'CLOUDINARY_URL', value: 'cloudinary://9482914184:g9As7X_149Fm@vsmsrkit-cdn', service: 'Backend', encrypted: true },
    { key: 'RESEND_API_KEY', value: 're_8fJsK9w3_Lp823m8XkL49', service: 'Backend', encrypted: true },
    { key: 'VITE_API_BASE_URL', value: 'https://api.campuscare.vsmsrkit.edu.in', service: 'Frontend', encrypted: false },
    { key: 'VITE_FIREBASE_API_KEY', value: 'AIzaSyA4F829L-X8K19FmS34', service: 'Frontend', encrypted: false },
    { key: 'VITE_FIREBASE_PROJECT_ID', value: 'campuscare-vsm-srkit', service: 'Frontend', encrypted: false },
    { key: 'JWT_SECRET', value: 'srkit_campus_ops_secure_salt_9042', service: 'Backend', encrypted: true }
  ];

  const emailLogs: EmailLog[] = [
    { id: 'tx_847192', recipient: 'student@campuscare.ai', subject: 'Urgent: SLA Threshold Breach warning for CC-104', sentAt: '2026-07-12 18:45', status: 'delivered', template: 'SLA_BREACH' },
    { id: 'tx_847184', recipient: 'electrician.ops@vsmsrkit.edu.in', subject: 'New Ticket Assigned: Labs Block Floor 3 Power Surge', sentAt: '2026-07-12 17:30', status: 'delivered', template: 'TICKET_ASSIGNED' },
    { id: 'tx_847161', recipient: 'complaints.monitor@vsmsrkit.edu.in', subject: 'Ticket Resolution Update: Corridor light replace', sentAt: '2026-07-12 14:15', status: 'delivered', template: 'RESOLUTION_POSTED' },
    { id: 'tx_847144', recipient: 'fake_recipient@vsmsrkit.edu.in', subject: 'Welcome Portal Authentication Invitation', sentAt: '2026-07-12 11:00', status: 'bounced', template: 'TICKET_ASSIGNED' }
  ];

  const filteredEmails = emailLogs.filter(log => {
    const matchesSearch = log.recipient.toLowerCase().includes(emailSearch.toLowerCase()) || 
                          log.subject.toLowerCase().includes(emailSearch.toLowerCase());
    const matchesFilter = emailFilter === 'all' || log.status === emailFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-850 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-850 dark:text-slate-100">
            <Cloud className="text-blue-500 fill-blue-500/10 animate-pulse" size={22} />
            Institutional Deployment & Cloud Services Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time visual monitoring, environments management, SLA telemetry, and diagnostics for the CampusCare AI platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Global Cluster SLA: 99.98%
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-[#1E293B]/60 rounded-xl max-w-4xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Topology Overview', icon: <Network size={14} /> },
          { id: 'frontend', label: 'Vercel Frontend', icon: <ArrowUpRight size={14} /> },
          { id: 'backend', label: 'Render Backend', icon: <Server size={14} /> },
          { id: 'database', label: 'Neon Serverless PG', icon: <Database size={14} /> },
          { id: 'storage', label: 'Cloudinary CDN', icon: <Image size={14} /> },
          { id: 'email', label: 'Resend SMTP', icon: <Mail size={14} /> },
          { id: 'domain', label: 'Domain & DNS Routing', icon: <Globe size={14} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/50 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: SYSTEM TOPOLOGY OVERVIEW
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Main Visual Topology Flow */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Synchronous Decoupled Hosting Grid</h3>
                  <p className="text-[11px] text-slate-400">Institutional routing map linking clients with backend clusters and APIs.</p>
                </div>
                <button 
                  onClick={runDnsDiagnostics} 
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-lg border border-slate-250 dark:border-slate-750 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <RefreshCw size={11} className={dnsTesting ? "animate-spin" : ""} />
                  Test Latency Paths
                </button>
              </div>

              {/* Topology Map Graph */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center space-y-4 min-h-80 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-500">CAMPUSCARE-CLUSTER-V2</div>
                
                <div className="grid grid-cols-3 gap-6 w-full max-w-lg z-10">
                  {/* Row 1: Frontend User Access */}
                  <div className="col-span-3 flex justify-center">
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 w-44 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Institutional URL</span>
                      <span className="text-[11px] font-bold text-white block mt-0.5 font-mono">campuscare.vsmsrkit.edu.in</span>
                      <span className="text-[9px] text-emerald-400 flex items-center justify-center gap-0.5 mt-1">
                        <ShieldCheck size={10} /> SSL Let's Encrypt ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Flow Arrow down */}
                  <div className="col-span-3 flex justify-center font-mono text-xs text-slate-600 font-bold">
                    ▼ HTTPS Decoupled DNS Router
                  </div>

                  {/* Left: Frontend Storage. Center: API Core. Right: Assets */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Hosting Web</span>
                      <span className="text-[10px] font-bold text-white block mt-0.5">Vercel Edge</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold block mt-2 text-center">
                      Healthy (3ms)
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-blue-900/40 rounded-xl p-2.5 text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider block">Compute Node</span>
                      <span className="text-[10px] font-bold text-white block mt-0.5">Render Container</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold block mt-2 text-center">
                      sin-1 (22ms)
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-purple-900/30 rounded-xl p-2.5 text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-purple-400 uppercase tracking-wider block">Media storage</span>
                      <span className="text-[10px] font-bold text-white block mt-0.5">Cloudinary CDN</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full font-bold block mt-2 text-center font-mono">
                      1.2GB/25GB
                    </span>
                  </div>

                  {/* Flows pointing down to DB and SMTP */}
                  <div className="col-span-3 grid grid-cols-2 text-slate-600 font-bold text-center text-[10px] font-mono">
                    <div>↙ Pool Multiplexer</div>
                    <div>↘ Transaction SMTP</div>
                  </div>

                  {/* Databases and Integrations */}
                  <div className="col-span-3 grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-2 text-center">
                      <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">NEON SERVERLESS PG</span>
                      <span className="text-[10px] text-white font-bold block">17 relational tables</span>
                      <span className="text-[9px] text-slate-450 font-mono">Size: 24.5 MB</span>
                    </div>

                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-2 text-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-mono">RESEND DELIVERY</span>
                      <span className="text-[10px] text-white font-bold block">notifications@vsmsrkit...</span>
                      <span className="text-[9px] text-emerald-400 font-mono">Verified DKIM</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Path Diagnostics Output */}
            {dnsTesting || Object.keys(dnsResults).length > 0 ? (
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Activity size={14} className="text-blue-500" /> DNS Propagation & Health Check telemetry
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Virginia (US-East)', 'Singapore (SG-1)', 'London (UK-West)', 'Tokyo (JP-East)'].map((endpoint) => {
                    const result = dnsResults[endpoint];
                    return (
                      <div key={endpoint} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">{endpoint}</span>
                          <span className="font-mono text-[9px] text-slate-400">DNS Resolution target: CNAME</span>
                        </div>
                        <div className="text-right">
                          {result ? (
                            <>
                              <span className="text-[10px] font-mono font-bold text-emerald-500 block">{result.latency}</span>
                              <span className="text-[8px] px-1 py-0.2 bg-emerald-500/10 text-emerald-500 rounded font-bold">{result.status}</span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 italic">
                              <Hourglass size={10} className="animate-spin text-blue-500" /> Resolving...
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Quick Metrics sidebar panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Resource Matrices</h3>
              
              <div className="space-y-3">
                {[
                  { label: "Frontend URL", value: "https://campuscare.vsmsrkit.edu.in", status: "ONLINE", prov: "Vercel" },
                  { label: "REST Endpoint", value: "https://api.campuscare.vsmsrkit.edu.in", status: "ONLINE", prov: "Render" },
                  { label: "DB Node Cluster", value: "ep-slate-cloud-842.neon.tech", status: "ONLINE", prov: "Neon PG" },
                  { label: "Media Bucket", value: "cloudinary://vsmsrkit-cdn", status: "ONLINE", prov: "Cloudinary" },
                  { label: "SMTP Server", value: "smtp.resend.com", status: "VERIFIED", prov: "Resend" }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-850 dark:text-slate-100">{item.prov} Provider</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-500 font-bold rounded">
                        {item.status}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-slate-450 truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action system keys mapping */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Lock size={12} className="text-blue-500" /> Environment Variables Vault
                </span>
                <button 
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="text-[10px] text-blue-500 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Eye size={11} /> {showSecrets ? 'Mask Variables' : 'Audit Keys'}
                </button>
              </div>

              <div className="space-y-2">
                {envVariables.slice(0, 5).map((env) => (
                  <div key={env.key} className="flex items-center justify-between p-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 block">{env.key}</span>
                      <span className="text-[9px] text-slate-400">{env.service} Integration</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="text-slate-400">
                        {showSecrets ? env.value.substring(0, 18) + '...' : '••••••••••••••••'}
                      </span>
                      <button 
                        onClick={() => handleCopy(env.key, env.value)}
                        className="p-1 rounded-md border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                      >
                        {copiedKey === env.key ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} className="text-slate-400" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FRONTEND DEPLOYMENT (VERCEL)
          ========================================================================= */}
      {activeTab === 'frontend' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 rounded-full font-mono uppercase">
                  Frontend Provider: VERCEL EDGE PLATFORM
                </span>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mt-2 flex items-center gap-1.5">
                  Static Distribution & React Router Endpoint
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compiles optimized chunks with zero flicker using dynamic Vite layouts. Edge caches resolve requests locally in sub-10ms.
                </p>
              </div>

              <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Commit Branch:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">main (Auto Trigger)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Latest Commit:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">feat: release campuscare-v2.8.4</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Hosting Domain:</span>
                  <a href="https://campuscare.vsmsrkit.edu.in" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline block mt-0.5 flex items-center gap-0.5">
                    campuscare.vsmsrkit.edu.in <ExternalLink size={10} />
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Average Load Latency:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">0.08 seconds (99% percentile)</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Deployment Trigger</span>
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">Manual Pipeline Trigger</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Repush compilation bundles across edge servers instantly.
                </p>
              </div>
              <button
                onClick={triggerFrontendBuild}
                disabled={isDeployingFrontend}
                className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-300"
              >
                {isDeployingFrontend ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Compiling Bundles...
                  </>
                ) : (
                  <>
                    <Play size={13} fill="currentColor" /> Trigger Vercel Build Pipeline
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Deployment Live Logs Terminal */}
          <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden shadow-lg">
            <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900 border-b border-slate-850">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-450 uppercase font-bold tracking-wider">
                <Terminal size={12} className="text-emerald-500" /> Vercel CLI Output Stream
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                {isDeployingFrontend ? 'BUILD_RUNNING' : 'IDLE'}
              </span>
            </div>
            <div className="p-4 font-mono text-[10px] text-slate-300 space-y-1.5 max-h-80 overflow-y-auto scrollbar-thin">
              {frontendDeployLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <span className="text-slate-600">[{idx + 1}]</span>
                  <span className={log.includes('✓') || log.includes('success') ? 'text-emerald-400 font-bold' : log.includes('Vite') ? 'text-blue-400' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: BACKEND DEPLOYMENT (RENDER)
          ========================================================================= */}
      {activeTab === 'backend' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 rounded-full font-mono uppercase">
                  Backend Compute Service: RENDER RUNTIME
                </span>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mt-2 flex items-center gap-1.5">
                  Asynchronous REST API Container Service
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Runs the Express server with bundled esbuild outputs, utilizing database connection multiplexers. Proxied calls execute with high stability inside Singapore containers.
                </p>
              </div>

              <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Server Instance:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">Starter Sandbox VM</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Target Region:</span>
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-200 block mt-0.5">Singapore (sin-1)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">SLA Metrics:</span>
                  <span className="font-mono font-bold text-emerald-600 block mt-0.5">99.98% uptime SLA</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Framework Type:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">Express (Node.js CJS Bundle)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Internal Port:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">Port 3000 (Ingress)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Container Memory:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">512 MB allocation</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Webhooks Deployer</span>
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">Build Webhook API</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Trigger automated pulls from repository main branches using custom git headers.
                </p>
              </div>
              <button
                onClick={triggerBackendBuild}
                disabled={isDeployingBackend}
                className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-300"
              >
                {isDeployingBackend ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Fetching Docker files...
                  </>
                ) : (
                  <>
                    <Zap size={13} fill="currentColor" /> Dispatch Webhook Trigger
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Render Build Terminal */}
          <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden shadow-lg">
            <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900 border-b border-slate-850">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-450 uppercase font-bold tracking-wider">
                <Terminal size={12} className="text-blue-450" /> Render Container Log Collector
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                {isDeployingBackend ? 'COMPILING' : 'ONLINE'}
              </span>
            </div>
            <div className="p-4 font-mono text-[10px] text-slate-300 space-y-1.5 max-h-80 overflow-y-auto scrollbar-thin">
              {backendDeployLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <span className="text-slate-600">[{idx + 1}]</span>
                  <span className={log.includes('✓') || log.includes('listening') ? 'text-emerald-400 font-bold' : log.includes('esbuild') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: DATABASE INTEGRATION (NEON POSTGRESQL)
          ========================================================================= */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 rounded-full font-mono uppercase">
                  Relational Cluster: NEON SERVERLESS POSTGRES
                </span>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mt-2 flex items-center gap-1.5">
                  Serverless PostgreSQL Database Cluster
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enforces cascading constraints, compound indices, and isolated roles across exactly 17 tables. Free-tier serverless limits allow up to 25 active concurrent connections.
                </p>
              </div>

              {/* Table stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1 text-xs">
                  <span className="text-slate-400 block">Allocated Size:</span>
                  <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">24.5 MB</span>
                  <span className="text-[10px] text-slate-400 block">Out of 500 MB Free Tier</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1 text-xs">
                  <span className="text-slate-400 block">Table Count:</span>
                  <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">17 Tables</span>
                  <span className="text-[10px] text-slate-400 block">With cascading constraints</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1 text-xs">
                  <span className="text-slate-400 block">Query Response Time:</span>
                  <span className="font-mono text-base font-bold text-emerald-600">8.4 ms</span>
                  <span className="text-[10px] text-slate-400 block">Pooled Multiplexer</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1 text-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">CONNECTION STRING</span>
                <span className="font-bold text-slate-850 dark:text-slate-100 block">Host URI details:</span>
                <p className="font-mono text-[10px] text-slate-400 mt-1 leading-relaxed bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800 overflow-x-auto">
                  ep-slate-cloud-842.ap-southeast-1.neon.tech
                </p>
              </div>
              <button
                onClick={() => handleCopy('neon-str', 'postgres://campuscare_owner:neondb_proj_98@ep-slate-cloud-842.ap-southeast-1.neon.tech/campuscare')}
                className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} /> Copy Secure URI String
              </button>
            </div>
          </div>

          {/* Database Live Playground */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal size={14} className="text-emerald-500" /> PostgreSQL Sandboxed Query Playground
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Dispatch structured queries to audit complaint schemas safely. Supports SELECT transactions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dbQuery}
                  onChange={(e) => setDbQuery(e.target.value)}
                  className="flex-1 bg-slate-950 text-slate-100 font-mono text-xs p-3 rounded-xl border border-slate-850 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  placeholder="SELECT * FROM complaints WHERE priority = 'high';"
                />
                <button
                  onClick={runDbQuery}
                  disabled={queryExecuting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  {queryExecuting ? 'Processing...' : 'Run Query'}
                </button>
              </div>

              {/* Playground Results Console */}
              {queryResult && (
                <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden font-mono text-xs">
                  <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 px-3 py-1.5 font-bold text-[10px] text-slate-500 uppercase flex justify-between">
                    <span>Query Output Grid (3 rows returned)</span>
                    <span className="text-emerald-500">Latency: 4.8ms</span>
                  </div>
                  <div className="divide-y divide-slate-150 dark:divide-slate-850 overflow-x-auto">
                    <div className="grid grid-cols-5 px-3 py-2 bg-slate-100/50 dark:bg-slate-900/20 font-bold text-slate-600 dark:text-slate-300">
                      {Object.keys(queryResult[0]).map((key) => (
                        <span key={key} className="truncate">{key}</span>
                      ))}
                    </div>
                    {queryResult.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-5 px-3 py-2 text-slate-705 dark:text-slate-350">
                        {Object.values(row).map((val: any, vidx) => (
                          <span key={vidx} className="truncate">{String(val)}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {queryError && (
                <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-500 font-mono text-xs rounded-xl flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  {queryError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: STORAGE PROVIDER (CLOUDINARY)
          ========================================================================= */}
      {activeTab === 'storage' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 rounded-full font-mono uppercase">
                  Media Engine: CLOUDINARY CDN
                </span>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mt-2 flex items-center gap-1.5">
                  Image Storage & CDN Optimization
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Allows direct unsigned client-side uploads, bypass-protecting Node backend containers from heavy multi-part payload loads. Automatically scales down high-resolution photo proof snapshots.
                </p>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Quota Storage Utilization:</span>
                    <span>1.2 GB / 25 GB</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-2" style={{ width: '4.8%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Unsigned Upload Bandwidth:</span>
                    <span>14.5 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-2" style={{ width: '29%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Direct Client Bypass</span>
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">Cloudinary Signed Presets</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Avoid blocking compute threads. Send image payloads straight to Cloudinary caches securely.
                </p>
              </div>
              <button
                onClick={() => handleCopy('cloud-preset', 'campuscare_unsigned_proof_preset')}
                className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} /> Copy Upload Preset Key
              </button>
            </div>
          </div>

          {/* Interactive uploader sandbox */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Image size={14} className="text-purple-500" /> Direct Unsigned File Upload Simulator
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload a repair/complaint image to simulate direct CDN pipeline execution with real response logging.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative bg-slate-50/20">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploadingMedia}
                />
                <Image className="text-slate-400 mb-2 animate-bounce" size={24} />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {uploadingMedia ? 'Uploading directly to Cloudinary API...' : 'Drag / click to upload repair proof'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP up to 10MB</p>
              </div>

              {/* Cloudinary JSON response terminal */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-[10px] text-slate-300 min-h-36 max-h-56 overflow-y-auto scrollbar-thin">
                {uploadingMedia ? (
                  <div className="h-full flex items-center justify-center text-slate-450 gap-2">
                    <RefreshCw size={12} className="animate-spin text-purple-500" />
                    Generating CDN upload signatures...
                  </div>
                ) : cloudinaryResponse ? (
                  <div className="space-y-1">
                    <p className="text-purple-400 font-bold">// Response 201 Created from Cloudinary API</p>
                    <pre>{JSON.stringify(cloudinaryResponse, null, 2)}</pre>
                  </div>
                ) : (
                  <p className="text-slate-500 italic flex items-center justify-center h-full">
                    Awaiting asset selection to dispatch upload stream...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: EMAIL SERVICE INTEGRATION (RESEND)
          ========================================================================= */}
      {activeTab === 'email' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 rounded-full font-mono uppercase">
                  Email Delivery Service: RESEND SMTP
                </span>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mt-2 flex items-center gap-1.5">
                  Transactional Mail Dispatch Pipeline
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sends beautifully rendered HTML template notices to students and maintenance floor technicians for auto-generated SLA alerts and dispatch assignments.
                </p>
              </div>

              <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-4 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Sender Domain:</span>
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-200 block mt-0.5 truncate">notifications@campuscare.vsmsrkit.edu.in</span>
                </div>
                <div>
                  <span className="text-slate-400 block">DKIM Verification:</span>
                  <span className="text-emerald-500 font-bold block mt-0.5 flex items-center gap-0.5">
                    <ShieldCheck size={11} /> Verified Active
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Deliverability Rate:</span>
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-200 block mt-0.5">99.92% (Strict SPF)</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Transactional Test</span>
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">HTML Templater Sandbox</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Verify DNS mail transport paths by dispatching sandboxed mock templates.
                </p>
              </div>
              <button
                onClick={() => handleCopy('resend-dkim', 'resend._domainkey.campuscare.vsmsrkit.edu.in')}
                className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} /> Copy DKIM Domain Key
              </button>
            </div>
          </div>

          {/* Sender Sandbox Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Selector & Dispatcher */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                  Dispatch Sandboxed Test Email
                </h4>
                <p className="text-[11px] text-slate-400">Trigger simulated transactional email notifications.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 block">Recipient Email:</label>
                  <input
                    type="email"
                    value={testEmailRecipient}
                    onChange={(e) => setTestEmailRecipient(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500"
                    placeholder="student@campuscare.ai"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 block">Template Type:</label>
                  <select
                    value={testEmailTemplate}
                    onChange={(e) => setTestEmailTemplate(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="TICKET_ASSIGNED">[TEMPLATE] Technical Ticket Assigned Notice</option>
                    <option value="SLA_BREACH">[TEMPLATE] SLA Critical Breach Warning Alert</option>
                    <option value="RESOLUTION_POSTED">[TEMPLATE] Ticket Resolution Verified & Closed</option>
                  </select>
                </div>

                <button
                  onClick={handleSendTestEmail}
                  disabled={sendingTestEmail}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {sendingTestEmail ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Dispatching SMTP Packets...
                    </>
                  ) : (
                    <>
                      <Send size={13} /> Trigger Email Delivery
                    </>
                  )}
                </button>

                {testEmailSentResult && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1 font-mono text-[11px]">
                    <span className="font-sans font-bold text-emerald-500 block">✓ Transaction Sent Successfully</span>
                    <p className="text-slate-500">Resend Message ID: <span className="font-bold text-slate-800 dark:text-slate-200">{testEmailSentResult}</span></p>
                    <p className="text-slate-400">SMTP Server Status: OK Delivery in 200ms</p>
                  </div>
                )}
              </div>
            </div>

            {/* Email Logs Grid */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                    Recent Delivery Audit Logs
                  </h4>
                  <div className="flex gap-2">
                    <select
                      value={emailFilter}
                      onChange={(e) => setEmailFilter(e.target.value as any)}
                      className="text-[10px] p-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md font-bold cursor-pointer"
                    >
                      <option value="all">All Logs</option>
                      <option value="delivered">Delivered Only</option>
                      <option value="bounced">Bounced Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-thin">
                  {filteredEmails.map((log) => (
                    <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-[11px]">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{log.recipient}</span>
                        <span className="text-slate-450">{log.sentAt}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium truncate">{log.subject}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono ${
                          log.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {log.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: ROUTING AND DOMAIN (CAMPUSCARE.VSMSRKIT.EDU.IN)
          ========================================================================= */}
      {activeTab === 'domain' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 rounded-full font-mono uppercase">
                  Institutional Domain Routing: VSMSRKIT.EDU.IN
                </span>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mt-2 flex items-center gap-1.5">
                  Secure Institutional Subdomain Routing
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Delegated authoritative records map subdomains safely using Let's Encrypt certificates. Cloudflare Edge proxies defend endpoints from DDoS vectors.
                </p>
              </div>

              <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Registered Domain Name:</span>
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-200 block mt-0.5">campuscare.vsmsrkit.edu.in</span>
                </div>
                <div>
                  <span className="text-slate-400 block">SSL Certificate Type:</span>
                  <span className="font-mono font-bold text-emerald-600 block mt-0.5">Let's Encrypt TLS 1.3</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Expiry Warning:</span>
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-200 block mt-0.5">Expires in 78 days (Auto renewing)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">CDN Proxy Mode:</span>
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-200 block mt-0.5">Cloudflare proxy mode bypassed</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">DNS Authoritative Nameservers</span>
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">Institutional NS Node:</span>
                <div className="font-mono text-[9px] text-slate-450 space-y-0.5 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800 mt-2">
                  <p>ns1.vsmsrkit.edu.in</p>
                  <p>ns2.vsmsrkit.edu.in</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy('domain-uri', 'campuscare.vsmsrkit.edu.in')}
                className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} /> Copy Domain URL
              </button>
            </div>
          </div>

          {/* DNS Records Map Grid */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                DNS Resource Records Zone Mapping
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Authoritative zone records mapping the institutional campuscare subdomain nodes.
              </p>
            </div>

            <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden">
              <div className="grid grid-cols-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 font-bold px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                <span>Record Type</span>
                <span>Host/Name</span>
                <span>Value/Target</span>
                <span>TTL</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-slate-150 dark:divide-slate-850 text-xs font-mono">
                {dnsRecords.map((rec, i) => (
                  <div key={i} className="grid grid-cols-5 px-3 py-3 text-slate-605 dark:text-slate-350 items-center">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {rec.type}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 truncate pr-2">{rec.host}</span>
                    <span className="text-slate-450 truncate pr-2 text-[11px]">{rec.value}</span>
                    <span className="text-slate-400">{rec.ttl}s</span>
                    <div>
                      <span className="text-emerald-500 font-bold text-[9px] px-1.5 py-0.2 bg-emerald-500/10 rounded">
                        {rec.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
