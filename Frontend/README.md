# Lead Management CRM Frontend

React + MUI frontend for the Lead Management CRM backend.

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start dev server with `npm run dev`

## Features

- JWT auth with auto logout on 401
- Protected routes with role-aware UI
- Dashboard with summary charts
- Lead listing with server-side filters, sorting, pagination, and debounced search
- Lead create/edit form
- Real-time notifications with Socket.IO
