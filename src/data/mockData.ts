import { User, College, Complaint, Notification } from '../types';

export const INITIAL_COLLEGES: College[] = [
  { id: 'col-1', name: "Institute of Technology & Engineering", code: 'INST (E207)', adminCount: 2, complaintsCount: 145, status: 'active' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alex Rivera',
    email: 'student@campuscare.ai',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: 'CS2023089',
    college: "Institute of Technology & Engineering",
    phone: '+91 9876543210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-2',
    name: 'Sarah Jenkins',
    email: 'admin@campuscare.ai',
    role: 'admin',
    department: 'Facilities Management',
    college: "Institute of Technology & Engineering",
    phone: '(08338) 221391',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-3',
    name: 'Marcus Miller',
    email: 'staff@campuscare.ai',
    role: 'staff',
    department: 'Water Supply Team',
    college: "Institute of Technology & Engineering",
    phone: '+91 9880217631',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-5',
    name: 'David Kojo',
    email: 'david.electrician@campuscare.ai',
    role: 'staff',
    department: 'Electrical Maintenance',
    college: "Institute of Technology & Engineering",
    phone: '+91 9880217632',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-6',
    name: 'Samantha Li',
    email: 'samantha.hvac@campuscare.ai',
    role: 'staff',
    department: 'IT Support',
    college: "Institute of Technology & Engineering",
    phone: '+91 9880217633',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CC-101',
    title: 'Ceiling Water Leakage',
    description: 'There is major water dripping from the ceiling in Room 302 of the Academic Block. It is pooling near the projector setup and might damage the electrical equipment if not fixed immediately.',
    building: 'Academic Areas',
    roomNumber: 'Room 302',
    category: 'Water Leakage',
    priority: 'high',
    status: 'new',
    createdDate: '2026-07-11T14:30:00-07:00',
    studentId: 'u-1',
    studentName: 'Alex Rivera',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'],
    repairImages: [],
    timeline: [
      {
        status: 'new',
        date: '2026-07-11T14:30:00-07:00',
        label: 'Complaint Submitted',
        description: 'Complaint registered by student Alex Rivera.'
      }
    ],
    comments: [
      {
        id: 'c-1',
        authorName: 'Alex Rivera',
        authorRole: 'student',
        text: 'Please look into this soon as we have a major lab session here tomorrow morning.',
        date: '2026-07-11T14:32:00-07:00'
      }
    ]
  },
  {
    id: 'CC-102',
    title: 'Flickering Lecture Hall Lights',
    description: 'Half of the overhead tube lights in Lecture Hall 105 are flickering constantly. It causes eye strain during long lectures and makes the whiteboard hard to read.',
    building: 'Academic Areas',
    roomNumber: 'LH 105',
    category: 'Electricity',
    priority: 'medium',
    status: 'assigned',
    createdDate: '2026-07-10T09:15:00-07:00',
    studentId: 'u-1',
    studentName: 'Alex Rivera',
    assignedStaffId: 'u-5',
    assignedStaffName: 'David Kojo',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80'],
    repairImages: [],
    timeline: [
      {
        status: 'new',
        date: '2026-07-10T09:15:00-07:00',
        label: 'Complaint Submitted',
        description: 'Complaint registered by student Alex Rivera.'
      },
      {
        status: 'assigned',
        date: '2026-07-10T11:45:00-07:00',
        label: 'Staff Assigned',
        description: 'Assigned to David Kojo (Electrical Maintenance) by admin Sarah Jenkins.'
      }
    ],
    comments: [
      {
        id: 'c-2',
        authorName: 'Sarah Jenkins',
        authorRole: 'admin',
        text: 'David, please prioritize this between your class rounds today.',
        date: '2026-07-10T11:46:00-07:00'
      }
    ]
  },
  {
    id: 'CC-103',
    title: 'AC Unit Emitting Loud Noise & No Cool Air',
    description: 'The split AC unit on the left wall of the seminar hall is rattling very loudly and blowing room temperature air instead of cooling.',
    building: 'Seminar Hall',
    roomNumber: 'Seminar Hall Main',
    category: 'Others',
    priority: 'critical',
    status: 'in-progress',
    createdDate: '2026-07-09T11:00:00-07:00',
    studentId: 'student-2',
    studentName: 'Rohan Sharma',
    assignedStaffId: 'u-6',
    assignedStaffName: 'Samantha Li',
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'],
    repairImages: [],
    timeline: [
      {
        status: 'new',
        date: '2026-07-09T11:00:00-07:00',
        label: 'Complaint Submitted',
        description: 'Complaint registered by student Rohan Sharma.'
      },
      {
        status: 'assigned',
        date: '2026-07-09T13:00:00-07:00',
        label: 'Staff Assigned',
        description: 'Assigned to Samantha Li (IT Support Specialist) by admin Sarah Jenkins.'
      },
      {
        status: 'in-progress',
        date: '2026-07-10T10:00:00-07:00',
        label: 'Work Started',
        description: 'Samantha Li has arrived on-site and diagnosed a broken compressor belt.'
      }
    ],
    comments: [
      {
        id: 'c-3',
        authorName: 'Samantha Li',
        authorRole: 'staff',
        text: 'Diagnosed: Compressor fan belt has snapped. Ordering replacement belt from inventory; work should conclude tomorrow morning.',
        date: '2026-07-10T10:30:00-07:00'
      }
    ]
  },
  {
    id: 'CC-104',
    title: 'Broken Bench Desk in Mathematics Classroom',
    description: 'The wooden desk on row 4 is split down the middle, exposing rusty brackets. It is a safety hazard for students sitting in that row.',
    building: 'Academic Areas',
    roomNumber: 'Room 204',
    category: 'Furniture',
    priority: 'low',
    status: 'resolved',
    createdDate: '2026-07-08T10:00:00-07:00',
    studentId: 'student-3',
    studentName: 'Emily Watson',
    assignedStaffId: 'u-3',
    assignedStaffName: 'Marcus Miller',
    images: ['https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80'],
    repairImages: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80'],
    timeline: [
      {
        status: 'new',
        date: '2026-07-08T10:00:00-07:00',
        label: 'Complaint Submitted',
        description: 'Complaint registered by student Emily Watson.'
      },
      {
        status: 'assigned',
        date: '2026-07-08T14:00:00-07:00',
        label: 'Staff Assigned',
        description: 'Assigned to Marcus Miller by admin Sarah Jenkins.'
      },
      {
        status: 'in-progress',
        date: '2026-07-09T09:00:00-07:00',
        label: 'Work Started',
        description: 'Marcus Miller has started repairing and reinforcing the wooden board.'
      },
      {
        status: 'resolved',
        date: '2026-07-09T16:00:00-07:00',
        label: 'Complaint Resolved',
        description: 'Marcus Miller replaced the damaged plywood sheet and secured the steel brackets. Photo uploaded.'
      }
    ],
    comments: [
      {
        id: 'c-4',
        authorName: 'Marcus Miller',
        authorRole: 'staff',
        text: 'Desk board has been completely replaced with seasoned oak plywood. Sinks are level, and metal corners are safely sanded down.',
        date: '2026-07-09T16:05:00-07:00'
      }
    ]
  },
  {
    id: 'CC-105',
    title: 'Extremely Slow Wi-Fi Connection',
    description: 'The Wi-Fi speed in the Main Library reading room has dropped below 1 Mbps. Pages fail to load and students cannot download research papers.',
    building: 'Central Library',
    roomNumber: 'Reading Area 2F',
    category: 'Wi-Fi / Internet',
    priority: 'medium',
    status: 'closed',
    createdDate: '2026-07-05T08:30:00-07:00',
    studentId: 'u-1',
    studentName: 'Alex Rivera',
    assignedStaffId: 'u-5',
    assignedStaffName: 'David Kojo',
    images: [],
    repairImages: [],
    timeline: [
      {
        status: 'new',
        date: '2026-07-05T08:30:00-07:00',
        label: 'Complaint Submitted',
        description: 'Complaint registered by student Alex Rivera.'
      },
      {
        status: 'assigned',
        date: '2026-07-05T10:00:00-07:00',
        label: 'Staff Assigned',
        description: 'Assigned to David Kojo.'
      },
      {
        status: 'in-progress',
        date: '2026-07-05T11:00:00-07:00',
        label: 'Work Started',
        description: 'Network switches and APs inspected.'
      },
      {
        status: 'resolved',
        date: '2026-07-05T14:30:00-07:00',
        label: 'Complaint Resolved',
        description: 'Access point rebooted and bandwidth limit adjusted to prevent hoarding.'
      },
      {
        status: 'closed',
        date: '2026-07-06T10:00:00-07:00',
        label: 'Complaint Closed',
        description: 'Closed after verification by student.'
      }
    ],
    comments: [
      {
        id: 'c-5',
        authorName: 'Alex Rivera',
        authorRole: 'student',
        text: 'Speeds are back up to 150 Mbps now! Thank you for the quick resolution.',
        date: '2026-07-06T09:45:00-07:00'
      }
    ],
    feedback: {
      rating: 5,
      comment: 'Super fast turnaround time! Re-connecting to research databases is seamless now.',
      date: '2026-07-06T09:45:00-07:00'
    }
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    title: 'Complaint Submitted Successfully',
    description: 'Your complaint CC-101 "Ceiling Water Leakage" has been submitted and is currently in review.',
    type: 'submitted',
    date: '2026-07-11T14:30:00-07:00',
    read: false
  },
  {
    id: 'n-2',
    title: 'Staff Assigned to Your Complaint',
    description: 'David Kojo has been assigned to address CC-102 "Flickering Lecture Hall Lights".',
    type: 'assigned',
    date: '2026-07-10T11:45:00-07:00',
    read: false
  },
  {
    id: 'n-3',
    title: 'Work Started on AC Unit',
    description: 'Samantha Li has marked CC-103 "AC Unit Emitting Loud Noise" as In Progress.',
    type: 'in-progress',
    date: '2026-07-10T10:00:00-07:00',
    read: true
  },
  {
    id: 'n-4',
    title: 'Complaint Resolved - Action Required',
    description: 'CC-104 "Broken Bench Desk" has been resolved. Please rate the service quality to close it.',
    type: 'resolved',
    date: '2026-07-09T16:00:00-07:00',
    read: true
  }
];

export const BUILDINGS = [
  'Main Entrance',
  'Administration Area',
  'Academic Areas',
  'Computer Laboratories',
  'Department Laboratories',
  'Central Library',
  'Seminar Hall',
  'Workshop',
  'Boys Hostel',
  'Girls Hostel',
  'Canteen',
  'Parking Area',
  'Sports Ground'
];

export const CATEGORIES = [
  'Wi-Fi / Internet',
  'Computer Lab',
  'Projector',
  'Electricity',
  'Fan',
  'Light',
  'Furniture',
  'Water Leakage',
  'Washroom',
  'Cleaning',
  'Library',
  'Hostel',
  'Parking',
  'Security',
  'Laboratory Equipment',
  'Sports Ground',
  'Canteen',
  'Road Maintenance',
  'Garden Maintenance',
  'Others'
];
