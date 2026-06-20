# Security Audit

## Authentication & Authorization
- **Authentication**: Fully managed by Clerk. Passwords, OTPs, and OAuth flows are not processed directly by our servers.
- **Authorization**: Protected routes (`/workspace`, `/settings`) are secured at the Edge via `src/middleware.ts`, preventing unauthenticated users from ever downloading the code for private pages.

## Database Security (Prisma + Supabase)
- **Direct DB Access**: Because we use React Server Components and Server Actions, the database connection (`Convoke_PRISMA_DATABASE_URL`) is never exposed to the client.
- **SQL Injection**: Prisma ORM inherently prevents SQL injection by utilizing parameterized queries for all data access.
- **Row Level Security (RLS)**: Currently, RLS on Supabase is not fully utilized because Prisma connects as the authenticated `postgres` role via connection string. Application-level authorization checks inside Server Actions must enforce data ownership (e.g., verifying `session.userId === project.userId` before deletion).

## Cross-Site Scripting (XSS)
- React inherently escapes all string variables in JSX, neutralizing standard XSS vectors. 
- *Risk*: Usage of `dangerouslySetInnerHTML` is strictly prohibited unless parsing sanitized Markdown.

## Webhooks
- The `/api/webhooks/clerk` endpoint uses `svix` to cryptographically verify incoming requests. This ensures malicious actors cannot spoof Clerk lifecycle events to elevate privileges or create phantom users.

## Secrets Management
- All secrets are injected securely via Vercel Environment Variables. Local dev relies on a non-committed `.env` file.
