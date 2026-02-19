<p align="center">
  <h1 align="center">✅ Multi-User Todo App</h1>
  <p align="center">
    A production-ready, multi-user task management application built with <strong>React</strong> and <strong>Supabase</strong>.<br/>
    Featuring secure authentication, Row Level Security (RLS), and real-time data isolation per user.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Security Architecture](#-security-architecture)
- [Authentication Flow](#-authentication-flow)
- [Folder Structure](#-folder-structure)
- [Installation & Local Setup](#-installation--local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment (Vercel)](#-deployment-vercel)
- [RLS Policy Example](#-rls-policy-example)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🧩 Project Overview

**Multi-User Todo App** is a full-stack task management application designed for real-world, multi-tenant use. Each user registers, logs in, and manages their own tasks and categories — completely isolated from other users via Supabase **Row Level Security (RLS)**.

The frontend is a single-page application (SPA) built with **Vite + React**, styled with **TailwindCSS**, and deployed on **Vercel**. The backend leverages **Supabase** for PostgreSQL database, authentication, and authorization — with no custom server required.

---

## 🌐 Live Demo

> 🔗 **[View Live Demo](https://your-app-name.vercel.app)**
>
> _Replace the URL above with your deployed Vercel link._

---

## ✨ Features

- **User Authentication** — Email & password registration and login via Supabase Auth
- **Multi-User Data Isolation** — Each user can only access their own data (enforced at the database level)
- **Task Management** — Create, edit, filter, and delete tasks
- **Category System** — Organize tasks with custom categories and color-coded badges
- **Dashboard Analytics** — Overview statistics for task progress at a glance
- **Task Filtering** — Filter tasks by status, category, or other criteria
- **Protected Routes** — Unauthenticated users are redirected to the login page
- **Toast Notifications** — Real-time user feedback via non-intrusive toasts
- **PWA Support** — Installable as a Progressive Web App with offline-ready configuration
- **Responsive Design** — Fully responsive UI powered by TailwindCSS
- **SPA Routing on Vercel** — Client-side routing works correctly on all paths after deployment

---

## 🛠 Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| **Frontend**   | React 19, Vite 7, TailwindCSS 3.4, React Router DOM 7         |
| **Backend**    | Supabase (PostgreSQL, Auth, Row Level Security)                |
| **Styling**    | TailwindCSS with custom animations                             |
| **State**      | React Context API (AuthProvider)                               |
| **Utilities**  | date-fns (date formatting), react-hot-toast (notifications)    |
| **PWA**        | vite-plugin-pwa (service worker, manifest)                     |
| **Deployment** | Vercel (with SPA rewrite rules)                                |
| **Linting**    | ESLint 9 with React Hooks & React Refresh plugins              |

---

## 🗄 Database Schema

The application uses three core tables in Supabase (PostgreSQL):

### `tasks`

| Column       | Type        | Description                              |
| ------------ | ----------- | ---------------------------------------- |
| `id`         | `uuid`      | Primary key (auto-generated)             |
| `user_id`    | `uuid`      | Foreign key → `auth.users.id`            |
| `title`      | `text`      | Task title                               |
| `completed`  | `boolean`   | Whether the task is done                 |
| `category_id`| `uuid`      | Foreign key → `categories.id` (nullable) |
| `created_at` | `timestamptz` | Auto-generated timestamp               |

### `categories`

| Column       | Type        | Description                              |
| ------------ | ----------- | ---------------------------------------- |
| `id`         | `uuid`      | Primary key (auto-generated)             |
| `user_id`    | `uuid`      | Foreign key → `auth.users.id`            |
| `name`       | `text`      | Category name                            |
| `color`      | `text`      | HEX color code for badge display         |
| `created_at` | `timestamptz` | Auto-generated timestamp               |

### `task_tags`

| Column       | Type        | Description                              |
| ------------ | ----------- | ---------------------------------------- |
| `id`         | `uuid`      | Primary key (auto-generated)             |
| `task_id`    | `uuid`      | Foreign key → `tasks.id`                 |
| `tag_name`   | `text`      | Tag label                                |

> **Note:** All tables include a `user_id` column (where applicable) that references `auth.users.id`, enabling per-user data isolation through RLS policies.

---

## 🔒 Security Architecture

Security is enforced at the **database level** using Supabase Row Level Security (RLS), not just in application code.

### Key Principles

1. **RLS enabled on all tables** — Every table (`tasks`, `categories`, `task_tags`) has RLS enabled, meaning no data is accessible without an explicit policy.
2. **User isolation via `auth.uid()`** — All policies filter rows using `auth.uid()`, ensuring users can only read and modify their own data.
3. **Anon key only** — The frontend uses the Supabase **anon (public) key** exclusively. The `service_role` key is **never** exposed in client-side code.
4. **Environment variables** — Supabase credentials are stored in `.env` and are **not committed** to version control.
5. **No direct database access** — All data operations go through the Supabase client SDK, which automatically injects the authenticated user's JWT for RLS enforcement.

### Security Checklist

- [x] RLS enabled on `tasks`, `categories`, `task_tags`
- [x] Policies scoped to `auth.uid() = user_id`
- [x] `.env` excluded from git via `.gitignore`
- [x] No `service_role` key in frontend code
- [x] Protected routes enforce authentication before rendering

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────┐
│                    User visits app                    │
└──────────────────────┬───────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Has session?   │
              └────┬───────┬────┘
                   │       │
              Yes  │       │  No
                   │       │
          ┌────────▼──┐  ┌─▼──────────┐
          │ Dashboard │  │ Login Page  │
          └───────────┘  └─────┬──────┘
                               │
                    ┌──────────▼──────────┐
                    │ supabase.auth       │
                    │ .signInWithPassword │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ JWT token stored    │
                    │ in Supabase SDK     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ RLS uses auth.uid() │
                    │ for data filtering  │
                    └─────────────────────┘
```

1. **Session check** — On app load, `useAuth` calls `supabase.auth.getSession()` and subscribes to `onAuthStateChange` for real-time session updates.
2. **Registration** — New users sign up via `supabase.auth.signUp()` with email and password.
3. **Login** — Existing users sign in via `supabase.auth.signInWithPassword()`.
4. **Protected routes** — The `<ProtectedRoute>` component redirects unauthenticated users to `/login`.
5. **Logout** — `supabase.auth.signOut()` clears the session and redirects the user.

---

## 📁 Folder Structure

```
todo-app/
├── public/                     # Static assets (PWA icons)
├── src/
│   ├── assets/                 # Static assets (images, etc.)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx       # Email/password login form
│   │   │   └── RegisterForm.jsx    # Registration form
│   │   ├── categories/
│   │   │   ├── CategoryBadge.jsx   # Color-coded category label
│   │   │   └── CategoryModal.jsx   # Create/edit category modal
│   │   ├── dashboard/
│   │   │   └── StatsCard.jsx       # Dashboard statistics card
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   └── ProtectedRoute.jsx  # Auth guard wrapper
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx        # Individual task display
│   │   │   ├── TaskFilters.jsx     # Filter controls
│   │   │   ├── TaskForm.jsx        # Create/edit task form
│   │   │   └── TaskModal.jsx       # Task detail modal
│   │   └── ui/
│   │       ├── EmptyState.jsx      # Empty list placeholder
│   │       ├── LoadingSpinner.jsx  # Loading indicator
│   │       └── Modal.jsx           # Reusable modal component
│   ├── hooks/
│   │   ├── useAuth.jsx             # Auth context & provider
│   │   ├── useCategories.js        # Category CRUD operations
│   │   └── useTasks.js             # Task CRUD operations
│   ├── lib/
│   │   └── supabase.js             # Supabase client initialization
│   ├── pages/
│   │   ├── Dashboard.jsx           # Dashboard with statistics
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   └── TaskList.jsx            # Task list & management page
│   ├── App.jsx                     # Root component with routing
│   ├── App.css                     # App-level styles
│   ├── index.css                   # TailwindCSS directives
│   └── main.jsx                    # React entry point
├── .env                            # Environment variables (not committed)
├── .gitignore
├── eslint.config.js
├── index.html                      # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json                     # Vercel SPA rewrite rules
└── vite.config.js                  # Vite + PWA configuration
```

---

## 🚀 Installation & Local Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Supabase** project ([create one free](https://supabase.com))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/todo-app.git
cd todo-app

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Then fill in your Supabase credentials (see Environment Variables below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

| Variable                | Description                          | Where to Find                                       |
| ----------------------- | ------------------------------------ | --------------------------------------------------- |
| `VITE_SUPABASE_URL`     | Your Supabase project URL            | Supabase Dashboard → Settings → API → Project URL   |
| `VITE_SUPABASE_ANON_KEY`| Public anonymous key                 | Supabase Dashboard → Settings → API → `anon` `public` key |

> ⚠️ **Important:** Never use the `service_role` key in frontend code. The `anon` key is safe for client-side use when RLS is properly configured.

---

## 🌍 Deployment (Vercel)

### Steps

1. **Push your code** to a GitHub repository.
2. **Import** the repository in [Vercel](https://vercel.com/new).
3. **Set environment variables** in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy** — Vercel will auto-detect Vite and apply the correct build settings.

### SPA Routing Fix

The `vercel.json` file is pre-configured to handle client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures all routes (e.g., `/dashboard`, `/tasks`) are served by `index.html`, preventing 404 errors on page refresh.

---

## 📜 RLS Policy Example

Below is an example of a Row Level Security policy applied to the `tasks` table:

```sql
-- Enable RLS on the tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own tasks
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only INSERT tasks for themselves
CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own tasks
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own tasks
CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
```

**How it works:**
- `auth.uid()` returns the authenticated user's UUID from the JWT token.
- Every query is automatically filtered — even if the frontend sends a malicious request, the database will only return rows belonging to the authenticated user.
- The same pattern is applied to `categories` and `task_tags`.

---

## 📸 Screenshots

> _Add screenshots of your application below._

| Page           | Preview                               |
| -------------- | ------------------------------------- |
| **Login**      | ![Login](./screenshots/login.png)     |
| **Register**   | ![Register](./screenshots/register.png) |
| **Dashboard**  | ![Dashboard](./screenshots/dashboard.png) |
| **Task List**  | ![Task List](./screenshots/tasklist.png) |

> 💡 **Tip:** Create a `screenshots/` folder in the project root and add your images there.

---

## 🔮 Future Improvements

- [ ] **Due dates & reminders** — Add deadline tracking with notification support
- [ ] **Drag-and-drop ordering** — Reorder tasks with intuitive drag-and-drop
- [ ] **Real-time sync** — Leverage Supabase Realtime for live updates across devices
- [ ] **Dark mode** — System-aware theme toggle
- [ ] **OAuth providers** — Google, GitHub login via Supabase Auth
- [ ] **Task sharing** — Collaborate on tasks with other users
- [ ] **Search functionality** — Full-text search across tasks and categories
- [ ] **Export/Import** — Export tasks as CSV or JSON

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Built with ❤️ using React & Supabase
</p>
