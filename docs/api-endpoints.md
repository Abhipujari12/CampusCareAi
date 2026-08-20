# 🔌 CampusCare AI - API Endpoint Documentation

This reference guide documents the API routes configured within the FastAPI backend, demonstrating structured payload signatures and security access constraints.

---

## 🔑 Authentication Endpoints

### 1. Register User
Creates a permanent login credential and user profile in PostgreSQL + Supabase.
* **HTTP Method**: `POST`
* **Path**: `/api/auth/register`
* **Request Body**:
  ```json
  {
    "name": "Abhishek Pujari",
    "email": "student@college.edu",
    "role": "student",
    "college": "VSM SRKIT",
    "department": "Computer Science",
    "studentId": "CS2026-045",
    "phone": "+919876543210",
    "password": "secure_password_123"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "User registered successfully.",
    "user_id": "usr_8372659102"
  }
  ```

### 2. Login & Token Exchange
Authenticates credentials and returns a cryptographic JWT token.
* **HTTP Method**: `POST`
* **Path**: `/api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "student@college.edu",
    "password": "secure_password_123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": "usr_8372659102",
      "name": "Abhishek Pujari",
      "email": "student@college.edu",
      "role": "student"
    }
  }
  ```

---

## 🎫 Ticket / Complaint Endpoints

### 1. File a New Complaint
Submits a physical campus infrastructure problem.
* **HTTP Method**: `POST`
* **Path**: `/api/complaints`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body**:
  ```json
  {
    "title": "Water Leakage in Lab 3",
    "description": "Pipe burst under the second sink is causing water logging.",
    "category": "Plumbing",
    "building": "Main Block - Floor 2",
    "roomNumber": "Lab 203",
    "priority": "high",
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/leakage.jpg"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "ticket_id": "CC-295",
    "created_at": "2026-07-12T20:00:00Z"
  }
  ```

### 2. Update Ticket Status (Staff/Admin Only)
Progresses a complaint ticket through the maintenance lifecycle.
* **HTTP Method**: `PATCH`
* **Path**: `/api/complaints/{ticket_id}/status`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>` (Must hold 'staff' or 'admin' role claims)
* **Request Body**:
  ```json
  {
    "status": "in-progress",
    "details": "Sourced replacement plumbing joints, starting welding repair.",
    "repairImages": [
      "https://res.cloudinary.com/demo/image/upload/repair_started.jpg"
    ]
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Ticket status updated to IN-PROGRESS.",
    "updated_at": "2026-07-12T20:15:00Z"
  }
  ```

### 3. Assign Technician (Admin Only)
Assigns a specific maintenance staff member to a ticket.
* **HTTP Method**: `POST`
* **Path**: `/api/complaints/{ticket_id}/assign`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>` (Must hold 'admin' role claims)
* **Request Body**:
  ```json
  {
    "staff_id": "usr_9921475109"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "assigned_staff_name": "Ramesh Kumar"
  }
  ```
