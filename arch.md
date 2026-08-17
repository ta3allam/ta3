# Ta3 (تعلّم) - Learning Management System Architecture

## Executive Overview
**Ta3 (تعلّم)** is an enterprise-grade, Arabic-first Learning Management System (LMS) built with React 18, TypeScript, Tailwind CSS, `shadcn/ui`, and a hybrid Supabase PostgreSQL backend with resilient local fallback engines.

The platform provides isolated role-based experiences for **Students**, **Teachers**, and **System Administrators**, featuring real-time WebSocket Q&A discussions, cloud file storage, academic calendar tracking, and database-enforced Row-Level Security (RLS).

---

## 🏛️ C4 Model Architecture Diagrams

### Level 1: System Context Diagram
The System Context diagram displays how different academic roles interact with **Ta3 LMS** and external cloud providers.

```mermaid
C4Context
    title C4 Level 1: System Context Diagram for Ta3 LMS

    Person(student, "Student (طالب)", "Enrolled user accessing courses, submitting assignments, and participating in Q&A.")
    Person(teacher, "Teacher (معلم)", "Course instructor creating lectures, grading submissions, and managing content.")
    Person(admin, "Admin (مدير)", "System administrator managing catalog, platform metrics, and system security.")

    System(ta3_lms, "Ta3 LMS (تعلّم)", "Arabic-first Web Learning Management Platform.")

    System_Ext(supabase_cloud, "Supabase Cloud Platform", "PostgreSQL Database, Supabase Auth (JWT), Storage Buckets, & Realtime WebSockets.")
    System_Ext(gh_pages, "GitHub Pages CDN", "Production static Web SPA Hosting Environment.")

    Rel(student, ta3_lms, "Accesses courses, submits assignments, views calendar", "HTTPS / Web")
    Rel(teacher, ta3_lms, "Publishes lectures, grades homework, answers Q&A", "HTTPS / Web")
    Rel(admin, ta3_lms, "Monitors system health, manages users", "HTTPS / Web")

    Rel(ta3_lms, supabase_cloud, "Authenticates users, queries DB, streams WebSockets", "WSS / HTTPS")
    Rel(ta3_lms, gh_pages, "Loaded from static bundle", "HTTPS")
```

---

### Level 2: Container Diagram
The Container diagram details the high-level technical building blocks of **Ta3 LMS**.

```mermaid
C4Container
    title C4 Level 2: Container Diagram for Ta3 LMS

    Person(user, "User (Student / Teacher / Admin)", "Authenticated user on Web Browser.")

    Container_Boundary(frontend_app, "Ta3 Web Application (Browser)") {
        Container(react_spa, "React 18 SPA", "TypeScript, Vite, Tailwind CSS, shadcn/ui", "Renders responsive, RTL-first user interfaces.")
        Container(auth_context, "Auth State Provider", "AuthContext.tsx, Supabase Auth SDK", "Manages JWT sessions, login/signup, and role routes.")
        Container(course_context, "Course Data Manager", "CourseContext.tsx, Mock Engine", "Manages state for courses, assignments, and submissions.")
        Container(storage_helper, "Storage Client Utility", "src/lib/storage.ts", "Handles file upload to Supabase Storage with local Blob fallback.")
        Container(realtime_client, "Realtime Subscriptions", "src/lib/discussions.ts", "Manages WebSocket channels for live Q&A updates.")
    }

    Container_Boundary(backend_supabase, "Supabase Infrastructure") {
        ContainerDb(postgres_db, "PostgreSQL Database", "PostgreSQL 15, RLS Policies", "Stores profiles, courses, assignments, submissions, and discussions.")
        Container(supabase_auth, "Supabase Auth Service", "GoTrue / JWT", "Handles user authentication and issues role claims.")
        Container(supabase_storage, "Supabase Storage Buckets", "Object Storage S3 API", "Stores public course-materials and private assignment-submissions.")
        Container(supabase_realtime, "Realtime WebSocket Engine", "Phoenix Sockets", "Streams database mutations to active clients.")
    }

    Rel(user, react_spa, "Interacts with UI", "HTTPS / DOM")
    Rel(react_spa, auth_context, "Reads user session & role")
    Rel(react_spa, course_context, "Dispatches CRUD actions")
    
    Rel(auth_context, supabase_auth, "Authenticates credentials & signs up", "HTTPS / REST")
    Rel(course_context, postgres_db, "Executes SQL queries with RLS", "HTTPS / PostgREST")
    Rel(storage_helper, supabase_storage, "Uploads PDF & ZIP files", "HTTPS / S3 API")
    Rel(realtime_client, supabase_realtime, "Listens to live discussion events", "WSS / WebSockets")
```

---

### Level 3: Component Diagram (Frontend SPA & Modules)
The Component diagram breaks down the internal modules inside the React SPA.

```mermaid
C4Component
    title C4 Level 3: Component Diagram for Ta3 Frontend

    Container_Boundary(spa_components, "React 18 Frontend Component Architecture") {
        Component(router, "App Router", "React Router v6", "Defines public / login routes and protected dashboard routes.")
        Component(require_auth, "RequireAuth Guard", "RequireAuth.tsx", "Guards routes based on authenticated role claims (student, teacher, admin).")

        Component(topbar, "TopBar Header", "TopBar.tsx", "Displays brand logo, asset paths via getAssetUrl(), and user profile menu.")
        Component(sidebar, "AppSidebar", "AppSidebar.tsx", "Renders context-aware navigation links depending on active page.")

        Component(login_page, "Login & Register Modal", "Login.tsx", "Features dual tabs for Login and Sign-Up with role selection.")
        Component(student_dash, "Student Dashboard", "StudentDashboard.tsx", "Renders enrolled courses, Today's Events card, and Global Calendar.")
        Component(teacher_dash, "Teacher Dashboard", "TeacherDashboard.tsx", "Renders teaching course catalog and quick creation triggers.")
        Component(unified_course, "Unified Course Detail", "Courses.tsx", "Single container managing Announcements, Lectures, Assignments, and Discussions.")

        Component(group_catalog, "Study Groups Engine", "Groups.tsx", "List/Grid view catalog with teacher group deletion & student application withdrawal.")
        Component(discussions_comp, "Real-time Q&A Feed", "CourseDiscussions.tsx", "Live Q&A feed with solution marking, search, and filter tabs.")
        Component(grading_console, "Grading Console", "GradingConsole.tsx", "Teacher console for evaluating student assignment submissions.")
        Component(global_cal, "Global Calendar Dialog", "GlobalCalendarDialog.tsx", "Unified academic calendar modal for all course deadlines.")
    }

    Rel(router, require_auth, "Enforces protection")
    Rel(require_auth, student_dash, "Renders for student role")
    Rel(require_auth, teacher_dash, "Renders for teacher role")
    Rel(unified_course, discussions_comp, "Embeds Q&A feed")
    Rel(unified_course, grading_console, "Embeds teacher grading")
    Rel(student_dash, global_cal, "Opens calendar modal")
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
├── arch.md                            # Comprehensive C4 Architecture Spec
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
