# 🗂️ Master Issues & Milestone Schedule: Ta3 (تعلّم) LMS

> **Management Protocol**: Aligned with [.github/3_WEEK_ROADMAP.md](file:///c:/Users/hadev/OneDrive%20-%20Aarhus%20universitet/Dokumenter/GitHub/ta3/.github/3_WEEK_ROADMAP.md).
> All tasks have explicit status and agent assignments.

---

## 🏃 Sprint 1: Frontend Baseline & Core LMS Architecture (Days 1–5)

| Issue # | Title | Assigned Agent | Status |
| :--- | :--- | :--- | :---: |
| **#12** | Implement `MockAuthEngine.ts` Session Persistence | 🎨 `Fai` | ✅ Closed |
| **#13** | Implement `MockDataEngine.ts` Local Storage Store | 🎨 `Fai` | ✅ Closed |
| **#14** | Vitest Unit Tests for `MockDataEngine` Persistence | 🧪 `QAI` | ✅ Closed |
| **#15** | Audit Mock Auth Storage Security & Sanitization | 🛡️ `SAI` | ✅ Closed |
| **#16** | Merge PR `feature/fai-mock-engines` to `main` | 🔀 `GAI` | ✅ Closed |
| **#17** | Redesign `StudentDashboard.tsx` (Metrics & Progress) | 🎨 `Fai` | ✅ Closed |
| **#18** | Add Playwright Test `student-dashboard.spec.ts` | 🧪 `QAI` | ✅ Closed |
| **#19** | Merge PR `feature/fai-student-ui` to `main` | 🔀 `GAI` | ✅ Closed |
| **#20** | Overhaul `Courses.tsx` Unified Course Center Layout | 🎨 `Fai` | ✅ Closed |
| **#21** | Build Interactive `MaterialViewerModal.tsx` Previews | 🎨 `Fai` | ✅ Closed |
| **#22** | Add Search & Category Filter Bar to `LecturesList` | 🎨 `Fai` | ✅ Closed |
| **#23** | Execute Playwright Test `course-center.spec.ts` | 🧪 `QAI` | ✅ Closed |
| **#24** | Audit Material Link XSS & URL Sanitization | 🛡️ `SAI` | ✅ Closed |
| **#25** | Merge PR `feature/fai-course-center` to `main` | 🔀 `GAI` | ✅ Closed |
| **#26** | Interactive Student Submissions Dropzone UI | 🎨 `Fai` | ✅ Closed |
| **#27** | Add Course Background Schema & `CourseCard` Support | 🎨 `Fai` | ✅ Closed |
| **#28** | Restrict Uploads to PDF/ZIP with Standard Digits | 🎨 `Fai` | ✅ Closed |
| **#29** | Overhaul Teacher `GradingConsole` & Feedback Form | 🎨 `Fai` | ✅ Closed |
| **#30** | Build Interactive `Discussion.tsx` Forum Page | 🎨 `Fai` | ✅ Closed |
| **#31** | Vitest & Playwright Test Suites for PDF/ZIP Uploads | 🧪 `QAI` | ✅ Closed |
| **#32** | Merge PR `feature/fai-assignments-submissions` | 🔀 `GAI` | ✅ Closed |
| **#33** | Fix Assignment UI Overlap & Late Submission Block | 🎨 `Fai` | ✅ Closed |
| **#34** | Enforce PDF Required + ZIP Optional Uploads | 🎨 `Fai` | ✅ Closed |
| **#35** | Route Discussions via Sidebar & Admin Course Creation | 🎨 `Fai` | ✅ Closed |
| **#36** | Student Timeline & Global Calendar Modal | 🎨 `Fai` | ✅ Closed |
| **#37** | Student Study Groups (`Groups.tsx`) Enhancements | 🎨 `Fai` | ✅ Closed |
| **#47–#51** | Teacher/Student CRUD UI Triggers (Edit/Delete) | 🎨 `Fai` | ✅ Closed |

---

## ⚙️ Sprint 2: Database, Auth, Storage & Real-time Q&A (Days 6–9)

| Issue # | Title | Assigned Agent | Status |
| :--- | :--- | :--- | :---: |
| **#41–#46** | PostgreSQL Schema Migration (`001_initial_schema.sql`) & Seed Data | ⚙️ `BAI` | ✅ Closed |
| **#52–#56** | Supabase Auth SDK (`AuthContext.tsx`) & RLS Policies (`003_rls_policies.sql`) | ⚙️ `BAI` / 🛡️ `SAI` | ✅ Closed |
| **#57–#62** | Supabase Storage Buckets (`005_storage_buckets.sql`) & Real File Uploads | ⚙️ `BAI` | ✅ Closed |
| **#63–#68** | Supabase Realtime WebSockets (`src/lib/discussions.ts`) & Solution Marking | 🎨 `Fai` / ⚙️ `BAI` | ✅ Closed |

---

## 🚀 Next Milestone: Resilient CQRS, Concurrency & Dockerization (Days 10–13)

| Issue # | Title | Assigned Agent | Status |
| :--- | :--- | :--- | :---: |
| **#7** | Docker Multi-Stage Build & Production Nginx Setup | ⚙️ `BAI` | ✅ Closed (Day 10) |
| **#69** | CQRS Read/Write Separation Engine (`src/lib/cqrs/`) | ⚙️ `BAI` | ✅ Closed (Day 10) |
| **#70** | Idempotency Key Manager (`src/lib/idempotency.ts`) | 🛡️ `SAI` / ⚙️ `BAI` | ✅ Closed (Day 11) |
| **#71** | Optimistic UI Updates & Rollback Error Handler | 🎨 `Fai` / 👁️ `UXAI` | ✅ Closed (Day 11) |
| **#74** | CQRS Command Bus Idempotency Integration | 📐 `AAI` / ⚙️ `BAI` | ✅ Closed (Day 11) |
| **#75** | Vitest & React Interaction Test Suite for Resiliency | 🧪 `QAI` | ✅ Closed (Day 11) |
| **#72** | Optimistic Concurrency Control (OCC Locking) | ⚙️ `BAI` | 📋 Scheduled (Day 12) |
| **#73** | High-Concurrency Virtualization & Performance Tuning | 🎨 `Fai` | 📋 Scheduled (Day 12) |
| **#6** | Playwright Concurrency Stress Testing & Tag v2.0-beta | 🧪 `QAI` | 📋 Scheduled (Day 13) |
