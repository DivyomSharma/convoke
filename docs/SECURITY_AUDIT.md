# Security Audit

**Score: 8/10**

## 1. Edge Middleware Protection
- **Current State:** The default-deny allowlist in `src/middleware.ts` is extremely robust.
- **Problems:** The regex matcher in the middleware allows `.webp` and `.jpg` through without auth. If users eventually upload private documents or restricted images to Supabase Storage, and those URLs are exposed, the middleware will not protect them.
- **Severity:** Low.
- **Recommendation:** Rely on Supabase Row Level Security (RLS) policies on Storage buckets rather than Next.js middleware for binary asset protection.
- **Priority:** Low.
- **Estimated Effort:** 1 Day.

## 2. Database Protection (RLS)
- **Current State:** Prisma connects directly via the connection pool using a super-admin style connection string.
- **Problems:** Row Level Security (RLS) is not being utilized at the database level because Prisma inherently bypasses it when querying from the server. If a Server Action is poorly written, user A could theoretically edit user B's profile.
- **Severity:** High.
- **Recommendation:** Ensure every single Prisma update/delete call in Server Actions explicitly includes `where: { userId: currentUser.id }` to prevent IDOR (Insecure Direct Object Reference) vulnerabilities.
- **Priority:** Critical.
- **Estimated Effort:** 2 Days.

## 3. Seed Endpoint Vulnerability
- **Current State:** `/api/seed?secret=convoke123`
- **Problems:** Hardcoded secrets in version control are a critical violation.
- **Severity:** Critical.
- **Recommendation:** Replace `convoke123` with `process.env.SEED_SECRET` immediately.
- **Priority:** Critical.
- **Estimated Effort:** 10 Minutes.
