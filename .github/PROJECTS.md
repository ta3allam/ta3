# 🗂️ GitHub Projects & Issues Tracker: Ta3 LMS

This document serves as our project management tracker aligned with GitHub Projects & GitHub Issues.

## 📌 Project Board Columns
- 📋 **Backlog**: Planned features and user stories.
- 🚧 **In Progress**: Tasks assigned to agents in active sprint.
- 🔍 **In Review**: Code written, pending QA & Security audit.
- ✅ **Done**: Passed DoD, merged, and verified.

---

## 🏃 Sprint 1 Active Board

| Issue # | Title | Assigned Agent | Status | Priority | Labels |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **#101** | Replace Mock Auth with Supabase JS Client | 🎨 `Fai` | 🚧 In Progress | P0 | `frontend`, `auth` |
| **#102** | Write Initial SQL Schema Migration (`001_initial_schema.sql`) | ⚙️ `BAI` | 🚧 In Progress | P0 | `backend`, `database` |
| **#103** | Create AI Provider Adapter (`provider.ts`) with Fallback | 🤖 `ROAI` | 🚧 In Progress | P1 | `ai`, `llm` |
| **#104** | Audit & Implement Supabase RLS Policies (`002_rls.sql`) | 🛡️ `SAI` | 🚧 In Progress | P0 | `security`, `rls` |
| **#105** | Setup Playwright E2E Runner & Auth Smoke Test | 🧪 `QAI` | 🚧 In Progress | P0 | `qa`, `testing` |
| **#106** | Docker Compose Architecture (`docker-compose.yml`) | ⚙️ `BAI` | 📋 Backlog | P1 | `devops`, `docker` |
| **#107** | Student Assignment Submission Dropzone UI | 🎨 `Fai` | 📋 Backlog | P0 | `frontend`, `assignments` |

---

## 🔄 GitHub CLI & Projects Integration Sync Commands
When `gh` CLI or GitHub Personal Access Token (PAT) is configured:
```bash
# Create Issue
gh issue create --title "Title" --body "Description" --assignee "agent-handle" --label "frontend"

# Sync Project Board Status
gh project item-edit --id <ITEM_ID> --field-id <STATUS_FIELD_ID> --single-select-option-id <OPTION_ID>
```
