# 🗺️ CampusCare AI - System Architecture Specification

This document details the software engineering architecture of the **CampusCare AI** system, illustrating how it handles high concurrent volumes (1,000+ users) within a campus setting.

---

## 1. Cloud-Native Hosting Setup

CampusCare AI leverages a decoupled hybrid-cloud infrastructure model for maximum cost-effectiveness, zero-maintenance scaling, and low latency:

```
                   [ Browser / Client Devices ]
                                │  HTTPS (SPA Bundle)
                                ▼
                       ┌─────────────────┐
                       │  Vercel Edge    │  <-- Hosts Compiled React App
                       └────────┬────────┘
                                │
                      REST Requests / JWT Bearer
                                │
                                ▼
                       ┌─────────────────┐
                       │ Cloud Run (GCP) │  <-- Runs FastAPI Docker Container
                       └────────┬────────┘
                                │
               ┌────────────────┼────────────────┐
               ▼                ▼                ▼
      ┌────────────────┐┌────────────────┐┌──────────────┐
      │  Supabase DB   ││ Firebase Auth  ││  Cloudinary  │
      │ (PostgreSQL)   ││ & Firestore    ││ (Media CDN)  │
      └────────────────┘└────────────────┘└──────────────┘
```

### Infrastructure Components:
* **Frontend Hosting (Vercel Edge)**: React single-page application is compiled and deployed to global edge locations, ensuring sub-50ms static file load times for campus students.
* **Backend Application Server (Google Cloud Run)**: The FastAPI server runs within an autoscaling container. It scales to zero during nighttime to save costs and spins up instantly upon requests.
* **Relational Database (Supabase / Neon)**: PostgreSQL server hosting core database schemas, handling transactions, logs, and relational data structures.
* **Document and Real-time Database (Firebase Firestore)**: Utilized specifically for instant synchronization of notifications, active chat rooms, and real-time board dashboards for floor technicians.
* **Media Assets Delivery (Cloudinary)**: Multi-region content delivery network (CDN) that manages, stores, compresses, and resizes photos uploaded by students as proof of damage.

---

## 2. Security Protocols & Isolation

To ensure complete safety of student records and prevent malicious request injection, the architecture enforces strict state security policies:

### JWT Bearer Token Authentication
The backend server uses modern OAuth2 bearer tokens containing cryptographic payloads signed with `HS256`:
* **Stateless Validation**: Backend endpoints validate the token signature on each request without querying the database, reducing latency.
* **Role Claims**: Decoded token payloads include the user role (`student`, `staff`, `admin`, or `superadmin`). Endpoints reject requests if the caller lacks the required role.

### Firestore Row-Level Security (RLS)
Firebase Firestore is protected directly via compiled security rules (`firestore.rules`):
```javascript
match /complaints/{complaintId} {
  allow read: if isAuthenticated() && (
    resource.data.studentId == request.auth.uid || 
    resource.data.assignedStaffId == request.auth.uid || 
    isAdmin() || 
    isStaff()
  );
}
```
This guarantees that students cannot read tickets filed by others, maintaining privacy.

---

## 3. Database Scaling & Concurrency (1000+ Users)

The system is engineered specifically to prevent database bottlenecks:
* **Connection Pooling**: Uses database proxies (such as PgBouncer) to multiplex PostgreSQL database connections across transient serverless backend threads.
* **Optimized Indexes**: Enforces multi-column composite indexing on queries like `WHERE student_id = X ORDER BY created_at DESC` to ensure quick query execution.
* **Caching Layer**: Frequently queried read-only datasets (like campus building directories or active technician catalogs) are cached inside Redis, reducing SQL database load.
