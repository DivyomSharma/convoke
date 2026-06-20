# Routes Architecture

**Source of Truth Version:** 1.0.0

## 1. Next.js App Router Structure
Convoke utilizes the Next.js App Router. Almost all primary routes are implemented as React Server Components (RSC) by default to execute fast, direct Prisma database queries.

## 2. Global Layout & Interception
- **`src/app/layout.tsx`**: The Root Layout. Initializes global fonts (`Inter_Tight`, `Instrument_Serif`, `JetBrains_Mono`), injects global CSS variables, sets up the `<ThemeProvider>` for dark mode, and establishes base semantic HTML (`<html lang="en">`).
- **`src/middleware.ts`**: The edge middleware. Intercepts every route (except static assets) to ensure Supabase session freshness and handle redirect logic for unauthenticated users.

## 3. Public Routes
- **`/` (Landing Page)**: Server Component. Fetches aggregate platform metrics and featured data (Events, Spaces, Opportunities) directly from Prisma. Features a heavy editorial layout.
- **`/login`**: Client Component. Split-screen authentication interface integrating Supabase OAuth and Magic Links.
- **`/api/seed`**: Server API Route. Developer/Admin endpoint to populate the production database with rich mock data. Protected by a `secret` URL parameter.
- **`/privacy` & `/terms`**: Static Client Components rendering legal documents wrapped in the global `<Shell>`.

## 4. Protected Core Application Routes
*Note: Unauthenticated requests to these routes redirect to `/login`.*

- **`/workspace`**: Server Component. The user's personalized, logged-in home base. Displays a timeline, momentum graphs, and tailored recommendations.
- **`/explore`**: Client Component. The primary global feed. Heavily interactive, utilizing client-side React state to filter aggregated content (Events, Roles, Projects).
- **`/spaces`**: Directory of all active communities within Convoke.
- **`/opportunities`**: Job board and grant directory.
- **`/messages`**: Integrated peer-to-peer and Space-based chat interface.
- **`/notifications`**: User alert inbox.
- **`/settings`**: User profile configuration and account management.

## 5. Dynamic Profile Routes
- **`/profile/[handle]`**: Server Component. Public user identity page. Uses the `[handle]` slug to fetch user data, activity heatmaps, and peer vouches.
- **`/org/[slug]`**: Server Component. Public organization page detailing active members, manifesto, and open roles.

## 6. Admin & Moderation
- **`/admin`**: Server Component. Restricted operator dashboard detailing platform vitals, trust scores, and moderation queues.

## 7. Authentication Flow Routes
- **`/auth/callback`**: Next.js API Route. Essential for Supabase. Exchanges the ephemeral authorization code from OAuth/Magic Link providers for a persistent server-side cookie session.
