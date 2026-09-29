# 🏛️ Ta3 (تعلّم) — UI & Domain Components Documentation

This document catalogs all reusable UI primitives (`src/components/ui`), domain components, and page layouts across the Ta3 platform.

---

## 💬 Domain Components: Skool-Style Community Engine

### `CommunityFeed` (`src/pages/community/CommunityFeed.tsx`)
* **Description**: The central community hub inspired by Skool.com, tailored with native Arabic RTL.
* **Features**:
  - **Category Channels**: `#جميع_المنشورات`, `📢 إعلانات صانع المحتوى`, `💬 نقاشات وأسئلة برمجية`, `🚀 مشاريع الطلاب والابتكارات`, `💼 فرص عمل وتدريب محلي`.
  - **Live Filter & Sort**: Filter by *الأكثر تفاعلاً (Trending)*, *الأحدث (Latest)*, and *بانتظار إجابة (Unanswered)*.
  - **Search Bar**: Real-time multi-attribute search filtering by title, body, author name, and hashtags.
  - **Leaderboard Widget**: Gamified weekly contributor ranking showing member level badges (Lvl 1–9) and earned XP points.
  - **Rich Post Composer**: Expandable creation modal with optional syntax-highlighted code editor and hashtag inputs.

### `CommunityPostCard` (`src/components/community/CommunityPostCard.tsx`)
* **Description**: An interactive card rendering community contributions with instant feedback.
* **Features**:
  - **XP Upvoting**: One-click reaction toggling that calculates rewards (+5 XP for post author, +1 XP for voter).
  - **Gamified Author Badges**: Shows author role (`صانع المحتوى 👑` or `المستوى X 🔥`).
  - **Code Snippet Previewer**: Dark-themed monospaced code block with language identifier and one-click copy button.
  - **Inline Comments Thread**: Nested accordion displaying discussion replies and an instant reply composer.
  - **Social Sharing**: One-click URL copy with interactive Sonner toast confirmation.

---

## 🛒 Marketplace & Levant Payment Components

### `Marketplace` (`src/pages/marketplace/Marketplace.tsx`)
* **Description**: Course catalog and discovery directory with category filtering, creator preview modals, and direct checkout hooks.

### `CheckoutDialog` (`src/components/marketplace/CheckoutDialog.tsx`)
* **Description**: Multi-channel checkout modal offering Levant regional payment options (ShamCash, Syriatel Cash, ZainCash, Hawala, USDT).

---

## 🛡️ Authentication & Authorization Components

### `RequireAuth` (`src/components/layout/RequireAuth.tsx`)
* **Description**: Three-tier defensive route gate ensuring students, instructors, creators, and admins remain within their authentic authorized boundaries.

---

## 🧩 Headless UI Primitives (`src/components/ui/`)

| Component | Description |
| :--- | :--- |
| **`Accordion`** | Collapsible syllabus modules and FAQ sections. |
| **`Avatar`** | User profile avatar with initials fallback. |
| **`Badge`** | Semantic status chips and gamified XP level badges. |
| **`Button`** | Styled interactive buttons with variant styling (`default`, `outline`, `ghost`). |
| **`Card`** | Base elevation container for posts, courses, and metrics. |
| **`Dialog` & `AlertDialog`** | Modal overlays for post creation, payment verification, and checkout. |
| **`Input` & `Textarea`** | RTL-styled form elements with active teal borders. |
| **`Sonner` / `Toast`** | Lightweight interactive notifications. |
| **`Tabs`** | Channel and view switchers. |
