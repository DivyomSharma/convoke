# Convoke AI Context & Architecture Summary

**Purpose**: This document serves as the master context file for LLMs to instantly understand the Convoke codebase, architecture, and design constraints.

## 1. Product Vision & Aesthetic
- **Mission**: A highly curated, signal-rich digital campus for students, founders, creators, developers, researchers, and communities to build their future together.
- **Aesthetic**: "Timely & Timeless". Apple-level craftsmanship, Discord-level belonging, Linear-level polish.
- **UI Constraints**: Strict monochrome palette (Black/White). Typography is heavily enforced: `Inter` for standard UI, `Newsreader` (Serif) for editorial headers/numbers. Large touch targets, subtle glassmorphism, no heavy drop-shadows, sharp geometry (`rounded-sm`).

## 2. Tech Stack
- **Framework**: Next.js 16 (App Router, React Server Components).
- **Styling**: Tailwind CSS v4, `shadcn/ui` (Radix UI primitives), Framer Motion.
- **Database**: PostgreSQL hosted on Supabase.
- **ORM**: Prisma (`@prisma/client` v5.22.0).
- **Auth**: Clerk (`@clerk/nextjs`).
- **PWA**: Serwist (`@serwist/next`).
- **Deployment**: Vercel (Edge network).

## 3. Core Architecture
- **Rendering**: Default to React Server Components (RSCs) for everything. Use `"use client"` strictly at leaf nodes for interactivity.
- **Data Mutations**: Handled exclusively via Next.js Server Actions. No internal REST API routes unless necessary for webhooks.
- **Auth Sync**: Clerk handles edge auth. A webhook at `/api/webhooks/clerk` securely syncs `user.created` events into the Supabase Postgres `User` table to maintain referential integrity.
- **State Management**: Zustand (if needed for client), but heavily rely on URL state and Server State (Next.js Cache).

## 4. Database Schema (Prisma)
- **User**: The core identity (synced with Clerk).
- **Organization & Membership**: Organizations (clubs/startups) that Users join.
- **Space & Message**: Communities belonging to Organizations where Users can chat.
- **Event & EventAttendance**: Time-bound gatherings inside Spaces.
- **Opportunity & Application**: Roles, grants, or hackathons posted by Organizations.
- **Vouch, Project, Research**: Portfolio items attached to Users.
- **Activity & Notification**: System logs and user alerts.
- **Bookmark**: Polymorphic saves.

## 5. Directory Structure
```text
/
├── prisma/schema.prisma      # Source of truth for DB
├── src/app/                  # Next.js Routes
│   ├── api/webhooks/clerk/   # DB Sync
│   ├── explore/              # Global feed
│   ├── opportunities/        # Job/Grant board
│   ├── profile/[handle]/     # Public portfolio
│   ├── spaces/               # Communities
│   ├── workspace/            # Authenticated dashboard
│   ├── layout.tsx            # ClerkProvider & Root
│   └── page.tsx              # Minimal Landing Page
├── src/components/ui/        # shadcn components
└── src/lib/utils.ts          # Tailwind cn() merger
```

## 6. Coding Guidelines for AI
1. **Never write legacy code**: Use Next.js App Router conventions (RSCs, Server Actions, `next/image`, `next/link`).
2. **Never hallucinate styles**: Adhere strictly to the monochrome, Inter/Newsreader typographic hierarchy. Use `cn()` for merging classes.
3. **Database operations**: Always use the Prisma client inside Server Actions or Server Components. Never expose `Convoke_PRISMA_DATABASE_URL` to the client.
4. **Security**: Validate `session.userId` in all Server Actions before performing `UPDATE` or `DELETE` mutations.
5. **Performance**: Avoid `useEffect` fetching. Fetch data on the server and pass it as props to client components.
