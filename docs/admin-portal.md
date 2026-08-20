# 👨‍💼 CampusCare AI - Admin Portal Specification

This document details the functional specifications, administrative control systems, and management workflows designed specifically for the **Admin Portal** of **CampusCare AI**. This dashboard provides institutional administrators with complete oversight over user registrations, ticket dispatching, predictive SLA analytics, global announcements, and regulatory reporting.

---

## 🗺️ Admin Management & Dispatch Flow

```
                             ┌───────────────────────────┐
                             │    Admin Control Hub      │  <-- Analytics & Alerts
                             └─────────────┬─────────────┘
                                           │
         ┌───────────────────┬─────────────┼─────────────┬───────────────────┐
         ▼                   ▼             ▼             ▼                   ▼
  ┌──────────────┐   ┌───────────────┐┌──────────────┐┌───────────────┐┌──────────────┐
  │ Manage Users │   │ Manage Tickets││ Assign Staff ││ Announcements ││Export Reports│
  │ (Edit roles) │   │ (Filter/Clean)││ (Smart list) ││ (Broadcast)   ││ (CSV / PDF)  │
  └──────────────┘   └───────────────┘└──────┬───────┘└───────────────┘└──────────────┘
                                             │
                                             ▼ (Dispatch Event)
                               ┌───────────────────────────┐
                               │   Technician App Notified │  <-- Push notifications
                               └───────────────────────────┘
```

---

## 🛠️ Detailed Functional Modules

### 1. Unified Control Dashboard (Analytics Hub)
The central operational screen for system administrators, displaying dynamic visual performance charts:
* **Real-time KPI Cards**: High-density counters displaying *Total Active Complaints*, *SLA Breach Warnings*, *Available Staff Members*, and *Average Resolution Time*.
* **Interactive charts**: Powered by Recharts/Chart.js showing weekly ticket inflow volume, resolution distributions across categories (Plumbing, Electrical, Carpentry, etc.), and individual technician workload capacities.
* **Emergency Broadcast Panel**: Quick-access header to dispatch flash warnings (e.g. "Main block power grid shutdown scheduled at 4:00 PM").

### 2. User Directory & Role-Based Control (Manage Users)
Provides absolute authority to manage the credentials of students, faculty, and maintenance crews:
* **Comprehensive Search Filter**: Instantly search users by name, official email, department, or academic register ID.
* **Granular Role Toggle**: Elevate user roles securely (e.g., promoting a standard student user to `'admin'` or `'staff'`) with automated database logging.
* **User Profile Creation**: Bulk-add or manually register accounts for technical crews, complete with specified departments and physical specialty settings (e.g., "Plumbing Specialty").

### 3. Intelligent Ticket Assignment System (Assign Staff)
A critical operational module to dispatch incoming complaints to available field technicians:
* **Specialist Recommendation**: When an administrator opens an unassigned ticket, the system automatically parses the complaint category and highlights available specialists (e.g., listing plumbing staff first for water leaks).
* **Workload-Aware Dispatching**: Shows active job loads for each technician (e.g., "Ramesh: 1 Active, 4 Completed Today") to prevent burnout and ensure quick repairs.
* **SLA Target Timer**: Displays warning timers showing how much time is remaining to assign staff before breaching institutional service guidelines.

### 4. Advanced Ticket Management (Manage Complaints)
Provides complete lifecycle tracking of all campus repair requests:
* **Multi-Parameter Search**: Filter complaints by building name, status (`new`, `assigned`, `in-progress`, `resolved`, `closed`), ticket priority (`low`, `medium`, `high`, `critical`), and creation date range.
* **Bulk Action Controls**: Select multiple tickets simultaneously to batch-assign technicians, transition progress states, or trigger group resolutions.
* **Full Detail Audit View**: Access complete timelines, comparative upload images, and real-time student/technician comments on any ticket.

### 5. Administrative Announcements Board
Enables administrators to broadcast notifications and directives targeting specific demographics:
* **Targeted Audiences**: Compose announcements targeted to specific user roles (e.g. broadcasting hostel water supply outages strictly to students, or safety notices to technicians).
* **Rich Markdown Content**: Supports styling text, adding warnings, and embedding links using markdown.
* **Firestore Push-Sync**: Broadcasts trigger instant system-wide notifications in real-time across student and staff dashboards.

### 6. Relational Export & Audit Logs (Export Reports)
Provides single-click auditing reports for institutional management boards:
* **Comprehensive CSV/Excel Export**: Extract filtered complaint spreadsheets with resolution logs, technician assignments, student ratings, and repair cost estimations.
* **Printable PDF Summary Sheets**: Generate stylized PDF performance sheets containing resolution SLA trends, satisfaction percentages, and category distributions.

### 7. Global Configuration Panel (System Settings)
Manages institutional rules and automation thresholds:
* **SLA Timeout Thresholds**: Configure standard resolution timeframes (e.g., setting a 2-hour resolution deadline for `Critical` priority tickets).
* **Notification Preferences**: Control global email notification delivery parameters, active database connections, and layout themes.
