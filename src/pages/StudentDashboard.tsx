import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';
import { ComplaintDetailsPage } from './ComplaintDetailsPage';
import { NotificationSettings } from '../components/NotificationSettings';
import { Complaint, ComplaintStatus, PriorityLevel, Notification, AiVerification } from '../types';
import { BUILDINGS, CATEGORIES } from '../data/mockData';
import { 
  PlusCircle, FileText, Search, SlidersHorizontal, Calendar, Eye, 
  MapPin, Clock, Sparkles, CheckCircle2, MessageSquare, AlertCircle, 
  Send, User, Phone, BookOpen, Landmark, Upload, Star, ChevronRight,
  Info, CornerDownRight, Download, EyeOff, Camera, FolderOpen, Video, Trash2
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentPage, setPage, complaints, currentUser, selectedComplaintId, setSelectedComplaintId } = useApp();

  // Route sub-views
  switch (currentPage) {
    case 'home':
      return <StudentHome />;
    case 'report-complaint':
      return <ReportComplaintPage />;
    case 'my-complaints':
      return <MyComplaintsPage />;
    case 'complaint-details':
      return <ComplaintDetailsPage id={selectedComplaintId} />;
    case 'notifications':
      return <StudentNotificationsPage />;
    case 'ai-assistant':
      return <AIAssistantPage />;
    case 'profile':
      return <StudentProfilePage />;
    default:
      return <StudentHome />;
  }
};

// ==========================================
// 1. STUDENT HOME VIEW
// ==========================================
const StudentHome: React.FC = () => {
  const { setPage, complaints, currentUser, setSelectedComplaintId } = useApp();
  const [homeSearchTerm, setHomeSearchTerm] = useState('');

  const studentComplaints = complaints.filter(c => c.studentId === currentUser?.id);
  const total = studentComplaints.length;
  const pending = studentComplaints.filter(c => ['new', 'assigned', 'in-progress'].includes(c.status)).length;
  const resolved = studentComplaints.filter(c => c.status === 'resolved').length;
  const closed = studentComplaints.filter(c => c.status === 'closed').length;

  const filteredComplaints = studentComplaints.filter(c => {
    const q = homeSearchTerm.toLowerCase();
    return c.id.toLowerCase().includes(q) ||
           c.title.toLowerCase().includes(q) ||
           c.description.toLowerCase().includes(q) ||
           c.building.toLowerCase().includes(q) ||
           c.roomNumber.toLowerCase().includes(q);
  });

  const handleViewDetails = (id: string) => {
    setSelectedComplaintId(id);
    setPage('complaint-details');
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'medium': return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'high': return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30';
      case 'critical': return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/40 animate-pulse';
    }
  };

  const getStatusBadge = (s: ComplaintStatus) => {
    switch (s) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'assigned': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'closed': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Protocol Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-blue-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Student Protocol — Report</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight font-display">Campus Issue Reporting & Tracking</h2>
          <p className="text-xs text-blue-200/80">Submit complaints/issues, add description and photo, and track status in real time.</p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setPage('report-complaint')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle size={14} /> Report New Issue
          </button>
          <button
            onClick={() => setPage('my-complaints')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer"
          >
            <Clock size={14} /> Track Status
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Reports</p>
            <p className="text-2xl font-black mt-1 font-display">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileText size={18} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">In Progress / Review</p>
            <p className="text-2xl font-black mt-1 text-amber-500 font-display">{pending}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock size={18} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Resolved Tickets</p>
            <p className="text-2xl font-black mt-1 text-green-500 font-display">{resolved}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Closed Cases</p>
            <p className="text-2xl font-black mt-1 text-slate-500 font-display">{closed}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold">
            <SlidersHorizontal size={18} />
          </div>
        </div>
      </div>

      {/* Recent Complaints Table Section */}
      <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm font-display">Recent Maintenance Requests</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quickly view or filter your logged issues</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search input bar */}
            <div className="relative flex-1 sm:w-60">
              <span className="absolute left-3 top-2.5 text-slate-400"><Search size={14} /></span>
              <input
                type="text"
                placeholder="Filter by keyword or Ticket ID..."
                value={homeSearchTerm}
                onChange={(e) => setHomeSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-xs outline-hidden focus:border-blue-500 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>
            
            <button 
              onClick={() => setPage('my-complaints')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap self-end sm:self-auto cursor-pointer"
            >
              View All Complaints <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {studentComplaints.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <p className="text-sm">You haven't reported any complaints yet.</p>
            <button 
              onClick={() => setPage('report-complaint')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Report your first facility issue here
            </button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            No maintenance requests match "{homeSearchTerm}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4">Ticket ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredComplaints.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{c.id}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 max-w-[180px] truncate">{c.title}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1.5">
                      <MapPin size={12} /> {c.building} ({c.roomNumber})
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
                    <td className="p-4 text-slate-400 font-medium">
                      {new Date(c.createdDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleViewDetails(c.id)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Eye size={12} /> Track Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. REPORT COMPLAINT FORM VIEW (WITH AI AUTO DETECT)
// ==========================================
const ReportComplaintPage: React.FC = () => {
  const { addComplaint, currentUser, setPage } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [building, setBuilding] = useState(BUILDINGS[0]);
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [isAiDetecting, setIsAiDetecting] = useState(false);
  const [aiDetectedMessage, setAiDetectedMessage] = useState('');

  // Real Image Upload and AI Check States
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const [cloudinaryNotice, setCloudinaryNotice] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [aiVerification, setAiVerification] = useState<AiVerification | null>(null);

  // Device Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Sync camera stream with video element safely
  React.useEffect(() => {
    if (isCameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraOpen, cameraStream]);

  // Clean up stream on unmount
  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async (deviceId?: string) => {
    try {
      setUploadError('');
      // Stop existing stream if any
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setIsCameraOpen(true);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setAvailableDevices(videoDevices);
      if (!deviceId && videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      } else if (deviceId) {
        setSelectedDeviceId(deviceId);
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setUploadError(`Failed to access camera: ${err.message || 'Make sure camera permissions are granted.'}`);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture current frame from video stream
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert frame to PNG file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-capture-${Date.now()}.png`, { type: 'image/png' });
        handleImageFile(file);
      }
      stopCamera();
    }, 'image/png');
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const devId = e.target.value;
    setSelectedDeviceId(devId);
    startCamera(devId);
  };

  // Generate simulated before-repair photo based on selected category on canvas, and run verification
  const handleGenerateSimulatedPhoto = () => {
    setIsUploading(true);
    setUploadError('');
    setCloudinaryNotice('Synthesizing high-fidelity simulated before-photo...');
    setAiVerification(null);

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setUploadError('Failed to generate canvas context.');
      setIsUploading(false);
      return;
    }

    const catLower = category.toLowerCase();
    
    // Choose high-fidelity realistic background image based on selected category
    let bgUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=640&q=80'; // fallback
    if (catLower.includes('plumbing') || catLower.includes('water') || catLower.includes('pipe') || catLower.includes('leak') || catLower.includes('washroom')) {
      bgUrl = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&q=80';
    } else if (catLower.includes('electrical') || catLower.includes('spark') || catLower.includes('wire') || catLower.includes('power') || catLower.includes('electricity') || catLower.includes('light')) {
      bgUrl = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=640&q=80';
    } else if (catLower.includes('hvac') || catLower.includes('air') || catLower.includes('fan')) {
      bgUrl = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=640&q=80';
    } else if (catLower.includes('carpentry') || catLower.includes('furniture') || catLower.includes('chair') || catLower.includes('desk') || catLower.includes('door') || catLower.includes('lock')) {
      bgUrl = 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=640&q=80';
    } else if (catLower.includes('wifi') || catLower.includes('internet') || catLower.includes('network')) {
      bgUrl = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&q=80';
    } else if (catLower.includes('housekeeping') || catLower.includes('clean') || catLower.includes('garbage')) {
      bgUrl = 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=640&q=80';
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = bgUrl;

    const drawVisuals = (usingRealImage: boolean) => {
      if (!usingRealImage) {
        const grad = ctx.createLinearGradient(0, 0, 640, 480);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 480);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 640; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 480);
          ctx.stroke();
        }
        for (let j = 0; j < 480; j += 40) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(640, j);
          ctx.stroke();
        }
      }

      // Overlay visual telemetry viewfinder
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      const padding = 20;
      const cornerLen = 25;
      const w = 640;
      const h = 480;
      
      ctx.beginPath();
      ctx.moveTo(padding, padding + cornerLen); ctx.lineTo(padding, padding); ctx.lineTo(padding + cornerLen, padding);
      ctx.moveTo(w - padding, padding + cornerLen); ctx.lineTo(w - padding, padding); ctx.lineTo(w - padding - cornerLen, padding);
      ctx.moveTo(padding, h - padding - cornerLen); ctx.lineTo(padding, h - padding); ctx.lineTo(padding + cornerLen, h - padding);
      ctx.moveTo(w - padding, h - padding - cornerLen); ctx.lineTo(w - padding, h - padding); ctx.lineTo(w - padding - cornerLen, h - padding);
      ctx.stroke();

      // Camera center reticle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w / 2 - 20, h / 2); ctx.lineTo(w / 2 - 6, h / 2);
      ctx.moveTo(w / 2 + 6, h / 2); ctx.lineTo(w / 2 + 20, h / 2);
      ctx.moveTo(w / 2, h / 2 - 20); ctx.lineTo(w / 2, h / 2 - 6);
      ctx.moveTo(w / 2, h / 2 + 6); ctx.lineTo(w / 2, h / 2 + 20);
      ctx.stroke();

      // Red recording dot
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(45, 45, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('REC 4K', 58, 48);

      // Battery level indicator
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(550, 36, 28, 14);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(552, 38, 20, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(579, 40, 2, 6);
      ctx.font = '9px monospace';
      ctx.fillText('94%', 525, 47);

      // Defect Box Highlight Overlay
      const targetBox = { x: 140, y: 120, width: 360, height: 240 };
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      const bLen = 20;

      ctx.beginPath();
      ctx.moveTo(targetBox.x, targetBox.y + bLen); ctx.lineTo(targetBox.x, targetBox.y); ctx.lineTo(targetBox.x + bLen, targetBox.y);
      ctx.moveTo(targetBox.x + targetBox.width, targetBox.y + bLen); ctx.lineTo(targetBox.x + targetBox.width, targetBox.y); ctx.lineTo(targetBox.x + targetBox.width - bLen, targetBox.y);
      ctx.moveTo(targetBox.x, targetBox.y + targetBox.height - bLen); ctx.lineTo(targetBox.x, targetBox.y + targetBox.height); ctx.lineTo(targetBox.x + bLen, targetBox.y + targetBox.height);
      ctx.moveTo(targetBox.x + targetBox.width, targetBox.y + targetBox.height - bLen); ctx.lineTo(targetBox.x + targetBox.width, targetBox.y + targetBox.height); ctx.lineTo(targetBox.x + targetBox.width - bLen, targetBox.y + targetBox.height);
      ctx.stroke();

      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.fillRect(targetBox.x, targetBox.y, targetBox.width, targetBox.height);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(targetBox.x, targetBox.y - 24, 250, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`AI TARGET: ACTIVE ${category.toUpperCase()} DEFECT`, targetBox.x + 8, targetBox.y - 8);

      // Category-specific high-fidelity overlays
      if (catLower.includes('plumbing') || catLower.includes('water') || catLower.includes('pipe') || catLower.includes('leak') || catLower.includes('washroom')) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 4;
        for (let s = 0; s < 15; s++) {
          ctx.beginPath();
          ctx.arc(320 + (s % 3) * 12, 220 + s * 8, 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(targetBox.x + 30, targetBox.y + 30, targetBox.width - 60, targetBox.height - 60);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.fillRect(targetBox.x + 30, targetBox.y + 30, targetBox.width - 60, targetBox.height - 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText('💧 ACTIVE PLUMBING LEAK & PIPE RUPTURE', 100, 100);
        ctx.shadowBlur = 0;
      } else if (catLower.includes('electrical') || catLower.includes('spark') || catLower.includes('wire') || catLower.includes('power') || catLower.includes('electricity') || catLower.includes('light')) {
        const radialGrad = ctx.createRadialGradient(320, 240, 15, 320, 240, 100);
        radialGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
        radialGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.2)');
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(320, 240, 100, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3.5;
        for (let sp = 0; sp < 10; sp++) {
          ctx.beginPath();
          ctx.moveTo(320, 240);
          ctx.lineTo(260 + Math.random() * 120, 180 + Math.random() * 120);
          ctx.lineTo(200 + Math.random() * 240, 140 + Math.random() * 200);
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText('⚡ CRITICAL ELECTRICAL SPARKING & SINGE', 80, 100);
        ctx.shadowBlur = 0;
      } else if (catLower.includes('hvac') || catLower.includes('air') || catLower.includes('fan')) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fillRect(targetBox.x + 20, targetBox.y + 160, targetBox.width - 40, 60);
        
        ctx.fillStyle = '#38bdf8';
        for (let wd = 0; wd < 8; wd++) {
          ctx.beginPath();
          ctx.arc(160 + wd * 45, 260 + (wd % 2) * 10, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText('❄️ AC COIL FAILURE & CONDENSATION LEAK', 70, 100);
        ctx.shadowBlur = 0;
      } else if (catLower.includes('carpentry') || catLower.includes('furniture') || catLower.includes('chair') || catLower.includes('desk') || catLower.includes('door') || catLower.includes('lock')) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(220, 200);
        ctx.lineTo(250, 240);
        ctx.lineTo(230, 270);
        ctx.lineTo(270, 310);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText('🪑 BROKEN SUPPORT JOINT & STRUCTURAL DAMAGE', 60, 100);
        ctx.shadowBlur = 0;
      } else if (catLower.includes('wifi') || catLower.includes('internet') || catLower.includes('network')) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(200, 150);
        ctx.lineTo(440, 330);
        ctx.moveTo(440, 150);
        ctx.lineTo(200, 330);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText('🌐 NETWORK DISCONNECTED / ROUTER OFFLINE', 70, 100);
        ctx.shadowBlur = 0;
      } else if (catLower.includes('housekeeping') || catLower.includes('clean') || catLower.includes('garbage')) {
        ctx.fillStyle = 'rgba(120, 53, 4, 0.45)';
        ctx.beginPath();
        ctx.ellipse(320, 240, 120, 60, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText('🚮 UNHEALTHY TRASH SPILL & LIQUID STAIN', 80, 100);
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = 'rgba(217, 119, 6, 0.25)';
        ctx.beginPath();
        ctx.moveTo(320, 140);
        ctx.lineTo(440, 320);
        ctx.lineTo(200, 320);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText('⚠️ CRITICAL DEFECT REFERENCE RECORDED', 80, 100);
        ctx.shadowBlur = 0;
      }

      // Diagnostics overlay footer
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(10, 410, 620, 60);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 410, 620, 60);

      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('CAMPUSCARE AI™ ON-SITE VISUAL INSPECTION ENGINE', 25, 431);

      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.fillText(`COLLEGE ROSTER RECORD • CAT: ${category.toUpperCase()} • ROOM: ${roomNumber || 'CLASSROOM'} • BLDG: ${building.toUpperCase()}`, 25, 448);
      ctx.fillStyle = '#64748b';
      ctx.fillText(`IMMUTABLE AUTH CHAIN KEY: #S-${currentUser?.id || 'TEST'} • TIMESTAMP: ${new Date().toISOString()}`, 25, 461);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.font = 'bold 110px sans-serif';
      ctx.fillText('VERIFIED', 70, 320);

      canvas.toBlob((blob) => {
        if (!blob) {
          setUploadError('Failed to convert simulated image canvas to blob.');
          setIsUploading(false);
          return;
        }

        const mockFile = new File([blob], `simulated-${catLower.replace(/\s+/g, '-')}-defect.png`, { type: 'image/png' });
        handleImageFile(mockFile);
      }, 'image/png');
    };

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 640, 480);
      drawVisuals(true);
    };

    img.onerror = () => {
      console.warn("Could not load high-fidelity photo from Unsplash CDN. Falling back to structured vector concrete background.");
      drawVisuals(false);
    };
  };

  // Hidden file input ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Handle image file selection
  const handleImageFile = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file exceeds the 10MB limit.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setCloudinaryNotice('Reading file...');
    setAiVerification(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String); // Show instant preview

      try {
        // Step 1: Upload to Cloudinary via server-side secure upload proxy
        setCloudinaryNotice('Uploading to Cloudinary cloud storage...');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64String,
            mimeType: file.type
          })
        });

        if (!uploadRes.ok) {
          throw new Error(`Upload returned status ${uploadRes.status}`);
        }

        const uploadData = await uploadRes.json();
        setSelectedImage(uploadData.url); // Bind real Cloudinary URL

        if (uploadData.isMock) {
          setCloudinaryNotice('💡 Setup complete: Displaying pre-configured preview.');
        } else {
          setCloudinaryNotice('✅ Stored in Cloudinary successfully.');
        }

        // Step 2: Run Gemini 3.5 Flash Visual Inspection
        setIsCheckingImage(true);
        setCloudinaryNotice('Initiating CampusCare AI™ Visual Inspection...');
        const verifyRes = await fetch('/api/verify-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            mimeType: file.type
          })
        });

        if (!verifyRes.ok) {
          throw new Error(`AI audit returned ${verifyRes.status}`);
        }

        const verifyData = await verifyRes.json();
        const verifiedResult: AiVerification = {
          isGenuine: verifyData.isGenuine,
          confidence: verifyData.confidence,
          label: verifyData.label,
          details: verifyData.details,
          severity: verifyData.severity as PriorityLevel,
          suggestedCategory: verifyData.suggestedCategory,
          checkedAt: new Date().toISOString()
        };

        setAiVerification(verifiedResult);

        // Auto-configure the ticket based on real-world visual proof
        if (verifiedResult.isGenuine) {
          if (verifiedResult.suggestedCategory && CATEGORIES.includes(verifiedResult.suggestedCategory)) {
            setCategory(verifiedResult.suggestedCategory);
          }
          if (verifiedResult.severity) {
            setPriority(verifiedResult.severity);
          }
        }
      } catch (err: any) {
        console.error('Image upload or visual audit failure:', err);
        setUploadError(`Visual audit failed: ${err.message || 'unknown error'}`);
      } finally {
        setIsUploading(false);
        setIsCheckingImage(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read files.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Gemini Mock intelligence on keywords (fallback / manual trigger)
  const handleAiAutoDetect = () => {
    if (!description && !title) {
      setAiDetectedMessage('Please write a brief description first so AI can analyze the context.');
      return;
    }

    setIsAiDetecting(true);
    setAiDetectedMessage('');

    setTimeout(() => {
      const text = `${title} ${description}`.toLowerCase();
      let matchedCategory = CATEGORIES[0]; // Plumbing
      let matchedPriority: PriorityLevel = 'medium';

      if (text.includes('leak') || text.includes('water') || text.includes('pipe') || text.includes('dripping') || text.includes('tap') || text.includes('clog')) {
        matchedCategory = 'Plumbing';
        matchedPriority = text.includes('flooding') || text.includes('major') || text.includes('ceiling') ? 'high' : 'medium';
      } else if (text.includes('light') || text.includes('flicker') || text.includes('wire') || text.includes('power') || text.includes('shock') || text.includes('electricity') || text.includes('plug')) {
        matchedCategory = 'Electrical';
        matchedPriority = text.includes('shock') || text.includes('spark') ? 'critical' : 'high';
      } else if (text.includes('ac') || text.includes('air cond') || text.includes('fan') || text.includes('heat') || text.includes('rattle') || text.includes('cooling')) {
        matchedCategory = 'HVAC / Air Conditioning';
        matchedPriority = text.includes('server') || text.includes('loud') ? 'critical' : 'medium';
      } else if (text.includes('bench') || text.includes('desk') || text.includes('board') || text.includes('chair') || text.includes('door') || text.includes('lock') || text.includes('window') || text.includes('table')) {
        matchedCategory = 'Carpentry / Furniture';
        matchedPriority = text.includes('broken lock') ? 'high' : 'low';
      } else if (text.includes('wi-fi') || text.includes('wifi') || text.includes('internet') || text.includes('router') || text.includes('network') || text.includes('port')) {
        matchedCategory = 'WiFi / Internet';
        matchedPriority = 'medium';
      } else if (text.includes('dirty') || text.includes('garbage') || text.includes('trash') || text.includes('dust') || text.includes('clean') || text.includes('sweeping')) {
        matchedCategory = 'Housekeeping';
        matchedPriority = 'low';
      }

      setCategory(matchedCategory);
      setPriority(matchedPriority);
      setIsAiDetecting(false);
      setAiDetectedMessage(`✅ CampusCare AI detected: Category -> ${matchedCategory} | Priority -> ${matchedPriority.toUpperCase()}`);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !roomNumber) return;

    // Use selected mockup image or fallback to a category-relevant unsplash image
    let img = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';
    if (category.includes('Plumbing')) img = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80';
    if (category.includes('Electrical')) img = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80';
    if (category.includes('HVAC')) img = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80';
    if (category.includes('Carpentry')) img = 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80';

    addComplaint({
      title,
      description,
      building,
      roomNumber,
      category,
      priority,
      studentId: currentUser?.id || 'u-1',
      studentName: currentUser?.name || 'Student',
      images: selectedImage ? [selectedImage] : [img],
      aiVerification: aiVerification || undefined
    });

    setPage('my-complaints');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Report New Complaint</h2>
        <p className="text-xs text-slate-400 mt-0.5">Submit an issue with location coordinates. Our automated router dispatches staff immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl p-6 md:p-8 space-y-5 shadow-xs">
        
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Issue Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Broken faucet spilling water, Flickering lights"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/40 dark:bg-[#0F172A]/20 focus:border-blue-500/50 focus:bg-white/80 dark:focus:bg-slate-900/40 text-xs dark:text-slate-200 outline-hidden transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Detailed Description *</label>
            <button
              type="button"
              onClick={handleAiAutoDetect}
              disabled={isAiDetecting}
              className="text-[11px] font-bold text-slate-950 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/5 flex items-center gap-1.5 cursor-pointer transition-all shadow-xsScale"
            >
              <Sparkles size={12} className={isAiDetecting ? 'animate-spin' : ''} />
              {isAiDetecting ? 'AI Scanning...' : 'Auto Detect by AI'}
            </button>
          </div>
          <textarea
            required
            rows={4}
            placeholder="Please detail the location, severity, and any hazards (e.g. water dripping next to power sockets)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/40 dark:bg-[#0F172A]/20 focus:border-blue-500/50 focus:bg-white/80 dark:focus:bg-slate-900/40 text-xs dark:text-slate-200 outline-hidden transition-all"
          />
          {aiDetectedMessage && (
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-450 flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100/40 dark:border-blue-900/30">
              <Info size={12} /> {aiDetectedMessage}
            </p>
          )}
        </div>

        {/* Building & Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Building / Block *</label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 text-xs outline-hidden transition-all shadow-xs cursor-pointer"
            >
              {BUILDINGS.map(b => (
                <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium py-1">{b}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Room Number / Coordinate *</label>
            <input
              type="text"
              required
              placeholder="e.g. Room 302, Library Block B"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 text-xs outline-hidden transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Problem Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 text-xs outline-hidden transition-all shadow-xs cursor-pointer"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium py-1">{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Priority Level *</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 text-xs outline-hidden transition-all shadow-xs cursor-pointer"
            >
              <option value="low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium py-1">Low Priority (Minor Inconvenience)</option>
              <option value="medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium py-1">Medium Priority (Standard maintenance)</option>
              <option value="high" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium py-1">High Priority (Urgent structural repair)</option>
              <option value="critical" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium py-1">Critical Priority (Hazardous/Safety impact)</option>
            </select>
          </div>
        </div>

        {/* Real Drag & Drop Image Upload with AI Analysis Integration */}
        <div className="space-y-1.5">
          <div className="flex flex-row justify-between items-center gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">
              Upload Issue Image (Optional)
            </label>
            <button
              type="button"
              onClick={handleGenerateSimulatedPhoto}
              disabled={isUploading || isCheckingImage}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
              title="Generate a high-fidelity visual representation of the selected category on a canvas and analyze it with real Gemini AI."
            >
              <Sparkles size={12} className="text-blue-500 animate-pulse" />
              Generate Simulated Before-Photo
            </button>
          </div>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
            }}
            accept="image/*"
            className="hidden"
          />

          {isCameraOpen ? (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-900 text-white space-y-4 shadow-lg animate-fadeIn">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1.5 text-red-500 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  LIVE CAMERA VIEWPORT
                </span>
                {availableDevices.length > 1 && (
                  <select
                    value={selectedDeviceId}
                    onChange={handleDeviceChange}
                    className="bg-slate-800 text-slate-200 text-[11px] font-bold px-2 py-1 rounded-md border border-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    {availableDevices.map((device, idx) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-h-72 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                {/* Visual reticle */}
                <div className="absolute inset-0 border border-white/20 m-6 pointer-events-none flex items-center justify-center">
                  <div className="w-8 h-8 border border-white/45 rounded-full" />
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Camera size={14} />
                  Click Photo
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 rounded-xl p-6 text-center transition-all space-y-4 relative"
            >
              <div className="flex justify-center gap-6">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200/50 dark:border-white/5 cursor-pointer"
                >
                  <FolderOpen size={14} className="text-blue-500" />
                  Choose File
                </button>

                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-blue-100/50 dark:border-blue-900/30 cursor-pointer"
                >
                  <Camera size={14} />
                  Use Device Camera
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Or drag and drop your complaint photo here
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  PNG, JPG, JPEG up to 10MB (Verified instantly with CampusCare Visual AI)
                </p>
              </div>
            </div>
          )}

          {/* Cloudinary Upload Status & Notice */}
          {cloudinaryNotice && (
            <p className="text-[10px] text-blue-600 dark:text-blue-450 font-semibold mt-1">
              {cloudinaryNotice}
            </p>
          )}

          {uploadError && (
            <p className="text-[11px] text-red-500 font-semibold mt-1 bg-red-50 dark:bg-red-950/20 p-2 border border-red-100/50 dark:border-red-900/30 rounded-lg">
              ⚠️ {uploadError}
            </p>
          )}

          {/* Image preview & AI Audit Card */}
          {selectedImage && (
            <div className="mt-4 flex flex-col md:flex-row gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/20">
              <div className="relative shrink-0 mx-auto md:mx-0">
                <img 
                  src={selectedImage} 
                  alt="uploaded preview" 
                  className="w-32 h-32 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shadow-sm" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedImage(null);
                    setAiVerification(null);
                    setCloudinaryNotice('');
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* AI Audit details or skeleton loading */}
              <div className="flex-1 flex flex-col justify-center min-h-[128px]">
                {isUploading || isCheckingImage ? (
                  <div className="space-y-2 animate-pulse py-2 text-center md:text-left">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-sm w-3/4 mx-auto md:mx-0"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-sm w-5/6 mx-auto md:mx-0"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-sm w-2/3 mx-auto md:mx-0"></div>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 tracking-wider uppercase">CampusCare AI™ Auditing Facility Proof...</p>
                  </div>
                ) : aiVerification ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        aiVerification.isGenuine 
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900/40' 
                          : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/40'
                      }`}>
                        {aiVerification.isGenuine ? '✓ Genuine Issue Detected' : '⚠️ Flagged Content'}
                      </span>
                      <span className="text-slate-400 font-semibold font-mono text-[10px]">
                        Confidence: {(aiVerification.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1">
                      {aiVerification.label}
                    </h4>

                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                      {aiVerification.details}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <div className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md text-slate-600 dark:text-slate-350">
                        Category: {aiVerification.suggestedCategory}
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md text-slate-600 dark:text-slate-350 capitalize">
                        Severity: {aiVerification.severity}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 dark:text-slate-500 text-xs text-center md:text-left py-4">
                    ⚡ No visual checks recorded. Upload a photo of the defect for automatic AI routing and priority boost.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-850 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          Submit Formal Complaint
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 3. MY COMPLAINTS LIST VIEW
// ==========================================
const MyComplaintsPage: React.FC = () => {
  const { complaints, currentUser, setPage, setSelectedComplaintId, deleteComplaint, clearCompletedComplaints } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved' | 'closed'>('all');

  const studentComplaints = complaints.filter(c => c.studentId === currentUser?.id);
  const completedStudentComplaints = studentComplaints.filter(c => ['closed', 'resolved', 'rejected'].includes(c.status));

  // Filter complaints based on search and active tab
  const filteredComplaints = studentComplaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.building.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && ['new', 'assigned', 'in-progress'].includes(c.status);
    if (activeTab === 'resolved') return matchesSearch && c.status === 'resolved';
    if (activeTab === 'closed') return matchesSearch && c.status === 'closed';
    return matchesSearch;
  });

  const getStatusClass = (status: ComplaintStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
      case 'assigned': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'in-progress': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30';
      case 'closed': return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/40';
    }
  };

  const handleTrack = (id: string) => {
    setSelectedComplaintId(id);
    setPage('complaint-details');
  };

  const handleExportCSV = () => {
    if (!studentComplaints || studentComplaints.length === 0) {
      alert("No complaints found to export.");
      return;
    }

    const headers = ["Ticket ID", "Title", "Category", "Building", "Room", "Priority", "Status", "Date Submitted", "Assigned Technician"];
    const rows = studentComplaints.map(c => [
      `"${c.id}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.building}"`,
      `"${c.roomNumber}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${new Date(c.createdDate).toLocaleDateString()}"`,
      `"${c.assignedStaffName || 'Unassigned'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student_complaints_${currentUser?.studentId || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!studentComplaints || studentComplaints.length === 0) {
      alert("No complaints found to export.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("CampusCare AI™ - Student Complaint History", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Student: ${currentUser?.name || 'Student'} (${currentUser?.studentId || 'N/A'})`, 14, 28);
    doc.text(`College: ${currentUser?.college || "Institute of Technology & Engineering"}`, 14, 34);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 40);
    doc.text(`Total Logged Complaints: ${studentComplaints.length}`, 14, 46);

    doc.setLineWidth(0.4);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 50, 196, 50);

    let y = 60;
    studentComplaints.forEach((c, i) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`${i + 1}. [${c.id}] ${c.title}`, 14, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      y += 6;
      doc.text(`Category: ${c.category}  |  Location: ${c.building} (${c.roomNumber})`, 14, y);
      y += 5;
      doc.text(`Priority: ${c.priority.toUpperCase()}  |  Status: ${c.status.toUpperCase()}  |  Submitted: ${new Date(c.createdDate).toLocaleDateString()}`, 14, y);
      y += 5;
      const descLine = c.description.length > 95 ? c.description.substring(0, 95) + '...' : c.description;
      doc.text(`Description: ${descLine}`, 14, y);

      y += 8;
      doc.setDrawColor(241, 245, 249);
      doc.line(14, y, 196, y);
      y += 8;
    });

    doc.save(`student_complaints_${currentUser?.studentId || 'report'}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">My Complaint History</h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter, search, or review the historical timeline of your logged tickets.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {completedStudentComplaints.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm(`Auto-delete ${completedStudentComplaints.length} completed/closed complaints from your record?`)) {
                  clearCompletedComplaints();
                }
              }}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/40 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
              title="Delete all completed/closed complaints"
            >
              <Trash2 size={14} /> Clear Completed ({completedStudentComplaints.length})
            </button>
          )}
          <button 
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <FileText size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Navigation tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#1E293B] rounded-xl self-start overflow-x-auto max-w-full">
          {(['all', 'pending', 'resolved', 'closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-smScale dark:bg-[#0F172A] dark:text-white' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 md:max-w-xs">
          <span className="absolute left-3 top-3 text-slate-400"><Search size={14} /></span>
          <input
            type="text"
            placeholder="Search by ticket ID or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-xs outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Card Grid view */}
      {filteredComplaints.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm">No complaints found matching this criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map(c => (
            <div 
              key={c.id} 
              className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-900 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{c.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] font-bold capitalize ${getStatusClass(c.status)}`}>
                      {c.status}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ticket ${c.id}?`)) {
                          deleteComplaint(c.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                      title="Delete Ticket"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug">{c.title}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {c.building} ({c.roomNumber})
                </span>
                <button 
                  onClick={() => handleTrack(c.id)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Timeline <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. COMPLAINT DETAILS VIEW & COMMENTS (REPLACED WITH EXTERNAL IMPORT)
// ==========================================
interface DetailsProps {
  id: string | null;
}
const OldComplaintDetailsPage: React.FC<DetailsProps> = ({ id }) => {
  const { complaints, addComment, submitFeedback, setPage } = useApp();
  const [commentText, setCommentText] = useState('');
  
  // Rating states
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const c = complaints.find(item => item.id === id);
  if (!c) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-400">Complaint not found.</p>
        <button onClick={() => setPage('my-complaints')} className="text-blue-600 underline font-bold mt-2">Back to complaints</button>
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

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'assigned': return 'bg-amber-500';
      case 'in-progress': return 'bg-purple-600';
      case 'resolved': return 'bg-green-600';
      case 'closed': return 'bg-slate-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight">Ticket {c.id} Details</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold capitalize ${getStatusColor(c.status)}`}>
              {c.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Submitted on {new Date(c.createdDate).toLocaleString()}</p>
        </div>
        <button 
          onClick={() => setPage('my-complaints')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          ← Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Complaint Details & Comments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{c.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1"><MapPin size={12} /> {c.building} ({c.roomNumber})</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold text-slate-600 dark:text-slate-300">{c.category}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#0F172A]/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
              {c.description}
            </p>

            {/* Uploaded Images */}
            {c.images.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Student Attachment</p>
                <div className="flex gap-2">
                  {c.images.map((img, idx) => (
                    <img key={idx} src={img} alt="attachment" className="w-24 h-24 rounded-lg object-cover border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                  ))}
                </div>
              </div>
            )}

            {/* Repair Images */}
            {c.repairImages.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Resolution Proof (Staff Photo)</p>
                <div className="flex gap-2">
                  {c.repairImages.map((img, idx) => (
                    <img key={idx} src={img} alt="repair resolution proof" className="w-24 h-24 rounded-lg object-cover border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                  ))}
                </div>
              </div>
            )}

            {/* Resolved - CTA for closing with feedback */}
            {c.status === 'resolved' && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-green-800 dark:text-green-300">Repair Concluded!</p>
                  <p className="text-[11px] text-green-600 dark:text-green-400">Please review the repair quality and close the complaint.</p>
                </div>
                <button 
                  onClick={() => setIsFeedbackOpen(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Rate & Close Ticket
                </button>
              </div>
            )}
          </div>

          {/* Comments Panel */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h4 className="font-bold text-sm">Case Discussion / Comments</h4>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {c.comments.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No discussion notes yet on this case.</p>
              ) : (
                c.comments.map(comm => (
                  <div key={comm.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A]/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs uppercase shrink-0">
                      {comm.authorName[0]}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{comm.authorName}</span>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">({comm.authorRole})</span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(comm.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{comm.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Post comment input */}
            <form onSubmit={handlePostComment} className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <input 
                type="text" 
                placeholder="Write a message or update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500 transition-all"
              />
              <button 
                type="submit"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-all shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Audit Timeline Track */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs h-fit space-y-6">
          <div>
            <h4 className="font-bold text-sm">Complaint Timeline Audit</h4>
            <p className="text-[10px] text-slate-400">Step-by-step real-time facility log</p>
          </div>

          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-slate-100 dark:bg-slate-800" />

            {c.timeline.map((evt, index) => {
              const isLast = index === c.timeline.length - 1;
              return (
                <div key={index} className="relative">
                  {/* Point icon */}
                  <div className={`absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full ring-4 ${
                    isLast 
                      ? 'bg-blue-600 ring-blue-100 dark:ring-blue-900/30' 
                      : 'bg-slate-300 ring-slate-100 dark:bg-slate-700 dark:ring-slate-800'
                  }`} />
                  <div>
                    <p className={`text-xs font-bold leading-tight ${isLast ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                      {evt.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(evt.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      {new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">
                      {evt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assigned Staff Block */}
          {c.assignedStaffName && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
              <p className="text-xs font-bold text-slate-500">Assigned Technician</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                  {c.assignedStaffName[0]}
                </div>
                <div>
                  <p className="text-xs font-bold">{c.assignedStaffName}</p>
                  <p className="text-[10px] text-slate-400">Technical Dispatch Officer</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FEEDBACK MODAL DIALOG */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base">Rate Maintenance Repair</h3>
                <p className="text-xs text-slate-400 mt-0.5">Your ratings help us evaluate contractor and staff SLA response qualities.</p>
              </div>
              <button onClick={() => setIsFeedbackOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">X</button>
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
                  className="w-full px-4 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:bg-white rounded-xl outline-hidden focus:border-blue-500"
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

// ==========================================
// 5. NOTIFICATIONS LIST VIEW
// ==========================================
const StudentNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Portal Notifications</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">Active alerts tracking dispatch movements and technician statuses</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearNotifications}
            className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl">
            No active notification alerts
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-xl border transition-all flex gap-3 cursor-pointer ${
                !n.read 
                  ? 'bg-blue-50/30 border-blue-200/50 dark:bg-blue-950/10 dark:border-blue-900/30' 
                  : 'bg-white border-slate-150 dark:bg-[#1E293B] dark:border-slate-800'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 self-start mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold text-xs text-slate-800 dark:text-slate-100">{n.title}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{n.description}</p>
                <p className="text-[9px] text-slate-400 font-mono pt-1">
                  {new Date(n.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. AI CAMPUS ASSISTANT (CHAT BOT)
// ==========================================
interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  date: string;
}
const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Campus Care Assistant. You can ask me how to file a report, inquire about repair timelines, request room coordinates, or seek advice regarding residential maintenance policies.',
      date: new Date().toISOString()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const SUGGESTED_QUERIES = [
    'How do I report a broken dorm desk?',
    'What qualifies as a high priority repair?',
    'How long does a typical plumbing repair take?',
    'Who handles internet outage complaints?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      date: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    // AI smart delayed reply logic
    setTimeout(() => {
      let aiText = "I apologize, I didn't fully comprehend that query. Can you describe your facilities issue in more detail? I can also assist with categorizing it!";
      const q = text.toLowerCase();

      if (q.includes('dorm') || q.includes('desk') || q.includes('report')) {
        aiText = "To report a broken desk or general classroom/dorm furniture issue:\n1. Navigate to the **Report Complaint** page.\n2. Fill out details of your building Block and Room.\n3. Tap **Auto Detect by AI** to auto-assign priority.\n4. Standard carpentry and furniture repair SLA turns around in **1-2 business days**.";
      } else if (q.includes('priority')) {
        aiText = "CampusCare AI maps complaints into 4 SLA priorities:\n- **Critical (2-hour response)**: Fire/electrical spark hazards, severe dorm flooding, server room HVAC failures.\n- **High (12-hour response)**: General plumbing ceiling leaks, bedroom lock failures, flickering lab lightings.\n- **Medium (24-hour response)**: Weak WiFi speeds, classroom desks, squeaky hinges.\n- **Low (48-hour response)**: Non-urgent housekeeping request.";
      } else if (q.includes('plumbing') || q.includes('water')) {
        aiText = "Plumbing issues are high priority. A standard water faucet or restroom pipe repair takes **3 to 12 hours** to conclude, depending on dispatch times. If water is leaking onto electric boards, switch the local power board off and report immediately with **Critical** priority.";
      } else if (q.includes('internet') || q.includes('wifi')) {
        aiText = "Campus network and Wi-Fi outages are routed directly to the **Department of IT & Broadband Systems**. Standard resolution times vary from 2 to 24 hours. David Kojo and Sarah Jenkins from admin check routers on priority rounds.";
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: aiText,
        date: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[450px]">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="text-blue-500 animate-pulse" size={20} /> AI Assistant Chatbot
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time answers regarding dormitory repair codes, policies, and timelines</p>
      </div>

      {/* Suggested chips */}
      {messages.length === 1 && (
        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-xl my-3">
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Suggested Prompt Questions</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sq)}
                className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-600 dark:bg-[#1E293B] dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-blue-900 text-left transition-all"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat scroll box */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed space-y-1 ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white border border-slate-200 dark:bg-[#1E293B] dark:border-slate-800 rounded-bl-none text-slate-800 dark:text-slate-100'
            }`}>
              <div className="whitespace-pre-line">{m.text}</div>
              <p className={`text-[8px] text-right mt-1 ${m.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-[#1E293B] p-3 rounded-xl text-xs text-slate-400 animate-pulse">
              AI Assistant is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Chat input form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(userInput);
        }}
        className="flex gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 bg-slate-50 dark:bg-[#0F172A]"
      >
        <input
          type="text"
          placeholder="Ask AI about campus maintenance rules..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-[#1E293B] outline-hidden focus:border-blue-500 transition-all"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/10 shrink-0"
        >
          <Send size={14} /> Send
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 7. STUDENT PROFILE PAGE
// ==========================================
const StudentProfilePage: React.FC = () => {
  const { currentUser, updateUserAvatar } = useApp();
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Student')}&background=2563eb&color=fff&size=200`;

  const studentAvatarPresets = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader.result) {
        await updateUserAvatar(reader.result as string);
        setSuccessMsg('Profile photo updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (url: string) => {
    setUploading(true);
    await updateUserAvatar(url);
    setSuccessMsg('Profile photo updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Student Profile Card</h2>
        <p className="text-xs text-slate-400 mt-0.5">Your official academic credentials registered in CampusCare AI</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={14} /> {successMsg}
        </div>
      )}

      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
        
        {/* Left Side: Photo & Quick Tags */}
        <div className="bg-slate-50/50 dark:bg-slate-800/40 p-6 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800 text-center shrink-0 w-full md:w-52">
          <div className="relative group mb-3">
            <img 
              src={currentUser?.avatar || fallbackAvatar} 
              alt={currentUser?.name || 'Student'} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-800"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
              }}
            />
            <label 
              htmlFor="student-avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md cursor-pointer transition-all hover:scale-105"
              title="Upload new profile photo"
            >
              <Camera size={14} />
            </label>
            <input 
              type="file" 
              id="student-avatar-upload" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{currentUser?.name}</h4>
          <span className="inline-flex px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded text-[9px] font-bold uppercase mt-1.5 tracking-wider">
            {currentUser?.role || 'Student'} Member
          </span>

          {/* Quick preset pickers */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 w-full">
            <p className="text-[10px] font-bold text-slate-400 mb-2">Preset Avatars</p>
            <div className="flex items-center justify-center gap-1.5">
              {studentAvatarPresets.map((presetUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(presetUrl)}
                  className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                  title={`Avatar option ${idx + 1}`}
                >
                  <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed metadata */}
        <div className="p-6 flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">Student ID Card</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{currentUser?.studentId || 'N/A'}</p>
            </div>
            
            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">University Email</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{currentUser?.email}</p>
            </div>

            <div className="space-y-0.5 col-span-2">
              <p className="font-bold text-slate-400">Registered College</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{currentUser?.college || 'N/A'}</p>
            </div>

            <div className="space-y-0.5 col-span-2">
              <p className="font-bold text-slate-400">Academic Department</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{currentUser?.department || 'N/A'}</p>
            </div>

            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">Phone Contact</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{currentUser?.phone || 'N/A'}</p>
            </div>

            <div className="space-y-0.5">
              <p className="font-bold text-slate-400">Language preference</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">English (United States)</p>
            </div>
          </div>
        </div>

      </div>
      
      <NotificationSettings />
    </div>
  );
};
