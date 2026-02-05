# Setup Instructions

## 1. Backend Setup (Node.js + MongoDB)
Open a terminal in the `backend` folder:
```bash
cd backend
# Install new dependencies
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
# Seed the database
node seed.js
# Start the server
npm start
```
You should see: `✅ MongoDB Connected: campusplacement`

## 2. Frontend Setup (React + Tailwind)
Open a new terminal in the `frontend` folder:
```bash
cd frontend
# Install new dependencies
npm install react-router-dom lucide-react
# Start the dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to see the application.

## 3. Login Credentials
**Admin/Student**: `admin@example.com` / `password123`
**Company**: `hr@techcorp.com` / `password123`

## 4. AI Agents
The `ai-agents` folder contains Python scripts for the agentic features.
