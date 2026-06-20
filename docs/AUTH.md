# Authentication Architecture

## Overview
Convoke uses **Clerk** for seamless, secure edge-authentication, bypassing the need to manage passwords or complex session token cycling manually.

## Core Flow
1. **Middleware**: `src/middleware.ts` intercepts all requests.
   - Public routes (`/`, `/explore`, `/login`, `/api/webhooks/clerk`) are bypassed.
   - Protected routes (`/workspace`, `/settings`) enforce authentication, redirecting unauthenticated users to `/login`.
2. **Provider**: The entire app is wrapped in `<ClerkProvider>` within `src/app/layout.tsx`.
3. **Components**: Clerk's drop-in `<SignIn />` component handles OAuth and Email Magic Links natively.

## Database Synchronization
Because Clerk stores user identities on their servers, Convoke must synchronize this data with its own Supabase PostgreSQL database to maintain referential integrity (so Users can own Projects, attend Events, etc).

- **Webhook Endpoint**: `/api/webhooks/clerk/route.ts`
- **Trigger**: Listens for `user.created` and `user.updated` events from Clerk.
- **Action**: Uses the Prisma client to `upsert` the user into the Supabase database.
- **Security**: The webhook verifies the `svix-id`, `svix-timestamp`, and `svix-signature` headers against the `WEBHOOK_SECRET` environment variable to ensure requests actually originated from Clerk.

## Role System
Currently, roles are defined via a string column (`role`) on the User table and via the `Membership` join table for Organizational roles (`ADMIN`, `MEMBER`). Deep RBAC (Role-Based Access Control) has not yet been implemented at the middleware level.
