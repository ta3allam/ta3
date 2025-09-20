```mermaid
erDiagram
    UNIVERSITY ||--o{ DEPARTMENT : يحتوي
    DEPARTMENT ||--o{ Course : يقدم
    Course ||--o{ TEACHER : يدرس
    Course ||--|| ADMIN : يدير
    Course ||--o{ STUDENT : يسجل
    Course ||--o{ ASSIGNMENT : يتضمن

    UNIVERSITY {
        int id
        string name
        string location
    }
    DEPARTMENT {
        int id
        string name
        string head
    }
    Course {
        int id
        string name
        string code
        int credits
        string description
        string season
        array materials
        string announcements
    }
    TEACHER {
        int id
        string name
        string email
    }
    ADMIN {
        int id
        string name
        string email
    }
    STUDENT {
        int id
        string name
        string email
    }
    ASSIGNMENT {
        int id
        string title
        string deadline
        string description
    }
