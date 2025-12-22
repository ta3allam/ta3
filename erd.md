```mermaid
erDiagram
    UNIVERSITY ||--o{ DEPARTMENT : "contains"
    DEPARTMENT ||--o{ COURSE : "offers"
    COURSE ||--o{ ENROLLMENT : "has"
    STUDENT ||--o{ ENROLLMENT : "enrolls in"
    
    COURSE ||--o{ ASSIGNMENT : "includes"
    ASSIGNMENT ||--o{ SUBMISSION : "receives"
    STUDENT ||--o{ SUBMISSION : "submits"
    
    COURSE ||--o{ ANNOUNCEMENT : "has"
    COURSE ||--o{ LECTURE : "contains"
    LECTURE ||--o{ MATERIAL : "includes"

    UNIVERSITY {
        int id PK
        string name
        string location
    }
    DEPARTMENT {
        int id PK
        string name
        int university_id FK
    }
    COURSE {
        int id PK
        string name
        string code
        int credits
        string description
        string semester
        int department_id FK
        int teacher_id FK
    }
    ENROLLMENT {
        int id PK
        int course_id FK
        int student_id FK
        date enrolled_at
    }
    ASSIGNMENT {
        int id PK
        string title
        string description
        string attachment_url
        datetime deadline
        int course_id FK
    }
    SUBMISSION {
        int id PK
        string file_url
        datetime submitted_at
        int grade
        int assignment_id FK
        int student_id FK
    }
    ANNOUNCEMENT {
        int id PK
        string title
        string content
        datetime created_at
        int course_id FK
    }
    LECTURE {
        int id PK
        string title
        string description
        int course_id FK
    }
    MATERIAL {
        int id PK
        string title
        string file_url
        string file_type
        int lecture_id FK
    }
    TEACHER {
        int id PK
        string name
        string email
    }
    ADMIN {
        int id PK
        string name
        string email
    }
    STUDENT {
        int id PK
        string name
        string email
    }
