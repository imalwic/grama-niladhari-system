# Digital Grama Niladhari Management System

A comprehensive digital solution to streamline and automate the manual record-keeping processes of Grama Niladhari (Village Officer) divisions in Sri Lanka. This system is designed as a secure, role-based platform that connects the Pradeshiya Sabha (Super Admin), Grama Niladhari Officers, and Residents.

## Architecture (Monorepo)

This repository is structured as a monorepo containing both the frontend and backend applications.

- **/frontend** - Next.js (App Router), Tailwind CSS, TypeScript
- **/backend** - NestJS, Prisma ORM, PostgreSQL

## Features

- **Role-Based Access Control (RBAC):** Distinct portals and capabilities for Super Admin (Pradeshiya Sabha), GN Officers, and Residents.
- **Household & Resident Management:** Securely digitize paper-based registers.
- **Data Scoping:** GN Officers can only view and manipulate data within their assigned *Wasama*.
- **Bulk Import:** Seamlessly migrate historical paper data via CSV/Excel uploads.
- **Authentication:** JWT-based secure authentication with bcrypt password hashing.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** NestJS, TypeScript, JWT, bcrypt
- **Database:** PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Backend Setup
```bash
cd backend
npm install
```
- Configure your `.env` file in the `backend` directory with your PostgreSQL connection string:
  `DATABASE_URL="postgresql://username:password@localhost:5432/grama_niladhari_db?schema=public"`
- Run database migrations:
```bash
npx prisma migrate dev
```
- Start the backend server:
```bash
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment
- **Frontend:** Optimized for Vercel deployment. Set the root directory to `frontend` in your Vercel project settings.
- **Backend:** Can be deployed to Render, Railway, or Vercel Serverless.

---
*Developed for the digital transformation of Sri Lankan local governance.*
