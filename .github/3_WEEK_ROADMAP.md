# 🗓️ 3-Week Master Development Roadmap: Ta3 (تعلّم)

> **Owner**: POAI & Ta3 Agent Team (Fai, BAI, ROAI, SAI, QAI, GAI)  
> **Daily Velocity Target**: **12–15 GitHub activities per day** (Commits, Issues, PRs, Merges, Audits, Ledger Updates)  
> **Location**: `.github/3_WEEK_ROADMAP.md`

---

## 🎯 Strategic Overview

| Phase | Duration | Core Focus | Backend & AI State |
| :--- | :--- | :--- | :--- |
| **Sprint 1: Mockup MVP** | Week 1 (Days 1–5) | 100% Operational Local MVP, UI/UX Overhaul, Persistent Local Mock Engines | Pure Frontend + Local Storage Persistence Engine |
| **Sprint 2: Supabase Engine** | Week 2 (Days 6–10) | PostgreSQL Schemas, Supabase Auth, File Storage Buckets, Real-Time APIs, RLS | PostgreSQL + Supabase Auth & Storage |
| **Sprint 3: AI Engine & Launch** | Week 3 (Days 11–15) | `ai-service/` LLM Adapters, MDX Content Engine, Auto-Quiz Generator, Dockerization | Full AI Services + Production Build |

---

## 📊 Daily Activity Commitment (12–15 Activities / Day)

Each working day consists of structured contributions from the agent team:
- **POAI**: Issue creation & acceptance sign-offs (2 activities)
- **Fai / BAI / ROAI**: Feature commits & PR creation (6–8 activities)
- **SAI / QAI**: Security audits, test commits, PR approvals (3–4 activities)
- **GAI**: PR merge execution, main branch syncs, ledger logging (2–3 activities)

---

## 🏃 SPRINT 1: MOCKUP-FIRST 100% OPERATIONAL MVP (WEEK 1)

### Day 1: Architecture & Reusable Engine Setup
- 🎯 `POAI`: Create & label Issues #12–#16 for Sprint 1 Mock Engines. (Activity 1–2)
- 🎨 `Fai`: Create feature branch `feature/fai-mock-engines`. Implement `MockAuthEngine.ts` with `localStorage` session persistence. (Activity 3–4)
- 🎨 `Fai`: Implement `MockDataEngine.ts` supporting local CRUD operations for courses, lectures, announcements, and assignments. (Activity 5–6)
- 🎨 `Fai`: Push commits and open PR for Mock Engines. (Activity 7–8)
- 🧪 `QAI`: Add Vitest unit tests for `MockDataEngine` persistence. (Activity 9–10)
- 🛡️ `SAI`: Audit mock auth storage security & sanitization. (Activity 11–12)
- 🔀 `GAI`: Resolve PR, execute merge to `main`, and update release ledger. (Activity 13–14)

### Day 2: Student Dashboard & Course Navigation Overhaul
- 🎯 `POAI`: Create Issues #17–#21 for Student UI Polish. (Activity 1–2)
- 🎨 `Fai`: Redesign `StudentDashboard.tsx` with enhanced metrics cards, progress rings, and animated greeting. (Activity 3–4)
- 🎨 `Fai`: Refactor `CourseCard.tsx` with dynamic badge colors, teacher avatar, and hover micro-animations. (Activity 5–6)
- 🎨 `Fai`: Update global announcement ticker sidebar with read/unread persistence. (Activity 7–8)
- 🧪 `QAI`: Write Playwright E2E test `student-dashboard.spec.ts`. (Activity 9–10)
- 🛡️ `SAI`: Verify student route guards in `RequireAuth.tsx`. (Activity 11–12)
- 🔀 `GAI`: Merge PR `feature/fai-student-ui` to `main`, log commit hash in GAI ledger. (Activity 13–14)

### Day 3: Unified Course Center & Material Viewer
- 🎯 `POAI`: Create Issues #22–#26 for Course Center & Materials. (Activity 1–2)
- 🎨 `Fai`: Overhaul `Courses.tsx` tabbed layout (Overview, Lectures, Assignments, Discussions, Timeline). (Activity 3–4)
- 🎨 `Fai`: Build interactive `MaterialViewerModal.tsx` supporting mock PDF previewer, Video player card, and Document viewer. (Activity 5–6)
- 🎨 `Fai`: Implement lecture filter & search bar in `LecturesList.tsx`. (Activity 7–8)
- 🧪 `QAI`: Execute Playwright visual regression test on RTL layout. (Activity 9–10)
- 🛡️ `SAI`: Review material link XSS prevention. (Activity 11–12)
- 🔀 `GAI`: Merge PR `feature/fai-course-center` to `main` and tag release `v0.1.3`. (Activity 13–14)

### Day 4: Interactive Student Submissions & Discussion Board
- 🎯 `POAI`: Create Issues #27–#31 for Submissions & Discussion. (Activity 1–2)
- 🎨 `Fai`: Build `AssignmentSubmissionModal.tsx` drag-and-drop file mock dropzone with notes field. (Activity 3–4)
- 🎨 `Fai`: Develop interactive `Discussion.tsx` with thread creation, nested reply comments, and upvoting. (Activity 5–6)
- 🎨 `Fai`: Connect submissions & discussions to `MockDataEngine` for instant reload persistence. (Activity 7–8)
- 🧪 `QAI`: Add Playwright test `discussion-flow.spec.ts`. (Activity 9–10)
- 🛡️ `SAI`: Verify discussion input sanitization. (Activity 11–12)
- 🔀 `GAI`: Merge PR `feature/fai-submissions` to `main` and sync branch. (Activity 13–14)

### Day 5: Teacher Dashboard, Course Builder & Grading Hub
- 🎯 `POAI`: Create Issues #32–#36 for Teacher & Admin Hub. (Activity 1–2)
- 🎨 `Fai`: Redesign `TeacherDashboard.tsx` with course quick stats and active student counters. (Activity 3–4)
- 🎨 `Fai`: Enhance `NewCourseModal` and `AddLectureModal` with rich multi-field form validation. (Activity 5–6)
- 🎨 `Fai`: Build `TeacherGradingModal.tsx` allowing teachers to review student submissions, enter grades, and provide feedback. (Activity 7–8)
- 🧪 `QAI`: Run full E2E test suite across Student and Teacher flows. (Activity 9–10)
- 🎯 `POAI`: Sign off on Sprint 1 DoD (100% Mockup MVP Complete). (Activity 11–12)
- 🔀 `GAI`: Cut Sprint 1 Release tag `v0.2.0-mvp`, log ledger entries for all agents. (Activity 13–15)

---

## ⚙️ SPRINT 2: SUPABASE & POSTGRESQL BACKEND INTEGRATION (WEEK 2)

### Day 6: PostgreSQL Schema & Supabase Client Setup
- 🎯 `POAI`: Open Sprint 2 Backlog Issues #37–#41. (Activity 1–2)
- ⚙️ `BAI`: Write SQL migration script `001_initial_schema.sql` (Users, Courses, Enrollment, Lectures, Materials, Assignments, Submissions). (Activity 3–4)
- ⚙️ `BAI`: Seed initial PostgreSQL database with structured Arabic dummy data (`002_seed_data.sql`). (Activity 5–6)
- ⚙️ `BAI`: Create `src/lib/supabase.ts` singleton client. (Activity 7–8)
- 🛡️ `SAI`: Review database schema foreign key constraints & indexing. (Activity 9–10)
- 🧪 `QAI`: Verify database container setup. (Activity 11–12)
- 🔀 `GAI`: Merge `feature/bai-supabase-schema` to `main`. (Activity 13–14)

### Day 7: Supabase Authentication & Role JWT Integration
- 🎯 `POAI`: Issue assignment for Auth migration. (Activity 1–2)
- ⚙️ `BAI`: Integrate Supabase Auth JS SDK inside `AuthContext.tsx`. (Activity 3–4)
- ⚙️ `BAI`: Implement login, registration, and session token auto-refresh logic. (Activity 5–6)
- 🛡️ `SAI`: Write `003_rls_policies.sql` enforcing Row-Level Security across all tables. (Activity 7–8)
- 🛡️ `SAI`: Test JWT role claim isolation (`student` vs `teacher` vs `admin`). (Activity 9–10)
- 🧪 `QAI`: Update Playwright auth smoke test for real Supabase session tokens. (Activity 11–12)
- 🔀 `GAI`: Merge `feature/bai-supabase-auth` to `main`. (Activity 13–14)

### Day 8: Supabase Storage Buckets & Real File Uploads
- 🎯 `POAI`: Create Storage integration issues. (Activity 1–2)
- ⚙️ `BAI`: Provision `course-materials` and `assignment-submissions` public/private buckets. (Activity 3–4)
- 🎨 `Fai`: Replace mock dropzone with real `supabase.storage.upload()` progress handling. (Activity 5–6)
- 🎨 `Fai`: Add secure file download URL generator in `MaterialViewerModal.tsx`. (Activity 7–8)
- 🛡️ `SAI`: Configure storage bucket RLS policies restricting student write permissions. (Activity 9–10)
- 🧪 `QAI`: E2E file upload/download verification test. (Activity 11–12)
- 🔀 `GAI`: Merge `feature/fai-supabase-storage` to `main`. (Activity 13–14)

### Day 9: Live Discussion Threads & Supabase Realtime
- 🎯 `POAI`: Open Realtime feature issues. (Activity 1–2)
- ⚙️ `BAI`: Enable Supabase Realtime subscriptions on `discussions` and `announcements` tables. (Activity 3–4)
- 🎨 `Fai`: Connect `Discussion.tsx` to `useSupabaseSubscription` hook for live message updates. (Activity 5–6)
- 🎨 `Fai`: Implement live unread notification counter in `TopBar.tsx`. (Activity 7–8)
- 🧪 `QAI`: Playwright multi-browser test simulating 2 simultaneous users chatting. (Activity 9–10)
- 🛡️ `SAI`: Audit WebSocket payload authorization. (Activity 11–12)
- 🔀 `GAI`: Merge `feature/fai-realtime` to `main`. (Activity 13–14)

### Day 10: Backend Hardening & Sprint 2 DoD Sign-off
- 🎯 `POAI`: Sprint 2 Review & QA Gate audit. (Activity 1–2)
- ⚙️ `BAI`: Add database indexing on `course_id` and `user_id` query filters. (Activity 3–4)
- 🛡️ `SAI`: Execute OWASP security scan on REST API endpoints. (Activity 5–6)
- 🧪 `QAI`: Run full automated E2E test suite (100% pass rate requirement). (Activity 7–8)
- 🎯 `POAI`: Validate backend feature parity against initial mock engines. (Activity 9–10)
- 🔀 `GAI`: Tag release `v0.3.0-backend` and log team updates in `.agents/learning/`. (Activity 11–15)

---

## 🤖 SPRINT 3: AI ENGINE & PRODUCTION LAUNCH (WEEK 3)

### Day 11: AI Adapter & LLM Provider Pipeline (`ai-service/`)
- 🎯 `POAI`: Open Sprint 3 AI feature backlog. (Activity 1–2)
- 🤖 `ROAI`: Implement LLM Adapter architecture supporting OpenAI / Gemini / Ollama fallbacks in `ai-service/`. (Activity 3–4)
- 🤖 `ROAI`: Build prompt templates for Arabic course text simplification and key takeaways. (Activity 5–6)
- ⚙️ `BAI`: Create API endpoint `/api/ai/explain` with rate-limiting. (Activity 7–8)
- 🛡️ `SAI`: Validate prompt injection protection guardrails. (Activity 9–10)
- 🧪 `QAI`: Write mock LLM response unit tests. (Activity 11–12)
- 🔀 `GAI`: Merge `feature/roai-llm-adapter` to `main`. (Activity 13–14)

### Day 12: MDX Content Renderer & Interactive AI Explanation Block
- 🎯 `POAI`: Create MDX component UI issues. (Activity 1–2)
- 🎨 `Fai`: Build `AIExplanationBlock.tsx` inside lecture view for multi-level Arabic explanations (Beginner / Intermediate / Advanced). (Activity 3–4)
- 🎨 `Fai`: Integrate MDX parser with custom syntax highlighting for code blocks and math rendering. (Activity 5–6)
- 🤖 `ROAI`: Connect explanation trigger to backend `/api/ai/explain`. (Activity 7–8)
- 🧪 `QAI`: E2E test AI explanation UI rendering. (Activity 9–10)
- 🛡️ `SAI`: Audit client-side MDX code execution security. (Activity 11–12)
- 🔀 `GAI`: Merge `feature/fai-ai-mdx` to `main`. (Activity 13–14)

### Day 13: Auto-Quiz Engine & Student Assessment Generator
- 🎯 `POAI`: Create Auto-Quiz feature issues. (Activity 1–2)
- 🤖 `ROAI`: Develop `quizGenerator.ts` engine converting lecture text into multiple-choice Arabic quizzes. (Activity 3–4)
- 🎨 `Fai`: Build `InteractiveQuizWidget.tsx` with instant answer checking, score breakdown, and explanation tooltips. (Activity 5–6)
- ⚙️ `BAI`: Save quiz scores to `student_quiz_results` PostgreSQL table. (Activity 7–8)
- 🧪 `QAI`: Validate quiz score calculation accuracy via Vitest. (Activity 9–10)
- 🛡️ `SAI`: Verify student quiz answer submission tamper-resistance. (Activity 11–12)
- 🔀 `GAI`: Merge `feature/roai-quiz-engine` to `main`. (Activity 13–14)

### Day 14: Docker Containerization & System Hardening
- 🎯 `POAI`: Create DevOps & Production readiness issues. (Activity 1–2)
- ⚙️ `BAI`: Write multi-stage production `Dockerfile` for React Vite app and `ai-service/`. (Activity 3–4)
- ⚙️ `BAI`: Configure `docker-compose.yml` linking Frontend, PostgreSQL, Supabase, and AI Service. (Activity 5–6)
- 🛡️ `SAI`: Perform final container vulnerability audit & non-root user enforcement. (Activity 7–8)
- 🧪 `QAI`: Execute full E2E pipeline check against Docker containers. (Activity 9–10)
- 🔀 `GAI`: Merge `feature/bai-docker` to `main`. (Activity 11–14)

### Day 15: Final Release Sign-off, Audit & Launch
- 🎯 `POAI`: Final Product DoD Sign-off & Release Approval. (Activity 1–2)
- 🧪 `QAI`: Complete full regression run & generate test report. (Activity 3–4)
- 🛡️ `SAI`: Final zero-vulnerability security sign-off. (Activity 5–6)
- 🔀 `GAI`: Tag final production release `v1.0.0-release` and push to `main`. (Activity 7–8)
- 👥 `All Agents`: Update individual agent learning ledgers in `.agents/learning/*/`. (Activity 9–15)

---

## 📌 Summary Target Metrics

- **Total Duration**: 3 Weeks (15 Working Days)
- **Total Estimated GitHub Activities**: **180–225 total agent activities** (~12–15/day)
- **Final Deliverable**: Production-ready, Arabic-first, AI-enhanced **Ta3 (تعلّم) LMS** running in Docker with full Supabase integration.
