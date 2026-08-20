import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, Mail, MessageSquare, Smartphone, Check, Loader2, Sparkles, 
  HelpCircle, Settings, ShieldCheck, Save, Send, AlertCircle
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export const NotificationSettings: React.FC = () => {
  const { currentUser } = useApp();
  
  // State for notification channels
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
 
  // Contact details
  const [emailAddress, setEmailAddress] = useState(currentUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  
  // Simulated state for interactive permission requests
  const [pushPermission, setPushPermission] = useState<'default' | 'prompting' | 'granted' | 'denied'>('default');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
 
  // Load preferences on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser) return;
      
      // Load from localStorage first as instant fallback
      try {
        const local = localStorage.getItem(`cc_notif_prefs_${currentUser.id}`);
        if (local) {
          const parsed = JSON.parse(local);
          setEmailEnabled(parsed.emailEnabled ?? true);
          setInAppEnabled(parsed.inAppEnabled ?? true);
          setPushEnabled(parsed.pushEnabled ?? false);
          setSmsEnabled(parsed.smsEnabled ?? false);
          setWhatsappEnabled(parsed.whatsappEnabled ?? false);
          if (parsed.emailAddress) setEmailAddress(parsed.emailAddress);
          if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
          if (parsed.pushPermission) setPushPermission(parsed.pushPermission);
        }
      } catch (err) {
        console.error("Local storage read error: ", err);
      }

      try {
        // Fetch from Firestore for authoritative synchronization
        const path = `users/${currentUser.id}/settings/notifications`;
        const docRef = doc(db, 'users', currentUser.id, 'settings', 'notifications');
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setEmailEnabled(data.emailEnabled ?? true);
          setInAppEnabled(data.inAppEnabled ?? true);
          setPushEnabled(data.pushEnabled ?? false);
          setSmsEnabled(data.smsEnabled ?? false);
          setWhatsappEnabled(data.whatsappEnabled ?? false);
          if (data.emailAddress) setEmailAddress(data.emailAddress);
          if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
          if (data.pushPermission) setPushPermission(data.pushPermission);
        }
      } catch (err: any) {
        if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
          try {
            handleFirestoreError(err, OperationType.GET, `users/${currentUser.id}/settings/notifications`);
          } catch (handled) {
            console.warn("Using local notification preferences fallback:", handled);
          }
        } else {
          console.warn("Could not fetch cloud notification settings, using local preferences:", err);
        }
      }
    };
 
    loadSettings();
  }, [currentUser]);
 
  // Request Simulated Push Permission
  const handleRequestPushPermission = () => {
    setPushPermission('prompting');
    
    // Simulate browser native notification prompt delayed response
    setTimeout(() => {
      setPushPermission('granted');
      setPushEnabled(true);
      showToast('success', 'Push notification permission successfully granted!');
      
      // Simulate sending a test push notification
      if ('Notification' in window && (window as any).Notification.permission === 'granted') {
        new (window as any).Notification("CampusCare AI Notifications", {
          body: "Push alerts successfully linked! You will now receive diagnostic dispatch updates."
        });
      }
    }, 1500);
  };
 
  // Show a status toast inside the UI
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };
 
  // Persist notification configurations
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
 
    setIsSaving(true);
    const payload = {
      emailEnabled,
      inAppEnabled,
      pushEnabled,
      smsEnabled,
      whatsappEnabled,
      emailAddress,
      phoneNumber,
      pushPermission,
      updatedAt: new Date().toISOString()
    };
 
    try {
      // 1. Write to LocalStorage
      localStorage.setItem(`cc_notif_prefs_${currentUser.id}`, JSON.stringify(payload));
 
      // 2. Write persistently to Firestore
      const path = `users/${currentUser.id}/settings/notifications`;
      const docRef = doc(db, 'users', currentUser.id, 'settings', 'notifications');
      try {
        await setDoc(docRef, payload, { merge: true });
      } catch (err: any) {
        if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
        throw err;
      }
 
      showToast('success', 'Notification preferences saved successfully!');
    } catch (err) {
      console.error("Failed saving notification preferences to Firestore:", err);
      showToast('error', 'Saved locally, but server sync failed. Check your internet connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render a simulated native browser permission dialog
  const renderPermissionPrompt = () => {
    if (pushPermission !== 'prompting') return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-sm text-slate-905 dark:text-white">Allow Notifications?</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong>ais-dev-pagk2rtxj33poyr74t2f65.asia-east1.run.app</strong> wants to show background notifications on this device.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              onClick={() => {
                setPushPermission('denied');
                setPushEnabled(false);
                showToast('error', 'Push permission rejected.');
              }}
              className="px-3.5 py-1.5 rounded-lg border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-350"
            >
              Block
            </button>
            <button
              onClick={() => {
                setPushPermission('granted');
                setPushEnabled(true);
                showToast('success', 'Push notification permission successfully granted!');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Simulation dialog */}
      {renderPermissionPrompt()}

      {/* Title */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500 animate-pulse" />
            Notification Delivery Channels
          </h3>
          <p className="text-xs text-slate-400">
            Control which delivery routes CampusCare AI uses to alert you about technical staff dispatch, ticket reviews, and SLA changes.
          </p>
        </div>
        
        {/* Save button floating top-right */}
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all shrink-0 min-h-[38px]"
        >
          {isSaving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Save size={13} />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 shadow-md animate-in slide-in-from-top-4 duration-350 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-550/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <p className="text-xs font-bold leading-none">{toastMessage.text}</p>
        </div>
      )}

      <form onSubmit={handleSaveChanges} className="space-y-5">
        
        {/* ================= SECTION 1: ACTIVE CHANNELS ================= */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active Channels
          </h4>

          {/* 1. In App Notification */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 hover:border-indigo-500/20 transition-all">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Bell size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-805 dark:text-slate-100">In-App Notifications</span>
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Live</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Receive live visual popup banners and notifications center badge logs directly inside this portal screen.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setInAppEnabled(!inAppEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 cursor-pointer ${
                inAppEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                inAppEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* 2. Email Notification */}
          <div className="flex flex-col gap-3.5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 hover:border-indigo-500/20 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-805 dark:text-slate-100">Email System Notifications</span>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Get automated ticket updates, contractor comments, and summary performance briefs straight to your mailbox.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 cursor-pointer ${
                  emailEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  emailEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Email Input Panel */}
            {emailEnabled && (
              <div className="pl-12 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Dispatch Email</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="e.g. students@college.edu"
                  className="max-w-md w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-hidden transition-all text-slate-700 dark:text-slate-200 font-mono"
                />
              </div>
            )}
          </div>

          {/* 3. Push Notification */}
          <div className="flex flex-col gap-3.5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 hover:border-indigo-500/20 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Smartphone size={18} />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-805 dark:text-slate-100">Web Push Notifications</span>
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      pushPermission === 'granted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {pushPermission === 'granted' ? 'Allowed' : 'Pending Auth'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Simulate native system push technology. Receive alerts when browser is in background, or tab is inactive.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  if (pushPermission !== 'granted') {
                    handleRequestPushPermission();
                  } else {
                    setPushEnabled(!pushEnabled);
                  }
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 cursor-pointer ${
                  pushEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  pushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Request Link Button */}
            {pushPermission !== 'granted' && (
              <div className="pl-12 animate-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  onClick={handleRequestPushPermission}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400 font-bold text-[10px] rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Sparkles size={11} className="animate-spin" />
                  Grant System Permission
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 2: FUTURE CHANNELS ================= */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Future Integrations
            </h4>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold font-mono">
              <Sparkles size={9} /> Early Beta Access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 4. SMS Alerts */}
            <div className="flex flex-col justify-between gap-3 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-900/5 hover:border-indigo-500/20 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 text-indigo-500 flex items-center justify-center shrink-0">
                      <Smartphone size={16} />
                    </div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">SMS Broadcasts</span>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      setSmsEnabled(!smsEnabled);
                      if (!smsEnabled) {
                        showToast('success', 'Subscribed to future SMS updates! This feature is in beta.');
                      }
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 cursor-pointer ${
                      smsEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      smsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Receive priority SMS text messages for emergency situations, block-wide water maintenance downs, or power outage schedules.
                </p>
              </div>

              {smsEnabled && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Configure Phone Mobile</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-hidden transition-all text-slate-700 dark:text-slate-200 font-mono"
                  />
                </div>
              )}
            </div>

            {/* 5. WhatsApp Integration */}
            <div className="flex flex-col justify-between gap-3 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-900/5 hover:border-indigo-500/20 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 text-indigo-500 flex items-center justify-center shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">WhatsApp Dispatch Bot</span>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      setWhatsappEnabled(!whatsappEnabled);
                      if (!whatsappEnabled) {
                        showToast('success', 'WhatsApp dispatch helper enabled! Link phone number below.');
                      }
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 cursor-pointer ${
                      whatsappEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Our WhatsApp AI Chatbot will ping you directly. Read timelines, view completed images, or submit feedback over WhatsApp chats.
                </p>
              </div>

              {whatsappEnabled && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Connected Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-hidden transition-all text-slate-700 dark:text-slate-200 font-mono"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
