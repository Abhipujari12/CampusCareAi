# 🏗️ CampusCare AI - Production-Grade Campus Maintenance & Repair Management System

[![Production Ready](https://img.shields.io/badge/Production-Ready-success.svg?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/Tech_Stack-React_+_FastAPI_+_Firebase-blue.svg?style=flat-square)](#)
[![Scale](https://img.shields.io/badge/Scale-1000+_Users-orange.svg?style=flat-square)](#)

CampusCare AI is a high-performance, responsive web application designed to streamline, track, and manage physical infrastructure maintenance and repair operations across modern university campuses. Built with modular scalability to support **1,000+ active campus users**, the system integrates modern design patterns, high-fidelity role-based views, real-time sync, and intelligent ticket dispatch.

---

## 🗺️ Production Architecture

```
                       [ HTTPS Traffic ]
                               │
                        Internet Gateway
                               │
                   ┌───────────┴───────────┐
                   ▼                       ▼
       ┌───────────────────────┐ ┌───────────────────┐
       │     Vercel Host       │ │   Cloud Run App   │
       │  (React SPA Frontend) │ │ (FastAPI Backend) │
       └───────────┬───────────┘ └─────────┬─────────┘
                   │                       │
         REST API  │                       │ Database Connections
         JWT Auth  │                       │ 
                   ▼                       ▼
       ┌───────────────────────┐ ┌───────────────────┐
       │     Supabase Auth     │ │   PostgreSQL DB   │
       │  (Email/Phone/Google) │ │ (Neon or Supabase)│
       └───────────────────────┘ └─────────┬─────────┘
                                           │
                                           ▼
                                 ┌───────────────────┐
                                 │ Cloudinary Storage│
                                 │ (Ticket Media)    │
                                 └───────────────────┘
```

---

## 📁 System Directory Structure

This repository follows standard high-enterprise layouts, ensuring clean separation of concerns:

```
CampusCareAI/
├── src/                      # Frontend Application (React 18 + Vite + Tailwind)
│   ├── components/           # Reusable UI Controls (Status, Timelines, Simulator)
│   ├── context/              # Context Providers (Active State, Firebase Connectors)
│   ├── data/                 # Master Datasets (Colleges, Preseeded profiles)
│   ├── layouts/              # Multi-screen Shells (DashboardLayout, Responsive bottom bar)
│   ├── pages/                # Multi-Role Portals (Student, Admin, Staff, Superadmin)
│   ├── types.ts              # Global Typings and State Enums
│   └── App.tsx               # Main Application Router
├── backend/                  # RESTful API Backend Service (FastAPI)
│   ├── app/
│   │   ├── api/              # Route Endpoints (Authentication, Tickets, Comments)
│   │   ├── core/             # Application Settings and Encryption helpers
│   │   ├── middleware/       # JWT Auth and CORS protection layers
│   │   ├── models/           # SQLAlchemy DB Models (PostgreSQL layout)
│   │   ├── repositories/     # Database read/write adapters
│   │   ├── schemas/          # Pydantic serialization contracts
│   │   └── services/         # Business validation logic (Gemini Classification)
│   └── main.py               # Backend main server entrypoint
├── database/                 # SQL Migration & Seeding files
│   ├── schema.sql            # Initial DDL Schema for PostgreSQL databases
│   └── seeds.sql             # Demo seeds for campus departments & initial profiles
├── docs/                     # Technical specifications and report articles
│   ├── architecture.md       # Full architecture plan & cloud mapping
│   ├── api-endpoints.md      # API route contracts and payload examples
│   └── database-schema.md    # SQL relationships and indexes documentation
├── tests/                    # Enterprise test suites
│   ├── test_api.py           # Endpoint integration tests
│   └── conftest.py           # Pytest configurations and mock factories
├── deployment/               # Cloud provisioning scripts
│   ├── vercel.json           # Frontend edge deployment rules
│   └── firestore.rules       # Firebase security constraints
├── scripts/                  # Shell utilities
│   ├── deploy.sh             # Combined single-command deploy scripts
│   └── seed_db.py            # Local script to populate PostgreSQL data
├── docker/                   # Containerization layer
│   ├── Dockerfile            # Multi-stage production container setup
│   └── docker-compose.yml    # Development stack orchestrator (FastAPI + PG)
├── .env.example              # Central Environment variables blueprint
└── LICENSE                   # Open-source license (MIT)
```

---

## 🛠️ Technology Stack

| Domain | Selected Framework / Service | Justification |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + Vite** | Blazing-fast hot reloading, modular SPA architecture, small bundle footprints. |
| **Styling** | **Tailwind CSS** | Atomic design system, rapid layout composition, dark-mode styling out of the box. |
| **Backend** | **FastAPI (Python)** | Asynchronous execution, high-performance serialization, auto-generated OpenAPI (Swagger). |
| **Real-time DB** | **Firebase Firestore** | Real-time websocket subscriptions for instantaneous ticket status changes on the floor. |
| **Relational DB** | **PostgreSQL (Supabase/Neon)** | Strongly typed relational queries, college catalog constraints, high-concurrency connections. |
| **Auth** | **Supabase Auth / Firebase Auth** | Multi-tenant tenant segregation, enterprise token signature validation, out-of-the-box OAuth. |
| **Storage** | **Cloudinary / Firebase Storage** | CDN-optimized image resizing and storage of campus repair proofs. |

---

## ⚡ Setup & Installation

### Frontend Setup (React App)
1. Navigate to the root directory:
   ```bash
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000` to interact with the responsive high-fidelity system mockup.

### Backend Setup (FastAPI)
1. Navigate to `/backend`:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

---

## 🛡️ Enterprise Security Best Practices Implemented
1. **Row-Level Security (RLS)**: Secured firestore collection with precise authorization checks in `firestore.rules`.
2. **Access token strategy**: Strong cryptographic signatures for stateless JWT authentication in backend routing.
3. **Optimized Database Queries**: Composite compound indexing for blazing fast ticket sorting based on status and campus buildings.

---

## 📝 License
Distributed under the **MIT License**. See `LICENSE` for details.
