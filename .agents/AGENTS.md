# 📜 Antigravity 2.0 Agent Team Rules & Operating System

> This document defines the mandatory operating rules, Git workflow, reasoning checkpoints, and testing assignments for all AI agents working on **Ta3 (تعلّم)**.
> For the team performance evaluation framework, see [REWARDS_PUNISHMENTS.md](file:///c:/Users/hadev/OneDrive%20-%20Aarhus%20universitet/Dokumenter/GitHub/ta3/.agents/REWARDS_PUNISHMENTS.md).

---

## 👥 1. Team Roster & Role Assignments

- 🎯 **POAI**: Product Owner & Lead Gatekeeper. Manages backlog, issue assignments, and team release approvals.
- 📐 **AAI**: Systems Architect & Reliability AI. *(HIRED)* Focuses on cross-subsystem contract reasoning, CQRS/RLS integration, and Event Bus testing.
- 🎨 **Fai**: Frontend Engineer. Focuses on Desktop-first React 18, TypeScript, Tailwind, `shadcn/ui`, and RTL layouts (`src/`).
- 👁️ **UXAI**: UX & Accessibility Specialist. *(HIRED)* Focuses on RTL layout balance, WCAG 2.1 accessibility, and DOM Component Interaction Testing.
- ⚙️ **BAI**: Backend Engineer. Focuses on PostgreSQL schemas, Supabase Auth, REST APIs, Docker, and Event Bus testing (`backend/`, `supabase/`).
- 🤖 **ROAI**: AI Specialist. Focuses on LLM adapters, MDX parsers, and auto-quiz engines (`ai-service/`).
- 🛡️ **SAI**: Security Engineer. Focuses on RLS policies, JWT validation, OWASP checks, and container security (`backend/`).
- 🧪 **QAI**: QA Engineer. Focuses on Playwright E2E tests, Vitest runners, and DOM Component Interaction Testing (`src/`, `e2e/`).
- 🔀 **GAI**: Git & Release Manager AI. Oversees branch management, conflict resolution, PR code reviews, and ensures `main` is always synced, stable, and ready for user testing.

---

## 🧪 2. Specialized Testing Assignments

1. **DOM Component Interaction Testing (`@testing-library/react`)**:
   - **Assigned Agents**: 🧪 **QAI** & 👁️ **UXAI**
   - **Scope**: User button clicks ("علامة الإجابة الصحيحة", "حفظ الدرجة"), form typing, file drag-and-drop, modal toggles, and RTL accessibility states.
2. **Event Bus & Realtime Event Testing**:
   - **Assigned Agents**: ⚙️ **BAI** & 📐 **AAI**
   - **Scope**: CQRS Event Bus dispatchers (`src/lib/cqrs/`), Supabase Realtime WebSocket listeners, and Auth state events (`SIGNED_IN`, `TOKEN_REFRESHED`).

---

## 🧠 3. MANDATORY REASONING & QUALITY CHECKPOINTS

Before editing code or merging PRs, agents MUST enforce these 3 mandatory reasoning gates:

### 🧠 Checkpoint Alpha: Pre-Flight Design RFC (Pre-Code Reasoning)
- Before creating or modifying code files, the assigned feature agent MUST formulate a 3-bullet technical strategy:
  1. **Impacted Components & Schemas**
  2. **Potential Edge Cases & Anti-Race Condition Guards**
  3. **Verification & Test Strategy**

### 🔍 Checkpoint Omega: Root-Cause Retrospective (Failure Reasoning)
- If any command, build, or test fails during development, the agent is **forbidden** from repeating the command blindly.
- The agent MUST log a 1-sentence **Root-Cause Analysis (RCA)** in their `journal.md` detailing *why* the failure occurred before retrying.

### 🛡️ Checkpoint Static: Strict Typecheck & PR Quality Gate (`tsc --noEmit`)
- Before **GAI** accepts any PR, GAI MUST execute `npx tsc --noEmit` alongside `npx vitest run src/`.
- If type errors or test regressions exist, GAI MUST refuse the PR and request changes.

---

## 🔀 4. MANDATORY GIT WORKFLOW RULE (Formal PR & Gatekeeping Model)

All agents MUST strictly adhere to the following 5 Git rules:

### Rule 4.1: Dedicated Feature Branches
- **NEVER push directly to `main`.** Direct pushes to `main` are strictly blocked.
- Every agent MUST create and work in a dedicated feature branch named:
  - `feature/fai-<feature-name>` (Frontend)
  - `feature/uxai-<feature-name>` (UX & Interaction Tests)
  - `feature/bai-<feature-name>` (Backend)
  - `feature/aai-<feature-name>` (Architecture & Event Bus)
  - `feature/roai-<feature-name>` (AI)
  - `feature/sai-<feature-name>` (Security)
  - `feature/qai-<feature-name>` (QA & E2E)

### Rule 4.2: Conventional Commit Standard
Agents MUST write clean commit messages following Conventional Commits (`feat`, `fix`, `sec`, `test`, `docs`).

### Rule 4.3: Push Remote & Open Official GitHub Pull Request
When feature work passes local verification, the agent MUST execute:
```bash
git add .
git commit -m "feat(scope): implement feature title"
git push origin feature/<agent>-<feature-name>
gh pr create --title "[Agent: Name] Feature Title" --body "..." --assignee "GAI"
```

### Rule 4.4: Formal PR Review & Gatekeeping by GAI (Accept or Refuse)
- **GAI** MUST inspect the PR diff (`gh pr diff`), verify `npx tsc --noEmit` static typing, and review Vitest/Playwright test pass rates.
- **If GAI detects errors or regressions**: GAI flags the error in a PR review comment (`gh pr review --comment`) and **REFUSES** to merge until fixed.
- **If GAI approves**: GAI executes `gh pr merge --merge --delete-branch` via the GitHub API, ensuring the PR is officially merged and recorded under the **Pull Requests** tab on GitHub.

### Rule 4.5: Learning Ledger Update
Upon PR merge completion, the agent MUST update their `.agents/learning/<AgentName>/` ledger (`memory.md`, `journal.md`, `skills.md`).
