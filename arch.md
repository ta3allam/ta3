# 🏛️ Ta3 (تعلّم) — System Architecture Specification

## Executive Overview
**Ta3 (تعلّم)** is an enterprise-grade, Arabic-native Learning Marketplace & Creator Community Platform (*The Skool + Udemy + Coursera of the MENA Region*) built with React 18, TypeScript, Tailwind CSS, `shadcn/ui`, and a resilient local/hybrid Supabase PostgreSQL backend with offline-first PWA caching and regional Levant payment engines.

The platform provides unified, role-segregated experiences for **Learners**, **Creators/Instructors**, and **SuperAdmins**, eliminating AI cloud operational overhead in favor of authentic community engagement, structured modular video/audio learning, live cohort calendars, and regional cashflow mechanics.

---

## 🏛️ System Architecture Diagrams (Mermaid)

### Level 1: System Context Diagram
The System Context diagram displays how users and regional infrastructure interact with the **Ta3 Ecosystem**.

```mermaid
graph TD
    subgraph Users [" Platform Ecosystem Users "]
        Learner["🎓 Learner / Student (طالب)<br/>Enrolls in courses, upvotes in community, tracks XP"]
        Creator["👨‍🏫 Creator / Instructor (صانع محتوى / معلم)<br/>Publishes courses, moderates channels, manages payouts"]
        Admin["🛡️ SuperAdmin (مدير النظام)<br/>Role governance, GMV audits, manual receipt verification"]
    end

    subgraph Platform [" Core Ta3 Platform Ecosystem "]
        Ta3App["💻 Ta3 Web & PWA Client<br/>(React 18, TypeScript, Tailwind CSS, shadcn/ui)"]
        VaultHub["🗄️ Resource Vault Engine<br/>PDFs, Code ZIPs, Cheat Sheets, Templates"]
        AffiliateHub["🔗 Curated Affiliate Course Directory<br/>(Global partners: Coursera, Udemy)"]
    end

    subgraph Infrastructure [" Levant & Cloud Infrastructure "]
        MockEngine["💾 MockDataEngine & IndexedDB<br/>Local reactive storage & offline drafts"]
        AudioVideoSvc["🎧 Dual-Mode Video & Audio-Only Player<br/>Low-Bandwidth AAC 64kbps stream (85%+ saving)"]
        SupabaseDB[("🗄️ Supabase PostgreSQL DB<br/>Relational data & RLS policies")]
        LevantGateways["💵 Regional Cashflow Engine<br/>ShamCash, Syriatel, ZainCash, Hawala, USDT"]
    end

    Learner -->|HTTPS / PWA| Ta3App
    Creator -->|HTTPS / Web| Ta3App
    Admin -->|HTTPS / Web| Ta3App

    Ta3App -->|Local Persistence| MockEngine
    Ta3App -->|Media Stream| AudioVideoSvc
    Ta3App -->|PostgREST / Realtime| SupabaseDB
    Ta3App -->|Download Resources| VaultHub
    Ta3App -->|External Links| AffiliateHub
    Ta3App -->|Manual Receipts| LevantGateways
```

---

### Level 2: Modular Classroom & Low-Bandwidth Streaming Container

```mermaid
graph TD
    subgraph Browser [" Client Web Browser / PWA "]
        subgraph ClassroomSPA [" Ta3 Classroom Single Page App "]
            LessonPlayer["🎬 InteractiveLessonPlayer<br/>Video & 64kbps Low-Bandwidth Audio Mode"]
            ChapterIndex["📑 Timestamp Chapter Navigator"]
            SmartNotes["📝 Local Storage Smart Notes & Text Export"]
            VaultTab["🗄️ Resource Vault<br/>PDFs, Source ZIPs, Cheat Sheets"]
            ProgressGauge["📊 Gamified Course Progress & Certificate Engine"]
        end
    end

    subgraph Storage [" Data & State Layer "]
        LocalCache["💾 LocalStorage & IndexedDB<br/>(lecture_completed_*, lecture_notes_*)"]
        SupabaseClient["🔑 Supabase PostgREST Client"]
    end

    LessonPlayer --> LocalCache
    ChapterIndex --> LessonPlayer
    SmartNotes --> LocalCache
    VaultTab --> LocalCache
    ProgressGauge --> LocalCache
```

---

### Level 3: Data Model & Classroom Entity Relationships

```mermaid
erDiagram
    COURSES ||--o{ LECTURES : "contains"
    LECTURES ||--o{ LECTURE_MATERIALS : "includes"
    COURSES ||--o{ VAULT_RESOURCES : "provides"
    LECTURES ||--o{ CHAPTER_TIMESTAMPS : "indexed_by"
    PROFILES ||--o{ LECTURE_NOTES : "writes"
    PROFILES ||--o{ LECTURE_COMPLETIONS : "records"

    COURSES {
        bigint id PK
        string name
        string code
        uuid teacher_id FK
        string bg_image
        integer total_lectures
    }

    LECTURES {
        bigint id PK
        bigint course_id FK
        string title
        string description
        string video_url
        string audio_url
        string duration
        integer order_num
    }

    CHAPTER_TIMESTAMPS {
        bigint id PK
        bigint lecture_id FK
        string time_code
        integer seconds
        string title
    }

    VAULT_RESOURCES {
        string id PK
        bigint course_id FK
        string title
        string category
        string file_url
        string file_size
        integer downloads_count
    }

    LECTURE_COMPLETIONS {
        uuid id PK
        uuid user_id FK
        bigint lecture_id FK
        boolean is_completed
        timestamp completed_at
    }

    LECTURE_NOTES {
        uuid id PK
        uuid user_id FK
        bigint lecture_id FK
        text content
        timestamp updated_at
    }
```

---

### Level 4: Open Marketplace, Affiliate Hub & Creator Course Studio

```mermaid
graph TD
    subgraph MarketplaceBoundary [" 🛒 Ta3 Marketplace & Discovery Engine "]
        MarketplacePage["🛍️ Marketplace Central View (`Marketplace.tsx`)"]
        
        subgraph NativeStream [" Local Creator Courses "]
            NativeGrid["🏫 Native Course Catalog Grid"]
            PricingTier["🏷️ PricingBadges (Free / One-Time / Subscription)"]
            CreatorStudio["🚀 CreatorCourseBuilderModal<br/>(Publishing directly into CourseContext)"]
            CheckoutModal["💳 CheckoutDialog (Levant Multi-Channel Gateways)"]
        end

        subgraph AffiliateStream [" Global Certified Affiliates "]
            AffiliateGrid["🌐 Affiliate Discovery Grid (`AffiliateCourseCard`)"]
            CouponEngine["🏷️ Coupon & Discount Calculator (Up to 85% Off)"]
            ProviderRouting["🔗 Provider Redirect Router (Coursera, Udemy, edX, CS50)"]
            AffiliateModal["📑 Full Syllabus & Trust Overview (`AffiliateCourseModal`)"]
        end
    end

    MarketplacePage --> NativeGrid
    MarketplacePage --> AffiliateGrid
    NativeGrid --> CheckoutModal
    CreatorStudio -->|Dynamic Dispatch| NativeGrid
    AffiliateGrid --> CouponEngine
    CouponEngine --> AffiliateModal
    AffiliateModal --> ProviderRouting
```

---

### Level 5: Levant Multi-Channel Payment & Manual Verification Pipeline

```mermaid
graph TD
    subgraph StudentCheckout [" 💳 Student Checkout & Receipt Submission "]
        CheckoutDialog["📱 CheckoutDialog<br/>(ShamCash, Syriatel, Hawala, ZainCash, USDT)"]
        ReceiptUpload["📤 Receipt & Transaction Reference (TxID) Uploader"]
        OptimisticNotice["⏳ Optimistic Status: `pending_verification`"]
    end

    subgraph CoreStore [" 🗄️ Persistence & State Sync "]
        ReceiptStore["💾 ReceiptStore & Reactive Listeners<br/>(LocalStorage + Memory Fallback)"]
    end

    subgraph AdminQueue [" 🛡️ SuperAdmin / Teacher Verification Console "]
        QueueUI["📋 PaymentVerificationQueue Component<br/>(`AdminDashboard.tsx` & `TeacherDashboard.tsx`)"]
        Inspector["🔍 High-Res Receipt Image Inspector"]
        
        subgraph Decision [" Verification Decision "]
            ApproveAction["✅ 1-Click Approve<br/>• Student Instant Course Enrollment<br/>• 85% Creator Earnings Allocation<br/>• 15% Platform Fee Deduction"]
            RejectAction["❌ Reject with Specific Reason Prompt"]
        end
    end

    CheckoutDialog --> ReceiptUpload
    ReceiptUpload --> OptimisticNotice
    ReceiptUpload -->|Persist| ReceiptStore
    ReceiptStore -->|Reactive Sync| QueueUI
    QueueUI --> Inspector
    Inspector --> Decision
    ApproveAction -->|Update State & Enroll| ReceiptStore
    RejectAction -->|Update Status| ReceiptStore
```

---

### 5. Cohort Live Events & Interactive Calendar Subsystem

```mermaid
graph TD
    subgraph EventCreation [" 👨‍🏫 Instructor Event Scheduling "]
        CreateModal["📅 CreateEventModal.tsx<br/>Title, Category, Start Date/Time, Duration, Seats, Stream URL"]
        EventStore["💾 EventStore (LocalStorage & In-Memory Fallback)"]
    end

    subgraph CalendarUI [" 🗓️ Calendar & Grid Interaction Hub "]
        PageView["🖥️ CohortEvents.tsx (Dual View)"]
        CalView["📆 EventCalendarView.tsx (Month Grid & Arabic Weekdays)"]
        CardView["🎴 WebinarRoomCard.tsx (Countdown, Capacity Bar, iCal/Google Sync)"]
        TzEngine["🌍 MENA Timezone Converter (Damascus, Cairo, Dubai, Casablanca)"]
    end

    subgraph LiveStage [" 🔴 Virtual Broadcast Room "]
        StageModal["📺 LiveSessionStageModal.tsx<br/>• Jitsi/YouTube Stream Embed<br/>• Low-Bandwidth Audio-Only Mode (97% saving)<br/>• Real-Time Q&A & Upvote System"]
    end

    CreateModal -->|Add Event| EventStore
    EventStore -->|Fetch Events & RSVPs| PageView
    PageView --> CalView
    PageView --> CardView
    PageView --> TzEngine
    CardView -->|1-Click RSVP| EventStore
    CardView -->|Export .ics / GCal| CalendarExport["📥 calendarExport.ts"]
    CardView -->|Join Live Session| StageModal
    StageModal -->|Post / Upvote Question| EventStore
```

---

## 🎨 Brand Design Tokens (Strictly Preserved)
- **Primary**:
  - `Mountain Teal`: `#428177`
  - `Ivory Mist`: `#EDEBE0`
  - `Damask Red`: `#6B1F2A`
  - `White`: `#FFFFFF`
- **Secondary**:
  - `Forest`: `#002623`
  - `Emerald Shadow`: `#054239`
  - `Golden Wheat`: `#988561`
  - `Antique Sand`: `#B9A779`
- **Typography**: Native Arabic RTL, Standard Arabic Numerals (1, 2, 3, 4, 5, 6, 7, 8, 9, 0).
