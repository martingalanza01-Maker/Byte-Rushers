# Byte Rushers System: Unified Setup & Run Guide

This guide explains the architecture and local setup instructions for the **Byte Rushers** project, which consists of two main repositories:

- [Byte-Rushers (Frontend)](https://github.com/martingalanza01-Maker/Byte-Rushers)
- [Byte-Rushers-API (Backend)](https://github.com/martingalanza01-Maker/Byte-Rushers-API)

---

## 1. System Specification

### Architecture Overview

- **Frontend: `Byte-Rushers`**
  - **Stack:** TypeScript (98.7%), CSS, JavaScript (likely React or similar SPA)
  - **Role:** Provides user-facing UI and interacts with backend via HTTP API.

- **Backend: `Byte-Rushers-API`**
  - **Stack:** TypeScript (98.7%), plus other supporting languages/tools
  - **Role:** Provides API endpoints; handles business logic, user authentication, data persistence, etc.

**Flow:**  
User interacts with the frontend.  
Frontend sends requests (REST/GraphQL) to the backend API.  
Backend provides data, authentication, and business logic.

---

## 2. Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm**  
- **Git**
- *(Optional)* **Docker** (if Docker deployment is desired)
- Check each repo for additional requirements in their README or `package.json`

---

## 3. Setup Instructions (Local Development)

These steps apply to **both repositories**.

### Step 1: Clone the Repositories

```bash
git clone https://github.com/martingalanza01-Maker/Byte-Rushers.git
git clone https://github.com/martingalanza01-Maker/Byte-Rushers-API.git
```

---

### Step 2: Install Dependencies

**For each project individually:**

```bash
cd Byte-Rushers
npm install
cd ..

cd Byte-Rushers-API
npm install
cd ..
```

---

### Step 3: Set Up Environment Variables

- Look for `.env.example` or similar files in each repo.
- Copy to `.env` and fill in required values (e.g., API URLs, secrets, database credentials).

Example:

```bash
cp .env.example .env
# Edit .env as necessary
```

---

### Step 4: Start the Backend (API)

```bash
cd Byte-Rushers-API
npm run dev         # For development (commonly)
# or
npm run build
npm start           # For production
cd ..
```
Check the repo’s README for exact commands/ports.

---

### Step 5: Start the Frontend (Client)

```bash
cd Byte-Rushers
npm start           # or: npm run dev
cd ..
```

- The frontend should be configured (via `.env`) to interact with the local API (default: http://localhost:3001).
- By default, the frontend may run on http://localhost:3000.

---

## 4. Usage

1. **Ensure both backend and frontend are running.**
2. Visit the frontend app in your browser (likely [http://localhost:3000](http://localhost:3000)).
3. Use the application and it will communicate with your local backend instance.

---

## 5. Docker Setup (If Supported)

- If either directory contains a `Dockerfile` or `docker-compose.yml`, you can start services with Docker:

```bash
# In the relevant repo folder
docker build -t byte-rushers-api .
docker run -p 3001:3001 byte-rushers-api

docker build -t byte-rushers-frontend .
docker run -p 3000:3000 byte-rushers-frontend
```

- Or, with Docker Compose (if provided):

```bash
docker-compose up
```

---

## 6. Testing

**Run tests (if any) in each repo:**

```bash
npm test
```

---

## 7. Troubleshooting

- Make sure both servers are running on the correct ports with their environment variables set.
- Look at the terminal output for errors (missing dependencies, wrong config, etc.).
- Check each repo’s README for further troubleshooting and advanced configuration.

---

> _For more advanced deployment, production setup, or contributing, see the individual repository READMEs._
