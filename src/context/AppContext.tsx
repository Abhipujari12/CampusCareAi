import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, College, Complaint, Notification, Role, ComplaintStatus, Comment, Feedback, TimelineEvent } from '../types';
import { INITIAL_USERS, INITIAL_COLLEGES, INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AppContextType {
  currentUser: User | null;
  currentRole: Role | 'guest';
  currentPage: string;
  selectedComplaintId: string | null;
  complaints: Complaint[];
  notifications: Notification[];
  colleges: College[];
  users: User[];
  isDarkMode: boolean;
  isLoading: boolean;
  isOfflineFallback: boolean;
  setIsOfflineFallback: (offline: boolean) => void;
  setPage: (page: string) => void;
  setSelectedComplaintId: (id: string | null) => void;
  login: (email: string, role: Role, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, role: Role, college: string, department: string, studentId: string, phone: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdDate' | 'status' | 'timeline' | 'comments' | 'repairImages'>) => Promise<string>;
  deleteComplaint: (id: string) => Promise<void>;
  clearCompletedComplaints: () => Promise<void>;
  updateComplaintStatus: (id: string, status: ComplaintStatus, details?: string, repairImages?: string[]) => Promise<void>;
  assignComplaint: (id: string, staffId: string) => Promise<void>;
  addComment: (id: string, text: string) => Promise<void>;
  submitFeedback: (id: string, rating: number, comment: string) => Promise<void>;
  toggleDarkMode: () => void;
  markNotificationRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  addNotification: (title: string, description: string, type: Notification['type']) => Promise<void>;
  addCollege: (name: string, code: string) => Promise<void>;
  toggleCollegeStatus: (id: string) => Promise<void>;
  addUser: (name: string, email: string, role: Role, college?: string, department?: string, studentId?: string, phone?: string) => Promise<void>;
  changeUserRole: (userId: string, role: Role) => Promise<void>;
  updateUserDepartment: (userId: string, department: string) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
}

export const getDefaultAvatarForRole = (role: Role, email?: string): string => {
  const studentAvatars = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', // Male student
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', // Girl student
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', // Student with glasses
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'  // Student smile
  ];
  const staffAvatars = [
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80', // David Kojo style
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', // Marcus Miller style
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', // Samantha Li style
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80'  // Professional female staff
  ];
  const adminAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', // Sarah Jenkins style
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', // Admin male style
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', // Executive style
    'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?w=150&auto=format&fit=crop&q=80'  // Admin female style
  ];

  let index = 0;
  if (email) {
    let sum = 0;
    for (let i = 0; i < email.length; i++) {
      sum += email.charCodeAt(i);
    }
    index = sum % 4;
  } else {
    index = Math.floor(Math.random() * 4);
  }

  switch (role) {
    case 'student': return studentAvatars[index];
    case 'staff': return staffAvatars[index];
    case 'admin': return adminAvatars[index];
    default: return studentAvatars[0];
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<string>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Firestore sync collections
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | 'guest'>('guest');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cc_dark_mode') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cc_offline_fallback') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Save offline helpers
  const saveOfflineComplaints = (updated: Complaint[]) => {
    setComplaints(updated);
    localStorage.setItem('cc_complaints', JSON.stringify(updated));
  };

  const saveOfflineNotifications = (updated: Notification[]) => {
    setNotifications(updated);
    localStorage.setItem('cc_notifications', JSON.stringify(updated));
  };

  const saveOfflineColleges = (updated: College[]) => {
    setColleges(updated);
    localStorage.setItem('cc_colleges', JSON.stringify(updated));
  };

  const saveOfflineUsers = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem('cc_users', JSON.stringify(updated));
  };

  // Keep theme synchronised with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Seed DB with mock data if completely empty
  const seedDatabaseIfEmpty = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (usersSnap.empty) {
        console.log("Seeding Firestore with initial user accounts...");
        for (const user of INITIAL_USERS) {
          await setDoc(doc(db, 'users', user.id), {
            ...user,
            createdAt: new Date().toISOString()
          });
        }
      }

      const complaintsSnap = await getDocs(collection(db, 'complaints'));
      if (complaintsSnap.empty) {
        console.log("Seeding Firestore with initial complaints tickets...");
        for (const complaint of INITIAL_COMPLAINTS) {
          await setDoc(doc(db, 'complaints', complaint.id), {
            ...complaint,
            createdAt: new Date().toISOString()
          });
        }
      }

      const collegesSnap = await getDocs(collection(db, 'colleges'));
      if (collegesSnap.empty) {
        console.log("Seeding Firestore with initial colleges directory...");
        for (const college of INITIAL_COLLEGES) {
          await setDoc(doc(db, 'colleges', college.id), college);
        }
      }
    } catch (err) {
      console.error("Auto-seeding Firestore error:", err);
    }
  };

  // Auth Observer to connect Firebase User and listen in real-time
  useEffect(() => {
    let unsubscribeUsers: () => void = () => {};
    let unsubscribeComplaints: () => void = () => {};
    let unsubscribeNotifications: () => void = () => {};
    let unsubscribeColleges: () => void = () => {};

    const syncAuthAndListen = async () => {
      // Check for redirect sign-in resolution from mobile browsers
      try {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult && redirectResult.user) {
          console.log("Firebase Redirect Auth resolved successfully for:", redirectResult.user.email);
        }
      } catch (redirectErr: any) {
        console.warn("Firebase Redirect Result warning:", redirectErr);
      }

      if (isOfflineFallback) {
        setIsLoading(true);
        try {
          const storedUser = localStorage.getItem('cc_current_user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setCurrentUser(parsed);
            setCurrentRole(parsed.role);
          } else {
            setCurrentUser(null);
            setCurrentRole('guest');
          }

          const storedComplaints = localStorage.getItem('cc_complaints');
          if (storedComplaints) {
            setComplaints(JSON.parse(storedComplaints));
          } else {
            setComplaints(INITIAL_COMPLAINTS);
            localStorage.setItem('cc_complaints', JSON.stringify(INITIAL_COMPLAINTS));
          }

          const storedNotifs = localStorage.getItem('cc_notifications');
          if (storedNotifs) {
            setNotifications(JSON.parse(storedNotifs));
          } else {
            setNotifications(INITIAL_NOTIFICATIONS);
            localStorage.setItem('cc_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
          }

          const storedColleges = localStorage.getItem('cc_colleges');
          if (storedColleges) {
            setColleges(JSON.parse(storedColleges));
          } else {
            setColleges(INITIAL_COLLEGES);
            localStorage.setItem('cc_colleges', JSON.stringify(INITIAL_COLLEGES));
          }

          const storedUsers = localStorage.getItem('cc_users');
          if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
          } else {
            setUsers(INITIAL_USERS);
            localStorage.setItem('cc_users', JSON.stringify(INITIAL_USERS));
          }
        } catch (e) {
          console.error("Local load failed:", e);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      onAuthStateChanged(auth, async (authUser) => {
        setIsLoading(true);
        if (authUser) {
          try {
            // Read profile details from Firestore users collection
            const userDoc = await getDoc(doc(db, 'users', authUser.uid));
            
            let loggedInUser: User;
            if (userDoc.exists()) {
              const uData = userDoc.data();
              loggedInUser = {
                id: authUser.uid,
                name: uData.name || uData.fullName || authUser.displayName || 'Campus User',
                email: authUser.email || '',
                role: (uData.role || 'student') as Role,
                department: uData.department || '',
                studentId: uData.studentId || '',
                college: uData.college || "Institute of Technology & Engineering",
                phone: uData.phone || '',
                avatar: uData.avatar || getDefaultAvatarForRole((uData.role || 'student') as Role, authUser.email || '')
              };
            } else {
              // Create dynamic profile if logging in for the first time without registration (e.g. federated)
              const detectedRole: Role = authUser.email?.includes('admin') ? 'admin' : authUser.email?.includes('staff') ? 'staff' : 'student';
              loggedInUser = {
                id: authUser.uid,
                name: authUser.displayName || authUser.email?.split('@')[0] || 'Campus User',
                email: authUser.email || '',
                role: detectedRole,
                college: "Institute of Technology & Engineering",
                avatar: authUser.photoURL || getDefaultAvatarForRole(detectedRole, authUser.email || '')
              };
              await setDoc(doc(db, 'users', authUser.uid), {
                ...loggedInUser,
                createdAt: new Date().toISOString()
              });
            }

            setCurrentUser(loggedInUser);
            setCurrentRole(loggedInUser.role);
            try {
              localStorage.setItem('cc_current_user', JSON.stringify(loggedInUser));
            } catch (e) {
              console.warn("Could not write to local storage", e);
            }

            // Seed DB securely only if we are an admin
            if (loggedInUser.role === 'admin') {
              seedDatabaseIfEmpty();
            }

            // Active listeners setup
            // 1. Users list listener (admins can see all users)
            if (loggedInUser.role === 'admin') {
              unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
                const uList: User[] = [];
                snapshot.forEach((d) => {
                  const data = d.data();
                  uList.push({
                    id: d.id,
                    name: data.name || data.fullName || 'User',
                    email: data.email || '',
                    role: (data.role || 'student') as Role,
                    department: data.department || '',
                    studentId: data.studentId || '',
                    college: data.college || '',
                    phone: data.phone || '',
                    avatar: data.avatar || getDefaultAvatarForRole((data.role || 'student') as Role, data.email || '')
                  });
                });
                setUsers(uList);
              }, (err) => {
                console.info("Users listener operating in local fallback state:", err.message);
              });
            } else {
              setUsers([loggedInUser]);
            }

            // 2. Complaints list listener (Secured client queries)
            let complaintsQuery = query(collection(db, 'complaints'));
            if (loggedInUser.role === 'student') {
              // Students only see their own tickets
              complaintsQuery = query(collection(db, 'complaints'), where('studentId', '==', loggedInUser.id));
            } else if (loggedInUser.role === 'staff') {
              // Staff can see assigned tickets or pending tickets they might pick up
              complaintsQuery = query(collection(db, 'complaints'));
            }

            unsubscribeComplaints = onSnapshot(complaintsQuery, (snapshot) => {
              const cList: Complaint[] = [];
              snapshot.forEach((d) => {
                cList.push({ id: d.id, ...d.data() } as Complaint);
              });
              // Sort by date descending
              cList.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
              setComplaints(cList);
            }, (err) => {
              console.info("Complaints listener operating in local fallback state:", err.message);
            });

            // 3. Notifications list listener
            unsubscribeNotifications = onSnapshot(
              collection(db, 'users', authUser.uid, 'notifications'),
              (snapshot) => {
                const nList: Notification[] = [];
                snapshot.forEach((d) => {
                  nList.push({ id: d.id, ...d.data() } as Notification);
                });
                nList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setNotifications(nList);
              },
              (err) => {
                console.info("Notifications listener operating in local fallback state:", err.message);
              }
            );

            // 4. Colleges list listener
            unsubscribeColleges = onSnapshot(collection(db, 'colleges'), (snapshot) => {
              const colList: College[] = [];
              snapshot.forEach((d) => {
                colList.push({ id: d.id, ...d.data() } as College);
              });
              setColleges(colList);
            }, (err) => {
              console.info("Colleges listener operating in local fallback state:", err.message);
            });

          } catch (err) {
            console.error("Error setting up Firestore snapshot listeners:", err);
          }
        } else {
          // Clear logged-in states
          setCurrentUser(null);
          setCurrentRole('guest');
          setComplaints([]);
          setNotifications([]);
          
          // Unsubscribe from active listeners
          unsubscribeUsers();
          unsubscribeComplaints();
          unsubscribeNotifications();
          unsubscribeColleges();
        }
        setIsLoading(false);
      });
    };

    syncAuthAndListen();

    return () => {
      unsubscribeUsers();
      unsubscribeComplaints();
      unsubscribeNotifications();
      unsubscribeColleges();
    };
  }, [isOfflineFallback]);

  const setPage = (page: string) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authenticate user via Firebase Auth and fetch corresponding Firestore record
  const login = async (email: string, role: Role, password = 'password123'): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (isOfflineFallback) {
        const localUsersList = localStorage.getItem('cc_users') ? JSON.parse(localStorage.getItem('cc_users')!) : INITIAL_USERS;
        const matched = localUsersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (matched) {
          setCurrentUser(matched);
          setCurrentRole(matched.role);
          localStorage.setItem('cc_current_user', JSON.stringify(matched));
          
          if (matched.role === 'student') setPage('home');
          else if (matched.role === 'admin') setPage('admin-dashboard');
          else if (matched.role === 'staff') setPage('staff-dashboard');
          setIsLoading(false);
          return true;
        } else {
          const newUserObj: User = {
            id: `u-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role,
            college: "Institute of Technology & Engineering",
            avatar: getDefaultAvatarForRole(role, email)
          };
          const updatedUsers = [...localUsersList, newUserObj];
          localStorage.setItem('cc_users', JSON.stringify(updatedUsers));
          setUsers(updatedUsers);
          setCurrentUser(newUserObj);
          setCurrentRole(newUserObj.role);
          localStorage.setItem('cc_current_user', JSON.stringify(newUserObj));
          
          if (role === 'student') setPage('home');
          else if (role === 'admin') setPage('admin-dashboard');
          else if (role === 'staff') setPage('staff-dashboard');
          setIsLoading(false);
          return true;
        }
      }

      // Auto-register preseeded profiles if they don't exist yet in Auth
      const preseeded = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (authErr: any) {
        if (authErr.code === 'auth/operation-not-allowed') {
          console.log("Firebase Email/Password Sign-In is disabled. Enabling Seamless Local Sandbox Fallback!");
          localStorage.setItem('cc_offline_fallback', 'true');
          setIsOfflineFallback(true);
          
          const localUsersList = localStorage.getItem('cc_users') ? JSON.parse(localStorage.getItem('cc_users')!) : INITIAL_USERS;
          const matched = localUsersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || preseeded || {
            id: `u-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role,
            college: "Institute of Technology & Engineering",
            avatar: getDefaultAvatarForRole(role, email)
          };
          setCurrentUser(matched);
          setCurrentRole(matched.role);
          localStorage.setItem('cc_current_user', JSON.stringify(matched));
          
          if (matched.role === 'student') setPage('home');
          else if (matched.role === 'admin') setPage('admin-dashboard');
          else if (matched.role === 'staff') setPage('staff-dashboard');
          setIsLoading(false);
          return true;
        }

        // If preseeded user doesn't exist in Auth, register them now so it works instantly!
        if (preseeded && (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential')) {
          console.log(`Auto-registering preseeded profile: ${email}`);
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', cred.user.uid), {
            id: cred.user.uid,
            name: preseeded.name,
            email: preseeded.email,
            role: preseeded.role,
            department: preseeded.department || '',
            studentId: preseeded.studentId || '',
            college: preseeded.college || '',
            phone: preseeded.phone || '',
            avatar: preseeded.avatar || '',
            createdAt: new Date().toISOString()
          });
        } else {
          throw authErr;
        }
      }

      // Redirect page
      if (role === 'student') setPage('home');
      else if (role === 'admin') setPage('admin-dashboard');
      else if (role === 'staff') setPage('staff-dashboard');
      return true;
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        localStorage.setItem('cc_offline_fallback', 'true');
        setIsOfflineFallback(true);
        const fallbackUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
          id: `u-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role,
          college: "Institute of Technology & Engineering",
          avatar: getDefaultAvatarForRole(role, email)
        };
        setCurrentUser(fallbackUser);
        setCurrentRole(fallbackUser.role);
        localStorage.setItem('cc_current_user', JSON.stringify(fallbackUser));
        if (role === 'student') setPage('home');
        else if (role === 'admin') setPage('admin-dashboard');
        else if (role === 'staff') setPage('staff-dashboard');
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      throw err;
    }
  };

  // Authenticate user via Google Sign-In with popup + mobile redirect fallback
  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    // Check if on mobile environment
    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    try {
      let authUser = null;
      try {
        if (isMobile) {
          // On mobile devices, popup blockers frequently block modal windows
          try {
            const cred = await signInWithPopup(auth, provider);
            authUser = cred.user;
          } catch (mErr: any) {
            if (
              mErr?.code === 'auth/popup-blocked' || 
              mErr?.code === 'auth/operation-not-supported-in-this-environment' ||
              mErr?.code === 'auth/cancelled-popup-request'
            ) {
              console.info("Mobile popup blocked or unsupported, switching to signInWithRedirect...");
              await signInWithRedirect(auth, provider);
              return true;
            }
            throw mErr;
          }
        } else {
          const cred = await signInWithPopup(auth, provider);
          authUser = cred.user;
        }
      } catch (popupErr: any) {
        if (
          popupErr?.code === 'auth/popup-blocked' ||
          popupErr?.code === 'auth/operation-not-supported-in-this-environment'
        ) {
          console.info("Popup blocked on browser, switching to signInWithRedirect...");
          await signInWithRedirect(auth, provider);
          return true;
        }
        throw popupErr;
      }

      if (!authUser) {
        setIsLoading(false);
        return false;
      }
      
      let role: Role = 'student';
      let loggedInUser: User;

      try {
        // Check or create Firestore document
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          const uData = userDoc.data();
          role = (uData.role || 'student') as Role;
          loggedInUser = {
            id: authUser.uid,
            name: uData.name || uData.fullName || authUser.displayName || 'Campus User',
            email: authUser.email || '',
            role,
            department: uData.department || '',
            studentId: uData.studentId || '',
            college: uData.college || "Institute of Technology & Engineering",
            phone: uData.phone || '',
            avatar: uData.avatar || authUser.photoURL || getDefaultAvatarForRole(role, authUser.email || '')
          };
        } else {
          // If profile doesn't exist, create one
          role = authUser.email?.includes('admin') ? 'admin' : authUser.email?.includes('staff') ? 'staff' : 'student';
          loggedInUser = {
            id: authUser.uid,
            name: authUser.displayName || authUser.email?.split('@')[0] || 'Campus User',
            email: authUser.email || '',
            role,
            college: "Institute of Technology & Engineering",
            avatar: authUser.photoURL || getDefaultAvatarForRole(role, authUser.email || '')
          };
          await setDoc(doc(db, 'users', authUser.uid), {
            ...loggedInUser,
            createdAt: new Date().toISOString()
          });
        }
      } catch (docErr) {
        console.warn("Could not fetch/create Firestore user document, using auth credentials directly:", docErr);
        role = authUser.email?.includes('admin') ? 'admin' : authUser.email?.includes('staff') ? 'staff' : 'student';
        loggedInUser = {
          id: authUser.uid,
          name: authUser.displayName || authUser.email?.split('@')[0] || 'Campus User',
          email: authUser.email || '',
          role,
          college: "Institute of Technology & Engineering",
          avatar: authUser.photoURL || getDefaultAvatarForRole(role, authUser.email || '')
        };
      }

      setCurrentUser(loggedInUser);
      setCurrentRole(loggedInUser.role);
      localStorage.setItem('cc_current_user', JSON.stringify(loggedInUser));

      // Redirect page based on user role
      if (role === 'student') setPage('home');
      else if (role === 'admin') setPage('admin-dashboard');
      else if (role === 'staff') setPage('staff-dashboard');
      
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);
      if (
        err?.code === 'auth/popup-closed-by-user' || 
        err?.code === 'auth/cancelled-popup-request'
      ) {
        console.info("Google sign-in popup was closed or cancelled by user.");
        return false;
      }
      if (err?.code === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        console.error(`Firebase Auth Domain Unauthorized for "${currentHost}". Add it to Firebase Console > Authentication > Settings > Authorized domains.`);
        const customErr = new Error(`Firebase Auth: Unauthorized Domain (${currentHost}).\n\nTo enable Google Sign-In on this domain or device, add "${currentHost}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`);
        (customErr as any).code = 'auth/unauthorized-domain';
        (customErr as any).hostname = currentHost;
        throw customErr;
      }
      console.error("Firebase Google Sign-In Error:", err);
      throw err;
    }
  };

  // Register new accounts persistently inside Firebase Auth and Firestore
  const register = async (
    name: string, 
    email: string, 
    role: Role, 
    college: string, 
    department: string, 
    studentId: string, 
    phone: string,
    password = 'password123'
  ) => {
    try {
      setIsLoading(true);

      if (isOfflineFallback) {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name,
          email,
          role,
          college,
          department,
          studentId,
          phone,
          avatar: getDefaultAvatarForRole(role, email)
        };
        const localUsers = localStorage.getItem('cc_users') ? JSON.parse(localStorage.getItem('cc_users')!) : INITIAL_USERS;
        const updatedUsers = [...localUsers, newUser];
        localStorage.setItem('cc_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setCurrentUser(newUser);
        setCurrentRole(newUser.role);
        localStorage.setItem('cc_current_user', JSON.stringify(newUser));

        if (role === 'student') setPage('home');
        else if (role === 'admin') setPage('admin-dashboard');
        else if (role === 'staff') setPage('staff-dashboard');
        setIsLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const newUser: User = {
          id: uid,
          name,
          email,
          role,
          college,
          department,
          studentId,
          phone,
          avatar: getDefaultAvatarForRole(role, email)
        };

        // Write user details to Firestore
        await setDoc(doc(db, 'users', uid), {
          ...newUser,
          createdAt: new Date().toISOString()
        });

        // Automatically route
        if (role === 'student') setPage('home');
        else if (role === 'admin') setPage('admin-dashboard');
        else if (role === 'staff') setPage('staff-dashboard');
      } catch (authErr: any) {
        if (authErr.code === 'auth/operation-not-allowed') {
          console.log("Firebase Auth disabled on Register. Switching to Seamless Local Fallback.");
          localStorage.setItem('cc_offline_fallback', 'true');
          setIsOfflineFallback(true);

          const newUser: User = {
            id: `u-${Date.now()}`,
            name,
            email,
            role,
            college,
            department,
            studentId,
            phone,
            avatar: getDefaultAvatarForRole(role, email)
          };
          const localUsers = localStorage.getItem('cc_users') ? JSON.parse(localStorage.getItem('cc_users')!) : INITIAL_USERS;
          const updatedUsers = [...localUsers, newUser];
          localStorage.setItem('cc_users', JSON.stringify(updatedUsers));
          setUsers(updatedUsers);
          setCurrentUser(newUser);
          setCurrentRole(newUser.role);
          localStorage.setItem('cc_current_user', JSON.stringify(newUser));

          if (role === 'student') setPage('home');
          else if (role === 'admin') setPage('admin-dashboard');
          else if (role === 'staff') setPage('staff-dashboard');
        } else {
          throw authErr;
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error("Firebase Register Error:", err);
      setIsLoading(false);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      if (isOfflineFallback) {
        localStorage.removeItem('cc_current_user');
        setCurrentUser(null);
        setCurrentRole('guest');
        setPage('landing');
        return;
      }
      await signOut(auth);
      localStorage.removeItem('cc_current_user');
      setPage('landing');
    } catch (err) {
      console.error("Firebase Signout Error:", err);
    }
  };

  // Write new complaint ticket directly to Firestore
  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'createdDate' | 'status' | 'timeline' | 'comments' | 'repairImages'>): Promise<string> => {
    const id = `CC-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString();
    
    const newComplaint: Complaint = {
      ...complaintData,
      id,
      createdDate: nowStr,
      status: 'new',
      repairImages: [],
      timeline: [
        {
          status: 'new',
          date: nowStr,
          label: 'Complaint Submitted',
          description: `Complaint successfully reported by ${complaintData.studentName}.`
        }
      ],
      comments: []
    };

    if (isOfflineFallback) {
      const updated = [newComplaint, ...complaints];
      saveOfflineComplaints(updated);

      // Notify administrators
      await addNotification(
        'New Complaint Registered',
        `Complaint ${id} - "${complaintData.title}" was submitted in ${complaintData.building}.`,
        'submitted'
      );
      return id;
    }

    // Save to Firestore 'complaints'
    await setDoc(doc(db, 'complaints', id), newComplaint);

    // Notify administrators
    await addNotification(
      'New Complaint Registered',
      `Complaint ${id} - "${complaintData.title}" was submitted in ${complaintData.building}.`,
      'submitted'
    );

    return id;
  };

  // Update status and append tracking event to nested timeline array
  const updateComplaintStatus = async (id: string, status: ComplaintStatus, details?: string, repairImages?: string[]) => {
    const nowStr = new Date().toISOString();
    
    let label = 'Status Updated';
    let desc = details || `Complaint status updated to ${status}.`;

    if (status === 'assigned') {
      label = 'Staff Assigned';
      desc = details || 'Technical staff assigned to the ticket.';
    } else if (status === 'in-progress') {
      label = 'Work Started';
      desc = details || 'Maintenance work has been initiated on-site.';
    } else if (status === 'resolved') {
      label = 'Complaint Resolved';
      desc = details || 'Issue has been fully resolved by technical staff.';
    } else if (status === 'closed') {
      label = 'Complaint Closed';
      desc = details || 'Ticket verified and successfully closed.';
    } else if (status === 'rejected') {
      label = 'Complaint Rejected';
      desc = details || 'Complaint rejected by administrator.';
    }

    const updatedTimelineEvent: TimelineEvent = { status, date: nowStr, label, description: desc };

    if (isOfflineFallback) {
      const updated = complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status,
            assignedStaffId: c.assignedStaffId || (currentUser?.role === 'staff' ? currentUser.id : undefined),
            assignedStaffName: c.assignedStaffName || (currentUser?.role === 'staff' ? currentUser.name : undefined),
            repairImages: repairImages ? [...(c.repairImages || []), ...repairImages] : (c.repairImages || []),
            timeline: [...(c.timeline || []), updatedTimelineEvent]
          };
        }
        return c;
      });
      saveOfflineComplaints(updated);

      const matched = complaints.find(c => c.id === id);
      await addNotification(
        `Ticket ${id} Updated`,
        `Your complaint "${matched ? matched.title : ''}" status is now ${status.toUpperCase()}.`,
        status === 'new' ? 'submitted' : status === 'assigned' ? 'assigned' : status === 'in-progress' ? 'in-progress' : status === 'resolved' ? 'resolved' : 'feedback'
      );
      return;
    }

    const docRef = doc(db, 'complaints', id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const c = snap.data() as Complaint;
      const currentTimeline = c.timeline || [];
      const currentRepairImages = c.repairImages || [];

      const updatePayload: any = {
        status,
        repairImages: repairImages ? [...currentRepairImages, ...repairImages] : currentRepairImages,
        timeline: [...currentTimeline, updatedTimelineEvent]
      };

      if (!c.assignedStaffId && currentUser?.role === 'staff') {
        updatePayload.assignedStaffId = currentUser.id;
        updatePayload.assignedStaffName = currentUser.name;
      }

      await updateDoc(docRef, updatePayload);

      // Send persistent user alert
      await addNotification(
        `Ticket ${id} Updated`,
        `Your complaint "${c.title}" status is now ${status.toUpperCase()}.`,
        status === 'new' ? 'submitted' : status === 'assigned' ? 'assigned' : status === 'in-progress' ? 'in-progress' : status === 'resolved' ? 'resolved' : 'feedback'
      );
    }
  };

  // Assign staff to a complaint ticket persistently
  const assignComplaint = async (id: string, staffId: string) => {
    const staffMember = users.find(u => u.id === staffId);
    if (!staffMember) return;

    const nowStr = new Date().toISOString();

    if (isOfflineFallback) {
      const updated = complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'assigned' as ComplaintStatus,
            assignedStaffId: staffMember.id,
            assignedStaffName: staffMember.name,
            timeline: [
              ...(c.timeline || []),
              {
                status: 'assigned' as ComplaintStatus,
                date: nowStr,
                label: 'Staff Assigned',
                description: `Assigned to ${staffMember.name} (${staffMember.department || 'Technical Staff'}) by Admin.`
              }
            ]
          };
        }
        return c;
      });
      saveOfflineComplaints(updated);

      await addNotification(
        'Staff Assigned to Ticket',
        `Ticket ${id} has been assigned to ${staffMember.name}.`,
        'assigned'
      );
      return;
    }

    const docRef = doc(db, 'complaints', id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const c = snap.data() as Complaint;
      const currentTimeline = c.timeline || [];

      await updateDoc(docRef, {
        status: 'assigned' as ComplaintStatus,
        assignedStaffId: staffMember.id,
        assignedStaffName: staffMember.name,
        timeline: [
          ...currentTimeline,
          {
            status: 'assigned' as ComplaintStatus,
            date: nowStr,
            label: 'Staff Assigned',
            description: `Assigned to ${staffMember.name} (${staffMember.department || 'Technical Staff'}) by Admin.`
          }
        ]
      });

      await addNotification(
        'Staff Assigned to Ticket',
        `Ticket ${id} has been assigned to ${staffMember.name}.`,
        'assigned'
      );
    }
  };

  // Add a communication message nested inside the complaints document
  const addComment = async (id: string, text: string) => {
    if (!currentUser) return;
    const nowStr = new Date().toISOString();

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text,
      date: nowStr
    };

    if (isOfflineFallback) {
      const updated = complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            comments: [...(c.comments || []), newComment]
          };
        }
        return c;
      });
      saveOfflineComplaints(updated);
      return;
    }

    const docRef = doc(db, 'complaints', id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const c = snap.data() as Complaint;
      const currentComments = c.comments || [];

      await updateDoc(docRef, {
        comments: [...currentComments, newComment]
      });
    }
  };

  // Close and rate the ticket
  const submitFeedback = async (id: string, rating: number, comment: string) => {
    const nowStr = new Date().toISOString();
    const newFeedback: Feedback = {
      rating,
      comment,
      date: nowStr
    };

    if (isOfflineFallback) {
      const updated = complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'closed' as ComplaintStatus,
            feedback: newFeedback,
            timeline: [
              ...(c.timeline || []),
              {
                status: 'closed' as ComplaintStatus,
                date: nowStr,
                label: 'Complaint Closed & Rated',
                description: `Closed by student with a ${rating}/5 rating.`
              }
            ]
          };
        }
        return c;
      });
      saveOfflineComplaints(updated);

      await addNotification(
        'Feedback Received',
        `Ticket ${id} closed and rated ${rating} stars.`,
        'feedback'
      );
      return;
    }

    const docRef = doc(db, 'complaints', id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const c = snap.data() as Complaint;
      const currentTimeline = c.timeline || [];

      await updateDoc(docRef, {
        status: 'closed' as ComplaintStatus,
        feedback: newFeedback,
        timeline: [
          ...currentTimeline,
          {
            status: 'closed' as ComplaintStatus,
            date: nowStr,
            label: 'Complaint Closed & Rated',
            description: `Closed by student with a ${rating}/5 rating.`
          }
        ]
      });

      await addNotification(
        'Feedback Received',
        `Ticket ${id} closed and rated ${rating} stars.`,
        'feedback'
      );
    }
  };

  // Delete a specific complaint ticket
  const deleteComplaint = async (id: string) => {
    if (isOfflineFallback) {
      const updated = complaints.filter(c => c.id !== id);
      saveOfflineComplaints(updated);
      return;
    }
    await deleteDoc(doc(db, 'complaints', id));
  };

  // Purge/Delete all completed, closed, or rejected complaints automatically
  const clearCompletedComplaints = async () => {
    const doneStatuses: ComplaintStatus[] = ['closed', 'resolved', 'rejected'];
    if (isOfflineFallback) {
      const updated = complaints.filter(c => !doneStatuses.includes(c.status));
      saveOfflineComplaints(updated);
      return;
    }
    const completedList = complaints.filter(c => doneStatuses.includes(c.status));
    for (const item of completedList) {
      try {
        await deleteDoc(doc(db, 'complaints', item.id));
      } catch (e) {
        console.warn('Failed to delete completed complaint:', item.id, e);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('cc_dark_mode', String(next));
      return next;
    });
  };

  // Push notifications to users sub-collection
  const addNotification = async (title: string, description: string, type: Notification['type']) => {
    if (!currentUser) return;
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      description,
      type,
      date: new Date().toISOString(),
      read: false
    };

    if (isOfflineFallback) {
      const updated = [newNotification, ...notifications];
      saveOfflineNotifications(updated);
      return;
    }

    // Store inside user's notifications sub-collection
    await setDoc(doc(collection(db, 'users', currentUser.id, 'notifications')), newNotification);
  };

  const markNotificationRead = async (id: string) => {
    if (!currentUser) return;
    if (isOfflineFallback) {
      const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
      saveOfflineNotifications(updated);
      return;
    }
    await updateDoc(doc(db, 'users', currentUser.id, 'notifications', id), {
      read: true
    });
  };

  const clearNotifications = async () => {
    if (!currentUser) return;
    if (isOfflineFallback) {
      saveOfflineNotifications([]);
      return;
    }
    // Query all and delete
    const notifSnap = await getDocs(collection(db, 'users', currentUser.id, 'notifications'));
    for (const d of notifSnap.docs) {
      await deleteDoc(doc(db, 'users', currentUser.id, 'notifications', d.id));
    }
  };

  // Add standard college catalog entries
  const addCollege = async (name: string, code: string) => {
    const id = `col-${Date.now()}`;
    const newCollege: College = {
      id,
      name,
      code,
      adminCount: 0,
      complaintsCount: 0,
      status: 'active'
    };

    if (isOfflineFallback) {
      const updated = [...colleges, newCollege];
      saveOfflineColleges(updated);
      return;
    }
    await setDoc(doc(db, 'colleges', id), newCollege);
  };

  const toggleCollegeStatus = async (id: string) => {
    if (isOfflineFallback) {
      const updated = colleges.map(col => col.id === id ? { ...col, status: col.status === 'active' ? 'inactive' : ('active' as const) } : col);
      saveOfflineColleges(updated);
      return;
    }
    const docRef = doc(db, 'colleges', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as College;
      await updateDoc(docRef, {
        status: current.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  // Super Admin creating users
  const addUser = async (
    name: string, 
    email: string, 
    role: Role, 
    college?: string, 
    department?: string, 
    studentId?: string, 
    phone?: string
  ) => {
    const id = `u-${Date.now()}`;
    const newUser: User = {
      id,
      name,
      email,
      role,
      college,
      department,
      studentId,
      phone,
      avatar: getDefaultAvatarForRole(role, email)
    };

    if (isOfflineFallback) {
      const updatedUsers = [...users, newUser];
      saveOfflineUsers(updatedUsers);

      if (role === 'admin' && college) {
        const updatedColleges = colleges.map(col => col.name === college ? { ...col, adminCount: (col.adminCount || 0) + 1 } : col);
        saveOfflineColleges(updatedColleges);
      }
      return;
    }

    await setDoc(doc(db, 'users', id), {
      ...newUser,
      createdAt: new Date().toISOString()
    });

    if (role === 'admin' && college) {
      // Find and update college counter if exists
      const colSnap = await getDocs(query(collection(db, 'colleges'), where('name', '==', college)));
      if (!colSnap.empty) {
        const colDoc = colSnap.docs[0];
        const currentData = colDoc.data();
        await updateDoc(doc(db, 'colleges', colDoc.id), {
          adminCount: (currentData.adminCount || 0) + 1
        });
      }
    }
  };

  const changeUserRole = async (userId: string, role: Role) => {
    if (isOfflineFallback) {
      const updated = users.map(u => u.id === userId ? { ...u, role } : u);
      saveOfflineUsers(updated);
      return;
    }
    await updateDoc(doc(db, 'users', userId), { role });
  };

  const updateUserDepartment = async (userId: string, department: string) => {
    if (isOfflineFallback) {
      const updated = users.map(u => u.id === userId ? { ...u, department } : u);
      saveOfflineUsers(updated);
      return;
    }
    await updateDoc(doc(db, 'users', userId), { department });
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, avatar: avatarUrl };
    setCurrentUser(updatedUser);
    localStorage.setItem('cc_current_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, avatar: avatarUrl } : u);
    setUsers(updatedUsers);

    if (isOfflineFallback) {
      saveOfflineUsers(updatedUsers);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', currentUser.id), { avatar: avatarUrl });
    } catch (e) {
      console.warn('Firestore avatar update fallback to local:', e);
      saveOfflineUsers(updatedUsers);
    }
  };

  const removeUser = async (userId: string) => {
    if (isOfflineFallback) {
      const updated = users.filter(u => u.id !== userId);
      saveOfflineUsers(updated);
      return;
    }
    await deleteDoc(doc(db, 'users', userId));
  };

  const updateOfflineFallback = (offline: boolean) => {
    setIsOfflineFallback(offline);
    if (offline) {
      localStorage.setItem('cc_offline_fallback', 'true');
    } else {
      localStorage.removeItem('cc_offline_fallback');
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentRole,
      currentPage,
      selectedComplaintId,
      complaints,
      notifications,
      colleges,
      users,
      isDarkMode,
      isLoading,
      isOfflineFallback,
      setIsOfflineFallback: updateOfflineFallback,
      setPage,
      setSelectedComplaintId,
      login,
      loginWithGoogle,
      register,
      logout,
      addComplaint,
      deleteComplaint,
      clearCompletedComplaints,
      updateComplaintStatus,
      assignComplaint,
      addComment,
      submitFeedback,
      toggleDarkMode,
      markNotificationRead,
      clearNotifications,
      addNotification,
      addCollege,
      toggleCollegeStatus,
      addUser,
      changeUserRole,
      updateUserDepartment,
      updateUserAvatar,
      removeUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
