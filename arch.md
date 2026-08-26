# Ta3 (تعلّم) - Arabic Learning Marketplace & Creator Platform Architecture

## Executive Overview
**Ta3 (تعلّم)** is an enterprise-grade, Arabic-native Learning Marketplace & Creator Community Platform (*Skool + Udemy + Coursera for the MENA Region*) built with React 18, TypeScript, Tailwind CSS, `shadcn/ui`, and a hybrid Supabase PostgreSQL backend with resilient CQRS, PWA offline engines, and cloud infrastructure.

The platform provides unified experiences for **Learners**, **Creators**, **Institutions**, and **System Administrators**, combining course delivery (LMS), creator monetization, Skool-style community feeds, and high-concurrency Levant infrastructure (PWA, TUS resumable uploads, Redis caching).

---

## 🏛️ System Architecture Diagrams (Mermaid)

### Level 1: System Context Diagram
The System Context diagram displays how different users interact with **Ta3 Ecosystem** and external cloud providers.

```mermaid
graph TD
    subgraph Users [" Platform Ecosystem Users "]
        Learner["🎓 Learner (طالب / متعلم)<br/>Enrolls in courses, joins communities, tracks progress"]
        Creator["👨‍💻 Creator / Instructor (صانع محتوى / معلم)<br/>Publishes courses, monetization, community feeds, earnings"]
        Admin["🛡️ System Admin (مدير النظام)<br/>Role governance, security controls, course approval"]
    end

    subgraph Platform [" Core Ta3 Platform Ecosystem "]
        Ta3App["💻 Ta3 Marketplace & Community Web Application<br/>(React 18, TypeScript, Tailwind CSS, shadcn/ui)"]
    end

    subgraph Cloud [" Cloud & Commerce Infrastructure "]
        SupabaseDB[("🗄️ Supabase PostgreSQL DB<br/>Relational data & RLS policies")]
        SupabaseAuth["🔑 Supabase Auth & RBAC<br/>JWT Auth & Role Claims"]
        SupabaseStorage["☁️ Supabase Storage<br/>Course media & assignment files"]
        RedisCache["🚀 Redis Memory Cache<br/>Dashboard read query cache"]
        BullMQQueue["📬 BullMQ Worker Queue<br/>11:59 PM submission spike queue"]
    end

    Learner -->|HTTPS / PWA| Ta3App
    Creator -->|HTTPS / Web| Ta3App
    Admin -->|HTTPS / Web| Ta3App

    Ta3App -->|PostgREST API| SupabaseDB
    Ta3App -->|Auth SDK| SupabaseAuth
    Ta3App -->|S3 Upload/Download| SupabaseStorage
    Ta3App -->|Cache Queries| RedisCache
    Ta3App -->|Async Jobs| BullMQQueue
```

---

### Level 2: Container Diagram (Marketplace, Community & LMS)

```mermaid
graph TD
    subgraph Browser [" Client Web Browser / PWA "]
        subgraph FrontendSPA [" Ta3 Single Page Application "]
            UI["📱 React UI Components & Layouts"]
            MarketplaceUI["🛒 Marketplace & Checkout Console"]
            CommunityUI["💬 Skool-Style Community Feeds"]
            CreatorUI["📊 Creator Analytics & Payouts"]
            PWAEngine["🔌 Service Worker PWA & IndexedDB"]
        end
    end

    subgraph Backend [" Supabase Cloud & Resiliency Backend "]
        AuthSvc["🔐 Auth Service (GoTrue)"]
        PostgresDB[("DATABASE: PostgreSQL 15<br/>Relational Tables + RLS Policies")]
        StorageBuckets["🗂️ Storage Buckets"]
        TUSUpload["📦 TUS Resumable Upload Server"]
        RedisServer["🚀 Redis Cache Server"]
    end

    UI --> MarketplaceUI
    UI --> CommunityUI
    UI --> CreatorUI
    UI --> PWAEngine

    MarketplaceUI -->|Checkout & Orders| PostgresDB
    CommunityUI -->|Post Feed Queries| RedisServer
    CreatorUI -->|Earnings & Analytics| PostgresDB
    PWAEngine -->|Offline Sync| TUSUpload
    TUSUpload --> StorageBuckets
```

---

### Level 3: Code & Data Model Diagram (Expanded Marketplace Schema)

```mermaid
erDiagram
    PROFILES ||--o{ COURSES : "creates"
    PROFILES ||--o{ COMMUNITIES : "manages"
    COURSES ||--o{ COMMUNITIES : "includes"
    COMMUNITIES ||--o{ COMMUNITY_POSTS : "contains"
    PROFILES ||--o{ COMMUNITY_POSTS : "authors"
    PROFILES ||--o{ ORDERS : "purchases"
    COURSES ||--o{ ORDERS : "sold_in"
    PROFILES ||--o{ CREATOR_PAYOUTS : "receives"

    PROFILES {
        uuid id PK
        string name
        string username
        string role
        boolean is_creator
        string bio
        decimal wallet_balance
    }

    COURSES {
        bigint id PK
        string name
        string code
        uuid teacher_id FK
        string pricing_type
        integer price_cents
        string currency
    }

    COMMUNITIES {
        bigint id PK
        bigint course_id FK
        uuid creator_id FK
        string name
        string description
    }

    COMMUNITY_POSTS {
        bigint id PK
        bigint community_id FK
        uuid author_id FK
        string title
        string content
        integer likes_count
    }

    ORDERS {
        uuid id PK
        uuid student_id FK
        bigint course_id FK
        decimal amount_paid
        decimal platform_fee
        decimal creator_earnings
        string status
    }
```

---

## 🎨 Theme & Brand Color Guidelines (Strictly Preserved)
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
  - `Deep Umber`: `#260F14`
  - `Black Cherry`: `#4A151E`
  - `Charcoal`: `#161616`
  - `Stone`: `#3D3A3B`
- **Typography & Numerals**: RTL layout alignment, standard Arabic digits (1, 2, 3, 4, 5, 6, 7, 8, 9, 0).
