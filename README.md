# Team Task Management Web Application

A Full-Stack web application designed to help teams collaborate, track projects, and manage tasks efficiently. It features a secure role-based access control (RBAC) system to ensure data privacy between Administrators and standard Employees.

## Features

### Role-Based Access Control
The application automatically assigns roles upon registration based on the email domain:
- **Admins** (Emails ending in `@hr.com`): Full administrative privileges.
- **Project Heads** (Emails ending in `@projecthead.com`): Privileged project management access.
- **Employees** (All other emails): Standard access.

### Admin Features
- **User Management**: Add, remove, and manage employees securely.
- **Project Creation**: Create new projects and set deadlines.
- **Team Allocation**: Assign employees to specific projects as members.
- **Task Assignment**: Create, edit, and assign tasks to specific project members.
- **Global Dashboard**: Monitor platform-wide statistics including total tasks, overdue tasks, and completion rates.

### Employee Features
- **Isolated Workspace**: Employees only see projects they are assigned to.
- **Task Management**: View assigned tasks and update statuses (`To Do` -> `In Progress` -> `Done`).
- **Restricted Access**: Cannot access admin routes (like `/employees`), modify other user's tasks, or tamper with project configurations.

### Profile Management
- Secure JWT-based authentication.
- View and edit personal details (Name, Email, Phone Number, Gender).
- Personalized avatars dynamically generated based on the user's name.

---

## Technology Stack

**Frontend:**
- **React 19** (Vite)
- **TypeScript** for type safety
- **Tailwind CSS** & **shadcn/ui** for modern, responsive styling
- **React Router v7** for routing

**Backend:**
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (Database)
- **JWT** & **bcryptjs** (Authentication & Security)

---

## Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas URI (or local MongoDB instance)

### 1. Clone & Install Dependencies
First, install the dependencies for both the `client` and `server`.

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in the **server** directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Run the Application

**Start the Backend Server:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Start the Frontend Client:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## Project Structure

```text
task-management/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn)
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Full page views (Dashboard, Projects, etc.)
│   │   └── services/       # Axios API configurations
│   └── package.json
└── server/                 # Node/Express Backend
    ├── src/
    │   ├── controllers/    # API endpoint logic
    │   ├── middleware/     # JWT Auth & Admin guards
    │   ├── models/         # Mongoose Schemas (User, Project, Task)
    │   ├── routes/         # Express routing definitions
    │   └── index.ts        # Server entry point
    └── package.json
```

---

## Core API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token

### Projects
- `GET /api/projects` - Get all projects (filtered by role)
- `POST /api/projects` - Create a new project (Admin only)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id/members` - Add/remove team members

### Tasks
- `GET /api/tasks/project/:projectId` - Get all tasks for a project
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update task (Status, assignees, etc.)
- `DELETE /api/tasks/:id` - Delete a task

### Users & Dashboard
- `GET /api/users` - List all employees (Admin only)
- `GET /api/dashboard/stats` - Get aggregated dashboard metrics
