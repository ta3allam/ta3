# 🗂️ GitHub Projects & Master Issues Tracker: Ta3 LMS

This document serves as our project management tracker aligned with GitHub Projects & GitHub Issues.
For the detailed day-by-day 3-week plan targeting **12–15 agent GitHub activities per day**, see [.github/3_WEEK_ROADMAP.md](file:///c:/Users/hadev/OneDrive%20-%20Aarhus%20universitet/Dokumenter/GitHub/ta3/.github/3_WEEK_ROADMAP.md).

---

## 📌 Project Board Status Columns
- 📋 **Backlog**: Planned features and user stories across Sprints 1, 2, and 3.
- 🚧 **In Progress**: Active day tasks assigned to agent personas.
- 🔍 **In Review**: Code written on agent feature branch, pending QAI E2E & SAI Security audit.
- ✅ **Done**: Passed DoD, merged to `main` by GAI, and verified.

---

## 🏃 Sprint 1 Active Master Board (Mockup MVP)

| Issue # | Title | Assigned Agent | Status | Daily Target |
| :--- | :--- | :--- | :--- | :--- |
| **#12** | Implement `MockAuthEngine.ts` with `localStorage` Session Persistence | 🎨 `Fai` | ✅ Done | Day 1 |
| **#13** | Implement `MockDataEngine.ts` Local Storage Store | 🎨 `Fai` | ✅ Done | Day 1 |
| **#14** | Add Vitest Unit Tests for `MockDataEngine` Persistence | 🧪 `QAI` | ✅ Done | Day 1 |
| **#15** | Audit Mock Auth Local Storage Sanitization & XSS | 🛡️ `SAI` | ✅ Done | Day 1 |
| **#16** | Merge PR `feature/fai-mock-engines` to `main` | 🔀 `GAI` | ✅ Done | Day 1 |
| **#17** | Redesign `StudentDashboard.tsx` (Progress Rings & Metrics Feed) | 🎨 `Fai` | ✅ Done | Day 2 |
| **#18** | Add Playwright E2E Test `student-dashboard.spec.ts` | 🧪 `QAI` | ✅ Done | Day 2 |
| **#19** | Merge PR `feature/fai-student-ui` to `main` | 🔀 `GAI` | ✅ Done | Day 2 |
| **#20** | Overhaul `Courses.tsx` Unified Course Center Tabbed Layout | 🎨 `Fai` | ✅ Done | Day 3 |
| **#21** | Build Interactive `MaterialViewerModal.tsx` (PDF/Video/Doc Previews) | 🎨 `Fai` | ✅ Done | Day 3 |
| **#22** | Add Search & Category Filter Bar to `LecturesList.tsx` | 🎨 `Fai` | ✅ Done | Day 3 |
| **#23** | Execute Playwright Visual & E2E Test `course-center.spec.ts` | 🧪 `QAI` | ✅ Done | Day 3 |
| **#24** | Audit Material Link XSS & URL Security Sanitization | 🛡️ `SAI` | ✅ Done | Day 3 |
| **#25** | Merge PR `feature/fai-course-center` to `main` | 🔀 `GAI` | ✅ Done | Day 3 |

---

## 🔄 GitHub CLI Commands for Team Automation
```bash
# View active roadmap
cat .github/3_WEEK_ROADMAP.md

# Create issue
gh issue create --title "[Sprint 1] Title" --body "Details..." --assignee "agent-name" --label "frontend"

# List issues
gh issue list --limit 30
```
