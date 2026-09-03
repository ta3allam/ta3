# 🗂️ Master Issues & Milestone Schedule: Ta3 (تعلّم) LMS

> **Management Protocol**: Aligned with [.github/3_WEEK_ROADMAP.md](file:///c:/Users/hadev/OneDrive%20-%20Aarhus%20universitet/Dokumenter/GitHub/ta3/.github/3_WEEK_ROADMAP.md).
> All tasks have explicit status and agent assignments.
> **Documentation Lead**: 🎯 **POAI**

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

## 🚀 Sprint 2 Resiliency, CQRS & Concurrency Capstone (Days 10–13)

| Issue # | Title | Assigned Agent | Status |
| :--- | :--- | :--- | :---: |
| **#7 & #69–#73** | Multi-Stage Dockerfile, Nginx SPA Server, docker-compose & CQRS Bus | ⚙️ `BAI` | ✅ Closed (Day 10) |
| **#79–#83** | Idempotency Key Manager, Optimistic UI Rollbacks & Interaction Test Suite | ⚙️ `BAI` / 👁️ `UXAI` | ✅ Closed (Day 11) |
| **#85–#88** | Optimistic Concurrency Control (OCC), List Virtualization & Concurrency Tests | ⚙️ `BAI` / 🎨 `Fai` / 📐 `AAI` | ✅ Closed (Day 12) |
| **#90–#94** | E2E Concurrency Stress Test Suite, Quality Gate & Release Tag `v2.0-beta` | 🧪 `QAI` / 🔀 `GAI` | ✅ Released (`v2.0-beta`) |

---

## 🌐 Sprint 3: Production Cloud Readiness & Master Release (Days 14–15)

| Issue # | Title | Assigned Agent | Status |
| :--- | :--- | :--- | :---: |
| **#95–#98** | Production Nginx OWASP Hardening, Kubernetes K8s Manifests & Load Benchmark | ⚙️ `BAI` / 🛡️ `SAI` / 📐 `AAI` | ✅ Closed (Day 14) |
| **#100–#104** | Final Production Security Sign-off, 6 UI Audit Enhancements & Release Tag `v2.0.0` | 🎯 `POAI` / 🔀 `GAI` | 🎉 Released (`v2.0.0`) |

---

## 🛒 Sprint 4: Creator Marketplace & Commerce Engine (Days 16–20)

| Issue # | Title | Assigned Agent | Status |
| :--- | :--- | :--- | :---: |
| **#105–#108** | Creator Profile Storefront Card & Creator Analytics Dashboard (`CreatorDashboard.tsx`) | 🎨 `Fai` / 🎯 `POAI` | ✅ Closed (Day 16) |
| **#110–#113** | Course Monetization Engine (Free, Paid One-Time, Subscription, Cohorts) | ⚙️ `BAI` / 📐 `AAI` | ✅ Closed (Day 17) |
| **#114–#117** | Arabic Course Marketplace UI (`Marketplace.tsx`) & Student Checkout | 🎨 `Fai` / 👁️ `UXAI` | ✅ Closed (Day 18) |
| **#120–#123** | Creator Revenue & Payout Engine (`CreatorPayouts.tsx`, 10-15% Ta3 Fee) | ⚙️ `BAI` / 🛡️ `SAI` | ✅ Closed (Day 19) |
| **#125–#129** | Master Marketplace E2E Test Suite, Quality Gate & Release Tag `v3.0-marketplace` | 🧪 `QAI` / 🔀 `GAI` | 🎉 Released (`v3.0-marketplace`) |

---

## 💬 Sprint 5: Skool Creator Communities & Levant 5 Pillars (Days 21–25)

| Issue # | Title | Assigned Agent | Status |
| :--- | :--- | :--- | :---: |
| **#130–#133** | Creator Community Feeds & Discussion Posts (`CommunityFeed.tsx`) | 🎨 `Fai` / 👁️ `UXAI` | 📋 Scheduled (Day 21) |
| **#134–#137** | Offline-First PWA & IndexedDB Engine (Service Worker `sw.js` & Fonts) | ⚙️ `BAI` / 📐 `AAI` | 📋 Scheduled (Day 22) |
| **#138–#141** | TUS Resumable 512KB Chunked Upload Protocol on 3G (`resumableUpload.ts`) | ⚙️ `BAI` / 🛡️ `SAI` | 📋 Scheduled (Day 23) |
| **#142–#145** | Redis Read Caching & PgBouncer Connection Pooling (`redisCache.ts`) | ⚙️ `BAI` / 📐 `AAI` | 📋 Scheduled (Day 24) |
| **#146–#149** | BullMQ Async Worker Queue for 11:59 PM Spikes & Release Tag `v3.5-community` | 🧪 `QAI` / 🔀 `GAI` | 📋 Scheduled (Day 25) |
