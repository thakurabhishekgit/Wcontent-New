
# Wcontent System Design

## 1. Introduction

Wcontent is a comprehensive platform designed to empower content creators by providing AI-driven tools for idea generation and performance prediction, alongside a marketplace for opportunities and collaborations. This document outlines the system architecture, key components, and design considerations for the Wcontent project.

## 2. Goals

*   **User-Friendly Interface:** Provide an intuitive and aesthetically pleasing experience for content creators.
*   **AI-Powered Assistance:** Offer intelligent tools to aid in content creation (ideas, headlines, outlines) and performance analysis.
*   **Opportunity Marketplace:** Connect creators with brands and businesses for paid gigs and projects.
*   **Collaboration Hub:** Facilitate connections between creators for joint ventures.
*   **Scalability:** Design the system to handle a growing number of users and data.
*   **Reliability:** Ensure the platform is stable and consistently available.
*   **Security:** Protect user data and ensure secure authentication and authorization.

## 3. Overall Architecture

The Wcontent platform follows a modern, multi-tiered, decoupled architecture designed for scalability and maintainability.

```mermaid
graph TD
    subgraph "User's Browser"
        UserClient[User on Web Browser]
    end

    subgraph "Frontend Tier (Next.js on Vercel)"
        Frontend[Next.js Application]
        style Frontend fill:#282a36,stroke:#bd93f9,stroke-width:2px

        subgraph "UI Pages"
            PageHome[/]
            PageGenerate[/generate]
            PagePredict[/predict]
            PageOpps[/opportunities]
            PageCollabs[/collabs]
            PageDashboard[/dashboard]
            PageTrending[/trending]
        end
    end

    subgraph "Backend Tier (Spring Boot on Render)"
        Backend[API Gateway & Controllers]
        style Backend fill:#44475a,stroke:#bd93f9,stroke-width:2px

        Security[Spring Security / JWT Filter]
        UserService[User & Auth Service]
        OppService[Opportunity Service]
        CollabService[Collaboration Service]
        AIProxyService[AI Proxy Service]

        Backend -- Routes to --> Security
        Security --> UserService
        Security --> OppService
        Security --> CollabService
        Security --> AIProxyService
    end
    
    subgraph "AI Service Layer (Genkit)"
        AI_Layer[Genkit Flows]
        style AI_Layer fill:#6272a4,stroke:#bd93f9,stroke-width:2px

        FlowGenerate[generateContentIdeas]
        FlowTrendArticle[generateTrendArticle]
        FlowChannelFit[analyzeChannelTrendFit]
        
        AI_Layer --> FlowGenerate
        AI_Layer --> FlowTrendArticle
        AI_Layer --> FlowChannelFit
    end

    subgraph "Data Tier (MongoDB on Atlas)"
        Database[MongoDB Database]
        style Database fill:#f1fa8c,stroke:#333,stroke-width:2px
        
        CollectionUsers[Users Collection]
        CollectionOpps[Opportunities Collection]
        CollectionCollabs[Collaborations Collection]
        
        Database --> CollectionUsers
        Database --> CollectionOpps
        Database --> CollectionCollabs
    end
    
    subgraph "External Services"
        ExternalServices[Third-Party APIs]
        style ExternalServices fill:#ffb86c,stroke:#333,stroke-width:2px

        GoogleGemini[Google Gemini API]
        SerpApi[SerpApi]
        YouTubeApi[YouTube Data API]
        GoogleOAuth[Google OAuth Provider]

        ExternalServices --> GoogleGemini
        ExternalServices --> SerpApi
        ExternalServices --> YouTubeApi
        ExternalServices --> GoogleOAuth
    end

    %% --- Connections ---
    UserClient --> Frontend

    Frontend -- "REST API Calls (HTTPS)" --> Backend

    UserService -- "CRUD" --> CollectionUsers
    OppService -- "CRUD" --> CollectionOpps
    CollabService -- "CRUD" --> CollectionCollabs
    
    AIProxyService -- "Calls AI flows" --> AI_Layer

    FlowGenerate -- "Generates text via" --> GoogleGemini
    FlowTrendArticle -- "Analyzes data via" --> GoogleGemini
    FlowTrendArticle -- "Gets trend data via" ---> SerpApi
    FlowChannelFit -- "Analyzes channel via" --> YouTubeApi
    
    UserService -- "Handles auth with" --> GoogleOAuth

```

**Components:**

*   **User's Browser/Device:** The client-side interface accessed by users.
*   **Frontend (Next.js on Vercel):** The user-facing application responsible for rendering all UI pages, handling user interactions, and making secure API calls to the backend.
*   **Backend (Spring Boot on Render):** The central nervous system of the platform. It exposes a RESTful API, handles all business logic through dedicated services (`UserService`, `OpportunityService`, etc.), enforces security with JWT, and acts as a proxy for AI tasks.
*   **AI Service Layer (Genkit):** An organized layer of server-side functions ("flows") that orchestrate interactions with external AI APIs. This keeps complex prompt engineering and AI logic separate from the main backend services.
*   **Data Tier (MongoDB on Atlas):** A managed NoSQL database storing all persistent data, including user profiles, opportunities, collaborations, and applications.
*   **External Services:** Third-party APIs that provide critical functionality:
    *   **Google Gemini API:** For all generative AI tasks.
    *   **SerpApi:** For fetching live, regional trending video data.
    *   **YouTube Data API:** For fetching specific channel statistics.
    *   **Google OAuth:** For handling social login.

## 4. Frontend Design

*   **Framework:** Next.js (App Router)
*   **Language:** JavaScript (JSX)
*   **UI Components:** Shadcn UI (built on Radix UI and Tailwind CSS)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
*   **Routing:** Next.js App Router
*   **API Communication:** Axios for making HTTP requests to the backend.
*   **Form Handling & Validation:** React Hook Form with Zod for schema validation.
*   **Key Responsibilities:**
    *   Rendering all user-facing pages: Home, Generate, Predict, Opportunities, Collabs, Trending, Dashboard, and Auth pages.
    *   Handling user input and form submissions with client-side validation.
    *   Managing authentication state (storing/clearing JWTs).
    *   Displaying data fetched from the backend in a responsive and accessible user interface.

## 5. Backend Design (Spring Boot & MongoDB)

*   **Framework:** Spring Boot
*   **Language:** Java
*   **Database:** MongoDB
*   **API Style:** RESTful APIs
*   **Layers:**
    *   **Controller Layer (`@RestController`):** Handles incoming HTTP requests and routes them to appropriate service methods.
    *   **Service Layer (`@Service`):** Contains the core business logic, organized into distinct services like `UserService`, `OpportunityService`, `CollaborationService`, and `EmailService`.
    *   **Repository Layer (`@Repository`):** Uses Spring Data MongoDB for all database operations.
    *   **Model Layer (POJOs with `@Document`):** Defines the data structures that map to MongoDB collections.
*   **Authentication & Authorization:**
    *   Uses Spring Security with a custom JWT filter.
    *   The `/login` endpoint validates credentials and issues a JWT.
    *   The JWT filter intercepts subsequent requests to validate the token and authorize access to protected resources.
*   **Key Responsibilities:**
    *   Secure user authentication (including Google OAuth) and authorization.
    *   CRUD operations for all platform entities.
    *   Business logic for managing applications and collaboration requests.
    *   Serving as a proxy to call Genkit AI flows and return results to the frontend.

## 6. AI & Machine Learning Layer

*   **Framework:** Genkit for LLM orchestration.
*   **Key AI Flows:**
    *   **`generateContentIdeas`:** Takes a prompt, tone, and format to generate content ideas, headlines, or outlines using the Gemini API.
    *   **`generateTrendArticle`:** Takes a video title and snippet (from SerpApi), then uses Gemini to generate a full analysis article and actionable creation steps.
    *   **`analyzeChannelTrendFit`:** Takes a user's channel handle and a trend description, uses the YouTube Data API to get channel stats, and then uses Gemini to provide a "fit analysis."
    *   **(Future) Future Reach Prediction Flow:** This will involve a custom-trained machine learning model (e.g., RandomForest Regressor) to predict potential reach based on content details and channel stats.
*   **Responsibilities:**
    *   Abstracting the complexities of interacting with LLMs.
    *   Defining structured inputs (Zod schemas) and outputs for all AI tasks.
    *   Managing prompts and model configurations for generation and analysis.

## 7. Database Design (MongoDB)

*   **Users Collection:** Stores user credentials, profile information, user type, and channel details.
*   **Opportunities Collection:** Stores all details for job/gig postings and includes an embedded array of `Applicant` documents.
*   **Collaborations Collection:** Stores all details for collaboration proposals and includes an embedded array of `CollabRequest` documents.
*   **Applications Collection:** (Alternative Design) Could be a top-level collection to track all applications, linked by `opportunityId` and `userId`.
*   **CollabRequests Collection:** (Alternative Design) Could be a top-level collection for all collaboration requests.

## 8. API Design

*   **Style:** RESTful
*   **Format:** JSON
*   **Authentication:** JWT Bearer Tokens
*   **Key Endpoint Categories:**
    *   `/api/users/auth/*`: Login, Register, OTP, OAuth.
    *   `/api/users/profile/*`: Get/Update user profile.
    *   `/api/users/opportunities/*`: CRUD for opportunities.
    *   `/api/users/collaborations/*`: CRUD for collaborations.
    *   `/api/users/application/*`: Apply for opportunity, get applications.
    *   `/api/users/collabration/*`: Apply for collab, get requests.
    *   `/api/ai/generate/*`: Endpoints to trigger Genkit flows for content generation.
    *   `/api/ai/predict/*`: Endpoints for prediction features.
    *   `/api/ai/trending/*`: Endpoints to fetch trending data and trigger analysis.

## 9. Scalability and Performance Considerations

*   **Frontend:** Vercel provides automatic scaling and a global CDN. Next.js server components reduce client-side load.
*   **Backend:** The stateless nature of the Spring Boot API allows for easy horizontal scaling (running multiple instances behind a load balancer).
*   **Database:** MongoDB Atlas provides seamless scaling. Proper indexing on frequently queried fields (e.g., `email` on users, `creatorId` on opportunities) will be crucial.
*   **AI Layer:** Genkit flows are serverless functions, which scale on demand. Rate limiting and caching will be implemented for AI API calls to manage costs.

## 10. Security Considerations

*   **Authentication:** Secure password hashing (bcrypt). Use HTTPS for all communication.
*   **Authorization:** Role-based access control (RBAC) to protect endpoints.
*   **Input Validation:** Validate all user inputs on both frontend (Zod) and backend (Spring Validation) to prevent injection attacks.
*   **Secrets Management:** All API keys and secrets will be stored as environment variables in Vercel and Render, never in the codebase.
*   **CORS:** Properly configured Cross-Origin Resource Sharing on the backend to only allow requests from the trusted frontend domain.

## 11. Deployment

*   **Frontend (Next.js):** Deployed to Vercel via a connected GitHub repository.
*   **Backend (Spring Boot):** Containerized using Docker and deployed to Render.
*   **Database (MongoDB):** Hosted on MongoDB Atlas.

This system design provides a robust, scalable, and maintainable foundation for the Wcontent platform.
