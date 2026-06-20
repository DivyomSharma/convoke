# Known Technical Debt

**Source of Truth Version:** 1.0.0

## 1. Database Migrations vs Push
- **Issue:** Deployment relies on `prisma db push --accept-data-loss`.
- **Impact:** High risk of accidental data deletion in production if a schema modification is poorly vetted.
- **Fix:** Transition to `prisma migrate dev` locally and `prisma migrate deploy` in Vercel build steps before public launch.

## 2. Hardcoded Mock Data
- **Issue:** Routes like `/workspace` and `/explore` heavily rely on static mock data from `src/lib/data.ts` instead of querying the database.
- **Impact:** The application appears functional but is fundamentally disconnected from the actual backend state for these views.
- **Fix:** Implement proper Prisma queries in the RSCs for these routes.

## 3. Residual Clerk Artifacts
- **Issue:** The Prisma `User` model still contains a `clerkId` field. The `src/app/api/webhooks/clerk` directory still exists.
- **Impact:** Clutter, potential security confusion, and minor database bloat.
- **Fix:** Delete the webhook directory. Drop the `clerkId` column in the next schema migration.

## 4. Missing Error Boundaries
- **Issue:** There are no `error.tsx` or `loading.tsx` files inside `src/app`.
- **Impact:** If a database query fails in a Server Component (like `/`), the entire application will crash with an unhandled server error page.
- **Fix:** Implement granular error boundaries and suspense fallbacks.

## 5. Security of the Seed Route
- **Issue:** `/api/seed?secret=convoke123` is hardcoded.
- **Impact:** Anyone discovering this endpoint can repeatedly hit it, causing unnecessary database writes or potential DoS via exhaustive upserts.
- **Fix:** Move the secret to an environment variable (`process.env.SEED_SECRET`).
