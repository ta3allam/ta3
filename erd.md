# 🗄️ PostgreSQL Database ERD Schema: Ta3 (تعلّم) Platform

```mermaid
erDiagram
    PROFILES ||--o{ COMMUNITY_POSTS : "authors"
    PROFILES ||--o{ POST_COMMENTS : "comments"
    COMMUNITY_POSTS ||--o{ POST_COMMENTS : "contains"
    COMMUNITY_POSTS ||--o{ POST_UPVOTES : "receives"
    PROFILES ||--o{ POST_UPVOTES : "casts"
    
    PROFILES ||--o{ COURSES : "teaches"
    PROFILES ||--o{ ENROLLMENTS : "enrolled in"
    COURSES ||--o{ ENROLLMENTS : "has"
    COURSES ||--o{ LECTURES : "contains"
    COURSES ||--o{ COURSE_RESOURCES : "provides"
    LECTURES ||--o{ LECTURE_CHAPTERS : "has"
    LECTURES ||--o{ MATERIALS : "includes"
    COURSES ||--o{ ASSIGNMENTS : "assigns"
    ASSIGNMENTS ||--o{ SUBMISSIONS : "receives"
    PROFILES ||--o{ SUBMISSIONS : "submits"
    PROFILES ||--o{ ORDERS : "places"
    COURSES ||--o{ ORDERS : "sold_in"

    PROFILES {
        uuid id PK
        string name
        string username UK
        string role
        integer level
        integer xp_points
        string avatar_url
        decimal wallet_balance
        boolean is_creator
        timestamp created_at
    }

    COMMUNITY_POSTS {
        string id PK
        string channel_id
        uuid author_id FK
        string title
        string content
        string code_snippet
        string code_language
        text_array tags
        integer upvotes_count
        integer comments_count
        boolean is_pinned
        timestamp created_at
    }

    POST_COMMENTS {
        string id PK
        string post_id FK
        uuid author_id FK
        string content
        integer upvotes_count
        timestamp created_at
    }

    POST_UPVOTES {
        uuid id PK
        string post_id FK
        uuid user_id FK
        integer xp_awarded
        timestamp created_at
    }

    COURSES {
        bigserial id PK
        string code UK
        string name
        string category
        string difficulty
        uuid teacher_id FK
        string pricing_type
        integer price_cents
        string currency
        string bg_image
        timestamp created_at
    }

    ORDERS {
        uuid id PK
        uuid student_id FK
        bigint course_id FK
        decimal amount_paid
        decimal platform_fee
        decimal creator_earnings
        string payment_method
        string receipt_url
        string status
        timestamp created_at
    }

    ENROLLMENTS {
        bigserial id PK
        uuid student_id FK
        bigint course_id FK
        timestamp enrolled_at
    }

    LECTURES {
        bigserial id PK
        bigint course_id FK
        string title
        string description
        string duration
        string video_url
        string audio_url
        int order_num
        timestamp created_at
    }

    ASSIGNMENTS {
        bigserial id PK
        bigint course_id FK
        string title
        string description
        timestamp due_date
        timestamp created_at
    }

    SUBMISSIONS {
        bigserial id PK
        bigint assignment_id FK
        uuid student_id FK
        string file_url
        string notes
        numeric grade
        string feedback
        timestamp submitted_at
    }

    LECTURE_CHAPTERS {
        uuid id PK
        bigint lecture_id FK
        string title
        int timestamp_sec
        int order_num
    }

    COURSE_RESOURCES {
        string id PK
        bigint course_id FK
        string title
        string category
        string file_size
        string download_url
        int download_count
        timestamp created_at
    }

    AFFILIATE_COURSES {
        string id PK
        string title
        string original_title
        string provider
        string category
        numeric rating
        integer review_count
        string instructor
        string duration
        string level
        boolean has_arabic_subtitles
        string affiliate_url
        string coupon_code
        integer discount_percentage
        numeric original_price_usd
        numeric discounted_price_usd
        boolean is_free
        boolean certificate_included
        text_array key_skills
    }

    AFFILIATE_CLICKS {
        uuid id PK
        string affiliate_course_id FK
        uuid user_id FK
        string referrer_source
        timestamp clicked_at
    }

    PAYMENT_RECEIPTS {
        string id PK
        bigint course_id FK
        string course_name
        string course_code
        string student_id FK
        string student_name
        string student_email
        string student_phone
        decimal amount
        string currency
        string payment_method
        string transaction_reference UK
        string receipt_image_url
        string receipt_image_name
        string sender_name_or_phone
        string student_notes
        string status
        string rejection_reason
        decimal creator_earnings
        decimal platform_fee
        timestamp created_at
        timestamp verified_at
        string verified_by
    }
```
