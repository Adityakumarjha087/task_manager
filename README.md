# TaskFlow - Team Task Management System

A premium Full-Stack web application designed for high-performance teams to collaborate, track projects, and manage tasks with a state-of-the-art dark theme and intuitive role-based controls.

## 👥 Role-Based Access Control (RBAC)

The application features a secure, multi-tier permission system. Roles can be selected during signup or determined automatically by email domain.

### 🏢 HR / Administrator (Full Control)
- **Email**: `hr@hr.com` | **Password**: `password123`
- **Capabilities**:
  - Full visibility into **ALL** projects and tasks across the organization.
  - Comprehensive **User Management**: Add, remove, and manage all employee accounts.
  - **Project Ownership**: Create new projects, set deadlines, and manage global team allocation.
  - **Global Analytics**: Access real-time statistics on team productivity and project health.

### 👔 Project Head
- **Domain**: `@projecthead.com` (or selected via toggle)
- **Capabilities**:
  - Manage projects explicitly assigned to them by HR.
  - Create and assign tasks within their specific projects.
  - Add or remove employees from their project teams.
  - Monitor project-specific deadlines and completion rates.

### 💻 Employee
- **Capabilities**:
  - Isolated workspace: Only view projects and tasks assigned to them.
  - Update task statuses (`To Do` → `In Progress` → `Done`).
  - Manage personal profile and track individual deadlines.

---

## ✨ Features

- **Premium UI/UX**: Stunning dark-mode interface with glassmorphism effects and smooth micro-animations.
- **Animated Auth Flow**: Interactive Login/Signup with role-switching "swipe" toggles.
- **Dynamic Dashboard**: Real-time KPI tracking for tasks, projects, and team members.
- **Smart Data Management**: Comprehensive task filtering, status updates, and member management.
- **Local Development Suite**: Includes Docker configuration for instant database setup.

---

## 🛠️ Technology Stack

**Frontend:**
- **React 19** (Vite) & **TypeScript**
- **Tailwind CSS** & **shadcn/ui**
- **Lucide React** for premium iconography
- **Framer Motion** for interactive animations

**Backend:**
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **JWT** (JSON Web Tokens) for secure session management
- **bcryptjs** for industrial-grade password hashing

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or Atlas URI)

### 2. Environment Setup
Create a `.env` file in the **server** directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Install & Run
```bash
# Setup Backend
cd server
npm install
npm run dev

# Setup Frontend
cd ../client
npm install
npm run dev
```

### 4. Seed Sample Data
To populate the app with 30 users and 15 projects:
```bash
cd server
npm run seed
```

---

## 🔑 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **HR (Admin)** | `hr@hr.com` | `password123` |
| **Project Head** | `head1@projecthead.com` | `password123` |
| **Employee** | `employee1@gmail.com` | `password123` |

---

