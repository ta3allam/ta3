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

## 🎓 Classroom Experience & Video/Audio Player Components (Day 2)

### `InteractiveLessonPlayer` (`src/components/courses/InteractiveLessonPlayer.tsx`)
* **Description**: Adaptive, resilient media player for classroom lectures supporting high-speed video and Levant low-bandwidth audio-only streaming.
* **Features**:
  - **Dual Mode (Video & Audio-Only)**: Instant toggle reducing data consumption by ~97% (64 kbps AAC vs 2500 kbps 720p) for 3G and power outage conditions.
  - **Variable Playback Speed**: Quick selector for `0.75x`, `1.0x`, `1.25x`, `1.5x`, and `2.0x`.
  - **Timestamped Chapters**: Clickable chapter markers allowing instant seeking through syllabus topics.
  - **Completion State Dispatch**: Interactive "Mark as Completed" action triggering student progress recalculation.

### `ResourceVault` (`src/components/courses/ResourceVault.tsx`)
* **Description**: Centralized downloadable assets drawer and repository for enrolled students.
* **Features**:
  - **Category Tabs**: Filter resources by `الكل (All)`, `مستندات PDF (Documents)`, `أكواد برمجية (Code)`, `ملخصات وقوالب (Cheatsheets)`.
  - **Direct & Batch Actions**: Individual file download buttons and full-course ZIP package downloader.
  - **File Metadata Badges**: Explicit file size and type labeling.

### `CourseProgressSummary` (`src/pages/courses/Courses.tsx`)
* **Description**: Top-level course header featuring dynamic completion calculations, percentage progress bars, and tab navigators (`المحاضرات (Lectures)`, `حقيبة الموارد (Resource Vault)`, `الملفات المرفقة (Attachments)`).

---

## 🛒 Marketplace, Affiliate Discovery & Creator Studio (Day 3)

### `Marketplace` (`src/pages/marketplace/Marketplace.tsx`)
* **Description**: Central marketplace featuring a master tab switcher between local creator courses and curated global affiliate tracks.
* **Features**:
  - **Dual Mode Navigation**: Seamless toggle between *دورات المنصة ومجتمعات المعلمين* and *دليل المسارات والشهادات العالمية بالعمولة*.
  - **Provider & Category Filters**: Multi-facet filtering by platform (Coursera, Udemy, CS50, edX, DeepLearning.AI, Frontend Masters), category, language, and pricing.
  - **Creator Onboarding Launcher**: Prominent CTA button opening `CreatorCourseBuilderModal`.

### `AffiliateCourseCard` (`src/components/marketplace/AffiliateCourseCard.tsx`)
* **Description**: High-conversion card component for presenting external certified tracks.
* **Features**:
  - **Platform Provider Badges**: Branded styling for Coursera, Udemy, edX, DeepLearning.AI, and CS50.
  - **Exclusive Coupon Copy**: 1-click clipboard coupon copying with interactive toast alerts and discounts up to 85%.
  - **Price Comparison**: Strikethrough original USD price vs discounted student price.
  - **Arabic Subtitles Indicator**: Visual badges indicating whether full Arabic translation is provided.

### `AffiliateCourseModal` (`src/components/marketplace/AffiliateCourseModal.tsx`)
* **Description**: Comprehensive overview modal for affiliate tracks displaying curriculum scope, key technologies/skills, provider accreditation details, and referral links.

### `CreatorCourseBuilderModal` (`src/components/creator/CreatorCourseBuilderModal.tsx`)
* **Description**: Interactive course authoring and studio modal empowering educators to launch new courses.
* **Features**:
  - **Metadata & Classification**: Configures title, code slug, category, instructor name, and target difficulty.
  - **Dynamic Pricing Engine**: Selects between Free, Paid One-Time, and Monthly Subscriptions in USD, SYP, AED, or SAR.
  - **Syllabus & Lecture Builder**: Add, edit, and reorder lectures and initial module descriptions with instant publication to the marketplace.

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
