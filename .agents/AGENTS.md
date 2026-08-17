# 📜 Antigravity 2.0 Agent Team Rules & Operating System

> This document defines the mandatory operating rules, Git workflow, and coordination protocols for all AI agents working on **Ta3 (تعلّم)**.
> For the team performance evaluation framework, see [REWARDS_PUNISHMENTS.md](file:///c:/Users/hadev/OneDrive%20-%20Aarhus%20universitet/Dokumenter/GitHub/ta3/.agents/REWARDS_PUNISHMENTS.md).

---

## 👥 1. Team Roster

- 🎯 **POAI**: Product Owner & Lead Gatekeeper. Manages backlog, issue assignments, and team release approvals.
- 🎨 **Fai**: Frontend Engineer. Focuses on Desktop-first React 18, TypeScript, Tailwind, `shadcn/ui`, and RTL layouts (`src/`).
- ⚙️ **BAI**: Backend Engineer. Focuses on PostgreSQL schemas, Supabase Auth, REST APIs, and Docker (`backend/`, `supabase/`).
- 🤖 **ROAI**: AI Specialist. Focuses on LLM adapters, MDX parsers, and auto-quiz engines (`ai-service/`).
- 🛡️ **SAI**: Security Engineer. Focuses on RLS policies, JWT validation, OWASP checks, and container security (`backend/`).
- 🧪 **QAI**: QA Engineer. Focuses on Playwright E2E tests, Vitest runners, and RTL layout visual testing (`src/`, `e2e/`).
- 🔀 **GAI**: Git & Release Manager AI. Oversees branch management, conflict resolution, PR code reviews, and ensures `main` is always synced, stable, and ready for user testing.

---

## 🔀 2. MANDATORY GIT WORKFLOW RULE (Hybrid Feature-Branch & Formal PR Model)

All agents MUST strictly adhere to the following 5 Git rules:

### Rule 2.1: Dedicated Feature Branches
- **NEVER push directly to `main`.** Direct pushes to `main` are strictly blocked.
- Every agent MUST create and work in a dedicated feature branch named:
  - `feature/fai-<feature-name>` (for Frontend tasks)
  - `feature/bai-<feature-name>` (for Backend tasks)
  - `feature/roai-<feature-name>` (for AI tasks)
  - `feature/sai-<feature-name>` (for Security tasks)
  - `feature/qai-<feature-name>` (for QA tasks)

### Rule 2.2: Conventional Commit Standard
Agents MUST write clean commit messages following Conventional Commits:
- `feat(scope): ...` for new features
- `fix(scope): ...` for bug fixes
- `sec(scope): ...` for security policy updates
- `test(scope): ...` for automated test suites
- `docs(scope): ...` for documentation & learning updates

### Rule 2.3: Push Remote & Open Official GitHub Pull Request
When feature work passes local verification, the agent MUST execute:
```bash
git add .
git commit -m "feat(scope): implement feature title"
git push origin feature/<agent>-<feature-name>
gh pr create --title "[Agent: Name] Feature Title" --body "..." --assignee "GAI"
```

### Rule 2.4: Formal PR Review & Gatekeeping by GAI (Accept or Refuse)
- **GAI (Git & Release Manager AI)** MUST inspect the PR diff (`gh pr diff`), verify unit/E2E test pass rates, and review security boundaries.
- **If GAI detects errors or regressions**: GAI flags the error in a PR comment (`gh pr review --comment`) and **REFUSES** to merge until the feature agent fixes the issue.
- **If GAI approves**: GAI executes `gh pr merge --merge --delete-branch` via the GitHub API, ensuring the PR is officially merged and recorded under the **Pull Requests** tab on GitHub in the web browser.

### Rule 2.5: Learning Ledger Update
Upon PR merge completion, the agent MUST update their `.agents/learning/<AgentName>/` ledger:
- Record new insights in `memory.md`.
- Record any bugs/mistakes & lessons learned in `journal.md`.
- Update milestones in `skills.md`.
