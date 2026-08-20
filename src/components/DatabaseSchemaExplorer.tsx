import React, { useState } from 'react';
import { 
  Database, Table, Network, Play, Sparkles, RefreshCw, 
  Layers, HardDrive, Info, Check, Terminal, FileText, ChevronRight, HelpCircle
} from 'lucide-react';

// Define Table column structures
interface ColumnDef {
  name: string;
  type: string;
  constraints: string[];
  description: string;
}

interface TableDef {
  name: string;
  purpose: string;
  columns: ColumnDef[];
  sqlalchemy: string;
  sampleData: Array<Record<string, string | number>>;
}

// 16 Core Tables Schema Definition
const DATABASE_SCHEMAS: TableDef[] = [
  {
    name: 'roles',
    purpose: 'Stores all system access roles',
    sqlalchemy: `class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_name = Column(String(50), nullable=False, unique=True)
    description = Column(Text, nullable=True)

    users = relationship("User", back_populates="role")`,
    columns: [
      { name: 'role_id', type: 'SERIAL (PK)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Primary key' },
      { name: 'role_name', type: 'VARCHAR(50)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Role name identifier' },
      { name: 'description', type: 'TEXT', constraints: ['NULLABLE'], description: 'Brief role capabilities text' }
    ],
    sampleData: [
      { role_id: 1, role_name: 'Student', description: 'Can lodge complaints, view status, submit feedback' },
      { role_id: 2, role_name: 'Faculty', description: 'Can report issues in classrooms or labs' },
      { role_id: 3, role_name: 'Staff', description: 'Technicians assigned to resolve technical complaints' },
      { role_id: 4, role_name: 'Admin', description: 'College-level dispatcher, manages staff and complaints' },
      { role_id: 5, role_name: 'Super Admin', description: 'Enterprise cluster director' }
    ]
  },
  {
    name: 'users',
    purpose: 'Main user directory tracking logins and profile links',
    sqlalchemy: `class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False)
    full_name = Column(String(100), nullable=False)
    college_email = Column(String(150), nullable=False, unique=True, index=True)
    phone = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True)
    password_hash = Column(String(255), nullable=False)
    profile_photo = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)`,
    columns: [
      { name: 'user_id', type: 'SERIAL (PK)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Primary key' },
      { name: 'role_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES roles'], description: 'Specifies role permissions' },
      { name: 'full_name', type: 'VARCHAR(100)', constraints: ['NOT NULL'], description: 'First and last name' },
      { name: 'college_email', type: 'VARCHAR(150)', constraints: ['NOT NULL', 'UNIQUE', 'INDEXED'], description: 'University authentication email' },
      { name: 'phone', type: 'VARCHAR(20)', constraints: ['NULLABLE'], description: 'Contact telephone' },
      { name: 'department', type: 'VARCHAR(100)', constraints: ['NULLABLE'], description: 'Division or engineering department' },
      { name: 'password_hash', type: 'VARCHAR(255)', constraints: ['NOT NULL'], description: 'Bcrypt hashed credential' },
      { name: 'profile_photo', type: 'VARCHAR(255)', constraints: ['NULLABLE'], description: 'Image asset link URL' },
      { name: 'is_active', type: 'BOOLEAN', constraints: ['DEFAULT TRUE'], description: 'Indicates login clearance' }
    ],
    sampleData: [
      { user_id: 101, role_id: 1, full_name: 'Alex Rivera', college_email: 'student@campuscare.ai', phone: '+1234567890', is_active: 'True' },
      { user_id: 102, role_id: 3, full_name: 'David Plumber', college_email: 'david@campuscare.ai', phone: '+1987654321', is_active: 'True' },
      { user_id: 103, role_id: 4, full_name: 'Supervisor Sarah', college_email: 'admin@campuscare.ai', phone: '+1555123456', is_active: 'True' }
    ]
  },
  {
    name: 'buildings',
    purpose: 'Campus geographical layout blocks',
    sqlalchemy: `class Building(Base):
    __tablename__ = "buildings"

    building_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    building_name = Column(String(100), nullable=False, unique=True)
    code = Column(String(10), nullable=False, unique=True)`,
    columns: [
      { name: 'building_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'building_name', type: 'VARCHAR(100)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Full architectural block name' },
      { name: 'code', type: 'VARCHAR(10)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Short block key identifier' }
    ],
    sampleData: [
      { building_id: 1, building_name: 'Academic Block A', code: 'ACA-A' },
      { building_id: 2, building_name: 'Academic Block B', code: 'ACA-B' },
      { building_id: 3, building_name: 'Central Library', code: 'LIB' },
      { building_id: 4, building_name: 'Hostel Block A', code: 'HST-A' },
      { building_id: 5, building_name: 'Main Canteen', code: 'CAN' }
    ]
  },
  {
    name: 'rooms',
    purpose: 'Specific room coordinates inside campus buildings',
    sqlalchemy: `class Room(Base):
    __tablename__ = "rooms"

    room_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    building_id = Column(Integer, ForeignKey("buildings.building_id"), nullable=False)
    floor = Column(Integer, nullable=False)
    room_number = Column(String(20), nullable=False)`,
    columns: [
      { name: 'room_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'building_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES buildings'], description: 'Geographic parent block link' },
      { name: 'floor', type: 'INT', constraints: ['NOT NULL'], description: 'Physical level height index' },
      { name: 'room_number', type: 'VARCHAR(20)', constraints: ['NOT NULL'], description: 'Room identification number' }
    ],
    sampleData: [
      { room_id: 10, building_id: 2, floor: 2, room_number: '204' },
      { room_id: 11, building_id: 2, floor: 3, room_number: '302' },
      { room_id: 12, building_id: 3, floor: 1, room_number: 'Reading Room B' }
    ]
  },
  {
    name: 'departments',
    purpose: 'Maintenance technical divisions handling assignments',
    sqlalchemy: `class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    department_name = Column(String(100), nullable=False, unique=True)`,
    columns: [
      { name: 'department_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'department_name', type: 'VARCHAR(100)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Service department title' }
    ],
    sampleData: [
      { department_id: 1, department_name: 'Electrical' },
      { department_id: 2, department_name: 'Plumbing' },
      { department_id: 3, department_name: 'IT Support' },
      { department_id: 4, department_name: 'Cleaning' },
      { department_id: 5, department_name: 'Furniture' }
    ]
  },
  {
    name: 'complaint_categories',
    purpose: 'Sub-category items with corresponding department routing',
    sqlalchemy: `class ComplaintCategory(Base):
    __tablename__ = "complaint_categories"

    category_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_name = Column(String(100), nullable=False, unique=True)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)`,
    columns: [
      { name: 'category_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'category_name', type: 'VARCHAR(100)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Type of maintenance request' },
      { name: 'department_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES departments'], description: 'Responsible task team dispatcher link' }
    ],
    sampleData: [
      { category_id: 1, category_name: 'Internet Loss', department_id: 3 },
      { category_id: 2, category_name: 'Water Dripping', department_id: 2 },
      { category_id: 3, category_name: 'Light Flickering', department_id: 1 }
    ]
  },
  {
    name: 'priorities',
    purpose: 'SLA priority matrix defining resolution timelines',
    sqlalchemy: `class Priority(Base):
    __tablename__ = "priorities"

    priority_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    priority_name = Column(String(50), nullable=False, unique=True)
    response_time = Column(String(50), nullable=False)`,
    columns: [
      { name: 'priority_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'priority_name', type: 'VARCHAR(50)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Severity level description' },
      { name: 'response_time', type: 'VARCHAR(50)', constraints: ['NOT NULL'], description: 'SLA target countdown timeline' }
    ],
    sampleData: [
      { priority_id: 1, priority_name: 'Critical', response_time: '2 Hours' },
      { priority_id: 2, priority_name: 'High', response_time: '8 Hours' },
      { priority_id: 3, priority_name: 'Medium', response_time: '24 Hours' },
      { priority_id: 4, priority_name: 'Low', response_time: '72 Hours' }
    ]
  },
  {
    name: 'complaint_status',
    purpose: 'List of valid workflow status codes',
    sqlalchemy: `class ComplaintStatus(Base):
    __tablename__ = "complaint_status"

    status_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status_name = Column(String(50), nullable=False, unique=True)`,
    columns: [
      { name: 'status_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'status_name', type: 'VARCHAR(50)', constraints: ['NOT NULL', 'UNIQUE'], description: 'Official pipeline milestone status' }
    ],
    sampleData: [
      { status_id: 1, status_name: 'New' },
      { status_id: 2, status_name: 'Under Review' },
      { status_id: 3, status_name: 'Assigned' },
      { status_id: 4, status_name: 'In Progress' },
      { status_id: 5, status_name: 'Resolved' },
      { status_id: 6, status_name: 'Closed' }
    ]
  },
  {
    name: 'complaints',
    purpose: 'Core transaction table containing all user ticket details',
    sqlalchemy: `class Complaint(Base):
    __tablename__ = "complaints"

    complaint_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_number = Column(String(50), nullable=False, unique=True, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.building_id"), nullable=False, index=True)
    room_id = Column(Integer, ForeignKey("rooms.room_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("complaint_categories.category_id"), nullable=False, index=True)
    priority_id = Column(Integer, ForeignKey("priorities.priority_id"), nullable=False, index=True)
    status_id = Column(Integer, ForeignKey("complaint_status.status_id"), nullable=False, index=True)
    assigned_staff_id = Column(Integer, ForeignKey("users.user_id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)`,
    columns: [
      { name: 'complaint_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary Key' },
      { name: 'complaint_number', type: 'VARCHAR(50)', constraints: ['NOT NULL', 'UNIQUE', 'INDEXED'], description: 'Alpha-numeric custom business key' },
      { name: 'student_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES users'], description: 'Issuing student requester' },
      { name: 'title', type: 'VARCHAR(150)', constraints: ['NOT NULL'], description: 'Short grievance header summary' },
      { name: 'description', type: 'TEXT', constraints: ['NOT NULL'], description: 'Extensive problem statement' },
      { name: 'building_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES buildings', 'INDEXED'], description: 'Parent block code location' },
      { name: 'room_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES rooms'], description: 'Target room identifier' },
      { name: 'category_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES categories', 'INDEXED'], description: 'Service department category code' },
      { name: 'priority_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES priorities', 'INDEXED'], description: 'Assigned SLA target index' },
      { name: 'status_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES complaint_status', 'INDEXED'], description: 'Pipeline milestone state' },
      { name: 'assigned_staff_id', type: 'INT (FK)', constraints: ['NULLABLE', 'REFERENCES users', 'INDEXED'], description: 'Dispatched technical specialist' }
    ],
    sampleData: [
      { complaint_id: 1001, complaint_number: 'CMP-2026-0001', student_id: 101, title: 'WIFI dead in room', building_id: 2, room_id: 10, category_id: 1, priority_id: 3, status_id: 3, assigned_staff_id: 102 }
    ]
  },
  {
    name: 'complaint_images',
    purpose: 'Media attachment record table',
    sqlalchemy: `class ComplaintImage(Base):
    __tablename__ = "complaint_images"

    image_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)`,
    columns: [
      { name: 'image_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'complaint_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES complaints'], description: 'Parent ticket connection' },
      { name: 'image_url', type: 'VARCHAR(500)', constraints: ['NOT NULL'], description: 'Cloud storage CDN asset locator URL' },
      { name: 'uploaded_by', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES users'], description: 'Uploader member profile ID' }
    ],
    sampleData: [
      { image_id: 201, complaint_id: 1001, image_url: 'https://images.unsplash.com/photo-broken-router', uploaded_by: 101 }
    ]
  },
  {
    name: 'complaint_history',
    purpose: 'Keeps an immutable step-by-step resolution history',
    sqlalchemy: `class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    history_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    status_id = Column(Integer, ForeignKey("complaint_status.status_id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    remarks = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)`,
    columns: [
      { name: 'history_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'complaint_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES complaints'], description: 'Parent ticket' },
      { name: 'status_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES complaint_status'], description: 'Historical milestone reached' },
      { name: 'updated_by', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES users'], description: 'Updater operator profile key' },
      { name: 'remarks', type: 'TEXT', constraints: ['NULLABLE'], description: 'Comments accompanying this workflow update' }
    ],
    sampleData: [
      { history_id: 501, complaint_id: 1001, status_id: 1, updated_by: 101, remarks: 'Ticket generated by system' },
      { history_id: 502, complaint_id: 1001, status_id: 3, updated_by: 103, remarks: 'Assigned to IT Support technician David Plumber' }
    ]
  },
  {
    name: 'staff_assignments',
    purpose: 'Specific labor dispatcher metrics registry',
    sqlalchemy: `class StaffAssignment(Base):
    __tablename__ = "staff_assignments"

    assignment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    staff_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)`,
    columns: [
      { name: 'assignment_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'complaint_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES complaints'], description: 'Parent complaint' },
      { name: 'staff_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES users'], description: 'Assigned staff/technician' },
      { name: 'assigned_by', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES users'], description: 'Admin operator dispatcher' }
    ],
    sampleData: [
      { assignment_id: 801, complaint_id: 1001, staff_id: 102, assigned_by: 103, assigned_at: '2026-07-12 09:10:30' }
    ]
  },
  {
    name: 'notifications',
    purpose: 'Push alerts and reading state indicators for in-app feeds',
    sqlalchemy: `class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)`,
    columns: [
      { name: 'notification_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'user_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES users'], description: 'Recipient user index' },
      { name: 'title', type: 'VARCHAR(150)', constraints: ['NOT NULL'], description: 'Header summary of alert' },
      { name: 'message', type: 'TEXT', constraints: ['NOT NULL'], description: 'Expanded message details body' },
      { name: 'is_read', type: 'BOOLEAN', constraints: ['DEFAULT FALSE'], description: 'Acknowledge indicator reading status' }
    ],
    sampleData: [
      { notification_id: 701, user_id: 101, title: 'Your issue is assigned!', message: 'David Plumber has been dispatched to ACA-B 204.', is_read: 'False' }
    ]
  },
  {
    name: 'feedback',
    purpose: 'Student satisfaction scoring ledger',
    sqlalchemy: `class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)`,
    columns: [
      { name: 'feedback_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'complaint_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES complaints'], description: 'Corresponding resolved ticket' },
      { name: 'student_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES users'], description: 'Submitting student rater' },
      { name: 'rating', type: 'INT', constraints: ['NOT NULL', 'CHECK (1 to 5)'], description: 'Star quality score metrics' },
      { name: 'comment', type: 'TEXT', constraints: ['NULLABLE'], description: 'Qualitative customer feedback remarks' }
    ],
    sampleData: [
      { feedback_id: 901, complaint_id: 1001, student_id: 101, rating: 5, comment: 'Very fast service, wifi is working perfectly now!' }
    ]
  },
  {
    name: 'ai_predictions',
    purpose: 'Saves automated machine classification results separately',
    sqlalchemy: `class AiPrediction(Base):
    __tablename__ = "ai_predictions"

    prediction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    predicted_category = Column(String(100), nullable=False)
    predicted_priority = Column(String(50), nullable=False)
    summary = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=False, default=1.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)`,
    columns: [
      { name: 'prediction_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'complaint_id', type: 'INT (FK)', constraints: ['NOT NULL', 'REFERENCES complaints'], description: 'Target ticket code context' },
      { name: 'predicted_category', type: 'VARCHAR(100)', constraints: ['NOT NULL'], description: 'AI parsed classification recommendation' },
      { name: 'predicted_priority', type: 'VARCHAR(50)', constraints: ['NOT NULL'], description: 'AI computed urgency severity recommendation' },
      { name: 'confidence_score', type: 'FLOAT', constraints: ['DEFAULT 1.0'], description: 'Neural network certainty percentage' }
    ],
    sampleData: [
      { prediction_id: 301, complaint_id: 1001, predicted_category: 'IT Support', predicted_priority: 'Medium', confidence_score: 0.94 }
    ]
  },
  {
    name: 'audit_logs',
    purpose: 'Tracks important administrative and security actions',
    sqlalchemy: `class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    action = Column(String(255), nullable=False)
    table_name = Column(String(100), nullable=False)
    record_id = Column(Integer, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)`,
    columns: [
      { name: 'log_id', type: 'SERIAL (PK)', constraints: ['NOT NULL'], description: 'Primary key' },
      { name: 'user_id', type: 'INT (FK)', constraints: ['NULLABLE', 'REFERENCES users'], description: 'Actor member profile, if system initiated is NULL' },
      { name: 'action', type: 'VARCHAR(255)', constraints: ['NOT NULL'], description: 'Specific event description logged' },
      { name: 'table_name', type: 'VARCHAR(100)', constraints: ['NOT NULL'], description: 'Target SQL table altered' },
      { name: 'record_id', type: 'INT', constraints: ['NULLABLE'], description: 'Target row altered key index' },
      { name: 'ip_address', type: 'VARCHAR(50)', constraints: ['NULLABLE'], description: 'Client network address source coordinate' }
    ],
    sampleData: [
      { log_id: 6001, user_id: 101, action: 'Student reported complaint', table_name: 'complaints', record_id: 1001, ip_address: '192.168.1.45' },
      { log_id: 6002, user_id: 103, action: 'Dispatched ticket', table_name: 'staff_assignments', record_id: 801, ip_address: '10.0.0.8' }
    ]
  }
];

export const DatabaseSchemaExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'er' | 'tables' | 'sql'>('er');
  const [selectedTableName, setSelectedTableName] = useState<string>('complaints');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM complaints LIMIT 3;');
  const [sqlResults, setSqlResults] = useState<any[] | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);

  const selectedTable = DATABASE_SCHEMAS.find(t => t.name === selectedTableName) || DATABASE_SCHEMAS[0];

  // SQL Sandbox query processing simulator
  const handleRunSql = () => {
    setSqlError(null);
    setSqlResults(null);

    const query = sqlQuery.trim().toLowerCase();
    
    if (!query) {
      setSqlError("Error: Empty SQL statement.");
      return;
    }

    if (!query.startsWith('select')) {
      setSqlError("Sandbox security error: Only SELECT read operations are authorized in this schema viewer sandbox.");
      return;
    }

    // Parse target table
    const matchedTable = DATABASE_SCHEMAS.find(t => query.includes(`from ${t.name}`));
    if (!matchedTable) {
      setSqlError(`SQL Syntax Error: Relation not found. Please SELECT from one of the active tables (e.g., SELECT * FROM ${DATABASE_SCHEMAS[0].name}).`);
      return;
    }

    // Check limit
    let limit = 10;
    const limitMatch = query.match(/limit\s+(\d+)/);
    if (limitMatch) {
      limit = parseInt(limitMatch[1], 10);
    }

    setTimeout(() => {
      // Simulate fetch
      const rows = matchedTable.sampleData.slice(0, limit);
      setSqlResults(rows);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Cloud Info Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Database size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Cloud Engine</p>
            <p className="text-sm font-bold mt-0.5">Neon PostgreSQL</p>
          </div>
        </div>

        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">ORM framework</p>
            <p className="text-sm font-bold mt-0.5">SQLAlchemy 2.0</p>
          </div>
        </div>

        <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <HardDrive size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Snapshot policy</p>
            <p className="text-sm font-bold mt-0.5">Daily Automatic Backup</p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200/50 dark:border-white/5">
        <button
          onClick={() => setActiveTab('er')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'er'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Network size={14} /> Schema ER Diagram
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tables'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table size={14} /> 16-Core Tables Directory
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sql'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal size={14} /> SQL Query Sandbox
        </button>
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === 'er' && (
        <div className="space-y-6">
          <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl p-5 md:p-6">
            <h3 className="font-bold text-sm mb-1 font-display">Interactive Relational ER Diagram Map</h3>
            <p className="text-xs text-slate-400 mb-6">Click on any table node to display its structural definitions, columns, and SQLAlchemy configurations below.</p>

            {/* Custom Interactive SVG Node ER diagram canvas */}
            <div className="border border-slate-200/40 dark:border-white/5 bg-slate-900/45 dark:bg-slate-950/60 rounded-xl p-4 overflow-x-auto min-h-[420px] flex items-center justify-center">
              <div className="relative w-[850px] h-[380px] select-none font-sans scale-[0.85] md:scale-100 origin-center">
                
                {/* Connections (Lines and Arrows as styled divs) */}
                
                {/* Horizontal line: roles -> users */}
                <div className="absolute top-[80px] left-[135px] w-[90px] h-0.5 bg-indigo-500/40" />
                <div className="absolute top-[77px] left-[220px] text-indigo-500/60 text-[10px] font-bold">1:N</div>

                {/* Vertical lines: users -> complaints / feedback / notifications */}
                {/* User to Notifications (left branch) */}
                <div className="absolute top-[100px] left-[100px] w-0.5 h-[60px] bg-blue-500/30" />
                <div className="absolute top-[160px] left-[100px] w-[125px] h-0.5 bg-blue-500/30" />
                <div className="absolute top-[160px] left-[220px] w-0.5 h-[20px] bg-blue-500/30" />
                
                {/* User to Complaints (center branch) */}
                <div className="absolute top-[100px] left-[285px] w-0.5 h-[80px] bg-blue-500/40" />
                <div className="absolute top-[140px] left-[288px] text-blue-400 text-[9px] font-bold">1:N</div>

                {/* User to Feedback (right branch) */}
                <div className="absolute top-[100px] left-[320px] w-0.5 h-[50px] bg-blue-500/30" />
                <div className="absolute top-[150px] left-[320px] w-[260px] h-0.5 bg-blue-500/30" />
                <div className="absolute top-[150px] left-[580px] w-0.5 h-[30px] bg-blue-500/30" />

                {/* Complaints to status history / images / staff assignments */}
                {/* Center node complaints -> status history */}
                <div className="absolute top-[220px] left-[285px] w-0.5 h-[60px] bg-indigo-500/40" />
                <div className="absolute top-[250px] left-[288px] text-indigo-400 text-[9px] font-bold">1:N</div>

                {/* Complaints to images */}
                <div className="absolute top-[210px] left-[200px] w-[40px] h-0.5 bg-indigo-500/30" />
                <div className="absolute top-[210px] left-[200px] w-0.5 h-[70px] bg-indigo-500/30" />

                {/* Complaints to staff assignments */}
                <div className="absolute top-[210px] left-[330px] w-[140px] h-0.5 bg-indigo-500/30" />
                <div className="absolute top-[210px] left-[470px] w-0.5 h-[70px] bg-indigo-500/30" />

                {/* Images to AI Predictions */}
                <div className="absolute top-[315px] left-[200px] w-[40px] h-0.5 bg-emerald-500/20" />
                <div className="absolute top-[315px] left-[240px] w-0.5 h-[30px] bg-emerald-500/20" />

                {/* Category/Priority/Status/Building/Room to Complaints link highlights */}
                <div className="absolute top-[210px] left-[610px] w-[40px] h-0.5 bg-slate-500/20" />
                <div className="absolute top-[210px] left-[650px] w-0.5 h-[70px] bg-slate-500/20" />

                {/* NODES CARD LAYOUT */}

                {/* Row 1: Roles, Users */}
                <div 
                  onClick={() => setSelectedTableName('roles')}
                  className={`absolute top-[40px] left-[40px] w-[110px] h-[60px] rounded-lg border p-2 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'roles' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider">Roles</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">roles (16 cols)</p>
                </div>

                <div 
                  onClick={() => setSelectedTableName('users')}
                  className={`absolute top-[40px] left-[225px] w-[120px] h-[60px] rounded-lg border p-2 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'users' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider">Users</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">users</p>
                </div>

                {/* Row 2: Notifications, Complaints (Core), Feedback */}
                <div 
                  onClick={() => setSelectedTableName('notifications')}
                  className={`absolute top-[180px] left-[40px] w-[110px] h-[60px] rounded-lg border p-2 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'notifications' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider">Notifications</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">notifications</p>
                </div>

                <div 
                  onClick={() => setSelectedTableName('complaints')}
                  className={`absolute top-[180px] left-[225px] w-[120px] h-[60px] rounded-lg border p-3 text-center flex flex-col justify-center cursor-pointer transition-all ring-1 ring-blue-500/20 ${
                    selectedTableName === 'complaints' 
                      ? 'border-blue-500 bg-blue-950/50 text-blue-400 shadow-xl scale-105 ring-2 ring-blue-500' 
                      : 'border-blue-800/80 bg-slate-900/90 text-slate-100 hover:border-blue-500'
                  }`}
                >
                  <p className="text-[11px] font-black uppercase tracking-widest text-blue-400 flex items-center justify-center gap-1">
                    <Sparkles size={10} /> Complaints
                  </p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">complaints (PK/FK)</p>
                </div>

                <div 
                  onClick={() => setSelectedTableName('feedback')}
                  className={`absolute top-[180px] left-[520px] w-[110px] h-[60px] rounded-lg border p-2 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'feedback' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider">Feedback</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">feedback</p>
                </div>

                {/* Row 3: Images, History, Assignments */}
                <div 
                  onClick={() => setSelectedTableName('complaint_images')}
                  className={`absolute top-[280px] left-[40px] w-[110px] h-[60px] rounded-lg border p-2 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'complaint_images' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider">Images</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">complaint_images</p>
                </div>

                <div 
                  onClick={() => setSelectedTableName('complaint_history')}
                  className={`absolute top-[280px] left-[225px] w-[120px] h-[60px] rounded-lg border p-2 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'complaint_history' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider">History</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">complaint_history</p>
                </div>

                <div 
                  onClick={() => setSelectedTableName('staff_assignments')}
                  className={`absolute top-[280px] left-[410px] w-[110px] h-[60px] rounded-lg border p-2 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'staff_assignments' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider">Assignments</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">staff_assignments</p>
                </div>

                {/* Sub row: AI predictions */}
                <div 
                  onClick={() => setSelectedTableName('ai_predictions')}
                  className={`absolute top-[310px] left-[550px] w-[100px] h-[45px] rounded-lg border p-1.5 text-center flex flex-col justify-center cursor-pointer transition-all ${
                    selectedTableName === 'ai_predictions' 
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md scale-105' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">AI predictions</p>
                  <p className="text-[7px] text-slate-400 mt-0.5">ai_predictions</p>
                </div>

                {/* Metadata tables details block */}
                <div className="absolute top-[40px] left-[660px] w-[150px] space-y-2 border-l border-slate-800 pl-4 h-[300px] overflow-y-auto">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Auxiliary Schemas</p>
                  {[
                    { name: 'buildings', label: 'Buildings' },
                    { name: 'rooms', label: 'Rooms' },
                    { name: 'departments', label: 'Departments' },
                    { name: 'complaint_categories', label: 'Categories' },
                    { name: 'priorities', label: 'Priorities' },
                    { name: 'complaint_status', label: 'Status Codes' },
                    { name: 'audit_logs', label: 'Audit Logs' }
                  ].map(tab => (
                    <button
                      key={tab.name}
                      onClick={() => setSelectedTableName(tab.name)}
                      className={`w-full text-left px-2 py-1.5 text-[10px] font-semibold rounded-md flex items-center justify-between transition-all ${
                        selectedTableName === tab.name 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <ChevronRight size={10} />
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* Detailed Schema Card (Synchronized with svg clicking) */}
          <TableSchemaDetailCard table={selectedTable} />
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tables Checklist */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 pb-1">16 Core Schemas</p>
            {DATABASE_SCHEMAS.map(t => (
              <button
                key={t.name}
                onClick={() => setSelectedTableName(t.name)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold cursor-pointer text-left transition-all border ${
                  selectedTableName === t.name
                    ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-950 dark:border-white'
                    : 'bg-white hover:bg-slate-50 text-slate-650 dark:bg-[#1E293B] border-slate-200 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/80'
                }`}
              >
                <span className="truncate">{t.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-400 font-mono">
                  {t.columns.length} cols
                </span>
              </button>
            ))}
          </div>

          {/* Table Detail */}
          <div className="lg:col-span-3">
            <TableSchemaDetailCard table={selectedTable} />
          </div>
        </div>
      )}

      {activeTab === 'sql' && (
        <div className="space-y-6">
          <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm font-display flex items-center gap-1.5 text-blue-500">
                  <Terminal size={15} /> Real-Time SQL Query Sandbox
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Execute SQL queries directly on Neon PostgreSQL mock schema tables.</p>
              </div>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                SECURE SANDBOX
              </span>
            </div>

            <div className="space-y-2">
              <div className="bg-slate-950 text-slate-300 p-3 rounded-lg font-mono text-xs border border-slate-800 relative">
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={3}
                  className="w-full bg-transparent outline-none border-none text-xs font-mono text-white resize-none"
                  placeholder="SELECT * FROM complaints LIMIT 3;"
                />
                <button
                  onClick={handleRunSql}
                  className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Play size={10} /> Run Query
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pl-1">
                <span className="font-bold flex items-center gap-0.5 text-slate-550"><Info size={11} /> Sandbox Tips:</span>
                <span>Type <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-400 font-mono">SELECT * FROM roles LIMIT 5;</code></span>
                <span>or <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-400 font-mono">SELECT * FROM buildings;</code></span>
              </div>
            </div>

            {/* Query Results / Errors */}
            {(sqlResults || sqlError) && (
              <div className="border border-slate-200/40 dark:border-white/5 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
                {sqlError && (
                  <p className="text-xs font-bold text-red-500 font-mono flex items-center gap-1.5">
                    ❌ {sqlError}
                  </p>
                )}

                {sqlResults && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-450 tracking-wider font-mono">
                      Query executed successfully - {sqlResults.length} row(s) returned
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] border-collapse font-mono">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[9px] font-bold">
                            {Object.keys(sqlResults[0] || {}).map(key => (
                              <th key={key} className="pb-2 pr-4">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-300">
                          {sqlResults.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-150/10">
                              {Object.values(row).map((val, cIdx) => (
                                <td key={cIdx} className="py-2 pr-4 text-slate-700 dark:text-slate-350">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Component for rendering table detail definitions
const TableSchemaDetailCard: React.FC<{ table: TableDef }> = ({ table }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(table.sqlalchemy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Table Information & columns list */}
      <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-850 dark:text-white font-display flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Table: <code className="text-blue-600 dark:text-blue-400 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded">{table.name}</code>
          </h3>
          <p className="text-xs text-slate-400 mt-1">{table.purpose}</p>
        </div>

        {/* Columns Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                <th className="p-3">Field Name</th>
                <th className="p-3">SQL Data Type</th>
                <th className="p-3">Key & Constraints</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {table.columns.map(col => (
                <tr key={col.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                  <td className="p-3 font-bold font-mono text-slate-800 dark:text-white text-[11px]">{col.name}</td>
                  <td className="p-3 font-semibold font-mono text-slate-500 dark:text-slate-400 text-[11px]">{col.type}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {col.constraints.map(c => (
                        <span key={c} className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono ${
                          c.includes('PK') || c.includes('primary_key') || c.includes('FK') || c.includes('REFERENCES')
                            ? 'bg-blue-100/60 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 text-xs font-medium">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQLAlchemy Model definition */}
      <div className="glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-slate-50/60 dark:bg-slate-800/40 px-5 py-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
          <span className="text-xs font-bold font-mono text-slate-450 uppercase tracking-widest">SQLAlchemy ORM Model Code</span>
          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer text-slate-600 dark:text-slate-300"
          >
            {copied ? <Check size={11} className="text-green-500" /> : <RefreshCw size={11} />}
            {copied ? 'Copied' : 'Copy SQLAlchemy Code'}
          </button>
        </div>
        <div className="p-5 bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-[300px]">
          <pre>{table.sqlalchemy}</pre>
        </div>
      </div>
    </div>
  );
};
