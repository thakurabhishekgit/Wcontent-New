
# UML Diagrams for Wcontent

This file contains key UML diagrams that model the system's behavior and structure, including Use Case, Sequence, and Class diagrams.

---

## 1. Use Case Diagram

This diagram shows the interactions between users (Actors) and the main features (Use Cases) of the Wcontent system.

```mermaid
graph TD
    subgraph "Wcontent System"
        UC1(Generate Content Ideas)
        UC2(Analyze Trends)
        UC3(Predict Performance)
        UC4(Post Opportunity)
        UC5(Browse & Apply for Opportunities)
        UC6(Post Collaboration)
        UC7(Browse & Request Collaborations)
        UC8(Manage Dashboard)
        UC9(Manage User Profile)
    end

    ActorCreator[Content Creator]
    ActorBrand[Brand / Opportunity Poster]

    ActorCreator --> UC1
    ActorCreator --> UC2
    ActorCreator --> UC3
    ActorCreator --> UC5
    ActorCreator --> UC6
    ActorCreator --> UC7
    ActorCreator --> UC8
    ActorCreator --> UC9
    
    ActorBrand --> UC4
    ActorBrand --> UC8
    ActorBrand --> UC9

    UC4 ..> UC8 : include
    UC6 ..> UC8 : include
```

---

## 2. Sequence Diagram: Applying for an Opportunity

This diagram illustrates the sequence of interactions when a user applies for an opportunity.

```mermaid
sequenceDiagram
    participant User as User's Browser (Frontend)
    participant Backend as Spring Boot API
    participant DB as MongoDB Database
    participant Email as Email Service

    User->>Backend: POST /api/users/application/opportunity/{id}/apply
    activate Backend

    Backend->>DB: findById(opportunityId)
    activate DB
    DB-->>Backend: Return Opportunity
    deactivate DB

    Backend->>Backend: Add applicant to opportunity's list
    Backend->>DB: save(opportunity)
    activate DB
    DB-->>Backend: Return updated opportunity
    deactivate DB
    
    Backend->>Email: sendNewApplicationNotification(owner)
    activate Email
    Email-->>Backend: 
    deactivate Email

    Backend->>Email: sendApplicationConfirmation(applicant)
    activate Email
    Email-->>Backend: 
    deactivate Email

    Backend-->>User: 200 OK (Application Submitted)
    deactivate Backend
```

---

## 3. Class Diagram

This diagram shows the main classes in the backend (Java/Spring Boot) and their relationships. It provides a static view of the system's structure.

```mermaid
classDiagram
    class User {
        +String id
        +String username
        +String email
        +String password
        +String userType
        +List~Collaboration~ collaborations
    }

    class PostOpportunity {
        +String id
        +String title
        +String description
        +String location
        +List~Applicant~ applicants
        +String creatorId
    }
    
    class Applicant {
        +String name
        +String email
        +String resumeUrl
        +Date applicationDate
    }

    class Collaboration {
        +String id
        +String title
        +String description
        +String email
        +List~CollabRequest~ collabs
        +String creatorId
    }

    class CollabRequest {
        +String requesterName
        +String requesterEmail
        +String message
        +Date appliedDate
    }
    
    class UserController {
        +registerUser(User)
        +loginUser(User)
        +updateUser(id, User)
        +getUser(id)
    }

    class OpportunityController {
        +postOpportunity(userId, PostOpportunity)
        +getAllOpportunities()
        +getMyOpportunities(userId)
    }
    
    class ApplicantsController {
        +applyToOpportunity(oppId, Applicant)
        +getApplicantsForOpportunity(oppId)
    }

    class CollaborationController {
        +addCollab(userId, Collaboration)
        +applyForCollab(collabId, CollabRequest)
    }
    
    UserController ..> User
    OpportunityController ..> PostOpportunity
    ApplicantsController ..> Applicant
    CollaborationController ..> Collaboration
    
    User "1" -- "0..*" PostOpportunity : posts
    User "1" -- "0..*" Collaboration : posts
    PostOpportunity "1" -- "0..*" Applicant : has
    Collaboration "1" -- "0..*" CollabRequest : has
```
