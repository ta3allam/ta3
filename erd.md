```mermaid
erDiagram
    UNIVERSITY ||--o{ DEPARTMENT : يحتوي
    DEPARTMENT ||--o{ SUBJECT : يقدم
    SUBJECT ||--o{ TEACHER : يدرس
    SUBJECT ||--|| ADMIN : يدير
    SUBJECT ||--o{ STUDENT : يسجل
    SUBJECT ||--o{ ASSIGNMENT : يتضمن

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
    SUBJECT {
        int id
        string name
        string code
        int credits
        string description
        string season
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
