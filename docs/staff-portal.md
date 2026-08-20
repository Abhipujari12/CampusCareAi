# 👷 CampusCare AI - Technical Staff Portal Specification

This document details the functional specifications, technician workflows, and state-transition requirements for the **Technical Staff Portal** of **CampusCare AI**. This interface is optimized for mobile-first views, enabling on-site technicians to manage active assignments, update resolution states, upload completion proof, and track historical work metrics.

---

## 🗺️ Staff Lifecycle & Job Transition Flow

```
                           ┌───────────────────────────┐
                           │   Assigned Job Dispatch   │  <-- Push notifications
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │    Accept / Decline Job   │  <-- Initial evaluation
                           └─────────────┬─────────────┘
                                         │
                                         ▼ (Job Accepted)
                           ┌───────────────────────────┐
                           │     Update to "In Progress"│ <-- Starts SLA timer
                           └─────────────┬─────────────┘
                                         │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
             ┌─────────────────────┐           ┌─────────────────────┐
             │  Communication Notes│           │   Upload Image Proof│
             │  (Student Chat feed)│           │   (Before/After pix)│
             └──────────┬──────────┘           └──────────┬──────────┘
                        │                                 │
                        └────────────────┬────────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │    Mark Work "Resolved"   │  <-- Triggers Student review
                           └───────────────────────────┘
```

---

## 🛠️ Detailed Functional Modules

### 1. Assigned Complaints Board
The primary dashboard designed specifically for field use on mobile browsers:
* **Interactive Job List**: Displays a clear, prioritized list of active tickets assigned to the technician.
* **Filter by Proximity**: Groups tickets based on campus zones or buildings (e.g. "Main Block Block" vs. "Hostel Block A") to minimize travel times.
* **SLA Priority Badges**: Color-coded banners reflecting ticket urgency (`Low` (Green) ➔ `Medium` (Yellow) ➔ `High` (Orange) ➔ `Critical` (Red)).

### 2. Job Acceptance Protocol (SLA Safeguard)
When an administrator dispatches a new repair ticket to a technician:
* **Acceptance Prompt**: Shows a notification with a 2-button action card (`Accept Job` / `Decline with Reason`).
* **Availability Toggle**: If a staff member declines a ticket due to physical bandwidth constraints, they can toggle their status to `Busy`, which updates their availability in the database and prevents automated re-routing.

### 3. Active Job Progress Tracking (Update Status)
Technicians can progress tickets through exactly 3 active states using a simple sliding control panel:
* **Acceptance**: Moves status from `assigned` to `accepted`.
* **Initiation**: When arriving on-site, the technician clicks `Start Work`, which shifts status to `in-progress` and triggers a real-time notification alert to the student.
* **Completion**: When repairs are finished, clicking `Mark Resolved` updates the ticket, releasing the technician to accept new dispatches.

### 4. Photographic Evidence Upload (Upload Images)
To verify resolution quality and prevent administrative disputes:
* **Before & After Comparative Slots**: The portal supports upload fields capturing structural damage state before and after the repair.
* **Compression & Upload**: Compresses photos client-side before sending them to CDN servers, saving bandwidth on low-signal campus Wi-Fi.

### 5. Resolution Notes & Student Chat (Add Notes)
Enables communication directly between the technician and reporting student:
* **Progress Notes**: Allows appending text notes detailing material sourcing or specific issues (e.g., "Sourced replacement 100W copper fuse. Starting circuit repair now.").
* **Unified Comments Feed**: Integrated text box allowing real-time communication directly on the ticket, bypassing the need for phone calls.

### 6. Resolved Job Archive (Work History)
Provides technicians with a dashboard tracking personal achievements and reviews:
* **Resolution History**: Filterable list of all completed and closed tickets.
* **SLA Performance Metrics**: Displays their personal average ticket resolution speed (e.g., "Average Resolution: 1.8 Hours").
* **Feedback Ratings**: Displays feedback reviews and star ratings left by students, helping staff maintain a high standard of work.
