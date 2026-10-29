# 🏛️ Ta3 (تعلّم) — The Arabic Learning Marketplace & Creator Community Platform

> **The Arabic platform where people learn, teach, and build communities around knowledge.**  
> *The Skool + Udemy + Coursera of the Middle East & The Levant*

---

## 🌟 Executive Overview

**Ta3 (تعلّم)** is an enterprise-grade, Arabic-native learning marketplace and creator community platform designed specifically for the MENA region, starting with Syria and the Levant. 

Combining modular course delivery (LMS), Skool-style community feeds with XP gamification, an open marketplace for creators and educators, affiliate course discovery, low-bandwidth audio-only streaming modes, localized Levant payment gateways (ShamCash, Syriatel Cash, ZainCash, USDT TRC-20), cross-platform mobile drawers & gestures, creator analytics with cohort retention heatmaps, and a pre-flight system diagnostics engine, Ta3 empowers educators to monetize knowledge and learners to thrive in an active community with **$0.00 AI operational costs**.

---

## 🚀 Core Platform Pillars

1. **💬 Community Engine (Arabic Skool-Style Feeds)**:
   - Dedicated category channels (`#جميع_المنشورات`, `📢 إعلانات صانع المحتوى`, `💬 نقاشات وأسئلة برمجية`, `🚀 مشاريع الطلاب والابتكارات`, `💼 فرص عمل وتدريب محلي`).
   - Interactive upvotes with dynamic XP calculation (+5 XP for author, +1 XP for voter) and Level badges (Level 1–9).
   - Inline comment discussions, syntax-highlighted code snippet sharing, pinned announcements, and weekly contributor leaderboards.
2. **📚 Modular Classroom & Resource Vault**:
   - High-performance video & audio lesson player with speed control (0.75x–2.0x), chapter timestamps, and low-bandwidth "Audio Only" mode (97%+ bandwidth reduction on 3G).
   - Interactive local-draft lesson notepads with text/markdown export and auto-save indicators.
   - **Downloadable Resource Vault (خزنة الموارد المفتوحة)**: Category-filtered repository of course PDF slides, exercise code ZIPs, cheat sheets, and templates with batch download support.
3. **🛒 Open Marketplace & Affiliate Course Hub**:
   - Open creator onboarding with free, paid one-time, subscription, and cohort pricing models.
   - Curated global affiliate courses (Coursera, Udemy, bootcamps) for comprehensive Day 1 catalog breadth with up to 85% discount coupons.
4. **💵 Levant High-Volume Financial Infrastructure**:
   - Regional payment methods: ShamCash, Syriatel Cash, ZainCash, and USDT TRC-20.
   - Semi-automated receipt uploader with 1-click SuperAdmin/Teacher verification and instant student enrollment.
   - Creator payout balance dashboards with transparent 85/15 revenue split accounting.
5. **📅 Interactive Cohort Calendar & Live Event Sync**:
   - Skool-style live events schedule with interactive Month & Day calendar grid views.
   - 1-click calendar synchronization for **Google Calendar** and **Apple / Outlook iCal (.ics)** files.
   - Multi-regional Middle Eastern timezone picker (`دمشق / مكة المكرمة`, `القاهرة / بيروت`, `دبي / مسقط`, `الدار البيضاء`, `UTC`).
   - Virtual live stage modal with low-bandwidth audio-only toggle (97% bandwidth reduction) and interactive student Q&A upvote engine.
6. **📱 Cross-Platform Mobile Layout & Touch Gestures**:
   - One-thumb **Mobile Bottom Navigation Bar** for fast switching between Community, Marketplace, Dashboard, and Live Events.
   - Sliding **Mobile Navigation Drawer** with role-aware destination routing and quick profile settings.
   - Native touch **Pull-to-Refresh** gesture container with elastic spring resistance (0.45x damping).
   - Real-time **Mobile Offline Banner** with automatic connectivity detection and re-sync triggers.
7. **📊 Creator Analytics & Student Cohort Retention Engine**:
   - Transparent **85/15 Revenue Split Ledger** tracking Gross Volume (GMV), 85% Creator Net Payouts, and 15% Platform Maintenance Fee.
   - **8-Week Cohort Retention Heatmap Matrix** calculating registration drop-off, active weekly engagement, and at-risk student intervention alerts.
   - **Low-Bandwidth Telemetry**: Tracking 3G audio-only vs video consumption percentages across individual course modules.
   - **1-Click Excel Export with Arabic UTF-8 BOM**: Instant generation and browser download of CSV & JSON analytics reports compatible with Microsoft Excel.
8. **🛡️ System Health & Golden Release Pre-Flight Diagnostics**:
   - Automated multi-tier health verification engine (`systemHealthEngine.ts`) executing real-time tests across all platform pillars.
   - Interactive audit modal (`GoldenReleaseAuditModal.tsx`) surfacing latency benchmarks, role isolation validation, and zero AI operational cost verification.
9. **🔌 Levant Low-Bandwidth Resiliency**:
   - Offline-first PWA with IndexedDB draft caching, TUS 512KB resumable chunked uploads on 3G, and zero layout shift (CLS).

---

## 🎨 Brand Design System (Strictly Preserved)

- **Primary Colors**:
  - `Mountain Teal`: `#428177`
  - `Ivory Mist`: `#EDEBE0`
  - `Damask Red`: `#6B1F2A`
  - `White`: `#FFFFFF`
- **Secondary Colors**:
  - `Forest`: `#002623`
  - `Emerald Shadow`: `#054239`
  - `Golden Wheat`: `#988561`
  - `Antique Sand`: `#B9A779`
- **Layout & Typography**: Native RTL (Right-to-Left) alignment with standard Arabic digits (1, 2, 3, 4, 5, 6, 7, 8, 9, 0).

---

## 📅 4-Day Master UI/UX, Navigation & Governance Overhaul (100% Complete)

| Day | Scope & Milestone | Deliverables & Outcomes | Status |
| :--- | :--- | :--- | :--- |
| **Day 1** | **Navigation, Shells & Access Control** | Consolidated green sidebar with pinned top profile, restored mobile bottom nav bar, role badges replaced with clean icons, unified routing tree. | ✅ **Merged (PR #223)** |
| **Day 2** | **Student Portal, Courses & Community** | High-contrast profile username, centered black-active tablists, XP badges removed from activity feeds, course tablist overflow fixed, recording modal constrained, discussion triage status badges (*سؤال / محلول*). | ✅ **Merged (PR #224)** |
| **Day 3** | **Teacher Portal, Groups & Payments** | Golden readiness button pruned from teacher dashboard, teacher join-group action eliminated, course-specific group capacity (4 for CS-101, 2 for CS-202) + bulk generator, teacher kick & chat monitoring, responsive mobile checkout, payment methods pruned. | ✅ **Merged (PR #225)** |
| **Day 4** | **Admin Governance, Registry & Docs** | Golden release report hidden from UI, admin secluded from consumer marketplace/cohorts with full oversight controls, high-capacity searchable registered students directory, workshop trainer management hub & profile creation, geographic analytics, full docs synchronization. | 🏆 **Merged (PR #226)** |

---

## 🛠️ Development & Verification Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run static TypeScript compiler verification
npx tsc --noEmit

# Run automated Vitest test suite
npx vitest run

# Production build
npm run build
```

## 📅 2-Week / 8-Workday Sprint Execution Roadmap (100% Complete)

| Phase | Day | Focus Milestone | Status |
| :--- | :--- | :--- | :--- |
| **Week 1** | **Day 1 (Mon)** | **Vitest Test Runner Isolation & Skool-Style Community Engine** | ✅ **Completed** |
| | **Day 2 (Tue)** | **Modular Classroom, Video/Audio Player & Resource Vault** | ✅ **Completed** |
| | **Day 3 (Wed)** | **Open Marketplace, Affiliate Discovery Hub & Creator Studio** | ✅ **Completed** |
| | **Day 4 (Thu)** | **Levant Multi-Channel Payment & Manual Receipt Verification** | ✅ **Completed** |
| **Week 2** | **Day 5 (Mon)** | **Interactive Cohort Calendar & Live Event Sync** | ✅ **Completed** |
| | **Day 6 (Tue)** | **Cross-Platform Mobile Drawer, Bottom Nav & Touch Gestures** | ✅ **Completed** |
| | **Day 7 (Wed)** | **Creator Analytics Studio, 85/15 Split & Cohort Retention Heatmaps** | ✅ **Completed** |
| | **Day 8 (Thu)** | **Multi-Role E2E Golden Suite, Complete Docs & Golden Master Release** | 🏆 **Completed (Golden Master)** |

---

## 📜 Operating Rules & Quality Gates

- **Git Branching Policy**: Strictly isolated feature branches (`feature/<agent>-<feature-name>`). Never push directly to `main`.
- **Activity Target**: Minimum **10 GitHub activities/commits per shift**.
- **Quality Gate**: Every PR requires static typecheck `npx tsc --noEmit` and Vitest pass verification (`npx vitest run` — **42 test files / 189 tests passed**).
- **Release Sequence**: Commits $\rightarrow$ PR Merge to `main` $\rightarrow$ `git push origin main` $\rightarrow$ `npm run git` (*GitHub Pages deploy*).
