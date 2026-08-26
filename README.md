# 🏛️ Ta3 (تعلّم) - The Arabic Learning Marketplace & Creator Community Platform

> **The Arabic platform where people learn, teach, and build communities around knowledge.**  
> *Skool + Udemy + Coursera for the MENA Region*

---

## 🌟 Executive Overview

**Ta3 (تعلّم)** is an Arabic-first learning marketplace and creator community platform designed specifically for the MENA region. Combining course delivery (LMS), creator economy tools, Skool-style community feeds, and low-bandwidth Levant cloud infrastructure, Ta3 empowers Arabic creators to monetize their knowledge and learners to build relationships around education.

---

## 🚀 Core Platform Pillars

1. **📚 Learn (LMS Core Engine)**: Course catalogs, lectures, video previews, assignments, PDF/ZIP submissions, grading console, and progress tracking.
2. **💬 Community (Skool-Style Feeds)**: Community feeds, discussion posts, upvotes, live webinars, cohort events, and study groups.
3. **🛒 Marketplace & Creator Economy**: Free, paid one-time, subscription, and cohort pricing models with 10–15% marketplace commission and creator payout balance dashboards.
4. **🇱🇧 Levant High-Volume Infrastructure**: Offline-first PWA with IndexedDB draft storage, TUS resumable 512KB chunked uploads on 3G, Redis read-caching, and BullMQ worker queue for 11:59 PM submission spikes.

---

## 🎨 Brand Design System

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
- **Layout**: Native RTL (Right-to-Left) with standard Arabic numerals (1, 2, 3, 4, 5, 6, 7, 8, 9, 0).

---

## 📜 Operating Rules & Git Guidelines
- **Git Policy**: Never push directly to `main`. Work strictly in feature branches (`feature/<agent>-<feature-name>`).
- **Activity Target**: Minimum **10 GitHub activities per shift** (Issues, Commits, PRs, Comments, Merges).
- **PR Quality Gate**: Every PR requires static typecheck `npx tsc --noEmit` and Vitest test pass verification by **GAI**.
