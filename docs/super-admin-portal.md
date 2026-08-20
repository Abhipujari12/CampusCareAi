# 👑 CampusCare AI - Super Admin Portal Specification

This document details the functional specifications, global enterprise controllers, and system administration systems designed specifically for the **Super Admin Portal** of **CampusCare AI**. This highest-privilege dashboard grants absolute multi-tenant oversight across multiple colleges, departments, physical infrastructures, roles, configurations, backups, and security credentials.

---

## 🗺️ Super Admin Multi-Tenant Control Flow

```
                             ┌───────────────────────────┐
                             │   Super Admin Root Hub    │  <-- Global System Overseer
                             └─────────────┬─────────────┘
                                           │
         ┌───────────────────┬─────────────┼─────────────┬───────────────────┐
         ▼                   ▼             ▼             ▼                   ▼
  ┌──────────────┐   ┌───────────────┐┌──────────────┐┌───────────────┐┌──────────────┐
  │College Config│   │ Infrastructure││ RBAC Control ││ Sys Config &  ││ Security /  │
  │ (Profile/Dpt)│   │(Bldgs / Rooms)││ (Roles/Perms)││ Backup-Restore││ Logs / Keys  │
  └──────────────┘   └───────────────┘└──────────────┘└───────────────┘└──────────────┘
```

---

## 🛠️ Detailed Functional Modules

### 1. Master College Directory & Profile Manager
The Super Admin dashboard hosts multi-tenant configuration panels to manage institutional identities:
* **College Profile**: Configure legal names, college codes, support email contacts, and localization metrics (timezone, country, primary currency) for all active campuses in the ecosystem.
* **Status Flags**: Super Admins can globally activate or suspend entire college workspaces (e.g. toggling status between `active` and `inactive`). Suspending a college blocks all subordinate logins and data transactions instantly.

### 2. Department & Academic Matrix Management
Configure educational and functional divisions within the system:
* **Academic Catalog**: Manage the master directory of college departments (e.g. Computer Science Engineering, Electrical & Electronics Engineering, Civil Engineering, Administration).
* **Technician Department Mapping**: Group field technicians and maintenance supervisors into respective service departments to automate route assignments.

### 3. Physical Asset & Building Hierarchy Manager
Maintains the complete, high-integrity spatial database of all campus physical structures:
* **Buildings Catalog**: Register newly built blocks (e.g. "Tech Tower", "Main Admin Block", "Hostel Block C") with unique building identification codes.
* **Floors Registry**: Map physical floor counts nested inside buildings to establish reporting limits.
* **Rooms Directory**: Manage individual rooms, washrooms, classrooms, or computer labs. It features validation constraints preventing duplicate room names within a single floor boundary.

### 4. Advanced Role-Based Access Control (RBAC) & Permissions
Provides complete control over authentication boundaries and user permissions:
* **Roles Definition**: Define user access types (`student`, `staff`, `admin`, `superadmin`) and descriptions.
* **Permissions Matrix**: Toggle specific system access flags (e.g. `can_assign_staff`, `can_export_reports`, `can_delete_users`, `can_modify_configurations`) in real-time, instantly modifying JWT check results on server endpoints.

### 5. Central System Configurations
Manages system-wide business rules and global triggers:
* **SLA Configuration**: Set customized response deadlines for each priority class (e.g., Critical priority tickets must be assigned within 15 minutes and resolved within 2 hours).
* **Asset Scanning Rules**: Toggle barcode/QR code asset tracking protocols and select automatic classification preferences (e.g. automatic priority classification using machine learning).

### 6. High-Reliability Database Backup & Recovery (Backup & Restore)
Protects against critical server failures and data loss:
* **On-Demand Snapshots**: Generate instantly downloadable PostgreSQL database dumps (.sql) and Firestore collection schemas with a single click.
* **Automated Chron-Schedules**: Set automated daily, weekly, or monthly backup policies targeting external secure cloud storage buckets (Google Cloud Storage or Amazon S3).
* **Restoration Portal**: Safely upload historical backup files to roll back system states, protected by multi-factor authentication (MFA) prompts.

### 7. Real-time Security Auditing (Audit & Activity Logs)
Guarantees absolute compliance with security standards:
* **System Audit Logs**: Access a write-once database table (`audit_logs`) documenting crucial administrative actions (e.g., who changed a user role, when an IP address updated system configurations, database schema changes).
* **User Activity Logs**: Analyze system usage charts tracking average daily active sessions, peak login hours, and report export frequencies.

### 8. API Key & Security Credentials Manager
Centralizes connection configurations and secret credentials securely:
* **Secrets Vault**: Register, rotate, and manage API keys for integrations (e.g. Twilio SMS Gateway, Google Gemini AI API, Cloudinary media CDN, SendGrid email dispatchers).
* **External Webhook Registrations**: Set up secure REST webhook urls with HMAC signatures to broadcast ticket updates instantly to third-party campus ERP software.
