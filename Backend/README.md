# Lead Management CRM Backend

Production-ready Node.js/Express/MongoDB backend for a lead management CRM system with JWT auth, RBAC, advanced lead filtering, analytics, and Socket.IO notifications.

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies:
   - `npm install`
3. Seed sample data:
   - `npm run seed`
4. Start server:
   - `npm run dev`

## Default Seeded Users

- `admin@crm.com` / `Admin@123`
- `manager@crm.com` / `Manager@123`
- `sales@crm.com` / `Sales@123`

## API Modules

- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/leads`
- `/api/v1/notifications`

## Socket Authentication

Pass JWT token in Socket.IO handshake as either:

- `auth: { token: "<jwt>" }`
- or header `Authorization: Bearer <jwt>`
