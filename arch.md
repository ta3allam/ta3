# Ta3 (تعلّم) - Learning Management System Architecture

## Executive Overview
**Ta3 (تعلّم)** is an enterprise-grade, Arabic-first Learning Management System (LMS) built with React 18, TypeScript, Tailwind CSS, `shadcn/ui`, and a hybrid Supabase PostgreSQL backend with resilient local fallback engines.

The platform provides isolated role-based experiences for **Students**, **Teachers**, and **System Administrators**, featuring real-time WebSocket Q&A discussions, cloud file storage, academic calendar tracking, and database-enforced Row-Level Security (RLS).

---

## 🏛️ System Architecture Diagrams (Mermaid)

### Level 1: System Context Diagram
The System Context diagram displays how different academic roles interact with **Ta3 LMS** and external cloud providers.

```mermaid
graph TD
    subgraph Users [" Academic Users "]
        Student["🎓 Student (طالب)<br/>Accesses courses, submits assignments, views calendar"]
        Teacher["👨‍🏫 Teacher (معلم)<br/>Publishes lectures, grades homework, answers Q&A"]
        Admin["🛡️ Admin (مدير)<br/>Monitors health, manages users, catalog management"]
    end

    subgraph Platform [" Core Ta3 Platform "]
        Ta3App["💻 Ta3 LMS Web Application<br/>(React 18, TypeScript, Tailwind CSS, shadcn/ui)"]
    end

    subgraph Cloud [" External Cloud Infrastructure "]
        SupabaseDB[("🗄️ Supabase PostgreSQL DB<br/>Relational data & RLS policies")]
        SupabaseAuth["🔑 Supabase Auth<br/>JWT Auth & Role Claims"]
        SupabaseStorage["☁️ Supabase Storage<br/>course-materials & assignment-submissions"]
        SupabaseRealtime["⚡ Supabase Realtime<br/>WebSockets Q&A Engine"]
        GHPages["🌐 GitHub Pages CDN<br/>Production SPA Hosting (/ta3/)"]
    end

    Student -->|HTTPS / Web| Ta3App
    Teacher -->|HTTPS / Web| Ta3App
    Admin -->|HTTPS / Web| Ta3App

    Ta3App -->|PostgREST API| SupabaseDB
    Ta3App -->|Auth SDK| SupabaseAuth
    Ta3App -->|S3 Upload/Download| SupabaseStorage
    Ta3App -->|WebSocket Channels| SupabaseRealtime
    Ta3App <-->|Static Asset Delivery| GHPages
```

---

### Level 2: Container Diagram
The Container diagram details the high-level technical building blocks of **Ta3 LMS**.

```mermaid
graph TD
    subgraph Browser [" Client Web Browser "]
        subgraph FrontendSPA [" Ta3 React 18 Single Page Application "]
            UI["📱 React UI Components & Layouts"]
            AuthCtx["🔑 Auth Provider (AuthContext.tsx)<br/>Session & Role Router Guard"]
            CourseCtx["📚 Course State Manager (CourseContext.tsx)<br/>Course CRUD & Submissions State"]
            StorageUtil["☁️ Storage Helper (storage.ts)<br/>S3 Upload & Blob Fallback"]
            RealtimeClient["⚡ Realtime Client (discussions.ts)<br/>WebSocket Channel Listener"]
        end
    end

    subgraph Backend [" Supabase Cloud Backend "]
        AuthSvc["🔐 Auth Service (GoTrue)<br/>JWT Session Issuer"]
        PostgresDB[("DATABASE: PostgreSQL 15<br/>12 Relational Tables + RLS Policies")]
        StorageBuckets["🗂️ Storage Buckets<br/>course-materials & assignment-submissions"]
        RealtimeEngine["📡 Phoenix Realtime Engine<br/>WebSocket Broadcasts"]
    end

    UI --> AuthCtx
    UI --> CourseCtx
    UI --> StorageUtil
    UI --> RealtimeClient

    AuthCtx -->|SignIn / SignUp / Session| AuthSvc
    CourseCtx -->|REST Queries & RLS| PostgresDB
    StorageUtil -->|File Uploads| StorageBuckets
    RealtimeClient -->|Subscribe to Channel| RealtimeEngine
```

---

### Level 3: Component Diagram (Frontend SPA & Modules)
The Component diagram breaks down the internal modules inside the React SPA.

```mermaid
graph TD
    subgraph AppCore [" App Core & Routing Layer "]
        Router["🛣️ App Router (App.tsx)<br/>Public & Protected Routes"]
        RequireAuth["🔒 RequireAuth Guard<br/>Role Validation (Student / Teacher / Admin)"]
        TopBarComp["🔝 TopBar Header<br/>Brand Logo & getAssetUrl() Helper"]
        SidebarComp["📐 AppSidebar<br/>Context-Aware Navigation Menu"]
    end

    subgraph Pages [" SPA Pages & Dashboards "]
        LoginPage["🔐 Login & Register Page (Login.tsx)<br/>Sign-In & Sign-Up Tabs"]
        StudentDash["🎓 Student Dashboard<br/>Today's Events Card & Enrolled Courses"]
        TeacherDash["👨‍🏫 Teacher Dashboard<br/>Teaching Catalog & Creation Triggers"]
        AdminDash["🛡️ Admin Dashboard<br/>Platform Metrics & System Admin"]
        UnifiedCourse["📚 Unified Course Detail (Courses.tsx)<br/>Announcements, Lectures, Assignments, Discussions"]
        GroupsPage["👥 Study Groups Catalog (Groups.tsx)<br/>List/Grid Toggle, Delete, & Withdraw Application"]
    end

    subgraph Features [" Feature Components "]
        GlobalCal["📅 Global Calendar Modal<br/>Unified Course Deadlines"]
        QAFeed["💬 Real-time Q&A Feed<br/>Solution Marking & Verified Badges"]
        GradingConsole["📝 Grading Console<br/>Teacher Homework Evaluation"]
        StorageHelper["☁️ Storage Helper<br/>S3 Uploads & Blob Fallback"]
    end

    Router --> RequireAuth
    RequireAuth --> StudentDash
    RequireAuth --> TeacherDash
    RequireAuth --> AdminDash
    RequireAuth --> UnifiedCourse
    RequireAuth --> GroupsPage

    StudentDash --> GlobalCal
    UnifiedCourse --> QAFeed
    UnifiedCourse --> GradingConsole
    UnifiedCourse --> StorageHelper
```

---

### Level 4: Code & Data Model Diagram (PostgreSQL Relational Schema)
The Code/Data diagram displays the database tables, relationships, and constraints established in `001_initial_schema.sql`.

```mermaid
erDiagram
    PROFILES ||--o{ COURSES : "teaches"
    PROFILES ||--o{ ENROLLMENTS : "enrolls"
    COURSES ||--o{ ENROLLMENTS : "contains"
    COURSES ||--o{ LECTURES : "has"
    LECTURES ||--o{ MATERIALS : "includes"
    COURSES ||--o{ ASSIGNMENTS : "assigns"
    ASSIGNMENTS ||--o{ SUBMISSIONS : "receives"
    PROFILES ||--o{ SUBMISSIONS : "submits"
    COURSES ||--o{ DISCUSSIONS : "hosts"
    PROFILES ||--o{ DISCUSSIONS : "authors"
    DISCUSSIONS ||--o{ DISCUSSION_REPLIES : "contains"
    PROFILES ||--o{ DISCUSSION_REPLIES : "replies"
    COURSES ||--o{ STUDY_GROUPS : "organizes"
    STUDY_GROUPS ||--o{ GROUP_MEMBERS : "has"
    STUDY_GROUPS ||--o{ GROUP_APPLICATIONS : "receives"

    PROFILES {
        uuid id PK
        string name
        string username
        string role
        string avatar_url
    }

    COURSES {
        bigint id PK
        string name
        string code
        uuid teacher_id FK
        string description
    }

    ENROLLMENTS {
        bigint id PK
        uuid student_id FK
        bigint course_id FK
        timestamp enrolled_at
    }

    LECTURES {
        bigint id PK
        bigint course_id FK
        string title
        string description
    }

    MATERIALS {
        bigint id PK
        bigint lecture_id FK
        string title
        string file_url
        string file_type
    }

    ASSIGNMENTS {
        bigint id PK
        bigint course_id FK
        string title
        string description
        timestamp due_date
    }

    SUBMISSIONS {
        bigint id PK
        bigint assignment_id FK
        uuid student_id FK
        string file_url
        timestamp submitted_at
        integer grade
        string feedback
    }

    DISCUSSIONS {
        bigint id PK
        bigint course_id FK
        uuid author_id FK
        string title
        string content
        boolean is_solved
    }

    DISCUSSION_REPLIES {
        bigint id PK
        bigint discussion_id FK
        uuid author_id FK
        string content
        boolean is_solution
    }

    STUDY_GROUPS {
        bigint id PK
        bigint course_id FK
        string name
        string description
        integer max_members
    }
```

---

## 🛠️ Implemented System Architecture & Features

### 1. Role-Based Access Control (RBAC) & Session Management
- **3 Isolated Roles**: `student`, `teacher`, `admin`.
- **Hybrid Auth Provider (`AuthContext.tsx`)**:
  - Consumes `supabase.auth.signInWithPassword()`, `signUp()`, and `signOut()`.
  - Automatically listens to `supabase.auth.onAuthStateChange()` to maintain persistent JWT logins across page reloads.
  - Supports rapid developer quick-selection with automatic mock engine fallbacks.

### 2. Unified Course Interface (`Courses.tsx`)
- Single unified container component serving both Students and Teachers.
- Dynamic conditional rendering of edit/delete controls based on `user.role`.
- Tabs for **Announcements**, **Lectures**, **Assignments**, **Discussions**, and **Help Guide**.

### 3. Study Groups Engine (`Groups.tsx`)
- Supports **List View (Default)** and **Grid View** layout toggling.
- Teacher-exclusive group creation and **Group Deletion** triggers.
- Student group application submission with **Application Cancellation (`إلغاء طلب الانضمام`)**.

### 4. Real-time Q&A & Discussion Engine (`CourseDiscussions.tsx`)
- Powered by `subscribeToDiscussions()` WebSocket channel helper (`src/lib/discussions.ts`).
- **Verified Solution Marking ("علامة الإجابة الصحيحة")**: Teachers and discussion authors can designate best answers with visual verified badges.
- **Search & Filtering**: Interactive search bar and filter tabs for **All Topics**, **Unanswered Questions**, and **Solved Questions**.

### 5. Cloud File Storage Integration (`src/lib/storage.ts`)
- Configured Supabase Storage Buckets (`005_storage_buckets.sql`):
  - `course-materials` (Public, 50 MB limit): Lecture PDFs, slides, and documents.
  - `assignment-submissions` (Private, 50 MB limit): Student homework PDFs & ZIP files.
- Connected `AssignmentSubmissions.tsx` for uploading actual files directly to cloud storage.

### 6. Robustness & Resiliency Architecture
- **Idempotency & Race-Condition Safeguards**: Database triggers (`ON CONFLICT DO UPDATE`) and storage `upsert: true` parameters prevent duplicate insertion crashes.
- **Data Integrity**: Foreign key `ON DELETE CASCADE` constraints prevent orphaned database records.
- **Row-Level Security (RLS)**: Enforced database-level security policies (`003_rls_policies.sql`) for role isolation.

---

## 📁 Updated File Structure

```
ta3/
├── .github/
│   └── 3_WEEK_ROADMAP.md             # Master 3-Week Development Roadmap
├── .agents/
│   ├── AGENTS.md                      # Team Roster & Git Operating Rules
│   └── REWARDS_PUNISHMENTS.md         # Leaderboard & XP Framework
├── supabase/
│   └── migrations/
│       ├── 20260810000000_001_initial_schema.sql  # 12 Relational Tables
│       ├── 20260810000001_002_seed_data.sql       # Arabic Seed Data
│       ├── 20260811000000_003_rls_policies.sql    # Row-Level Security Policies
│       ├── 20260811000001_004_auth_triggers.sql   # User Profile Auto-Trigger
│       └── 20260812000000_005_storage_buckets.sql # Storage Buckets & Policies
├── src/
│   ├── components/
│   │   ├── courses/
│   │   │   ├── AnnouncementDialog.tsx
│   │   │   ├── AssignmentDialog.tsx
│   │   │   ├── AssignmentSubmissions.tsx
│   │   │   ├── CourseDiscussions.tsx
│   │   │   ├── EventDialog.tsx
│   │   │   ├── GradingConsole.tsx
│   │   │   ├── LectureDialog.tsx
│   │   │   └── MaterialViewerModal.tsx
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── RequireAuth.tsx
│   │   │   └── RoleQuickSelector.tsx
│   │   ├── student/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── GlobalCalendarDialog.tsx
│   │   │   └── LectureDetail.tsx
│   │   └── topbar/
│   │       ├── AppSidebar.tsx
│   │       └── TopBar.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Supabase + Mock Auth Provider
│   │   └── CourseContext.tsx         # Course State Manager
│   ├── lib/
│   │   ├── assetUtils.ts             # Vite BASE_URL Asset Helper
│   │   ├── discussions.ts            # Supabase Realtime WebSocket Helper
│   │   ├── MockAuthEngine.ts         # Local Storage Auth Fallback
│   │   ├── storage.ts                # Supabase Storage Client Helper
│   │   ├── supabase.ts               # Singleton Supabase Client
│   │   └── supabaseClient.ts         # Supabase Client Re-exporter
│   ├── pages/
│   │   ├── admin/AdminDashboard.tsx
│   │   ├── courses/
│   │   │   ├── Courses.tsx           # Unified Course View
│   │   │   └── Groups.tsx            # Study Groups Catalog
│   │   ├── student/StudentDashboard.tsx
│   │   ├── teacher/TeacherDashboard.tsx
│   │   └── Login.tsx                 # Login & Registration SPA Page
│   └── types/
│       ├── supabase.ts               # Database TypeScript Interface Definitions
│       └── user.ts                   # User Roles & Profiles
├── arch.md                            # Comprehensive Architecture Spec (Standard Mermaid)
├── erd.md                             # Entity Relationship Diagram & Schema Docs
└── README.md                          # Master Project README
```

---

## ⚡ Technology Stack & Dependencies

| Layer | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `18.3.1` | UI Library with Concurrent Features |
| **Language** | TypeScript | `5.x` | Strict Static Typing & Schema Security |
| **Build System** | Vite | `5.x` | High-speed SPA Bundling & HMR |
| **Routing** | React Router DOM | `6.x` | Client-Side SPA Navigation & Protection |
| **UI Components** | `shadcn/ui` / Radix UI | Latest | Accessible Headless Design Primitives |
| **Styling** | Tailwind CSS | `3.4.x` | Custom Utility-First Styling & RTL Layouts |
| **Backend & DB** | Supabase / PostgreSQL | `15.x` | Auth, RLS Policies, Relational Storage |
| **Cloud Storage** | Supabase Storage | S3 API | Storage for PDFs, DOCX, & ZIP Submissions |
| **Realtime Engine** | Supabase Realtime | WebSockets | Live Q&A Stream & Discussion Events |
| **Testing** | Vitest & Playwright | Latest | Unit, Component, and E2E Smoke Testing |
