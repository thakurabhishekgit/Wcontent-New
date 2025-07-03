
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

The Wcontent platform follows a modern, multi-tiered architecture:

```mermaid
graph LR
    subgraph User Interaction
        A[User's Browser/Device]
    end

    subgraph Frontend (Next.js on Vercel)
        B[Next.js Frontend]
        B -- HTTPS API Calls --> C
    end

    subgraph Backend (Spring Boot on Render/Cloud Platform)
        C[Spring Boot API Gateway/Controllers]
        C -- Business Logic --> D[Service Layer]
        D -- Data Access --> E[Repository Layer (Spring Data MongoDB)]
        E -- CRUD Operations --> F[MongoDB Database]
        C -- AI/ML Tasks --> G[AI & ML Layer]
    end

    subgraph AI Layer (Genkit / Custom ML Models)
        G -- Calls LLMs --> H[Large Language Models]
        G -- YouTube Data --> I[YouTube API]
        G -- ML Predictions --> J[RandomForest Model]
    end

    A --> B;
```

**Components:**

*   **User's Browser/Device:** The client-side interface accessed by users.
*   **Frontend (Next.js):**
    *   Hosted on Vercel.
    *   Responsible for rendering the user interface, handling user interactions, managing client-side state, and making API calls to the backend.
    *   Utilizes Next.js App Router, Server Components, and Client Components.
*   **Backend (Spring Boot):**
    *   Hosted on a cloud platform like Render, Heroku, or AWS.
    *   Exposes a RESTful API for the frontend to consume.
    *   Handles business logic, user authentication, data persistence, and integration with the AI layer.
*   **AI & ML Layer:**
    *   Likely integrated within the Spring Boot backend or deployed as separate microservices.
    *   Manages interactions with Large Language Models (LLMs) for content generation and NLP tasks.
    *   Serves the custom-trained **RandomForest** model for prediction tasks.
    *   Interacts with external APIs like the YouTube API for data retrieval.
*   **MongoDB Database:**
    *   A NoSQL document database used to store user profiles, opportunity listings, collaboration posts, applications, and other platform data.
*   **External Services:**
    *   **LLM APIs:** For AI-powered text generation and analysis.
    *   **YouTube API:** For fetching YouTube video comments and other video metadata.

## 4. Frontend Design

*   **Framework:** Next.js (App Router)
*   **Language:** JavaScript (JSX)
*   **UI Components:** Shadcn UI (built on Radix UI and Tailwind CSS)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
*   **Routing:** Next.js App Router
*   **API Communication:** Axios for making HTTP requests to the backend.
*   **Form Handling & Validation:** React Hook Form with Zod for schema validation.
*   **Key Responsibilities:**
    *   Rendering all user-facing pages (Home, Generate, Predict, Opportunities, Collabs, Dashboard, Auth).
    *   Handling user input and form submissions.
    *   Client-side validation.
    *   Managing authentication state (storing/clearing tokens).
    *   Displaying data fetched from the backend.
    *   Providing a responsive and accessible user experience.

## 5. Backend Design (Spring Boot & MongoDB)

*   **Framework:** Spring Boot
*   **Language:** Java
*   **Database:** MongoDB
*   **API Style:** RESTful APIs
*   **Layers:**
    *   **Controller Layer (`@RestController`):**
        *   Handles incoming HTTP requests (GET, POST, PUT, DELETE).
        *   Maps requests to specific service methods.
        *   Performs initial request validation (e.g., path variables, request parameters).
        *   Handles request/response serialization (JSON).
        *   Manages API versioning.
    *   **Service Layer (`@Service`):**
        *   Contains the core business logic of the application.
        *   Orchestrates interactions between controllers and repositories.
        *   Implements data validation, transformation, and complex operations.
        *   Handles transactions where necessary.
        *   Interacts with the AI & ML layer for intelligent features.
    *   **Repository Layer (`@Repository`, Spring Data MongoDB):**
        *   Provides an abstraction over MongoDB.
        *   Uses Spring Data MongoDB interfaces (e.g., `MongoRepository`) for CRUD operations.
        *   Defines custom queries if needed.
    *   **Model Layer (POJOs with `@Document`):**
        *   Defines the data structures (entities) that map to MongoDB collections (e.g., User, Opportunity, Collaboration, Application, CollabRequest).
*   **Authentication & Authorization:**
    *   Likely uses Spring Security with JWT (JSON Web Tokens).
    *   Login endpoint validates credentials and issues a JWT.
    *   Subsequent requests from the frontend include the JWT in the Authorization header.
    *   Spring Security filters intercept requests to validate the JWT and authorize access to protected resources.
*   **Error Handling:**
    *   Global exception handling (`@ControllerAdvice`) to provide consistent error responses.
*   **Key Responsibilities:**
    *   Secure user authentication and authorization.
    *   CRUD operations for all platform entities (users, opportunities, collabs, etc.).
    *   Business logic for matching, recommendations (future), and managing applications.
    *   Serving data to the frontend.
    *   Interacting with the AI & ML layer for intelligent features.

## 6. AI & Machine Learning Layer

*   **Frameworks:** Genkit for LLM orchestration, Scikit-learn (or similar) for ML models.
*   **Integration:**
    *   AI/ML tasks are exposed as services that the Spring Boot backend can call.
    *   Genkit flows are used for tasks involving Large Language Models (LLMs), such as content generation.
*   **Key AI/ML Features:**
    *   **Content Generation (`generateContentIdeas`):** A Genkit flow that takes a prompt, tone, and format to generate content ideas, headlines, and outlines using an LLM.
    *   **YouTube Comment Sentiment Analysis:**
        1.  Backend fetches comments using the YouTube API.
        2.  Comments are passed to an NLP model (e.g., via a Genkit flow) for sentiment summarization and identification of key themes.
    *   **Future Reach Prediction Flow:** This involves a custom-trained machine learning model.
        *   **Model:** A **RandomForest Regressor** model is trained on historical data (e.g., content type, channel stats, engagement metrics).
        *   **Process:** The model takes new content details (type, description) and current channel stats to predict potential reach (views, likes, comments) and engagement metrics.
*   **Responsibilities:**
    *   Abstracting the complexities of interacting with LLMs and ML models.
    *   Defining structured inputs (Zod schemas for Genkit) and outputs for AI tasks.
    *   Managing prompts and model configurations for generation.
    *   Handling the training, evaluation, and serving of the reach prediction model.

## 7. Database Design (MongoDB)

*   **Users Collection:**
    *   `_id` (ObjectId, PK)
    *   `username` (String, Unique)
    *   `email` (String, Unique)
    *   `password` (String, Hashed)
    *   `userType` (String: "ChannelOwner", "RoleSeeker")
    *   `channelName` (String, Optional for RoleSeeker)
    *   `channelId` (String, Optional for RoleSeeker)
    *   `channelURL` (String, Optional for RoleSeeker)
    *   `verified` (Boolean)
    *   `createdAt`, `updatedAt` (Timestamps)
*   **Opportunities Collection:**
    *   `_id` (ObjectId, PK)
    *   `creatorId` (ObjectId, FK to Users)
    *   `title` (String)
    *   `description` (String)
    *   `requirements` (String)
    *   `location` (String)
    *   `type` (String: "Paid Gig", "Sponsored Content", etc.)
    *   `salaryRange` (String)
    *   `email` (String, contact email for opportunity)
    *   `isFilled` (Boolean)
    *   `postedDate` (Date, Default to now)
    *   `createdAt`, `updatedAt` (Timestamps)
*   **Collaborations Collection:**
    *   `_id` (ObjectId, PK)
    *   `creatorId` (ObjectId, FK to Users)
    *   `title` (String)
    *   `description` (String)
    *   `contentCategory` (String)
    *   `collaborationType` (String)
    *   `timeline` (String)
    *   `email` (String, contact email for collaboration)
    *   `open` (Boolean, is the collaboration still open for requests)
    *   `postedDate` (Date, Default to now)
    *   `createdAt`, `updatedAt` (Timestamps)
*   **Applications Collection (for Opportunities):**
    *   `_id` (ObjectId, PK)
    *   `opportunityId` (ObjectId, FK to Opportunities)
    *   `userId` (ObjectId, FK to Users - applicant)
    *   `name` (String, applicant name)
    *   `email` (String, applicant email)
    *   `resumeUrl` (String, link to portfolio/resume)
    *   `applicationDate` (Date)
    *   `status` (String: "Pending", "Viewed", "Accepted", "Rejected" - Future)
    *   `createdAt`, `updatedAt` (Timestamps)
*   **CollabRequests Collection (for Collaborations):**
    *   `_id` (ObjectId, PK)
    *   `collaborationId` (ObjectId, FK to Collaborations)
    *   `userId` (ObjectId, FK to Users - requester)
    *   `requesterName` (String)
    *   `requesterEmail` (String)
    *   `message` (String)
    *   `appliedDate` (Date)
    *   `status` (String: "Pending", "Accepted", "Rejected" - Future)
    *   `createdAt`, `updatedAt` (Timestamps)

## 8. API Design

*   **Style:** RESTful
*   **Format:** JSON
*   **Authentication:** JWT Bearer Tokens
*   **Key Endpoint Categories:**
    *   `/api/users/auth/*`: Login, Register, OTP
    *   `/api/users/profile/*`: Get user, Update profile
    *   `/api/users/opportunities/*`: CRUD for opportunities, get all, get by user
    *   `/api/users/collaborations/*`: CRUD for collaborations, get all, get by user
    *   `/api/users/applications/*`: Apply for opportunity, get applications for an opportunity, get applications by user
    *   `/api/users/collabrequests/*`: Send collab request, get requests for a collaboration, get requests by user
    *   `/api/ai/generate/*`: Endpoints to trigger Genkit flows (e.g., content ideas)
    *   `/api/ai/predict/*`: Endpoints for prediction features (e.g., YouTube comment analysis, future reach)

## 9. Scalability and Performance Considerations

*   **Frontend:**
    *   Vercel provides automatic scaling and CDN for static assets.
    *   Next.js ISR (Incremental Static Regeneration) or SSR for dynamic content can optimize load times.
    *   Code splitting by Next.js reduces initial bundle size.
    *   Image optimization with `next/image`.
*   **Backend:**
    *   Stateless Spring Boot application to allow horizontal scaling (running multiple instances behind a load balancer).
    *   Efficient database queries and indexing in MongoDB.
    *   Caching for frequently accessed, non-critical data (e.g., using Redis or Ehcache).
    *   Asynchronous processing for long-running tasks (e.g., sending emails, complex AI jobs).
*   **Database (MongoDB):**
    *   Proper indexing on frequently queried fields.
    *   Consider replica sets for high availability and read scaling.
    *   Sharding for very large datasets (future consideration).
*   **AI Layer:**
    *   Genkit flows should be optimized for latency.
    *   Rate limiting for AI API calls to manage costs and prevent abuse.

## 10. Security Considerations

*   **Authentication:** Secure password hashing (e.g., bcrypt) on the backend. Use HTTPS for all communication.
*   **Authorization:** Role-based access control (RBAC) using Spring Security to protect endpoints based on user roles (e.g., only the creator of an opportunity can edit it).
*   **Input Validation:** Validate all user inputs on both frontend (Zod) and backend (Spring Validation) to prevent injection attacks (XSS, SQLi - though NoSQL, principles apply).
*   **Data Protection:** Securely store sensitive data. Be mindful of PII.
*   **API Security:**
    *   Use JWTs for stateless authentication.
    *   Implement rate limiting to prevent abuse.
    *   Protect against CSRF if using session-based features (though JWTs are generally less susceptible).
*   **Dependency Management:** Regularly update dependencies to patch security vulnerabilities.
*   **CORS:** Properly configure Cross-Origin Resource Sharing on the backend to only allow requests from the trusted frontend domain.

## 11. Deployment

*   **Frontend (Next.js):** Vercel is the recommended platform due to its seamless integration with Next.js.
    *   Connect Git repository (GitHub, GitLab, Bitbucket).
    *   Vercel auto-detects Next.js and configures build settings.
    *   Set environment variables (e.g., `NEXT_PUBLIC_API_BASE_URL`).
*   **Backend (Spring Boot):**
    *   Containerize the Spring Boot application using Docker.
    *   Deploy to a platform like:
        *   **Render:** Good for ease of use and integrated services (like managed databases).
        *   **Heroku:** Another PaaS option.
        *   **AWS Elastic Beanstalk, Google Cloud Run, Azure App Service:** More comprehensive cloud options.
    *   Set environment variables (database connection strings, API keys for external services, JWT secret).
*   **Database (MongoDB):**
    *   Use a managed MongoDB service like MongoDB Atlas, or a managed database offering from the backend hosting provider (e.g., Render's managed PostgreSQL if switching, or a MongoDB add-on).
*   **Genkit AI Layer:**
    *   If embedded in Spring Boot, it deploys with the backend.
    *   If a separate service, it can be containerized and deployed similarly to the backend, or using serverless functions if appropriate for the workload.

## 12. Detailed User Interaction Data Examples

### 12.1. Posting an Opportunity (Channel Owners)

When a `ChannelOwner` (or any user posting an opportunity) fills out the form, they provide the following data:

*   **Opportunity Title:** (String) - *Example: "Sponsored Video: New Gaming Headset Review"*
*   **Description:** (String, Rich Text expected on frontend) - Detailed explanation of the opportunity. *Example: "Create a 5-7 minute engaging YouTube video reviewing the HyperX Cloud X headset. Must cover unboxing, key features, audio quality, and comfort. We will provide the headset. Final video due within 2 weeks of receiving the product."*
*   **Requirements:** (String, Plain Text) - Necessary skills, experience, audience size. *Example: "Must have 20k+ subscribers on YouTube, experience reviewing tech products, high-quality recording equipment, and strong video editing skills. Please include links to 3 prior product review videos in your application."*
*   **Location:** (String) - Where the opportunity is based. *Example: "Remote", "New York, NY", "Bali, Indonesia (Travel Provided)"*
*   **Opportunity Type:** (String, from predefined list) - Category of the opportunity. *Example options: "Paid Gig", "Sponsored Content", "Full-Time Role", "Part-Time Role", "Travel Opportunity", "Product Review", "Contract Role", "Other"*
*   **Contact Email:** (String, Email Format) - Email for applications and inquiries. *Example: "sponsorships@gadgetco.com"*
*   **Budget / Salary Range:** (String) - Compensation details. *Example: "$500 flat fee", "$0.05 per view + product", "$30/hour", "Negotiable based on experience"*
*   **Filled Status:** (Boolean) - Checkbox indicating if the opportunity is no longer available.

This data is sent to the backend API (e.g., `POST /api/users/opportunities/opportunity/{userId}`) and stored in the `Opportunities` collection in MongoDB.

### 12.2. Applying for an Opportunity/Collaboration (Role Seeker / Any User)

When a user applies for an opportunity or requests to join a collaboration, they submit:

*   **Name:** (String) - The applicant's full name.
*   **Email:** (String, Email Format) - Applicant's contact email.
*   **Portfolio/Resume Link:** (String, URL) - Link to showcase their work (e.g., YouTube channel, portfolio website, LinkedIn profile). *Example: "https://www.youtube.com/mychannel", "https://myportfolio.com/reviews", "https://linkedin.com/in/myprofile"*
*   **Application Date:** (Date) - Automatically captured by the system.
*   **Message (for Collabs):** (String, Text) - A message introducing themselves and explaining their interest in the collaboration. *Example: "Hi [Creator Name], I love your [Content Category] content! I think our audiences would really enjoy a joint [Collaboration Type] video. I have [Number] subscribers and my videos average [Number] views. Let me know if you're interested in discussing ideas!"*

This data is sent to the respective backend API (e.g., `POST /api/users/application/opportunity/{oppId}/apply` or `POST /api/users/collabration/applyForCollab/{collabId}`) and stored in the `Applications` or `CollabRequests` collection.

### 12.3. Using the Future Reach Predictor (All Users)

For the future reach prediction feature on the `/predict` page, users input:

*   **Content Type/Genre:** (String) - The type or genre of the planned content. *Example: "Tech Review", "Comedy Skit", "Travel Vlog", "Educational Tutorial"*
*   **Brief Content Description:** (String, Text) - A summary of the content idea, including topic, format, and target audience. *Example: "A 10-minute video reviewing the latest iPhone, focusing on camera improvements and battery life, targeted at tech enthusiasts."*
*   **Current Subscriber Count:** (Number, Optional) - The user's current number of subscribers on their primary platform (e.g., YouTube). *Example: 15000*
*   **Average Views Per Video:** (Number, Optional) - The user's typical average views for recent videos. *Example: 5000*
*   **Estimated Production Cost ($):** (Number, Optional) - Approximate cost to produce the content. *Example: 100*

This input is sent to an AI/ML service, which uses a **RandomForest Regressor** model to estimate:

*   **Predicted Views:** (Number)
*   **Predicted Likes:** (Number)
*   **Predicted Comments:** (Number)
*   **Prediction Description/Summary:** (String) - A textual summary of the prediction and factors.
*   **Improvement Tips:** (String, generated on request) - Actionable advice to potentially enhance the content's reach.

The frontend then visualizes this data, potentially including charts and graphs.

## 13. Future Considerations

*   **Real-time Notifications:** (e.g., using WebSockets or Server-Sent Events for new opportunities, application updates).
*   **Messaging System:** Direct messaging between creators or between creators and opportunity posters.
*   **Advanced Search & Filtering:** More sophisticated filtering options.
*   **Recommendation Engine:** Suggesting relevant opportunities or collaborations to users based on their profile and activity.
*   **Content Performance Analytics Dashboard:** Deeper integration with YouTube analytics or other platforms.
*   **Monetization Features:** Premium subscriptions for advanced AI features or higher visibility for listings.
*   **Mobile Application:** Native mobile apps for iOS and Android.

This system design provides a solid foundation for the Wcontent platform, balancing functionality, scalability, and maintainability.
