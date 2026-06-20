# Pages Documentation

This document breaks down the purpose, rendering strategy, and UX flow of every route in the Convoke Next.js application.

## 1. Landing Page (`/`)
- **Purpose**: High-impact marketing landing page.
- **Components**: Static HTML elements, Lucide icons.
- **Rendering**: Static Site Generation (SSG).
- **UX Flow**: Clean introduction -> Call to Action (`Start Exploring` or `Log in`).
- **Future Improvements**: Add dynamic counters for real-time social proof (e.g., active builders).

## 2. Explore (`/explore`)
- **Purpose**: The global feed of activity across Convoke. High-signal stream.
- **Components**: `Avatar` primitives, semantic HTML articles.
- **Rendering**: React Server Component (RSC).
- **Data Sources**: Will query `Activity`, `Event`, `Opportunity`, and `Vouch` tables.
- **UX Flow**: Filter pills -> Scrollable feed -> Click to expand item.
- **Missing Features**: Implement infinite scroll and React Suspense boundaries for loading states.

## 3. Opportunities (`/opportunities`)
- **Purpose**: Curated board for roles, grants, fellowships, and hackathons.
- **Components**: Custom list views, tag chips.
- **Rendering**: RSC.
- **Data Sources**: `Opportunity` table joined with `Organization`.
- **UX Flow**: Search/Filter -> View detail -> Apply.

## 4. Spaces (`/spaces`)
- **Purpose**: Directory of active communities and organizations.
- **Rendering**: RSC.
- **Data Sources**: `Space` and `Organization` tables.
- **Missing Features**: Need an authenticated "My Spaces" view vs "Discover Spaces" view.

## 5. Profile (`/profile`)
- **Purpose**: The public-facing portfolio for users.
- **Rendering**: RSC with dynamic params (`/profile/[handle]`).
- **Data Sources**: `User`, `Project`, `Research`, `Vouch` tables.
- **UX Flow**: View bio -> View projects -> Read vouches.
- **SEO**: Needs dynamic OpenGraph image generation based on user data.

## 6. Workspace (`/workspace`)
- **Purpose**: The private, authenticated dashboard for managing the user's Convoke presence.
- **Rendering**: RSC, protected by Clerk Middleware.
- **Data Sources**: All user-related tables (`Application`, `Membership`, `EventAttendance`).
- **UX Flow**: Dashboard overview -> Tabbed navigation for specific management (Settings, Applications, etc).

## 7. Login (`/login`)
- **Purpose**: Authentication portal.
- **Components**: Clerk `<SignIn />` and `<SignUp />` components.
- **Rendering**: Client Component (`"use client"`).
- **UX Flow**: Social Auth / Magic Link -> Redirect to `/workspace`.

## 8. Webhooks (`/api/webhooks/clerk`)
- **Purpose**: Headless API route for keeping Supabase perfectly synced with Clerk auth state.
- **Rendering**: API Route Handler.
- **Data Sources**: Prisma `User` table mutations.
- **Security**: Validated using `svix` to verify Clerk signatures.
