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

| Issue # | Title | Assigned Agent | Status | Daily Target | Labels |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **#12** | Implement `MockAuthEngine.ts` with `localStorage` Session Persistence | 🎨 `Fai` | 📋 Backlog | Day 1 | `frontend`, `auth` |
| **#13** | Implement `MockDataEngine.ts` Local Storage Store & Reactive Emitter | 🎨 `Fai` | 📋 Backlog | Day 1 | `frontend`, `state` |
| **#14** | Add Vitest Unit Tests for `MockDataEngine` Persistence | 🧪 `QAI` | 📋 Backlog | Day 1 | `qa`, `testing` |
| **#15** | Audit Mock Auth Local Storage Sanitization & XSS | 🛡️ `SAI` | 📋 Backlog | Day 1 | `security`, `audit` |
| **#16** | Merge PR `feature/fai-mock-engines` to `main` & Tag Release | 🔀 `GAI` | 📋 Backlog | Day 1 | `release`, `git` |
| **#17** | Redesign `StudentDashboard.tsx` (Progress Rings & Metrics Feed) | 🎨 `Fai` | 📋 Backlog | Day 2 | `frontend`, `student` |
| **#18** | Refactor `CourseCard.tsx` (Dynamic Badges & Micro-Animations) | 🎨 `Fai` | 📋 Backlog | Day 2 | `frontend`, `ui` |
| **#19** | Build Global Announcement Ticker Sidebar with Read/Unread state | 🎨 `Fai` | 📋 Backlog | Day 2 | `frontend`, `announcements` |
| **#20** | Add Playwright E2E Test `student-dashboard.spec.ts` | 🧪 `QAI` | 📋 Backlog | Day 2 | `qa`, `e2e` |
| **#21** | Verify Student Route Protection in `RequireAuth.tsx` | 🛡️ `SAI` | 📋 Backlog | Day 2 | `security`, `routes` |

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
