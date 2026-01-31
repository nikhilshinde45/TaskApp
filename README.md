# Task Management Web Application (MERN Stack)

A production-ready full-stack task management application with user authentication, built with the MERN stack (MongoDB, Express.js, React, Node.js). Each user can create, read, update, and delete their own tasks, with filtering by status.

---

## Features

### Authentication
- **User signup** – Register with name, email, and password
- **User login** – Sign in with email and password
- **JWT-based auth** – Token generation and validation
- **Protected routes** – Only logged-in users can access the dashboard and tasks
- **Logout** – Clear token and redirect to login

### Tasks
- **Create task** – Title, description, and status (Pending / In Progress / Completed)
- **List tasks** – View all tasks for the logged-in user
- **Update task** – Edit title, description, or status
- **Delete task** – Remove a task with confirmation
- **Filter by status** – Filter tasks by Pending, In Progress, or Completed

### Frontend
- **Signup & Login pages** – Clean forms with validation and error messages
- **Protected routes** – Redirect to login if not authenticated
- **JWT stored in localStorage** – Persisted across page reloads
- **Loading and error states** – Spinners and user-friendly error messages
- **Responsive design** – Usable on mobile and desktop
- **Plain CSS** – No heavy UI libraries; modern, maintainable styles

### Backend
- **MVC architecture** – Controllers, routes, and models
- **RESTful APIs** – Standard HTTP methods and status codes
- **Centralized error handling** – Single middleware for API errors
- **Environment variables** – `dotenv` for config (e.g. `MONGO_URI`, `JWT_SECRET`)

---

## Tech Stack

| Layer     | Technology                          |
|----------|--------------------------------------|
| Frontend | React 18 (Vite), React Router, Plain CSS |
| Backend  | Node.js, Express.js                  |
| Database | MongoDB with Mongoose               |
| Auth     | JWT (jsonwebtoken), bcrypt for passwords |

---

## Project Structure

```
Task-App/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI (Layout, TaskForm, TaskList)
│   │   ├── pages/          # Login, Signup, Dashboard
│   │   ├── services/       # API client, auth context
│   │   ├── styles/         # Global CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── config/             # DB connection (db.js)
│   ├── controllers/        # authController, taskController
│   ├── middlewares/        # auth (protect), errorHandler
│   ├── models/             # User, Task (Mongoose schemas)
│   ├── routes/             # authRoutes, taskRoutes
│   ├── server.js           # Express app entry
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint       | Body                          | Description        |
|--------|----------------|-------------------------------|--------------------|
| POST   | `/api/auth/signup` | `{ name, email, password }`   | Register new user  |
| POST   | `/api/auth/login`  | `{ email, password }`         | Login, returns JWT |

**Success response (signup/login):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint        | Body / Query              | Description           |
|--------|-----------------|---------------------------|-----------------------|
| GET    | `/api/tasks`    | Query: `?status=Pending`  | Get user's tasks      |
| POST   | `/api/tasks`    | `{ title, description?, status? }` | Create task   |
| PUT    | `/api/tasks/:id`| `{ title?, description?, status? }`| Update task   |
| DELETE | `/api/tasks/:id`| -                         | Delete task           |

**Task status values:** `"Pending"`, `"In Progress"`, `"Completed"`.

**Example create/update body:**
```json
{
  "title": "Finish report",
  "description": "Optional description",
  "status": "In Progress"
}
```

---

## Authentication Flow

1. **Signup / Login**  
   User submits credentials → Backend validates → Returns JWT and user object.

2. **Storing token**  
   Frontend saves `token` and `user` in `localStorage` and updates React state (e.g. via `AuthContext`).

3. **Protected requests**  
   Frontend sends `Authorization: Bearer <token>` on every request to `/api/tasks`. Backend `protect` middleware verifies JWT and attaches `req.user`.

4. **Protected routes**  
   React checks for `user` in context; if missing, redirects to `/login`. If present, allows access to dashboard and task pages.

5. **Logout**  
   Frontend removes `token` and `user` from `localStorage` and clears state; user is redirected to login.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas connection string)
- npm or yarn

### 1. Clone and install

```bash
cd Task-App

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET

# Frontend
cd ../frontend
npm install
# Optional: copy .env.example to .env if you need VITE_API_URL for a different API URL
```

### 2. Environment variables

**Backend (`.env` in `backend/`):**

| Variable     | Description                    | Example                    |
|-------------|--------------------------------|----------------------------|
| `PORT`      | Server port                    | `5000`                     |
| `NODE_ENV`  | Environment                    | `development`              |
| `MONGO_URI` | MongoDB connection string     | `mongodb://localhost:27017/task_app` |
| `JWT_SECRET`| Secret for signing JWTs        | Long random string         |
| `JWT_EXPIRE`| Token expiry                   | `7d`                       |

**Frontend (optional):**  
Vite proxy is set to `http://localhost:5000` for `/api`. If your API runs elsewhere, set `VITE_API_URL` and use it in your API service.

### 3. Run the app

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

Open `http://localhost:3000`. Sign up or log in, then create and manage tasks.

### 4. Production build (frontend)

```bash
cd frontend
npm run build
# Serve the `dist` folder with any static file server, or point your backend to it
```

---

## Models

### User
| Field      | Type   | Required | Notes              |
|-----------|--------|----------|--------------------|
| name      | String | Yes      |                    |
| email     | String | Yes      | Unique, lowercase   |
| password  | String | Yes      | Hashed (bcrypt)     |
| createdAt | Date   | Auto     | Timestamp          |

### Task
| Field       | Type     | Required | Notes                          |
|------------|----------|----------|--------------------------------|
| title      | String   | Yes      |                                |
| description| String   | No       | Default `""`                   |
| status     | String   | No       | Enum: Pending, In Progress, Completed |
| user       | ObjectId | Yes      | Reference to User              |
| createdAt  | Date     | Auto     | Timestamp                      |

---

## Quality Notes

- **Backend:** MVC separation, centralized error handler, auth middleware, and Mongoose validation.
- **Frontend:** Component-based structure, protected/public routes, loading and error handling, responsive layout.
- **Security:** Passwords hashed with bcrypt; JWT for stateless auth; users can only access their own tasks (filtered by `req.user.id`).


