import React from 'react';
import { 
  Building2, Calendar, MapPin, Globe, Mail, Phone, Shield, 
  GraduationCap, Award, BookOpen, Warehouse, Users2, Landmark, 
  Tv, Compass, Wifi, Library, Coffee, ParkingCircle, HelpCircle, 
  ShieldCheck, Wrench, BarChart4, Cpu, Flame, CheckCircle, Home
} from 'lucide-react';

export const VSMSRKITProfile: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white border border-slate-900 shadow-xl dark:border-white/5">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-[-40%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-40%] left-[-10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white text-slate-950 flex flex-col items-center justify-center shadow-lg border border-slate-200 p-2 shrink-0">
            <Landmark size={44} className="text-blue-600" />
            <span className="text-[10px] font-black tracking-widest mt-1 text-slate-800">CAMPUS</span>
          </div>
          
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono uppercase tracking-wider">
              <ShieldCheck size={12} className="animate-pulse text-blue-400" /> Verified Campus Infrastructure
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-tight font-display">
              Institute of Technology & <br className="hidden md:inline" />
              Engineering Campus Profile
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-mono text-blue-400 font-bold"><Award size={14} /> Institution Code: E207</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Established Campus</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> Main Campus Complex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Essential College Metadata & Vision/Mission */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider font-mono">Affiliation</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 leading-snug">VTU Belagavi</p>
            </div>
            <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider font-mono">Approved By</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 leading-snug">AICTE, New Delhi</p>
            </div>
            <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider font-mono">Certification</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 leading-snug">ISO 9001:2015</p>
            </div>
            <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider font-mono">Campus Size</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 leading-snug">13.38 Acres</p>
            </div>
          </div>

          {/* Academic Blocks & Facilities */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <Building2 className="text-blue-500" size={18} />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">Campus Facilities & Locations</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Administration Block', desc: 'Main College Offices' },
                { label: 'Academic Buildings', desc: 'Lecture halls & wings' },
                { label: 'Computer Laboratories', desc: 'High-speed CSE labs' },
                { label: 'Department Labs', desc: 'ECE & Core engineering labs' },
                { label: 'Central Library', desc: 'Vast physical & digital logs' },
                { label: 'Seminar Hall', desc: 'Events & Guest talks' },
                { label: 'Workshop', desc: 'Mechanical & Civil facilities' },
                { label: 'Boys Hostel', desc: 'Secure student housing' },
                { label: 'Girls Hostel', desc: 'Secure student housing' },
                { label: 'Canteen', desc: 'Dining & Refreshments' },
                { label: 'Sports Facilities', desc: 'Indoor & outdoor activity grounds' },
                { label: 'Parking Area', desc: 'Dedicated two & four wheeler grids' },
              ].map((fac, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/10 space-y-1">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{fac.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">{fac.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
              <div className="absolute top-[-10px] right-[-10px] opacity-5 text-blue-500"><Compass size={80} /></div>
              <div className="flex items-center gap-2">
                <Compass className="text-blue-500" size={16} />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Our Vision</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                "Empowering the rural youth through technical education."
              </p>
            </div>
            <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
              <div className="absolute top-[-10px] right-[-10px] opacity-5 text-indigo-500"><Award size={80} /></div>
              <div className="flex items-center gap-2">
                <Award className="text-indigo-500" size={16} />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Our Mission</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                "To provide relevant education and training in an environment that inspires success and promotes self-reliance while contributing to regional development."
              </p>
            </div>
          </div>

          {/* Department Laboratories Detailed Grid */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="text-blue-500" size={18} />
                <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">Department Laboratories</h3>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">Equipped with Modern Hardware</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">💻 Computer Science Department Labs</p>
                <div className="flex flex-wrap gap-2">
                  {['Programming Lab', 'C Programming Lab', 'Advanced Development Environment (ADE) Lab', 'Computer Networks Lab'].map((lab, i) => (
                    <span key={i} className="px-3 py-1.5 text-xs rounded-xl border border-slate-150 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/10 font-medium">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">⚡ Electronics & Communication Department Labs</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Electronic Devices & Instrumentation Lab', 'Analog Circuits Lab', 
                    'Basic Electrical & Electronics Engineering Lab', 'Digital System Design Lab', 
                    'Digital Signal Processing Lab', 'Computer Network Lab', 'HDL Lab', 
                    'Microcontroller Lab', 'VLSI Lab', 'Communication Lab', 'Embedded Controller Lab'
                  ].map((lab, i) => (
                    <span key={i} className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-150 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/10 font-medium">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Programs, Contact, Nearby Transport, System mapping */}
        <div className="space-y-8">
          
          {/* Academic Programs */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <GraduationCap className="text-blue-500" size={18} />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">Academic Programs</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">B.E. Undergraduate (CSE, AIML, ECE, Mech, Civil)</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100/50 dark:border-slate-800/30">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Computer Science & Engineering</span>
                    <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400">CSE</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100/50 dark:border-slate-800/30">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Artificial Intelligence & ML</span>
                    <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400">AIML</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100/50 dark:border-slate-800/30">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Electronics & Communication</span>
                    <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400">ECE</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100/50 dark:border-slate-800/30">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Mechanical Engineering</span>
                    <span className="text-[10px] font-mono text-slate-400">ME</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Civil Engineering</span>
                    <span className="text-[10px] font-mono text-slate-400">CE</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Postgraduate</p>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Master of Business Administration</span>
                  <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400">MBA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <Phone className="text-blue-500" size={18} />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">Contact & Location</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700 dark:text-slate-350">Postal Address</p>
                  <p className="text-slate-500 leading-tight">Basava Vidya Nagar, Shripewadi Road, Nipani – 591237, Karnataka, India</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                <Globe size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700 dark:text-slate-350">Official Website</p>
                  <a href="https://www.vsmsrkit.edu.in" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                    https://www.vsmsrkit.edu.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700 dark:text-slate-350">Principal's Office Email</p>
                  <a href="mailto:principalvsmit@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    principalvsmit@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700 dark:text-slate-350">Office & Support Lines</p>
                  <p className="text-slate-500 font-mono">Tel: (08338) 221391</p>
                  <p className="text-slate-500 font-mono">Mobile: +91 9880217636</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transport Distances */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <Compass className="text-blue-500" size={18} />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">Nearby Transport Links</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-slate-800 dark:text-slate-300">Nipani Central Bus Stand</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300">~ 4 km</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-100/50 dark:border-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-300">Kolhapur Domestic Airport</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300">~ 36 km</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-100/50 dark:border-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-300">Kolhapur Junction Railway</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300">~ 42 km</span>
              </div>
            </div>
          </div>

          {/* VSMSRKIT Hostels */}
          <div className="bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <Home className="text-blue-500" size={18} />
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">Resident Hostel Facilities</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> Boys Hostel</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> Girls Hostel</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> RO Purified Water</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> In-house Mess</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> Guest Rooms</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> 24/7 Water Supply</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> Boiler Water Heating</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500 shrink-0" /> 24/7 Gate Guard</span>
            </div>
          </div>

          {/* System Developer Profile Card */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-blue-800/40 space-y-3">
            <div className="flex items-center gap-2 text-blue-300 text-[10px] font-mono uppercase tracking-wider">
              <Cpu size={14} className="text-blue-400" /> Platform Architecture
            </div>
            <div>
              <h4 className="text-base font-black text-white">CampusCare AI Engine</h4>
              <p className="text-xs text-blue-200 font-semibold mt-0.5">Smart Maintenance & Operational Infrastructure</p>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Engineered and deployed for streamlined institutional campus maintenance, smart priority triage, and multi-tier operational dispatch.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
