# Project Overview: AI-Driven Campus Placement System (Agentic AIO Architecture)

A next-generation placement portal built with MERN + MySQL/MongoDB, but powered by a self-generating, self-optimizing AI agent that uses Gemini free API to automate development, workflow tasks, and decision-making. Inspired by Google Antigravity IDE, Cursor AI agents, and Auto-DevOps LLM frameworks, the system operates like a living assistant that builds, fixes, tests, optimizes, and enhances itself.

## 1. Core Idea: Agent Builds the Entire System for You

Instead of manually writing code, the agent performs full-stack actions:
- Reads your instructions
- Generates backend models, routes, controllers
- Writes React components
- Designs SQL/NoSQL schema
- Creates Python micro-services
- Writes test cases
- Runs optimizations
- Fixes bugs
- Deploys the entire system

You only describe WHAT you want.
The agent decides HOW to build it.
This creates a self-evolving placement management system.

## 2. Tech Stack (AI-Augmented Version)
**Base System**
- Frontend: React + TailwindCSS
- Backend: Node.js + Express
- Database: MongoDB (as configured)
- AI Micro-Scripts: Python 3 + Gemini API
- Deployment: Docker, Vercel, Railway
- State Management: Zustand or Redux

**AI Automation Layer**
- Gemini-Pro for reasoning, planning, code generation
- Gemini-Flash (free) for fast iterations
- text-embedding-004 for search, recommendations
- Python Agent Runner for executing actions
- Node Agent Bridge for cross-language calls
- File-tree access AI for building, modifying, and refactoring code

## 3. The Agentic Architecture (How the Auto-Developer Works)
The AI system is made of three autonomous agents:

**Agent 1: Planner Agent**
Understands user intent and converts it to actionable tasks.
Example: User says, “Add a shortlist page.”
Planner outputs:
- Create /shortlist route
- Build React UI (List + Filters)
- Link to Application model
- Add DB relationships
- Integrate Gemini scoring

**Agent 2: Developer Agent**
Writes the actual MERN code.
- Generate CRUD APIs
- Build UI components
- Write DB queries
- Create migrations
- Produce Python scripts
- Integrate Gemini prompts
It edits files directly.

**Agent 3: Executor Agent**
Runs and tests code:
- Starts dev server
- Executes Python AI scripts
- Verifies DB migrations
- Detects errors
- Applies fixes automatically
- Deploys if stable

## 4. AI Features for the Placement System (Fully Autonomous)
All AI features are implemented through Python scripts controlled by the agents.
- Resume parsing
- Automatic skill tagging
- Fit-score calculation (role vs student)
- AI shortlisting
- AI-driven announcements & emails
- AI chatbot for student queries
- Company profile summarization
- Autocomplete & predictive UI fields
- AI-backed analytics & insights

## 5. How Gemini Drives Everything (Free Tier)
The free Gemini API is used for:
- Code generation
- Reasoning
- Text extraction
- Resume parsing
- Embeddings for recommendations
- Data cleaning
- Email generation
