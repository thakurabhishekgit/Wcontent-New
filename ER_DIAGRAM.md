
# Entity-Relationship (ER) Diagram for Wcontent

This diagram illustrates the database schema, showing the main entities and the relationships between them.

```mermaid
erDiagram
    USER {
        string id PK
        string username
        string email
        string password
        string userType
        string channelName
        string channelId
        string channelURL
        boolean verified
    }

    OPPORTUNITY {
        string id PK
        string title
        string description
        string requirements
        string location
        string type
        string salaryRange
        string email
        boolean isFilled
        string creatorId FK
    }

    APPLICANT {
        string applicantId PK
        string name
        string email
        string resumeUrl
        date applicationDate
        string applicantUserId FK
    }

    COLLABORATION {
        string id PK
        string title
        string description
        string contentCategory
        string collaborationType
        string timeline
        string email
        boolean isOpen
        string creatorId FK
    }

    COLLAB_REQUEST {
        string requestId PK
        string requesterName
        string requesterEmail
        string message
        date appliedDate
        string requesterUserId FK
    }

    USER ||--o{ OPPORTUNITY : "posts"
    USER ||--o{ COLLABORATION : "posts"
    
    OPPORTUNITY ||--|{ APPLICANT : "receives"
    USER ||--o{ APPLICANT : "submits"
    
    COLLABORATION ||--|{ COLLAB_REQUEST : "receives"
    USER ||--o{ COLLAB_REQUEST : "submits"

```

### Relationships Explained

*   **USER and OPPORTUNITY (One-to-Many):** One `USER` (specifically a "ChannelOwner") can post many `OPPORTUNITY` listings.
*   **USER and COLLABORATION (One-to-Many):** One `USER` can post many `COLLABORATION` proposals.
*   **OPPORTUNITY and APPLICANT (One-to-Many):** One `OPPORTUNITY` can receive many `APPLICANT` submissions. In the current implementation, applicants are embedded within the opportunity document.
*   **USER and APPLICANT (One-to-Many):** One `USER` (a "RoleSeeker") can submit many `APPLICANT` records (i.e., apply to many jobs).
*   **COLLABORATION and COLLAB_REQUEST (One-to-Many):** One `COLLABORATION` proposal can receive many `COLLAB_REQUEST`s.
*   **USER and COLLAB_REQUEST (One-to-Many):** One `USER` can send many `COLLAB_REQUEST`s.
