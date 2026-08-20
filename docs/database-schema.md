# 🗄️ CampusCare AI - Relational Database Schema Design (17 Tables)

This document contains the production-ready entity schema design of the **CampusCare AI** system. The architecture is composed of exactly 17 tables to achieve granular role control, location mapping (Buildings -> Floors -> Rooms), secure sessions, and deep audit logging.

---

## 📐 Complete Relational Entity-Relationship Map

The following map outlines the exact structural associations across the 17-table schema:

```
  ┌───────────────┐
  │     roles     │◄───────────────────────────────────┐
  └───────┬───────┘                                    │
          │ 1-to-Many                                  │
          ▼                                            │
  ┌───────────────┐        ┌─────────────────┐         │
  │     users     │◄───────┤   departments   │         │
  ├───────────────┤        └─────────────────┘         │
  │ id (PK)       ├──────────────┬─────────────────────┼─────────┐
  │ email (UQ)    │              │                     │         │
  └───────┬───────┘              │                     │         │
          │                      │                     │         │
          │ 1-to-Many            │ 1-to-Many           │ 1-to-1  │ 1-to-1
          ▼                      ▼                     ▼         ▼
  ┌───────────────┐      ┌───────────────┐     ┌───────────┐ ┌───────────┐
  │  complaints   │      │  assignments  │     │ settings  │ │  sessions │
  ├───────────────┤      ├───────────────┤     └───────────┘ └───────────┘
  │ room_id (FK) ─┼──┐   │ staff_id (FK) ├──────────────┐
  └───────┬───────┘  │   └───────────────┘              │
          │          │                                  │
          ▼          ▼                                  ▼
  ┌───────────────┐┌─────────────┐             ┌─────────────────┐
  │complaint_img  ││    rooms    │◄────────────┤maintenance_staff│
  └───────────────┘└──────┬──────┘             └─────────────────┘
                          ▼
                   ┌─────────────┐
                   │   floors    │◄──────────── Buildings
                   └─────────────┘
```

---

## 🛠️ granular Table Schemas & Definitions

### 1. `roles` Table
Enforces Role-Based Access Control (RBAC) claims and associated permission sets in JSONB format.
* **PK**: `id`
* **Unique Constraints**: `name` ('student', 'staff', 'admin', 'superadmin')

### 2. `departments` Table
Categorizes student curriculums and technical staff departments.
* **PK**: `id`
* **Unique Constraints**: `name`, `code`

### 3. `buildings` Table
Defines active campus physical blocks (e.g., Tech Tower, Main Block).
* **PK**: `id`
* **Unique Constraints**: `name`, `code`

### 4. `floors` Table
Represents physical floors nested within buildings.
* **PK**: `id`
* **Foreign Key**: `building_id` references `buildings(id)`
* **Unique Constraints**: `(building_id, floor_number)`

### 5. `rooms` Table
Enforces precise target reporting boundaries for maintenance complaints.
* **PK**: `id`
* **Foreign Key**: `floor_id` references `floors(id)`
* **Unique Constraints**: `(floor_id, room_number)`

### 6. `users` Table
Stores user accounts, profile details, and associations with roles/departments.
* **PK**: `id`
* **Foreign Keys**: 
  * `role_id` references `roles(id)`
  * `department_id` references `departments(id)`
* **Unique Constraints**: `email`

### 7. `maintenance_staff` Table
Extends user profiles specifically for technical repair crews on-site.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)` (1-to-1)

### 8. `complaints` Table
The primary core transactional logging table tracking infrastructure repair requests.
* **PK**: `id`
* **Foreign Keys**: 
  * `room_id` references `rooms(id)`
  * `student_id` references `users(id)`

### 9. `complaint_images` Table
Saves original proof and after-repair completion verification images.
* **PK**: `id`
* **Foreign Key**: `complaint_id` references `complaints(id)`

### 10. `assignments` Table
A high-integrity junction table linking repair tickets with maintenance staff members.
* **PK**: `id`
* **Foreign Keys**: 
  * `complaint_id` references `complaints(id)`
  * `staff_id` references `maintenance_staff(id)`
  * `assigned_by` references `users(id)`

### 11. `notifications` Table
Stores non-blocking dispatch alerts pushed to active campus users.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)`

### 12. `audit_logs` Table
A highly secure write-once table mapping crucial actions (role changes, deletions) for regulatory compliance.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)`

### 13. `activity_logs` Table
Tracks real-time system performance and user interaction metrics.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)`

### 14. `sessions` Table
Maintains active token lifetimes, checking for suspicious multi-device sign-ins.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)`
* **Unique Constraints**: `session_token`

### 15. `email_tokens` Table
Manages temporary signatures dispatched via emails for confirmation and alerts.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)`
* **Unique Constraints**: `token`

### 16. `password_reset` Table
Secures recovery tokens for accounts requesting a passphrase reset.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)`
* **Unique Constraints**: `token`

### 17. `settings` Table
Keeps layout theme configurations and email/push preferences synchronized.
* **PK**: `id`
* **Foreign Key**: `user_id` references `users(id)` (1-to-1)

---

## ⚡ Indexing & Performance Enhancements

* **Location Query Resolution**: Indexes on `rooms(floor_id)` and `floors(building_id)` optimize room search.
* **RBAC Filtering**: Indexing `users(role_id)` accelerates role check checks on the API middleware.
* **Active Board Loading**: Compound indexes on `complaints(status, priority)` reduce query runtimes during high traffic.
* **Real-time Alert Dispatches**: Partial composite indexes on `notifications(user_id, read) WHERE read = FALSE` accelerate unread notification delivery.
