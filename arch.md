# Ta3 - Learning Management System Architecture

## Overview
**Ta3** (تعلّم) is a modern Arabic-first Learning Management System built with React, TypeScript, and a role-based access control system. The application currently uses mock authentication and JSON-based data storage, designed to transition to a full Supabase backend.

---

## Core Features

### 1. Role-Based Access Control (RBAC)
- **Three User Roles**: Student, Teacher, Admin
- **Hardcoded Credentials** (Mock Auth):
  - `student / 123` → Access to enrolled courses (CS101, MATH201)
  - `teacher / 123` → Access to teaching courses (CS101, CS301)
  - `admin / 123` → System administration access

### 2. Student Features
- **Dashboard**: View enrolled courses with progress tracking
- **Course View** (Read-Only):
  - View announcements from teachers
  - Access course materials and lectures
  - View assignments and due dates
  - Browse course events (quizzes, exams)

### 3. Teacher Features
- **Dashboard**: Manage teaching courses
- **Course View** (Full Control):
  - Create/edit announcements
  - Create/edit lectures with multiple file types (PDF, images, other)
  - Create/edit assignments with file attachments
  - Create/edit course events (assignments, quizzes, exams)
  - All content created is visible to enrolled students

### 4. Unified Course Interface
- **Single Component** (`Courses.tsx`): Serves both students and teachers
- **Dynamic UI**: Teacher-specific controls (add/edit buttons) conditionally rendered based on user role
- **Shared Content**: Same course data displayed to both roles with different permissions

---

## Architecture & Methods

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6 with protected routes
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Context API (`AuthContext`)
- **Icons**: Lucide React
- **Notifications**: Sonner toast library

### Authentication Flow
```
Login Page (/)
    ↓
Mock Auth (AuthContext)
    ↓
Validate credentials
    ↓
Set user object with role
    ↓
Navigate to role dashboard
    ↓
Protected routes via RequireAuth HOC
```

### Component Architecture

#### Layout Components
- **`DashboardLayout`**: Adaptive layout wrapper
  - Conditionally renders sidebar based on route & role
  - Hides sidebar for student/teacher on dashboards
  - Shows course-specific sidebar when inside a course

- **`TopBar`**: Navigation header
  - User profile dropdown with logout
  - Notification bell (placeholder)
  - Dynamic brand link based on role
  - Conditional sidebar trigger

- **`AppSidebar`**: Context-aware navigation
  - **Dashboard mode**: Hidden for students/teachers
  - **Course mode**: Shows Back, Contact Teacher, Timeline buttons
  - **Admin mode**: Standard admin navigation

#### Data Flow
```
courses.json (Static Data)
    ↓
Import in Courses.tsx
    ↓
Filter by user.enrolledCourses
    ↓
Render course content
    ↓
Teacher: Show edit controls
Student: Read-only view
```

### Routing Structure
```
/ → Login (Public)
├── /admin → Admin Dashboard (Protected: admin only)
├── /teacher → Teacher Dashboard (Protected: teacher only)
│   └── /teacher/courses/:id → Course Detail (Teacher view)
├── /student → Student Dashboard (Protected: student only)
│   └── /student/courses/:id → Course Detail (Student view)
└── /courses/:id → Generic Course Detail (All authenticated users)
```

---

## Data Structure

### Current Implementation: Local JSON

#### `courses.json`
```json
{
  "1": {
    "name": "مبادئ البرمجة",
    "code": "CS101",
    "announcements": [...],
    "events": [...],
    "assignments": [...],
    "lectures": [...]
  }
}
```

#### TypeScript Interfaces (`types.ts`)
- `Course`: Main course container
- `Announcement`: Course notifications
- `CourseEvent`: Calendar events (quiz, exam, assignment)
- `Assignment`: Homework with optional file attachments
- `Lecture`: Content container with materials
- `Material`: Individual files (PDF, video, document)

### User Data Structure
```typescript
{
  username: string;
  role: 'student' | 'teacher' | 'admin';
  enrolledCourses: number[]; // Course IDs
  name: string; // Display name
}
```

---

## Database Dependencies

### Current State: **Mock Data**
- **Authentication**: In-memory via `AuthContext` (no persistence)
- **Course Data**: Static JSON file (`courses.json`)
- **User-Course Mapping**: Hardcoded in `AuthContext.tsx`

### Planned Migration: **Supabase/PostgreSQL**

The application is designed to transition to the ERD structure documented in `erd.md`:

#### Key Tables (Future)
1. **Users** (students, teachers, admins)
2. **Courses** (name, code, semester)
3. **Enrollment** (student-course relationships)
4. **Announcements** (course notifications)
5. **Lectures** (content modules)
6. **Materials** (lecture files)
7. **Assignments** (homework definitions)
8. **Submissions** (student assignment uploads)

#### Database Operations (Planned)
- **Authentication**: Supabase Auth with JWT
- **Data Fetching**: Supabase client queries
- **File Storage**: Supabase Storage for PDFs, images
- **Real-time**: Supabase subscriptions for live updates

---

## Key Design Decisions

### 1. Unified Course Component
**Rationale**: Reduce code duplication and ensure feature parity between student/teacher views.
- Single source of truth for course UI
- Role-based conditional rendering
- Easier to maintain and test

### 2. Context-Aware Sidebar
**Rationale**: Provide focused navigation based on user location.
- Dashboard: Minimal distraction, no sidebar
- Course: Contextual tools (back, contact, timeline)
- Admin: Standard navigation menu

### 3. Mock Data to Real DB Pattern
**Rationale**: Rapid prototyping while designing for scalability.
- JSON files with TypeScript interfaces
- Matches future database schema
- Easy to swap with API calls

### 4. Role Detection via AuthContext
**Rationale**: Centralized, secure role management.
- Single source of truth (`user.role`)
- Used throughout the app for conditional rendering
- Prepared for JWT-based roles

---

## File Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   └── RequireAuth.tsx
│   ├── topbar/
│   │   ├── TopBar.tsx
│   │   └── AppSidebar.tsx
│   └── student/
│       ├── CourseCard.tsx
│       ├── AnnouncementCard.tsx
│       ├── CourseEvents.tsx
│       ├── LecturesList.tsx
│       └── LectureDetail.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── admin/AdminDashboard.tsx
│   ├── teacher/TeacherDashboard.tsx
│   ├── student/StudentDashboard.tsx
│   └── courses/
│       ├── Courses.tsx (Unified course view)
│       ├── courses.json (Mock data)
│       └── types.ts (TypeScript interfaces)
└── App.tsx (Route definitions)
```

---

## Technology Dependencies

### Core
- **React** 18.3
- **TypeScript** 5.x
- **React Router** 6.x
- **Vite** (Build tool)

### UI & Styling
- **Tailwind CSS** 3.x
- **shadcn/ui** (Component library)
- **Lucide React** (Icons)
- **Radix UI** (Primitives)

### Utilities
- **React Helmet Async** (SEO)
- **Sonner** (Toasts)
- **TanStack Query** (Data fetching - prepared for API)

### Future Backend
- **Supabase** (Auth, Database, Storage)
- **PostgreSQL** (Via Supabase)

---

## Current Limitations & Next Steps

### Limitations
1. No data persistence (page refresh logs out)
2. Static course data (no CRUD operations saved)
3. No file upload functionality (placeholder only)
4. No real-time updates
5. No search/filter functionality

### Recommended Next Steps
1. **Database Integration**:
   - Set up Supabase project
   - Implement ERD schema
   - Migrate `courses.json` to PostgreSQL

2. **Authentication**:
   - Replace mock auth with Supabase Auth
   - Implement session persistence
   - Add password reset flow

3. **File Management**:
   - Integrate Supabase Storage
   - Implement file upload for assignments/materials
   - Add file preview functionality

4. **Enhanced Features**:
   - Timeline/Calendar view
   - Teacher-student messaging
   - Grade management
   - Course analytics

---

## Summary

**Ta3** is a well-architected LMS foundation with:
- ✅ Clean role-based access control
- ✅ Unified, maintainable course interface
- ✅ TypeScript type safety
- ✅ Modern React patterns (hooks, context)
- ✅ Responsive, RTL-first UI
- ⏳ Ready for Supabase migration
- ⏳ Scalable data model (ERD-designed)

The application prioritizes **developer experience** (DX) and **user experience** (UX) while maintaining a clear path to production-ready features.
