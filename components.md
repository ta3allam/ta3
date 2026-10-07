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
* **Description**: Multi-channel checkout and manual receipt submission modal customized for Syria and the Levant.
* **Features**:
  - **Regional Gateways**: ShamCash, Syriatel Cash, Hawala Al-Haram, ZainCash, USDT (TRC-20), and International Cards.
  - **Payment Instructions & Copy**: 1-click clipboard copy for recipient accounts, phone numbers, and USSD guidelines.
  - **Screenshot & TxID Uploader**: Direct image preview with file selector and mandatory transaction reference validation.
  - **Instant Optimistic Notification**: Dispatches toast and records `pending_verification` receipt in storage.

### `PaymentVerificationQueue` (`src/components/admin/PaymentVerificationQueue.tsx`)
* **Description**: Centralized financial audit and manual verification console embedded in `AdminDashboard` and `TeacherDashboard`.
* **Features**:
  - **Interactive Filtering & Metrics**: Real-time counters for pending, approved, and total USD sales volume.
  - **High-Res Inspector Modal**: Deep modal view for inspecting full-size receipt screenshots and transaction details.
  - **1-Click Approval**: Validates receipt, updates status to `approved`, auto-enrolls student in `user.enrolledCourses`, and calculates 85% creator / 15% platform split.
  - **Rejection Reason Modal**: Captures specific rejection reasoning and sends immediate status updates.

---

## 📅 Cohort Live Events & Interactive Calendar (Day 5)

### `CohortEvents` (`src/pages/cohorts/CohortEvents.tsx`)
* **Description**: The master schedule and live events hub for community workshops, webinars, and masterclasses.
* **Features**:
  - **Dual View Mode**: Seamless toggle between *عرض البطاقات (Grid View)* and *عرض التقويم الشهري (Calendar View)*.
  - **Regional Timezone Selector**: Quick conversion across Middle Eastern timezones (`دمشق / مكة المكرمة / بغداد`, `القاهرة / بيروت / القدس`, `دبي / مسقط`, `الدار البيضاء / تونس`, `UTC`).
  - **Category Filters**: `#كافة_الجلسات`, `🔴 مباشر الآن`, `جلساتي المسجلة`, `ورش عمل برمجية`, `ماستر كلاس`, `ساعات مكتبية`, `أسئلة وأجوبة`.
  - **Instructor Event Scheduler**: 1-click modal launcher for verified instructors to create new live workshops.

### `EventCalendarView` (`src/components/cohorts/EventCalendarView.tsx`)
* **Description**: Interactive monthly calendar grid component displaying scheduled live sessions with Arabic weekday headers and day cell event badges.
* **Features**:
  - **Month Navigation**: 1-click next/prev month and "اليوم (Today)" fast jump.
  - **Day Filtering**: Clicking any calendar cell filters sessions occurring on that specific date.
  - **Category Color Badges**: Visual coding for workshops (Teal), masterclasses (Damask Red), office hours (Wheat), and Q&A (Emerald).

### `WebinarRoomCard` (`src/components/cohorts/WebinarRoomCard.tsx`)
* **Description**: High-fidelity live event card with countdown ticker, seat capacity meter, and calendar sync buttons.
* **Features**:
  - **Real-Time Countdown Ticker**: Live ticking countdown calculating remaining days, hours, and minutes with `🔴 بث مباشر الآن` status badge.
  - **Seat Availability Progress Bar**: Visual meter warning when event capacity is reached.
  - **One-Click Calendar Sync**: Direct **Google Calendar** URL builder and **Apple / Outlook iCal (`.ics`)** file downloader.
  - **Instant RSVP**: Toggle button with local storage persistence and automated attendee count updates.

### `CreateEventModal` (`src/components/cohorts/CreateEventModal.tsx`)
* **Description**: Instructor scheduling modal for creating new live streams and interactive coding sessions.
* **Features**:
  - Form validation for session title, category, instructor name, date/time, duration, capacity, stream URL, and timezone.
  - Instant dispatch to `EventStore.addEvent` with Sonner toast feedback.

### `LiveSessionStageModal` (`src/components/cohorts/LiveSessionStageModal.tsx`)
* **Description**: Virtual broadcast room and interactive student stage.
* **Features**:
  - **Low-Bandwidth Audio-Only Mode**: Instant toggle saving ~97% bandwidth (32 kbps Opus) during poor connectivity.
  - **Live Stream Embed**: Embedded responsive player supporting Jitsi Meet, YouTube Live, and recorded replays.
  - **Live Q&A Upvote Engine**: Real-time student question submission drawer with community upvoting.

---

## 📱 Cross-Platform Mobile Layout & Touch Gestures (Day 6)

### `MobileBottomNav` (`src/components/navigation/MobileBottomNav.tsx`)
* **Description**: One-thumb floating bottom navigation bar displayed on screens $< 768\text{px}$.
* **Features**:
  - Direct 1-tap switching between **المجتمع (Community)**, **السوق (Marketplace)**, **مقرراتي / الاستوديو (My Courses / Studio)**, **الفعاليات (Live)**, and **المزيد (Menu Drawer)**.
  - Live session active badge (`🔴 لايف`) and active route indicator bar.
  - Safe area inset padding for modern mobile devices.

### `MobileNavigationDrawer` (`src/components/navigation/MobileNavigationDrawer.tsx`)
* **Description**: Full-height sliding sheet drawer for mobile users.
* **Features**:
  - User avatar, role badge, and level indicator header with quick profile access.
  - Role-segregated sections: Instructor management, Creator wallet & payouts, Admin governance console, and Student learning spaces.
  - One-click account logout button.

### `PullToRefreshContainer` (`src/components/common/PullToRefreshContainer.tsx`)
* **Description**: Touch gesture wrapper providing iOS/Android-style pull-to-refresh interactions.
* **Features**:
  - Elastic damping resistance formula ($0.45\times$) with pull threshold detection ($\ge 65\text{px}$).
  - Animated spinner and rotation indicator for pull feedback.
  - Non-blocking asynchronous refresh handler execution.

### `MobileOfflineBanner` (`src/components/common/MobileOfflineBanner.tsx`)
* **Description**: Interactive network status banner providing real-time offline feedback.
* **Features**:
  - Listens to browser `online` / `offline` events and navigator status.
  - Informs students when working in local offline mode (IndexedDB auto-save).
  - One-click network re-check button and success recovery toast.

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
