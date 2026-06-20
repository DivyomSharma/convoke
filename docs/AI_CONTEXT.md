# Convoke: AI Context & System Prompt

**Source of Truth Version:** 1.0.0
**Last Updated:** June 20, 2026

## 1. Project Identity
Convoke is a professional networking and community platform designed as an "editorial feed" for ambitious people. It aggregates events, communities (Spaces), opportunities (Roles, Grants, Fellowships), and projects into a highly curated, immersive experience.

The core aesthetic is strict **Monochrome Editorial**: Pure ink, paper backgrounds, and calibrated grays. No gradients, no glows, no vibrant brand colors outside of absolute necessity (e.g., standard provider logos).

## 2. Technical Stack
- **Framework:** Next.js (App Router, v16.2.9)
- **Language:** TypeScript 5 (Strict Mode)
- **Database:** PostgreSQL via Prisma ORM (v5.22.0)
- **Authentication:** Supabase Auth (SSR via `@supabase/ssr`)
- **Styling:** Tailwind CSS v4 (Inline `@theme` configuration)
- **UI Library:** `@base-ui/react` (Headless) + Custom internal components
- **PWA:** Serwist
- **Animations:** Framer Motion

## 3. Core Directives for AI Agents
When modifying or adding to the Convoke codebase, adhere strictly to these rules:

1. **Monochrome Adherence:** Do not introduce new colors. Utilize `--paper`, `--ink`, and the `--g1` through `--g6` gray scale.
2. **Server-First Data Fetching:** Utilize React Server Components (RSC) by default. Fetch data directly via Prisma in the server component. Only use `"use client"` when state, effects, or browser APIs are required (e.g., filtering, auth flows).
3. **No Standalone API Routes for Data:** Do not build `/api/v1/...` routes just for fetching data for a page. Fetch directly in the RSC. API routes are strictly for external webhooks (e.g., Clerk sync) or specific remote actions (e.g., `/api/seed`).
4. **Auth Abstraction:** Authentication relies entirely on Supabase. Use `@/utils/supabase/server` for RSC/Server Actions and `@/utils/supabase/client` for Client Components.
5. **Class Management:** Always merge classes using the `cn()` utility (`clsx` + `tailwind-merge`) from `src/lib/utils.ts`.
6. **No Placeholder Styles:** Designs must be pixel-perfect matching the editorial constraints. Use `hairline` utility classes for 1px borders instead of generic border classes.

## 4. Known File Paths
- **Global CSS & Theme:** `src/app/globals.css`
- **Database Schema:** `prisma/schema.prisma`
- **Middleware (Auth):** `src/middleware.ts` & `src/utils/supabase/middleware.ts`
- **Root Layout:** `src/app/layout.tsx`
- **Main Shell (Nav/Footer):** `src/components/Shell.tsx`
- **UI Primitives:** `src/components/ui/`
