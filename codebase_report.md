# Project Codebase Analysis Report

## 1. Executive Summary
The project is a **MERN Stack (MongoDB, Express, React, Node.js)** Campus Placement System enhanced with **Generative AI (Gemini)** features. While the project vision describes a fully autonomous "Agentic AI" that builds itself, the current implementation is a standard web application with specific AI-powered student tools integrated via backend services.

## 2. Architecture Overview
- **Frontend**: React.js with TailwindCSS (located in `/frontend`).
- **Backend**: Node.js + Express (located in `/backend`).
- **Database**: MongoDB (using Mongoose ODM).
- **AI Integration**: Google Gemini API via `geminiService.js` in the backend.
- **Microservices/Agents**: The `ai-agents` directory is currently a placeholder (`agent_runner.py`), suggesting the autonomous agent feature is planned but not yet active.

## 3. Detailed Component Analysis

### A. Backend (`/backend`)
The backend is structured around RESTful APIs protected by JWT authentication.

#### Key Routes & Controllers
1.  **AI Routes (`/routes/aiRoutes.js`)**:
    *   **Job Recommendations** (`POST /job-recommendations`): Compares student profiles (skills, GPA) with active jobs using Gemini to calculate match scores and reasoning.
    *   **Interview Prep** (`POST /interview/start-session`, `/submit-answer`): Generates custom interview questions and evaluates student answers with detailed feedback (score, strengths, improvements).
    *   **Cover Letter** (`POST /cover-letter/generate`, `/refine`): Generates personalized cover letters based on resume data and job descriptions.

2.  **Admin Routes (`/routes/adminRoutes.js`)**:
    *   Manages jobs, companies, and student data.

3.  **Resume Routes (`/routes/resumeRoutes.js`)**:
    *   Handles resume parsing and management.

#### Core Services
-   **Gemini Service (`/services/geminiService.js`)**:
    *   Directly interfaces with `@google/generative-ai`.
    *   Contains specific prompt templates for JSON-formatted responses (Job Matching, Interview Evaluation).
    *   Includes **fallback mechanisms** (mock data) if the AI API is unavailable or returns invalid formats.

### B. Frontend (`/frontend`)
The frontend provides a rich user interface for students and admins.

#### Key Pages (`/src/pages`)
-   **AI Features**:
    *   `JobRecommendations.jsx`: Displays AI-curated job matches.
    *   `InterviewPrep.jsx`, `AIInterviewPrep.jsx`: UI for selecting interview topics and taking practice sessions.
    *   `CoverLetterGenerator.jsx`: Form to input job details and view generated letters.
    *   `ResumeAnalysisPage.jsx`: Visual feedback on resume strength.
-   **Core Platform**:
    *   `Dashboard.jsx`, `Profile.jsx`: User management and overview.
    *   `Jobs.jsx`, `Companies.jsx`: Standard job board functionality.

### C. Data Models (`/backend/models`)
-   **User**: Base authentication model.
-   **Student**: Extended profile with skills, GPA, experience (critical for AI matching).
-   **Job**: Job postings with requirements.
-   **InterviewSession**: Stores questions, user answers, and AI evaluations for history tracking.

## 4. Current Code Flow (AI Feature Example)
**Scenario: Student requests Job Recommendations**
1.  **Frontend**: `JobRecommendations.jsx` calls API `POST /api/ai/job-recommendations` with the user's token.
2.  **Backend Route**: `aiRoutes.js` validates the user and fetches the `Student` profile and all active `Job` listings from MongoDB.
3.  **AI Service**: `geminiService.generateJobRecommendations()` constructs a prompt containing the student's skills and a list of jobs.
4.  **Gemini API**: Returns a JSON string ranking the jobs.
5.  **Backend Response**: The API parses the JSON and returns enriched objects to the frontend.
6.  **Frontend Display**: Renders the matched jobs with "Match Score" and specific "Missing Skills" highlighted.

## 5. Vision vs. Reality
-   **Vision**: "Self-evolving system where the AI writes its own code."
-   **Reality**: High-quality MERN app with *features* powered by AI, but the code itself is manually written. The `ai-agents/agent_runner.py` file is currently empty, indicating the "Auto-DevOps" part is a future roadmap item.

## 6. Conclusion
The system is functionally complete as a **Smart Placement Portal**. The AI integration is robust for end-user features (recommendations, prep, writing assistance). Future development should focus on implementing the `ai-agents` automation to fulfill the original project vision of a self-building system.
