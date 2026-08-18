# 🗓️ 3-Week Master Development Roadmap: Ta3 (تعلّم)

> **Documentation Lead**: 🎯 **POAI (Product Owner AI)** — Responsible for maintaining all `.md` specifications in `.github/` whenever architectural or sprint changes occur.
> **Daily Velocity Target**: **12–15 GitHub activities per day** (Commits, Issues, PRs, Merges, Audits, Ledger Updates)  
> **Location**: `.github/3_WEEK_ROADMAP.md`

---

## 🎯 Strategic Overview

| Phase | Duration | Core Focus | Backend & System State |
| :--- | :--- | :--- | :--- |
| **Sprint 1: Mockup MVP** | Days 1–5 | 100% Operational Local MVP, UI/UX Overhaul, Dynamic Course Assets, Group Approvals | Pure Frontend + Local Storage Engine |
| **Sprint 2 Core: Database & Storage** | Days 6–9 | PostgreSQL Schemas, Supabase Auth SDK, File Storage Buckets, Realtime WebSockets | PostgreSQL + Supabase Auth, Storage & Realtime |
| **Sprint 2 Resiliency & CQRS** | Days 10–13 | Multi-Stage Docker, Nginx SPA Server, CQRS Engine, Idempotency, OCC Locking, Virtualization | Production Docker + CQRS Bus + Concurrency Guards |
| **Sprint 3: Release & Public Cloud** | Days 14–15 | Production Cloud Deployment, Performance Tuning, Security Audits, Release `v2.0-beta` | Production Container Cluster |

---

## 🏃 Master Sprint Schedule

### ✅ **Sprint 1 (Days 1–5): Foundation & Role-Based UI Architecture**
- **Day 1**: Mock Auth & Data Persistence (`MockAuthEngine.ts`, `MockDataEngine.ts`).
- **Day 2**: Student Dashboard redesign & KPI progress metrics (`StudentDashboard.tsx`).
- **Day 3**: Unified Course Center (`Courses.tsx`), Lecture search filter, and `MaterialViewerModal.tsx`.
- **Day 4**: PDF/ZIP Assignment Submission Dropzone and Teacher `GradingConsole.tsx`.
- **Day 5**: Student Timeline, Study Groups (`Groups.tsx`), Contact Teacher (`Contact.tsx`), Admin Course Builder, and dynamic asset path resolution (`getAssetUrl`).

### ✅ **Sprint 2 (Days 6–9): Supabase Auth, Cloud Storage & Realtime Q&A**
- **Day 6**: PostgreSQL relational schema migration (`001_initial_schema.sql`) and seed data (`002_seed_data.sql`).
- **Day 7**: Supabase Auth JS SDK (`AuthContext.tsx`), registration tab, dynamic role routing, and RLS policies (`003_rls_policies.sql`).
- **Day 8**: Supabase Storage Buckets (`005_storage_buckets.sql`, `storage.ts`) and real cloud file uploads in `AssignmentSubmissions.tsx`.
- **Day 9**: Supabase Realtime WebSockets (`discussions.ts`), solution marking ("علامة الإجابة الصحيحة"), and search/filter bar in `CourseDiscussions.tsx`.

### 🚀 **Sprint 2 Resiliency & Production Architecture (Days 10–13)**
- **Day 10 (Completed ✅)**: Multi-Stage `Dockerfile.frontend`, Nginx SPA server (`nginx.conf`), `docker-compose.yml`, and CQRS bus architecture (`src/lib/cqrs/`).
- **Day 11 (Completed ✅)**: Idempotency Key Manager (`src/lib/idempotency.ts`), CQRS idempotency injection, and Optimistic UI updates with atomic rollbacks (`useOptimisticAction.ts`).
- **Day 12 (Scheduled 📋)**: Optimistic Concurrency Control (OCC locking `version_id`) and high-concurrency UI virtualization.
- **Day 13 (Scheduled 📋)**: E2E Concurrency Stress Testing, zero-regression audit, and GitHub Release Tag `v2.0-beta`.
