-- ==============================================================================
-- 🏗️ CampusCare AI - Complete enterprise Relational Database Schema
-- Designed for High-Concurrency, Relational Integrity, and Auditing (1,000+ Users)
-- Platform: PostgreSQL
-- ==============================================================================

-- Enable modern standard extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- 'student', 'staff', 'admin', 'superadmin'
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb, -- Array of strings indicating claims/actions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- 'Computer Science', 'Electrical', 'Mechanical', etc.
    code VARCHAR(50) NOT NULL UNIQUE, -- 'CS', 'EE', 'ME', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Buildings Table
CREATE TABLE IF NOT EXISTS buildings (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- 'Main Block', 'Tech Tower', 'Hostel Block A'
    code VARCHAR(50) NOT NULL UNIQUE, -- 'MB', 'TT', 'HA'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Floors Table
CREATE TABLE IF NOT EXISTS floors (
    id VARCHAR(255) PRIMARY KEY,
    building_id VARCHAR(255) NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number INT NOT NULL, -- 0 for Ground, 1 for First Floor, etc.
    label VARCHAR(50) NOT NULL, -- 'Ground Floor', 'First Floor'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(building_id, floor_number)
);

-- 5. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(255) PRIMARY KEY,
    floor_id VARCHAR(255) NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    room_number VARCHAR(100) NOT NULL, -- 'Lab 203', 'Room 101', 'Seminar Hall'
    room_type VARCHAR(100) NOT NULL DEFAULT 'Classroom', -- 'Classroom', 'Lab', 'Office', 'Washroom'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(floor_id, room_number)
);

-- 6. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id VARCHAR(255) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    department_id VARCHAR(255) REFERENCES departments(id) ON DELETE SET NULL,
    student_id VARCHAR(100), -- Unique academic identifier for students
    phone VARCHAR(30),
    avatar VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Maintenance Staff Table
CREATE TABLE IF NOT EXISTS maintenance_staff (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL, -- 'Plumbing', 'Electrical', 'Carpentry', 'IT Support', 'Housekeeping'
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    completed_tickets_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Plumbing', 'Electrical', 'Carpentry', etc.
    room_id VARCHAR(255) NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in-progress', 'resolved', 'closed', 'rejected')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    student_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Complaint Images Table
CREATE TABLE IF NOT EXISTS complaint_images (
    id VARCHAR(255) PRIMARY KEY,
    complaint_id VARCHAR(255) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) NOT NULL DEFAULT 'issue' CHECK (image_type IN ('issue', 'repair')), -- 'issue' is before, 'repair' is after work completed
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(255) PRIMARY KEY,
    complaint_id VARCHAR(255) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    staff_id VARCHAR(255) NOT NULL REFERENCES maintenance_staff(id) ON DELETE CASCADE,
    assigned_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(complaint_id, staff_id)
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'submitted', 'assigned', 'resolved', 'alert'
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Audit Logs Table (For security monitoring of DB actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'CREATE_COMPLAINT', 'UPDATE_ROLE', 'DELETE_USER'
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Activity Logs Table (For student/staff application usage metrics)
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity VARCHAR(255) NOT NULL, -- 'USER_LOGIN', 'VIEW_DASHBOARD', 'EXPORT_REPORT'
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Sessions Table (To track user session state and invalidation)
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Email Tokens Table (For email verifications & status updates dispatch)
CREATE TABLE IF NOT EXISTS email_tokens (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_type VARCHAR(50) NOT NULL CHECK (token_type IN ('email_verification', 'notification_subscription')),
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Password Reset Table
CREATE TABLE IF NOT EXISTS password_reset (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Settings Table (For user client preferences)
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- ⚡ Query Optimization & Performance Indexes
-- ==============================================================================

-- Quick lookup for room hierarchy
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor_id);
CREATE INDEX IF NOT EXISTS idx_floors_building ON floors(building_id);

-- Speeding up user queries on role and department filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);

-- Optimizing complaint board loading and statistics queries
CREATE INDEX IF NOT EXISTS idx_complaints_student ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_room ON complaints(room_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status_priority ON complaints(status, priority);

-- Quick image loading for complaint histories
CREATE INDEX IF NOT EXISTS idx_complaint_images_complaint ON complaint_images(complaint_id);

-- Assignment SLA index
CREATE INDEX IF NOT EXISTS idx_assignments_staff_status ON assignments(staff_id, status);

-- Non-blocking user active alerts
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);

-- Quick session verification
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
