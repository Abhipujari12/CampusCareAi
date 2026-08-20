# 🔐 CampusCare AI - Complete Authentication Specification

This document details the production-grade authentication flow of **CampusCare AI**. The system integrates Firebase Authentication on the client side, synchronized with a stateless JSON Web Token (JWT) + Refresh Token pattern on the FastAPI backend to enforce rigid Role-Based Access Control (RBAC).

---

## 🗺️ Authentication & Authorization Flow

```
  ┌──────────────┐         Firebase Auth         ┌──────────────────────┐
  │  Client App  ├──────────────────────────────►│ Firebase Auth Server │
  │ (React SPA)  │◄──────────────────────────────┤  (Google/Email-Pass) │
  └──────┬───────┘          ID Token             └──────────────────────┘
         │
         │ Exchange (POST /api/auth/token)
         ▼
  ┌──────────────┐         Verify Token          ┌──────────────────────┐
  │   FastAPI    ├──────────────────────────────►│   PostgreSQL /       │
  │   Backend    │                               │   Supabase DB        │
  │   Server     │◄──────────────────────────────┤  (User Profiles)     │
  └──────┬───────┘      Profile & RBAC Claims    └──────────────────────┘
         │
         ▼ (Issue System JWT)
  ┌─────────────────────────────────────────────┐
  │  - Access Token (Short-lived JWT, 15 min)   │
  │  - Refresh Token (Stored in Cookie, 7 days) │
  └─────────────────────────────────────────────┘
```

---

## 🛠️ Authentication Features Implemented

### 1. Email & Password Login
Students, technicians, and administrators can sign in using their official campus email addresses:
* **Secured Password Transport**: Cryptographic verification on backend routes using `bcrypt` salting techniques.
* **Persistent Authentication Status**: Powered by Firebase `setPersistence(auth, browserLocalPersistence)` allowing users to stay logged in across browser sessions.

### 2. Google OAuth Integration (Federated Single Sign-On)
Ensures frictionless entry for active college faculty and student groups using institutional Google Workspace accounts:
* **One-Click Authentication**: Uses native Firebase Auth Google Sign-In redirect and popup mechanics.
* **Auto-Profile Construction**: If a Google User is authenticated for the first time, CampusCare AI automatically parses their email domain, registers their profile, and assigns the `'student'` role by default.

### 3. Forgot Password / Self-Service Recovery
If a user loses access, they can trigger an asynchronous recovery email:
* **Safe State Reset Token**: Sends a time-limited, single-use, cryptographically signed token linked with their email record.
* **Passphrase Update**: Enforces strict password complexity metrics upon verification before saving the new hash to the database.

### 4. Email Verification Guard
To prevent bot accounts from spamming fake complaints:
* **Activation Barrier**: Users cannot create or view tickets until their email address is flagged as `verified` (via `user.emailVerified` in Firebase).
* **Verify Reminder Screen**: Directs unverified users to a pending verification prompt block with a resend button.

---

## 🔑 Stateless Session Management (JWT & Refresh Token)

To scale gracefully up to 1,000+ concurrent active sessions, the architecture utilizes stateless JWT tokens for REST endpoint queries:

### Access Token
* **Format**: Standard JWT (`HS256` payload signature).
* **Lifespan**: 15 minutes.
* **Contents**: User ID, Name, verified email status, and authorized RBAC roles.
* **Transmission**: Sent via HTTP `Authorization: Bearer <TOKEN>` header.

### Refresh Token
* **Lifespan**: 7 days.
* **Storage**: Injected in an HTTP-only, secure, same-site Cookie (`cc_refresh_token`).
* **Rotation**: When a new access token is generated, the old refresh token is invalidated and a fresh one is issued (Refresh Token Rotation).

---

## 🎛️ Remember Me & Logout Protocols

### "Remember Me" Hook
* Enabled by setting the persistence level in Firebase to `browserLocalPersistence`.
* The client-side state machine queries the persistent cache on page loads, ensuring a smooth entrance animation for returning users without password re-entry.

### Logout Protocol (Revoking Active Sessions)
1. **Client Cleanup**: Triggers `signOut(auth)` on Firebase, clearing the current user session context.
2. **Server Revocation**: Calls `POST /api/auth/logout`, which clears the HTTP-only `cc_refresh_token` cookie and flags the active session UUID inside the PostgreSQL `sessions` table as `revoked = TRUE`.
3. **Route Invalidation**: Instantly redirects the client-side router to the Landing Page.
