export type Role = 'student' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  studentId?: string;
  college?: string;
  phone?: string;
  avatar?: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  adminCount: number;
  complaintsCount: number;
  status: 'active' | 'inactive';
}

export type ComplaintStatus = 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface TimelineEvent {
  status: ComplaintStatus;
  date: string;
  label: string;
  description: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: Role;
  text: string;
  date: string;
}

export interface Feedback {
  rating: number;
  comment: string;
  date: string;
}

export interface AiVerification {
  isGenuine: boolean;
  confidence: number;
  label: string;
  details: string;
  severity: PriorityLevel;
  suggestedCategory: string;
  checkedAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  building: string;
  roomNumber: string;
  category: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  createdDate: string;
  studentId: string;
  studentName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  images: string[];
  repairImages: string[];
  timeline: TimelineEvent[];
  comments: Comment[];
  feedback?: Feedback;
  aiVerification?: AiVerification;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'submitted' | 'assigned' | 'in-progress' | 'resolved' | 'feedback';
  date: string;
  read: boolean;
}
