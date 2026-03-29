# Lead Management CRM (MERN Stack)

A production-ready full-stack Lead Management CRM built using the MERN stack (MongoDB, Express, React, Node.js). This system features Role-Based Access Control (RBAC), real-time notifications, and advanced data grid management.

## 🚀 Features

### Global

- **Full MERN Stack:** Seamless integration between React frontend and Node.js/Express backend.
- **Real-Time Notifications:** Live updates pushed to clients via `Socket.IO` when leads are created, updated, or assigned.
- **Role-Based Access Control (RBAC):** Distinct permissions for Admin, Manager, and Sales roles.

### Frontend (`/Frontend`)

- **React + Vite:** Lightning-fast build and development experience.
- **Material-UI (MUI):** Fully responsive and accessible UI components.
- **Custom Theming:** Modern "Glassmorphism" dark theme styling.
- **Advanced Data Grids:** Server-side pagination, sorting, and debounced filtering for leads.
- **Dashboard Analytics:** Visual breakdown of lead statuses and sources using Recharts.

### Backend (`/Backend`)

- **Node.js & Express:** Robust RESTful API architecture.
- **MongoDB & Mongoose:** Schema validation, relationships, and advanced aggregation pipelines.
- **Security:** JWT authentication, bcrypt password hashing, helmet, express-rate-limit, and robust Joi payload validation.
- **Error Handling:** Centralized operational and framework error formatting.

---

## 📁 Project Structure

This project is divided into two main directories:

- **`/Backend`**: The Node.js/Express API server.
- **`/Frontend`**: The React/Vite client application.

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas URI)

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Configure Environment Variables:
Copy `.env.example` to `.env` (or create a `.env` file) and configure your `MONGODB_URI` and `JWT_SECRET`.

Seed the Database (Optional but recommended):

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

_The backend will typically start on `http://localhost:5000`._

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Configure Environment Variables:
Copy `.env.example` to `.env` (or create a `.env` file) and point `VITE_API_URL` to your backend.

Start the development server:

```bash
npm run dev
```

_The frontend will start on the port provided by Vite (usually `http://localhost:5173`)._

---

## 🔐 Default Seeded Credentials

If you ran the `npm run seed` command in the backend, you can log into the frontend using the following test accounts:

- **Admin:** `admin@crm.com` / `Admin@123`
- **Manager:** `manager@crm.com` / `Manager@123`
- **Sales:** `sales@crm.com` / `Sales@123`
