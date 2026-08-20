# 👨‍🎓 CampusCare AI - Student Portal Specification

This document details the functional specifications, client-side views, and responsive user flows designed specifically for the **Student Portal** of **CampusCare AI**. This portal provides students with an end-to-end interface to report issues, track repairs, search solutions, and provide performance reviews.

---

## 🗺️ Student Portal Feature Flow

```
                           ┌───────────────────────────┐
                           │      Student Dashboard    │
                           └─────────────┬─────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
     ┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
     │   Report Complaint    │ │  Track Complaint  │ │     QR Code Scanner   │
     │  (Zod Form + Images)  │ │ (Interactive Map) │ │  (Scan asset sticker) │
     └───────────┬───────────┘ └─────────┬─────────┘ └───────────┬───────────┘
                 │                       │                       │
                 ▼                       ▼                       ▼
     ┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
     │   Pending Dispatch    │ │  Timeline updates │ │   Instant Pre-fill    │
     │  (Real-time Status)   │ │  & Comments Feed │ │  (Room/Building sync) │
     └───────────────────────┘ └─────────┬─────────┘ └───────────────────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │  Feedback & Rating│
                               │  (5-star review)  │
                               └───────────────────┘
```

---

## 🛠️ Detailed Functional Modules

### 1. Student Dashboard & Hub
The primary portal landing page, styled using a high-contrast dark theme with spacious negative padding:
* **Stat Cards Grid**: Shows real-time counters of the student's *Active Tickets*, *Resolved Issues*, and *Total Filed Complaints*.
* **Status Quick-Look**: Displays a simplified timeline card showing the progress of their latest ticket (e.g. "CC-102: Plumber arriving in 15 mins").
* **Recent Activity Feed**: Pulls read-only logs of recent status updates and admin announcements.

### 2. User Profile Setup
Provides the student with a centralized card to manage their institutional identity records:
* **Profile Metadata**: Lists Name, Registered Email address, Phone number, and Academic/Department affiliation.
* **Campus ID Badge**: Displays their institutional Student Registration ID.
* **Settings Synchronizer**: Allows the student to toggle system-wide dark mode and choose communication preferences (Receive Email alerts or Real-time Push notifications).

### 3. Report Complaint (Interactive Zod Form)
The primary entry form for campus repair tickets. Features include:
* **Categorized Selection**: Dropdown menu grouping physical campus elements into *Plumbing*, *Electrical*, *Carpentry*, *IT Support*, and *Housekeeping*.
* **Location Resolution**: Nested pickers mapped directly to the database hierarchy:
  1. Select Building (e.g. Main Block, Tech Tower)
  2. Select Floor (e.g. Ground, Floor 2)
  3. Select Room Number (e.g. Lab 203, Class 101)
* **Visual Damage Proof**: Supports dragging-and-dropping or clicking to upload a photo of the damaged area. Compression occurs client-side before dispatching.
* **Schema Validation**: Powered by Zod, preventing empty titles or too-short descriptions from reaching backend database resources.

### 4. Track Complaint & Real-time Timeline
Once a complaint is successfully submitted, students can track its progress on a dynamic progress map:
* **Interactive Timeline**: Staggered, state-driven timeline tracking progress across exactly 5 milestones: `Submitted` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`.
* **Technical Staff Profile Card**: Displays details of the assigned technician (name, photo, department, and phone) as soon as the administrator dispatches the ticket.
* **Comments Communication Feed**: A real-time micro-chat system located under the timeline, allowing the student and assigned technician to coordinate arrival times or exchange instructions securely.

### 5. Instant QR Code Scanner
To minimize ticket-filing friction, the student app includes an simulated camera QR Code scanner:
* **Sticker Mapping**: Students scan physical QR stickers pasted on classroom doors or specific laboratory machines.
* **Dynamic Pre-filling**: Upon reading a valid campus asset code (e.g. `QR_BLDG_TT_FL3_RM304_AC2`), the portal automatically skips search pickers, pre-filling the Building, Floor, Room Number, and Category (e.g. "Electrical Repair") inside the complaint form.

### 6. Notifications Center
A real-time notification tray keeping students informed:
* **Event Triggers**: Pushes silent alerts when a technician is assigned, work is started, or a ticket is resolved.
* **Read Status Sync**: Allows marking individual alerts as read or clearing the tray with a single click. Synchronized directly with Firestore users' sub-collections.

### 7. Complaint History Archive
A filterable table containing a permanent history of the student's reports:
* **Filter Options**: Search and filter past tickets by *Status*, *Category*, *Date Range*, or *Priority*.
* **Export PDF Receipt**: Generates a clean printable PDF receipt containing the resolution logs, timelines, and proof of completion photos.

### 8. Knowledge Base (FAQ & Self-Service)
A searchable database of common campus guidelines:
* **Minor Quick-Fixes**: Includes simple text solutions for common student issues (e.g., "How to connect to the hostel Wi-Fi").
* **Service Level Agreements (SLA)**: Clarifies the standard campus resolution timeframes for low, medium, and critical category tickets so students know what to expect.

### 9. Feedback & Resolution Review
Enforces quality control of maintenance crews:
* **Star Rating System**: A 1-to-5 star review system that unlocks only after a ticket has been marked as `resolved`.
* **Review comments**: Text field allowing students to leave feedback regarding the professionalism or speed of the technician.
* **Closing Trigger**: Submitting the review automatically progresses the ticket status to `closed`, locking the ticket from further edits and archiving the record.
