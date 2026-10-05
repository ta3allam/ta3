# 🏛️ Ta3 (تعلّم) — The Arabic Learning Marketplace & Creator Community Platform

> **The Arabic platform where people learn, teach, and build communities around knowledge.**  
> *The Skool + Udemy + Coursera of the Middle East & The Levant*

---

## 🌟 Executive Overview

**Ta3 (تعلّم)** is an enterprise-grade, Arabic-native learning marketplace and creator community platform designed specifically for the MENA region, starting with Syria and the Levant. 

Combining modular course delivery (LMS), Skool-style community feeds with XP gamification, an open marketplace for creators and educators, affiliate course discovery, low-bandwidth audio-only streaming modes, and localized Levant payment gateways (ShamCash, Syriatel Cash, ZainCash, Hawala, USDT), Ta3 empowers educators to monetize knowledge and learners to thrive in an active community.

---

## 🚀 Core Platform Pillars

1. **💬 Community Engine (Arabic Skool-Style Feeds)**:
   - Dedicated category channels (`#جميع_المنشورات`, `📢 إعلانات صانع المحتوى`, `💬 نقاشات وأسئلة برمجية`, `🚀 مشاريع الطلاب والابتكارات`, `💼 فرص عمل وتدريب محلي`).
   - Interactive upvotes with dynamic XP calculation (+5 XP for author, +1 XP for voter) and Level badges (Level 1–9).
   - Inline comment discussions, syntax-highlighted code snippet sharing, pinned announcements, and weekly contributor leaderboards.
2. **📚 Modular Classroom & Resource Vault**:
   - High-performance video & audio lesson player with speed control (0.75x–2.0x), chapter timestamps, and low-bandwidth "Audio Only" mode (85%+ bandwidth reduction on 3G).
   - Interactive local-draft lesson notepads with text/markdown export and auto-save indicators.
   - **Downloadable Resource Vault (خزنة الموارد المفتوحة)**: Category-filtered repository of course PDF slides, exercise code ZIPs, cheat sheets, and templates with batch download support.
3. **🛒 Open Marketplace & Affiliate Course Hub**:
   - Open creator onboarding with free, paid one-time, subscription, and cohort pricing models.
   - Curated global affiliate courses (Coursera, Udemy, bootcamps) for comprehensive Day 1 catalog breadth.
4. **💵 Levant High-Volume Financial Infrastructure**:
   - Regional payment methods: ShamCash, Syriatel Cash, MTN Cash, Al-Haram/Al-Fouad Hawala, ZainCash, Wise, and USDT (TRC-20).
   - Semi-automated receipt uploader with 1-click SuperAdmin/Teacher verification and instant student enrollment.
   - Creator payout balance dashboards with transparent 15% platform split accounting.
5. **🔌 Levant Low-Bandwidth Resiliency**:
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

## 📅 2-Week / 8-Workday Sprint Execution Roadmap

| Phase | Day | Focus Milestone | Status |
| :--- | :--- | :--- | :--- |
| **Week 1** | **Day 1 (Mon)** | **Vitest Test Runner Isolation & Skool-Style Community Engine** | ✅ **Completed** |
| | **Day 2 (Tue)** | **Modular Classroom, Video/Audio Player & Resource Vault** | ✅ **Completed** |
| | **Day 3 (Wed)** | **Open Marketplace, Affiliate Discovery Hub & Creator Studio** | ✅ **Completed** |
| | **Day 4 (Thu)** | **Levant Multi-Channel Payment & Manual Receipt Verification** | ✅ **Completed** |
| **Week 2** | **Day 5 (Mon)** | **Interactive Cohort Calendar & Live Event Sync** | ⏳ Scheduled |
| | **Day 6 (Tue)** | **3-Tier Authentic Profiles & Gamified XP Levels** | ⏳ Scheduled |
| | **Day 7 (Wed)** | **Mobile PWA Optimization & Low-Bandwidth Caching** | ⏳ Scheduled |
| | **Day 8 (Thu)** | **Multi-Role E2E Test Suite, Complete Docs & Golden Release** | ⏳ Scheduled |

---

## 📜 Operating Rules & Quality Gates

- **Git Branching Policy**: Strictly isolated feature branches (`feature/<agent>-<feature-name>`). Never push directly to `main`.
- **Activity Target**: Minimum **10 GitHub activities/commits per shift**.
- **Quality Gate**: Every PR requires static typecheck `npx tsc --noEmit` and Vitest pass verification (`npx vitest run`).
- **Release Sequence**: Commits $\rightarrow$ PR Merge to `main` $\rightarrow$ `git push origin main` $\rightarrow$ `npm run git` (*GitHub Pages deploy*).
