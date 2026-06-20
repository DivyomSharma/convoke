# Authentication Architecture

**Source of Truth Version:** 1.0.0

## 1. Provider System
Convoke utilizes **Supabase Auth** as the sole identity provider. Previously, the application relied on Clerk, but has fully migrated to a Supabase-native SSR flow to ensure users exist within the same unified PostgreSQL database ecosystem.

### Supported Methods
1. **OAuth2**: Google, Apple, Discord, LinkedIn.
2. **Passwordless**: Email OTP (Magic Links).

## 2. Component Flow
- **Login UI (`src/app/login/page.tsx`)**: 
  - A fully custom Client Component utilizing `@supabase/ssr` `createBrowserClient`.
  - OAuth login calls `supabase.auth.signInWithOAuth()`.
  - Email login calls `supabase.auth.signInWithOtp()`.
- **OAuth Callback (`src/app/auth/callback/route.ts`)**:
  - Intercepts redirects from Supabase after successful provider authentication.
  - Exchanges the ephemeral auth code for a secure Next.js server session via `supabase.auth.exchangeCodeForSession()`.

## 3. Session Management & Middleware
Authentication protection is handled at the edge via Next.js Middleware.

- **Middleware File**: `src/middleware.ts` delegates logic to `src/utils/supabase/middleware.ts`.
- **Session Refresh**: On every non-static request, the middleware invokes `supabase.auth.getUser()`. If the internal session is expired, Supabase automatically attempts to refresh it using the refresh token cookie, writing new cookies back to the response.
- **Route Protection**:
  - The middleware acts as a strict gatekeeper. 
  - Unauthenticated requests are immediately redirected to `/login`, unless the requested path matches an explicit public whitelist (`/`, `/login`, `/auth/callback`, `/api/seed`).
  - Authenticated users attempting to access `/login` are automatically redirected to the root workspace (`/`).

## 4. Server Actions & SSR
- To access the current user securely inside React Server Components (RSC) or Server Actions, developers must use the dedicated server utility:
  ```typescript
  import { createClient } from '@/utils/supabase/server'
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  ```

## 5. Deprecation Notice
- **Clerk Removal**: All Clerk components (`<ClerkProvider>`, `@clerk/nextjs`) have been removed. Any lingering webhooks in `/api/webhooks/clerk` are obsolete and should be scheduled for deletion.
