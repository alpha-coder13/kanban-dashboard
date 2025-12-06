# Voice-Enabled Task Tracker 🎙️✅

A full-stack task management application featuring an intelligent voice input system that parses natural language to automatically extract task details like Title, Priority, Due Date, and Status.

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Known Limitations](#-known-limitations)

---

## 🧐 Overview

This project allows users to manage tasks via a Kanban board and List view. The core differentiator is the **Voice Input Feature**, which utilizes AI (LLM) to structure natural language into actionable database records.

---

## ✨ Features

### Core Task Management
- **Board View:** Kanban-style drag-and-drop (To Do, In Progress, Done).
- **List View:** Detailed list of all tasks.
- **CRUD Operations:** Create, Read, Update, Delete tasks.
- **Filtering & Search:** Filter by status, priority, due date, and search by text.

### 🗣️ Voice Input
- **Speech-to-Text:** Browser-based speech recognition.
- **Intelligent Parsing:** Uses **Groq SDK** (LLM) to extract:
  - **Title:** Main task description.
  - **Due Date:** Handles relative ("tomorrow") and absolute ("Jan 20") dates (formatted as YYYY-MM-DD).
  - **Priority:** Detects keywords (Urgent, High, Critical).
  - **Status:** Defaults to "TO DO".

---

## 💻 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** Lucide React
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js
- **Services:**
  - **API Server:** Express.js, Groq SDK (for AI parsing).
  - **DB Server:** Express.js, SQLite.
- **Database:** SQLite

---

## 📂 Project Structure

```
├── frontend/           # Next.js Frontend Application
├── backend/            # Backend Services
│   ├── api-server/     # Public Facing API & LLM Logic
│   └── db-server/      # Internal Database Service (SQLite)
└── readme.md           # Project Documentation
```

---

## 🧱 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm**
- **Groq API Key** (Required for Voice/AI features)

---

## 🛠️ Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aerchainTask
```

### 2. Backend Setup
The backend consists of two services: `api-server` and `db-server`.

**Install Dependencies:**
```bash
# API Server
cd backend/api-server
npm install

# DB Server
cd ../db-server
npm install
```

### 3. Frontend Setup
```bash
cd ../../frontend
npm install
```

---

## 🔐 Environment Variables

You need to configure environment variables for the services to communicate.

### API Server (`backend/api-server/.env`)
Create a `.env` file in `backend/api-server`:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001                       # Run API server on 3001 to avoid conflict with Frontend (3000)
DATABASE_SERVER_ENDPOINT=localhost
DATABASE_SERVER_PORT=80
```

### Frontend (`frontend/.env.local` or Next.js config)
The frontend communicates with the API server via a proxy. By default `next.config.ts` looks for:

```env
BACKEND_UR=localhost            # Hostname of the API server
BACKEND_PORT=3001               # Port of the API server (match PORT above)
```
*Note: The variable name is `BACKEND_UR` (missing 'L') in `next.config.ts`.*

---

## 🚀 Running the Application

### 1. Start Database Server
```bash
cd backend/db-server
npm run start
# Runs on Port 80 (requires admin/sudo on some systems) or check start script
```
*Note: If you cannot bind to port 80, change the port in `backend/db-server/src/index.ts` and update `DATABASE_SERVER_PORT` in API Server .env.*

### 2. Start API Server
```bash
cd backend/api-server
npm run dev
# Runs on Port 3001 (configured in .env)
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Alternative: Using `start.sh` (Backend)
The backend folder contains a `start.sh` script to run both backend services.
```bash
cd backend
./start.sh
```
*Check the script contents to ensure ports match your environment.*

---

## 📡 API Documentation

### Tasks
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/tasks` | Fetch all tasks (supports query params: status, priority, dueDate, search) |
| `POST` | `/task` | Create a new task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

### AI / Voice
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/task/prompt` | Parses natural language and returns structured task data JSON |

---

## 🐛 Known Limitations

- **Port Conflicts:** By default, both Next.js and the API server might try to use port 3000. It is recommended to change the API Server port (e.g., to 3001 or 5000).
- **JSON Parsing:** The AI text-to-JSON parsing uses a custom extraction method. Complex inputs might occasionally fail if the model output is not perfectly compliant.
- **Browser STT:** Speech-to-Text relies on available browser APIs (Web Speech API).

---

## 🤖 AI Tools Usage

This project utilizes Generative AI for:
1.  **Task Parsing:** The `api-server` sends user input to Groq (LLaMA/GPT models) to intelligently infer task details.
2.  **Code Assistance:** AI agents were used to scaffold the project structure and generate documentation.