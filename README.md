# ProManage — Project Management Dashboard

[https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black]
[https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white]
[https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white]
[https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white]

A modern, responsive **Project Management Dashboard** built with **React**, **TypeScript**, **Tailwind CSS 4**, and **Supabase**. Designed to help teams track projects, manage tasks, and organize team members from one clean interface.

## Live Demo

- **Live App:** [https://promanage-dashboard-4pdl.vercel.app/]
- **Demo Credentials:**
  - **Email:** `nouhaila@promanage.com`
  - **Password:** `promanage123`

## Preview

> Add a screenshot of your dashboard here (you can drag and drop an image directly into the GitHub README editor).

## Features

- **Pre-filled Demo Login & Logout**: One-click demo authentication persisted with `localStorage`.
- **Live Overview Dashboard**: Real-time summary cards, recent projects, recent tasks, and team preview fetched in parallel using `Promise.all`.
- **Full CRUD Operations**: Create, read, update, delete, search, and filter **Projects**, **Tasks**, and **Team Members** backed by Supabase.
- **Interactive Header & Sidebar**: Notifications dropdown, user profile menu, and responsive mobile drawer.
- **Profile Synchronization**: Updates in Settings immediately reflect in the Sidebar via React state management.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS 4, Lucide React
- **Routing:** React Router DOM
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Project Structure

```text
src/
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── StatsCards.tsx
│   ├── RecentProjects.tsx
│   ├── RecentTasks.tsx
│   └── TeamMembers.tsx
├── page/
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Projects.tsx
│   ├── Tasks.tsx
│   ├── Team.tsx
│   └── Settings.tsx
├── supabaseClient.ts
└── App.tsx
