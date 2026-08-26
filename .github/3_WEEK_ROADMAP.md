# 🗓️ 3-Week Master Development Roadmap: Ta3 (تعلّم) v4.0 Pivot

> **Documentation Lead**: 🎯 **POAI (Product Owner AI)** — Responsible for maintaining all `.md` specifications in `.github/` whenever architectural or sprint changes occur.
> **Daily Velocity Target**: **At least 10–15 GitHub activities per day** (Commits, Issues, PRs, Merges, Audits, Ledger Updates)  
> **Location**: `.github/3_WEEK_ROADMAP.md`

---

## 🎯 Strategic Vision: The Arabic Learning Marketplace & Creator Community Platform

**Ta3 (تعلّم)** is positioned as **the Arabic platform where people learn, teach, and build communities around knowledge** (*Skool + Udemy + Coursera for the MENA Region*).

```
                         TA3 (تعلّـم)
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
   LEARNING               COMMUNITY             MARKETPLACE
       │                      │                      │
 Courses & Lessons      Community Feeds        Free & Paid Courses
 Quizzes & Assignments  Group Posts & Events   Subscriptions
 Certificates           Study Groups & Leaderboards Cohorts & Digital Products
```

---

## 🌐 Master Pivot Roadmap Overview (Days 16–30)

| Phase | Duration | Core Focus | Backend & System State |
| :--- | :--- | :--- | :--- |
| **Sprint 4: Creator Marketplace & Commerce** | Days 16–20 | Creator Profiles, Free/Paid Pricing Models, Course Marketplace, Checkout & Payouts | Creator Schema + Commerce Engines |
| **Sprint 5: Communities & Levant 5 Pillars** | Days 21–25 | Skool-Style Feeds, PWA Offline Service Worker, TUS Resumable Uploads, Redis & BullMQ | Community Channels + PWA + Resumable Storage |
| **Sprint 6: Governance, Analytics & v4.0** | Days 26–30 | Admin Governance Console, Creator Analytics, Cohort Webinars, Final Security & Release `v4.0.0` | Enterprise Cluster + Production Release Tag `v4.0.0` |

---

## 🏃 Master Sprint Schedule (Days 16–30)

### 🛒 **Sprint 4 (Days 16–20): Creator Economy, Monetization & Course Marketplace**
- **Day 16**: Creator Profile & Storefront (`CreatorDashboard.tsx`, Bio, Social Links, Followers, Creator Badges).
- **Day 17**: Course Monetization Engine (Free, Paid One-Time, Subscription, Cohort Pricing Models, Currency).
- **Day 18**: Arabic Course Marketplace UI (`Marketplace.tsx`, Category Filters, Search, Creator Cards, Student Checkout).
- **Day 19**: Creator Revenue & Payout Dashboard (`CreatorPayouts.tsx`, 10–15% Ta3 Fee Calculation, Wallet Balance).
- **Day 20**: Marketplace Quality Gate (`npx tsc --noEmit`, Vitest, PR merge to main, Tag `v3.0-marketplace`).

### 💬 **Sprint 5 (Days 21–25): Skool-Style Creator Communities & Levant 5 Pillars**
- **Day 21**: Creator Community Feeds & Posts (`CommunityFeed.tsx`, Posts, Upvotes, Polls, Pinned Discussions).
- **Day 22 (Pillar 1)**: Offline-First PWA & IndexedDB Engine (Service Worker `sw.js`, WOFF2 Arabic Font Subsetting, IndexedDB Drafts).
- **Day 23 (Pillar 2)**: TUS Resumable 512KB Chunked Upload Protocol on 3G (`resumableUpload.ts`).
- **Day 24 (Pillar 3)**: Redis Read Caching & PgBouncer Connection Pooling (`redisCache.ts`, 95% DB Query Load Reduction).
- **Day 25 (Pillar 5)**: BullMQ Async Message Queue for 11:59 PM Thundering Herd Spikes (`queueManager.ts`) & Tag `v3.5-community`.

### 🏆 **Sprint 6 (Days 26–30): Enterprise Governance, Analytics & Production Release Tag `v4.0.0`**
- **Day 26**: Advanced Admin Governance Console (`AdminDashboard.tsx`, Role Promotion/Demotion, Account Lock, Session Revocation).
- **Day 27**: Teacher & Creator Course Analytics Dashboard (Enrollment funnels, completion rates, revenue insights).
- **Day 28**: Live Webinars & Cohort Event Manager (`CohortEvents.tsx`, Scheduled live sessions, calendar integration).
- **Day 29**: Platform Penetration Security Audit & OWASP Security Header Re-verification.
- **Day 30**: Final Master Quality Gate & Production Release Tag **`v4.0.0`** (`npx tsc --noEmit` 0 errors, 100% Vitest pass rate, PR merge, Tag `v4.0.0`).
