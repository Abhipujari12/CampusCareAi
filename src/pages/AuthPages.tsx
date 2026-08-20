import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Role } from '../types';
import { Mail, Lock, User, Phone, Briefcase, ShieldCheck, KeyRound, ArrowLeft, Chrome, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setPage, login, loginWithGoogle, users } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [unauthDomainHost, setUnauthDomainHost] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    // Auto-detect role from the registered users list by email
    const registeredUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    let detectedRole: Role = 'student'; // default fallback
    if (registeredUser) {
      detectedRole = registeredUser.role;
    } else {
      // Intelligently infer based on pre-defined email suffixes if not registered
      if (email.toLowerCase().includes('admin@')) detectedRole = 'admin';
      else if (email.toLowerCase().includes('staff@')) detectedRole = 'staff';
    }

    try {
      setError('');
      setUnauthDomainHost(null);
      await login(email, detectedRole, password);
    } catch (err: any) {
      console.error("AuthPages Submit Error:", err);
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        setError('Email/Password provider is disabled in Firebase. Please enable it in Firebase Console > Authentication > Sign-in method, or sign in using Google.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please verify your credentials.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials or try Google login.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setUnauthDomainHost(null);
      await loginWithGoogle();
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        // User intentionally closed or cancelled the OAuth window; no error needed
        return;
      }
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('Unauthorized Domain')) {
        const host = err?.hostname || (typeof window !== 'undefined' ? window.location.hostname : 'current domain');
        setUnauthDomainHost(host);
        setError(`Firebase Auth: Unauthorized Domain (${host})\nTo use real Google Sign-In here, add "${host}" in Firebase Console > Authentication > Settings > Authorized domains.`);
        return;
      }
      console.error("AuthPages Google SignIn Error:", err);
      setError(err?.message || 'Google Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#060811] p-4 transition-colors relative overflow-hidden">
      {/* Background Ambience Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-[#111625] border border-slate-200/50 dark:border-slate-800/60 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6 relative z-10">
        
        {/* Back link */}
        <button 
          onClick={() => setPage('landing')} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Landing Page
        </button>

        {/* Brand */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 font-black text-xl shadow-md mx-auto">
            C
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white pt-2 font-display">
            CampusCare AI Portal
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400">
            Sign in to your secure campus maintenance account
          </p>
        </div>

        {error && (
          <div className="p-3.5 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/25 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 whitespace-pre-line leading-relaxed space-y-2">
            <p>{error}</p>
            {unauthDomainHost && (
              <div className="pt-2 border-t border-red-200/50 dark:border-red-900/50 flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Tip for mobile/laptop testing:
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Firebase requires adding <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200">{unauthDomainHost}</code> to Authorized Domains in Firebase console.
                </span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-450">College Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400"><Mail size={16} /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-450">Password</label>
              <button 
                type="button" 
                onClick={() => setPage('forgot-password')} 
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400"><Lock size={16} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & submit */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-transparent" 
              />
              Remember my workstation
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-850 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            Authenticate Secure Connection
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800/80"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">or continue with</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800/80"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Chrome size={15} className="text-blue-500 animate-pulse" />
          Sign In with Google Account
        </button>

        <div className="text-center pt-2 border-t border-slate-150 dark:border-slate-800/80">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button 
              onClick={() => setPage('register')} 
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { setPage, register, loginWithGoogle } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Water Leakage');
  const [college, setCollege] = useState("Institute of Technology & Engineering");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!name || !email || ((role === 'student' || role === 'staff') && !studentId)) {
      setError('Please populate all asterisk * fields.');
      return;
    }
    try {
      setError('');
      const finalStudentId = (role === 'student' || role === 'staff') ? studentId : 'N/A';
      await register(name, email, role, college, role === 'staff' ? department : '', finalStudentId, phone, password);
    } catch (err: any) {
      console.error("Register Error:", err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'student': return 'Student ID *';
      case 'staff': return 'Employee / Staff ID *';
      case 'admin': return 'College Authority Code *';
      default: return 'Identifier *';
    }
  };

  const getRolePlaceholder = () => {
    switch (role) {
      case 'student': return 'CS2023089';
      case 'staff': return 'EMP-90321';
      case 'admin': return 'AUTH-EAST-01';
      default: return 'ID Number';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD] dark:bg-[#060811] p-4 transition-colors relative overflow-hidden">
      {/* Background Ambience Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-2xl glass-card border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6 relative z-10">
        
        {/* Back link */}
        <button 
          onClick={() => setPage('login')} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
 
        {/* Brand */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Create CampusCare Account
          </h2>
          <p className="text-xs text-slate-400">
            Establish your campus credential and manage maintenance dispatch requests
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        {/* Account Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Select Workstation Account Type</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/30 dark:border-white/5 rounded-xl text-center">
            {(['student', 'staff', 'admin'] as Role[]).map(roleOption => (
              <button
                key={roleOption}
                type="button"
                onClick={() => setRole(roleOption)}
                className={`py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  role === roleOption 
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {roleOption === 'admin' ? 'College Authority' : roleOption === 'staff' ? 'Staff' : 'Student'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Full Name *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400"><User size={16} /></span>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* College Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400"><Mail size={16} /></span>
              <input
                type="email"
                required
                placeholder="johndoe@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400"><Phone size={16} /></span>
              <input
                type="text"
                placeholder="+1 (555) 012-3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Dynamic Identifier ID based on Role */}
          {(role === 'student' || role === 'staff') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{getRoleLabel()}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400"><ShieldCheck size={16} /></span>
                <input
                  type="text"
                  required
                  placeholder={getRolePlaceholder()}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
                />
              </div>
            </div>
          )}

          {/* Dynamic Specialty dropdown when role is staff */}
          {role === 'staff' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Assigned Specialty Trade *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400"><Briefcase size={16} /></span>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all cursor-pointer font-medium"
                >
                  <option value="Water Leakage">Water Leakage</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Fan">Fan</option>
                  <option value="Light">Light</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Washroom">Washroom</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Projector">Projector</option>
                  <option value="Security">Security</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Create Password *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400"><Lock size={16} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Confirm Password *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400"><Lock size={16} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-850 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              Submit Registration & Log In
            </button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
              <span className="relative px-2 bg-white dark:bg-[#111625] text-[10px] font-bold text-slate-400 uppercase tracking-wider">or register with</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  setError('');
                  await loginWithGoogle();
                } catch (err: any) {
                  if (
                    err?.code === 'auth/popup-closed-by-user' ||
                    err?.code === 'auth/cancelled-popup-request'
                  ) {
                    return;
                  }
                  if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('Unauthorized Domain')) {
                    const host = err?.hostname || (typeof window !== 'undefined' ? window.location.hostname : 'current domain');
                    setError(`Firebase Auth: Unauthorized Domain (${host}). Please add "${host}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`);
                    return;
                  }
                  setError(err?.message || 'Google Registration failed.');
                }
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Chrome size={15} className="text-blue-500" />
              <span>Sign up with Google Account</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-slate-150 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button 
              onClick={() => setPage('login')} 
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign back in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { setPage } = useApp();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [isSent, setIsSent] = useState(false);

  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setError('');
      setIsResetting(true);
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      console.info("Password reset dispatch fallback:", err);
      // Even if user is not in Firebase Auth, show success message to avoid email enumeration
      setIsSent(true);
    } finally {
      setIsResetting(false);
    }
  };

  const getRoleEmailLabel = () => {
    switch (role) {
      case 'student': return 'Student Email Address';
      case 'staff': return 'Staff Email Address';
      case 'admin': return 'College Authority Email Address';
      default: return 'Email Address';
    }
  };

  const getRoleEmailPlaceholder = () => {
    switch (role) {
      case 'student': return 'student@college.edu';
      case 'staff': return 'staff@college.edu';
      case 'admin': return 'authority@college.edu';
      default: return 'name@college.edu';
    }
  };

  const getRoleDescription = () => {
    switch (role) {
      case 'student': return 'Enter your student email address to receive secure OTP reset codes';
      case 'staff': return 'Enter your staff email address to receive secure OTP reset codes';
      case 'admin': return 'Enter your College Authority email address to receive secure OTP reset codes';
      default: return 'Enter your registered email address to receive secure OTP reset codes';
    }
  };

  const getRoleButtonLabel = () => {
    switch (role) {
      case 'student': return 'Dispatch Student Recovery Code';
      case 'staff': return 'Dispatch Staff Recovery Code';
      case 'admin': return 'Dispatch College Authority Recovery Code';
      default: return 'Dispatched OTP Recovery Code';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD] dark:bg-[#060811] p-4 transition-colors relative overflow-hidden">
      {/* Background Ambience Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md glass-card border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6 relative z-10">
        
        {/* Back link */}
        <button 
          onClick={() => setPage('login')} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
 
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 font-bold text-lg shadow-md mx-auto">
            <KeyRound size={18} />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white pt-2 font-display">
            Reset Portal Password
          </h2>
          <p className="text-xs text-slate-400">
            {getRoleDescription()}
          </p>
        </div>

        {/* Role/Account Type Selector inside Forgot Password */}
        {!isSent && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Select Workstation Account Type</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/30 dark:border-white/5 rounded-xl text-center">
              {(['student', 'staff', 'admin'] as Role[]).map(roleOption => (
                <button
                  key={roleOption}
                  type="button"
                  onClick={() => {
                    setRole(roleOption);
                    setEmail(''); // reset email to match chosen role placeholder
                  }}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    role === roleOption 
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {roleOption === 'admin' ? 'College Authority' : roleOption === 'staff' ? 'Staff' : 'Student'}
                </button>
              ))}
            </div>
          </div>
        )}

        {isSent ? (
          <div className="text-center space-y-4 py-2">
            <div className="p-3 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
              Password reset code dispatched! Check your {getRoleEmailLabel().toLowerCase()} {email} inbox.
            </div>
            <button
              onClick={() => setPage('login')}
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-950 dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-100 transition-all cursor-pointer"
            >
              Return to login portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{getRoleEmailLabel()}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400"><Mail size={16} /></span>
                <input
                  type="email"
                  required
                  placeholder={getRoleEmailPlaceholder()}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/30 focus:border-blue-500 focus:bg-white text-xs dark:text-slate-200 outline-hidden transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-850 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-semibold text-xs shadow-sm transition-all"
            >
              {getRoleButtonLabel()}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export const AuthPages: React.FC = () => {
  const { currentPage } = useApp();
  
  switch (currentPage) {
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;
    default:
      return <LoginPage />;
  }
};

