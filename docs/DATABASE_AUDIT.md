# Database Audit

**Score: 7/10**

## 1. Schema Design
- **Current State:** The schema effectively captures the complexity of a professional network (Users, Orgs, Spaces, Events).
- **Problems:** The polymorphic `Bookmark` table (`itemType`, `itemId`) is generally considered an anti-pattern in strict SQL because it prevents the use of strong Foreign Key constraints to ensure referential integrity.
- **Severity:** Medium.
- **Recommendation:** Split `Bookmark` into `EventBookmark` and `OpportunityBookmark` to enforce strict foreign key constraints.
- **Priority:** Medium.
- **Estimated Effort:** 1 Day.

## 2. Legacy Artifacts
- **Current State:** The `User` model contains `clerkId`.
- **Problems:** The application migrated to Supabase Auth. The `clerkId` is obsolete.
- **Severity:** Low.
- **Recommendation:** Drop the `clerkId` column via `prisma migrate dev`.
- **Priority:** Low.
- **Estimated Effort:** 1 Hour.

## 3. Indexing
- **Current State:** Standard primary keys are defined.
- **Problems:** Missing compound indexes for heavy read patterns. For example, filtering `EventAttendance` by `userId` and `status` is currently unindexed, which will slow down the `/workspace` timeline rendering.
- **Severity:** Medium.
- **Recommendation:** Add `@@index([userId, status])` to the `EventAttendance` model.
- **Priority:** High.
- **Estimated Effort:** 1 Hour.

## 4. Safety & Syncing
- **Current State:** `prisma db push --accept-data-loss` in production.
- **Problems:** This is extremely dangerous. Any schema typo or restructure will silently delete production data during a Vercel build.
- **Severity:** Critical.
- **Recommendation:** Remove `db push` from `postinstall`. Implement an explicit CI/CD step utilizing `prisma migrate deploy`.
- **Priority:** Critical.
- **Estimated Effort:** 1 Day.
