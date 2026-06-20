# Architecture

**Source of Truth Version:** 1.0.0

## 1. System Overview
Convoke is a full-stack Next.js application utilizing the App Router architecture. It operates as a server-rendered monolith that directly queries a PostgreSQL database via Prisma, completely bypassing traditional REST APIs for internal data fetching.

## 2. Infrastructure Diagram
- **Frontend & Backend Compute**: Vercel (Next.js Edge/Serverless Functions).
- **Database**: PostgreSQL (managed via Supabase or independent Postgres provider).
- **ORM**: Prisma (synchronization runs automatically on deployment via `postinstall` hook).
- **Authentication**: Supabase Auth (OAuth + Magic Links).
- **PWA / Caching**: Serwist (Service Worker intercepting client-side navigation and caching assets).

## 3. Data Flow Pattern
Convoke uses the **React Server Component (RSC)** data fetching pattern:
1. **Server Component**: A page (e.g., `src/app/page.tsx`) marks itself as `async`.
2. **Database Query**: It invokes Prisma directly (`await prisma.event.findMany()`).
3. **Rendering**: The server renders the HTML and non-interactive UI elements.
4. **Client Hydration**: Client components (marked with `"use client"`) receive data as props and handle interactivity (e.g., filtering on `/explore`).

## 4. Directory Structure
```text
/prisma
  ├── schema.prisma      # DB schema and relations
  └── seed.ts            # Local seeding logic
/public
  ├── manifest.json      # PWA config
  └── sw.js              # Compiled service worker
/src
  ├── app/               # App Router pages and API routes
  ├── components/        # React components (Shell, UI primitives)
  ├── lib/               # Shared utilities (prisma client, mock data, cn)
  └── utils/             # Complex abstractions (Supabase clients, middleware)
```

## 5. Middleware Architecture
Authentication and route protection is centralized in `src/middleware.ts`.
- **Match Criteria**: Executes on all requests except static assets and Next.js internals.
- **Session Refresh**: It delegates to `src/utils/supabase/middleware.ts` to execute `supabase.auth.getUser()`. This refreshes the access token if expired.
- **Access Control**: Unauthenticated users are redirected to `/login` unless the path explicitly matches a whitelist (`/`, `/api/seed`, `/login`, `/auth/callback`).

## 6. Deployment Pipeline
The application relies on standard Next.js build steps, augmented by Prisma.
- `package.json` contains a `postinstall` script: `prisma generate && prisma db push --accept-data-loss`.
- During Vercel deployments, immediately after installing dependencies, Prisma synchronizes the remote database schema with `schema.prisma`. 
- **Warning**: This accepts data loss. Modifying column types or deleting columns in production will forcefully wipe that data during deployment.
