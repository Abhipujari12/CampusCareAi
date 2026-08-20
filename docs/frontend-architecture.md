# 💻 CampusCare AI - Frontend Architecture Specification

This document details the high-fidelity client-side architecture of **CampusCare AI**, outlining how our modern React stack is structured to handle secure forms, robust data querying, schema-level validation, and real-time dashboard visualizations for **1,000+ college users**.

---

## 1. Core Technology Selection

The frontend layer is built with high-performance modern tools to guarantee rapid compilation speeds, light bundle footprints, and fluent visual responses:

| Library | Role in Architecture | Key Production Benefit |
| :--- | :--- | :--- |
| **React 19 (SPA)** | UI Rendering & Component Lifecycle | Leverages concurrent rendering features and state-transition APIs to keep the user experience smooth during heavy network load. |
| **TypeScript** | Static Type Safety | Eliminates runtime failures and schema misalignments by enforcing interface-level constraints across all data channels. |
| **Vite** | Asset Bundling & Build Pipeline | Bundles development components instantly and generates highly optimized chunks during production compilation. |
| **Tailwind CSS** | Styling & Theme System | Delivers pixel-perfect adaptive styling via utility classes with a zero-runtime CSS bundle cost. |
| **React Router** | Client-Side Navigation Router | Handles declarative dynamic route mapping and route guards (e.g. redirecting unauthenticated users). |
| **TanStack Query (v5)** | Server State & Request Cache | Cache API responses, handle automatic background re-fetching, and sync active list states under poor network conditions. |
| **React Hook Form** | High-Performance Form Engine | Eliminates unnecessary component re-renders by capturing form states via uncontrolled inputs. |
| **Zod** | Run-time Schema Validation | Enforces payload rules on client inputs before they are dispatched, showing clear error feedback to users instantly. |
| **Axios** | HTTP client | Handles REST queries with pre-configured interceptors to inject authorization headers automatically. |
| **Chart.js / Recharts** | Admin Performance Analytics | Renders lightweight, fully responsive vector charts for complaint volume trends and staff SLA resolution metrics. |

---

## 2. Global State Management & Data Flow

To ensure consistent performance, CampusCare AI clearly segregates **Client UI State** from **Server Cache State**:

```
                              ┌───────────────────┐
                              │    User Interaction │
                              └─────────┬─────────┘
                                        │
                                        ▼
                      ┌───────────────────────────────────┐
                      │    React Hook Form + Zod Validator │
                      └─────────────────┬─────────────────┘
                                        │ (Valid Payload Passed)
                                        ▼
                      ┌───────────────────────────────────┐
                      │     TanStack Query Mutation / API │
                      └─────────────────┬─────────────────┘
                                        │
                ┌───────────────────────┴───────────────────────┐
                ▼                                               ▼
     ┌─────────────────────┐                         ┌─────────────────────┐
     │  HTTP Axios Client  │                         │ Firestore Real-time │
     │  (REST endpoints)   │                         │ (Status push-feeds) │
     └──────────┬──────────┘                         └──────────┬──────────┘
                │                                               │
                ▼                                               ▼
     ┌─────────────────────┐                         ┌─────────────────────┐
     │ Server State Cache  │                         │ Persistent Client UI │
     │ (TanStack Query DB) │                         │ (Context App State) │
     └─────────────────────┘                         └─────────────────────┘
```

### Server State Strategy (TanStack Query)
Instead of forcing raw React state variables to manage complex loading, error, and stale indicators, CampusCare AI uses TanStack Query hooks:
* **Automatic Cache Invalidation**: When a student reports a complaint, query keys (e.g., `["complaints", studentId]`) are invalidated, triggering an instant silent background update.
* **Optimistic Updates**: On the technician's screen, marking a ticket as "in-progress" immediately shifts its UI visual state before the cloud database network roundtrip finishes.

---

## 3. Safe Form Handling & Run-time Type Validation

Inputs like description lengths and room numbers are rigorously validated client-side using **Zod** schemas integrated directly into **React Hook Form**:

### Ticket Submission Form Schema (`/src/schemas/complaintSchema.ts`)
```typescript
import { z } from 'zod';

export const complaintSubmissionSchema = z.object({
  title: z.string()
    .min(5, "Complaint title must contain at least 5 characters")
    .max(80, "Title is too descriptive (max 80 characters)"),
  description: z.string()
    .min(15, "Please provide more details (minimum 15 characters to explain damage)"),
  category: z.enum(["Plumbing", "Electrical", "Carpentry", "IT Support", "Housekeeping"]),
  building: z.string().min(2, "Please select an active campus building"),
  roomNumber: z.string().min(1, "Room number or classroom reference is required"),
  priority: z.enum(["low", "medium", "high", "critical"])
});

export type ComplaintFormInput = z.infer<typeof complaintSubmissionSchema>;
```

### React Component Form Integration Example
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complaintSubmissionSchema, ComplaintFormInput } from '../schemas/complaintSchema';

export const ReportComplaintForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ComplaintFormInput>({
    resolver: zodResolver(complaintSubmissionSchema)
  });

  const onSubmit = (data: ComplaintFormInput) => {
    // Dispatch validated data securely via Axios
    console.log("Validated payload successfully captured:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-400">Complaint Title</label>
        <input {...register("title")} className="w-full px-3 py-2 bg-slate-900 border rounded-lg" />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>
      {/* Dynamic room validation inputs ... */}
    </form>
  );
};
```

---

## 4. API Client Isolation (Axios Interceptors)

All HTTP transactions are centralized via a singleton Axios instance. Interceptors handle cookie-safe token injection and standard HTTP status code error-trapping globally:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.campuscare.ai/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Outgoing Request Interceptor: Attach security signatures
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Incoming Response Interceptor: Catch global access revocations
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("JWT token expired or revoked. Redirecting to security login portal...");
      localStorage.removeItem('cc_auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```
