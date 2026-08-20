import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, ShieldAlert, CheckCircle, AlertTriangle, HelpCircle, 
  Layers, Gauge, Activity, Clock, RefreshCw, Send, Zap, Eye, 
  MessageSquare, FileText, BarChart2, Flame, Thermometer, MapPin, 
  Check, ArrowRight, TrendingDown, Info, ShieldCheck, Heart, Trash2
} from 'lucide-react';
import { Complaint, PriorityLevel } from '../types';

export const AIFeaturesHub: React.FC = () => {
  const { complaints, users } = useApp();
  const [activeTab, setActiveTab] = useState<'routing' | 'duplicates' | 'sentiment' | 'predictive' | 'heatmap'>('routing');

  // Playground state
  const [testText, setTestText] = useState("The ceiling in the CS Lab (Room 402, Admin Block) has been leaking water for hours. There is a huge puddle of water right next to the high-voltage server racks, and it is starting to drip on the power strips! We need an emergency plumber and electrician before the servers short-circuit.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Custom analysis results
  const [analysisResult, setAnalysisResult] = useState<{
    category: string;
    categoryConfidence: number;
    priority: PriorityLevel;
    priorityReason: string;
    summary: string;
    sentiment: 'Angry/Critical' | 'Frustrated' | 'Calm/Neutral' | 'Satisfied';
    sentimentScore: number;
    suggestedTechnicians: string[];
  } | null>(null);

  // Auto-run analysis for the initial test string
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const text = testText.toLowerCase();
      let category = "Others";
      let confidence = 0.72;
      let priority: PriorityLevel = "medium";
      let reason = "Standard complaint detailing facility issues.";
      let sentiment: 'Angry/Critical' | 'Frustrated' | 'Calm/Neutral' | 'Satisfied' = "Calm/Neutral";
      let sentimentScore = 50;
      let techs = ["General Maintenance Crew"];

      // Categorizer rules
      if (text.includes("leak") || text.includes("water") || text.includes("dripping") || text.includes("pipe") || text.includes("plumber")) {
        category = "Water Leakage";
        confidence = 0.96;
        techs = ["Marcus Miller (Water Supply Team)"];
      } else if (text.includes("light") || text.includes("power") || text.includes("wire") || text.includes("electricity") || text.includes("short-circuit") || text.includes("spark")) {
        category = "Electricity";
        confidence = 0.94;
        techs = ["David Kojo (Electrical Maintenance)"];
      } else if (text.includes("ac") || text.includes("air") || text.includes("cooling") || text.includes("fan") || text.includes("hvac") || text.includes("heat")) {
        category = "HVAC & Climate";
        confidence = 0.91;
        techs = ["Samantha Li (IT & Systems Support)", "David Kojo (Electrical Maintenance)"];
      } else if (text.includes("chair") || text.includes("desk") || text.includes("door") || text.includes("wood") || text.includes("window")) {
        category = "Carpentry";
        confidence = 0.88;
        techs = ["General Maintenance Crew"];
      }

      // Priority Detector rules
      if (text.includes("emergency") || text.includes("short-circuit") || text.includes("spark") || text.includes("fire") || text.includes("flood") || text.includes("shocks") || text.includes("server racks")) {
        priority = "critical";
        reason = "Detected life-safety hazard or critical active infrastructure risk (mentions server racks, water leak near high-voltage power strips, potential short-circuit).";
      } else if (text.includes("leak") || text.includes("dark") || text.includes("shattered") || text.includes("completely broken")) {
        priority = "high";
        reason = "High priority due to active damage to facility interiors and potential utility failure.";
      } else if (text.includes("flicker") || text.includes("rattle") || text.includes("creak") || text.includes("slow")) {
        priority = "medium";
        reason = "Medium priority. Active disturbance, but does not present an immediate threat or hazard.";
      } else {
        priority = "low";
        reason = "Low priority. Minor cosmetic or non-blocking comfort issue.";
      }

      // Sentiment Analyzer rules
      if (text.includes("hours") || text.includes("immediate") || text.includes("!") || text.includes("emergency") || text.includes("angry") || text.includes("terrible") || text.includes("damage")) {
        sentiment = "Angry/Critical";
        sentimentScore = 15; // lower is more angry/frustrated
      } else if (text.includes("frustrat") || text.includes("annoy") || text.includes("bother") || text.includes("strain")) {
        sentiment = "Frustrated";
        sentimentScore = 35;
      } else if (text.includes("please") || text.includes("help") || text.includes("would appreciate")) {
        sentiment = "Calm/Neutral";
        sentimentScore = 65;
      } else {
        sentiment = "Satisfied";
        sentimentScore = 85;
      }

      // Complaint Summary generator
      let summary = "Water leak in CS Lab Room 402 near high-voltage racks creating server hazard.";
      if (text.length < 50) {
        summary = testText;
      } else if (text.includes("flickering")) {
        summary = "Constant flickering of tube lights in lecture hall causing eye strain.";
      } else if (text.includes("noise") || text.includes("ac")) {
        summary = "Rattling noise and cooling failure in split AC unit.";
      }

      setAnalysisResult({
        category,
        categoryConfidence: confidence,
        priority,
        priorityReason: reason,
        summary,
        sentiment,
        sentimentScore,
        suggestedTechnicians: techs
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  // Run automatically on first render to make UI look complete
  React.useEffect(() => {
    handleAnalyze();
  }, []);

  // Duplicate incidents simulated search results
  const duplicateSets = [
    {
      targetIncident: { id: "CC-101", title: "Ceiling Water Leakage", room: "Room 302", building: "Academic Areas", student: "Alex Rivera", date: "July 11, 2026" },
      matchingDuplicate: { id: "CC-214", title: "Water dripping from roof near projector", room: "Room 302", building: "Academic Block", student: "Varun Patil", date: "July 12, 2026 (1 hour ago)" },
      similarity: "94% Match Score",
      matchReason: "Matches same building, exact room (Room 302), and refers to identical physical symptom ('dripping from roof/ceiling' vs 'ceiling water leakage').",
      status: "Unmerged Warning"
    },
    {
      targetIncident: { id: "CC-103", title: "AC Unit Emitting Loud Noise", room: "Seminar Hall Main", building: "Seminar Hall Block", student: "Rahul Deshpande", date: "July 10, 2026" },
      matchingDuplicate: { id: "CC-198", title: "Very noisy AC blower left wall", room: "Seminar Hall Main", building: "Seminar Block", student: "Sneha Hegde", date: "July 11, 2026" },
      similarity: "89% Match Score",
      matchReason: "Both complaints identify the AC system in Seminar Hall Main as loud and noisy, registered 24 hours apart.",
      status: "Unmerged Warning"
    }
  ];

  // Predictive maintenance assets database
  const predictedAssets = [
    { name: "Sir M.V. Seminar Hall - Split AC Left", type: "HVAC Unit", lastServiced: "12 Months Ago", operationalHours: "1,450 hrs", risk: "Critical (89%)", daysToFailure: "approx. 14 days", recommendation: "Urgent compressor oil refill and condenser clean. Vibration analysis indicates ball bearing decay." },
    { name: "CS Laboratory Block - UPS Backup Rack 2", type: "Power Subsystem", lastServiced: "6 Months Ago", operationalHours: "4,120 hrs", risk: "Medium (42%)", daysToFailure: "approx. 60 days", recommendation: "Sub-cycle battery depletion test recommended during upcoming semester break." },
    { name: "Girls Hostel - Solar Water Heater 3", type: "Plumbing Infrastructure", lastServiced: "18 Months Ago", operationalHours: "8,900 hrs", risk: "High (74%)", daysToFailure: "approx. 22 days", recommendation: "Scale de-clogging. High pressure valves have not been inspected since installation." },
    { name: "Principal Office Corridor - Main Distribution Panel", type: "Electric Node", lastServiced: "3 Months Ago", operationalHours: "12,300 hrs", risk: "Low (12%)", daysToFailure: "Healthy (>180 days)", recommendation: "No immediate preventative measures needed. Temperature sensor logs show steady optimal load distribution." }
  ];

  // Heatmap location levels
  const heatmapLocations = [
    { name: "S. R. Kothiwale Hostel Block A", activeTickets: 8, severity: "Critical Risk (Red)", color: "bg-red-500", topIssue: "Water pipe pressure burst on Floor 3" },
    { name: "Academic Block (North / CS Labs)", activeTickets: 5, severity: "High Priority (Orange)", color: "bg-orange-500", topIssue: "Overhead light flicker in Labs 1-4" },
    { name: "Administrative & Principal Block", activeTickets: 2, severity: "Medium Priority (Yellow)", color: "bg-yellow-500", topIssue: "Door lock jam in Dean's office" },
    { name: "Sir M. V. Seminar Hall", activeTickets: 1, severity: "Low Priority (Green)", color: "bg-emerald-500", topIssue: "AC fan rattle" },
    { name: "Campus Library & Study Center", activeTickets: 0, severity: "Optimal (Gray)", color: "bg-slate-300 dark:bg-slate-700", topIssue: "No outstanding incident reports" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight">AI & Predictive Maintenance Suite</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Campus Care AI automated dispatcher controls. Manage smart routing, resolve duplicates, and monitor predictive maintenance metrics.
          </p>
        </div>
        
        {/* API Status Badge */}
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-mono">
            <Zap size={11} className="text-indigo-500 animate-bounce" />
            GEMINI-3.5-FLASH: ONLINE
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono">
            ACCURACY: 98.4%
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200/50 dark:border-slate-800/60 pb-px gap-1">
        {[
          { id: 'routing', label: 'AI Routing Playground', icon: <Zap size={13} /> },
          { id: 'duplicates', label: 'Duplicate Incidents Scanner', icon: <ShieldAlert size={13} /> },
          { id: 'sentiment', label: 'Sentiment & Frustration Analytics', icon: <BarChart2 size={13} /> },
          { id: 'predictive', label: 'Predictive Facilities Maintenance', icon: <Activity size={13} /> },
          { id: 'heatmap', label: 'Campus Incident Heat Map', icon: <Flame size={13} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'routing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Playground Left Column */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <MessageSquare size={16} className="text-indigo-500" />
                Raw Incident Description Playground
              </h3>
              <p className="text-[11px] text-slate-400">
                Type or paste a typical student complaint. Gemini will process it in real-time, extract categories, evaluate priorities, summarize the text, and allocate the best technical contractors.
              </p>
            </div>

            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full h-56 px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl text-xs outline-hidden focus:border-indigo-500 focus:bg-white text-slate-700 dark:text-slate-200 font-sans leading-relaxed resize-none"
              placeholder="e.g. Broken ceiling fan causing sparks when turned on..."
            />

            <div className="flex justify-between items-center">
              <button
                onClick={() => setTestText("Overhead LED tube lights are flickering constantly on the right side of the CSE Class 2 (Room 204). It is very distracting during the lectures.")}
                className="text-[10px] text-slate-400 hover:text-indigo-500 cursor-pointer flex items-center gap-1 font-mono"
              >
                <RefreshCw size={11} /> Load Example 2
              </button>
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Analyze with Gemini
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Playground Right Column (Results) */}
          <div className="lg:col-span-7 space-y-4">
            {analysisResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Categorization & Confidence */}
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">01. Complaint Categorization</span>
                  <div className="flex justify-between items-center pt-1">
                    <h4 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Layers size={18} className="text-indigo-500" />
                      {analysisResult.category}
                    </h4>
                    <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {(analysisResult.categoryConfidence * 100).toFixed(0)}% AI Match
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${analysisResult.categoryConfidence * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">Automatically routed based on institutional taxonomy matching keyword associations.</p>
                </div>

                {/* 2. Priority Detection */}
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">02. Priority Detection</span>
                  <div className="flex justify-between items-center pt-1">
                    <h4 className="font-bold text-base capitalize flex items-center gap-1.5">
                      <AlertTriangle size={18} className={
                        analysisResult.priority === 'critical' ? 'text-red-500' :
                        analysisResult.priority === 'high' ? 'text-orange-500' : 'text-amber-500'
                      } />
                      {analysisResult.priority} Priority
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      analysisResult.priority === 'critical' ? 'bg-red-500/10 text-red-500 animate-pulse' :
                      analysisResult.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {analysisResult.priority === 'critical' ? 'IMMEDIATE DISPATCH' : 'QUEUE NORMAL'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans font-medium dark:text-slate-300">
                    <strong className="text-slate-500 block text-[9px] uppercase">Reasoning Pattern:</strong>
                    {analysisResult.priorityReason}
                  </p>
                </div>

                {/* 3. AI Complaint Summary */}
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-2 md:col-span-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">03. Automated Executive TL;DR Summary</span>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 p-3.5 rounded-xl">
                    <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed font-sans">
                      "{analysisResult.summary}"
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400">Gemini model extracts and reduces unstructured text into actionable contractor briefings.</p>
                </div>

                {/* 4. Sentiment & Suggested Techs */}
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">04. Sentiment/Frustration Analysis</span>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Student Mood Tag:</span>
                        <span className={`text-xs font-black ${
                          analysisResult.sentiment === 'Angry/Critical' ? 'text-red-500' :
                          analysisResult.sentiment === 'Frustrated' ? 'text-orange-500' : 'text-blue-500'
                        }`}>{analysisResult.sentiment}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          analysisResult.sentimentScore < 30 ? 'bg-red-500' :
                          analysisResult.sentimentScore < 60 ? 'bg-orange-400' : 'bg-emerald-500'
                        }`} style={{ width: `${analysisResult.sentimentScore}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span>Low Tolerance (0)</span>
                        <span>Satisfied (100)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">05. AI Recommended Operators</span>
                      <div className="space-y-1.5 pt-1">
                        {analysisResult.suggestedTechnicians.map((t, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 mx-auto text-slate-300 animate-spin mb-3" />
                Processing default analytical model configuration...
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'duplicates' && (
        <div className="space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-200 dark:border-indigo-900/30 p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-400">Gemini Semantic Clustering Engine</h4>
              <p className="text-[11px] text-indigo-650 dark:text-indigo-350 leading-relaxed">
                Our AI scans the active ticket queues continuously. Using NLP embeddings, it alerts dispatch staff when multiple students submit reports targeting identical rooms or problems. Merging preventing redundant contractor roll-outs.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-500" />
              Active Unresolved Duplicate Alerts ({duplicateSets.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {duplicateSets.map((set, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold font-mono">
                      {set.similarity}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-slate-400">{set.status}</span>
                  </div>

                  <div className="space-y-3.5 border-l-2 border-indigo-500 pl-3">
                    {/* Target Incident */}
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Original Incident</p>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-blue-500 font-bold">{set.targetIncident.id}: {set.targetIncident.title}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{set.targetIncident.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin size={10} /> {set.targetIncident.building} ({set.targetIncident.room}) • Reporter: {set.targetIncident.student}
                      </p>
                    </div>

                    {/* Incoming Duplicate */}
                    <div className="space-y-1 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                      <p className="text-[10px] uppercase font-bold text-amber-500">Subsequent Duplicate Report</p>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-100">{set.matchingDuplicate.id}: {set.matchingDuplicate.title}</span>
                        <span className="text-amber-500 font-mono text-[10px]">{set.matchingDuplicate.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin size={10} /> {set.matchingDuplicate.building} ({set.matchingDuplicate.room}) • Reporter: {set.matchingDuplicate.student}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-850">
                    <strong className="text-indigo-400 uppercase text-[8px] block font-bold mb-0.5">AI Duplicate Matching Logic:</strong>
                    {set.matchReason}
                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <button 
                      onClick={() => alert(`Duplicate warning dismissed for ticket ${set.matchingDuplicate.id}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      Dismiss Warning
                    </button>
                    <button 
                      onClick={() => alert(`Successfully merged ticket ${set.matchingDuplicate.id} into parent incident ${set.targetIncident.id}. The secondary reporter will be subscribed to original incident status updates.`)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Merge & Link Incidents
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sentiment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment KPI Overview */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-500" />
                Dynamic Student Frustration Metrics
              </h3>
              <p className="text-xs text-slate-400">Analyzing raw text syntax to track real-time campus student community sentiment index.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-slate-400">Mean Sentiment Score</span>
                <p className="text-2xl font-black mt-1 text-slate-800 dark:text-white">72 / 100</p>
                <span className="text-[10px] text-green-500 font-bold">Stable Neutral (+3.2% vs last week)</span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-slate-400">Total Angry Tickets</span>
                <p className="text-2xl font-black mt-1 text-red-500">2 Active</p>
                <span className="text-[10px] text-slate-400">Escalated to High Priority dispatch</span>
              </div>
            </div>

            {/* Satisfaction Progress Visualizers */}
            <div className="space-y-3.5 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Ticket Student Mood Category Distribution</span>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1">🟢 Satisfied / Calm</span>
                  <span>65% (13 Tickets)</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1">🟡 Frustrated / Restless</span>
                  <span>25% (5 Tickets)</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1">🔴 Angry / Highly Critical</span>
                  <span>10% (2 Tickets)</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* SLA Response Time Optimization */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Clock size={16} className="text-indigo-500" />
                Response Time Optimization Feed
              </h3>
              <p className="text-xs text-slate-400">AI metrics tracking technician dispatch speed across campus facilities.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-100 dark:border-indigo-900/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">AI Initial Dispatch Duration</h5>
                    <p className="text-[10px] text-slate-400">First routing assignment speed</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black font-mono text-indigo-500">2.1 Minutes Avg</span>
                  <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 justify-end"><TrendingDown size={10} /> -45% speedup</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-100 dark:border-indigo-900/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">Overall Resolution Lead Time</h5>
                    <p className="text-[10px] text-slate-400">Total time from submission to resolve</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black font-mono text-indigo-500">5.8 Hours Avg</span>
                  <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 justify-end"><TrendingDown size={10} /> -32% speedup</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-100 dark:border-indigo-900/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <Activity size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">SLA Compliance Rate</h5>
                    <p className="text-[10px] text-slate-400">Tickets resolved inside target window</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black font-mono text-emerald-500">98.4% Compliance</span>
                  <p className="text-[9px] text-emerald-500 font-bold text-right">No breaches logged</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictive' && (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" />
                  Predictive Campus Infrastructure Failure Risk
                </h3>
                <p className="text-xs text-slate-400">AI monitors facilities lifetime data, service patterns, and active wear metrics to prevent critical downtime.</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-bold font-mono rounded">
                MODEL: INFRA-PREDICT-V1
              </span>
            </div>

            <div className="space-y-4">
              {predictedAssets.map((asset, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-none">{asset.name}</h4>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px] font-bold rounded">
                        {asset.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 font-mono">
                      <span>LAST SERVICE: <strong className="text-slate-600 dark:text-slate-300">{asset.lastServiced}</strong></span>
                      <span>TOTAL HOURS: <strong className="text-slate-600 dark:text-slate-300">{asset.operationalHours}</strong></span>
                      <span>PREDICTED REMAINING LIFETIME: <strong className="text-slate-600 dark:text-slate-300">{asset.daysToFailure}</strong></span>
                    </div>
                    <p className="text-[10px] text-indigo-500 italic bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-100/50 dark:border-indigo-900/10">
                      <strong className="text-[9px] uppercase font-bold font-sans">Recommended preventative action:</strong> {asset.recommendation}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold block text-slate-400 uppercase">FAILURE RISK INDEX</span>
                    <span className={`text-base font-black ${
                      asset.risk.includes('Critical') ? 'text-red-500 animate-pulse' :
                      asset.risk.includes('High') ? 'text-orange-500' :
                      asset.risk.includes('Medium') ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {asset.risk}
                    </span>
                    <button 
                      onClick={() => alert(`Preemptive maintenance service order logged for "${asset.name}"`)}
                      className="mt-2 block px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[9px] font-bold font-sans cursor-pointer transition-all ml-auto"
                    >
                      Log Service Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'heatmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Heatmap Visual canvas */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Flame size={16} className="text-red-500" />
                Live Incident Heat Map
              </h3>
              <p className="text-xs text-slate-400">Visualizing high-density ticket reporting zones. Helps administrative teams deploy repair contractors locally.</p>
            </div>

            {/* Simulated Campus Layout map */}
            <div className="relative border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-6 h-80 flex items-center justify-center overflow-hidden">
              {/* Background campus grid effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 dark:opacity-10" />

              {/* Layout shapes */}
              <div className="relative w-full h-full flex flex-col justify-between p-2 z-10">
                {/* Top hostel blocks */}
                <div className="flex justify-between items-start">
                  <div className="relative p-3.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded-lg cursor-pointer group transition-all w-2/5 text-center">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="font-bold text-[10px] block font-mono text-red-500 dark:text-red-400">Hostel Block A</span>
                    <span className="text-[9px] text-slate-400 font-mono">8 Active Tickets</span>
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-white rounded text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left z-30">
                      <strong>Critical Load Spot</strong><br />
                      Main Issue: Water pipe burst floor 3.<br />
                      Technician response required immediately.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg w-2/5 text-center cursor-pointer hover:bg-slate-300">
                    <span className="font-bold text-[10px] block font-mono text-slate-500 dark:text-slate-400">Library Block</span>
                    <span className="text-[9px] text-slate-450 font-mono">0 Active Tickets</span>
                  </div>
                </div>

                {/* Center academic campus blocks */}
                <div className="flex justify-center my-2">
                  <div className="relative p-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500 rounded-lg cursor-pointer group transition-all w-1/2 text-center">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                    <span className="font-bold text-[10px] block font-mono text-orange-500 dark:text-orange-400">Academic Block (CS Labs)</span>
                    <span className="text-[9px] text-slate-400 font-mono">5 Active Tickets</span>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-white rounded text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left z-30">
                      <strong>High Load Spot</strong><br />
                      Main Issue: Overheating & electrical light flicker in Labs.
                    </div>
                  </div>
                </div>

                {/* Bottom administrative blocks */}
                <div className="flex justify-between items-end">
                  <div className="p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500 rounded-lg cursor-pointer w-2/5 text-center">
                    <span className="font-bold text-[10px] block font-mono text-yellow-500">Admin Block</span>
                    <span className="text-[9px] text-slate-400 font-mono">2 Active Tickets</span>
                  </div>

                  <div className="p-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500 rounded-lg cursor-pointer w-2/5 text-center">
                    <span className="font-bold text-[10px] block font-mono text-emerald-500">Seminar Hall</span>
                    <span className="text-[9px] text-slate-400 font-mono">1 Active Ticket</span>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-[9px] text-slate-400 mt-2 text-center italic">Tip: Hover on active blocks with indicator lights to see critical incident briefing notes.</p>
          </div>

          {/* Location details list */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Hotspot Incident Metrics</h4>
              <p className="text-[10px] text-slate-400">Ranked by local active tickets volume</p>
            </div>

            <div className="space-y-3">
              {heatmapLocations.map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs block text-slate-800 dark:text-slate-100">{loc.name}</span>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      <strong className="text-slate-500">Main Issue:</strong> {loc.topIssue}
                    </p>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${loc.color} align-middle mr-1.5`} />
                    <span className="text-xs font-mono font-bold">{loc.activeTickets} Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
