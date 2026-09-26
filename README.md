# KodingUp - Content Management System

A modern, production-ready Content Management System (CMS) designed for Learning Management Systems (LMS) platforms. Built with React 19, TypeScript, Tailwind CSS v4, Radix UI, TanStack Query, and Tiptap rich text editing.

![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.103-FF4154?logo=reactquery&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?logo=vitest&logoColor=white)
![Tests Passed](https://img.shields.io/badge/Tests-54%20Passed-brightgreen?logo=vitest)

---

## Overview

**KodingUp - CMS** provides an intuitive administrative dashboard for managing online education workflows. It empowers platform admins and instructors to manage course curricula, schedule live sessions, oversee assignments, track enrolled students, and assign mentors across multi-tenant organizations.

---

## Key Features

* **Course & Curriculum Management:** Create, edit, and publish courses, sections, and modules with rich-media support.
* **Rich Text Content Editor:** Built with **Tiptap**, supporting custom styling, task lists, tables, links, and inline image uploads via ImageKit.
* **Role-Based Workflows:** Protected and guest route authorization guards handling authenticated admins, mentors, and organization leads.
* **Interactive Data Tables & Pagination:** Debounced search filtering, custom pagination, and dynamic action dropdowns for managing students, courses, live sessions, and schedules.
* **Form Validation & Management:** Complex modal forms powered by **React Hook Form** and **Zod** schema validation.
* **Asynchronous State & Caching:** Automated server-state synchronization, request caching, and optimistic UI updates powered by **TanStack Query (React Query)**.
* **Accessible UI Component System:** Built with **Radix UI** primitives and **Tailwind CSS v4** for accessible dialogs, popovers, select dropdowns, and tooltips.

---

## Tech Stack

### Frontend Core
* **Framework / Library:** React 19, React DOM 19
* **Language:** TypeScript 6
* **Build Tool:** Vite 8
* **Routing:** React Router v7

### UI & Styling
* **Styling:** Tailwind CSS v4, `@tailwindcss/vite`
* **Primitives:** Radix UI Primitives (Dialog, Dropdown Menu, Select, Popover, Tooltip, Avatar, Slot)
* **Icons:** Lucide React
* **Toast Notifications:** Sonner
* **Rich Text Editor:** Tiptap Editor Core & Extensions

### State Management & Forms
* **Server State & Caching:** TanStack Query v5 (React Query)
* **Form Logic:** React Hook Form
* **Schema Validation:** Zod
* **HTTP & Media Uploads:** Firebase, ImageKit integration

### Testing & Quality Assurance
* **Test Runner:** Vitest v5
* **Testing Libraries:** React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom`, jsdom
* **Linting & Formatting:** ESLint 10, Prettier (`prettier-plugin-tailwindcss`)
* **Package Manager:** pnpm

---

## Project Architecture

```text
src/
├── assets/             # Static assets and images
├── components/         # Reusable UI primitives, tables, modals, & icons
├── configs/            # Third-party configurations (Firebase, ImageKit)
├── constants/          # App constants, pagination defaults, & course statuses
├── hooks/              # Feature-based custom hooks (assignments, courses, mentors, etc.)
├── layouts/            # Route layouts (DashboardLayout, AuthLayout)
├── lib/                # Utility functions and shared helper libraries
├── pages/              # Domain-driven feature pages
│   ├── Assignment/
│   ├── Auth/
│   ├── Course/
│   ├── Mentor/
│   ├── OrganizationsPage/
│   ├── SchedulePage/
│   └── StudentsPage/
├── providers/          # Top-level context providers (QueryProvider)
├── routes/             # Route configurations & auth guards (ProtectedRoute, GuestRoute)
├── schemas/            # Zod validation schemas for forms
├── services/           # HTTP services & API service modules
├── testing/            # Test setup, mock data, and test utilities
├── types/              # Global TypeScript interfaces and domain models
├── App.tsx             # Main application entry point
└── main.tsx            # DOM rendering entry point
