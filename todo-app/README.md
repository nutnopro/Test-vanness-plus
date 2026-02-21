# ✅ Multi-User Todo App

A production-ready multi-user task management application built with **React (Vite)** and **Supabase**.

Each user can register, log in, and manage their own tasks with full data isolation enforced at the **database level (Row Level Security - RLS)**.

---

## 🌐 Live Demo

🔗 https://test-vanness-plus.vercel.app/

## 📂 GitHub Repository

🔗 https://github.com/nutnopro/Test-vanness-plus

---

## ✨ Key Features

- 🔐 Email & Password Authentication (Supabase Auth)
- 👤 Multi-user data isolation via Row Level Security (RLS)
- 📝 Create, edit, delete, and filter tasks
- 🗂 Category management with color badges
- 📊 Dashboard statistics overview
- 🔒 Protected routes for authenticated users
- 🔔 Toast notifications for user feedback
- 📱 Responsive UI (TailwindCSS)
- 🚀 Deployed on Vercel (SPA routing supported)

---

## 🛠 Tech Stack

**Frontend**
- React 19
- Vite 7
- React Router DOM
- TailwindCSS

**Backend**
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security (RLS)

**Deployment**
- Vercel

---

## 🔒 Security Architecture

Security is enforced at the database level using Supabase RLS.

- RLS enabled on all tables
- Policies scoped using `auth.uid() = user_id`
- Only Supabase `anon` public key used on frontend
- No `service_role` key exposed
- Protected routes implemented in frontend

This ensures complete per-user data isolation.

---

## 🗄 Database Schema (Summary)

### tasks
- id (uuid)
- user_id (uuid)
- title (text)
- completed (boolean)
- category_id (uuid)
- created_at (timestamp)

### categories
- id (uuid)
- user_id (uuid)
- name (text)
- color (text)
- created_at (timestamp)

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Supabase project

### Steps

```bash
git clone https://github.com/nutnopro/Test-vanness-plus.git
cd todo-app
npm install
npm run dev